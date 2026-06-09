'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, GraduationCap, BookOpen, Clock } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const WA_URL = 'https://wa.me/5511999999999?text=Olá! Tenho interesse no Instituto Despertamente.'

const numeros = [
  { valor: '2.400+', label: 'alunos transformados' },
  { valor: '94%',    label: 'completam o curso' },
  { valor: '4.9',    label: 'avaliação média' },
  { valor: '8 anos', label: 'de metodologia' },
]

const dores = [
  {
    problema: 'Você já tentou tudo — coaching, livros, terapia — e ainda trava nos mesmos lugares.',
    solucao: 'No IDM, você para de tratar sintomas e começa a entender a raiz. O padrão só muda quando você o entende.',
  },
  {
    problema: 'Você entende o problema intelectualmente. Mas na hora H, age igual.',
    solucao: 'Entender não é suficiente. O método une neurociência, psicanálise e PNL para fechar essa lacuna entre saber e agir.',
  },
  {
    problema: 'Você sabe, antes de acontecer, que vai repetir. E repete mesmo assim.',
    solucao: 'Isso tem um nome e tem raiz. A raiz pode ser encontrada — e mudada.',
  },
]

const pilares = [
  {
    numero: '01',
    titulo: 'Neurociências',
    desc: 'Você vai entender por que o cérebro cria comportamentos automáticos que parecem impossíveis de mudar. Depois vai aprender a mudar.',
  },
  {
    numero: '02',
    titulo: 'Psicanálise',
    desc: 'Acesse o inconsciente para identificar onde os padrões começaram. Relacionamentos difíceis, autossabotagem, repetição — tudo tem uma origem rastreável.',
  },
  {
    numero: '03',
    titulo: 'PNL',
    desc: 'Com técnicas de Programação Neurolinguística, você transforma o que compreendeu em comportamento novo. Sem esperar anos.',
  },
]

const programasFallback: Programa[] = [
  {
    id: '1',
    title: 'Psicanálise Integrativa',
    slug: 'psicanalise-integrativa',
    short_description: 'Formação completa: do inconsciente à prática clínica. Teoria, análise pessoal e supervisão.',
    thumbnail_url: null,
  },
  {
    id: '2',
    title: 'NPA 2.0',
    slug: 'npa-2',
    short_description: 'O Núcleo de Padrões Automatizados revela por que você repete os mesmos erros — e como parar com isso.',
    thumbnail_url: null,
  },
  {
    id: '3',
    title: 'Practitioner PNL',
    slug: 'practitioner-pnl',
    short_description: 'A certificação mais completa em Programação Neurolinguística para quem quer comunicar melhor e se transformar.',
    thumbnail_url: null,
  },
]

const FUNDADOR_DATA = {
  nome: 'Nome do Fundador',
  inicial: 'F',
  cargo: 'Fundador do Instituto Despertamente',
  bio: [
    'Fundei o Instituto Despertamente depois de perceber que a maioria das pessoas não sofre de falta de informação — sofre de falta de transformação real. Com mais de 8 anos dedicados ao desenvolvimento humano, desenvolvi um método que une neurociência, psicanálise e PNL de forma prática e acessível.',
    'Já ajudei mais de 2.400 pessoas a se entenderem profundamente, quebrarem padrões e construírem a vida que realmente desejam.',
  ],
  quote: '"Transformação real não acontece com mais informação. Acontece quando você para de lutar contra si mesmo."',
  fotoUrl: null as string | null,
}

const passos = [
  { titulo: 'Crie sua conta gratuita', desc: 'Menos de 2 minutos. Sem cartão de crédito.' },
  { titulo: 'Acesse a aula de boas-vindas', desc: 'Uma aula que muda sua perspectiva imediatamente.' },
  { titulo: 'Escolha sua jornada', desc: 'Programas, mentorias ou eventos presenciais.' },
  { titulo: 'Aplique e transforme', desc: 'O método funciona na prática. Você sente antes de terminar o primeiro módulo.' },
]

