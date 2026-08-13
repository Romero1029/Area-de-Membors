import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getFormacaoModulesForStudent, isEnrolledInFormacao } from "@/lib/queries";
import { FormacaoClient } from "./FormacaoClient";

export const dynamic = "force-dynamic";

export default async function FormacaoPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [modules, enrolled] = await Promise.all([getFormacaoModulesForStudent(), isEnrolledInFormacao()]);
  const isAdmin = session.user.role === "admin";

  return <FormacaoClient modules={modules} enrolled={enrolled || isAdmin} isAdmin={isAdmin} />;
}
