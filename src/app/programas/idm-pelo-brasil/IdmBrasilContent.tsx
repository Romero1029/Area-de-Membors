'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, MessageCircle, MapPin, Calendar } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const WA_URL = 'https://wa.me/5511999999999?text=Olá! Quero saber mais sobre o IDM pelo Brasil.'

// ─────────────────────────────────────────────
// STATIC CONTENT
// ─────────────────────────────────────────────

const painPoints = [
  {
    problema: 'Você aprende online mas sente que a transformação real acontece ao vivo, com pessoas.',
    solucao: 'Imersão presencial',
  },
  {
    problema: 'Você quer estudar psicanálise e PNL mas não mora em São Paulo ou Rio.',
    solucao: 'IDM vem até você',
  },
  {
    problema: 'Você quer um processo intensivo — não espalhado por meses de conteúdo assíncrono.',
    solucao: 'Imersão de 4 dias',
  },
]

const diasPrograma = [
  {
    numero: '01',
    titulo: 'Mapeamento do Inconsciente',
    subtitulo: 'Dia 1',
    conteudo: [
      'O que são padrões inconscientes e como se formam',
      'Técnica de mapeamento de comportamentos automáticos',
      'Identificação dos principais pontos de travamento pessoal',
      'Introdução à escuta analítica — como ouvir o que não é dito',
    ],
  },
  {
    numero: '02',
    titulo: 'Técnicas Integrativas ao Vivo',
    subtitulo: 'Dia 2',
    conteudo: [
      'Regressão terapêutica guiada em grupo supervisionado',
      'Trabalho corporal: o corpo como mapa emocional',
      'Constelações familiares — dinâmica ao vivo',
      'Integração das experiências do dia anterior',
    ],
  },
  {
    numero: '03',
    titulo: 'PNL Aplicada',
    subtitulo: 'Dia 3',
    conteudo: [
      'Fundamentos de PNL para transformação de padrões',
      'Ancoragem: como criar novos estados mentais no corpo',
      'Ressignificação rápida — técnicas práticas aplicadas ao vivo',
      'Como integrar PNL ao seu dia a dia imediatamente',
    ],
  },
  {
    numero: '04',
    titulo: 'Supervisão e Integração',
    subtitulo: 'Dia 4',
    conteudo: [
      'Revisão e consolidação dos quatro dias de trabalho',
      'Sessão de supervisão em grupos pequenos',
      'Plano de aplicação individual — o que você vai fazer na semana seguinte',
      'Emissão do certificado de conclusão do workshop',
    ],
  },
]

const proximasEditions = [
  { cidade: 'São Paulo — SP', data: 'Em breve', vagas: 'Vagas limitadas' },
  { cidade: 'Rio de Janeiro — RJ', data: 'Em breve', vagas: 'Vagas limitadas' },
  { cidade: 'Belo Horizonte — MG', data: 'Em breve', vagas: 'Vagas limitadas' },
  { cidade: 'Curitiba — PR', data: 'Em breve', vagas: 'Vagas limitadas' },
]

const incluso = [
  '4 dias de imersão presencial com o time IDM',
  'Materiais didáticos físicos incluídos',
  'Supervisão clínica em grupos pequenos (máx. 15 pessoas)',
  'Acesso à plataforma IDM Membros por 30 dias pós-evento',
  'Certificado digital de conclusão',
  'Acesso à comunidade exclusiva de alunos IDM',
]

const depoimentos = [
  {
    featured: true,
    nome: 'Mariana C.',
    papel: 'Coach — Rio de Janeiro',
    texto: 'Eu já tinha feito cursos online de PNL e psicanálise. Mas o IDM pelo Brasil foi diferente de tudo. Ao vivo, com pessoas reais, em 4 dias aconteceu mais do que em 6 meses de conteúdo gravado.',
  },
  {
    nome: 'Thiago R.',
    papel: 'Terapeuta — Curitiba',
    texto: 'A sessão de constelação familiar ao vivo foi transformadora. Não tem como substituir a experiência presencial.',
  },
  {
    nome: 'Andressa M.',
    papel: 'Facilitadora — Porto Alegre',
    texto: 'Finalmente o IDM chegou aqui. Valeu muito cada centavo do investimento e cada hora dos 4 dias.',
  },
  {
    nome: 'Fábio L.',
    papel: 'Psicólogo — Belo Horizonte',
    texto: 'O rigor do método IDM aplicado ao presencial superou minhas expectativas. Saí com um plano claro de aplicação.',
  },
]

