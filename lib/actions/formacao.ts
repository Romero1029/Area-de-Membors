"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin, getSession } from "@/lib/auth";
import { FORMACAO_PRODUCT_ID } from "@/lib/constants";
import type { ActionResult } from "@/lib/actions/courses";
import { gradeSubmission } from "@/lib/ai/grading";

const PATH = "/admin/formacao-idm";

// ── MODULES ──────────────────────────────────────────────

const ModuleSchema = z.object({
  title: z.string().min(2, "Título muito curto"),
  description: z.string().default(""),
  released: z.boolean().default(false),
  releaseAt: z.string().nullable().default(null), // ISO string ou null
});

export type FormacaoModuleInput = z.infer<typeof ModuleSchema>;

export async function createFormacaoModule(input: { title: string }): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };
  if (!input.title.trim()) return { ok: false, error: "Título inválido" };

  const supabase = await createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("modules")
    .select("sort_order")
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const order = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("modules")
    .insert({ title: input.title.trim(), product_id: FORMACAO_PRODUCT_ID, sort_order: order, released: false })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Falha ao criar módulo" };

  revalidatePath(PATH);
  return { ok: true, data: { id: data.id } };
}

export async function updateFormacaoModule(id: string, input: Partial<FormacaoModuleInput>): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.released !== undefined) patch.released = input.released;
  if (input.releaseAt !== undefined) patch.release_at = input.releaseAt;

  const { error } = await supabase.from("modules").update(patch).eq("id", id).eq("product_id", FORMACAO_PRODUCT_ID);
  if (error) return { ok: false, error: "Falha ao atualizar módulo" };

  revalidatePath(PATH);
  revalidatePath("/formacao");
  return { ok: true, data: undefined };
}

export async function deleteFormacaoModule(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("modules").delete().eq("id", id).eq("product_id", FORMACAO_PRODUCT_ID);
  if (error) return { ok: false, error: "Falha ao excluir módulo" };

  revalidatePath(PATH);
  return { ok: true, data: undefined };
}

export async function reorderFormacaoModules(moduleIds: string[]): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  await Promise.all(
    moduleIds.map((id, index) => supabase.from("modules").update({ sort_order: index }).eq("id", id))
  );

  revalidatePath(PATH);
  return { ok: true, data: undefined };
}

// ── LESSONS ──────────────────────────────────────────────

const LessonSchema = z.object({
  title: z.string().min(2),
  description: z.string().default(""),
  lessonType: z.enum(["video", "text", "file"]).default("video"),
  videoUrl: z.string().default(""),
  fileUrl: z.string().default(""),
  content: z.string().default(""),
  videoDuration: z.coerce.number().min(0).default(0),
  isFreePreview: z.boolean().default(false),
});

export type FormacaoLessonInput = z.infer<typeof LessonSchema>;

function lessonInputToRow(input: Partial<FormacaoLessonInput>) {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.description !== undefined) row.description = input.description;
  if (input.lessonType !== undefined) row.lesson_type = input.lessonType;
  if (input.videoUrl !== undefined) row.video_url = input.videoUrl;
  if (input.fileUrl !== undefined) row.file_url = input.fileUrl;
  if (input.content !== undefined) row.content = input.content;
  if (input.videoDuration !== undefined) row.video_duration = input.videoDuration;
  if (input.isFreePreview !== undefined) row.is_free_preview = input.isFreePreview;
  return row;
}

export async function createFormacaoLesson(
  moduleId: string,
  input: FormacaoLessonInput
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = LessonSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("lessons")
    .select("sort_order")
    .eq("module_id", moduleId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const order = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("lessons")
    .insert({ ...lessonInputToRow(parsed.data), module_id: moduleId, sort_order: order })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Falha ao criar aula" };

  revalidatePath(PATH);
  return { ok: true, data: { id: data.id } };
}

export async function updateFormacaoLesson(id: string, input: Partial<FormacaoLessonInput>): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lessons").update(lessonInputToRow(input)).eq("id", id);
  if (error) return { ok: false, error: "Falha ao atualizar aula" };

  revalidatePath(PATH);
  revalidatePath("/formacao");
  return { ok: true, data: undefined };
}

export async function deleteFormacaoLesson(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { ok: false, error: "Falha ao excluir aula" };

  revalidatePath(PATH);
  return { ok: true, data: undefined };
}

export async function reorderFormacaoLessons(lessonIds: string[]): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  await Promise.all(
    lessonIds.map((id, index) => supabase.from("lessons").update({ sort_order: index }).eq("id", id))
  );

  revalidatePath(PATH);
  return { ok: true, data: undefined };
}

// ── MATERIALS (arquivos complementares) ─────────────────

const MaterialSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["pdf", "link", "image", "video"]).default("pdf"),
  url: z.string().min(1),
  moduleId: z.string().nullable().default(null),
  lessonId: z.string().nullable().default(null),
});

