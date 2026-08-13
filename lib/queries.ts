import "server-only";
import { cache } from "react";
import { createServerSupabaseClient } from "./supabase/server";
import { formatDuration, extractYouTubeId, type CourseData, type ModuleData, type LessonData } from "./types";
import { FORMACAO_PRODUCT_ID } from "./constants";
export type { ModuleData, LessonData } from "./types";

export type CourseWithModules = CourseData;
export type CourseList = CourseData[];

type ProductRow = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  modules: ModuleRow[] | null;
};

type ModuleRow = {
  id: string;
  title: string;
  sort_order: number;
  product_id: string;
  lessons: LessonRow[] | null;
};

type LessonRow = {
  id: string;
  title: string;
  description: string | null;
  lesson_type: string;
  video_url: string | null;
  video_duration: number | null;
  file_url: string | null;
  is_free_preview: boolean;
  sort_order: number;
  module_id: string;
};

// Deriva o antigo "contentType" (youtube/pdf/link/video) a partir de lesson_type + url,
// pra manter o ModuleEditor/PlayerClient funcionando sem reescrever a UI agora.
function inferContentType(l: LessonRow): string {
  if (l.lesson_type === "file") {
    return (l.file_url ?? "").toLowerCase().endsWith(".pdf") ? "pdf" : "link";
  }
  return extractYouTubeId(l.video_url ?? "") ? "youtube" : "video";
}

function mapLesson(l: LessonRow): LessonData {
  return {
    id: l.id,
    title: l.title,
    description: l.description ?? "",
    duration: formatDuration(l.video_duration),
    order: l.sort_order,
    locked: !l.is_free_preview,
    videoUrl: l.video_url || l.file_url || "",
    contentType: inferContentType(l),
    moduleId: l.module_id,
  };
}

function mapModule(m: ModuleRow): ModuleData {
  return {
    id: m.id,
    title: m.title,
    order: m.sort_order,
    courseId: m.product_id,
    lessons: (m.lessons ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapLesson),
  };
}

function mapCourse(p: ProductRow): CourseData {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? "",
    instructor: "",
    instructorAvatar: "",
    instructorBio: "",
    thumbnail: p.thumbnail_url ?? "",
    category: "",
    level: "",
    duration: "",
    rating: 0,
    students: 0,
    isNew: false,
    isFeatured: p.is_featured,
    published: p.is_published,
    tags: "[]",
    order: p.sort_order,
    createdAt: new Date(p.created_at),
    updatedAt: new Date(p.updated_at),
    modules: (p.modules ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(mapModule),
  };
}

const COURSE_SELECT = "*, modules(*, lessons(*))";

export const getAllCourses = cache(async (): Promise<CourseList> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(COURSE_SELECT)
    .eq("product_type", "course")
    .eq("is_published", true)
    .order("sort_order");

  return ((data as ProductRow[]) ?? []).map(mapCourse);
});

export const getAllCoursesAdmin = cache(async (): Promise<CourseList> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(COURSE_SELECT)
    .eq("product_type", "course")
    .order("sort_order");

  return ((data as ProductRow[]) ?? []).map(mapCourse);
});

export const getCourseWithModules = cache(async (id: string): Promise<CourseData | null> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(COURSE_SELECT)
    .eq("id", id)
    .eq("product_type", "course")
    .maybeSingle();

  return data ? mapCourse(data as ProductRow) : null;
});

export const getFeaturedCourse = cache(async (): Promise<CourseData | null> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(COURSE_SELECT)
    .eq("product_type", "course")
    .eq("is_featured", true)
    .eq("is_published", true)
    .maybeSingle();

  return data ? mapCourse(data as ProductRow) : null;
});

export const getNewCourses = cache(async (): Promise<CourseList> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(COURSE_SELECT)
    .eq("product_type", "course")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(8);

  return ((data as ProductRow[]) ?? []).map(mapCourse);
});

export const getPopularCourses = cache(async (): Promise<CourseList> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(COURSE_SELECT)
    .eq("product_type", "course")
    .eq("is_published", true)
    .order("sort_order")
    .limit(8);

  return ((data as ProductRow[]) ?? []).map(mapCourse);
});

export interface UserEnrollment {
  productId: string;
  title: string;
  isActive: boolean;
  turmaId: string | null;
  turmaCode: string | null;
}

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: Date;
  enrollments: UserEnrollment[];
}

