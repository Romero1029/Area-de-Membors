'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, MessageCircle } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const WA_URL = 'https://wa.me/5511999999999?text=Olá! Tenho interesse na Formação em Psicanálise Integrativa.'

// ─────────────────────────────────────────────
// STATIC CONTENT
// ─────────────────────────────────────────────

const painPoints = [
  {
    problema: 'Você está em terapia há anos e sente que os mesmos temas voltam sempre.',
    solucao: 'Compreensão profunda',
  },
  {
    problema: 'Você é coach, terapeuta ou facilitador e quer uma base psicanalítica sólida.',
    solucao: 'Formação certificante',
  },
  {
    problema: 'Você quer entender o comportamento humano — o seu e o dos outros.',
    solucao: 'Método integrativo',
  },
]

const modulos = [
  {
    numero: '01',
    titulo: 'Fundamentos da Psicanálise',
    carga: '8 semanas',
    conteudo: [
      'Freud, Jung e Lacan: estruturas do inconsciente',
      'O conceito de transferência e contratransferência',
      'Mecanismos de defesa e sua função adaptativa',
      'Interpretação de sonhos aplicada à prática',
    ],
  },
  {
    numero: '02',
    titulo: 'Análise Pessoal',
    carga: 'Processo individual',
    conteudo: [
      'Sessões de análise pessoal incluídas na formação',
      'O terapeuta que não se conhece não pode conhecer o cliente',
      'Mapeamento dos próprios padrões e pontos cegos',
      'Desenvolvimento da escuta analítica',
    ],
  },
  {
    numero: '03',
    titulo: 'Técnicas Integrativas',
    carga: '10 semanas',
    conteudo: [
      'Regressão terapêutica: origens e aplicação segura',
      'Abordagem somática: o corpo como mapa emocional',
      'Constelações Familiares sistêmicas',
      'Florais de Bach e essências como suporte terapêutico',
    ],
  },
  {
    numero: '04',
    titulo: 'Neurociência Aplicada',
    carga: '6 semanas',
    conteudo: [
      'Como o cérebro cria e mantém padrões automáticos',
      'Neuroplasticidade: o que é e como acelerar',
      'Trauma, memória e reprogramação neural',
      'A conexão entre emoções, corpo e comportamento',
    ],
  },
  {
    numero: '05',
    titulo: 'PNL na Prática Clínica',
    carga: '8 semanas',
    conteudo: [
      'Fundamentos da Programação Neurolinguística',
      'Técnicas de ressignificação rápida',
      'Ancoragem e mudança de estado',
      'Como integrar PNL à escuta psicanalítica',
    ],
  },
  {
    numero: '06',
    titulo: 'Supervisão e Prática Clínica',
    carga: 'Processo contínuo',
    conteudo: [
      'Supervisão de casos reais com profissionais certificados',
      'Grupos de estudo supervisionados',
      'Desenvolvimento da identidade como psicanalista',
      'Ética profissional e limites da atuação',
    ],
  },
  {
    numero: '07',
    titulo: 'Certificação',
    carga: 'Etapa final',
    conteudo: [
      'Avaliação integrativa — teoria e prática',
      'Apresentação de caso clínico supervisionado',
      'Emissão do certificado reconhecido pela ICF e ABNLP',
      'Credencial digital + versão física por demanda',
    ],
  },
]

const passos = [
  { titulo: 'Inscrição', desc: 'Você garante sua vaga, define a forma de pagamento e recebe acesso imediato à plataforma.' },
  { titulo: 'Módulo de imersão', desc: 'Primeira semana intensiva: você entende o método e começa sua análise pessoal.' },
  { titulo: 'Formação progressiva', desc: 'Semana a semana, teoria + prática + supervisão. Sem sobrecarregar, sem ser superficial.' },
  { titulo: 'Certificação', desc: 'Avaliação final, supervisão do caso clínico e emissão da credencial ICF/ABNLP.' },
]

