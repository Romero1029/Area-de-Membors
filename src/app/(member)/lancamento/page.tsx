import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Lock, Calendar, Clock, ExternalLink, ShoppingCart,
  Award, Play, Users, Sparkles, MessageCircle, ChevronRight,
  Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { YouTubePlayer } from '@/components/player/YouTubePlayer'
import { CertificadoForm } from '@/components/lancamento/CertificadoForm'
import { AnimatedSection, AnimatedCard } from '@/components/marketing/AnimatedSection'

type Live = {
  id: string; number: number; title: string; description: string
  date_label: string; time_label: string; live_url: string
  is_locked: boolean; thumbnail_url: string | null; youtube_id: string | null
  sort_order: number
}

export default async function LancamentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const [{ data: config }, { data: livesRaw }, { data: existingCert }, { data: profileRaw }] = await Promise.all([
    sb.from('launch_config').select('*').eq('is_active', true).single(),
    sb.from('launch_lives').select('*').order('sort_order'),
    sb.from('user_certificates').select('*').eq('user_id', user.id).eq('certificate_type', 'launch').single(),
    sb.from('profiles').select('full_name').eq('id', user.id).single(),
  ])

  const lives: Live[] = livesRaw ?? []
  const firstName = (profileRaw?.full_name ?? 'Aluno').split(' ')[0]

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f]">
      <div className="w-full max-w-4xl mx-auto px-5 sm:px-8 py-10 pb-24 flex flex-col gap-12">

        {/* ─── HERO ─── */}
        <AnimatedSection>
          <div className="relative w-full overflow-hidden rounded-2xl border border-[#2a2a2a]" style={{ minHeight: 260 }}>
            {config?.thumbnail_url && (
              <Image
                src={config.thumbnail_url}
                alt="Lançamento"
                fill
                priority
                className="object-cover object-center"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/85 to-[#0f0f0f]/40" />
            <div className="relative z-10 px-8 py-10 space-y-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c79a3b]/30 bg-[#c79a3b]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#c79a3b]">
                <Sparkles className="h-3 w-3" /> Lançamento Gratuito
              </span>
              <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#f0f0f0] leading-tight">
                {config?.intro_title ?? 'Sua jornada começa aqui'}
              </h1>
              {config?.subtitle && (
                <p className="text-sm font-semibold text-[#c79a3b]">{config.subtitle}</p>
              )}
              <p className="text-sm text-[#a0a0a0] max-w-lg">
                Olá, {firstName}! Assista a aula gratuita, entre no grupo exclusivo, participe das 3 aulas ao vivo e resgate seu certificado.
              </p>
              {/* Steps visuais */}
              <div className="flex flex-wrap gap-3 pt-2">
                {['Aula gratuita', '3 Lives', 'Grupo exclusivo', 'Certificado'].map((s, i) => (
                  <span key={s} className="flex items-center gap-1.5 text-xs text-[#f0f0f0]/70">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#c79a3b]/20 text-[10px] font-bold text-[#c79a3b]">{i + 1}</span>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ─── PASSO 1: AULA INTRODUTÓRIA ─── */}
        <AnimatedSection delay={0.05}>
          <div className="w-full space-y-4">
            <StepHeader number={1} color="#22c55e" title="Aula Introdutória Gratuita" badge="Liberado ✓" />

            <div className="w-full rounded-2xl overflow-hidden border border-[#2a2a2a] bg-[#111111]">
              <div className="p-4 sm:p-6">
                {config?.intro_video_url ? (
                  <YouTubePlayer
                    videoUrl={config.intro_video_url}
                    lessonId="intro-launch"
                    productSlug="lancamento"
                    initialCompleted={false}
                  />
                ) : (
                  <div className="aspect-video rounded-xl flex flex-col items-center justify-center gap-3 bg-[#1a1a1a] border border-[#2a2a2a]">
                    <Play className="h-10 w-10 text-[#c79a3b]/40" />
                    <p className="text-sm text-[#606060]">Aula em breve</p>
                  </div>
                )}
              </div>
              {config?.intro_description && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-[#a0a0a0] leading-relaxed">{config.intro_description}</p>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* ─── PASSO 2: GRUPO EXCLUSIVO ─── */}
        <AnimatedSection delay={0.08}>
          <div className="w-full space-y-4">
            <StepHeader number={2} color="#3b82f6" title="Entre no Grupo Exclusivo" badge="WhatsApp" />

            <a
              href={config?.group_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center gap-5 rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 hover:border-[#c79a3b]/40 hover:bg-[#1a1a1a] transition-all duration-200"
            >
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/15 border border-[#25D366]/20">
                <MessageCircle className="h-7 w-7 text-[#25D366]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[#f0f0f0] text-base">Grupo Exclusivo — Turma #36</p>
                <p className="text-sm text-[#606060] mt-0.5">Conteúdos exclusivos, avisos das lives e comunidade de alunos.</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-sm font-bold text-white flex-shrink-0 group-hover:bg-[#20c05c] transition-colors">
                Entrar <ChevronRight className="h-4 w-4" />
              </div>
            </a>
          </div>
        </AnimatedSection>

        {/* ─── PASSO 3: 3 AULAS AO VIVO ─── */}
        <AnimatedSection delay={0.1}>
          <div className="w-full space-y-5">
            <StepHeader number={3} color="#c79a3b" title="3 Aulas ao Vivo" badge="Presença obrigatória p/ certificado" />

            <div className="grid gap-5 sm:grid-cols-3">
              {lives.map((live, i) => (
                <AnimatedCard key={live.id} delay={0.06 * i}>
                  <LiveCard live={live} />
                </AnimatedCard>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* ─── PASSO 4: OFERTA LOW TICKET ─── */}
        <AnimatedSection delay={0.1}>
          <div className="w-full space-y-4">
            <StepHeader number={4} color="#e879f9" title="Oferta Exclusiva para Participantes" badge="Low ticket" />

            <div className="relative w-full overflow-hidden rounded-2xl border border-[#c79a3b]/25 bg-gradient-to-br from-[#1a1a0a] via-[#1a1a1a] to-[#0f0f0f]">
              {/* Faixa topo */}
              <div className="h-1 w-full bg-gradient-to-r from-[#c79a3b] via-[#e8b84b] to-[#c79a3b]" />

              <div className="p-6 sm:p-8 grid sm:grid-cols-[1fr_200px] gap-6 items-center">
                {/* Info */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">✦ Oferta exclusiva desta semana</span>
                    <h3 className="mt-1 font-display text-xl sm:text-2xl font-bold text-[#f0f0f0] leading-snug">
                      {config?.product_name ?? 'Formação Completa'}
                    </h3>
                    <p className="mt-1.5 text-sm text-[#a0a0a0] leading-relaxed">
                      {config?.product_description ?? 'Acesso completo à formação com suporte individual.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Acesso vitalício', 'Suporte individual', 'Comunidade exclusiva', 'Certificado oficial'].map((f) => (
                      <span key={f} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-[#c79a3b]/10 text-[#e8b84b] border border-[#c79a3b]/20">
                        <Check className="h-3 w-3" /> {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Preço + CTA */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <div>
                    <p className="text-xs text-[#606060] line-through">De R$ 497</p>
                    <p className="text-4xl font-black text-[#c79a3b] leading-none">
                      {config?.product_price ?? 'R$ 97'}
                    </p>
                    <p className="text-xs text-[#606060] mt-0.5">ou 12× no cartão</p>
                  </div>
                  <a
                    href={config?.product_url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-black text-[#0f0f0f] transition-all hover:brightness-110 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', boxShadow: '0 8px 24px rgba(199,154,59,0.35)' }}
                  >
                    <ShoppingCart className="h-4 w-4" /> Quero garantir!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* ─── PASSO 5: CERTIFICADO ─── */}
        <AnimatedSection delay={0.05}>
          <div className="w-full space-y-4" id="certificado">
            <StepHeader number={5} color="#c79a3b" title="Resgate seu Certificado" badge="3 palavras-chave das lives" />

            <div className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111111] p-6 space-y-4">
              {!existingCert && (
                <div className="rounded-xl border border-[#c79a3b]/20 bg-[#c79a3b]/5 px-4 py-3">
                  <p className="text-sm font-bold text-[#f0f0f0]">💡 Como funciona?</p>
                  <p className="text-xs text-[#a0a0a0] mt-0.5 leading-relaxed">
                    Em cada aula ao vivo uma palavra-chave especial é revelada. Colete as 3 palavras e resgate seu certificado oficial do Instituto Despertamente.
                  </p>
                </div>
              )}
              <CertificadoForm existingCert={existingCert} />
            </div>
          </div>
        </AnimatedSection>

      </div>
    </div>
  )
}

/* ─── Componentes auxiliares ─── */

function StepHeader({ number, color, title, badge }: { number: number; color: string; title: string; badge: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
        style={{ background: color }}
      >
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-bold text-[#f0f0f0] leading-tight">{title}</h2>
      </div>
      <span
        className="flex-shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border"
        style={{ color, borderColor: color + '40', background: color + '15' }}
      >
        {badge}
      </span>
    </div>
  )
}

function LiveCard({ live }: { live: Live }) {
  return (
    <div className={`group relative w-full flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 ${live.is_locked ? 'border-[#2a2a2a] opacity-75' : 'border-[#c79a3b]/30 hover:-translate-y-1 hover:shadow-[0_0_24px_rgba(199,154,59,0.15)]'}`}>

      {/* Thumbnail / imagem de referência */}
      <div className="relative w-full overflow-hidden bg-[#1a1a1a]" style={{ aspectRatio: '16/9' }}>
        {live.thumbnail_url ? (
          <Image
            src={live.thumbnail_url}
            alt={live.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className={`object-cover transition-transform duration-500 ${live.is_locked ? 'grayscale opacity-40' : 'group-hover:scale-105 opacity-60'}`}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f2233] to-[#1a2430]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-[#0f0f0f]/50 to-transparent" />

        {/* Número da aula */}
        <div className="absolute top-3 left-3">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${live.is_locked ? 'bg-[#2a2a2a] text-[#606060]' : 'bg-[#c79a3b] text-[#0f0f0f]'}`}>
            Aula {live.number}
          </span>
        </div>

        {/* Lock ou Live */}
        <div className="absolute top-3 right-3">
          {live.is_locked
            ? <Lock className="h-4 w-4 text-[#606060]" />
            : <div className="flex items-center gap-1.5 rounded-full bg-[#22c55e]/20 border border-[#22c55e]/30 px-2 py-0.5"><div className="h-1.5 w-1.5 rounded-full bg-[#22c55e] animate-pulse" /><span className="text-[10px] font-bold text-[#22c55e]">AO VIVO</span></div>
          }
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col gap-3 bg-[#111111] p-4">
        <h3 className="font-bold text-[#f0f0f0] text-sm leading-snug line-clamp-2">
          {live.title}
        </h3>

        {live.description && (
          <p className="text-xs text-[#606060] leading-relaxed line-clamp-2">{live.description}</p>
        )}

        <div className="space-y-1.5 mt-auto">
          <div className="flex items-center gap-1.5 text-xs text-[#a0a0a0]">
            <Calendar className="h-3.5 w-3.5 text-[#c79a3b] flex-shrink-0" />
            {live.date_label}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#a0a0a0]">
            <Clock className="h-3.5 w-3.5 text-[#c79a3b] flex-shrink-0" />
            {live.time_label}
          </div>
        </div>

        {live.is_locked ? (
          <div className="mt-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#1a1a1a] border border-[#2a2a2a] py-2.5 text-xs font-semibold text-[#606060]">
            <Lock className="h-3 w-3" /> Disponível em breve
          </div>
        ) : (
          <a
            href={live.live_url ?? '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold text-[#0f0f0f] transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}
          >
            <ExternalLink className="h-3.5 w-3.5" /> Entrar na live
          </a>
        )}
      </div>
    </div>
  )
}
