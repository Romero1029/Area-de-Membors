import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Star, Sparkles, Brain, Heart, Zap, Shield, PlayCircle, Quote } from 'lucide-react'
import { getTestimonials } from '@/lib/actions/store'
import { ComecarAnimated } from './ComecarAnimated'

export const metadata = {
  title: 'Instituto Despertamente — Transformação Real',
  description: 'Não é mais um curso. É o método que vai mudar como você se vê, se relaciona e age no mundo.',
  openGraph: {
    title: 'Instituto Despertamente — Transformação Real',
    description: 'Não é mais um curso. É o método que vai mudar como você se vê.',
    images: [{ url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80' }],
  },
}

const dores = [
  {
    icon: Brain,
    dor: 'Você sabe o que precisa mudar, mas não consegue.',
    transformacao: 'Com o método IDM, você para de lutar contra si mesmo.',
  },
  {
    icon: Heart,
    dor: 'Seus relacionamentos se repetem nos mesmos padrões.',
    transformacao: 'Você identifica a raiz e muda o padrão de uma vez por todas.',
  },
  {
    icon: Zap,
    dor: 'Você consome conteúdo mas não vê transformação real.',
    transformacao: 'Aqui é prática. Você sente a mudança antes de terminar o primeiro módulo.',
  },
]

const numeros = [
  { valor: '2.400+', label: 'alunos transformados' },
  { valor: '94%',    label: 'completam o curso' },
  { valor: '4.9★',   label: 'avaliação média' },
  { valor: '8 anos', label: 'de metodologia' },
]

const passos = [
  { num: '01', titulo: 'Crie sua conta gratuita', desc: 'Menos de 2 minutos. Sem cartão de crédito.' },
  { num: '02', titulo: 'Assista a aula de boas-vindas', desc: 'Uma aula que muda sua perspectiva imediatamente.' },
  { num: '03', titulo: 'Escolha sua jornada', desc: 'Cursos, mentorias ou eventos presenciais.' },
]

const depoimentosFallback = [
  { nome: 'Ana Beatriz S.', papel: 'Aluna — Psicanálise Prática', texto: 'Eu tentei terapia por anos. O método IDM foi o único que me fez entender POR QUÊ eu agia do jeito que agia. Em 3 semanas mudei mais do que em 3 anos.', estrelas: 5 },
  { nome: 'Marcos Vinicius', papel: 'Aluno — NPA 2.0', texto: 'Nunca imaginei que padrões dos meus avós ainda me afetavam. Depois do NPA, sinto que finalmente sou eu mesmo.', estrelas: 5 },
  { nome: 'Fernanda Lima', papel: 'Aluna — Practitioner PNL', texto: 'A certificação foi incrível, mas o que ficou foi a transformação pessoal. Recomendo sem hesitar.', estrelas: 5 },
]

export default async function ComecarPage() {
  const testimonials = await getTestimonials()
  const depos = testimonials.length > 0
    ? testimonials.slice(0, 3).map(t => ({ nome: t.author_name, papel: t.author_role ?? '', texto: t.content, estrelas: t.rating ?? 5 }))
    : depoimentosFallback

  return (
    <div
      className="min-h-screen bg-[#080808] text-[#f0f0f0] overflow-x-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >

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

      {/* Passa todos os dados para o componente animado client-side */}
      <ComecarAnimated
        dores={dores}
        numeros={numeros}
        passos={passos}
        depos={depos}
      />

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 text-center">
        <p className="text-xs text-[#404040]">
          © {new Date().getFullYear()} Instituto Despertamente · Todos os direitos reservados
        </p>
      </footer>
    </div>
  )
}