const faqItems = [
  {
    q: 'Quando serão as próximas edições?',
    a: 'As próximas datas estão sendo definidas. Entre na lista de espera pelo WhatsApp ou acompanhe nossa plataforma — você será notificado quando as inscrições abrirem para sua cidade.',
  },
  {
    q: 'Em quais cidades vocês estarão?',
    a: 'O IDM pelo Brasil já passou por São Paulo, Rio de Janeiro, Belo Horizonte, Curitiba, Porto Alegre e Recife. Estamos sempre expandindo. Se sua cidade não está na lista, entre em contato — a demanda determina o calendário.',
  },
  {
    q: 'O certificado é o mesmo da formação online?',
    a: 'O workshop presencial emite um certificado de conclusão do IDM pelo Brasil. É um certificado diferente da Formação completa em Psicanálise Integrativa, que exige o percurso completo (teoria, análise pessoal e supervisão). O workshop pode ser aproveitado como módulo prático dentro da formação completa.',
  },
  {
    q: 'Quanto custa? Tem parcelamento?',
    a: 'O investimento é apresentado na inscrição. Parcelamos em até 6x no cartão de crédito. Pagamento via Pix tem desconto à vista. Entre em contato pelo WhatsApp para saber o valor atual da sua cidade.',
  },
  {
    q: 'Posso levar acompanhante?',
    a: 'O workshop é individual. Mas muitos alunos vêm com parceiros, amigos ou colegas de profissão — cada um faz a inscrição individualmente.',
  },
  {
    q: 'O que está incluído no investimento?',
    a: '4 dias de imersão presencial, materiais físicos, supervisão em grupo, acesso à plataforma IDM Membros por 30 dias e certificado de conclusão. Coffee breaks incluídos. Hospedagem e transporte por conta do participante.',
  },
  {
    q: 'Como funciona a supervisão pós-evento?',
    a: 'Você tem acesso à plataforma IDM Membros por 30 dias após o workshop. Nesse período, há lives de integração e um grupo de estudos supervisionado para consolidar o que foi aprendido.',
  },
  {
    q: 'Há desconto para alunos já matriculados no IDM?',
    a: 'Sim. Alunos ativos da plataforma IDM Membros têm desconto no workshop presencial. O código é enviado diretamente na plataforma.',
  },
  {
    q: 'Qual é a política de cancelamento?',
    a: 'Cancelamento até 15 dias antes: reembolso integral. Entre 15 e 7 dias: crédito para outra edição. Menos de 7 dias: sem reembolso (mas você pode transferir para outra pessoa).',
  },
  {
    q: 'Como me inscrevo?',
    a: 'Entre em contato pelo WhatsApp ou acesse a plataforma IDM Membros. As inscrições abrem para alunos da plataforma antes do público geral.',
  },
]

export interface ProductData {
  price: number | null
  original_price: number | null
  highlights: string[] | null
  cta_label: string | null
  checkout_url: string | null
}

// ─────────────────────────────────────────────
// ANIMATION HELPER
// ─────────────────────────────────────────────

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' as `${number}px` })
  const shouldReduce = useReducedMotion()
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

