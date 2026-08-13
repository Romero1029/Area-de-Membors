import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { NpaPresencialAdminClient } from "./NpaPresencialAdminClient";

export const dynamic = "force-dynamic";

export default async function NpaPresencialAdminPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if ((session.user as any)?.role !== "admin") redirect("/dashboard");

  return <NpaPresencialAdminClient />;
}
