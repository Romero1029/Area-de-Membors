import { redirect } from 'next/navigation'
import { ShieldCheck, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStoreProducts, getTestimonials } from '@/lib/actions/store'
import { ProductCard } from '@/components/marketing/ProductCard'
import { TestimonialCard } from '@/components/marketing/TestimonialCard'
import { SocialProofStrip } from '@/components/marketing/SocialProofStrip'
import { AnimatedSection, AnimatedCard } from '@/components/marketing/AnimatedSection'

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
    <div className="min-h-screen bg-[#0f0f0f]">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10 py-10 space-y-14 pb-20">

        {/* Hero */}
        <AnimatedSection delay={0}>
          <section className="relative overflow-hidden rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#0f2233] via-[#1a2430] to-[#0f0f0f] px-8 py-14 text-center">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-[#c79a3b]/12 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-[#c79a3b]/6 blur-2xl pointer-events-none" />
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
        </AnimatedSection>

        {/* Prova Social */}
        <AnimatedSection delay={0.1}>
          <SocialProofStrip />
        </AnimatedSection>

        {/* Produtos */}
        {products.length > 0 ? (
          <AnimatedSection delay={0.15}>
            <section className="space-y-7">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-[#f0f0f0]">Nossos produtos</h2>
                <p className="text-sm text-[#606060]">Tudo que você precisa para avançar na sua jornada.</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <AnimatedCard key={product.id} delay={0.05 * i}>
                    <ProductCard product={product} />
                  </AnimatedCard>
                ))}
              </div>
            </section>
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <section className="rounded-2xl border border-dashed border-[#2a2a2a] bg-[#1a1a1a] p-14 text-center">
              <Zap className="mx-auto h-10 w-10 text-[#c79a3b]/30" />
              <p className="mt-3 text-base font-semibold text-[#a0a0a0]">Novos produtos em breve.</p>
              <p className="text-sm text-[#606060] mt-1">Estamos preparando algo especial para você.</p>
            </section>
          </AnimatedSection>
        )}

        {/* Depoimentos */}
        {testimonials.length > 0 && (
          <AnimatedSection delay={0.1}>
            <section className="space-y-7">
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold text-[#f0f0f0]">Quem já transformou sua vida</h2>
                <p className="text-sm text-[#606060]">Resultados reais de pessoas reais.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t, i) => (
                  <AnimatedCard key={t.id} delay={0.05 * i}>
                    <TestimonialCard testimonial={t} />
                  </AnimatedCard>
                ))}
              </div>
            </section>
          </AnimatedSection>
        )}

        {/* CTA Final */}
        <AnimatedSection delay={0.1}>
          <section className="relative overflow-hidden rounded-2xl border border-[#c79a3b]/20 bg-gradient-to-br from-[#c79a3b]/10 via-[#1a1a1a] to-[#0f0f0f] p-10 sm:p-14 text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-[#c79a3b]/5 to-transparent pointer-events-none" />
            <div className="relative space-y-4">
              <h2 className="text-2xl font-bold text-[#f0f0f0] sm:text-3xl">
                Pronto para dar o próximo passo?
              </h2>
              <p className="mx-auto max-w-md text-sm text-[#a0a0a0]">
                Cada produto foi criado com intenção, cuidado e metodologia comprovada.
                O momento é agora.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-[#606060] pt-1">
                <ShieldCheck className="h-4 w-4 text-[#c79a3b]" />
                Garantia de 7 dias ou seu dinheiro de volta
              </div>
            </div>
          </section>
        </AnimatedSection>

      </div>
    </div>
  )
}
