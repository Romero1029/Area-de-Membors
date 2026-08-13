import { createServerSupabaseClient } from "./supabase/server";

export type Session = {
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    role: "admin" | "student";
  };
};

export const getSession = async (): Promise<Session | null> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, role")
    .eq("id", user.id)
    .single();

  return {
    user: {
      id: user.id,
      email: user.email ?? "",
      name: profile?.full_name || user.email?.split("@")[0] || "",
      image: profile?.avatar_url || "",
      role: (profile?.role as "admin" | "student") || "student",
    },
  };
};

export const isAdmin = async () => {
  const session = await getSession();
  return session?.user?.role === "admin";
};
