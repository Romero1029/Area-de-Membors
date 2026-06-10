'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

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
// SCROLL ANIMATION
// Ref: prefers-reduced-motion via CSS transition
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
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hiddenClass =
    direction === 'left'  ? '-translate-x-8 opacity-0' :
    direction === 'right' ? 'translate-x-8 opacity-0'  :
    direction === 'none'  ? 'opacity-0'                  :
                            'translate-y-6 opacity-0'

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
// SEÇÃO 2 — MANIFESTO
// "O que o IDM acredita?" — crença antes de produto
// Ref: Cialdini (âncora de crenças precede persuasão)
// Whitespace dramático: Fadeyev — "silence communicates premium"
// ─────────────────────────────────────────────
function ManifestoSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-32 sm:py-48">
      <div className="max-w-3xl">
        <FadeIn direction="none">
          <h2 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-white leading-[1.0] tracking-tight">
            Nem toda mudança<br />começa do lado de fora.
          </h2>
        </FadeIn>

        <FadeIn delay={80}>
          <div className="mt-10 space-y-5 text-white/60 text-lg leading-relaxed">
            <p>
              Muitas pessoas passam a vida tentando mudar seus resultados.
              Poucas aprendem a compreender os padrões que produzem esses resultados.
            </p>
            <p>
              No IDM, acreditamos que a consciência precede a transformação.
            </p>
            <p className="text-white/35">
              Porque aquilo que você ilumina na consciência<br className="hidden sm:block" />
              deixa de comandar você no escuro.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 3 — SOBRE O INSTITUTO
// Overline 1 de 2 — raridade = impacto (Von Restorff)
// Layout 2 colunas: headline esquerda / texto direita
// ─────────────────────────────────────────────
const STATS = [
  { n: '12.000+', label: 'Pessoas impactadas' },
  { n: '9 anos',  label: 'De metodologia própria' },
  { n: 'Brasil',  label: 'Alunos em todas as regiões do país' },
]

