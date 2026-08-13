import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFormacaoModulesForStudent, isEnrolledInFormacao, getModuleTasksForStudent } from "@/lib/queries";
import { FormacaoPlayerClient } from "./FormacaoPlayerClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { lessonId: string };
}

export default async function FormacaoAulaPage({ params }: PageProps) {
  const session = await getSession();
  if (!session) redirect("/login");

  const enrolled = await isEnrolledInFormacao();
  if (!enrolled && session.user.role !== "admin") redirect("/formacao");

  const modules = await getFormacaoModulesForStudent();
  const flat = modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
  );
  const index = flat.findIndex((l) => l.id === params.lessonId);

  if (index === -1) notFound();

  const tasks = await getModuleTasksForStudent(flat[index].moduleId);

  return (
    <FormacaoPlayerClient
      lesson={flat[index]}
      prevId={index > 0 ? flat[index - 1].id : null}
      nextId={index < flat.length - 1 ? flat[index + 1].id : null}
      tasks={tasks}
    />
  );
}