const faqItems = [
  {
    q: 'O cadastro inicial é realmente gratuito?',
    a: 'Sim, 100% gratuito. Você cria sua conta, acessa a aula de boas-vindas e explora todas as jornadas disponíveis sem precisar de cartão de crédito.',
  },
  {
    q: 'Quais programas estão disponíveis?',
    a: 'Psicanálise Integrativa, NPA 2.0 e Practitioner PNL são os principais. Novos programas são lançados regularmente. Criando sua conta gratuita, você acessa todos os detalhes.',
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
    a: 'Sim para ambos. Parcelamos em até 12x no cartão. Para pagamentos via Pix, oferecemos desconto especial. Os detalhes aparecem na página de cada programa.',
  },
  {
    q: 'Tem garantia de reembolso?',
    a: 'Garantia total de 7 dias. Se por qualquer motivo você não estiver satisfeito, devolvemos 100% do seu investimento. Sem perguntas, sem burocracia.',
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
    a: 'Sim. Além do suporte por e-mail, você entra em uma comunidade exclusiva de alunos com lives mensais, grupos de estudo e acompanhamento contínuo.',
  },
  {
    q: 'Posso usar o certificado para atuar como profissional?',
    a: 'Nossas certificações habilitam você a atuar como coach, facilitador e practitioner em PNL e psicanálise complementar. Para o exercício clínico regulamentado pelo CFP/CRP, a formação complementa — mas não substitui — a graduação em Psicologia.',
  },
  {
    q: 'Qual plataforma vocês usam?',
    a: 'Nossa própria plataforma, o IDM Membros. Disponível em qualquer dispositivo — computador, tablet ou celular — sem precisar instalar nada.',
  },
  {
    q: 'Como funciona o processo de inscrição?',
    a: 'Crie sua conta gratuita, escolha sua jornada, finalize o pagamento (Pix ou cartão) e o acesso é liberado em minutos.',
  },
]

