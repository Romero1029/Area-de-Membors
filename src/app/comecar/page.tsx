import Link from 'next/link'
import Image from 'next/image'
import { getTestimonials } from '@/lib/actions/store'
import { createClient } from '@/lib/supabase/server'
import { ComecarAnimated, type Programa } from './ComecarAnimated'
import { NavbarComecar } from './NavbarComecar'
import { WhatsAppButton } from './WhatsAppButton'
import { StickyCTA } from './StickyCTA'
import { CookieBanner } from './CookieBanner'

export const metadata = {
  title: 'Instituto Despertamente — Transformação Real',
  description: 'Não é mais um curso. É o método que vai mudar como você se vê, se relaciona e age no mundo. Baseado em neurociência, psicanálise e PNL.',
  openGraph: {
    title: 'Instituto Despertamente — Transformação Real',
    description: 'Não é mais um curso. É o método que vai mudar como você se vê.',
    images: [{ url: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200&q=80' }],
  },
}

const depoimentosFallback = [
  { nome: 'Ana Beatriz S.', papel: 'Aluna — Psicanálise Prática', texto: 'Eu tentei terapia por anos. O método IDM foi o único que me fez entender POR QUÊ eu agia do jeito que agia. Em 3 semanas mudei mais do que em 3 anos.', estrelas: 5 },
  { nome: 'Marcos Vinicius', papel: 'Aluno — NPA 2.0', texto: 'Nunca imaginei que padrões dos meus avós ainda me afetavam. Depois do NPA, sinto que finalmente sou eu mesmo.', estrelas: 5 },
  { nome: 'Fernanda Lima', papel: 'Aluna — Practitioner PNL', texto: 'A certificação foi incrível, mas o que ficou foi a transformação pessoal. Recomendo sem hesitar.', estrelas: 5 },
  { nome: 'Ricardo Almeida', papel: 'Aluno — Practitioner PNL', texto: 'O conteúdo é denso mas aplicável imediatamente. Já usei em reuniões de trabalho e na minha vida pessoal. Mudança real.', estrelas: 5 },
  { nome: 'Juliana C.', papel: 'Aluna — Psicanálise Prática', texto: 'Finalmente entendi por que sabotava minhas relações. O método é diferente de tudo que já fiz. Recomendo a todos.', estrelas: 5 },
  { nome: 'Paulo R.', papel: 'Aluno — NPA 2.0', texto: 'Comprei com ceticismo e saí transformado. Os padrões que identifiquei explicaram 20 anos de comportamento. Incrível.', estrelas: 5 },
]

export default async function ComecarPage() {
  const sb = await createClient()
  const [testimonials, { data: productsRaw }] = await Promise.all([
    getTestimonials(),
    sb.from('products').select('id, title, slug, short_description, thumbnail_url').eq('is_published', true).order('sort_order'),
  ])

  const depos = testimonials.length > 0
    ? testimonials.slice(0, 6).map(t => ({
        nome: t.author_name,
        papel: t.author_role ?? '',
        texto: t.content,
        estrelas: t.rating ?? 5,
      }))
    : depoimentosFallback

  const programas: Programa[] = (productsRaw ?? []).map(p => ({
    id: p.id as string,
    title: p.title as string,
    slug: p.slug as string,
    short_description: p.short_description as string | null,
    thumbnail_url: p.thumbnail_url as string | null,
  }))

  return (
    <div className="min-h-screen bg-[#0D1638] text-white overflow-x-hidden">

      {/* Navbar */}
      <NavbarComecar />

      {/* Floating WhatsApp button (desktop) */}
      <WhatsAppButton />

      {/* Sticky CTA bar (mobile) */}
      <StickyCTA />

      {/* Cookie banner (LGPD) */}
      <CookieBanner />

      {/* All animated sections */}
      <ComecarAnimated depos={depos} programas={programas} />

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 bg-[#09122C]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14">

          {/* 4-column grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* Col 1 — Brand */}
            <div className="space-y-4 lg:col-span-1">
              <div className="flex items-center gap-2.5">
                <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={26} height={26} className="object-contain opacity-90" />
                <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-sm font-bold text-[#f0f0f0]">
                  Instituto <span className="text-[#FFB800]">Despertamente</span>
                </span>
              </div>
              <p className="text-xs text-[#505050] leading-relaxed max-w-[200px]">
                Transformação humana baseada em neurociência, psicanálise e PNL.
              </p>
              {/* Social icons */}
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/institutodespertamente"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="h-8 w-8 rounded-lg border border-[#1e1e1e] flex items-center justify-center text-[#505050] hover:text-[#f0f0f0] hover:border-[#2a2a2a] transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="h-8 w-8 rounded-lg border border-[#1e1e1e] flex items-center justify-center text-[#505050] hover:text-[#25D366] hover:border-[#25D366]/30 transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Col 2 — Plataforma */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/25">Plataforma</p>
              <ul className="space-y-2.5">
                {[
                  { href: '/login', label: 'Login' },
                  { href: '/register', label: 'Criar conta gratuita' },
                  { href: '/cursos', label: 'Meus cursos' },
                  { href: '/loja', label: 'Programas' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className="text-xs text-white/35 hover:text-white/70 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 3 — Conteúdo */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/25">Conteúdo</p>
              <ul className="space-y-2.5">
                {[
                  { href: '#metodologia', label: 'Nossa metodologia' },
                  { href: '#jornadas',    label: 'Jornadas' },
                  { href: '#certificacao', label: 'Certificações' },
                  { href: '#depoimentos', label: 'Depoimentos' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a href={href} className="text-xs text-white/35 hover:text-white/70 transition-colors">
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4 — Legal */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-widest text-white/25">Legal</p>
              <ul className="space-y-2.5">
                {[
                  { href: '/privacidade', label: 'Política de Privacidade' },
                  { href: '/termos',      label: 'Termos de Uso' },
                  { href: '#faq',         label: 'FAQ' },
                  { href: 'https://wa.me/5511999999999', label: 'Contato' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="text-xs text-white/35 hover:text-white/70 transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/20">
              © {new Date().getFullYear()} Instituto Despertamente · Todos os direitos reservados
            </p>
            <p className="text-[11px] text-white/20">
              Feito no Brasil 🇧🇷 · LGPD compliant
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
