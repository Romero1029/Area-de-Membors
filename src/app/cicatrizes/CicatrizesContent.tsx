'use client'

import { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, MessageCircle, Clock, Ticket, CalendarDays } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { CheckoutModal, useCheckoutModal } from '@/components/checkout/CheckoutModal'
import { LeadFormModal } from './LeadFormModal'

const WA_URL = 'https://wa.me/5511999999999?text=Ol%C3%A1!%20Quero%20garantir%20minha%20vaga%20no%20Cicatrizes%20que%20Curam.'

const paraQuemE = [
  'Quem sente que carrega marcas do passado que ainda pesam no presente',
  'Quem já fez terapia, mas quer um espaço vivencial e coletivo, além da sessão individual',
  'Quem está começando a se interessar por autoconhecimento e psicanálise integrativa',
  'Quem ganhou este workshop de bônus em outro produto do IDM e quer aproveitar a vivência',
]

const faqItems = [
  {
    q: 'O que exatamente acontece nas 3 horas?',
    a: 'Um workshop vivencial guiado pela Jocimara, combinando psicanálise integrativa e dinâmicas em grupo — você sai com clareza sobre marcas emocionais que ainda influenciam suas decisões, não só com teoria.',
  },
  {
    q: 'Preciso já fazer terapia pra participar?',
    a: 'Não. O workshop recebe tanto quem nunca fez terapia quanto quem já tem processo em andamento e quer um espaço coletivo complementar.',
  },
  {
    q: 'Como funciona o cupom da Jocimara?',
    a: 'O investimento padrão é R$49,90. Usando o cupom ou o link da Jocimara, o valor cai para R$37,80 — ela mesma libera esse desconto pra quem a acompanha.',
  },
  {
    q: 'Com que frequência o workshop acontece?',
    a: 'Uma turma por mês, com vagas limitadas de propósito — o objetivo é manter o espaço de escuta próximo, não lotar a sala.',
  },
  {
    q: 'Ganhei o Cicatrizes que Curam de bônus em outro produto. Preciso pagar?',
    a: 'Não — se você recebeu o workshop como bônus de outro produto do IDM, sua vaga já está garantida sem custo adicional.',
  },
]

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' as `${number}px` })
  const reduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function CicatrizesContent() {
  const { open, abrir, fechar } = useCheckoutModal()
  const lead = useCheckoutModal()
  const router = useRouter()

  return (
    <>
      <CheckoutModal
        open={open}
        onClose={fechar}
        produtoSlug="cicatrizes-que-curam"
        titulo="Cicatrizes que Curam"
        valor={37.80}
        onPago={(identifier) => router.push(`/cicatrizes/obrigado?id=${identifier}`)}
      />
      <LeadFormModal open={lead.open} onClose={lead.fechar} />

      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative overflow-hidden pt-24">
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9]">
          <Image
            src="/banner-cicatrizes.png"
            alt="Workshop Cicatrizes que Curam — Jocimara Anjos × Instituto DespertaMENTE"
            fill
            priority
            className="object-cover object-center"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #0D1638 92%)' }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 w-full -mt-4 sm:-mt-10 pb-16 space-y-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Clock className="h-3.5 w-3.5 text-[#FFB800]/70" />
              <span className="text-xs text-white/60">3 horas de duração</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <Ticket className="h-3.5 w-3.5 text-[#FFB800]/70" />
              <span className="text-xs text-white/60">Vagas limitadas</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <CalendarDays className="h-3.5 w-3.5 text-[#FFB800]/70" />
              <span className="text-xs text-white/60">Uma turma por mês</span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            onClick={lead.abrir}
            className="group inline-flex items-center gap-2.5 rounded-xl bg-[#FFB800] px-8 py-4 text-base font-bold text-[#0D1638] hover:bg-[#FFC933] transition-colors whitespace-nowrap w-fit"
            style={{ boxShadow: '0 8px 32px rgba(255,184,0,0.22)' }}
          >
            QUERO GARANTIR MEU INGRESSO
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </section>

      {/* ── MANIFESTO ────────────────────────────── */}
      <section className="bg-[#0A1232] border-y border-white/5">
        <Reveal className="max-w-2xl mx-auto px-6 sm:px-10 py-20">
          <p
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-2xl sm:text-3xl font-light leading-relaxed text-white/45"
          >
            Todo mundo carrega marcas.{' '}
            <span className="text-white/80">A diferença está no que fazemos com elas</span>{' '}
            — se viram peso que arrastamos, ou ponto de virada que nos move. O Cicatrizes que
            Curam é um espaço vivencial de 3 horas, guiado pela Jocimara Anjos, pra você
            elaborar o que ainda pesa e{' '}
            <span className="text-white/80">seguir mais leve.</span>
          </p>
        </Reveal>
      </section>

      {/* ── O QUE É ──────────────────────────────── */}
      <Reveal>
        <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl font-bold text-white mb-12"
          >
            O que é o workshop.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { t: 'Vivência guiada', d: '3 horas de imersão prática, conduzida pela Jocimara, unindo psicanálise integrativa e acolhimento em grupo.' },
              { t: 'Autoconhecimento aplicado', d: 'Identifique as marcas emocionais que ainda influenciam suas decisões — e o que fazer com elas a partir de hoje.' },
              { t: 'Turma pequena', d: 'Vagas limitadas de propósito: mais espaço de escuta, mais profundidade, menos gente por sessão.' },
            ].map((c) => (
              <div key={c.t} className="rounded-2xl border border-white/8 bg-[#0A1232] p-7 space-y-3">
                <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-lg font-semibold text-white">{c.t}</p>
                <p className="text-sm text-white/45 leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── DEPOIMENTO DA JOCIMARA ───────────────── */}
      <Reveal>
        <section className="bg-[#0A1232] border-y border-white/5">
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center space-y-6">
            <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="block text-[70px] leading-none text-[#FFB800]/10 select-none">
              &ldquo;
            </span>
            <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl sm:text-2xl text-white/70 leading-relaxed font-light italic -mt-8">
              Eu criei o Cicatrizes que Curam porque via, na clínica e na sala de aula, a mesma
              dor se repetindo: gente carregando marcas que nunca teve espaço pra elaborar.
              Esse workshop é esse espaço.
            </p>
            <div>
              <p className="text-sm font-semibold text-white/85">Jocimara Anjos</p>
              <p className="text-xs text-white/35 mt-0.5">Coordenadora Pedagógica da Formação em Psicanálise · IDM</p>
            </div>
          </div>
        </section>
      </Reveal>

      {/* ── PRA QUEM É ───────────────────────────── */}
      <Reveal>
        <section className="max-w-3xl mx-auto px-6 sm:px-10 py-20">
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl font-bold text-white mb-10"
          >
            Pra quem é.
          </h2>
          <div className="space-y-0 divide-y divide-white/5">
            {paraQuemE.map((item) => (
              <div key={item} className="flex items-start gap-4 py-5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#FFB800]/60 shrink-0" />
                <p className="text-sm text-white/60 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ── INVESTIMENTO ─────────────────────────── */}
      <Reveal>
        <section id="investimento" className="bg-[#0A1232] border-y border-white/5">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold text-white mb-3"
            >
              Investimento.
            </h2>
            <p className="text-sm text-white/45 leading-relaxed mb-10 max-w-md">
              Valor de referência R$250 — o ingresso avulso sai por bem menos.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
              <div className="rounded-2xl border border-white/8 bg-[#0D1638] p-7 space-y-2.5">
                <p className="text-[11px] font-mono uppercase tracking-widest text-white/30">Investimento padrão</p>
                <p className="text-xs text-white/25 line-through">R$ 250,00</p>
                <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-4xl font-bold text-white leading-none pt-1">
                  R$ 49,90
                </p>
                <p className="text-[11px] text-white/30 pt-1">Em todos os canais do IDM</p>
              </div>

              <div
                className="rounded-2xl border p-7 space-y-2.5 relative"
                style={{ borderColor: 'rgba(255,184,0,0.35)', background: 'linear-gradient(160deg, rgba(255,184,0,0.08), rgba(10,18,50,0.4))' }}
              >
                <p className="text-[11px] font-mono uppercase tracking-widest text-[#FFB800]">Com o cupom da Jocimara</p>
                <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-4xl font-bold text-[#FFC933] leading-none pt-1">
                  R$ 37,80
                </p>
                <p className="text-[11px] text-white/50 pt-1">jocimaraanjos.com.br/cicatrizes-cupom</p>
                <button
                  onClick={abrir}
                  className="mt-2 flex items-center justify-center py-3 rounded-xl bg-[#FFB800] text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] transition-colors"
                >
                  Garantir minha vaga
                </button>
              </div>
            </div>

            <p className="text-xs text-white/30 mt-6 max-w-md">
              Ganhou o workshop de bônus em outro produto do IDM? Sua vaga já está garantida, sem custo adicional.
            </p>

            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-xs text-white/35 hover:text-white/60 transition-colors"
            >
              <MessageCircle className="h-3 w-3" />
              Tirar dúvidas pelo WhatsApp
            </a>
          </div>
        </section>
      </Reveal>

      {/* ── FAQ ──────────────────────────────────── */}
      <Reveal>
        <section className="max-w-3xl mx-auto px-6 sm:px-10 py-20">
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl font-bold text-white mb-10"
          >
            Dúvidas.
          </h2>
          <Accordion type="single" collapsible>
            <div className="divide-y divide-white/5">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-0">
                  <AccordionTrigger className="hover:no-underline py-5 text-left text-sm font-medium text-white/70 hover:text-white transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-white/45 leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </Accordion>
        </section>
      </Reveal>

      {/* ── CTA FINAL ─────────────────────────────── */}
      <section className="relative overflow-hidden py-32 bg-[#0A1232] border-t border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
            backgroundSize: '48px 48px',
          }}
        />
        <Reveal className="relative max-w-3xl mx-auto px-6 sm:px-10 space-y-10">
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-5xl sm:text-6xl font-bold text-white leading-[1.0]"
          >
            Sua próxima turma<br />está quase fechando.
          </h2>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <button
              onClick={abrir}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-[#FFB800] px-8 py-4 text-base font-bold text-[#0D1638] hover:bg-[#FFC933] transition-colors"
              style={{ boxShadow: '0 8px 32px rgba(255,184,0,0.22)' }}
            >
              Quero minha vaga por R$ 37,80
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <p className="text-xs font-mono text-white/25">
            Com o cupom exclusivo da Jocimara · Vagas limitadas
          </p>
        </Reveal>
      </section>
    </>
  )
}
