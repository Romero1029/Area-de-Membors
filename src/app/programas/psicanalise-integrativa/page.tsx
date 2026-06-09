import { createClient } from '@/lib/supabase/server'
import { NavbarComecar } from '@/app/comecar/NavbarComecar'
import { WhatsAppButton } from '@/app/comecar/WhatsAppButton'
import { StickyCTA } from '@/app/comecar/StickyCTA'
import { CookieBanner } from '@/app/comecar/CookieBanner'
import { PsicanaliseContent, type ProductData } from './PsicanaliseContent'
import Link from 'next/link'
import Image from 'next/image'

const PRODUCT_SLUG = 'psicanalise-integrativa'

export const metadata = {
  title: 'Formação em Psicanálise Integrativa — Instituto Despertamente',
  description: 'Formação completa em Psicanálise Integrativa: teoria, análise pessoal e supervisão clínica. Certificação reconhecida pela ICF e ABNLP.',
  openGraph: {
    title: 'Formação em Psicanálise Integrativa — IDM',
    description: 'Do inconsciente à prática clínica. Formação com certificação internacional.',
  },
}

export default async function PsicanaliseIntegrativaPage() {
  const sb = await createClient()
  const { data } = await sb
    .from('products')
    .select('price, original_price, highlights, cta_label, checkout_url, badge_label')
    .eq('slug', PRODUCT_SLUG)
    .eq('is_published', true)
    .maybeSingle()

  const product: ProductData | null = data
    ? {
        price: data.price as number | null,
        original_price: data.original_price as number | null,
        highlights: data.highlights as string[] | null,
        cta_label: data.cta_label as string | null,
        checkout_url: data.checkout_url as string | null,
      }
    : null

  return (
    <div className="min-h-screen bg-[#080808] text-[#f0f0f0] overflow-x-hidden">
      <NavbarComecar />
      <WhatsAppButton />
      <StickyCTA />
      <CookieBanner />

      <PsicanaliseContent product={product} />

      <footer className="border-t border-white/5 bg-[#050505]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/comecar" className="flex items-center gap-2.5">
            <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={22} height={22} className="object-contain opacity-60" />
            <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-sm font-bold text-[#404040]">
              Instituto <span className="text-[#505050]">Despertamente</span>
            </span>
          </Link>
          <div className="flex gap-5 text-xs text-[#383838]">
            <Link href="/privacidade" className="hover:text-[#606060] transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-[#606060] transition-colors">Termos</Link>
            <Link href="/comecar" className="hover:text-[#606060] transition-colors">Início</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
