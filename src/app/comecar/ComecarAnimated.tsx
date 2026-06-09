'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight, Play } from 'lucide-react'

// ─────────────────────────────────────────────
// CONFIG — adicione o ID do YouTube em video_id
// Exemplo: video_id: 'dQw4w9WgXcQ'
// ─────────────────────────────────────────────
const VIDEO_DEPOS: { nome: string; papel: string; video_id: string }[] = [
  { nome: 'Nome do aluno', papel: 'Psicanálise Integrativa', video_id: '' },
  { nome: 'Nome do aluno', papel: 'NPA 2.0',                 video_id: '' },
  { nome: 'Nome do aluno', papel: 'Practitioner PNL',        video_id: '' },
  { nome: 'Nome do aluno', papel: 'IDM pelo Brasil',         video_id: '' },
]

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export type Programa = {
  id: string
  title: string
  slug: string
  short_description: string | null
  thumbnail_url: string | null
}
type Depo = { nome: string; papel: string; texto: string; estrelas: number }

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function ImgPlaceholder({ aspect = 'aspect-video', label = '' }: { aspect?: string; label?: string }) {
  return (
    <div className={`w-full ${aspect} rounded-2xl border border-dashed border-white/10 bg-white/[0.03] flex items-center justify-center`}>
      {label && (
        <p className="text-[10px] font-mono text-white/15 tracking-widest uppercase px-4 text-center leading-relaxed">
          {label}
        </p>
      )}
    </div>
  )
}

const DOT_GRID = {
  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
  backgroundSize: '40px 40px',
}

// ─────────────────────────────────────────────
// SCROLL ANIMATION
// ─────────────────────────────────────────────
type Direction = 'up' | 'left' | 'right' | 'none'

