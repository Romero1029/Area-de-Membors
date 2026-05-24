import { getSession } from "@/lib/auth";
import { getAllCourses } from "@/lib/queries";
import { redirect } from "next/navigation";
import { PerfilClient } from "./PerfilClient";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const [session, courses] = await Promise.all([getSession(), getAllCourses()]);

  if (!session) redirect("/login");

  const user = session.user!;
  const isAdmin = (user as any).role === "ADMIN";

  return <PerfilClient user={user as any} courses={courses} isAdmin={isAdmin} />;
}
