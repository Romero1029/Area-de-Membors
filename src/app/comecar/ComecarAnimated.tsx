'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight, Star } from 'lucide-react'

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

type Depo = {
  nome: string
  papel: string
  texto: string
  estrelas: number
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

function ImgPlaceholder({ aspect = 'aspect-video', label = '' }: { aspect?: string; label?: string }) {
  return (
    <div className={`w-full ${aspect} rounded-2xl border border-dashed border-white/12 bg-white/3 flex items-center justify-center`}>
      {label && (
        <p className="text-[11px] font-mono text-white/18 tracking-widest uppercase px-4 text-center">{label}</p>
      )}
    </div>
  )
}

const DOT_GRID = {
  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
  backgroundSize: '40px 40px',
}

// ─────────────────────────────────────────────
// CAROUSEL DE DEPOIMENTOS
// ─────────────────────────────────────────────

function DepoCard({ d, featured }: { d: Depo; featured?: boolean }) {
  return (
    <div className={`rounded-2xl border p-5 sm:p-6 space-y-4 h-full ${featured ? 'border-[#FFB800]/25 bg-[#1E2740]' : 'border-white/7 bg-[#111827]'}`}>
      <div className="flex gap-0.5">
        {Array.from({ length: d.estrelas }).map((_, i) => (
          <Star key={i} className="h-3.5 w-3.5 fill-[#FFB800] text-[#FFB800]" />
        ))}
      </div>
      <p className="text-sm text-white/75 leading-relaxed flex-1">"{d.texto}"</p>
      <div className="pt-3 border-t border-white/6">
        <p className="text-xs font-semibold text-white">{d.nome}</p>
        <p className="text-[11px] text-[#8B9DC3] mt-0.5">{d.papel}</p>
      </div>
    </div>
  )
}

function Carousel({ depos }: { depos: Depo[] }) {
  const [idx, setIdx] = useState(0)
  const total = depos.length
  const prev  = () => setIdx(i => (i === 0 ? total - 1 : i - 1))
  const next  = () => setIdx(i => (i === total - 1 ? 0 : i + 1))

  const desktop = [
    depos[(idx) % total],
    depos[(idx + 1) % total],
    depos[(idx + 2) % total],
  ]

  return (
    <div className="space-y-6">
      {/* Mobile — 1 de cada vez */}
      <div className="sm:hidden">
        <DepoCard d={depos[idx]} featured />
      </div>
      {/* Desktop — 3 visíveis */}
      <div className="hidden sm:grid sm:grid-cols-3 gap-5">
        {desktop.map((d, i) => (
          <DepoCard key={i} d={d} featured={i === 0} />
        ))}
      </div>
      {/* Controles */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={prev}
          className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
          aria-label="Anterior">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex gap-1.5">
          {depos.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-5 bg-[#FFB800]' : 'w-1.5 bg-white/20'}`}
              aria-label={`Depoimento ${i + 1}`} />
          ))}
        </div>
        <button onClick={next}
          className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:border-white/30 transition-colors"
          aria-label="Próximo">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function ComecarAnimated({ depos, programas }: { depos: Depo[]; programas: Programa[] }) {
  void programas // dados disponíveis para uso futuro em seção dinâmica
  return (
    <main className="bg-[#0B0F1A] text-white overflow-x-hidden">

      {/* ══════════════════════════════════════
          1 — HERO
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-10 py-24 overflow-hidden text-center"
        style={DOT_GRID}
      >
        {/* Glow de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#FFB800]/6 blur-[120px] pointer-events-none" />

        {/* Badge 50% OFF — canto superior esquerdo */}
        <div className="absolute top-20 left-5 sm:left-10 z-10">
          <div className="inline-flex items-baseline gap-1 rounded-2xl bg-[#FFB800] px-3 py-1.5">
            <span className="text-2xl font-black text-[#0B0F1A] leading-none">50%</span>
            <span className="text-xs font-bold text-[#0B0F1A] uppercase tracking-widest">OFF</span>
          </div>
          <p className="text-[11px] text-white/35 mt-1 ml-1">na primeira formação</p>
        </div>

        {/* Logo */}
        <div className="relative z-10 mb-8">
          <Image
            src="/despertamente-simbolo-branco.png"
            alt="Instituto Despertamente"
            width={72}
            height={72}
            className="object-contain mx-auto opacity-90"
          />
        </div>

        {/* Texto */}
        <div className="relative z-10 max-w-3xl space-y-5">
          <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#FFB800]/70">
            Instituto Despertamente
          </p>
          <h1
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.0] tracking-tight"
          >
            Transforme quem<br />
            <span className="text-[#FFB800]">você é</span> por dentro.
          </h1>
          <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-xl mx-auto">
            Neurociência, Psicanálise e PNL integrados em um método que explica por que você age como age — e como mudar de verdade.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/turma38"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-7 py-4 text-base font-bold text-[#0B0F1A] hover:bg-[#FFC933] transition-colors"
              style={{ boxShadow: '0 8px 40px rgba(255,184,0,0.28)' }}
            >
              Quero começar <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/login" className="text-sm font-medium text-white/45 hover:text-white/80 transition-colors py-4">
              Já tenho conta →
            </Link>
          </div>
          <p className="text-xs text-white/25 pt-2">2.400+ alunos · 94% de conclusão · 4.9 ★</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B0F1A] to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════
          2 — AULA GRATUITA
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <ImgPlaceholder aspect="aspect-video" label="Imagem — Aula Gratuita" />
          <div className="space-y-6">
            <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/70">Acesso imediato</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold leading-[1.05]">
              Aula gratuita<br />para começar.
            </h2>
            <p className="text-[#8B9DC3] leading-relaxed">
              Antes de qualquer decisão, assista à aula introdutória. Entenda o Método IDM, conheça a abordagem e veja se faz sentido para você.
            </p>
            <ul className="space-y-2.5">
              {[
                'Por que você repete os mesmos padrões',
                'Como neurociência e psicanálise se conectam',
                'O que diferencia o Método IDM',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                  <span className="w-5 h-5 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/25 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-[#FFB800]">
                    {i + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/turma38"
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-6 py-3.5 text-sm font-bold text-[#0B0F1A] hover:bg-[#FFC933] transition-colors">
              Assistir aula gratuita <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3 — BANNER AMARELO FULL-WIDTH
      ══════════════════════════════════════ */}
      <section id="projetos" className="bg-[#FFB800] py-14 sm:py-18 px-5 sm:px-10 text-center">
        <p className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#0B0F1A]/50 mb-3">
          Instituto Despertamente
        </p>
        <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B0F1A] leading-[1.05]">
          Projetos que Impactam<br />
          <span className="italic">sua Mente.</span>
        </h2>
        <p className="mt-4 text-sm text-[#0B0F1A]/55 max-w-xl mx-auto leading-relaxed">
          Cada programa foi desenvolvido para criar mudanças reais — não só conhecimento teórico.
        </p>
      </section>

      {/* ══════════════════════════════════════
          4 — GRID DE PROJETOS (3 cards)
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-24">
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { titulo: 'Psicanálise Integrativa', href: '/programas/psicanalise-integrativa', label: 'Imagem — Psicanálise' },
            { titulo: 'IDM pelo Brasil',         href: '/programas/idm-pelo-brasil',         label: 'Imagem — IDM pelo Brasil' },
            { titulo: 'A definir',               href: '/loja',                              label: 'Imagem — 3º Projeto' },
          ].map((p) => (
            <Link key={p.titulo} href={p.href} className="group block space-y-4">
              <ImgPlaceholder aspect="aspect-square" label={p.label} />
              <div className="flex items-center justify-between px-1">
                <p className="text-base font-semibold text-white group-hover:text-[#FFB800] transition-colors">{p.titulo}</p>
                <ArrowRight className="h-4 w-4 text-white/30 group-hover:text-[#FFB800] transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          5 — DETALHES DOS PROJETOS (alternado)
      ══════════════════════════════════════ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-10 space-y-20 sm:space-y-28 pb-20 sm:pb-28">
        {[
          {
            titulo: 'Formação em Psicanálise Integrativa',
            desc: 'Uma formação certificante que integra Psicanálise Clássica, Neurociência e PNL. Aprenda a investigar o inconsciente — o seu e o dos seus pacientes.',
            cta: 'Conhecer a formação',
            href: '/programas/psicanalise-integrativa',
            label: 'Imagem — Psicanálise Integrativa',
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
          <div key={p.titulo}
            className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${p.reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <ImgPlaceholder aspect="aspect-[4/3]" label={p.label} />
            <div className="space-y-5">
              <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl sm:text-4xl font-bold leading-[1.05]">
                {p.titulo}
              </h3>
              <p className="text-[#8B9DC3] leading-relaxed">{p.desc}</p>
              <Link href={p.href}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#FFB800] hover:text-[#FFC933] transition-colors">
                {p.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* ══════════════════════════════════════
          6 — FORMAÇÃO PSICANÁLISE (destaque)
      ══════════════════════════════════════ */}
      <section id="formacao" className="bg-[#111827] py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/70">Formação completa</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold leading-[1.05]">
              Psicanálise Integrativa.
            </h2>
            <p className="text-[#8B9DC3] leading-relaxed">
              Do inconsciente à prática clínica. Teoria, análise pessoal e supervisão em um único percurso.
            </p>
          </div>

          <ImgPlaceholder aspect="aspect-[21/9]" label="Imagem principal — Formação Psicanálise" />

          {/* O que você aprende */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white/70 text-center">O que você aprende</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                'Fundamentos da Psicanálise',
                'Análise Pessoal',
                'Técnicas Integrativas',
                'PNL na Prática Clínica',
              ].map((m) => (
                <div key={m} className="space-y-3">
                  <ImgPlaceholder aspect="aspect-[4/3]" label={m} />
                  <p className="text-xs text-white/55 text-center leading-snug">{m}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/programas/psicanalise-integrativa"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-7 py-4 text-sm font-bold text-[#0B0F1A] hover:bg-[#FFC933] transition-colors">
              Ver a formação completa <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7 — CERTIFICADOS
      ══════════════════════════════════════ */}
      <section id="certificados" className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6">
            <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/70">Reconhecimento</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold leading-[1.05]">
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
                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <ImgPlaceholder aspect="aspect-[4/3]" label="Imagem — Certificado" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          8 — IDM PELO BRASIL
      ══════════════════════════════════════ */}
      <section className="bg-[#111827] py-20 sm:py-28 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/70">Presencial</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold leading-[1.05]">
              IDM pelo Brasil.
            </h2>
            <p className="text-[#8B9DC3] max-w-lg mx-auto leading-relaxed">
              Imersões presenciais em cidades do Brasil. 4 dias de prática intensa com supervisão ao vivo.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { titulo: 'Metodologia ao Vivo', desc: 'Psicanálise Integrativa e PNL aplicados em tempo real, com supervisão individual nas sessões práticas.', label: 'Imagem — Metodologia' },
              { titulo: 'Certificação Incluída', desc: 'Ao final da imersão você recebe o certificado IDM pelo Brasil com carga horária e validação digital.', label: 'Imagem — Certificação' },
            ].map((card) => (
              <div key={card.titulo} className="rounded-2xl border border-white/7 bg-[#0B0F1A] overflow-hidden">
                <ImgPlaceholder aspect="aspect-video" label={card.label} />
                <div className="px-5 pb-5 pt-4 space-y-3">
                  <h3 className="text-lg font-semibold text-white">{card.titulo}</h3>
                  <p className="text-sm text-[#8B9DC3] leading-relaxed">{card.desc}</p>
                  <Link href="/programas/idm-pelo-brasil"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FFB800] px-5 py-2.5 text-xs font-bold text-[#0B0F1A] hover:bg-[#FFC933] transition-colors">
                    Ver datas <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          9 — DEPOIMENTOS
      ══════════════════════════════════════ */}
      <section id="depoimentos" className="max-w-6xl mx-auto px-5 sm:px-10 py-20 sm:py-28">
        <div className="text-center space-y-3 mb-12">
          <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/70">
            Quem já passou pelo IDM
          </p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl font-bold">
            Depoimentos.
          </h2>
        </div>
        <Carousel depos={depos} />
      </section>

      {/* ══════════════════════════════════════
          10 — CTA FINAL
      ══════════════════════════════════════ */}
      <section
        className="relative py-24 sm:py-32 px-5 sm:px-10 text-center overflow-hidden"
        style={{ ...DOT_GRID, background: '#0B0F1A' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-[#FFB800]/5 blur-[100px] pointer-events-none" />
        <div className="relative max-w-2xl mx-auto space-y-6">
          <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#FFB800]/60">Livre formação</p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-5xl sm:text-6xl font-bold leading-[1.0]">
            Livre formação<br />com IDM.
          </h2>
          <p className="text-[#8B9DC3] leading-relaxed max-w-md mx-auto">
            Comece hoje, no seu ritmo. Acesso gratuito para criar sua conta e explorar a plataforma.
          </p>
          <Link href="/turma38"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB800] px-9 py-5 text-base font-bold text-[#0B0F1A] hover:bg-[#FFC933] transition-colors"
            style={{ boxShadow: '0 8px 48px rgba(255,184,0,0.25)' }}>
            Começar agora — é grátis <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-white/22">Sem cartão de crédito · Acesso imediato</p>
        </div>
      </section>

    </main>
  )
}
