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
    <div className="min-h-screen bg-[#0f0f0f] px-4 sm:px-6 lg:px-10 py-8 space-y-12 pb-16">

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2233] via-[#1a2430] to-[#0f0f0f] px-8 py-14 text-center border border-[#2a2a2a]">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[#c79a3b]/10 blur-3xl pointer-events-none" />
        <div className="relative space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#c79a3b]/30 bg-[#c79a3b]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#c79a3b]">
            ✦ Instituto Despertamente
          </span>
          <h1 className="font-display text-3xl font-bold text-[#f0f0f0] sm:text-4xl leading-tight">
            Sua transformação começa aqui.
            <br />
            <span className="text-[#c79a3b]">Escolha o seu próximo passo.</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-[#a0a0a0] leading-relaxed">
            Cursos, mentorias e eventos desenvolvidos para expandir sua consciência e acelerar sua evolução pessoal.
          </p>
        </div>
      </section>

      {/* Prova Social */}
      <SocialProofStrip />

      {/* Produtos */}
      {products.length > 0 ? (
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#f0f0f0]">Nossos produtos</h2>
            <p className="mt-1 text-sm text-[#606060]">Tudo que você precisa para avançar na sua jornada.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#1a1a1a] p-14 text-center">
          <Zap className="mx-auto h-10 w-10 text-[#c79a3b]/30" />
          <p className="mt-3 text-base font-semibold text-[#a0a0a0]">Novos produtos em breve.</p>
          <p className="text-sm text-[#606060] mt-1">Estamos preparando algo especial para você.</p>
        </section>
      )}

      {/* Depoimentos */}
      {testimonials.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#f0f0f0]">Quem já transformou sua vida</h2>
            <p className="mt-1 text-sm text-[#606060]">Resultados reais de pessoas reais.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#c79a3b]/15 via-[#1a1a1a] to-[#0f0f0f] border border-[#c79a3b]/20 p-8 sm:p-12 text-center">
        <div className="relative space-y-4">
          <h2 className="text-2xl font-bold text-[#f0f0f0] sm:text-3xl">
            Pronto para dar o próximo passo?
          </h2>
          <p className="mx-auto max-w-md text-sm text-[#a0a0a0]">
            Cada produto foi criado com intenção, cuidado e metodologia comprovada.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-[#606060]">
            <ShieldCheck className="h-4 w-4 text-[#c79a3b]" />
            Garantia de 7 dias ou seu dinheiro de volta
          </div>
        </div>
      </section>

    </div>
  )
}
