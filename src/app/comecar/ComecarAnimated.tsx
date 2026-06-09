'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
// Headline grande à esquerda + grid de imagens
// Ref: Nielsen Norman F-pattern, Whitespace (Fadeyev)
// ─────────────────────────────────────────────
function ManifestoSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-28 sm:py-40">
      <div className="grid lg:grid-cols-[55%_1fr] gap-12 lg:gap-20 items-center">

        {/* Texto — alinhado à esquerda */}
        <FadeIn direction="none">
          <div className="space-y-8">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-[clamp(3rem,7vw,6rem)] font-bold text-white leading-[0.92] tracking-tight"
            >
              Psicanálise<br />
              <span className="text-white/40">Integrativa.</span>
            </h2>

            <p className="text-white/60 text-lg leading-relaxed max-w-lg">
              Uma formação que une Psicanálise Clássica, Neurociência e PNL.
              Em parceria com a <span className="text-white/85 font-medium">Universidade Anhanguera</span> —
              certificado nas diretrizes do <span className="text-white/85 font-medium">MEC</span>, com PPC aprovado.
            </p>

            <div className="flex items-center gap-5 pt-2">
              <Link
                href="/turma38"
                className="inline-flex items-center gap-2 rounded-lg bg-[#FFB800] px-7 py-3.5 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200"
              >
                Garantir minha vaga <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#formacao"
                className="text-sm font-medium text-white/40 hover:text-white/70 transition-colors"
              >
                Conhecer a formação
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* Grid de imagens — sem dashed border, sem labels */}
        <FadeIn direction="right" delay={120}>
          <div className="grid grid-cols-2 gap-3">
            <div className="aspect-[3/4] rounded-lg bg-[#111D48]" />
            <div className="aspect-[3/4] rounded-lg bg-[#0F1940] mt-8" />
            <div className="aspect-[4/3] rounded-lg bg-[#0F1940]" />
            <div className="aspect-[4/3] rounded-lg bg-[#111D48]" />
          </div>
        </FadeIn>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 3 — INSTITUTO
