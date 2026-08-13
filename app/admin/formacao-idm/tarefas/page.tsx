import { getFormacaoTasksAdmin, getFormacaoModules } from "@/lib/queries";
import { TarefasClient } from "./TarefasClient";

export const dynamic = "force-dynamic";

export default async function TarefasPage() {
  const [tasks, modules] = await Promise.all([getFormacaoTasksAdmin(), getFormacaoModules()]);

  return (
    <TarefasClient
      tasks={tasks}
      modules={modules.map((m) => ({ id: m.id, title: m.title }))}
    />
  );
}