function FadeIn({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  direction?: Direction
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hiddenClass =
    direction === 'left'  ? '-translate-x-10 opacity-0' :
    direction === 'right' ? 'translate-x-10 opacity-0'  :
    direction === 'none'  ? 'opacity-0'                  :
                            'translate-y-8 opacity-0'

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-x-0 translate-y-0' : hiddenClass
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────
// VIDEO CARD
// ─────────────────────────────────────────────
function VideoCard({
  nome,
  papel,
  video_id,
  active = false,
}: {
  nome: string
  papel: string
  video_id: string
  active?: boolean
}) {
  const [playing, setPlaying] = useState(false)

  return (
    <div
      className={`rounded-2xl overflow-hidden border transition-all duration-500 ${
        active
          ? 'border-[#FFB800]/30 shadow-[0_0_48px_rgba(255,184,0,0.12)]'
          : 'border-white/7'
      }`}
    >
      <div className="relative aspect-video bg-[#0A0D17]">
        {video_id && playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${video_id}?autoplay=1&rel=0`}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button
            className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-[#0F1420] group cursor-pointer"
            onClick={() => video_id && setPlaying(true)}
            disabled={!video_id}
            type="button"
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-transform duration-300 ${
                video_id
                  ? 'bg-[#FFB800] shadow-[0_0_32px_rgba(255,184,0,0.38)] group-hover:scale-110'
                  : 'bg-white/5 border border-dashed border-white/12'
              }`}
            >
              <Play
                className={`h-5 w-5 ml-0.5 ${
                  video_id ? 'fill-[#0B0F1A] text-[#0B0F1A]' : 'text-white/20'
                }`}
              />
            </div>
            <p
              className={`text-xs mt-3 ${
                video_id ? 'text-white/45' : 'text-white/20 font-mono tracking-widest uppercase'
              }`}
            >
              {video_id ? 'Assistir depoimento' : 'Vídeo em breve'}
            </p>
          </button>
        )}
      </div>
      <div className="bg-[#111827] px-4 sm:px-5 py-3.5 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">{nome}</p>
          <p className="text-[11px] text-[#8B9DC3] mt-0.5 truncate">{papel}</p>
        </div>
        {active && (
          <div className="w-2 h-2 rounded-full bg-[#FFB800] shrink-0 animate-pulse" />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// VIDEO CAROUSEL
// ─────────────────────────────────────────────
function VideoCarousel() {
  const [idx, setIdx] = useState(0)
  const total = VIDEO_DEPOS.length
  const prev  = () => setIdx(i => (i === 0 ? total - 1 : i - 1))
  const next  = () => setIdx(i => (i === total - 1 ? 0 : i + 1))

  const offsets = [-1, 0, 1] as const

  return (
    <div className="space-y-8">
      {/* Mobile — 1 por vez */}
      <div className="lg:hidden">
        <VideoCard {...VIDEO_DEPOS[idx]} active />
      </div>

      {/* Desktop — 3 visíveis, central em destaque */}
      <div className="hidden lg:grid grid-cols-3 gap-5 items-center">
        {offsets.map((offset, i) => {
          const d = VIDEO_DEPOS[(idx + offset + total) % total]
          const isCenter = offset === 0
          return (
            <div
              key={i}
              className={`transition-all duration-500 ${
                isCenter ? 'scale-100' : 'scale-95 opacity-50'
              }`}
            >
              <VideoCard {...d} active={isCenter} />
            </div>
          )
        })}
      </div>

      {/* Controles */}
      <div className="flex items-center justify-center gap-5">
        <button
          onClick={prev}
          type="button"
          className="w-11 h-11 rounded-full border border-white/12 bg-white/4 flex items-center justify-center text-white/50 hover:text-white hover:border-[#FFB800]/35 hover:bg-[#FFB800]/8 transition-all duration-200"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex gap-2">
          {VIDEO_DEPOS.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === idx ? 'w-7 bg-[#FFB800]' : 'w-1.5 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Depoimento ${i + 1}`}
            />
          ))}
        </div>
        <button
          onClick={next}
          type="button"
          className="w-11 h-11 rounded-full border border-white/12 bg-white/4 flex items-center justify-center text-white/50 hover:text-white hover:border-[#FFB800]/35 hover:bg-[#FFB800]/8 transition-all duration-200"
          aria-label="Próximo"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export function ComecarAnimated({
  depos: _depos,
  programas: _programas,
}: {
  depos: Depo[]
  programas: Programa[]
}) {
  return (
    <main className="bg-[#0B0F1A] text-white overflow-x-hidden">

      {/* ══════════════════════════════════
          1 — HERO
      ══════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-10 py-28 text-center overflow-hidden"
        style={DOT_GRID}
      >
        {/* Glow central */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[500px] rounded-full bg-[#FFB800]/5 blur-[140px]" />
        </div>

        {/* Badge 50% OFF — canto superior esquerdo */}
        <div className="absolute top-20 sm:top-24 left-5 sm:left-10 z-10">
          <div
            className="inline-flex items-baseline gap-1 rounded-xl bg-[#FFB800] px-3 py-1.5"
            style={{ boxShadow: '0 4px 24px rgba(255,184,0,0.4)' }}
          >
            <span className="text-xl sm:text-2xl font-black text-[#0B0F1A] leading-none">50%</span>
            <span className="text-[10px] font-bold text-[#0B0F1A] uppercase tracking-widest">OFF</span>
          </div>
          <p className="text-[10px] text-white/28 mt-1.5 ml-0.5">na primeira formação</p>
        </div>

        {/* Logo */}
        <div className="relative z-10 mb-8">
          <Image
            src="/despertamente-simbolo-branco.png"
            alt="Instituto Despertamente"
            width={68}
            height={68}
            className="object-contain mx-auto opacity-90"
            priority
          />
        </div>

        {/* Copy */}
        <div className="relative z-10 max-w-3xl space-y-5">
          <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#FFB800]/60">
            Instituto Despertamente
          </p>
          <h1
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.02] tracking-tight"
          >
            Transforme quem<br />
            <span className="text-[#FFB800]">você é</span> por dentro.
          </h1>
          <p className="text-base sm:text-lg text-white/48 leading-relaxed max-w-xl mx-auto">
            Neurociência, Psicanálise e PNL integrados em um método que explica por que você age como age — e como mudar de verdade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/turma38"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-8 py-4 text-base font-bold text-[#0B0F1A] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
              style={{ boxShadow: '0 8px 44px rgba(255,184,0,0.32)' }}
            >
              Quero começar <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="text-sm font-medium text-white/38 hover:text-white/72 transition-colors py-4"
            >
              Já tenho conta →
            </Link>
          </div>
          <p className="text-xs text-white/20 pt-1">2.400+ alunos · 94% de conclusão · 4.9 ★</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0B0F1A] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════
          2 — AULA GRATUITA
      ══════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeIn direction="left">
            <ImgPlaceholder aspect="aspect-video" label="Imagem — Aula Gratuita" />
          </FadeIn>
          <FadeIn direction="right" delay={120}>
            <div className="space-y-6">
              <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/60">
                Acesso imediato
              </p>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-4xl sm:text-5xl font-bold leading-[1.05]"
              >
                Aula gratuita<br />para começar.
              </h2>
              <p className="text-[#8B9DC3] leading-relaxed">
                Antes de qualquer decisão, assista à aula introdutória. Entenda o Método IDM e veja se faz sentido para você.
              </p>
              <ul className="space-y-3">
                {[
                  'Por que você repete os mesmos padrões',
                  'Como neurociência e psicanálise se conectam',
                  'O que diferencia o Método IDM',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/68">
                    <span className="w-5 h-5 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-[#FFB800]">
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/turma38"
                className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-6 py-3.5 text-sm font-bold text-[#0B0F1A] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
              >
                Assistir aula gratuita <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          3 — BANNER AMARELO FULL-WIDTH
      ══════════════════════════════════ */}
      <FadeIn direction="none">
        <section id="projetos" className="bg-[#FFB800] py-14 sm:py-20 px-5 sm:px-10 text-center">
          <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#0B0F1A]/40 mb-3">
            Instituto Despertamente
          </p>
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B0F1A] leading-[1.05]"
          >
            Projetos que Impactam<br />
            <span className="italic">sua Mente.</span>
          </h2>
          <p className="mt-4 text-sm text-[#0B0F1A]/48 max-w-lg mx-auto leading-relaxed">
            Cada programa foi desenvolvido para criar mudanças reais — não só conhecimento teórico.
          </p>
        </section>
      </FadeIn>

      {/* ══════════════════════════════════
          4 — GRID 3 PROJETOS
      ══════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { titulo: 'Psicanálise Integrativa', href: '/programas/psicanalise-integrativa', label: 'Psicanálise' },
            { titulo: 'IDM pelo Brasil',         href: '/programas/idm-pelo-brasil',         label: 'IDM pelo Brasil' },
            { titulo: 'Livre Formação IDM',      href: '/loja',                              label: '3º Projeto' },
          ].map((p, i) => (
            <FadeIn key={p.titulo} delay={i * 100}>
              <Link href={p.href} className="group block space-y-4">
                <ImgPlaceholder aspect="aspect-square" label={p.label} />
                <div className="flex items-center justify-between px-1">
                  <p className="text-base font-semibold text-white group-hover:text-[#FFB800] transition-colors">
                    {p.titulo}
                  </p>
                  <ArrowRight className="h-4 w-4 text-white/22 group-hover:text-[#FFB800] group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════
          5 — DETALHES DOS PROJETOS (alternado)
      ══════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 space-y-20 sm:space-y-28 pb-20 sm:pb-28">
        {[
          {
            titulo: 'Formação em Psicanálise Integrativa',
            desc: 'Uma formação certificante que integra Psicanálise Clássica, Neurociência e PNL. Aprenda a investigar o inconsciente — o seu e o dos seus pacientes.',
            cta: 'Conhecer a formação',
            href: '/programas/psicanalise-integrativa',
            label: 'Imagem — Psicanálise',
            reverse: false,
          },
          {
            titulo: 'IDM pelo Brasil',
            desc: 'Workshops presenciais intensivos em cidades do Brasil. 4 dias de imersão com supervisão ao vivo, técnicas práticas e certificação incluída.',
            cta: 'Ver datas e cidades',
            href: '/programas/idm-pelo-brasil',
            label: 'Imagem — IDM pelo Brasil',
            reverse: true,
          },
        ].map((p) => (
          <div
            key={p.titulo}
            className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
              p.reverse ? 'lg:[&>*:first-child]:order-2' : ''
            }`}
          >
            <FadeIn direction={p.reverse ? 'right' : 'left'}>
              <ImgPlaceholder aspect="aspect-[4/3]" label={p.label} />
            </FadeIn>
            <FadeIn direction={p.reverse ? 'left' : 'right'} delay={120}>
              <div className="space-y-5">
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-3xl sm:text-4xl font-bold leading-[1.05]"
                >
                  {p.titulo}
                </h3>
                <p className="text-[#8B9DC3] leading-relaxed">{p.desc}</p>
                <Link
                  href={p.href}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFB800] hover:gap-3 transition-all duration-200"
                >
                  {p.cta} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </FadeIn>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════
          6 — FORMAÇÃO PSICANÁLISE
      ══════════════════════════════════ */}
      <section id="formacao" className="bg-[#111827] py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn className="text-center space-y-4 max-w-2xl mx-auto">
            <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/60">
              Formação completa
            </p>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold leading-[1.05]"
            >
              Psicanálise Integrativa.
            </h2>
            <p className="text-[#8B9DC3] leading-relaxed">
              Do inconsciente à prática clínica. Teoria, análise pessoal e supervisão em um único percurso.
            </p>
          </FadeIn>

          <FadeIn>
            <ImgPlaceholder aspect="aspect-[21/9]" label="Imagem principal — Formação" />
          </FadeIn>

          <div className="space-y-6">
            <FadeIn>
              <h3 className="text-sm font-semibold text-white/50 text-center uppercase tracking-widest">
                O que você aprende
              </h3>
            </FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {[
                'Fundamentos da Psicanálise',
                'Análise Pessoal',
                'Técnicas Integrativas',
                'PNL na Prática Clínica',
              ].map((m, i) => (
                <FadeIn key={m} delay={i * 80}>
                  <div className="space-y-3">
                    <ImgPlaceholder aspect="aspect-[4/3]" label={m} />
                    <p className="text-xs text-white/48 text-center leading-snug">{m}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn className="text-center">
            <Link
              href="/programas/psicanalise-integrativa"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-7 py-4 text-sm font-bold text-[#0B0F1A] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
            >
              Ver a formação completa <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          7 — CERTIFICADOS
      ══════════════════════════════════ */}
      <section id="certificados" className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <FadeIn direction="left">
            <ImgPlaceholder aspect="aspect-[4/3]" label="Imagem — Certificado" />
          </FadeIn>
          <FadeIn direction="right" delay={120}>
            <div className="space-y-6">
              <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/60">
                Reconhecimento
              </p>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-4xl sm:text-5xl font-bold leading-[1.05]"
              >
                Certificados<br />que abrem portas.
              </h2>
              <p className="text-[#8B9DC3] leading-relaxed">
                Ao concluir cada programa você recebe um certificado oficial do Instituto Despertamente — reconhecido, digital e vinculado ao seu perfil.
              </p>
              <ul className="space-y-3">
                {[
                  'Certificação digital com QR code de validação',
                  'Vinculado ao seu CPF para verificação',
                  'Compartilhável no LinkedIn e portfólio',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/68">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          8 — IDM PELO BRASIL
      ══════════════════════════════════ */}
      <section className="bg-[#111827] py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <FadeIn className="text-center space-y-4">
            <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/60">Presencial</p>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold leading-[1.05]"
            >
              IDM pelo Brasil.
            </h2>
            <p className="text-[#8B9DC3] max-w-lg mx-auto leading-relaxed">
              Imersões presenciais em cidades do Brasil. 4 dias de prática intensa com supervisão ao vivo.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                titulo: 'Psicanálise',
                desc: 'Psicanálise Integrativa aplicada em tempo real, com supervisão individual nas sessões práticas.',
                label: 'Imagem — Psicanálise',
              },
              {
                titulo: 'PNL',
                desc: 'Practitioner e Master PNL com certificação internacional. Técnicas avançadas de mudança comportamental.',
                label: 'Imagem — PNL',
              },
            ].map((card, i) => (
              <FadeIn key={card.titulo} delay={i * 120}>
                <div className="rounded-2xl border border-white/6 bg-[#0B0F1A] overflow-hidden h-full flex flex-col">
                  <ImgPlaceholder aspect="aspect-video" label={card.label} />
                  <div className="px-5 pb-5 pt-4 space-y-3 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold text-white">{card.titulo}</h3>
                    <p className="text-sm text-[#8B9DC3] leading-relaxed flex-1">{card.desc}</p>
                    <div>
                      <Link
                        href="/programas/idm-pelo-brasil"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#0B0F1A] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
                      >
                        Ver datas <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <p className="text-center text-[#8B9DC3] leading-relaxed max-w-lg mx-auto text-sm">
              Ao final da imersão você recebe o certificado IDM pelo Brasil com carga horária e validação digital. Metodologia ao vivo, transformação real.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════
          9 — DEPOIMENTOS (vídeos)
      ══════════════════════════════════ */}
      <section id="depoimentos" className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
        <FadeIn className="text-center space-y-3 mb-12">
          <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/60">
            Quem já passou pelo IDM
          </p>
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl font-bold"
          >
            Depoimentos.
          </h2>
        </FadeIn>
        <FadeIn>
          <VideoCarousel />
        </FadeIn>
      </section>

      {/* ══════════════════════════════════
          10 — CTA FINAL
      ══════════════════════════════════ */}
      <section
        className="relative py-28 sm:py-36 px-5 sm:px-10 text-center overflow-hidden"
        style={{ ...DOT_GRID, background: '#0B0F1A' }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[300px] rounded-full bg-[#FFB800]/5 blur-[110px]" />
        </div>
        <FadeIn className="relative max-w-2xl mx-auto space-y-6">
          <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/50">
            Livre formação
          </p>
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-5xl sm:text-6xl font-bold leading-[1.0]"
          >
            Livre formação<br />com IDM.
          </h2>
          <p className="text-[#8B9DC3] leading-relaxed max-w-md mx-auto">
            Comece hoje, no seu ritmo. Acesso gratuito para criar sua conta e explorar a plataforma.
          </p>
          <div>
            <Link
              href="/turma38"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-9 py-5 text-base font-bold text-[#0B0F1A] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
              style={{ boxShadow: '0 8px 52px rgba(255,184,0,0.28)' }}
            >
              Começar agora — é grátis <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-xs text-white/18">Sem cartão de crédito · Acesso imediato</p>
        </FadeIn>
      </section>

    </main>
  )
}
