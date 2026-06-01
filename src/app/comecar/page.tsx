import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, Sparkles, Brain, Heart, Zap, Shield, PlayCircle, Quote } from 'lucide-react'
import { getTestimonials } from '@/lib/actions/store'

export const metadata = {
  title: 'Instituto Despertamente — Transformação Real',
  description: 'Não é mais um curso. É o método que vai mudar como você se vê, se relaciona e age no mundo. Crie sua conta gratuita.',
  openGraph: {
    title: 'Instituto Despertamente — Transformação Real',
    description: 'Não é mais um curso. É o método que vai mudar como você se vê.',
    images: [{ url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80' }],
  },
}

const dores = [
  { icon: Brain, dor: 'Você sabe o que precisa mudar, mas não consegue.', transformacao: 'Com o método IDM, você para de lutar contra si mesmo.' },
  { icon: Heart, dor: 'Seus relacionamentos se repetem nos mesmos padrões.', transformacao: 'Você identifica a raiz e muda o padrão de uma vez por todas.' },
  { icon: Zap, dor: 'Você consome conteúdo mas não vê transformação real.', transformacao: 'Aqui é prática. Você sente a mudança antes de terminar o primeiro módulo.' },
]

const numeros = [
  { valor: '2.400+', label: 'alunos transformados' },
  { valor: '94%',    label: 'completam o curso' },
  { valor: '4.9★',   label: 'avaliação média' },
  { valor: '8 anos', label: 'de metodologia' },
]

const passos = [
  { num: '01', titulo: 'Crie sua conta gratuita', desc: 'Menos de 2 minutos. Sem cartão.' },
  { num: '02', titulo: 'Acesse o conteúdo de boas-vindas', desc: 'Uma aula que muda sua perspectiva imediatamente.' },
  { num: '03', titulo: 'Escolha sua jornada', desc: 'Cursos, mentorias ou eventos presenciais.' },
]

const depoimentos = [
  { nome: 'Ana Beatriz S.', papel: 'Aluna — Psicanálise Prática', texto: 'Eu tentei terapia por anos. O método IDM foi o único que me fez entender POR QUÊ eu agia do jeito que agia. Em 3 semanas mudei mais do que em 3 anos.', estrelas: 5 },
  { nome: 'Marcos Vinicius', papel: 'Aluno — NPA 2.0', texto: 'Nunca imaginei que padrões dos meus avós ainda me afetavam. Depois do NPA, sinto que finalmente sou eu mesmo.', estrelas: 5 },
  { nome: 'Fernanda Lima', papel: 'Aluna — Practitioner PNL', texto: 'A certificação foi incrível, mas o que ficou foi a transformação pessoal. Recomendo sem hesitar.', estrelas: 5 },
]

export default async function ComecarPage() {
  const testimonials = await getTestimonials()
  const depos = testimonials.length > 0
    ? testimonials.slice(0, 3).map(t => ({
        nome: t.author_name, papel: t.author_role ?? '', texto: t.content, estrelas: t.rating ?? 5
      }))
    : depoimentos

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0]" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 sm:px-10 h-16 border-b border-white/5 bg-[#080808]/90 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={28} height={28} className="object-contain" />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-base font-bold text-[#f0f0f0]">
            Instituto <span className="text-[#c79a3b]">Despertamente</span>
          </span>
        </div>
        <Link href="/login" className="text-sm font-medium text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors">
          Já tenho conta
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background atmosférico */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-[#c79a3b]/6 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[#0f2233]/80 blur-[80px]" />
          {/* Grade decorativa */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(rgba(199,154,59,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(199,154,59,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />
        </div>

        <div className="relative w-full max-w-5xl mx-auto px-6 sm:px-10 py-20 grid lg:grid-cols-2 gap-12 items-center">

          {/* Copy */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c79a3b]/25 bg-[#c79a3b]/8 px-4 py-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#c79a3b]" />
              <span className="text-xs font-semibold uppercase tracking-widest text-[#c79a3b]">Há 8 anos transformando vidas</span>
            </div>

            <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-[#f0f0f0]">
              Não é mais<br />
              um curso.<br />
              <span className="text-[#c79a3b] italic">É uma mudança.</span>
            </h1>

            <p className="text-lg text-[#a0a0a0] leading-relaxed max-w-md">
              O método do Instituto Despertamente já ajudou mais de 2.400 pessoas a finalmente se entenderem — e mudarem de verdade.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register"
                className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#c79a3b] px-7 py-4 text-base font-bold text-[#080808] hover:bg-[#e8b84b] transition-all duration-200 hover:-translate-y-0.5"
                style={{ boxShadow: '0 8px 32px rgba(199,154,59,0.3)' }}
              >
                Começar agora — é grátis
                <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/login"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-7 py-4 text-base font-semibold text-[#f0f0f0] hover:border-white/20 hover:bg-white/5 transition-all duration-200"
              >
                <PlayCircle className="h-4 w-4 text-[#c79a3b]" />
                Acessar minha conta
              </Link>
            </div>

            <div className="flex flex-wrap gap-5 pt-2">
              {['Sem cartão de crédito', 'Acesso imediato', 'Cancele quando quiser'].map(g => (
                <span key={g} className="flex items-center gap-1.5 text-sm text-[#606060]">
                  <Check className="h-3.5 w-3.5 text-[#c79a3b]" /> {g}
                </span>
              ))}
            </div>
          </div>

          {/* Card visual direita */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/8" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
              <Image
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=85"
                alt="Transformação"
                width={560}
                height={400}
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-[#080808]/20 to-transparent" />

              {/* Floating card — prova social */}
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/10 bg-[#080808]/80 backdrop-blur-xl p-4 flex items-center gap-3">
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
              </div>
            </div>

            {/* Decoração */}
            <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full border border-[#c79a3b]/20 opacity-40" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full border border-[#c79a3b]/10 opacity-30" />
          </div>
        </div>
      </section>

      {/* ── NÚMEROS ── */}
      <section className="border-y border-white/5 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {numeros.map(({ valor, label }) => (
            <div key={label} className="text-center space-y-1">
              <p style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl font-bold text-[#c79a3b]">{valor}</p>
              <p className="text-sm text-[#606060]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARA QUEM É ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Para quem é isso</p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]">
            Você se reconhece aqui?
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {dores.map(({ icon: Icon, dor, transformacao }, i) => (
            <div key={i} className="group relative rounded-2xl border border-white/6 bg-[#0d0d0d] p-6 space-y-4 hover:border-[#c79a3b]/30 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 0 0 0 rgba(199,154,59,0)', transition: 'all 0.3s' }}>
              <div className="h-10 w-10 rounded-xl bg-[#c79a3b]/10 flex items-center justify-center group-hover:bg-[#c79a3b]/20 transition-colors">
                <Icon className="h-5 w-5 text-[#c79a3b]" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#606060] italic leading-relaxed">&ldquo;{dor}&rdquo;</p>
                <div className="w-8 h-px bg-[#c79a3b]/40" />
                <p className="text-sm text-[#f0f0f0] leading-relaxed">{transformacao}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="bg-[#0d0d0d] border-y border-white/5">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">O caminho</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]">
              Simples. Direto. Sem enrolação.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Linha conectora */}
            <div className="hidden sm:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gradient-to-r from-transparent via-[#c79a3b]/30 to-transparent" />

            {passos.map(({ num, titulo, desc }) => (
              <div key={num} className="relative flex flex-col items-center text-center gap-4">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 z-10">
                  <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-2xl font-black text-[#c79a3b]">{num}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-[#f0f0f0]">{titulo}</h3>
                  <p className="text-sm text-[#606060]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEPOIMENTOS ── */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20 space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Histórias reais</p>
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]">
            O que dizem quem já mudou
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-5">
          {depos.map((d, i) => (
            <div key={i} className="relative rounded-2xl border border-white/6 bg-[#0d0d0d] p-6 space-y-4 flex flex-col">
              <Quote className="h-6 w-6 text-[#c79a3b]/40 flex-shrink-0" />
              <p className="text-sm text-[#a0a0a0] leading-relaxed flex-1 italic">{d.texto}</p>
              <div className="pt-3 border-t border-white/6 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c79a3b] to-[#e8b84b] flex items-center justify-center text-sm font-bold text-[#080808] flex-shrink-0">
                  {d.nome.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#f0f0f0]">{d.nome}</p>
                  {d.papel && <p className="text-xs text-[#606060]">{d.papel}</p>}
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array(d.estrelas).fill(0).map((_, j) => <Star key={j} className="h-3 w-3 fill-[#c79a3b] text-[#c79a3b]" />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#c79a3b]/8 blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 sm:px-10 py-24 text-center space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Seu momento é agora</p>
            <h2 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-4xl sm:text-5xl font-bold text-[#f0f0f0] leading-tight">
              Pronto para a mudança<br />que você já sabe<br />
              <span className="text-[#c79a3b] italic">que precisa fazer?</span>
            </h2>
            <p className="text-[#a0a0a0] max-w-md mx-auto">
              Sua conta é grátis. Seu próximo passo é agora. Mais de 2.400 pessoas já tomaram essa decisão.
            </p>
          </div>

          <Link href="/register"
            className="group inline-flex items-center gap-3 rounded-2xl bg-[#c79a3b] px-10 py-5 text-lg font-bold text-[#080808] hover:bg-[#e8b84b] transition-all duration-200 hover:-translate-y-0.5"
            style={{ boxShadow: '0 16px 48px rgba(199,154,59,0.35)' }}
          >
            Criar minha conta gratuita
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1.5" />
          </Link>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#606060]">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4 text-[#c79a3b]" /> Garantia de 7 dias</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#c79a3b]" /> Sem cartão</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-[#c79a3b]" /> Acesso imediato</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-[#404040]">
          © {new Date().getFullYear()} Instituto Despertamente · Todos os direitos reservados
        </p>
      </footer>

    </div>
  )
}
