"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

const CourseSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  instructor: z.string().min(2),
  instructorBio: z.string().default(""),
  instructorAvatar: z.string().default(""),
  thumbnail: z.string().url("URL inválida para thumbnail"),
  category: z.string().min(2),
  level: z.enum(["Iniciante", "Intermediário", "Avançado"]),
  duration: z.string().default(""),
  rating: z.coerce.number().min(0).max(5).default(0),
  students: z.coerce.number().min(0).default(0),
  isNew: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  published: z.boolean().default(true),
  tags: z.string().default("[]"),
});

export type CourseInput = z.infer<typeof CourseSchema>;

export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

// ── COURSES ──────────────────────────────────────────────

export async function createCourse(
  input: CourseInput
): Promise<ActionResult<{ id: string }>> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  const parsed = CourseSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const maxOrder = await prisma.course.aggregate({ _max: { order: true } });
  const order = (maxOrder._max.order ?? -1) + 1;

  const course = await prisma.course.create({
    data: { ...parsed.data, order },
  });

  revalidatePath("/dashboard");
  return { ok: true, data: { id: course.id } };
}

export async function updateCourse(
  id: string,
  input: Partial<CourseInput>
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  await prisma.course.update({
    where: { id },
    data: input,
  });

  revalidatePath("/dashboard");
  revalidatePath(`/curso/${id}`);
  return { ok: true, data: undefined };
}

export async function deleteCourse(id: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  await prisma.course.delete({ where: { id } });

  revalidatePath("/dashboard");
  return { ok: true, data: undefined };
}

export async function toggleFeatured(id: string, featured: boolean): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  // Unfeatured all others first
  if (featured) {
    await prisma.course.updateMany({ data: { isFeatured: false } });
  }

  await prisma.course.update({ where: { id }, data: { isFeatured: featured } });

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

  const maxOrder = await prisma.module.aggregate({
    where: { courseId },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  const mod = await prisma.module.create({
    data: { title: title.trim(), courseId, order },
  });

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: { id: mod.id } };
}

export async function updateModule(
  id: string,
  title: string,
  courseId: string
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  await prisma.module.update({ where: { id }, data: { title } });

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}

export async function deleteModule(id: string, courseId: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  await prisma.module.delete({ where: { id } });

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

  const maxOrder = await prisma.lesson.aggregate({
    where: { moduleId },
    _max: { order: true },
  });
  const order = (maxOrder._max.order ?? -1) + 1;

  const lesson = await prisma.lesson.create({
    data: { ...parsed.data, moduleId, order },
  });

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: { id: lesson.id } };
}

export async function updateLesson(
  id: string,
  courseId: string,
  input: Partial<LessonInput>
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  await prisma.lesson.update({ where: { id }, data: input });

  revalidatePath(`/curso/${courseId}`);
  revalidatePath(`/player/${courseId}`);
  return { ok: true, data: undefined };
}

export async function deleteLesson(id: string, courseId: string): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  await prisma.lesson.delete({ where: { id } });

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}

export async function reorderModules(
  courseId: string,
  moduleIds: string[]
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "Não autorizado" };

  await Promise.all(
    moduleIds.map((id, index) =>
      prisma.module.update({ where: { id }, data: { order: index } })
    )
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

  await Promise.all(
    lessonIds.map((id, index) =>
      prisma.lesson.update({ where: { id }, data: { order: index } })
    )
  );

  revalidatePath(`/curso/${courseId}`);
  return { ok: true, data: undefined };
}