export function IdmBrasilContent({ product }: { product: ProductData | null }) {
  const featuredDepo = depoimentos.find(d => d.featured) ?? depoimentos[0]
  const otherDepos = depoimentos.filter(d => !d.featured).slice(0, 3)

  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[700px] h-[500px] rounded-full bg-[#c79a3b]/3 blur-[180px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#0a1a2a]/60 blur-[120px]" />
        </div>

        <div className="relative w-full max-w-4xl mx-auto px-6 sm:px-10 py-24 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#505050]">Workshop presencial · Tour nacional</p>
            <h1
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] text-[#f0f0f0]"
            >
              O IDM chega<br />até a sua cidade.
            </h1>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-2xl sm:text-3xl font-bold text-[#c79a3b] italic leading-tight mt-3"
            >
              Imersão presencial.<br />4 dias. Transformação real.
            </h2>
          </motion.div>

          <motion.p
            className="text-lg text-[#606060] leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Workshops intensivos de Psicanálise Integrativa e PNL aplicado em cidades do Brasil. Aprenda ao vivo, com supervisão clínica e certificação incluída.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <a
              href="#cidades"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-[#c79a3b] px-8 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
              style={{ boxShadow: '0 8px 32px rgba(199,154,59,0.28)' }}
            >
              Ver datas e cidades
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#505050] hover:text-[#a0a0a0] transition-colors"
            >
              → Falar com a equipe
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── PARA QUEM É ────────────────────────── */}
      <RevealSection>
        <section className="border-y border-white/5 bg-[#0d0d0d]">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-16">
            <div className="divide-y divide-white/6">
              {painPoints.map((p, i) => (
                <div key={i} className="py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-lg sm:text-xl font-light text-[#f0f0f0]/55 italic leading-snug max-w-xl">
                    &ldquo;{p.problema}&rdquo;
                  </p>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#c79a3b] shrink-0 sm:text-right">{p.solucao}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── PROGRAMA DOS 4 DIAS ───────────────── */}
      <RevealSection>
        <section className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-10">
          <div className="space-y-2">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              4 dias que mudam a direção.
            </h2>
            <p className="text-[#606060] text-sm max-w-lg">
              Cada dia tem uma função no processo. Não é um curso dividido em blocos — é uma jornada progressiva.
            </p>
          </div>

          <Accordion type="single" collapsible defaultValue="01" className="space-y-2">
            {diasPrograma.map((d) => (
              <AccordionItem
                key={d.numero}
                value={d.numero}
                className="border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] px-5 data-[state=open]:border-[#2a2a2a] transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-left group">
                  <div className="flex items-center gap-4">
                    <span
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                      className="text-3xl font-black text-[#c79a3b]/12 select-none shrink-0 w-10"
                    >
                      {d.numero}
                    </span>
                    <div>
                      <p className="font-semibold text-[#d0d0d0] text-sm group-hover:text-[#f0f0f0] transition-colors">{d.titulo}</p>
                      <p className="text-[11px] text-[#404040] mt-0.5">{d.subtitulo}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-14">
                  <ul className="space-y-2">
                    {d.conteudo.map((c) => (
                      <li key={c} className="flex items-start gap-2.5 text-sm text-[#606060]">
                        <Check className="h-3.5 w-3.5 text-[#c79a3b]/60 shrink-0 mt-0.5" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </RevealSection>

      {/* ── O QUE ESTÁ INCLUÍDO ───────────────── */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
            <div className="grid sm:grid-cols-2 gap-10 sm:gap-16 items-start">
              <div className="space-y-4">
                <h2
                  style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                  className="text-3xl sm:text-4xl font-bold text-[#f0f0f0] leading-tight"
                >
                  O que está<br />incluído.
                </h2>
                <p className="text-[#606060] text-sm leading-relaxed">
                  Não é só o workshop. O IDM pelo Brasil foi desenhado para ser completo — da chegada ao pós-evento.
                </p>
              </div>
              <ul className="space-y-4">
                {incluso.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[#707070] leading-relaxed">
                    <Check className="h-4 w-4 text-[#c79a3b] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ── PRÓXIMAS EDIÇÕES ─────────────────────── */}
      <RevealSection>
        <section id="cidades" className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-10">
          <div className="space-y-2">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Próximas edições.
            </h2>
            <p className="text-[#606060] text-sm">
              Datas sendo confirmadas. Entre na lista de espera para ser o primeiro a saber.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {proximasEditions.map((e) => (
              <div key={e.cidade} className="rounded-xl border border-[#1a1a1a] bg-[#0d0d0d] p-5 flex items-center gap-4">
                <MapPin className="h-4 w-4 text-[#c79a3b]/60 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#d0d0d0] text-sm">{e.cidade}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-[11px] text-[#404040]">
                      <Calendar className="h-3 w-3" />{e.data}
                    </span>
                    <span className="text-[11px] text-[#c79a3b]/60">{e.vagas}</span>
                  </div>
                </div>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-[#c79a3b] hover:text-[#e8b84b] transition-colors shrink-0"
                >
                  Entrar na lista
                </a>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#25D366]/25 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/8 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Quero saber quando chega na minha cidade
            </a>
          </div>
        </section>
      </RevealSection>

      {/* ── DEPOIMENTOS ──────────────────────────── */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-12">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Quem já esteve lá.
            </h2>

            <div className="max-w-2xl">
              <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="block text-8xl leading-none text-[#c79a3b]/10 select-none">
                &ldquo;
              </span>
              <p className="text-lg sm:text-xl italic text-[#d0d0d0]/70 leading-relaxed -mt-6">
                {featuredDepo.texto}
              </p>
              <p className="text-sm text-[#c79a3b] mt-5">{featuredDepo.nome}</p>
              <p className="text-xs text-[#404040] mt-0.5">{featuredDepo.papel}</p>
            </div>

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

      {/* ── INVESTIMENTO ─────────────────────────── */}
      <RevealSection>
        <section className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-8">
          <div className="space-y-2">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Investimento.
            </h2>
            <p className="text-[#606060] text-sm max-w-lg">
              O valor varia conforme a cidade e a data. Entre em contato pelo WhatsApp para saber o investimento da próxima edição na sua região.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-[#0d0d0d] p-8 space-y-5 max-w-md">
            <p className="text-[#c0c0c0] text-sm leading-relaxed">
              Inclui todos os 4 dias, materiais, supervisão, certificado e acesso à plataforma por 30 dias.
            </p>
            <ul className="space-y-2">
              {['Pix com desconto à vista', 'Parcelamento em até 6x', 'Desconto para alunos IDM'].map(i => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-[#606060]">
                  <Check className="h-3.5 w-3.5 text-[#c79a3b]/60 shrink-0" />
                  {i}
                </li>
              ))}
            </ul>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#c79a3b] text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              Saber o valor da minha cidade
            </a>
          </div>

          <p className="text-xs text-[#404040]">Garantia total de 7 dias. Política de cancelamento detalhada no FAQ abaixo.</p>
        </section>
      </RevealSection>

      {/* ── FAQ ──────────────────────────────────── */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 space-y-10">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Perguntas frequentes.
            </h2>
            <Accordion type="single" collapsible className="space-y-1.5">
              {faqItems.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] px-5 data-[state=open]:border-[#252525] transition-colors"
                >
                  <AccordionTrigger className="text-[#c0c0c0] font-medium text-sm hover:no-underline hover:text-[#f0f0f0] py-4 text-left">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#606060] text-sm leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <p className="text-sm text-[#404040]">
              Outras dúvidas?{' '}
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-[#c79a3b] hover:underline">
                Fale diretamente com a equipe.
              </a>
            </p>
          </div>
        </section>
      </RevealSection>

      {/* ── CTA FINAL ─────────────────────────────── */}
      <RevealSection>
        <section className="relative overflow-hidden py-24">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#c79a3b]/5 blur-[120px] pointer-events-none" />
          <div className="relative max-w-2xl mx-auto px-6 sm:px-10 text-center space-y-7">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] leading-tight"
            >
              O IDM está<br />
              <span className="text-[#c79a3b] italic">chegando até você.</span>
            </h2>
            <p className="text-[#606060] max-w-sm mx-auto text-sm">
              Entre na lista de espera e garanta prioridade nas inscrições da sua cidade.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#c79a3b] px-10 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
                style={{ boxShadow: '0 12px 40px rgba(199,154,59,0.3)' }}
              >
                <MessageCircle className="h-4 w-4" />
                Entrar na lista de espera
              </a>
              <Link href="/programas/psicanalise-integrativa" className="text-sm text-[#505050] hover:text-[#a0a0a0] transition-colors">
                → Ver formação online
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>
    </>
  )
}
