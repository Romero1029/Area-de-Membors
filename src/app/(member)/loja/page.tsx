import { redirect } from 'next/navigation'
import { ShieldCheck, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStoreProducts, getTestimonials } from '@/lib/actions/store'
import { ProductCard } from '@/components/marketing/ProductCard'
import { TestimonialCard } from '@/components/marketing/TestimonialCard'
import { SocialProofStrip } from '@/components/marketing/SocialProofStrip'

export const metadata = {
  title: 'Loja — Instituto Despertamente',
}

export default async function LojaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [products, testimonials] = await Promise.all([
    getStoreProducts(),
    getTestimonials(),
  ])

  return (
    <div className="space-y-12 max-w-5xl pb-16">

      {/* [A] ATENÇÃO — Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f2233] via-[#1a2430] to-[#0f2233] px-8 py-12 text-center">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#c79a3b]/10 blur-3xl" />
        <div className="relative space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c79a3b]/30 bg-[#c79a3b]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#c79a3b]">
            ✦ Instituto Despertamente
          </span>
          <h1 className="font-fraunces text-3xl font-bold text-white sm:text-4xl leading-tight">
            Sua transformação começa aqui.
            <br />
            <span className="text-[#c79a3b]">Escolha o seu próximo passo.</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-white/60 leading-relaxed">
            Cursos, mentorias e eventos desenvolvidos para expandir sua consciência e acelerar sua evolução pessoal.
          </p>
        </div>
      </section>

      {/* [I] INTERESSE — Prova Social */}
      <SocialProofStrip />

      {/* [I] INTERESSE — Produtos */}
      {products.length > 0 ? (
        <section className="space-y-5">
          <div>
            <h2 className="font-fraunces text-2xl font-bold text-[#1a2430]">Nossos produtos</h2>
            <p className="mt-1 text-sm text-[#5f6b78]">Tudo que você precisa para avançar na sua jornada.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#c79a3b]/30 bg-[#c79a3b]/5 p-10 text-center">
          <Zap className="mx-auto h-10 w-10 text-[#c79a3b]/40" />
          <p className="mt-3 text-base font-semibold text-white/60">Novos produtos em breve.</p>
          <p className="text-sm text-white/40">Estamos preparando algo especial para você.</p>
        </section>
      )}

      {/* [D] DESEJO — Depoimentos */}
      {testimonials.length > 0 && (
        <section className="space-y-5">
          <div className="text-center">
            <h2 className="font-fraunces text-2xl font-bold text-[#1a2430]">
              Quem já transformou sua vida
            </h2>
            <p className="mt-1 text-sm text-[#5f6b78]">
              Resultados reais de pessoas reais.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      {/* [A] AÇÃO — CTA Final */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#c79a3b]/20 via-[#1a2430] to-[#0f2233] border border-[#c79a3b]/20 p-8 sm:p-12 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#c79a3b]/5 to-transparent" />
        <div className="relative space-y-4">
          <h2 className="font-fraunces text-2xl font-bold text-white sm:text-3xl">
            Pronto para dar o próximo passo?
          </h2>
          <p className="mx-auto max-w-md text-sm text-white/60">
            Cada produto acima foi criado com intenção, cuidado e metodologia comprovada.
            O momento é agora.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-white/50">
              <ShieldCheck className="h-4 w-4 text-[#c79a3b]" />
              Garantia de 7 dias ou seu dinheiro de volta
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