// Stats + texto institucional
// Overline usada aqui — único uso no site inteiro
// Ref: Von Restorff Effect (raridade = impacto)
// ─────────────────────────────────────────────
function InstitutoSection() {
  return (
    <section className="border-t border-white/8 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 pb-20">

      <FadeIn direction="none">
        {/* Overline — única no site */}
        <p className="text-xs uppercase tracking-[0.22em] text-white/30 font-medium mb-8">
          Sobre o Instituto
        </p>

        {/* Headline + dois parágrafos em colunas */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.05]"
          >
            Uma instituição<br />construída para<br />transformar vidas.
          </h2>
          <div className="space-y-5 pt-1">
            <p className="text-white/60 leading-relaxed">
              Fundado há 9 anos, o Instituto Despertamente democratiza o acesso ao conhecimento
              em psicanálise, neurociência e desenvolvimento humano — com rigor acadêmico,
              metodologia integrativa e impacto comprovado em mais de 12 mil vidas.
            </p>
            <p className="text-white/45 leading-relaxed text-sm">
              Nossa abordagem integra diferentes campos do saber porque entendemos que o ser humano
              não cabe em uma única teoria. Cada formação é desenhada para quem quer ir fundo —
              não apenas aprender, mas se transformar.
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Stats — sem cards, só números e labels */}
      <FadeIn delay={80}>
        <div className="mt-16 border-t border-white/8 pt-12 grid grid-cols-3 gap-8">
          {[
            { n: '12.000+', label: 'alunos formados' },
            { n: '38',      label: 'turmas realizadas' },
            { n: '9 anos',  label: 'de metodologia' },
          ].map(({ n, label }) => (
            <div key={label}>
              <p
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-4xl sm:text-5xl font-bold text-white"
              >
                {n}
              </p>
              <p className="mt-1.5 text-xs text-white/30 uppercase tracking-[0.15em]">{label}</p>
            </div>
          ))}
        </div>
      </FadeIn>

    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 4 — PROGRAMAS
// Lista editorial numerada — sem cards, sem imagens
// Ref: Hick's Law — menos opções, mais conversão
// Referência visual: índice de revista, menu Michelin
// ─────────────────────────────────────────────
const PROGRAMAS = [
  {
    num: '01',
    titulo: 'Psicanálise Integrativa',
    desc: 'Formação certificada com parceria universitária. Diretrizes MEC, PPC aprovado.',
    href: '/programas/psicanalise-integrativa',
  },
  {
    num: '02',
    titulo: 'IDM pelo Brasil',
    desc: 'Imersões presenciais intensivas em cidades do Brasil. 4 dias com supervisão ao vivo.',
    href: '/programas/idm-pelo-brasil',
  },
  {
    num: '03',
    titulo: 'Livre Formação IDM',
    desc: 'Acesso à plataforma completa com cursos e programas no seu ritmo.',
    href: '/loja',
  },
]

function ProgramasSection() {
  return (
    <section id="projetos" className="border-t border-white/8 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">

      <FadeIn direction="none" className="mb-12">
        <h2
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          className="text-2xl sm:text-3xl font-bold text-white"
        >
          Nossos programas
        </h2>
      </FadeIn>

      <div>
        {PROGRAMAS.map((p, i) => (
          <FadeIn key={p.titulo} delay={i * 60}>
            <Link
              href={p.href}
              className="group flex items-start sm:items-center justify-between gap-6 border-t border-white/8 py-7 hover:bg-white/[0.015] transition-colors duration-200 -mx-4 px-4 rounded-sm"
            >
              <div className="flex items-start sm:items-center gap-6 sm:gap-10 min-w-0">
                <span className="text-xs text-white/25 font-mono shrink-0 mt-1 sm:mt-0">{p.num}</span>
                <div className="min-w-0">
                  <p
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    className="text-xl sm:text-2xl font-bold text-white group-hover:text-white/90 transition-colors"
                  >
                    {p.titulo}
                  </p>
                  <p className="mt-1 text-sm text-white/40 leading-snug">{p.desc}</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all shrink-0 mt-1 sm:mt-0" />
            </Link>
          </FadeIn>
        ))}
        <div className="border-t border-white/8" />
      </div>

    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 5 — FORMAÇÃO
// Imagem + currículo como universidade
// Ref: Cognitive fluency (Oppenheimer) — clareza = autoridade
// ─────────────────────────────────────────────
const MODULOS = [
  'Fundamentos da Psicanálise Clássica',
  'Neurociência Aplicada ao Comportamento',
  'Análise Pessoal e Supervisão',
  'Técnicas Integrativas',
  'PNL na Prática Clínica',
  'Certificação e Prática Profissional',
]

function FormacaoSection() {
  return (
    <section
      id="formacao"
      className="border-t border-white/8 bg-[#0A1232] py-24 sm:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Imagem — rounded-lg, sem dashed border */}
          <FadeIn direction="left">
            <div className="aspect-[3/4] rounded-lg bg-[#111D48] w-full" />
          </FadeIn>

          {/* Texto institucional */}
          <FadeIn direction="right" delay={100}>
            <div className="space-y-8 lg:pt-4">

              <div>
                <h2
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-4xl sm:text-5xl font-bold text-white leading-[1.05]"
                >
                  Psicanálise<br />Integrativa.
                </h2>
                <p className="mt-4 text-white/55 leading-relaxed">
                  Uma formação completa do inconsciente à prática clínica. Teoria,
                  análise pessoal e supervisão em um único percurso certificado.
                </p>
              </div>

              <div className="border-t border-white/8 pt-8">
                <p className="text-xs uppercase tracking-[0.2em] text-white/30 mb-5">
                  Conteúdo do curso
                </p>
                <ul className="space-y-3.5">
                  {MODULOS.map((m, i) => (
                    <li key={m} className="flex items-center gap-4 text-sm text-white/60">
                      <span className="text-white/20 font-mono text-[11px] shrink-0 w-5 text-right">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-white/8 pt-8 flex items-center gap-5">
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
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 6 — DEPOIMENTOS
// Texto puro — sem video, sem carousel
// Ref: BJ Fogg "Promised but unfulfilled" destroys trust
// Ref: CXL Institute — texto com nome real converte mais
// ─────────────────────────────────────────────
function DepoimentosSection({ depos }: { depos: Depo[] }) {
  const shown = depos.slice(0, 3)
  if (shown.length === 0) return null

  return (
    <section
      id="depoimentos"
      className="border-t border-white/8 max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24"
    >
      <FadeIn direction="none" className="mb-14">
        <h2
          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Quem já passou<br />pelo IDM.
        </h2>
      </FadeIn>

      <div className="grid sm:grid-cols-3 gap-10 sm:gap-8 lg:gap-12">
        {shown.map((d, i) => (
          <FadeIn key={i} delay={i * 80} direction="up">
            <div className="space-y-5">
              <p className="text-white/60 leading-relaxed text-[15px]">
                &ldquo;{d.texto}&rdquo;
              </p>
              <div className="border-t border-white/8 pt-4">
                <p className="text-sm font-semibold text-white">{d.nome}</p>
                <p className="text-xs text-white/35 mt-0.5">{d.papel}</p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>

    </section>
  )
}

// ─────────────────────────────────────────────
// SEÇÃO 7 — CTA FINAL
// Linguagem institucional — não SaaS
// Ref: Cialdini (autoridade > facilidade), StoryBrand
// Layout: headline esquerda / botão direita
// ─────────────────────────────────────────────
function CTASection() {
  return (
    <section className="border-t border-white/8 bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-32 sm:py-48">
        <FadeIn direction="none">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">

            <div className="space-y-5">
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95]"
              >
                Inscreva-se para<br />a Turma 38.
              </h2>
              <p className="text-white/45 text-lg max-w-md leading-relaxed">
                Vagas limitadas. Certificação reconhecida pelo MEC.<br />
                Parceria com a Universidade Anhanguera.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/turma38"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFB800] px-8 py-4 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200 whitespace-nowrap"
              >
                Garantir minha vaga <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-center text-[11px] text-white/20">
                Acesso imediato após inscrição
              </p>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────
// MAIN
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

      {/* 1 — HERO */}
      <section className="w-full">
        <img
          src="/hero-banner.png"
          alt="Instituto Despertamente"
          className="w-full block"
        />
      </section>

      {/* 2 — MANIFESTO */}
      <ManifestoSection />

      {/* 3 — INSTITUTO */}
      <InstitutoSection />

      {/* 4 — PROGRAMAS */}
      <ProgramasSection />

      {/* 5 — FORMAÇÃO */}
      <FormacaoSection />

      {/* 6 — DEPOIMENTOS */}
      <DepoimentosSection depos={depos} />

      {/* 7 — CTA FINAL */}
      <CTASection />

    </main>
  )
}
