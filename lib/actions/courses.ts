"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

const CourseSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  thumbnail: z.string().url("URL inválida para thumbnail"),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(true),
});

export type CourseInput = z.infer<typeof CourseSchema>;

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function slugify(title: string) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

// ── COURSES ──────────────────────────────────────────────

export async function createCourse(
  input: CourseInput
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = CourseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const supabase = await createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("products")
    .select("sort_order")
    .eq("product_type", "course")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const order = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("products")
    .insert({
      title: parsed.data.title,
      description: parsed.data.description,
      thumbnail_url: parsed.data.thumbnail,
      is_featured: parsed.data.isFeatured,
      is_published: parsed.data.published,
      product_type: "course",
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      sort_order: order,
    })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Falha ao criar curso" };

  revalidatePath("/dashboard");
  return { ok: true, data: { id: data.id } };
}

export async function updateCourse(
  id: string,
  input: Partial<CourseInput>
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.thumbnail !== undefined) patch.thumbnail_url = input.thumbnail;
  if (input.isFeatured !== undefined) patch.is_featured = input.isFeatured;
  if (input.published !== undefined) patch.is_published = input.published;

  const { error } = await supabase.from("products").update(patch).eq("id", id);
  if (error) return { ok: false, error: "Falha ao atualizar curso" };

  revalidatePath("/dashboard");
  revalidatePath(`/curso/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").delete().eq("id", id).eq("product_type", "course");
  if (error) return { ok: false, error: "Falha ao excluir curso" };

  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function toggleFeatured(id: string, featured: boolean): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();

  if (featured) {
    await supabase.from("products").update({ is_featured: false }).eq("product_type", "course").neq("id", id);
  }
  const { error } = await supabase.from("products").update({ is_featured: featured }).eq("id", id);
  if (error) return { ok: false, error: "Falha ao atualizar destaque" };

  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

// ── MODULES ──────────────────────────────────────────────

export async function createModule(
  courseId: string,
  title: string
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };
  if (!title.trim()) return { ok: false, error: "Título inválido" };

  const supabase = await createServerSupabaseClient();

  const { data: maxRow } = await supabase
    .from("modules")
    .select("sort_order")
    .eq("product_id", courseId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const order = (maxRow?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from("modules")
    .insert({ title: title.trim(), product_id: courseId, sort_order: order })
    .select("id")
    .single();

  if (error || !data) return { ok: false, error: "Falha ao criar módulo" };

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: { id: data.id } };
}

export async function updateModule(
  id: string,
  title: string,
  courseId: string
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("modules").update({ title }).eq("id", id);
  if (error) return { ok: false, error: "Falha ao atualizar módulo" };

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}

export async function deleteModule(id: string, courseId: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("modules").delete().eq("id", id);
  if (error) return { ok: false, error: "Falha ao excluir módulo" };

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}

// ── LESSONS ──────────────────────────────────────────────

const LessonSchema = z.object({
  title: z.string().min(2),
  description: z.string().default(""),
  duration: z.string().default("00:00"),
  videoUrl: z.string().default(""),
  contentType: z.enum(["youtube", "pdf", "link", "video"]).default("youtube"),
  locked: z.boolean().default(false),
});

export type LessonInput = z.infer<typeof LessonSchema>;

function durationToSeconds(duration: string): number {
  const [m = 0, s = 0] = duration.split(":").map((n) => parseInt(n, 10) || 0);
  return m * 60 + s;
}

// contentType (youtube/pdf/link/video) -> colunas reais de `lessons`
function lessonInputToRow(input: Partial<LessonInput>) {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.description !== undefined) row.description = input.description;
  if (input.duration !== undefined) row.video_duration = durationToSeconds(input.duration);
  if (input.locked !== undefined) row.is_free_preview = !input.locked;

  if (input.contentType !== undefined || input.videoUrl !== undefined) {
    const contentType = input.contentType ?? "youtube";
    const url = input.videoUrl ?? "";
    if (contentType === "pdf" || contentType === "link") {
      row.lesson_type = "file";
      row.file_url = url;
      row.video_url = null;
    } else {
      row.lesson_type = "video";
      row.video_url = url;
      row.file_url = null;
    }
  }
  return row;
}

export async function createLesson(
  moduleId: string,
  courseId: string,
  input: LessonInput
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = LessonSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

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

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: { id: data.id } };
}

export async function updateLesson(
  id: string,
  courseId: string,
  input: Partial<LessonInput>
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lessons").update(lessonInputToRow(input)).eq("id", id);
  if (error) return { ok: false, error: "Falha ao atualizar aula" };

  revalidatePath(`/curso/${courseId}`);
  revalidatePath(`/player/${courseId}`);
  return { ok: true, data: undefined };
}

export async function deleteLesson(id: string, courseId: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("lessons").delete().eq("id", id);
  if (error) return { ok: false, error: "Falha ao excluir aula" };

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}

export async function reorderModules(
  courseId: string,
  moduleIds: string[]
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  await Promise.all(
    moduleIds.map((id, index) => supabase.from("modules").update({ sort_order: index }).eq("id", id))
  );

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}

export async function reorderLessons(
  moduleId: string,
  courseId: string,
  lessonIds: string[]
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const supabase = await createServerSupabaseClient();
  await Promise.all(
    lessonIds.map((id, index) => supabase.from("lessons").update({ sort_order: index }).eq("id", id))
  );

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}
