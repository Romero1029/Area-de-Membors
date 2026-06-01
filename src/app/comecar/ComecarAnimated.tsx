'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import { ArrowRight, Check, Star, Sparkles, Shield, Quote } from 'lucide-react'

interface Dor { icon: LucideIcon; dor: string; transformacao: string }
interface Numero { valor: string; label: string }
interface Passo { num: string; titulo: string; desc: string }
interface Depo { nome: string; papel: string; texto: string; estrelas: number }

interface Props {
  dores: Dor[]
  numeros: Numero[]
  passos: Passo[]
  depos: Depo[]
}

/* Hook para detectar entrada na tela */
function useScrollReveal(margin = '-80px') {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: margin as `${number}px` })
  return { ref, inView }
}

const stagger: Variants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1 } },
}

const staggerItem: Variants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

/* Componente de seção com scroll reveal */
function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useScrollReveal()
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function ComecarAnimated({ dores, numeros, passos, depos }: Props) {
  const shouldReduce = useReducedMotion()

  return (
    <>
      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        {/* Background atmosférico animado */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#c79a3b]/5 blur-[140px]"
            animate={shouldReduce ? {} : {
              scale: [1, 1.08, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#0f2233]/60 blur-[100px]"
            animate={shouldReduce ? {} : {
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          {/* Grade decorativa */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(rgba(199,154,59,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(199,154,59,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-10 py-20 grid lg:grid-cols-2 gap-14 items-center">

          {/* Copy com stagger */}
          <motion.div
            className="space-y-8"
            variants={stagger}
            initial="initial"
            animate="animate"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c79a3b]/25 bg-[#c79a3b]/8 px-4 py-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#c79a3b]" />
                <span className="text-xs font-semibold uppercase tracking-widest text-[#c79a3b]">Há 8 anos transformando vidas</span>
              </span>
            </motion.div>

            <motion.h1
              variants={staggerItem}
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold leading-[1.08] text-[#f0f0f0]"
            >
              Não é mais<br />
              um curso.<br />
              <motion.span
                className="text-[#c79a3b] italic"
                animate={shouldReduce ? {} : { opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                É uma mudança.
              </motion.span>
            </motion.h1>

            <motion.p variants={staggerItem} className="text-lg text-[#a0a0a0] leading-relaxed max-w-md">
              O método IDM já ajudou mais de 2.400 pessoas a finalmente se entenderem — e mudarem de verdade.
            </motion.p>

            <motion.div variants={staggerItem} className="flex flex-col sm:flex-row gap-3">
              <motion.div whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#c79a3b] px-7 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
                  style={{ boxShadow: '0 8px 32px rgba(199,154,59,0.3)' }}
                >
                  Começar agora — é grátis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-7 py-4 text-base font-semibold text-[#f0f0f0] hover:border-white/20 hover:bg-white/5 transition-all"
                >
                  Acessar minha conta
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-wrap gap-5">
              {['Sem cartão', 'Acesso imediato', 'Cancele quando quiser'].map(g => (
                <span key={g} className="flex items-center gap-1.5 text-sm text-[#606060]">
                  <Check className="h-3.5 w-3.5 text-[#c79a3b]" /> {g}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Card visual — imagem temática */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
            {/* Glow atrás do card */}
            <div className="absolute -inset-4 rounded-3xl bg-[#c79a3b]/8 blur-2xl" />

            <div className="relative rounded-2xl overflow-hidden border border-white/8" style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>
              <Image
                src="https://images.unsplash.com/photo-1559757175-5700dde675bc?w=700&q=85"
                alt="Neurociência e psicanálise"
                width={560}
                height={420}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/30 to-transparent" />

              {/* Floating card — prova social */}
              <motion.div
                className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-[#080808]/85 backdrop-blur-xl p-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <div className="flex -space-x-2">
                  {['#c79a3b', '#177c6b', '#3b82f6'].map((c, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#080808] flex items-center justify-center text-xs font-bold text-white" style={{ background: c }}>
                      {['A', 'M', 'F'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0f0f0]">+2.400 alunos ativos</p>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array(5).fill(0).map((_, i) => <Star key={i} className="h-3 w-3 fill-[#c79a3b] text-[#c79a3b]" />)}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Ornamentos */}
            <motion.div
              className="absolute -top-6 -right-6 h-24 w-24 rounded-full border border-[#c79a3b]/20"
              animate={shouldReduce ? {} : { rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full border border-[#c79a3b]/10" />
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════
          NÚMEROS
      ════════════════════════════════ */}
      <RevealSection>
        <section className="border-y border-white/5 bg-[#0d0d0d]">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {numeros.map(({ valor, label }, i) => (
              <motion.div
                key={label}
                className="text-center space-y-1"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl font-bold text-[#c79a3b]">{valor}</p>
                <p className="text-sm text-[#606060]">{label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ════════════════════════════════
          PARA QUEM É
      ════════════════════════════════ */}
      <RevealSection>
        <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
          <div className="text-center space-y-3">
            <motion.p
              className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >Para quem é isso</motion.p>
            <motion.h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Você se reconhece aqui?
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {dores.map(({ icon: Icon, dor, transformacao }, i) => (
              <motion.div
                key={i}
                className="group relative rounded-2xl border border-white/6 bg-[#0d0d0d] p-6 space-y-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{ y: -4, borderColor: 'rgba(199,154,59,0.3)' }}
              >
                <motion.div
                  className="h-10 w-10 rounded-xl bg-[#c79a3b]/10 flex items-center justify-center"
                  whileHover={{ backgroundColor: 'rgba(199,154,59,0.2)', rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Icon className="h-5 w-5 text-[#c79a3b]" />
                </motion.div>
                <div className="space-y-2">
                  <p className="text-sm text-[#606060] italic leading-relaxed">&ldquo;{dor}&rdquo;</p>
                  <div className="w-8 h-px bg-[#c79a3b]/40" />
                  <p className="text-sm text-[#f0f0f0] leading-relaxed">{transformacao}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ════════════════════════════════
          COMO FUNCIONA
      ════════════════════════════════ */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-14">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">O caminho</p>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]">
                Simples. Direto. Sem enrolação.
              </h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-10 relative">
              <div className="hidden sm:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-[#c79a3b]/25 to-transparent" />
              {passos.map(({ num, titulo, desc }, i) => (
                <motion.div
                  key={num}
                  className="flex flex-col items-center text-center gap-5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                >
                  <motion.div
                    className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 z-10"
                    whileHover={{ scale: 1.08, backgroundColor: 'rgba(199,154,59,0.18)' }}
                  >
                    <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-black text-[#c79a3b]">{num}</span>
                  </motion.div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-[#f0f0f0]">{titulo}</h3>
                    <p className="text-sm text-[#606060]">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ════════════════════════════════
          DEPOIMENTOS
      ════════════════════════════════ */}
      <RevealSection>
        <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Histórias reais</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]">
              O que dizem quem já mudou
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {depos.map((d, i) => (
              <motion.div
                key={i}
                className="relative rounded-2xl border border-white/6 bg-[#0d0d0d] p-6 space-y-4 flex flex-col"
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{ borderColor: 'rgba(199,154,59,0.2)', y: -3 }}
              >
                <Quote className="h-6 w-6 text-[#c79a3b]/35 flex-shrink-0" />
                <p className="text-sm text-[#a0a0a0] leading-relaxed flex-1 italic">{d.texto}</p>
                <div className="pt-3 border-t border-white/6 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c79a3b] to-[#e8b84b] flex items-center justify-center text-sm font-bold text-[#080808] flex-shrink-0">
                    {d.nome.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#f0f0f0] truncate">{d.nome}</p>
                    {d.papel && <p className="text-xs text-[#606060] truncate">{d.papel}</p>}
                  </div>
                  <div className="ml-auto flex gap-0.5 flex-shrink-0">
                    {Array(d.estrelas).fill(0).map((_, j) => <Star key={j} className="h-3 w-3 fill-[#c79a3b] text-[#c79a3b]" />)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ════════════════════════════════
          CTA FINAL
      ════════════════════════════════ */}
      <RevealSection>
        <section className="relative overflow-hidden py-24">
          {/* Glow animado */}
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#c79a3b]/6 blur-[120px] pointer-events-none"
            animate={shouldReduce ? {} : { scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative max-w-3xl mx-auto px-6 sm:px-10 text-center space-y-8">
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65 }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Seu momento é agora</p>
              <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] leading-tight">
                Pronto para a mudança<br />que você já sabe<br />
                <span className="text-[#c79a3b] italic">que precisa fazer?</span>
              </h2>
              <p className="text-[#a0a0a0] max-w-md mx-auto text-lg">
                Sua conta é grátis. Mais de 2.400 pessoas já tomaram essa decisão. Qual é a sua desculpa?
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-2xl bg-[#c79a3b] px-10 py-5 text-lg font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
                style={{ boxShadow: '0 16px 48px rgba(199,154,59,0.35)' }}
              >
                Criar minha conta gratuita
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
              </Link>
            </motion.div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#606060]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#c79a3b]" /> Garantia de 7 dias</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#c79a3b]" /> Sem cartão</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#c79a3b]" /> Acesso imediato</span>
            </motion.div>
          </div>
        </section>
      </RevealSection>
    </>
  )
}
