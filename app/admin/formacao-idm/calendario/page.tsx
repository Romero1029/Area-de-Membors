import { getFormacaoLivesAdmin } from "@/lib/queries";
import { LivesAdminClient } from "./LivesAdminClient";

export const dynamic = "force-dynamic";

export default async function FormacaoCalendarioAdminPage() {
  const lives = await getFormacaoLivesAdmin();
  return <LivesAdminClient lives={lives} />;
}
