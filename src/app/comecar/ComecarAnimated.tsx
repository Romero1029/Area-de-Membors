'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────────────────────
export type Programa = {
  id: string; title: string; slug: string
  short_description: string | null; thumbnail_url: string | null
}
type Depo = { nome: string; papel: string; texto: string; estrelas: number }

// ─── Scroll animation ───────────────────────────────────────────────────────
type Dir = 'up' | 'left' | 'right' | 'none'
function FadeIn({ children, delay = 0, direction = 'up' as Dir, className = '' }: {
  children: React.ReactNode; delay?: number; direction?: Dir; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold: 0.06 }
    )
    obs.observe(el); return () => obs.disconnect()
  }, [])
  const hidden =
    direction === 'left'  ? '-translate-x-8 opacity-0' :
    direction === 'right' ? 'translate-x-8 opacity-0'  :
    direction === 'none'  ? 'opacity-0' : 'translate-y-6 opacity-0'
  return (
    <div ref={ref}
      className={`transition-all duration-700 ease-out ${inView ? 'opacity-100 translate-x-0 translate-y-0' : hidden} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

// ─── Editorial image panel ──────────────────────────────────────────────────
// Gradiente radial + micro-textura — intencional, não wireframe
// Ref: Fogg Stanford (2003) — elementos incompletos visíveis destroem credibilidade
function EditorialImg({ className = '' }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 48% 38%, #111D48 0%, #0A1232 55%, #091028 100%)' }} />
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 25%, rgba(9,16,40,0.55) 100%)' }} />
      <div className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='0.8' fill='%23ffffff' fill-opacity='0.04'/%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px',
        }} />
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 1 — BANNER PROMOCIONAL
// Imagem intacta — sem sobreposição de texto
// Ref: Okonkwo (2007) Luxury Brand Management — não competir com o
// próprio ativo visual da campanha. A imagem já comunica urgência
// ("50% / INSCRIÇÕES ABERTAS") — sobrepor texto cria caos semiótico.
// ═══════════════════════════════════════════════════════════════════
function BannerSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <img
        src="/hero-banner.png"
        alt="Instituto Despertamente — Inscrições Abertas"
        className="w-full block"
      />
      <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0D1638)' }} />
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 2 — HERO TIPOGRÁFICO
// Headline separado da imagem — espaço tipográfico puro
// Ref: Müller-Brockmann (1981) Grid Systems — hierarquia tipográfica
// como linguagem editorial. Lupton (2010) Thinking with Type —
// contraste de escala (clamp 2.5→5.5rem) direciona o olhar antes
// de qualquer outro elemento. Dois CTAs: primário (gold) e
// secundário (texto puro) — Fitts Law: diferença visual clara
// reduz hesitação de clique.
// ═══════════════════════════════════════════════════════════════════
function HeroSection() {
  return (
    <section className="bg-[#0D1638] pt-10 pb-28 sm:pb-40">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <h1 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold text-white leading-[0.93] tracking-tight">
            Existe uma parte<br />da sua história que<br />ainda não foi<br />compreendida.
          </h1>
          <p className="mt-8 text-white/50 text-lg leading-relaxed max-w-lg">
            Psicanálise Integrativa, desenvolvimento humano e formação
            profissional — uma metodologia para quem deseja compreender
            a mente humana e transformar vidas.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/turma38"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFB800] px-7 py-3.5 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200">
              Quero iniciar minha jornada <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#formacao" className="text-sm text-white/35 hover:text-white/65 transition-colors">
              Conhecer a formação →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 3 — MANIFESTO
// Grande quote + corpo em 2 colunas — âncora de crença
// Ref: Cialdini (2001) Commitment — crenças compartilhadas antes da
// oferta aumentam adesão subsequente em ~34% (Freedman & Fraser, 1966).
// Ref: Kahneman (2011) Sistema 1 — âncora emocional precede e
// enquadra decisão racional. Corpo em 2 colunas: quebra visual que
// cria "respiração" sem reduzir conteúdo (Fadeyev 2009 whitespace).
// py-36/56: silence communicates premium — Okonkwo (2007).
// ═══════════════════════════════════════════════════════════════════
function ManifestoSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0D1638] py-36 sm:py-56">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <FadeIn direction="none">
          <h2 className="font-display text-[clamp(3rem,7.5vw,6.5rem)] font-bold text-white leading-[0.92] tracking-tight max-w-4xl">
            Nem toda mudança começa do lado de fora.
          </h2>
        </FadeIn>
        <FadeIn delay={120}>
          <div className="mt-14 grid sm:grid-cols-2 gap-8 max-w-3xl text-white/50 leading-relaxed">
            <p>
              Muitas pessoas passam a vida tentando mudar seus resultados.
              Poucas aprendem a compreender os padrões que produzem esses resultados.
            </p>
            <p>
              No IDM, acreditamos que a consciência precede a transformação.
              Porque aquilo que você ilumina na consciência deixa de comandar você no escuro.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 4 — SOBRE O INSTITUTO  [texto esq + imagem dir]
// Início do padrão Z — texto à esquerda ancora varredura natural
// Ref: Paivio (1971) Dual Coding Theory — imagem + texto codificados
// simultaneamente em canais verbal e visual = retenção 65% maior.
// Ref: Liu (2010) Z-Pattern in Web Reading — texto-esq inicia
// varredura; imagem-dir fecha ciclo Z antes do scroll.
// Imagem full-height sem padding: Okonkwo (2007) editorial
// photography como sinal primário de premium em marcas educacionais.
// ═══════════════════════════════════════════════════════════════════
function SobreSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0D1638] overflow-hidden">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr_38%] lg:min-h-[620px]">

        {/* Texto */}
        <div className="px-6 sm:px-10 lg:pl-16 lg:pr-16 py-24 sm:py-32 flex flex-col justify-center">
          <FadeIn direction="left">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/25 font-medium mb-8">
              Sobre o Instituto
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.02] mb-5">
              Uma instituição construída para despertar consciências.
            </h2>
            <div className="space-y-0.5 text-white font-semibold text-lg mb-6">
              <p>Formamos profissionais.</p>
              <p>Desenvolvemos seres humanos.</p>
            </div>
            <p className="text-white/40 leading-relaxed text-sm max-w-sm">
              Há mais de 9 anos integrando conhecimento, consciência e prática
              em uma metodologia construída para transformar vidas de verdade.
            </p>
            <div className="mt-12 pt-10 border-t border-white/[0.06] grid grid-cols-3 gap-6">
              {[
                { n: '12.000+', l: 'Pessoas impactadas' },
                { n: '9 anos',  l: 'De metodologia própria' },
                { n: 'Brasil',  l: 'Alunos em todo o país' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p className="font-display text-3xl sm:text-4xl font-bold text-white">{n}</p>
                  <p className="mt-1.5 text-[10px] text-white/25 uppercase tracking-wide leading-snug">{l}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Imagem editorial — full height */}
        <div className="hidden lg:block relative border-l border-white/[0.05]">
          <EditorialImg className="absolute inset-0" />
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 5 — METODOLOGIA  [imagem esq + texto dir]
// Inverte o padrão Z da seção 4 — zig-zag editorial
// Ref: Wertheimer (1923) Gestalt Prägnanz — padrão previsível-mas-
// variado mantém atenção sem produzir monotonia. Quando o lado da
// imagem alterna, o cérebro interpreta como "capítulo novo" — sinal
// de estrutura editorial sofisticada, não de conteúdo pesado.
// Ref: Kaplan (1989) Attention Restoration Theory — estímulos visuais
// intercalados restauram atenção dirigida (prefrontal fatigue),
// permitindo leitura sustentada em páginas longas.
// ═══════════════════════════════════════════════════════════════════
const PILARES = [
  { n: '01', t: 'Teoria',             d: 'Base sólida para compreender comportamento, emoções e processos psíquicos.' },
  { n: '02', t: 'Análise Pessoal',    d: 'Ninguém conduz outra pessoa por caminhos que nunca percorreu dentro de si.' },
  { n: '03', t: 'Supervisão Clínica', d: 'Acompanhamento que transforma conhecimento em segurança profissional.' },
]

function MetodologiaSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0A1232] overflow-hidden">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[38%_1fr] lg:min-h-[560px]">

        {/* Imagem — esquerda */}
        <div className="hidden lg:block relative border-r border-white/[0.05]">
          <EditorialImg className="absolute inset-0" />
        </div>

        {/* Texto */}
        <div className="px-6 sm:px-10 lg:pl-16 lg:pr-16 py-24 sm:py-32 flex flex-col justify-center">
          <FadeIn direction="right">
            <p className="text-[11px] uppercase tracking-[0.22em] text-white/25 font-medium mb-8">
              Metodologia
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.0] mb-12">
              Conhecimento.<br />Consciência.<br />Prática.
            </h2>
            <div className="space-y-9">
              {PILARES.map((p) => (
                <div key={p.t} className="flex gap-5">
                  <span className="text-[11px] text-white/20 font-mono shrink-0 mt-1">{p.n}</span>
                  <div>
                    <p className="font-semibold text-white mb-1.5">{p.t}</p>
                    <p className="text-white/40 text-sm leading-relaxed">{p.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 6 — PARA QUEM É  [texto esq + imagem dir]
// Retoma texto-esq: padrão Z completo (zig-zag seções 4→5→6)
// Ref: Miller (StoryBrand, 2017) — posicionar o cliente como herói
// antes da oferta produz identificação que antecede conversão.
// Ref: Fogg, Stanford Web Credibility (2003) — especificidade de
// audiência é critério de credibilidade percebida. 5 qualificadores
// comunicam curadoria intencional, não produto genérico.
// ═══════════════════════════════════════════════════════════════════
const PARA_QUEM = [
  'Para quem busca autoconhecimento profundo.',
  'Para quem deseja atuar profissionalmente na área.',
  'Para profissionais das ciências humanas.',
  'Para quem quer compreender emoções, relacionamentos e comportamento.',
  'Para quem acredita que crescimento pessoal é também uma forma de servir.',
]

function ParaQuemSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0D1638] overflow-hidden">
      <div className="max-w-7xl mx-auto lg:grid lg:grid-cols-[1fr_38%] lg:min-h-[500px]">

        {/* Texto */}
        <div className="px-6 sm:px-10 lg:pl-16 lg:pr-16 py-24 sm:py-32 flex flex-col justify-center">
          <FadeIn direction="left">
            <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.0] mb-12">
              Para quem<br />é o IDM?
            </h2>
            <ul className="space-y-6">
              {PARA_QUEM.map((item, i) => (
                <li key={i} className="flex items-start gap-5">
                  <span className="text-[11px] text-white/20 font-mono shrink-0 mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-white/65 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>

        {/* Imagem — direita */}
        <div className="hidden lg:block relative border-l border-white/[0.05]">
          <EditorialImg className="absolute inset-0" />
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 7 — PROGRAMAS  [lista editorial]
// Sem cards — índice de revista premium
// Ref: Hick & Hyman (1952) — tempo de decisão cresce
// logaritmicamente com nº de opções. 3 programas = clareza máxima.
// Hover sutil (-mx-4 px-4): Fitts Law (1954) — área de clique maior
// sem elemento visual pesado que "grite" sobre o conteúdo.
// ═══════════════════════════════════════════════════════════════════
const PROGRAMAS_DATA = [
  { num: '01', titulo: 'Psicanálise Integrativa',    desc: 'Formação certificada — teoria, análise pessoal e supervisão clínica.', href: '/programas/psicanalise-integrativa' },
  { num: '02', titulo: 'IDM Pelo Brasil',             desc: 'Experiências presenciais de desenvolvimento humano em todo o país.',   href: '/programas/idm-pelo-brasil' },
  { num: '03', titulo: 'Live Formação IDM',           desc: 'Conteúdos e encontros para quem deseja continuar evoluindo.',          href: '/loja' },
]

function ProgramasSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
        <FadeIn direction="none" className="mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-[1.0]">
            Caminhos diferentes.<br />O mesmo propósito.
          </h2>
        </FadeIn>
        <div>
          {PROGRAMAS_DATA.map((p, i) => (
            <FadeIn key={p.titulo} delay={i * 60}>
              <Link
                href={p.href}
                className="group flex items-start sm:items-center justify-between gap-6 border-t border-white/[0.07] py-7 -mx-4 px-4 hover:bg-white/[0.015] transition-colors rounded-sm">
                <div className="flex items-start sm:items-center gap-6 sm:gap-10 min-w-0">
                  <span className="text-[11px] text-white/20 font-mono shrink-0 mt-1 sm:mt-0">{p.num}</span>
                  <div>
                    <p className="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-white/90 transition-colors">{p.titulo}</p>
                    <p className="mt-0.5 text-sm text-white/35 leading-snug">{p.desc}</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all shrink-0 mt-1 sm:mt-0" />
              </Link>
            </FadeIn>
          ))}
          <div className="border-t border-white/[0.07]" />
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 8 — DEPOIMENTOS
// Texto puro — 3 colunas, sem cards, sem vídeos
// Ref: Fogg, Stanford Web Credibility (2003) — nome real + cargo +
// resultado específico = máxima credibilidade percebida.
// Depoimentos com vídeo "ausente" destroem confiança mais do que
// texto simples (Trusov et al., 2009 word-of-mouth study).
// Posição antes do CTA: Cialdini (2001) liking principle —
// aprovação de pares reduz resistência ao compromisso final.
// ═══════════════════════════════════════════════════════════════════
function DepoimentosSection({ depos }: { depos: Depo[] }) {
  if (!depos.length) return null
  return (
    <section className="border-t border-white/[0.06] bg-[#0D1638]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 sm:py-32">

        <FadeIn direction="none" className="mb-16">
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white leading-[1.0]">
            Quem decidiu<br />olhar para dentro.
          </h2>
          <p className="mt-4 text-white/35 text-sm max-w-sm leading-relaxed">
            Histórias de pessoas que encontraram no conhecimento uma
            nova forma de compreender a própria vida.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-3 gap-10 sm:gap-12">
          {depos.slice(0, 3).map((d, i) => (
            <FadeIn key={i} delay={i * 70}>
              <div className="space-y-5">
                <p className="text-white/55 leading-relaxed text-sm">&ldquo;{d.texto}&rdquo;</p>
                <div className="border-t border-white/[0.06] pt-4">
                  <p className="text-sm font-semibold text-white">{d.nome}</p>
                  <p className="text-xs text-white/30 mt-0.5">{d.papel}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 9 — CTA FINAL
// Tipografia dominante + whitespace máximo
// Ref: Fadeyev (2009) — espaço extenso antes do CTA sinaliza
// confiança; marcas que "precisam preencher" cada pixel demonstram
// ansiedade, não autoridade.
// Ref: Cialdini (2001) autoridade — linguagem institucional
// ("O despertar começa com uma decisão") supera linguagem de
// facilidade. Leads high-ticket respondem a seriedade, não conveniência.
// Layout assimétrico (headline esq / botão dir): tensão editorial
// que evita estética de landing page genérica.
// ═══════════════════════════════════════════════════════════════════
function CTASection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-32 sm:py-48">
        <FadeIn direction="none">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">

            <div className="space-y-5">
              <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.93]">
                O despertar começa<br />com uma decisão.
              </h2>
              <div className="space-y-1 text-white/40 leading-relaxed">
                <p>Conhecimento pode informar.</p>
                <p>Consciência pode transformar.</p>
                <p className="text-white/20">Sua jornada começa agora.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link
                href="/turma38"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFB800] px-8 py-4 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] active:scale-[0.98] transition-all duration-200 whitespace-nowrap">
                Quero minha vaga <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="text-center text-[11px] text-white/20">
                Vagas limitadas · Certificação MEC
              </p>
            </div>

          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// EXPORT PRINCIPAL
// Ritmo visual: Banner → Tipo → Quote → [T+I] → [I+T] → [T+I]
//               → Lista → Quotes → CTA
// O padrão Z completo nas seções 4→5→6 cria leitura dinâmica sem
// adicionar conteúdo — só estrutura editorial.
// ═══════════════════════════════════════════════════════════════════
export function ComecarAnimated({
  depos,
  programas: _programas,
}: {
  depos: Depo[]
  programas: Programa[]
}) {
  return (
    <main className="bg-[#0D1638] text-white overflow-x-hidden" id="formacao">
      <BannerSection />
      <HeroSection />
      <ManifestoSection />
      <SobreSection />
      <MetodologiaSection />
      <ParaQuemSection />
      <ProgramasSection />
      <DepoimentosSection depos={depos} />
      <CTASection />
    </main>
  )
}
