import { redirect } from 'next/navigation'
import { ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getStoreProducts, getTestimonials } from '@/lib/actions/store'
import { ProductCard } from '@/components/marketing/ProductCard'
import { TestimonialCard } from '@/components/marketing/TestimonialCard'
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
    <div className="min-h-screen w-full bg-[#0f0f0f]">
      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 py-10 pb-20">
        <div className="flex flex-col gap-14">

          {/* ─── Hero ─── */}
          <AnimatedSection>
            <div className="relative w-full overflow-hidden rounded-2xl border border-[#2a2a2a] bg-gradient-to-br from-[#0f2233] via-[#1a2430] to-[#0f0f0f] px-8 py-14 text-center">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-56 w-56 rounded-full bg-[#c79a3b]/12 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-10 right-10 h-32 w-32 rounded-full bg-[#c79a3b]/6 blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-4">
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
            </div>
          </AnimatedSection>

          {/* ─── Prova Social ─── */}
          <AnimatedSection delay={0.1}>
            <div className="w-full rounded-2xl border border-[#c79a3b]/20 bg-[#c79a3b]/5 px-6 py-5">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                {[
                  { icon: '👥', value: '2.400+', label: 'alunos transformados' },
                  { icon: '⭐', value: '4.9',    label: 'avaliação média' },
                  { icon: '🏆', value: '94%',    label: 'taxa de conclusão' },
                  { icon: '💛', value: '100%',   label: 'satisfação garantida' },
                ].map(({ icon, value, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <span className="text-xl">{icon}</span>
                    <span className="text-2xl font-bold text-[#f0f0f0]">{value}</span>
                    <span className="text-xs text-[#606060]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* ─── Produtos ─── */}
          <AnimatedSection delay={0.15}>
            <div className="w-full space-y-7">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-[#f0f0f0]">Nossos produtos</h2>
                <p className="mt-1 text-sm text-[#606060]">Tudo que você precisa para avançar na sua jornada.</p>
              </div>

              {products.length > 0 ? (
                <div className="grid w-full gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
                  {products.map((product, i) => (
                    <AnimatedCard key={product.id} delay={0.06 * i}>
                      <ProductCard product={product} />
                    </AnimatedCard>
                  ))}
                </div>
              ) : (
                <div className="w-full rounded-2xl border border-dashed border-[#2a2a2a] bg-[#1a1a1a] p-14 text-center">
                  <p className="text-base font-semibold text-[#a0a0a0]">Novos produtos em breve.</p>
                </div>
              )}
            </div>
          </AnimatedSection>

          {/* ─── Depoimentos ─── */}
          {testimonials.length > 0 && (
            <AnimatedSection delay={0.1}>
              <div className="w-full space-y-7">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-[#f0f0f0]">Quem já transformou sua vida</h2>
                  <p className="mt-1 text-sm text-[#606060]">Resultados reais de pessoas reais.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {testimonials.map((t, i) => (
                    <AnimatedCard key={t.id} delay={0.05 * i}>
                      <TestimonialCard testimonial={t} />
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}

          {/* ─── CTA Final ─── */}
          <AnimatedSection delay={0.1}>
            <div className="w-full relative overflow-hidden rounded-2xl border border-[#c79a3b]/20 bg-gradient-to-br from-[#c79a3b]/10 via-[#1a1a1a] to-[#0f0f0f] p-10 sm:p-14 text-center">
              <div className="relative z-10 space-y-4">
                <h2 className="text-2xl font-bold text-[#f0f0f0] sm:text-3xl">
                  Pronto para dar o próximo passo?
                </h2>
                <p className="mx-auto max-w-md text-sm text-[#a0a0a0]">
                  Cada produto foi criado com intenção, cuidado e metodologia comprovada. O momento é agora.
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-[#606060] pt-1">
                  <ShieldCheck className="h-4 w-4 text-[#c79a3b]" />
                  Garantia de 7 dias ou seu dinheiro de volta
                </div>
              </div>
            </div>
          </AnimatedSection>

        </div>
      </div>
    </div>
  )
}
