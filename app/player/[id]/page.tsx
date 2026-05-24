import { notFound } from "next/navigation";
import { getCourseWithModules } from "@/lib/queries";
import { getSession } from "@/lib/auth";
import { PlayerClient } from "./PlayerClient";

export const dynamic = "force-dynamic";

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const [course, session] = await Promise.all([
    getCourseWithModules(params.id),
    getSession(),
  ]);

  if (!course) notFound();

  const isAdmin = (session?.user as any)?.role === "ADMIN";

  return <PlayerClient course={course} isAdmin={isAdmin} />;
}