// Lista paginada + busca de alunos/admins — a tabela tem 4000+ linhas, então nunca
// carregamos tudo de uma vez (o PostgREST também limitaria a 1000 por padrão).
export const getUsersPage = cache(
  async (search: string, page: number, pageSize = 50): Promise<{ users: UserRow[]; total: number }> => {
    const supabase = await createServerSupabaseClient();
    const offset = Math.max(0, (page - 1) * pageSize);

    const [{ data }, { data: total }] = await Promise.all([
      supabase.rpc("admin_list_profiles", { p_search: search, p_limit: pageSize, p_offset: offset }),
      supabase.rpc("admin_count_profiles", { p_search: search }),
    ]);

    const users: UserRow[] = (data ?? []).map(
      (p: {
        id: string;
        full_name: string | null;
        role: string;
        avatar_url: string | null;
        email: string;
        created_at: string;
        enrollments:
          | { product_id: string; title: string; is_active: boolean; turma_id: string | null; turma_code: string | null }[]
          | null;
      }) => ({
        id: p.id,
        name: p.full_name ?? "",
        email: p.email ?? "",
        role: p.role,
        avatar: p.avatar_url ?? "",
        createdAt: new Date(p.created_at),
        enrollments: (p.enrollments ?? []).map((e) => ({
          productId: e.product_id,
          title: e.title,
          isActive: e.is_active,
          turmaId: e.turma_id,
          turmaCode: e.turma_code,
        })),
      })
    );

    return { users, total: total ?? 0 };
  }
);

// ── Formação IDM ─────────────────────────────────────────

export interface FormacaoLesson {
  id: string;
  title: string;
  description: string;
  lessonType: string;
  videoUrl: string;
  fileUrl: string;
  content: string;
  videoDuration: number;
  isFreePreview: boolean;
  order: number;
  moduleId: string;
  materials: { id: string; title: string; type: string; url: string }[];
}

export interface FormacaoModule {
  id: string;
  title: string;
  description: string;
  order: number;
  released: boolean;
  releaseAt: string | null;
  lessons: FormacaoLesson[];
}

type FormacaoModuleRow = {
  id: string;
  title: string;
  description: string | null;
  sort_order: number;
  released: boolean;
  release_at: string | null;
  lessons:
    | {
        id: string;
        title: string;
        description: string | null;
        lesson_type: string;
        video_url: string | null;
        file_url: string | null;
        content: string | null;
        video_duration: number | null;
        is_free_preview: boolean;
        sort_order: number;
        module_id: string;
        materials: { id: string; title: string; type: string; url: string }[] | null;
      }[]
    | null;
};

function mapFormacaoModule(m: FormacaoModuleRow): FormacaoModule {
  return {
    id: m.id,
    title: m.title,
    description: m.description ?? "",
    order: m.sort_order,
    released: m.released,
    releaseAt: m.release_at,
    lessons: (m.lessons ?? [])
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((l) => ({
        id: l.id,
        title: l.title,
        description: l.description ?? "",
        lessonType: l.lesson_type,
        videoUrl: l.video_url ?? "",
        fileUrl: l.file_url ?? "",
        content: l.content ?? "",
        videoDuration: l.video_duration ?? 0,
        isFreePreview: l.is_free_preview,
        order: l.sort_order,
        moduleId: l.module_id,
        materials: l.materials ?? [],
      })),
  };
}

// Admin: enxerga todos os módulos da Formação, liberados ou não.
export const getFormacaoModules = cache(async (): Promise<FormacaoModule[]> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("modules")
    .select("*, lessons(*, materials(*))")
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .order("sort_order");

  return ((data as FormacaoModuleRow[]) ?? []).map(mapFormacaoModule);
});

// Aluno: mostra o syllabus inteiro (título de todo módulo, liberado ou não — pra ele
// ver o que vem a seguir), mas só traz as aulas dos módulos já liberados (RLS de
// `lessons` barra o resto).
export const getFormacaoModulesForStudent = cache(async (): Promise<FormacaoModule[]> => {
  const supabase = await createServerSupabaseClient();

  const [{ data: syllabus }, { data: lessonsData }] = await Promise.all([
    supabase.rpc("get_formacao_syllabus"),
    supabase
      .from("lessons")
      .select("*, materials(*), modules!inner(product_id)")
      .eq("modules.product_id", FORMACAO_PRODUCT_ID),
  ]);

  const lessonsByModule = new Map<string, FormacaoModuleRow["lessons"]>();
  for (const l of (lessonsData as any[]) ?? []) {
    const list = lessonsByModule.get(l.module_id) ?? [];
    list.push(l);
    lessonsByModule.set(l.module_id, list);
  }

  return ((syllabus as { module_id: string; title: string; description: string | null; sort_order: number; unlocked: boolean; unlock_at: string | null }[]) ?? []).map(
    (m) =>
      mapFormacaoModule({
        id: m.module_id,
        title: m.title,
        description: m.description,
        sort_order: m.sort_order,
        released: m.unlocked,
        release_at: m.unlock_at,
        lessons: lessonsByModule.get(m.module_id) ?? [],
      })
  );
});

