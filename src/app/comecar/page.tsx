import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, Brain, Heart, Sparkles, Star, ShieldCheck } from 'lucide-react'
import { getTestimonials } from '@/lib/actions/store'
import { TestimonialCard } from '@/components/marketing/TestimonialCard'

export const metadata = {
  title: 'Instituto Despertamente — Sua transformação começa aqui',
  description:
    'Cursos, mentorias e eventos para quem busca autoconhecimento, propósito e evolução real. Crie sua conta gratuita e comece agora.',
  openGraph: {
    title: 'Instituto Despertamente — Sua transformação começa aqui',
    description: 'Cursos, mentorias e eventos para quem busca autoconhecimento e evolução real.',
    type: 'website',
  },
}

const profiles = [
  {
    icon: Brain,
    pain: 'Você sente que vive no automático, sem propósito claro?',
    promise: 'Aqui você aprende a se reconectar com o que realmente importa.',
  },
  {
    icon: Heart,
    pain: 'Você tenta mudar, mas os mesmos padrões continuam se repetindo?',
    promise: 'Nossa metodologia vai direto à raiz — não à sintoma.',
  },
  {
    icon: Sparkles,
    pain: 'Você consome muito conteúdo mas não vê transformação real?',
    promise: 'Chega de teoria. Aqui o foco é resultado que você sente no dia a dia.',
  },
]

const steps = [
  {
    number: '01',
    title: 'Crie sua conta gratuita',
    description: 'Em menos de 2 minutos, sem cartão de crédito.',
  },
  {
    number: '02',
    title: 'Acesse o material de boas-vindas',
    description: 'Uma aula introdutória para você sentir a transformação de perto.',
  },
  {
    number: '03',
    title: 'Escolha seu caminho',
    description: 'Cursos, mentorias ou eventos. O próximo nível está aqui.',
  },
]

