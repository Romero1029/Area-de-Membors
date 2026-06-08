'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion, type Variants } from 'framer-motion'
import {
  ArrowRight, Check, Star, Sparkles, Shield, Quote,
  Brain, Heart, Zap, Eye, MessageSquare, Award,
  BookOpen, Clock, Globe, MessageCircle, GraduationCap, Users,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────

const WA_URL = 'https://wa.me/5511999999999?text=Olá! Tenho interesse no Instituto Despertamente.'

// ─────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────

const bases = [
  { icon: Brain,        label: 'Neurociências' },
  { icon: Eye,          label: 'Psicanálise' },
  { icon: MessageSquare,label: 'PNL' },
  { icon: Award,        label: 'ICF Certified' },
]

const numeros = [
  { valor: '2.400+', label: 'alunos transformados' },
  { valor: '94%',    label: 'completam o curso' },
  { valor: '4.9★',   label: 'avaliação média' },
  { valor: '8 anos', label: 'de metodologia' },
]

const dores = [
  {
    icon: Brain,
    dor: 'Você sabe o que precisa mudar, mas não consegue.',
    transformacao: 'Com o método IDM, você para de lutar contra si mesmo e começa a se entender de verdade.',
  },
  {
    icon: Heart,
    dor: 'Seus relacionamentos se repetem nos mesmos padrões.',
    transformacao: 'Você identifica a raiz emocional e transforma o padrão de uma vez por todas.',
  },
  {
    icon: Zap,
    dor: 'Você consome conteúdo mas não vê transformação real.',
    transformacao: 'Aqui é prática. Você sente a mudança antes de terminar o primeiro módulo.',
  },
]

const pilares = [
  {
    icon: Brain,
    titulo: 'Neurociências',
    subtitulo: 'Entenda os padrões',
    desc: 'Descubra como o cérebro cria comportamentos automáticos que sabotam sua vida — e como a neurociência explica (e resolve) o que parece impossível de mudar.',
  },
  {
    icon: Eye,
    titulo: 'Psicanálise',
    subtitulo: 'Reconheça a raiz',
    desc: 'Acesse o inconsciente para identificar onde os padrões começaram. Padrões emocionais, relacionamentos difíceis e autossabotagem têm uma origem. Ela pode ser encontrada.',
  },
  {
    icon: MessageSquare,
    titulo: 'PNL',
    subtitulo: 'Reprograme agora',
    desc: 'Com técnicas validadas de Programação Neurolinguística, você transforma o que compreendeu em comportamento novo. Rápido, prático e duradouro.',
  },
]

const programasFallback: Programa[] = [
  {
    id: '1',
    title: 'Psicanálise Prática',
    slug: 'psicanalise-pratica',
    short_description: 'Entenda sua mente, quebre padrões e transforme relacionamentos com uma das abordagens mais poderosas da psicologia humana.',
    thumbnail_url: null,
  },
  {
    id: '2',
    title: 'NPA 2.0',
    slug: 'npa-2',
    short_description: 'O Núcleo de Padrões Automatizados revela por que você repete os mesmos erros — e como parar para sempre com isso.',
    thumbnail_url: null,
  },
  {
    id: '3',
    title: 'Practitioner PNL',
    slug: 'practitioner-pnl',
    short_description: 'A certificação mais completa em Programação Neurolinguística para quem quer comunicar melhor, liderar e se transformar.',
    thumbnail_url: null,
  },
]

const FUNDADOR_DATA = {
  nome: 'Nome do Fundador',
  inicial: 'F',
  cargo: 'Fundador do Instituto Despertamente',
  credenciais: ['Psicanalista Clínico', 'Master Practitioner PNL', 'ICF Certified Coach'],
  bio: [
    'Fundei o Instituto Despertamente após perceber que a maioria das pessoas não sofre de falta de informação — sofre de falta de transformação real. Com mais de 8 anos dedicados ao desenvolvimento humano, desenvolvi um método que une neurociência, psicanálise e PNL de forma prática e acessível.',
    'Já ajudei mais de 2.400 pessoas a se entenderem profundamente, quebrarem padrões que as limitavam e construírem a vida que realmente desejam. Hoje o IDM é referência no Brasil em formação humana baseada em ciência.',
  ],
  quote: '"Transformação real não acontece com mais informação. Acontece quando você para de lutar contra si mesmo."',
  fotoUrl: null as string | null,
  metricas: [
    { valor: '8+', label: 'anos de experiência' },
    { valor: '2.400+', label: 'alunos formados' },
    { valor: '3', label: 'certificações internacionais' },
  ],
}

const passos = [
  { num: '01', titulo: 'Crie sua conta gratuita', desc: 'Menos de 2 minutos. Sem cartão de crédito.' },
  { num: '02', titulo: 'Assista a aula de boas-vindas', desc: 'Uma aula que muda sua perspectiva imediatamente.' },
  { num: '03', titulo: 'Escolha sua jornada', desc: 'Cursos, mentorias ou eventos presenciais.' },
]

const faqItems = [
  {
    q: 'O cadastro inicial é realmente gratuito?',
    a: 'Sim, 100% gratuito. Você cria sua conta, acessa a aula de boas-vindas e explora todas as jornadas disponíveis sem precisar de cartão de crédito.',
  },
  {
    q: 'Quais programas estão disponíveis?',
    a: 'Hoje oferecemos Psicanálise Prática, NPA 2.0 e Practitioner PNL. Novos programas são lançados regularmente. Após criar sua conta gratuita, você tem acesso a todos os detalhes.',
  },
  {
    q: 'Quanto tempo por dia preciso dedicar?',
    a: 'As jornadas foram desenhadas para quem tem agenda cheia. De 30 a 45 minutos por dia são suficientes. Você acessa no seu ritmo, sem horários fixos.',
  },
  {
    q: 'O certificado é reconhecido internacionalmente?',
    a: 'Sim. Nossas certificações seguem os padrões da ICF (International Coaching Federation) e da ABNLP (American Board of NLP), os dois maiores organismos internacionais da área.',
  },
  {
    q: 'Posso parcelar? Aceita Pix?',
    a: 'Sim para ambos. Parcelamos em até 12x no cartão de crédito. Para pagamentos via Pix, oferecemos um desconto especial. Os detalhes aparecem na página de cada programa.',
  },
  {
    q: 'Tem garantia de reembolso?',
    a: 'Garantia total de 7 dias. Se por qualquer motivo você não estiver satisfeito, basta solicitar e devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.',
  },
  {
    q: 'O conteúdo é 100% online? Posso acessar quando quiser?',
    a: 'Sim, tudo online e assíncrono. Após a matrícula, o conteúdo fica disponível por tempo indeterminado. Você assiste, pausa e revisa quantas vezes precisar.',
  },
  {
    q: 'Preciso ter experiência anterior em psicologia ou PNL?',
    a: 'Nenhuma. Os programas foram desenhados para começar do zero. Se você já tem base, vai aprofundar. Se não tem, vai construir com solidez.',
  },
  {
    q: 'Existe suporte ou comunidade de alunos?',
    a: 'Sim. Além do suporte por e-mail, você entra em uma comunidade exclusiva de alunos com lives mensais com o instrutor, grupos de estudo e acompanhamento contínuo.',
  },
  {
    q: 'Posso usar o certificado para atuar como profissional?',
    a: 'Nossas certificações habilitam você a atuar como coach, facilitador e practitioner em PNL e psicanálise complementar. Para o exercício clínico regulamentado pelo CFP/CRP, a formação complementa — mas não substitui — a graduação em Psicologia.',
  },
  {
    q: 'Qual plataforma vocês usam para as aulas?',
    a: 'Nossa própria plataforma, o IDM Membros. Disponível em qualquer dispositivo — computador, tablet ou celular — sem precisar instalar nada.',
  },
  {
    q: 'Como funciona o processo de inscrição?',
    a: 'Simples: crie sua conta gratuita, escolha sua jornada, finalize o pagamento (Pix ou cartão) e o acesso é liberado em minutos. Pronto.',
  },
]

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Depo    { nome: string; papel: string; texto: string; estrelas: number }
export interface Programa { id: string; title: string; slug: string; short_description: string | null; thumbnail_url: string | null }

interface Props {
  depos: Depo[]
  programas: Programa[]
}

// ─────────────────────────────────────────────
// ANIMATION HELPERS
// ─────────────────────────────────────────────

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

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const { ref, inView } = useScrollReveal()
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function ComecarAnimated({ depos, programas }: Props) {
  const shouldReduce = useReducedMotion()
  const displayProgramas = programas.length > 0 ? programas : programasFallback
  const displayDepos = depos.length >= 6 ? depos.slice(0, 6) : [...depos, ...depos, ...depos].slice(0, 6)

  return (
    <>
      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

        {/* Atmospheric background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[#c79a3b]/5 blur-[140px]"
            animate={shouldReduce ? {} : { scale: [1, 1.08, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#0f2233]/60 blur-[100px]"
            animate={shouldReduce ? {} : { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(rgba(199,154,59,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(199,154,59,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-10 py-20 grid lg:grid-cols-2 gap-14 items-center">

          {/* Copy */}
          <motion.div className="space-y-7" variants={stagger} initial="initial" animate="animate">

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
              O método IDM já ajudou mais de 2.400 pessoas a finalmente se entenderem — e mudarem de verdade. Baseado em neurociência, psicanálise e PNL.
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
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#25D366]/30 px-7 py-4 text-base font-semibold text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/8 transition-all"
                >
                  <MessageCircle className="h-4 w-4" />
                  Falar pelo WhatsApp
                </a>
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

          {/* Hero image card */}
          <motion.div
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          >
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
            <motion.div
              className="absolute -top-6 -right-6 h-24 w-24 rounded-full border border-[#c79a3b]/20"
              animate={shouldReduce ? {} : { rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full border border-[#c79a3b]/10" />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. BASES CIENTÍFICAS strip
      ══════════════════════════════════════════ */}
      <section className="border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#404040] shrink-0">Baseado em</span>
          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8">
            {bases.map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#606060]">
                <Icon className="h-4 w-4 text-[#c79a3b]" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. NÚMEROS
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section className="border-b border-white/5 bg-[#0d0d0d]">
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

      {/* ══════════════════════════════════════════
          4. PARA QUEM É
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Para quem é isso</p>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Você se reconhece aqui?
            </h2>
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
                <div className="h-10 w-10 rounded-xl bg-[#c79a3b]/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-[#c79a3b]" />
                </div>
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

      {/* ══════════════════════════════════════════
          5. O MÉTODO IDM
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section id="metodologia" className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-14">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Nossa abordagem</p>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
              >
                O Método IDM
              </h2>
              <p className="text-[#a0a0a0] max-w-2xl mx-auto leading-relaxed">
                Não aplicamos um método genérico. Usamos três ao mesmo tempo — porque o ser humano não funciona em compartimentos.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-5 relative">
              {/* Connecting line (desktop) */}
              <div className="hidden sm:block absolute top-[2.6rem] left-[calc(16.7%+1.5rem)] right-[calc(16.7%+1.5rem)] h-px"
                style={{ background: 'repeating-linear-gradient(90deg, rgba(199,154,59,0.3) 0, rgba(199,154,59,0.3) 6px, transparent 6px, transparent 14px)' }}
              />

              {pilares.map(({ icon: Icon, titulo, subtitulo, desc }, i) => (
                <motion.div
                  key={titulo}
                  className="relative rounded-2xl border border-[#1e1e1e] bg-[#0a0a0a] p-6 space-y-4 hover:border-[#c79a3b]/25 transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                >
                  {/* Step number */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 z-10 shrink-0">
                      <Icon className="h-5 w-5 text-[#c79a3b]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">0{i + 1}</p>
                      <p className="text-base font-bold text-[#f0f0f0]">{titulo}</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-[#c79a3b]">{subtitulo}</p>
                  <p className="text-sm text-[#606060] leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <a
                href="/register"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#c79a3b] hover:text-[#e8b84b] transition-colors"
              >
                Experimente o método gratuitamente
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════
          6. JORNADAS / PROGRAMAS
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section id="jornadas" className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Programas disponíveis</p>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Escolha sua jornada
            </h2>
            <p className="text-[#a0a0a0] max-w-xl mx-auto">
              Cada programa é desenhado para uma transformação específica — com certificado reconhecido internacionalmente.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {displayProgramas.map((prog, i) => (
              <motion.div
                key={prog.id}
                className="group rounded-2xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden hover:border-[#c79a3b]/30 transition-all duration-300 flex flex-col"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                whileHover={{ y: -4 }}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  {prog.thumbnail_url ? (
                    <Image src={prog.thumbnail_url} alt={prog.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${['#0f1f33','#1a0f0f','#0f1a0f'][i % 3]} 0%, #1a1507 100%)` }}
                    >
                      <GraduationCap className="h-10 w-10 text-[#c79a3b]/40" />
                    </div>
                  )}
                  {/* Certified badge */}
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-[#c79a3b]/15 border border-[#c79a3b]/30 text-[#c79a3b] px-2.5 py-1 rounded-full backdrop-blur-sm">
                    Certificado
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 space-y-3">
                  <h3 className="font-bold text-[#f0f0f0] text-base leading-snug">{prog.title}</h3>
                  {prog.short_description && (
                    <p className="text-sm text-[#606060] leading-relaxed line-clamp-2 flex-1">{prog.short_description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-[#505050] pt-1">
                    <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Acesso imediato</span>
                    <span className="flex items-center gap-1.5"><BookOpen className="h-3.5 w-3.5" />Online</span>
                  </div>
                  <Link
                    href="/loja"
                    className="group/btn mt-auto flex items-center gap-1.5 text-sm font-semibold text-[#c79a3b] hover:text-[#e8b84b] transition-colors pt-1"
                  >
                    Conhecer programa
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/loja"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#2a2a2a] text-sm font-semibold text-[#a0a0a0] hover:border-[#c79a3b]/30 hover:text-[#f0f0f0] transition-all"
            >
              Ver todos os programas
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════
          7. COMO FUNCIONA
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-14">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">O caminho</p>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
              >
                Simples. Direto. Sem enrolação.
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-10 relative">
              <div
                className="hidden sm:block absolute top-8 left-[16.6%] right-[16.6%] h-px"
                style={{ background: 'linear-gradient(90deg, transparent, rgba(199,154,59,0.25), transparent)' }}
              />
              {passos.map(({ num, titulo, desc }, i) => (
                <motion.div
                  key={num}
                  className="flex flex-col items-center text-center gap-5"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                >
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 z-10">
                    <span
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                      className="text-2xl font-black text-[#c79a3b]"
                    >
                      {num}
                    </span>
                  </div>
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

      {/* ══════════════════════════════════════════
          8. SOBRE O FUNDADOR
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section id="instrutor" className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
          <div className="text-center space-y-3 mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Quem está por trás</p>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Conheça o fundador
            </h2>
          </div>

          <div className="grid md:grid-cols-[280px_1fr] gap-10 lg:gap-16 items-start">

            {/* Photo + metrics column */}
            <div className="flex flex-col items-center md:items-start gap-6">
              {/* Photo */}
              <div
                className="relative w-56 h-56 md:w-full md:h-auto md:aspect-square rounded-2xl overflow-hidden shrink-0"
                style={{ border: '2px solid rgba(199,154,59,0.4)', boxShadow: '0 0 40px rgba(199,154,59,0.12)' }}
              >
                {FUNDADOR_DATA.fotoUrl ? (
                  <Image src={FUNDADOR_DATA.fotoUrl} alt={FUNDADOR_DATA.nome} fill className="object-cover" />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #0f1f33 0%, #1a1507 100%)' }}
                  >
                    <span
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                      className="text-7xl font-black text-[#c79a3b]/30"
                    >
                      {FUNDADOR_DATA.inicial}
                    </span>
                  </div>
                )}
              </div>

              {/* Metrics */}
              <div className="w-full grid grid-cols-3 md:grid-cols-1 gap-3">
                {FUNDADOR_DATA.metricas.map(m => (
                  <div
                    key={m.label}
                    className="rounded-xl bg-[#0d0d0d] border border-[#1e1e1e] p-3 text-center md:text-left"
                  >
                    <p
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                      className="text-xl font-bold text-[#c79a3b]"
                    >
                      {m.valor}
                    </p>
                    <p className="text-xs text-[#606060]">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio column */}
            <div className="space-y-5">
              <div>
                <h3
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-2xl sm:text-3xl font-bold text-[#f0f0f0]"
                >
                  {FUNDADOR_DATA.nome}
                </h3>
                <p className="text-sm text-[#c79a3b] mt-1">{FUNDADOR_DATA.cargo}</p>
              </div>

              {/* Credentials */}
              <div className="flex flex-wrap gap-2">
                {FUNDADOR_DATA.credenciais.map(c => (
                  <span
                    key={c}
                    className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#2a2a2a] text-[#a0a0a0] bg-[#0d0d0d]"
                  >
                    {c}
                  </span>
                ))}
              </div>

              {/* Bio paragraphs */}
              {FUNDADOR_DATA.bio.map((p, i) => (
                <p key={i} className="text-[#a0a0a0] leading-relaxed">{p}</p>
              ))}

              {/* Quote */}
              <blockquote
                className="border-l-2 border-[#c79a3b]/40 pl-5 py-1 italic text-[#f0f0f0]/80 leading-relaxed"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {FUNDADOR_DATA.quote}
              </blockquote>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════
          9. DEPOIMENTOS
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section id="depoimentos" className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
            <div className="text-center space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Histórias reais</p>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
              >
                O que dizem quem já mudou
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayDepos.map((d, i) => (
                <motion.div
                  key={i}
                  className="relative rounded-2xl border border-white/6 bg-[#0a0a0a] p-6 space-y-4 flex flex-col"
                  initial={{ opacity: 0, y: 30, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.12, duration: 0.55 }}
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
                      {Array(d.estrelas).fill(0).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-[#c79a3b] text-[#c79a3b]" />
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════
          10. CERTIFICAÇÃO
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section id="certificacao" className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
          <div className="rounded-3xl border border-[#c79a3b]/15 bg-[#0d0d0d] overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0f1a07 100%)' }}
          >
            <div className="p-8 sm:p-12 space-y-10">
              <div className="text-center space-y-3">
                <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 mx-auto">
                  <Award className="h-7 w-7 text-[#c79a3b]" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Certificação oficial</p>
                <h2
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
                >
                  Você sai com um certificado real.
                </h2>
                <p className="text-[#a0a0a0] max-w-xl mx-auto">
                  Não é um certificado de conclusão genérico. É uma credencial reconhecida internacionalmente que você pode usar no seu currículo e LinkedIn.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                {[
                  {
                    icon: GraduationCap,
                    titulo: 'O que você recebe',
                    desc: 'Certificado digital assinado pelo instrutor + versão física disponível por demanda. Válido para atuar como praticante e facilitador.',
                  },
                  {
                    icon: Globe,
                    titulo: 'Reconhecimento',
                    desc: 'Alinhado com ICF (International Coaching Federation) e ABNLP (American Board of NLP) — os dois maiores organismos internacionais da área.',
                  },
                  {
                    icon: Users,
                    titulo: 'Como usar',
                    desc: 'Apresente como formação complementar em CV, LinkedIn e propostas profissionais. Ideal para coaches, terapeutas e facilitadores.',
                  },
                ].map(({ icon: Icon, titulo, desc }, i) => (
                  <div key={i} className="rounded-2xl border border-[#1e1e1e] bg-[#0a0a0a] p-5 space-y-3">
                    <div className="h-9 w-9 rounded-xl bg-[#c79a3b]/10 flex items-center justify-center">
                      <Icon className="h-4.5 w-4.5 text-[#c79a3b]" />
                    </div>
                    <h3 className="font-bold text-[#f0f0f0] text-sm">{titulo}</h3>
                    <p className="text-xs text-[#606060] leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════
          11. GARANTIA
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-2xl mx-auto px-6 sm:px-10 py-20 text-center space-y-6">
            <motion.div
              className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/25 mx-auto"
              animate={shouldReduce ? {} : { scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Shield className="h-8 w-8 text-[#c79a3b]" />
            </motion.div>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Risco zero</p>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
              >
                Garantia de 7 dias
              </h2>
            </div>
            <p className="text-lg text-[#a0a0a0] leading-relaxed max-w-lg mx-auto">
              Se em 7 dias você não sentir diferença — ou simplesmente mudar de ideia — devolvemos <strong className="text-[#f0f0f0]">100% do seu investimento</strong>. Sem burocracia. Sem perguntas.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#606060] pt-2">
              {['Reembolso imediato', 'Sem formulários longos', 'Sem julgamentos'].map(item => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#c79a3b]" /> {item}
                </span>
              ))}
            </div>
            <Link
              href="/register"
              className="inline-flex items-center gap-2.5 rounded-xl bg-[#c79a3b] px-8 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors mt-2"
              style={{ boxShadow: '0 8px 32px rgba(199,154,59,0.28)' }}
            >
              Começar com garantia
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════
          12. FAQ
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section id="faq" className="max-w-3xl mx-auto px-6 sm:px-10 py-20 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Perguntas frequentes</p>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Tirando as dúvidas
            </h2>
          </div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqItems.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border border-[#1e1e1e] rounded-xl bg-[#0d0d0d] px-5 py-0 overflow-hidden data-[state=open]:border-[#c79a3b]/25 transition-colors"
              >
                <AccordionTrigger className="text-[#f0f0f0] font-semibold text-sm hover:no-underline hover:text-[#f0f0f0] py-4 text-left">
                  <span className="text-[#c79a3b] font-bold mr-3 shrink-0 font-mono text-xs">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-[#a0a0a0] text-sm leading-relaxed pb-4">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center space-y-2">
            <p className="text-sm text-[#606060]">Ainda tem dúvidas?</p>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#25D366] hover:text-[#22c55e] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Falar com a equipe pelo WhatsApp
            </a>
          </div>
        </section>
      </RevealSection>

      {/* ══════════════════════════════════════════
          13. CTA FINAL
      ══════════════════════════════════════════ */}
      <RevealSection>
        <section className="relative overflow-hidden py-24 border-t border-white/5">
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
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] leading-tight"
              >
                Pronto para a mudança<br />que você já sabe<br />
                <span className="text-[#c79a3b] italic">que precisa fazer?</span>
              </h2>
              <p className="text-[#a0a0a0] max-w-md mx-auto text-lg">
                Mais de 2.400 pessoas já tomaram essa decisão. Sua conta é gratuita. Começa agora.
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-5 rounded-2xl border border-[#25D366]/30 text-base font-semibold text-[#25D366] hover:bg-[#25D366]/8 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                WhatsApp
              </a>
            </div>

            <motion.div
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#606060]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#c79a3b]" /> Garantia de 7 dias</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#c79a3b]" /> Sem cartão de crédito</span>
              <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#c79a3b]" /> Acesso imediato</span>
            </motion.div>
          </div>
        </section>
      </RevealSection>
    </>
  )
}
