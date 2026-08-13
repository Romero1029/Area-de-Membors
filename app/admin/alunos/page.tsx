import { getUsersPage, getTurmas } from "@/lib/queries";
import { AlunosClient } from "./AlunosClient";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

interface PageProps {
  searchParams: { q?: string; page?: string };
}

export default async function AlunosPage({ searchParams }: PageProps) {
  const search = searchParams.q ?? "";
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);

  const [{ users, total }, turmas] = await Promise.all([
    getUsersPage(search, page, PAGE_SIZE),
    getTurmas(),
  ]);

  return (
    <AlunosClient
      users={users}
      total={total}
      page={page}
      pageSize={PAGE_SIZE}
      search={search}
      turmas={turmas}
    />
  );
}
