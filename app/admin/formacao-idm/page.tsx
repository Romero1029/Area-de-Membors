import { getFormacaoModules, getTurmas, getTurmaModuleReleases } from "@/lib/queries";
import { AdminFormacaoClient } from "./AdminFormacaoClient";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: { turma?: string };
}

export default async function AdminFormacaoPage({ searchParams }: PageProps) {
  const [modules, turmas] = await Promise.all([getFormacaoModules(), getTurmas()]);

  const selectedTurmaId = searchParams.turma ?? turmas[0]?.id ?? "";
  const releases = selectedTurmaId ? await getTurmaModuleReleases(selectedTurmaId) : {};

  return (
    <AdminFormacaoClient
      modules={modules}
      turmas={turmas}
      selectedTurmaId={selectedTurmaId}
      releases={releases}
    />
  );
}
