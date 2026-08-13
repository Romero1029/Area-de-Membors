import { getTaskSubmissions, getFormacaoTasksAdmin } from "@/lib/queries";
import { notFound } from "next/navigation";
import { SubmissionsReviewClient } from "./SubmissionsReviewClient";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { taskId: string };
}

export default async function TaskSubmissionsPage({ params }: PageProps) {
  const [submissions, tasks] = await Promise.all([
    getTaskSubmissions(params.taskId),
    getFormacaoTasksAdmin(),
  ]);
  const task = tasks.find((t) => t.id === params.taskId);
  if (!task) notFound();

  return <SubmissionsReviewClient task={task} submissions={submissions} />;
}