export type MaterialInput = z.infer<typeof MaterialSchema>;

export async function createMaterial(input: MaterialInput): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = MaterialSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("materials")
    .insert({
      title: parsed.data.title,
      type: parsed.data.type,
      url: parsed.data.url,
      module_id: parsed.data.moduleId,
      lesson_id: parsed.data.lessonId,
      product_id: FORMACAO_PRODUCT_ID,
      sort_order: 0,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Falha ao adicionar material" };

  revalidatePath(PATH);
  revalidatePath("/formacao");
  return { ok: true, data: { id: data.id } };
}

// ── TURMAS ───────────────────────────────────────────────

const TurmaSchema = z.object({
  code: z.string().min(1, "Código da turma obrigatório"),
  name: z.string().default(""),
  startDate: z.string().nullable().default(null), // YYYY-MM-DD ou null
});

export async function createTurma(input: z.infer<typeof TurmaSchema>): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = TurmaSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createServerSupabaseClient();
  const { data: turma, error } = await supabase
    .from("turmas")
    .insert({
      product_id: FORMACAO_PRODUCT_ID,
      code: parsed.data.code.trim(),
      name: parsed.data.name || `Turma ${parsed.data.code.trim()}`,
      start_date: parsed.data.startDate,
    })
    .select("id")
    .single();

  if (error || !turma) return { ok: false, error: "Falha ao criar turma (código já existe?)" };

  // Cria a linha de liberação (bloqueada) pra cada módulo já existente da Formação.
  const { data: modules } = await supabase.from("modules").select("id").eq("product_id", FORMACAO_PRODUCT_ID);
  if (modules && modules.length > 0) {
    await supabase
      .from("turma_module_releases")
      .insert(modules.map((m) => ({ turma_id: turma.id, module_id: m.id, released: false })));
  }

  revalidatePath(PATH);
  return { ok: true, data: { id: turma.id } };
}

export async function updateTurmaModuleRelease(
  turmaId: string,
  moduleId: string,
  input: { released?: boolean; releaseAt?: string | null }
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (input.released !== undefined) patch.released = input.released;
  if (input.releaseAt !== undefined) patch.release_at = input.releaseAt;

  const { error } = await supabase
    .from("turma_module_releases")
    .upsert({ turma_id: turmaId, module_id: moduleId, ...patch }, { onConflict: "turma_id,module_id" });

  if (error) return { ok: false, error: "Falha ao atualizar liberação" };

  revalidatePath(PATH);
  revalidatePath("/formacao");
  return { ok: true, data: undefined };
}

export async function enrollStudentInTurma(userId: string, turmaId: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("enrollments")
    .upsert(
      { user_id: userId, product_id: FORMACAO_PRODUCT_ID, turma_id: turmaId, is_active: true },
      { onConflict: "user_id,product_id" }
    );

  if (error) return { ok: false, error: "Falha ao matricular aluno" };

  revalidatePath("/admin/alunos");
  return { ok: true, data: undefined };
}

// ── TASKS ────────────────────────────────────────────────

const TaskSchema = z.object({
  title: z.string().min(2),
  instructions: z.string().min(5),
  rubric: z.string().default(""),
  moduleId: z.string(),
  lessonId: z.string().nullable().default(null),
  dueAt: z.string().nullable().default(null), // ISO ou null
  published: z.boolean().default(true),
});

export type TaskInput = z.infer<typeof TaskSchema>;

export async function createTask(input: TaskInput): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = TaskSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: parsed.data.title,
      description: parsed.data.instructions,
      rubric: parsed.data.rubric,
      module_id: parsed.data.moduleId,
      lesson_id: parsed.data.lessonId,
      due_at: parsed.data.dueAt,
      product_id: FORMACAO_PRODUCT_ID,
      task_type: "text",
      is_required: parsed.data.published,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Falha ao criar tarefa" };

  revalidatePath("/admin/formacao-idm/tarefas");
  return { ok: true, data: { id: data.id } };
}

export async function updateTask(id: string, input: Partial<TaskInput>): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.instructions !== undefined) patch.description = input.instructions;
  if (input.rubric !== undefined) patch.rubric = input.rubric;
  if (input.dueAt !== undefined) patch.due_at = input.dueAt;
  if (input.published !== undefined) patch.is_required = input.published;

  const { error } = await supabase.from("tasks").update(patch).eq("id", id);
  if (error) return { ok: false, error: "Falha ao atualizar tarefa" };

  revalidatePath("/admin/formacao-idm/tarefas");
  return { ok: true, data: undefined };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) return { ok: false, error: "Falha ao excluir tarefa" };

  revalidatePath("/admin/formacao-idm/tarefas");
  return { ok: true, data: undefined };
}

// ── SUBMISSIONS + CORREÇÃO POR IA ──────────────────────────