const depoimentos = [
  {
    featured: true,
    nome: 'Luciana P.',
    papel: 'Psicóloga Clínica — São Paulo',
    texto: 'Eu já tinha graduação em Psicologia e me sentia limitada pelos modelos que conhecia. A Psicanálise Integrativa do IDM abriu um nível de compreensão que eu não tinha. Meus atendimentos mudaram completamente.',
  },
  {
    nome: 'Rafael M.',
    papel: 'Coach Executivo — Belo Horizonte',
    texto: 'Minha prática de coaching ficou muito mais profunda. Agora entendo o que está por trás das resistências dos meus clientes.',
  },
  {
    nome: 'Carla S.',
    papel: 'Terapeuta Holística — Porto Alegre',
    texto: 'A análise pessoal incluída na formação foi o que mais me transformou. Não é só um curso. É um processo.',
  },
  {
    nome: 'Eduardo T.',
    papel: 'Professor e Facilitador — Curitiba',
    texto: 'O rigor teórico aliado à prática clínica supervisionada é o que diferencia essa formação de qualquer curso online que já fiz.',
  },
]

const faqItems = [
  {
    q: 'Esse certificado me permite clinicar como psicanalista?',
    a: 'O certificado habilita você a atuar como psicanalista integrativo complementar — facilitando sessões de escuta, análise de padrões e trabalho com o inconsciente. Para o exercício clínico regulamentado pelo CFP/CRP, a formação complementa, mas não substitui, a graduação em Psicologia.',
  },
  {
    q: 'Preciso ter formação em Psicologia antes?',
    a: 'Não. A formação foi desenhada tanto para profissionais de saúde e bem-estar quanto para pessoas sem formação anterior. O programa parte do zero e constrói uma base sólida progressivamente.',
  },
  {
    q: 'Como funciona a análise pessoal incluída?',
    a: 'Você recebe sessões de análise pessoal como parte da formação. A análise acontece com um analista certificado do IDM, de forma individual. É um requisito do processo formativo — a mesma tradição do tripé psicanalítico clássico.',
  },
  {
    q: 'O certificado é reconhecido pelo MEC?',
    a: 'A Psicanálise, por definição, não é regulamentada como profissão pelo MEC no Brasil — ela é uma prática livre. Nosso certificado é reconhecido pela ICF (International Coaching Federation) e pela ABNLP (American Board of NLP), os maiores organismos internacionais da área.',
  },
  {
    q: 'Quantas horas por semana preciso dedicar?',
    a: 'A formação foi estruturada para 6 a 8 horas por semana — entre aulas, supervisão e análise pessoal. É um percurso que demanda comprometimento, não apenas consumo de conteúdo.',
  },
  {
    q: 'Como funciona a supervisão clínica?',
    a: 'A supervisão acontece em grupos pequenos com um supervisor certificado. Você apresenta casos (reais ou estudos de caso), recebe feedback e aprofunda a escuta analítica. A supervisão é parte central do método — não um extra.',
  },
  {
    q: 'As aulas ao vivo são obrigatórias?',
    a: 'As aulas ao vivo são gravadas e disponibilizadas na plataforma. A participação ao vivo é recomendada, mas não é impeditivo de prosseguir. A supervisão em grupo tem horários fixos — esses sim, requerem presença (ou justificativa).',
  },
  {
    q: 'Qual é a diferença entre esta formação e a SBPI?',
    a: 'A SBPI tem uma formação excelente com foco na tradição clássica integrativa. O IDM integra explicitamente neurociência e PNL ao processo, o que torna a formação única para quem quer trabalhar na intersecção de diferentes abordagens.',
  },
  {
    q: 'Aceita parcelamento? Tem Pix com desconto?',
    a: 'Sim para ambos. Parcelamos em até 12x no cartão sem juros. Pagamento via Pix tem desconto especial. Ambas as opções são apresentadas no checkout.',
  },
  {
    q: 'Tem garantia de reembolso?',
    a: 'Garantia total de 7 dias. Se nos primeiros 7 dias você sentir que não é para você, devolvemos 100% do investimento. Sem perguntas.',
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

function PriceDisplay({ product }: { product: ProductData | null }) {
  if (!product || !product.price) {
    return (
      <div className="space-y-4">
        <p className="text-[#606060] text-sm">Vagas para a próxima turma em breve.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-[#25D366]/30 text-sm font-bold text-[#25D366] hover:bg-[#25D366]/8 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Entrar na lista de espera
          </a>
        </div>
      </div>
    )
  }

  const parcelamento = Math.ceil(product.price / 12)
  const pixPrice = Math.floor(product.price * 0.9)
  const checkoutUrl = product.checkout_url ?? '/loja'

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        {/* Pix */}
        <div className="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#505050]">Via Pix</p>
          {product.original_price && (
            <p className="text-sm text-[#404040] line-through">R$ {product.original_price.toLocaleString('pt-BR')}</p>
          )}
          <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl font-bold text-[#f0f0f0]">
            R$ {pixPrice.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-[#505050]">10% de desconto à vista</p>
          <a
            href={checkoutUrl}
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#c79a3b] text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
          >
            Pagar com Pix
          </a>
        </div>

        {/* Parcelado */}
        <div className="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#505050]">Parcelado</p>
          <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl font-bold text-[#f0f0f0]">
            12x de R$ {parcelamento.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs text-[#505050]">no cartão de crédito sem juros</p>
          <a
            href={checkoutUrl}
            className="mt-4 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#c79a3b]/30 text-sm font-bold text-[#c79a3b] hover:bg-[#c79a3b]/8 transition-colors"
          >
            Parcelar agora
          </a>
        </div>
      </div>
      <p className="text-xs text-[#404040] text-center">
        Garantia total de 7 dias. Se não fizer sentido, devolvemos tudo.
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────

export function PsicanaliseContent({ product }: { product: ProductData | null }) {
  const featuredDepo = depoimentos.find(d => d.featured) ?? depoimentos[0]
  const otherDepos = depoimentos.filter(d => !d.featured).slice(0, 3)

  return (
    <>
      {/* ── HERO ─────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-[#c79a3b]/3 blur-[180px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#0f2233]/60 blur-[120px]" />
        </div>

        <div className="relative w-full max-w-4xl mx-auto px-6 sm:px-10 py-24 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2"
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#505050]">Formação certificante</p>
            <h1
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.04] text-[#f0f0f0]"
            >
              Psicanálise não é<br />para quem quer<br />entender teorias.
            </h1>
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#c79a3b] italic leading-tight mt-3"
            >
              É para quem quer<br />entender a si mesmo.
            </h2>
          </motion.div>

          <motion.p
            className="text-lg text-[#606060] leading-relaxed max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Formação completa em Psicanálise Integrativa — do inconsciente à prática clínica. Teoria, análise pessoal e supervisão em um único percurso de formação.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            <a
              href={product?.checkout_url ?? '#investimento'}
              className="group inline-flex items-center gap-2.5 rounded-xl bg-[#c79a3b] px-8 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
              style={{ boxShadow: '0 8px 32px rgba(199,154,59,0.28)' }}
            >
              Garantir minha vaga
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-[#505050] hover:text-[#a0a0a0] transition-colors">
              → Tirar dúvidas pelo WhatsApp
            </a>
          </motion.div>

          <motion.p
            className="text-xs text-[#3a3a3a]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            1.200+ profissionais já se formaram pelo IDM.
          </motion.p>
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

      {/* ── CURRICULUM ───────────────────────────── */}
      <RevealSection>
        <section className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-10">
          <div className="space-y-2">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              O que você vai aprender.
            </h2>
            <p className="text-[#606060] text-sm max-w-lg">
              7 módulos. Teoria, prática clínica e supervisão — do começo à certificação.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-2">
            {modulos.map((m) => (
              <AccordionItem
                key={m.numero}
                value={m.numero}
                className="border border-[#1a1a1a] rounded-xl bg-[#0a0a0a] px-5 data-[state=open]:border-[#2a2a2a] transition-colors"
              >
                <AccordionTrigger className="hover:no-underline py-5 text-left group">
                  <div className="flex items-center gap-4">
                    <span
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                      className="text-3xl font-black text-[#c79a3b]/15 select-none shrink-0 w-10"
                    >
                      {m.numero}
                    </span>
                    <div>
                      <p className="font-semibold text-[#d0d0d0] text-sm group-hover:text-[#f0f0f0] transition-colors">{m.titulo}</p>
                      <p className="text-[11px] text-[#404040] mt-0.5">{m.carga}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-14">
                  <ul className="space-y-2">
                    {m.conteudo.map((c) => (
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

      {/* ── COMO FUNCIONA ─────────────────────────── */}
      <RevealSection>
        <section className="bg-[#0d0d0d] border-y border-white/5">
          <div className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-12">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Da inscrição à certificação.
            </h2>
            <div className="max-w-md relative pl-9 space-y-8 border-l border-white/8">
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

      {/* ── FUNDADOR (INSTRUTOR) ──────────────────── */}
      <RevealSection>
        <section className="max-w-4xl mx-auto px-6 sm:px-10 py-20">
          <div className="grid md:grid-cols-[220px_1fr] gap-10 lg:gap-16 items-start">
            <div className="flex flex-col items-center md:items-start">
              <div className="w-40 h-40 md:w-full md:aspect-square rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(199,154,59,0.2)' }}>
                <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-6xl font-black text-[#1e1e1e]">F</span>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl sm:text-3xl font-bold text-[#f0f0f0]">
                  Nome do Fundador
                </h2>
                <p className="text-sm text-[#c79a3b] mt-1">Fundador do IDM · Psicanalista Integrativo · Master PNL</p>
              </div>
              <p className="text-[#606060] leading-relaxed text-sm">
                Desenvolvi a Formação em Psicanálise Integrativa depois de perceber que os modelos existentes no mercado eram ou muito teóricos para a prática clínica real, ou superficiais demais para produzir transformação genuína.
              </p>
              <p className="text-[#606060] leading-relaxed text-sm">
                O IDM reúne psicanálise, neurociência e PNL em um método único porque o ser humano não funciona em compartimentos. A formação que você vai fazer é o mesmo percurso que eu percorri — e que mais de 1.200 profissionais já concluíram.
              </p>
              <blockquote
                className="border-l-2 border-[#c79a3b]/25 pl-5 py-1 italic text-[#909090] text-sm leading-relaxed"
                style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              >
                &ldquo;Um psicanalista que não se analisou não pode analisar. Um formador que não se formou não pode formar. Essa formação exige que você vá fundo — em você mesmo.&rdquo;
              </blockquote>
            </div>
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
              Quem já se formou.
            </h2>

            {/* Featured */}
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

            {/* 3 smaller */}
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
        <section id="investimento" className="max-w-4xl mx-auto px-6 sm:px-10 py-20 space-y-10">
          <div className="space-y-2">
            <h2
              style={{ fontFamily: "'Fraunces', Georgia, serif" }}
              className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]"
            >
              Investimento.
            </h2>
            <p className="text-[#606060] text-sm max-w-lg">
              Formação completa — teoria, análise pessoal, supervisão clínica e certificação. Parcelado ou à vista com desconto Pix.
            </p>
          </div>
          <PriceDisplay product={product} />
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
              Ainda tem dúvida?{' '}
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
              A formação começa<br />
              <span className="text-[#c79a3b] italic">quando você decide.</span>
            </h2>
            <p className="text-[#606060] max-w-sm mx-auto text-sm">
              Vagas limitadas por turma. Garantia total de 7 dias.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={product?.checkout_url ?? '#investimento'}
                className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#c79a3b] px-10 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
                style={{ boxShadow: '0 12px 40px rgba(199,154,59,0.3)' }}
              >
                Garantir minha vaga
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
              <a href={WA_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-[#505050] hover:text-[#a0a0a0] transition-colors">
                → WhatsApp
              </a>
            </div>
          </div>
        </section>
      </RevealSection>
    </>
  )
}