export interface Turma {
  id: string;
  code: string;
  name: string;
  startDate: string | null;
  isActive: boolean;
}

export const getTurmas = cache(async (): Promise<Turma[]> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("turmas")
    .select("id, code, name, start_date, is_active")
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .order("code");

  return (data ?? []).map((t) => ({
    id: t.id,
    code: t.code,
    name: t.name,
    startDate: t.start_date,
    isActive: t.is_active,
  }));
});

// Mapa module_id -> {released, releaseAt} pra uma turma específica.
export const getTurmaModuleReleases = cache(async (turmaId: string) => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("turma_module_releases")
    .select("module_id, released, release_at")
    .eq("turma_id", turmaId);

  const map: Record<string, { released: boolean; releaseAt: string | null }> = {};
  for (const row of data ?? []) {
    map[row.module_id] = { released: row.released, releaseAt: row.release_at };
  }
  return map;
});

// Aluno está matriculado na Formação? (RLS de `modules` já filtra por matrícula, mas
// pra distinguir "sem matrícula" de "matriculado, nenhum módulo liberado ainda" na UI
// precisamos checar isso à parte.)
export const isEnrolledInFormacao = cache(async (): Promise<boolean> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .eq("is_active", true)
    .maybeSingle();

  return !!data;
});

// ── Tarefas ──────────────────────────────────────────────

export interface FormacaoTask {
  id: string;
  title: string;
  instructions: string;
  rubric: string;
  moduleId: string;
  moduleTitle: string;
  lessonId: string | null;
  dueAt: string | null;
  published: boolean;
  submissionCount: number;
  pendingCount: number; // com nota da IA mas ainda não publicada
}

export const getFormacaoTasksAdmin = cache(async (): Promise<FormacaoTask[]> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("tasks")
    .select("id, title, description, rubric, module_id, lesson_id, due_at, is_required, modules(title), task_submissions(id, grades(published))")
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .order("created_at", { ascending: false });

  return ((data as any[]) ?? []).map((t) => {
    const submissions = t.task_submissions ?? [];
    return {
      id: t.id,
      title: t.title,
      instructions: t.description ?? "",
      rubric: t.rubric ?? "",
      moduleId: t.module_id,
      moduleTitle: t.modules?.title ?? "",
      lessonId: t.lesson_id,
      dueAt: t.due_at,
      published: t.is_required,
      submissionCount: submissions.length,
      pendingCount: submissions.filter((s: any) => s.grades && !s.grades.published).length,
    };
  });
});

export interface TaskSubmissionRow {
  id: string;
  userId: string;
  studentName: string;
  answer: string;
  status: string;
  submittedAt: string;
  gradeId: string | null;
  aiScore: number | null;
  aiFeedback: string;
  finalScore: number | null;
  finalFeedback: string;
  published: boolean;
}

export const getTaskSubmissions = cache(async (taskId: string): Promise<TaskSubmissionRow[]> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("task_submissions")
    .select("id, user_id, answer, status, submitted_at, grades(id, ai_score, ai_feedback, final_score, final_feedback, published)")
    .eq("task_id", taskId)
    .order("submitted_at", { ascending: false });

  const rows = (data as any[]) ?? [];
  if (rows.length === 0) return [];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", rows.map((r) => r.user_id));
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  return rows.map((r) => {
    const grade = Array.isArray(r.grades) ? r.grades[0] : r.grades;
    return {
      id: r.id,
      userId: r.user_id,
      studentName: nameById.get(r.user_id) ?? "Aluno",
      answer: r.answer,
      status: r.status,
      submittedAt: r.submitted_at,
      gradeId: grade?.id ?? null,
      aiScore: grade?.ai_score ?? null,
      aiFeedback: grade?.ai_feedback ?? "",
      finalScore: grade?.final_score ?? null,
      finalFeedback: grade?.final_feedback ?? "",
      published: grade?.published ?? false,
    };
  });
});

export interface StudentTask {
  id: string;
  title: string;
  instructions: string;
  dueAt: string | null;
  mySubmission: {
    answer: string;
    status: string;
    finalScore: number | null;
    finalFeedback: string;
    published: boolean;
  } | null;
}

