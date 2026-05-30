import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { BookOpen, Lock, PlayCircle, ChevronRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { DEMO_BANNERS, DEMO_LOCKED_PRODUCTS } from '@/lib/demo-data'
import type { CourseProgress, Profile } from '@/types'

type EnrollmentItem = {
  id: string; product_id: string
  products: { id: string; slug: string; title: string; description: string | null; thumbnail_url: string | null; product_type: string } | null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const [{ data: profileRaw }, { data: enrollmentsRaw }, { data: progressRaw }] = await Promise.all([
    sb.from('profiles').select('*').eq('id', user.id).single(),
    sb.from('enrollments').select('*, products (id, slug, title, description, thumbnail_url, product_type)').eq('user_id', user.id).eq('is_active', true),
    sb.from('course_progress').select('*').eq('user_id', user.id),
  ])

  const profile = profileRaw as Profile | null
  const enrollments = (enrollmentsRaw ?? []) as EnrollmentItem[]
  const progressMap: Record<string, CourseProgress> = Object.fromEntries(
    ((progressRaw ?? []) as CourseProgress[]).map((p: CourseProgress) => [p.product_id, p])
  )

  const firstName = (profile?.full_name ?? 'Bem-vindo').split(' ')[0]
  const inProgress = enrollments.filter((e) => { const p = progressMap[e.product_id]; return p && p.percent_complete > 0 && p.percent_complete < 100 })
  const notStarted  = enrollments.filter((e) => { const p = progressMap[e.product_id]; return !p || p.percent_complete === 0 })
  const completed   = enrollments.filter((e) => progressMap[e.product_id]?.percent_complete === 100)

  return (
    <div className="space-y-8 max-w-5xl pb-12">

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden px-7 py-8"
        style={{ background: 'linear-gradient(135deg, #0f2233 0%, #172432 60%, #1d2e40 100%)', minHeight: '160px' }}>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
          <Image src="/despertamente-simbolo-branco.png" alt="" width={140} height={140} className="object-contain" />
        </div>
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#c79a3b' }}>✦ Instituto Despertamente</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-1"
            style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
            Olá, {firstName}! 👋
          </h1>
          <p className="text-[15px]" style={{ color: 'rgba(255,255,255,0.55)' }}>Continue sua jornada de autoconhecimento.</p>
          <div className="flex flex-wrap gap-5 mt-5">
            {[
              { label: 'Cursos', value: enrollments.length },
              { label: 'Concluídos', value: completed.length },
              { label: 'Em andamento', value: inProgress.length },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{value}</span>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banners */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>Em destaque</h2>
        <div className="flex gap-4 scroll-x pb-2 -mx-1 px-1">
          {DEMO_BANNERS.map((banner) => (
            <Link key={banner.id} href={`/cursos/${banner.slug}`}
              className="shrink-0 rounded-2xl overflow-hidden flex flex-col justify-between p-5 hover:-translate-y-1 transition-transform duration-200"
              style={{ background: banner.gradient, width: '260px', minHeight: '160px' }}>
              <div className="flex items-start justify-between">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.22)', color: '#fff' }}>{banner.badge}</span>
                <span className="text-3xl">{banner.emoji}</span>
              </div>
              <div className="space-y-0.5 mt-auto pt-3">
                <p className="text-base font-bold text-white leading-snug">{banner.title}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>{banner.subtitle}</p>
                <p className="text-sm font-semibold text-white flex items-center gap-1 pt-1">{banner.cta} <ChevronRight className="w-3.5 h-3.5" /></p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Em andamento */}
      {inProgress.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>Continue de onde parou</h2>
            <Link href="/cursos" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#c79a3b' }}>Ver todos <ChevronRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((e, i) => <CourseCard key={e.id} enrollment={e} progress={progressMap[e.product_id]} idx={i} />)}
          </div>
        </section>
      )}

      {/* Seus cursos */}
      {notStarted.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>Seus cursos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notStarted.map((e, i) => <CourseCard key={e.id} enrollment={e} idx={i} />)}
          </div>
        </section>
      )}

      {/* Concluídos */}
      {completed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>Concluídos</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((e, i) => <CourseCard key={e.id} enrollment={e} progress={progressMap[e.product_id]} idx={i} />)}
          </div>
        </section>
      )}

      {/* Bloqueados */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>Explore mais conteúdos</h2>
          <p className="text-sm text-[#5f6b78] mt-0.5">Solicite acesso para desbloquear novos cursos e jornadas.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEMO_LOCKED_PRODUCTS.map((product) => (
            <div key={product.id} className="rounded-2xl overflow-hidden" style={{ background: '#fffaf3', border: '1px solid rgba(23,36,50,0.08)' }}>
              <div className="relative aspect-video overflow-hidden" style={{ background: '#f0ebe2' }}>
                <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover" style={{ filter: 'blur(2px) grayscale(30%)', opacity: 0.45 }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,250,243,0.95)', boxShadow: '0 4px 16px rgba(23,36,50,0.15)' }}>
                    <Lock className="w-4 h-4 text-[#5f6b78]" />
                  </div>
                </div>
                <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,250,243,0.9)', color: '#1a2430' }}>{product.category}</span>
              </div>
              <div className="p-3.5 space-y-3">
                <p className="text-sm font-bold text-[#1a2430] leading-snug">{product.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#5f6b78] flex items-center gap-1"><BookOpen className="w-3 h-3" />{product.lessons} aulas</span>
                  <button className="text-xs font-bold px-3 py-1.5 rounded-xl" style={{ background: 'rgba(199,154,59,0.12)', color: '#c79a3b', border: '1px solid rgba(199,154,59,0.25)' }}>
                    Solicitar acesso
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

const GRADIENTS = [
  'linear-gradient(135deg, #17324a 0%, #0f2233 100%)',
  'linear-gradient(135deg, #1a2430 0%, #2d1b42 100%)',
  'linear-gradient(135deg, #0f2233 0%, #17324a 100%)',
]

function CourseCard({ enrollment, progress, idx }: { enrollment: EnrollmentItem; progress?: CourseProgress; idx: number }) {
  const product = enrollment.products
  if (!product) return null
  const percent  = progress?.percent_complete ?? 0
  const completed = progress?.completed_lessons ?? 0
  const total     = progress?.total_lessons ?? 0
  const isDone    = percent === 100

  return (
    <Link href={`/cursos/${product.slug}`}
      className="rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-200"
      style={{ background: '#fffaf3', border: '1px solid rgba(23,36,50,0.08)', boxShadow: '0 2px 8px rgba(23,36,50,0.04)' }}>
      <div className="relative overflow-hidden" style={{ background: GRADIENTS[idx % GRADIENTS.length], minHeight: '140px', padding: '18px' }}>
        <div className="absolute top-0 right-0 w-28 h-28 opacity-20" style={{ background: 'radial-gradient(circle at top right, rgba(199,154,59,0.6), transparent 60%)' }} />
        {product.thumbnail_url && (
          <img src={product.thumbnail_url} alt={product.title} className="absolute inset-0 w-full h-full object-cover opacity-20" />
        )}
        <div className="relative space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(199,154,59,0.2)', color: '#ead29b', border: '1px solid rgba(199,154,59,0.25)' }}>
            {product.product_type === 'course' ? 'Curso' : product.product_type}
          </span>
          <p className="text-base font-bold text-white leading-snug">{product.title}</p>
          {total > 0 && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{completed}/{total} aulas</p>}
        </div>
        <div className="absolute bottom-3 right-4 text-5xl font-black opacity-10 text-white select-none leading-none">
          {String(idx + 1).padStart(2, '0')}
        </div>
      </div>
      <div className="px-4 py-3 space-y-2">
        {total > 0 ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold" style={{ color: isDone ? '#177c6b' : '#c79a3b' }}>{isDone ? '✓ Concluído' : `${percent}% concluído`}</span>
              {!isDone && <span className="text-xs text-[#5f6b78] flex items-center gap-1"><PlayCircle className="w-3.5 h-3.5" />Continuar</span>}
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(23,36,50,0.08)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: isDone ? 'linear-gradient(90deg,#177c6b,#1db896)' : 'linear-gradient(90deg,#c79a3b,#e8b84b)' }} />
            </div>
          </>
        ) : (
          <p className="text-xs text-[#5f6b78] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />Começar agora</p>
        )}
      </div>
    </Link>
  )
}
