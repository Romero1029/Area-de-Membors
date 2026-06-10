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
// Fotografia real com overlay de fusão — Paivio (1971) Dual Coding Theory
// Reber et al. (2004) Processing Fluency — imagem contextual = afeto positivo
function EditorialPhoto({ src, alt = '', side = 'right', className = '' }: {
  src: string; alt?: string; side?: 'left' | 'right'; className?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src} alt={alt} loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0" style={{
        background: side === 'right'
          ? 'linear-gradient(to right, rgba(13,22,56,0.30) 0%, transparent 45%)'
          : 'linear-gradient(to left, rgba(10,18,50,0.30) 0%, transparent 45%)'
      }} />
    </div>
  )
}

// ─── Programa Card ───────────────────────────────────────────────────────────
// MasterClass / The School of Life: full-bleed editorial cards
// Kurosu & Kashimura (CHI 1995) — aesthetic-usability effect
// Ebbinghaus (1885) + Murdock (1962) — primacy effect: featured card top
type ProgramaCard = {
  num: string; titulo: string; desc: string
  href: string; img: string; featured?: boolean
}

const PROGRAMAS_CARDS: ProgramaCard[] = [
  { num: '01', titulo: 'Psicanálise Integrativa', featured: true,
    desc: 'Formação certificada em teoria, análise pessoal e supervisão clínica.',
    href: '/programas/psicanalise-integrativa',
    img: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=1400&q=85' },
  { num: '02', titulo: 'IDM Pelo Brasil',
    desc: 'Experiências presenciais de desenvolvimento humano em todo o país.',
    href: '/programas/idm-pelo-brasil',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&q=82' },
  { num: '03', titulo: 'Live Formação IDM',
    desc: 'Conteúdos e encontros para quem deseja continuar evoluindo.',
    href: '/loja',
    img: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=900&q=82' },
]

function ProgramaCardItem({ card }: { card: ProgramaCard }) {
  const aspectClass = card.featured
    ? 'aspect-[16/9] sm:aspect-[21/9] lg:aspect-[16/7]'
    : 'aspect-[16/9] sm:aspect-[4/3]'
  const titleSize = card.featured
    ? 'text-3xl sm:text-4xl lg:text-5xl'
    : 'text-xl sm:text-2xl'
  return (
    <Link href={card.href} className="group relative overflow-hidden block rounded-xl">
      <div className={`relative overflow-hidden ${aspectClass}`}>
        <img
          src={card.img} alt={card.titulo} loading={card.featured ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(9,16,40,0.95) 0%, rgba(9,16,40,0.35) 45%, transparent 75%)'
        }} />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <p className="text-[11px] font-mono text-white/35 uppercase tracking-[0.2em] mb-3">{card.num}</p>
          <h3 className={`font-display font-bold text-white leading-tight mb-2 ${titleSize}`}>
            {card.titulo}
          </h3>
          <p className="text-white/55 text-sm leading-relaxed max-w-md">{card.desc}</p>
        </div>
        <div className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <ArrowRight className="h-4 w-4 text-white" />
        </div>
      </div>
    </Link>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 1 — BANNER PROMOCIONAL
// Imagem intacta — sem sobreposição de texto
// Ref: Okonkwo (2007) — não competir com o ativo visual da campanha
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
// Ref: Müller-Brockmann (1981) Grid Systems — hierarquia tipográfica
// Ref: Lupton (2010) Thinking with Type — contraste de escala
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
// Ref: Cialdini (2001) Commitment — crenças compartilhadas antes da oferta
// Ref: Bringhurst (1992) — linha ornamental como caesura tipográfica
// ═══════════════════════════════════════════════════════════════════
function ManifestoSection() {
  return (
    <section className="border-t border-white/[0.06] bg-[#0D1638] py-36 sm:py-56">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
        <FadeIn direction="none">
          <div className="w-14 h-px bg-white/20 mb-10" />
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
// Ref: Paivio (1971) Dual Coding Theory — imagem + texto = retenção 65% maior
// Ref: Liu (2010) Z-Pattern — texto-esq inicia varredura; imagem-dir fecha ciclo
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
                  <p className="font-display text-5xl sm:text-6xl font-bold text-white">{n}</p>
                  <p className="mt-1.5 text-[10px] text-white/25 uppercase tracking-wide leading-snug">{l}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        {/* Imagem editorial — Trinity College Library — herança acadêmica */}
        <div className="hidden lg:block relative border-l border-white/[0.05]">
          <EditorialPhoto
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&q=82"
            alt="Biblioteca acadêmica — herança intelectual"
            side="right"
            className="absolute inset-0"
          />
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 5 — METODOLOGIA  [imagem esq + texto dir]
// Ref: Wertheimer (1923) Gestalt Prägnanz — padrão variado mantém atenção
// Ref: Kaplan (1989) Attention Restoration Theory — estímulos intercalados
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

        {/* Imagem — padrões geracionais / registros */}
        <div className="hidden lg:block relative border-r border-white/[0.05]">
          <EditorialPhoto
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=900&q=82"
            alt="Padrões e história — metodologia psicanalítica"
            side="left"
            className="absolute inset-0"
          />
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
// Ref: Miller (StoryBrand, 2017) — posicionar cliente como herói
// Ref: Fogg, Stanford (2003) — especificidade de audiência = credibilidade
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

        {/* Imagem — meditação / autoconhecimento */}
        <div className="hidden lg:block relative border-l border-white/[0.05]">
          <EditorialPhoto
            src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=900&q=82"
            alt="Autoconhecimento e prática interior"
            side="right"
            className="absolute inset-0"
          />
        </div>

      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 7 — PROGRAMAS  [magazine grid]
// Ref: Kurosu & Kashimura (CHI 1995) Aesthetic-Usability Effect
// Ref: Wertheimer (1923) Größengesetz — tamanho hierarquiza
// Ref: Ebbinghaus (1885) Primacy Effect — card featured = topo
// ═══════════════════════════════════════════════════════════════════
function ProgramasSection() {
  return (
    <section id="formacao" className="border-t border-white/[0.06] bg-[#0A1232]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24">
        <FadeIn direction="none" className="mb-8 sm:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-[1.0]">
            Caminhos diferentes.<br />O mesmo propósito.
          </h2>
        </FadeIn>
        <FadeIn direction="up" className="space-y-3 sm:space-y-4">
          <ProgramaCardItem card={PROGRAMAS_CARDS[0]} />
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {PROGRAMAS_CARDS.slice(1).map(c => (
              <ProgramaCardItem key={c.num} card={c} />
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SEÇÃO 8 — DEPOIMENTOS
// Ref: Fogg, Stanford (2003) — nome real + cargo + resultado = credibilidade
// Ref: Bringhurst (1992) — aspas decorativas como ornamento editorial
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
                <p className="font-display text-7xl leading-none text-white/[0.06] -mb-4 select-none">&ldquo;</p>
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
// Ref: Fadeyev (2009) — whitespace antes do CTA sinaliza confiança
// Ref: Cialdini (2001) — linguagem institucional supera linguagem de facilidade
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
// Ritmo: Banner → Tipo → Quote+ornamento → [T+Foto] → [Foto+T] → [T+Foto]
//        → Magazine Grid → Quotes+aspas → CTA
// ═══════════════════════════════════════════════════════════════════
export function ComecarAnimated({
  depos,
  programas: _programas,
}: {
  depos: Depo[]
  programas: Programa[]
}) {
  return (
    <main className="bg-[#0D1638] text-white overflow-x-hidden">
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
