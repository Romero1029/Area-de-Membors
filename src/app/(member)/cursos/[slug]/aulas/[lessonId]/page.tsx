import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, Circle, Clock, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { YouTubePlayer } from '@/components/player/YouTubePlayer'
import { DEMO_PRODUCTS, DEMO_MODULES } from '@/lib/demo-data'
import type { ModuleWithLessons, Progress, Lesson } from '@/types'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getData(slug: string, lessonId: string) {
  if (DEMO_MODE) {
    const product = DEMO_PRODUCTS.find((p) => p.slug === slug)
    if (!product) return null
    const modules = DEMO_MODULES.filter((m) => m.product_id === product.id) as ModuleWithLessons[]
    const allLessons = modules.flatMap((m) => [...m.lessons].sort((a, b) => a.sort_order - b.sort_order))
    const lesson = allLessons.find((l) => l.id === lessonId)
    if (!lesson) return null
    const progressMap: Record<string, Progress> = {}
    return { product: { id: product.id, slug: product.slug, title: product.title }, lesson, modules, allLessons, progressMap }
  }

  const { redirect } = await import('next/navigation')
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data: productRaw } = await sb.from('products').select('id, slug, title').eq('slug', slug).single()
  const product = productRaw as { id: string; slug: string; title: string } | null
  if (!product) return null
  const { data: lessonRaw } = await sb.from('lessons').select('*').eq('id', lessonId).single()
  const lesson = lessonRaw as Lesson | null
  if (!lesson) return null
  const { data: modulesRaw } = await sb.from('modules').select('*, lessons (*)').eq('product_id', product.id).order('sort_order')
  const modules = (modulesRaw ?? []) as ModuleWithLessons[]
  const allLessons = modules.flatMap((m) => [...m.lessons].sort((a, b) => a.sort_order - b.sort_order))
  const allLessonIds = allLessons.map((l) => l.id)
  const { data: progressRaw } = await sb.from('progress').select('*').eq('user_id', user!.id).in('lesson_id', allLessonIds)
  const progressMap: Record<string, Progress> = Object.fromEntries(((progressRaw ?? []) as Progress[]).map((p) => [p.lesson_id, p]))
  return { product, lesson, modules, allLessons, progressMap }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; lessonId: string }> }) {
  const { slug, lessonId } = await params
  const data = await getData(slug, lessonId)
  if (!data) notFound()
  const { product, lesson, modules, allLessons, progressMap } = data

  const currentIndex = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const currentProgress = progressMap[lessonId]

  return (
    <div className="max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: '#555555' }}>
        <Link href="/dashboard" className="hover:text-white transition-colors">Início</Link>
        <span>/</span>
        <Link href={`/cursos/${slug}`} className="hover:text-white transition-colors truncate max-w-[200px]">{product.title}</Link>
        <span>/</span>
        <span className="text-white truncate max-w-[200px]">{lesson.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
        {/* Player */}
        <div className="space-y-4">
          {lesson.video_url ? (
            <YouTubePlayer videoUrl={lesson.video_url} lessonId={lesson.id} productSlug={slug} initialCompleted={currentProgress?.completed} />
          ) : (
            <div className="aspect-video rounded-xl flex items-center justify-center" style={{ background: '#111111', border: '1px solid #1a1a1a' }}>
              <p className="text-sm" style={{ color: '#555555' }}>Sem vídeo para esta aula.</p>
            </div>
          )}
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
            {lesson.description && <p className="text-sm leading-relaxed" style={{ color: '#888888' }}>{lesson.description}</p>}
          </div>
          <div className="flex items-center gap-3 pt-2">
            {prevLesson ? (
              <Link href={`/cursos/${slug}/aulas/${prevLesson.id}`} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#1a1a1a', color: '#888888', border: '1px solid #222222' }}>
                <ChevronLeft className="w-4 h-4" />Anterior
              </Link>
            ) : (
              <Link href={`/cursos/${slug}`} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: '#1a1a1a', color: '#888888', border: '1px solid #222222' }}>
                <ArrowLeft className="w-4 h-4" />Visão geral
              </Link>
            )}
            {nextLesson && (
              <Link href={`/cursos/${slug}/aulas/${nextLesson.id}`} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: '#FFA902', color: '#000' }}>
                Próxima<ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar de aulas */}
        <div className="rounded-xl overflow-hidden" style={{ background: '#111111', border: '1px solid #1a1a1a', height: 'fit-content' }}>
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
            <p className="text-xs font-semibold text-white">Conteúdo do curso</p>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {modules.map((mod) => {
              const modLessons = [...mod.lessons].sort((a, b) => a.sort_order - b.sort_order)
              return (
                <div key={mod.id}>
                  <div className="px-4 py-2.5" style={{ background: '#0a0a0a', borderBottom: '1px solid #1a1a1a' }}>
                    <p className="text-xs font-semibold" style={{ color: '#888888' }}>{mod.title}</p>
                  </div>
                  {modLessons.map((l) => {
                    const done = !!progressMap[l.id]?.completed
                    const active = l.id === lessonId
                    return (
                      <Link key={l.id} href={`/cursos/${slug}/aulas/${l.id}`} className="flex items-start gap-2.5 px-4 py-2.5 transition-colors" style={{ background: active ? 'rgba(255,169,2,0.08)' : 'transparent', borderLeft: active ? '2px solid #FFA902' : '2px solid transparent', borderBottom: '1px solid #1a1a1a' }}>
                        {done ? <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: '#22c55e' }} /> : <Circle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: active ? '#FFA902' : '#333333' }} />}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs leading-snug" style={{ color: active ? '#FFA902' : done ? '#555555' : '#cccccc' }}>{l.title}</p>
                          {l.video_duration && (
                            <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: '#444444' }}>
                              <Clock className="w-2.5 h-2.5" />{formatDuration(l.video_duration)}
                            </p>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
