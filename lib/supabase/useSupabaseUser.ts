"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "./client";

export interface ClientUser {
  id: string;
  email: string;
  name: string;
  image: string;
  role: "admin" | "student";
}

export function useSupabaseUser() {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    async function loadUser(authUser: { id: string; email?: string | null } | null) {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role")
        .eq("id", authUser.id)
        .single();

      setUser({
        id: authUser.id,
        email: authUser.email ?? "",
        name: profile?.full_name || authUser.email?.split("@")[0] || "",
        image: profile?.avatar_url || "",
        role: (profile?.role as "admin" | "student") || "student",
      });
      setLoading(false);
    }

    supabase.auth.getUser().then(({ data }) => loadUser(data.user));

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      loadUser(session?.user ?? null);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  return { user, isAdmin: user?.role === "admin", loading };
}
