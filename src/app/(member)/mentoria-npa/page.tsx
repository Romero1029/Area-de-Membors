import { redirect } from 'next/navigation'
import Link from 'next/link'
import { MessageCircle, FileText, Monitor, PlayCircle, Radio, Calendar, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PerfilNumerologicoCard, MapaEsferasCard, VoltarButton } from './HubCards'

export const metadata = { title: 'Mentoria NPA — Instituto Despertamente' }

function SectionLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30">
      <Icon className="w-3.5 h-3.5" />
      {children}
    </div>
  )
}

function EmBreveCard({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div
      className="flex items-center gap-4 rounded-2xl p-5"
      style={{ background: '#0A1232', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <Icon className="w-4 h-4 text-white/40" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white">{title}</p>
        <p className="text-sm text-white/50">{subtitle}</p>
      </div>
      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 border bg-white/[0.03] text-white/40 border-white/10">
        EM BREVE
      </span>
    </div>
  )
}

export default async function MentoriaNpaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const { data: profile } = await sb.from('profiles').select('role, full_name').eq('id', user.id).single()

  const { data: enrollment } = await sb
    .from('enrollments')
    .select('id, products!inner(slug)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('products.slug', 'mentoria-npa')
    .maybeSingle()

  if (profile?.role !== 'admin' && !enrollment) redirect('/dashboard')

  // Curso gravado NPA 2.0 — verifica se já tem aulas publicadas
  const { data: npaCourse } = await sb
    .from('products')
    .select('id, slug, title, modules(id, lessons(id))')
    .eq('slug', 'npa-2-0')
    .maybeSingle()

  const npaLessonCount = (npaCourse?.modules ?? []).reduce(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (acc: number, m: any) => acc + (m.lessons?.length ?? 0),
    0,
  )

  const firstName = (profile?.full_name ?? '').split(' ')[0] || 'Bem-vindo'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-24 md:pb-16 space-y-8">
      <VoltarButton />

      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[#FFB800]">Instituto Despertamente</p>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
          Bem-vindo, {firstName}.
        </h1>
        <p className="text-sm text-white/50 max-w-lg">
          Sua matrícula está confirmada. Todo o conteúdo abaixo já está liberado — grupo, materiais,
          curso gravado, Perfil Numerológico e os encontros ao vivo.
        </p>
      </div>

      {/* Grupo da mentoria */}
      <EmBreveCard
        icon={MessageCircle}
        title="Grupo da mentoria"
        subtitle="É lá que avisamos sobre os encontros e tiramos dúvidas."
      />

      {/* Ebook + Telas */}
      <div className="grid sm:grid-cols-2 gap-3">
        <EmBreveCard icon={FileText} title="Ebook" subtitle="Material de apoio da mentoria." />
        <EmBreveCard icon={Monitor} title="Telas" subtitle="Telas numerológicas para consulta." />
      </div>

      {/* Curso gravado — NPA 2.0 */}
      <div className="space-y-3">
        <SectionLabel icon={PlayCircle}>Curso gravado — NPA 2.0</SectionLabel>
        {npaLessonCount > 0 ? (
          <Link
            href={`/cursos/${npaCourse.slug}`}
            className="flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-[#FFB800]/30"
            style={{ background: '#0A1232', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,184,0,0.10)', border: '1px solid rgba(255,184,0,0.20)' }}>
              <PlayCircle className="w-4 h-4 text-[#FFB800]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white">{npaCourse.title}</p>
              <p className="text-sm text-white/50">{npaLessonCount} aula{npaLessonCount > 1 ? 's' : ''} disponíve{npaLessonCount > 1 ? 'is' : 'l'}</p>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/[0.08] p-8 text-center space-y-1">
            <p className="text-white/50 text-sm">A equipe está preparando as aulas gravadas do NPA.</p>
            <p className="text-white/35 text-xs">Assim que estiverem prontas, aparecem aqui automaticamente.</p>
          </div>
        )}
      </div>

      {/* Perfil Numerológico */}
      <div className="space-y-3">
        <SectionLabel icon={Sparkles}>Perfil Numerológico</SectionLabel>
        <PerfilNumerologicoCard />
      </div>

      {/* Mapa 7 Esferas */}
      <div className="space-y-3">
        <SectionLabel icon={Sparkles}>Mapa 7 Esferas</SectionLabel>
        <MapaEsferasCard />
      </div>

      {/* Encontros ao vivo */}
      <div className="space-y-3">
        <SectionLabel icon={Radio}>Encontros ao vivo</SectionLabel>
        <Link
          href="/ao-vivo"
          className="flex items-center gap-4 rounded-2xl p-5 transition-colors hover:border-[#FFB800]/30"
          style={{ background: '#0A1232', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,184,0,0.10)', border: '1px solid rgba(255,184,0,0.20)' }}>
            <Calendar className="w-4 h-4 text-[#FFB800]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">Ver calendário completo</p>
            <p className="text-sm text-white/50">Confira as próximas datas e como participar.</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