interface Depo { nome: string; papel: string; texto: string; estrelas: number }
export interface Programa { id: string; title: string; slug: string; short_description: string | null; thumbnail_url: string | null }
interface Props { depos: Depo[]; programas: Programa[] }

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' as `${number}px` })
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function ComecarAnimated({ depos, programas }: Props) {
  const displayProgramas = programas.length > 0 ? programas : programasFallback
  const featuredDepo = depos[0] ?? {
    nome: 'Ana Beatriz S.',
    papel: 'Aluna — Psicanálise Prática',
    texto: 'Eu tentei terapia por anos. O método IDM foi o único que me fez entender POR QUÊ eu agia do jeito que agia. Em 3 semanas mudei mais do que em 3 anos.',
    estrelas: 5,
  }
  const otherDepos = depos.length > 1
    ? depos.slice(1, 4)
    : [
        { nome: 'Marcos Vinicius', papel: 'Aluno — NPA 2.0', texto: 'Nunca imaginei que padrões dos meus avós ainda me afetavam. Depois do NPA, finalmente sou eu mesmo.', estrelas: 5 },
        { nome: 'Fernanda Lima', papel: 'Aluna — Practitioner PNL', texto: 'A certificação foi incrível, mas o que ficou foi a transformação pessoal. Recomendo sem hesitar.', estrelas: 5 },
        { nome: 'Ricardo A.', papel: 'Aluno — NPA 2.0', texto: 'O método funciona fora das aulas. Já usei em reuniões de trabalho e nos meus relacionamentos.', estrelas: 5 },
      ]

  return (
    <>
      {/* ── 1. HERO ─────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col justify-end pb-20 pt-32 overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.025) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      >
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[700px] rounded-full bg-[#c79a3b]/4 blur-[260px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 w-full space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-7"
          >
            <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-[#404040]">
              Instituto Despertamente
            </p>
            <h1
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-[60px] sm:text-[76px] lg:text-[96px] font-bold leading-[0.97] text-[#f0f0f0] tracking-tight max-w-3xl"
            >
              Você não falta<br />força de vontade.
            </h1>
            <div className="w-full max-w-3xl h-px bg-white/6" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid sm:grid-cols-[1fr_auto] gap-8 items-end max-w-3xl"
          >
            <p className="text-base text-[#4a4a4a] leading-relaxed max-w-md">
              Falta entender o que está por baixo. O IDM usa neurociência, psicanálise e PNL para que você entenda — de verdade — por que repete os mesmos padrões. E como parar.
            </p>
            <div className="flex flex-col items-start sm:items-end gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2.5 rounded-xl bg-[#c79a3b] px-7 py-3.5 text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors whitespace-nowrap"
                style={{ boxShadow: '0 8px 32px rgba(199,154,59,0.22)' }}
              >
                Começar agora — é grátis
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-[11px] font-mono text-[#303030]">2.400+ pessoas · cadastro gratuito</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 2. BASES ────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#383838] shrink-0">Baseado em</span>
          {['Neurociências', 'Psicanálise', 'PNL', 'ICF Certified'].map(l => (
            <span key={l} className="text-xs font-semibold text-[#505050] tracking-wide">{l}</span>
          ))}
        </div>
      </section>

      {/* ── 3. NÚMEROS — linha horizontal ───────── */}
      <RevealSection>
        <section className="border-b border-white/5 bg-[#0d0d0d]">
          <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12">
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
              {numeros.map(({ valor, label }) => (
                <div key={label} className="text-center">
                  <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl font-bold text-[#c79a3b]">{valor}</p>
                  <p className="text-xs text-[#505050] mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── 4. PARA QUEM É ──────────────────────── */}
      <RevealSection>
        <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
          <div className="grid sm:grid-cols-2 gap-12 lg:gap-20 items-start">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] leading-tight"
            >
              Você se<br />reconhece aqui?
            </h2>
            <div className="divide-y divide-white/6">
              {dores.map((d, i) => (
                <div key={i} className="py-6 first:pt-0 space-y-2">
                  <p className="text-sm text-[#707070] leading-relaxed">{d.problema}</p>
                  <p className="text-xs text-[#484848] leading-relaxed">{d.solucao}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── 5. MÉTODO IDM — números tipográficos ── */}
      <RevealSection>
        <section id="metodologia" className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-12">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold text-[#f0f0f0]"
            >
              Por que o<br />método IDM<br />funciona.
            </h2>
            <div className="space-y-10">
              {pilares.map((p) => (
                <div key={p.numero} className="grid grid-cols-[56px_1fr] sm:grid-cols-[72px_1fr] gap-5 sm:gap-8 items-start">
                  <span
                    style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    className="text-5xl sm:text-6xl font-black text-[#c79a3b]/12 leading-none pt-1 select-none"
                  >
                    {p.numero}
                  </span>
                  <div className="space-y-1.5 pt-1">
                    <h3 className="text-lg font-bold text-[#f0f0f0]">{p.titulo}</h3>
                    <p className="text-sm text-[#606060] leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── 6. JORNADAS ─────────────────────────── */}
      <RevealSection>
        <section id="jornadas" className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-10">
          <div className="space-y-2">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Escolha sua jornada.
            </h2>
            <p className="text-[#606060] max-w-lg text-sm">
              Cada programa é desenhado para uma transformação específica — com certificação reconhecida internacionalmente.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {displayProgramas.map((prog, i) => (
              <div
                key={prog.id}
                className="group rounded-2xl border border-[#1a1a1a] bg-[#0d0d0d] overflow-hidden hover:border-[#252525] transition-colors flex flex-col"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  {prog.thumbnail_url ? (
                    <Image src={prog.thumbnail_url} alt={prog.title} fill className="object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${['#0f1a26', '#1a0f0f', '#0f1a0f'][i % 3]} 0%, #0d0d0d 100%)` }}
                    >
                      <GraduationCap className="h-8 w-8 text-[#252525]" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5 space-y-2">
                  <h3 className="font-bold text-[#e0e0e0] text-sm leading-snug">{prog.title}</h3>
                  {prog.short_description && (
                    <p className="text-xs text-[#505050] leading-relaxed flex-1 line-clamp-3">{prog.short_description}</p>
                  )}
                  <div className="flex gap-4 text-[11px] text-[#383838] pt-1">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Acesso imediato</span>
                    <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />Online</span>
                  </div>
                  <Link
                    href="/loja"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#c79a3b] hover:text-[#e8b84b] transition-colors pt-1"
                  >
                    Conhecer <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link href="/loja" className="inline-flex items-center gap-1.5 text-sm text-[#404040] hover:text-[#808080] transition-colors">
            Ver todos os programas <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </RevealSection>

      {/* ── 7. COMO FUNCIONA — timeline vertical ── */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0] mb-12"
            >
              Simples. Direto. Sem enrolação.
            </h2>
            <div className="max-w-sm relative pl-9 space-y-8 border-l border-white/8">
              {passos.map((p, i) => (
                <div key={i} className="relative">
                  <span className="absolute -left-[41px] top-0.5 w-5 h-5 rounded-full border border-[#c79a3b]/25 bg-[#0d0d0d] flex items-center justify-center text-[10px] font-bold text-[#c79a3b]/80">
                    {i + 1}
                  </span>
                  <h3 className="font-semibold text-[#d0d0d0] text-sm">{p.titulo}</h3>
                  <p className="text-xs text-[#505050] mt-0.5 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── 8. FUNDADOR — sem metric boxes ──────── */}
      <RevealSection>
        <section id="instrutor" className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
          <div className="grid md:grid-cols-[220px_1fr] gap-10 lg:gap-16 items-start">
            <div className="flex flex-col items-center md:items-start">
              <div
                className="w-40 h-40 md:w-full md:aspect-square rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(199,154,59,0.2)' }}
              >
                {FUNDADOR_DATA.fotoUrl ? (
                  <Image src={FUNDADOR_DATA.fotoUrl} alt={FUNDADOR_DATA.nome} width={220} height={220} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
                    <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-6xl font-black text-[#222]">
                      {FUNDADOR_DATA.inicial}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl sm:text-3xl font-bold text-[#f0f0f0]">
                  {FUNDADOR_DATA.nome}
                </h2>
                <p className="text-xs font-mono text-[#c79a3b]/70 mt-1.5 tracking-wider uppercase">{FUNDADOR_DATA.cargo}</p>
              </div>
              {FUNDADOR_DATA.bio.map((paragraph, i) => (
                <p key={i} className="text-[#606060] leading-relaxed text-sm">{paragraph}</p>
              ))}
              <blockquote
                className="border-l-2 border-[#c79a3b]/25 pl-5 py-1 italic text-[#909090] text-sm leading-relaxed"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                {FUNDADOR_DATA.quote}
              </blockquote>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── 9. DEPOIMENTOS — 1 featured + 3 cards ─ */}
      <RevealSection>
        <section id="depoimentos" className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-12">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Histórias reais.
            </h2>

            {/* Featured */}
            <div className="max-w-2xl">
              <span
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="block text-8xl leading-none text-[#c79a3b]/10 select-none"
              >
                &ldquo;
              </span>
              <p className="text-xl italic text-[#d0d0d0]/70 leading-relaxed -mt-6">
                {featuredDepo.texto}
              </p>
              <p className="text-sm text-[#c79a3b] mt-5">{featuredDepo.nome}</p>
              <p className="text-xs text-[#404040] mt-0.5">{featuredDepo.papel}</p>
            </div>

            {/* 3 smaller cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {otherDepos.map((d, i) => (
                <div key={i} className="border border-white/5 rounded-xl p-5 space-y-4">
                  <p className="text-sm italic text-[#505050] leading-relaxed">&ldquo;{d.texto}&rdquo;</p>
                  <div className="pt-3 border-t border-white/5">
                    <p className="text-xs font-semibold text-[#909090]">{d.nome}</p>
                    <p className="text-[11px] text-[#404040] mt-0.5">{d.papel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── 10. CERTIFICAÇÃO — 2 colunas ─────────── */}
      <RevealSection>
        <section id="certificacao" className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
          <div className="grid sm:grid-cols-2 gap-10 sm:gap-16 items-start">
            <div className="space-y-4">
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="text-3xl sm:text-4xl font-bold text-[#f0f0f0] leading-tight"
              >
                Você sai com um certificado real.
              </h2>
              <p className="text-[#606060] leading-relaxed text-sm">
                Não é certificado de conclusão genérico. É uma credencial que você usa no currículo, no LinkedIn e na proposta para clientes.
              </p>
            </div>
            <ul className="space-y-5">
              {[
                'Certificado digital assinado + versão física disponível por demanda.',
                'Alinhado com ICF (International Coaching Federation) e ABNLP (American Board of NLP).',
                'Válido para apresentar como formação complementar em CV e LinkedIn.',
                'Habilita para atuar como coach, facilitador e practitioner.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#606060] leading-relaxed">
                  <Check className="h-4 w-4 text-[#c79a3b] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </RevealSection>

      {/* ── 11. GARANTIA — "7" tipográfico ──────── */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center space-y-5">
            <div className="relative select-none">
              <span
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="block text-[160px] sm:text-[220px] font-black text-[#c79a3b]/5 leading-none"
              >
                7
              </span>
              <h2
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                className="absolute inset-0 flex items-center justify-center text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
              >
                dias de garantia total.
              </h2>
            </div>
            <p className="text-[#606060] max-w-sm mx-auto leading-relaxed text-sm">
              Se não fizer sentido para você — por qualquer motivo — devolvemos tudo. Sem perguntas. Sem burocracia.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c79a3b] px-7 py-3.5 text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
            >
              Começar com garantia
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </RevealSection>

      {/* ── 12. FAQ ──────────────────────────────── */}
      <RevealSection>
        <section id="faq" className="max-w-3xl mx-auto px-6 sm:px-10 py-20">
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] mb-10"
          >
            Dúvidas.
          </h2>
          <Accordion type="single" collapsible>
            <div className="divide-y divide-white/5">
              {faqItems.map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-0">
                  <AccordionTrigger className="hover:no-underline py-5 text-left text-sm font-medium text-[#b0b0b0] hover:text-[#f0f0f0] transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-[#505050] leading-relaxed pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </div>
          </Accordion>
          <p className="text-xs text-[#383838] mt-8">
            Mais dúvidas?{' '}
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-[#555555] hover:text-[#888888] transition-colors underline underline-offset-2">
              Fale com a equipe pelo WhatsApp.
            </a>
          </p>
        </section>
      </RevealSection>

      {/* ── 13. CTA FINAL ───────────────────────── */}
      <section
        className="relative overflow-hidden py-32"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      >
        <RevealSection className="relative max-w-3xl mx-auto px-6 sm:px-10 space-y-10">
          <h2
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#f0f0f0] leading-[1.0]"
          >
            Sua conta é gratuita.<br />Começa agora.
          </h2>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-[#c79a3b] px-8 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
              style={{ boxShadow: '0 8px 32px rgba(199,154,59,0.22)' }}
            >
              Criar minha conta gratuita
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center py-4 text-sm text-[#444444] hover:text-[#707070] transition-colors"
            >
              → WhatsApp
            </a>
          </div>
          <p className="text-xs font-mono text-[#303030]">
            2.400+ pessoas · cadastro gratuito · garantia de 7 dias
          </p>
        </RevealSection>
      </section>
    </>
  )
}
