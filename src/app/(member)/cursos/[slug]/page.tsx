import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Circle, Clock, PlayCircle, FileText, ClipboardList, Info, Plus, Pencil, Trash2, Lock } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { DEMO_PRODUCTS, DEMO_MODULES, DEMO_PROGRESS } from '@/lib/demo-data'
import { CourseTabsClient } from './CourseTabsClient'
import type { ModuleWithLessons, Progress, Product } from '@/types'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getData(slug: string, userId: string) {
  if (DEMO_MODE) {
    const product = DEMO_PRODUCTS.find(p => p.slug === slug) ?? null
    if (!product) return null
    const modules = DEMO_MODULES.filter(m => m.product_id === product.id)
    const prog = DEMO_PROGRESS.find(p => p.product_id === product.id)
    const progressMap: Record<string, Progress> = {}
    if (prog?.completed_lessons) {
      modules[0]?.lessons.slice(0, prog.completed_lessons).forEach(l => {
        progressMap[l.id] = { id: `prog-${l.id}`, user_id: userId, lesson_id: l.id, completed: true, completed_at: new Date().toISOString(), watch_seconds: l.video_duration ?? 0 }
      })
    }
    return { product, modules, progressMap, isEnrolled: true, isAdmin: false, tasks: [], materials: [] }
  }

  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const [{ data: productRaw }, { data: profileRaw }, { data: enrollmentRaw }, { data: modulesRaw }, { data: tasksRaw }, { data: materialsRaw }] = await Promise.all([
    sb.from('products').select('*').eq('slug', slug).eq('is_published', true).single(),
    sb.from('profiles').select('role').eq('id', user.id).single(),
    sb.from('enrollments').select('id').eq('user_id', user.id).eq('is_active', true),
    sb.from('modules').select('*, lessons (*)').eq('product_id', (await sb.from('products').select('id').eq('slug', slug).single()).data?.id).order('sort_order'),
    sb.from('tasks').select('*').order('sort_order'),
    sb.from('materials').select('*').order('sort_order'),
  ])

  const product = productRaw as Product | null
  if (!product) return null
  const isAdmin = profileRaw?.role === 'admin'
  const isEnrolled = isAdmin || !!(enrollmentRaw?.length)
  const modules = (modulesRaw ?? []) as ModuleWithLessons[]
  const allLessonIds = modules.flatMap(m => m.lessons.map(l => l.id))
  const { data: progressRaw } = await sb.from('progress').select('*').eq('user_id', user.id).in('lesson_id', allLessonIds)
  const progressMap: Record<string, Progress> = Object.fromEntries(((progressRaw ?? []) as Progress[]).map((p: Progress) => [p.lesson_id, p]))

  return { product, modules, progressMap, isEnrolled, isAdmin, tasks: tasksRaw ?? [], materials: materialsRaw ?? [] }
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Precisamos do userId para o demo
  let userId = 'guest'
  if (!DEMO_MODE) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    userId = user.id
  }

  const data = await getData(slug, userId)
  if (!data) notFound()
  const { product, modules, progressMap, isEnrolled, isAdmin, tasks, materials } = data

  const allLessons = modules.flatMap(m => [...m.lessons].sort((a, b) => a.sort_order - b.sort_order))
  const totalLessons = allLessons.length
  const completedLessons = Object.values(progressMap).filter(p => p.completed).length
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const nextLesson = allLessons.find(l => !progressMap[l.id]?.completed)

  return (
    <div className="min-h-screen bg-[#0f0f0f]">

      {/* ── HERO ── */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: 320 }}>
        {product.thumbnail_url ? (
          <>
            <Image src={product.thumbnail_url} alt={product.title} fill priority className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/40 via-[#0f0f0f]/60 to-[#0f0f0f]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/80 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2233] to-[#0f0f0f]" />
        )}

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-10 pb-8 flex flex-col gap-5">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-[#606060]">
            <Link href="/dashboard" className="hover:text-[#f0f0f0] transition-colors">Início</Link>
            <span>/</span>
            <Link href="/cursos" className="hover:text-[#f0f0f0] transition-colors">Meus Cursos</Link>
            <span>/</span>
            <span className="text-[#a0a0a0] truncate max-w-[200px]">{product.title}</span>
          </div>

          <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-end">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#c79a3b]/15 border border-[#c79a3b]/25 px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[#c79a3b]">
                  {product.product_type === 'course' ? 'Curso' : product.product_type}
                </span>
                {isAdmin && (
                  <span className="rounded-full bg-blue-500/15 border border-blue-500/25 px-3 py-0.5 text-xs font-bold text-blue-400">
                    Modo Editor
                  </span>
                )}
              </div>

              <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#f0f0f0] leading-tight">
                {product.title}
              </h1>

              {product.short_description && (
                <p className="text-[#a0a0a0] leading-relaxed max-w-xl">{product.short_description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-[#606060]">
                <span className="flex items-center gap-1.5"><PlayCircle className="h-4 w-4 text-[#c79a3b]" />{totalLessons} aulas</span>
                <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4 text-[#c79a3b]" />{completedLessons} concluídas</span>
                {tasks.length > 0 && <span className="flex items-center gap-1.5"><ClipboardList className="h-4 w-4 text-[#c79a3b]" />{tasks.length} tarefas</span>}
              </div>
            </div>

            {/* Card de CTA */}
            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-5 space-y-4">
              {isEnrolled && totalLessons > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#606060]">Seu progresso</span>
                    <span className="font-bold" style={{ color: percent === 100 ? '#22c55e' : '#c79a3b' }}>{percent}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#2a2a2a] overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{
                      width: `${percent}%`,
                      background: percent === 100 ? '#22c55e' : 'linear-gradient(90deg, #c79a3b, #e8b84b)'
                    }} />
                  </div>
                  <p className="text-xs text-[#606060]">{completedLessons} de {totalLessons} aulas</p>
                </div>
              )}

              {isEnrolled ? (
                nextLesson ? (
                  <Link href={`/cursos/${slug}/aulas/${nextLesson.id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#0f0f0f] transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}
                  >
                    <PlayCircle className="h-4 w-4" />
                    {completedLessons === 0 ? 'Começar curso' : 'Continuar de onde parei'}
                  </Link>
                ) : (
                  <div className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#22c55e] bg-[#22c55e]/10 border border-[#22c55e]/20">
                    <CheckCircle className="h-4 w-4" /> Curso concluído!
                  </div>
                )
              ) : (
                <Link href="/loja"
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-[#0f0f0f] bg-[#c79a3b] hover:bg-[#e8b84b] transition-colors"
                >
                  <Lock className="h-4 w-4" /> Garantir acesso
                </Link>
              )}

              {isAdmin && (
                <Link href={`/admin/cursos/${slug}/editar`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-500/30 py-2.5 text-xs font-semibold text-blue-400 hover:bg-blue-500/10 transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" /> Editar curso
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── CONTEÚDO COM TABS ── */}
      <div className="max-w-5xl mx-auto px-5 sm:px-8 pb-20 pt-2">
        <CourseTabsClient
          slug={slug}
          product={product}
          modules={modules}
          progressMap={progressMap}
          isEnrolled={isEnrolled}
          isAdmin={isAdmin}
          tasks={tasks}
          materials={materials}
        />
      </div>
    </div>
  )
}
