import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Circle, Clock, PlayCircle } from 'lucide-react'
import { formatDuration } from '@/lib/utils'
import { DEMO_PRODUCTS, DEMO_MODULES, DEMO_PROGRESS } from '@/lib/demo-data'
import type { ModuleWithLessons, Progress, Product } from '@/types'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

async function getData(slug: string) {
  if (DEMO_MODE) {
    const product = DEMO_PRODUCTS.find((p) => p.slug === slug) ?? null
    if (!product) return null
    const modules = DEMO_MODULES.filter((m) => m.product_id === product.id)
    const progress = DEMO_PROGRESS.find((p) => p.product_id === product.id)
    const progressMap: Record<string, Progress> = {}
    if (progress && progress.completed_lessons > 0) {
      modules[0]?.lessons.slice(0, progress.completed_lessons).forEach((l) => {
        progressMap[l.id] = { id: `prog-${l.id}`, user_id: 'demo-admin', lesson_id: l.id, completed: true, completed_at: new Date().toISOString(), watch_seconds: l.video_duration ?? 0 }
      })
    }
    return { product, modules, progressMap, isEnrolled: true }
  }

  const { redirect } = await import('next/navigation')
  const { createClient } = await import('@/lib/supabase/server')
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any
  const { data: productRaw } = await sb.from('products').select('*').eq('slug', slug).eq('is_published', true).single()
  const product = productRaw as Product | null
  if (!product) return null
  const { data: enrollmentRaw } = await sb.from('enrollments').select('id').eq('user_id', user!.id).eq('product_id', product.id).eq('is_active', true).single()
  const { data: modulesRaw } = await sb.from('modules').select('*, lessons (*)').eq('product_id', product.id).order('sort_order')
  const modules = (modulesRaw ?? []) as ModuleWithLessons[]
  const allLessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id))
  const { data: progressRaw } = await sb.from('progress').select('*').eq('user_id', user!.id).in('lesson_id', allLessonIds)
  const progressMap: Record<string, Progress> = Object.fromEntries(((progressRaw ?? []) as Progress[]).map((p) => [p.lesson_id, p]))
  return { product, modules, progressMap, isEnrolled: !!enrollmentRaw }
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const data = await getData(slug)
  if (!data) notFound()
  const { product, modules, progressMap, isEnrolled } = data

  const allLessonIds = modules.flatMap((m) => m.lessons.map((l) => l.id))
  const totalLessons = allLessonIds.length
  const completedLessons = Object.values(progressMap).filter((p) => p.completed).length
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

  const nextLesson = modules
    .flatMap((m) => [...m.lessons].sort((a, b) => a.sort_order - b.sort_order))
    .find((l) => !progressMap[l.id]?.completed)

  return (
    <div className="max-w-4xl space-y-6">
      {/* Hero */}
      <div className="rounded-2xl overflow-hidden" style={{ background: '#111111', border: '1px solid #1a1a1a' }}>
        {product.thumbnail_url && (
          <div className="relative h-48 md:h-64 overflow-hidden">
            <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, #111111 100%)' }} />
          </div>
        )}
        <div className="p-6 space-y-4">
          <div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider" style={{ background: 'rgba(255,169,2,0.15)', color: '#FFA902', border: '1px solid rgba(255,169,2,0.3)' }}>
              {product.product_type}
            </span>
            <h1 className="text-2xl md:text-3xl font-bold text-white mt-3">{product.title}</h1>
            {product.description && <p className="text-sm mt-2 leading-relaxed" style={{ color: '#888888' }}>{product.description}</p>}
          </div>
          <div className="flex items-center gap-4 text-sm" style={{ color: '#666666' }}>
            <span className="flex items-center gap-1.5"><PlayCircle className="w-4 h-4" />{totalLessons} aulas</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" />{completedLessons} concluídas</span>
          </div>
          {isEnrolled && totalLessons > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: '#555555' }}>Progresso</span>
                <span className="font-semibold" style={{ color: percent === 100 ? '#22c55e' : '#FFA902' }}>{percent}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${percent}%`, background: percent === 100 ? '#22c55e' : '#FFA902' }} />
              </div>
            </div>
          )}
          {isEnrolled && nextLesson && (
            <Link href={`/cursos/${slug}/aulas/${nextLesson.id}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: '#FFA902', color: '#000', boxShadow: '0 0 20px rgba(255,169,2,0.2)' }}>
              <PlayCircle className="w-4 h-4" />
              {completedLessons === 0 ? 'Começar curso' : 'Continuar'}
            </Link>
          )}
        </div>
      </div>

      {/* Módulos */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-white">Conteúdo do curso</h2>
        {modules.map((mod) => {
          const modLessons = [...mod.lessons].sort((a, b) => a.sort_order - b.sort_order)
          const modCompleted = modLessons.filter((l) => progressMap[l.id]?.completed).length
          return (
            <div key={mod.id} className="rounded-xl overflow-hidden" style={{ background: '#111111', border: '1px solid #1a1a1a' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #1a1a1a' }}>
                <h3 className="text-sm font-semibold text-white">{mod.title}</h3>
                <span className="text-xs" style={{ color: '#555555' }}>{modCompleted}/{modLessons.length}</span>
              </div>
              <div className="divide-y" style={{ borderColor: '#1a1a1a' }}>
                {modLessons.map((lesson) => {
                  const done = !!progressMap[lesson.id]?.completed
                  return (
                    <div key={lesson.id} className="flex items-center gap-3 px-4 py-3">
                      {done ? <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#22c55e' }} /> : <Circle className="w-4 h-4 shrink-0" style={{ color: '#444444' }} />}
                      <Link href={`/cursos/${slug}/aulas/${lesson.id}`} className="flex-1 text-sm hover:underline" style={{ color: done ? '#666666' : '#f0f0f0' }}>
                        {lesson.title}
                      </Link>
                      {lesson.video_duration && (
                        <span className="text-xs flex items-center gap-1 shrink-0" style={{ color: '#555555' }}>
                          <Clock className="w-3 h-3" />{formatDuration(lesson.video_duration)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