function SobreSection() {
  return (
    <section className="border-t border-white/[0.08] max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-20">
      <FadeIn direction="none">
        <p className="text-xs uppercase tracking-[0.22em] text-white/25 font-medium mb-10">
          Sobre o Instituto
        </p>

        <div className="grid lg:grid-cols-[55%_1fr] gap-12 lg:gap-20 items-start">
          <div className="space-y-5">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05]">
              Uma instituição construída para despertar consciências.
            </h2>
            <div className="space-y-0.5 text-white font-semibold text-lg leading-relaxed">
              <p>Formamos profissionais.</p>
              <p>Desenvolvemos seres humanos.</p>
            </div>
          </div>

          <div className="space-y-5 lg:pt-1">
            <p className="text-white/60 leading-relaxed">
              Há mais de 9 anos, o Instituto DespertaMente desenvolve uma metodologia própria
              que integra conhecimento, consciência e prática.
            </p>
            <p className="text-white/35 leading-relaxed text-sm">
              Porque acreditamos que toda transformação duradoura começa pela
              compreensão de si mesmo.
            </p>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={80}>
        <div className="mt-16 border-t border-white/[0.08] pt-12 grid grid-cols-3 gap-8">
          {STATS.map(({ n, label }) => (
            <div key={label}>
              <p className="font-display text-4xl sm:text-5xl font-bold text-white">{n}</p>
              <p className="mt-2 text-xs text-white/30 leading-snug">{label}</p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 4 — METODOLOGIA
// "Como o IDM faz isso?"
// 3 pilares — editorial sem cards
// Ref: Cognitive fluency (Oppenheimer, 2006) — clareza sinaliza autoridade
// ─────────────────────────────────────────────
const PILARES = [
  {
    n: '01',
    titulo: 'Teoria',
    desc: 'Uma base sólida para compreender comportamento, emoções e processos psíquicos.',
  },
  {
    n: '02',
    titulo: 'Análise Pessoal',
    desc: 'Porque ninguém conduz outra pessoa por caminhos que nunca percorreu dentro de si.',
  },
  {
    n: '03',
    titulo: 'Supervisão Clínica',
    desc: 'Acompanhamento que transforma conhecimento em segurança profissional.',
  },
]

function MetodologiaSection() {
  return (
    <section className="border-t border-white/[0.08] bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">

        <FadeIn direction="none" className="mb-16">
          <p className="text-xs uppercase tracking-[0.22em] text-white/25 font-medium mb-4">
            Metodologia
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05]">
            Conhecimento. Consciência. Prática.
          </h2>
          <p className="mt-4 text-white/50 max-w-lg leading-relaxed">
            Nossa formação foi construída sobre três pilares fundamentais.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-12 sm:gap-8 lg:gap-16">
          {PILARES.map((p, i) => (
            <FadeIn key={p.titulo} delay={i * 80}>
              <div className="space-y-4">
                <span className="text-xs text-white/20 font-mono">{p.n}</span>
                <h3 className="font-display text-2xl font-bold text-white">{p.titulo}</h3>
                <p className="text-white/50 leading-relaxed text-sm">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 5 — PARA QUEM É
// Qualificação editorial — cria ressonância antes da oferta
// Ref: Miller (StoryBrand) — cliente como herói, IDM como guia
// ─────────────────────────────────────────────
const PARA_QUEM = [
  'Para quem busca autoconhecimento.',
  'Para quem deseja atuar profissionalmente.',
  'Para profissionais da área humana.',
  'Para quem deseja compreender melhor emoções, relacionamentos e comportamento.',
  'Para quem acredita que crescimento pessoal também é uma forma de servir pessoas.',
]

function ParaQuemSection() {
  return (
    <section className="border-t border-white/[0.08] max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
      <div className="grid lg:grid-cols-[38%_1fr] gap-12 lg:gap-20 items-start">

        <FadeIn direction="none">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05]">
            Para quem<br />é o IDM?
          </h2>
        </FadeIn>

        <FadeIn delay={80}>
          <ul className="space-y-6">
            {PARA_QUEM.map((item, i) => (
              <li key={i} className="flex items-start gap-5 text-white/65 leading-relaxed">
                <span className="text-white/20 font-mono text-xs mt-1 shrink-0">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </FadeIn>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 6 — PROGRAMAS
// "O que exatamente o IDM oferece?"
// Lista editorial numerada — sem cards
// Ref: Hick's Law — clareza de escolha aumenta conversão
// ─────────────────────────────────────────────
const PROGRAMAS_DATA = [
  {
    num: '01',
    titulo: 'Psicanálise Integrativa',
    desc: 'Uma formação construída para unir teoria, análise pessoal e supervisão clínica.',
    href: '/programas/psicanalise-integrativa',
  },
  {
    num: '02',
    titulo: 'IDM Pelo Brasil',
    desc: 'Experiências presenciais de desenvolvimento humano realizadas em diferentes cidades do país.',
    href: '/programas/idm-pelo-brasil',
  },
  {
    num: '03',
    titulo: 'Live Formação IDM',
    desc: 'Conteúdos, encontros e experiências de aprofundamento para quem deseja continuar evoluindo.',
    href: '/loja',
  },
]

function ProgramasSection() {
  return (
    <section className="border-t border-white/[0.08] bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">

        <FadeIn direction="none" className="mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Caminhos diferentes. O mesmo propósito.
          </h2>
        </FadeIn>

        <div>
          {PROGRAMAS_DATA.map((p, i) => (
            <FadeIn key={p.titulo} delay={i * 60}>
              <Link
                href={p.href}
                className="group flex items-start sm:items-center justify-between gap-6 border-t border-white/[0.08] py-7 hover:bg-white/[0.015] transition-colors duration-200 -mx-4 px-4 rounded-sm"
              >
                <div className="flex items-start sm:items-center gap-6 sm:gap-10 min-w-0">
                  <span className="text-xs text-white/25 font-mono shrink-0 mt-1 sm:mt-0">{p.num}</span>
                  <div className="min-w-0">
                    <p className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-white/90 transition-colors">
                      {p.titulo}
                    </p>
                    <p className="mt-1 text-sm text-white/40 leading-snug">{p.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all shrink-0 mt-1 sm:mt-0" />
              </Link>
            </FadeIn>
          ))}
          <div className="border-t border-white/[0.08]" />
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 7 — FORMAÇÃO
// Detalhamento para leads já qualificados
// Checklist simples — sem ícones dourados decorativos
// ─────────────────────────────────────────────
const FORMACAO_ITEMS = [
  'Formação estruturada',
  'Aulas ao vivo e gravadas',
  'Análise pessoal',
  'Supervisão clínica',
  'Certificação',
  'Comunidade de alunos',
  'Desenvolvimento humano',
]

function FormacaoSection() {
  return (
    <section id="formacao" className="border-t border-white/[0.08] max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

        <FadeIn direction="left">
          <div className="aspect-[3/4] rounded-lg bg-[#111D48] w-full" />
        </FadeIn>

        <FadeIn direction="right" delay={100}>
          <div className="space-y-8 lg:pt-4">

            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05]">
                Psicanálise<br />Integrativa.
              </h2>
              <p className="mt-4 text-white/55 leading-relaxed">
                Uma formação construída para quem deseja compreender a mente humana
                com profundidade e responsabilidade.
              </p>
            </div>

            <div className="border-t border-white/[0.08] pt-8">
              <p className="text-xs uppercase tracking-[0.2em] text-white/25 mb-5">
                O que você encontra
              </p>
              <ul className="space-y-3.5">
                {FORMACAO_ITEMS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white/65">
                    <Check className="h-3.5 w-3.5 text-white/25 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-white/[0.08] pt-8 flex items-center gap-5">
              <Link
                href="/programas/psicanalise-integrativa"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FFB800] px-6 py-3 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
              >
                Ver formação completa <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <div className="text-xs text-white/30 leading-snug">
                Parceria<br />Universidade Anhanguera
              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 8 — DIFERENCIAIS
// Objection handling — 2×2 editorial sem cards
// ─────────────────────────────────────────────
const DIFERENCIAIS = [
  {
    titulo: 'Metodologia Própria',
    desc: 'Mais de uma década aperfeiçoando uma jornada de formação humana e profissional.',
  },
  {
    titulo: 'Formação Integrativa',
    desc: 'Uma visão ampliada da mente humana e dos processos de transformação.',
  },
  {
    titulo: 'Desenvolvimento Pessoal',
    desc: 'Aqui o aluno não aprende apenas sobre o outro. Aprende também sobre si mesmo.',
  },
  {
    titulo: 'Comunidade',
    desc: 'Uma rede de pessoas comprometidas com crescimento, consciência e propósito.',
  },
]

function DiferenciaisSection() {
  return (
    <section className="border-t border-white/[0.08] bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">

        <FadeIn direction="none" className="mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05]">
            O que torna<br />o IDM diferente.
          </h2>
        </FadeIn>

        <div className="grid sm:grid-cols-2 gap-x-16 gap-y-10">
          {DIFERENCIAIS.map((d, i) => (
            <FadeIn key={d.titulo} delay={i * 60}>
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-xs text-white/20 font-mono shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-semibold text-white text-lg">{d.titulo}</h3>
                </div>
                <p className="text-white/45 text-sm leading-relaxed pl-8">{d.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 9 — DEPOIMENTOS
// Texto puro — sem vídeos placeholder, sem cards
// Ref: BJ Fogg (Stanford) — "autenticidade do nome + contexto"
// Ref: Basecamp — texto simples converte mais que vídeo ausente
// ─────────────────────────────────────────────
function DepoimentosSection({ depos }: { depos: Depo[] }) {
  if (!depos.length) return null
  return (
    <section className="border-t border-white/[0.08] max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">

      <FadeIn direction="none" className="mb-14">
        <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.05]">
          Quem decidiu<br />olhar para dentro.
        </h2>
        <p className="mt-4 text-white/40 max-w-md leading-relaxed text-sm">
          Histórias de pessoas que encontraram no conhecimento uma nova forma de
          compreender a própria vida.
        </p>
      </FadeIn>

      <div className="grid sm:grid-cols-3 gap-10 sm:gap-12">
        {depos.slice(0, 3).map((d, i) => (
          <FadeIn key={i} delay={i * 70}>
            <div className="space-y-5">
              <p className="text-white/60 leading-relaxed text-sm">
                &ldquo;{d.texto}&rdquo;
              </p>
              <div className="border-t border-white/[0.06] pt-4">
                <p className="text-sm font-semibold text-white">{d.nome}</p>
                <p className="text-xs text-white/30 mt-0.5">{d.papel}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 10 — CTA FINAL
// "O despertar começa com uma decisão."
// Linguagem institucional — não SaaS
// Ref: Cialdini (autoridade > facilidade)
// Layout: headline esquerda, botão direita
// ─────────────────────────────────────────────
function CTASection() {
  return (
    <section className="border-t border-white/[0.08] bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-32 sm:py-48">
        <FadeIn direction="none">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">

            <div className="space-y-6">
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95]">
                O despertar começa<br />com uma decisão.
              </h2>
              <div className="space-y-1 text-white/45 leading-relaxed">
                <p>Conhecimento pode informar.</p>
                <p>Consciência pode transformar.</p>
                <p className="text-white/25">Sua jornada começa agora.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/turma38"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFB800] px-8 py-4 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
              >
                Quero minha vaga <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-center text-[11px] text-white/20">
                Vagas limitadas. Certificação MEC.
              </p>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// Ordem das seções segue a regra de branding:
// Crença → Como → O que
// ─────────────────────────────────────────────
export function ComecarAnimated({
  depos,
  programas: _programas,
}: {
  depos: Depo[]
  programas: Programa[]
}) {
  return (
    <main className="bg-[#0D1638] text-white overflow-x-hidden">

      {/* 1 — HERO: primeiro contato — headline de crença */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: 'clamp(520px, 90vw, 780px)' }}
      >
        <img
          src="/hero-banner.png"
          alt="Instituto Despertamente"
          className="absolute inset-0 w-full h-full object-cover object-top"
          aria-hidden="true"
        />
        {/* Top fade — suaviza navbar */}
        <div
          className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #0D1638 0%, transparent 100%)' }}
        />
        {/* Bottom overlay para legibilidade do texto */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #0D1638 22%, rgba(13,22,56,0.3) 55%, transparent 85%)' }}
        />

        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-20 sm:pb-28">
          <div className="max-w-2xl space-y-6">
            <h1 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-bold text-white leading-[1.0]">
              Existe uma parte da sua história<br className="hidden sm:block" />
              que ainda não foi compreendida.
            </h1>
            <p className="text-white/60 text-base sm:text-lg leading-relaxed max-w-lg">
              Psicanálise Integrativa, desenvolvimento humano e formação profissional
              em uma metodologia construída para quem deseja compreender a mente humana
              e transformar vidas.
            </p>
            <Link
              href="/turma38"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFB800] px-7 py-3.5 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
            >
              Quero iniciar minha jornada <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2 — MANIFESTO: "O que o IDM acredita?" */}
      <ManifestoSection />

      {/* 3 — SOBRE: quem somos + métricas */}
      <SobreSection />

      {/* 4 — METODOLOGIA: "Como o IDM faz isso?" */}
      <MetodologiaSection />

      {/* 5 — PARA QUEM É: qualificação antes da oferta */}
      <ParaQuemSection />

      {/* 6 — PROGRAMAS: "O que exatamente o IDM oferece?" */}
      <ProgramasSection />

      {/* 7 — FORMAÇÃO: detalhamento para leads prontos */}
      <FormacaoSection />

      {/* 8 — DIFERENCIAIS: objeções finais */}
      <DiferenciaisSection />

      {/* 9 — DEPOIMENTOS: prova social */}
      <DepoimentosSection depos={depos} />

      {/* 10 — CTA FINAL: ação */}
      <CTASection />

    </main>
  )
}
