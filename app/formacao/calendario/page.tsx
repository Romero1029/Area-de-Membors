import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFormacaoLivesForStudent, getFormacaoDeadlinesForStudent, isEnrolledInFormacao } from "@/lib/queries";
import { CalendarioClient } from "./CalendarioClient";

export const dynamic = "force-dynamic";

export default async function FormacaoCalendarioPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const enrolled = await isEnrolledInFormacao();
  if (!enrolled && session.user.role !== "admin") redirect("/formacao");

  const [lives, deadlines] = await Promise.all([
    getFormacaoLivesForStudent(),
    getFormacaoDeadlinesForStudent(),
  ]);

  return <CalendarioClient lives={lives} deadlines={deadlines} />;
}