// Tarefas do módulo, visíveis pro aluno (RLS já garante matrícula) + a resposta
// dele mesmo, se já enviou (a nota só vem se `grades.published = true`).
export const getModuleTasksForStudent = cache(async (moduleId: string): Promise<StudentTask[]> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, description, due_at")
    .eq("module_id", moduleId)
    .eq("is_required", true)
    .order("created_at");

  if (!tasks || tasks.length === 0) return [];

  const { data: submissions } = user
    ? await supabase
        .from("task_submissions")
        .select("task_id, answer, status, grades(final_score, final_feedback, published)")
        .eq("user_id", user.id)
        .in("task_id", tasks.map((t) => t.id))
    : { data: [] };

  const byTask = new Map((submissions ?? []).map((s: any) => [s.task_id, s]));

  return tasks.map((t) => {
    const s = byTask.get(t.id);
    const grade = s ? (Array.isArray(s.grades) ? s.grades[0] : s.grades) : null;
    return {
      id: t.id,
      title: t.title,
      instructions: t.description ?? "",
      dueAt: t.due_at,
      mySubmission: s
        ? {
            answer: s.answer,
            status: s.status,
            finalScore: grade?.published ? grade.final_score : null,
            finalFeedback: grade?.published ? grade.final_feedback : "",
            published: grade?.published ?? false,
          }
        : null,
    };
  });
});

export interface FormacaoLive {
  id: string;
  title: string;
  dateLabel: string;
  timeLabel: string;
  joinUrl: string;
  isActive: boolean;
}

export const getFormacaoLivesAdmin = cache(async (): Promise<FormacaoLive[]> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("lives")
    .select("id, title, date_label, time_label, join_url, is_active")
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .order("created_at");

  return (data ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    dateLabel: l.date_label ?? "",
    timeLabel: l.time_label ?? "",
    joinUrl: l.join_url ?? "",
    isActive: l.is_active,
  }));
});

export const getFormacaoLivesForStudent = cache(async (): Promise<FormacaoLive[]> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("lives")
    .select("id, title, date_label, time_label, join_url, is_active")
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .eq("is_active", true)
    .order("created_at");

  return (data ?? []).map((l) => ({
    id: l.id,
    title: l.title,
    dateLabel: l.date_label ?? "",
    timeLabel: l.time_label ?? "",
    joinUrl: l.join_url ?? "",
    isActive: l.is_active,
  }));
});

export interface FormacaoDeadline {
  id: string;
  title: string;
  dueAt: string;
  moduleTitle: string;
}

// Prazos de tarefa da Formação, só as publicadas e com prazo definido.
export const getFormacaoDeadlinesForStudent = cache(async (): Promise<FormacaoDeadline[]> => {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("tasks")
    .select("id, title, due_at, modules(title)")
    .eq("product_id", FORMACAO_PRODUCT_ID)
    .eq("is_required", true)
    .not("due_at", "is", null)
    .order("due_at");

  return (data ?? []).map((t: any) => ({
    id: t.id,
    title: t.title,
    dueAt: t.due_at,
    moduleTitle: t.modules?.title ?? "",
  }));
});

export interface MyGrade {
  taskId: string;
  taskTitle: string;
  moduleTitle: string;
  finalScore: number;
  finalFeedback: string;
}

export const getMyPublishedGrades = cache(async (): Promise<MyGrade[]> => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("grades")
    .select("final_score, final_feedback, task_submissions(task_id, user_id, tasks(title, product_id, modules(title)))")
    .eq("published", true);

  return (data ?? [])
    .filter((g: any) => g.task_submissions?.user_id === user.id && g.task_submissions?.tasks?.product_id === FORMACAO_PRODUCT_ID)
    .map((g: any) => ({
      taskId: g.task_submissions.task_id,
      taskTitle: g.task_submissions.tasks?.title ?? "",
      moduleTitle: g.task_submissions.tasks?.modules?.title ?? "",
      finalScore: g.final_score,
      finalFeedback: g.final_feedback ?? "",
    }));
});

export const getAdminOverviewStats = cache(async () => {
  const supabase = await createServerSupabaseClient();

  const [{ count: totalMembers }, { count: totalCourses }, { count: publishedCourses }] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("product_type", "course"),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("product_type", "course")
      .eq("is_published", true),
  ]);

  return {
    totalMembers: totalMembers ?? 0,
    totalCourses: totalCourses ?? 0,
    publishedCourses: publishedCourses ?? 0,
  };
});

// Helpers re-exported from types (convenience)
export { getTotalLessons, parseTags } from "./types";
