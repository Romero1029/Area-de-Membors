import { getAllUsers } from "@/lib/queries";
import { AlunosClient } from "./AlunosClient";

export const dynamic = "force-dynamic";

export default async function AlunosPage() {
  const users = await getAllUsers();
  return <AlunosClient users={users} />;
}