export default async function ComecarPage() {
  const testimonials = await getTestimonials()
  const featured = testimonials.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#fffaf3]">

      {/* Header mínimo */}
      <header className="sticky top-0 z-50 border-b border-[#1a2430]/08 bg-[#fffaf3]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2">
            <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={28} height={28} className="object-contain invert" />
            <span className="font-fraunces text-base font-bold text-[#1a2430]">Instituto Despertamente</span>
          </div>
          <Link
            href="/login"
            className="rounded-lg px-4 py-1.5 text-sm font-semibold text-[#1a2430] hover:bg-[#1a2430]/05 transition-colors"
          >
            Entrar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 pb-20 space-y-20">

        {/* [A] ATENÇÃO — Hero */}
        <section className="pt-16 pb-4 text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c79a3b]/30 bg-[#c79a3b]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#c79a3b]">
            ✦ Instituto Despertamente
          </div>

          <h1 className="font-fraunces text-4xl font-bold text-[#1a2430] leading-tight sm:text-5xl">
            Você não precisa de mais
            <br />
            uma informação.
            <br />
            <span className="text-[#c79a3b]">Você precisa de uma mudança real.</span>
          </h1>

          <p className="mx-auto max-w-xl text-lg text-[#5f6b78] leading-relaxed">
            Cursos, mentorias e eventos criados para quem quer resultados que duram —
            não mais conteúdo para esquecer na semana que vem.
          </p>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#1a2430] px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-[#0f2233] hover:-translate-y-0.5 transition-all duration-200"
            >
              Quero começar agora
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#1a2430]/20 px-6 py-4 text-base font-semibold text-[#1a2430] hover:border-[#1a2430]/40 transition-colors"
            >
              Acessar área de membros
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-[#5f6b78]">
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c79a3b]" /> Sem cartão de crédito</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c79a3b]" /> Acesso imediato</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c79a3b]" /> Cancele quando quiser</span>
          </div>

          {/* Contador de alunos */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <div className="flex -space-x-2">
              {['#c79a3b', '#0f2233', '#177c6b'].map((color, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#fffaf3] flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: color }}
                >
                  {['A', 'M', 'R'][i]}
                </div>
              ))}
            </div>
            <p className="text-sm text-[#5f6b78]">
              <strong className="text-[#1a2430]">+2.400 alunos</strong> já começaram a jornada
            </p>
          </div>
        </section>

        {/* [I] INTERESSE — Para quem é */}
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="font-fraunces text-2xl font-bold text-[#1a2430] sm:text-3xl">
              Isso foi feito para você?
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {profiles.map(({ icon: Icon, pain, promise }, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#1a2430]/08 bg-white p-6 space-y-3 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c79a3b]/10">
                  <Icon className="h-5 w-5 text-[#c79a3b]" />
                </div>
                <p className="text-sm font-semibold text-[#1a2430] leading-snug">{pain}</p>
                <p className="text-sm text-[#5f6b78] leading-relaxed">{promise}</p>
              </div>
            ))}
          </div>
        </section>

        {/* [I] INTERESSE — Como funciona */}
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="font-fraunces text-2xl font-bold text-[#1a2430] sm:text-3xl">
              Como funciona
            </h2>
            <p className="mt-2 text-[#5f6b78]">Simples. Direto. Sem complicação.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map(({ number, title, description }) => (
              <div key={number} className="flex flex-col gap-3">
                <span className="font-fraunces text-4xl font-black text-[#c79a3b]/30">{number}</span>
                <h3 className="text-base font-bold text-[#1a2430]">{title}</h3>
                <p className="text-sm text-[#5f6b78] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* [D] DESEJO — Depoimentos */}
        {featured.length > 0 && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="font-fraunces text-2xl font-bold text-[#1a2430] sm:text-3xl">
                O que dizem nossos alunos
              </h2>
              <div className="mt-2 flex items-center justify-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#c79a3b] text-[#c79a3b]" />
                ))}
                <span className="ml-1 text-sm text-[#5f6b78]">4.9 de média</span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {featured.map((t) => (
                <div key={t.id} className="rounded-2xl border border-[#1a2430]/08 bg-white p-5 space-y-4 shadow-sm">
                  {t.rating && (
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating! ? 'fill-[#c79a3b] text-[#c79a3b]' : 'text-[#1a2430]/10'}`} />
                      ))}
                    </div>
                  )}
                  <p className="text-sm italic text-[#5f6b78] leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-2 border-t border-[#1a2430]/08 pt-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c79a3b]/10 text-sm font-bold text-[#c79a3b]">
                      {t.author_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#1a2430]">{t.author_name}</p>
                      {t.author_role && <p className="text-xs text-[#5f6b78]">{t.author_role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* [A] AÇÃO — CTA Final */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2233] via-[#1a2430] to-[#0f2233] px-8 py-14 text-center">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-60 w-60 rounded-full bg-[#c79a3b]/10 blur-3xl" />
          <div className="relative space-y-5">
            <h2 className="font-fraunces text-3xl font-bold text-white sm:text-4xl">
              Pronto para começar?
            </h2>
            <p className="mx-auto max-w-md text-white/60">
              Crie sua conta gratuita agora e dê o primeiro passo rumo a uma versão mais consciente de você.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#c79a3b] px-10 py-4 text-base font-bold text-[#1a2430] shadow-lg hover:bg-[#e8b84b] hover:-translate-y-0.5 transition-all duration-200"
            >
              Criar minha conta gratuita
              <ArrowRight className="h-5 w-5" />
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-1 text-xs text-white/40">
              <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-[#c79a3b]" /> Garantia de 7 dias</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c79a3b]" /> Sem cartão de crédito</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c79a3b]" /> Acesso imediato</span>
            </div>
          </div>
        </section>

      </main>

      {/* Footer mínimo */}
      <footer className="border-t border-[#1a2430]/08 py-6 text-center text-xs text-[#5f6b78]">
        © {new Date().getFullYear()} Instituto Despertamente. Todos os direitos reservados.
      </footer>

    </div>
  )
}