export async function submitTask(taskId: string, answer: string): Promise<ActionResult<{ submissionId: string }>> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Não autorizado" };
  if (!answer.trim()) return { ok: false, error: "Resposta vazia" };

  const supabase = await createServerSupabaseClient();

  const { data: task } = await supabase
    .from("tasks")
    .select("id, title, description, rubric, module_id, lesson_id")
    .eq("id", taskId)
    .single();
  if (!task) return { ok: false, error: "Tarefa não encontrada" };

  const [{ data: mod }, { data: lesson }] = await Promise.all([
    supabase.from("modules").select("title").eq("id", task.module_id).maybeSingle(),
    task.lesson_id
      ? supabase.from("lessons").select("description, content").eq("id", task.lesson_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  const { data: submission, error: subError } = await supabase
    .from("task_submissions")
    .upsert(
      { task_id: taskId, user_id: session.user.id, answer, status: "submitted" },
      { onConflict: "task_id,user_id" }
    )
    .select("id")
    .single();

  if (subError || !submission) return { ok: false, error: "Falha ao enviar resposta" };

  // Correção por IA — se falhar, a submissão já está salva; admin pode tentar de novo.
  try {
    const grade = await gradeSubmission({
      taskTitle: task.title,
      taskInstructions: task.description ?? "",
      rubric: task.rubric ?? "",
      lessonContent: [lesson?.description, lesson?.content].filter(Boolean).join("\n\n"),
      moduleTitle: mod?.title ?? "",
      studentAnswer: answer,
    });

    await supabase.from("grades").upsert(
      {
        submission_id: submission.id,
        ai_score: grade.score,
        ai_feedback: grade.feedback,
        published: false,
      },
      { onConflict: "submission_id" }
    );
    await supabase.from("task_submissions").update({ status: "submitted" }).eq("id", submission.id);
  } catch {
    // segue sem nota da IA — admin corrige manualmente ou tenta regenerar
  }

  revalidatePath("/formacao");
  revalidatePath("/admin/formacao-idm/tarefas");
  return { ok: true, data: { submissionId: submission.id } };
}

export async function reviewGrade(
  gradeId: string,
  input: { finalScore: number; finalFeedback: string; publish: boolean }
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const session = await getSession();
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("grades")
    .update({
      final_score: input.finalScore,
      final_feedback: input.finalFeedback,
      reviewed_by: session?.user.id,
      published: input.publish,
    })
    .eq("id", gradeId);

  if (error) return { ok: false, error: "Falha ao publicar nota" };

  revalidatePath("/admin/formacao-idm/tarefas");
  revalidatePath("/perfil");
  return { ok: true, data: undefined };
}

// ── AULAS AO VIVO (link do Meet) ────────────────────────

const LiveSchema = z.object({
  title: z.string().min(2),
  dateLabel: z.string().default(""),
  timeLabel: z.string().default(""),
  joinUrl: z.string().default(""),
  isActive: z.boolean().default(true),
});

export type LiveInput = z.infer<typeof LiveSchema>;

export async function createLive(input: LiveInput): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = LiveSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("lives")
    .insert({
      title: parsed.data.title,
      date_label: parsed.data.dateLabel,
      time_label: parsed.data.timeLabel,
      join_url: parsed.data.joinUrl,
      is_active: parsed.data.isActive,
      product_id: FORMACAO_PRODUCT_ID,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Falha ao criar aula ao vivo" };

  revalidatePath(PATH);
  revalidatePath("/formacao/calendario");
  return { ok: true, data: { id: data.id } };
}

export async function updateLive(id: string, input: Partial<LiveInput>): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.dateLabel !== undefined) patch.date_label = input.dateLabel;
  if (input.timeLabel !== undefined) patch.time_label = input.timeLabel;
  if (input.joinUrl !== undefined) patch.join_url = input.joinUrl;
  if (input.isActive !== undefined) patch.is_active = input.isActive;

  const { error } = await supabase.from("lives").update(patch).eq("id", id).eq("product_id", FORMACAO_PRODUCT_ID);
  if (error) return { ok: false, error: "Falha ao atualizar aula ao vivo" };

  revalidatePath(PATH);
  revalidatePath("/formacao/calendario");
  return { ok: true, data: undefined };
}

export async function deleteLive(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lives").delete().eq("id", id).eq("product_id", FORMACAO_PRODUCT_ID);
  if (error) return { ok: false, error: "Falha ao excluir aula ao vivo" };

  revalidatePath(PATH);
  revalidatePath("/formacao/calendario");
  return { ok: true, data: undefined };
}

export async function deleteMaterial(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("materials").delete().eq("id", id);
  if (error) return { ok: false, error: "Falha ao excluir material" };

  revalidatePath(PATH);
  revalidatePath("/formacao");
  return { ok: true, data: undefined };
}
