import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  DEMO_PRODUCTS, DEMO_PROGRESS,
} from '@/lib/demo-data'
import { getFeaturedProduct, getUpsellProducts } from '@/lib/actions/store'
import { HeroCarousel } from '@/components/ui/HeroCarousel'
import { CourseCarousel } from '@/components/ui/CourseCarousel'
import type { CourseProgress, Profile } from '@/types'

type EnrollmentItem = {
  id: string
  product_id: string
  products: {
    id: string; slug: string; title: string; description: string | null
    short_description: string | null; thumbnail_url: string | null
    product_type: string; badge_label: string | null
    price: number | null; original_price: number | null
    currency: string; payment_type: string; cta_label: string | null
    highlights: string[] | null; checkout_url: string | null
    is_featured: boolean; is_published: boolean; sort_order: number
    created_by: string | null; created_at: string; updated_at: string
  } | null
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

  let enrollments: EnrollmentItem[] = []
  let progressMap: Record<string, CourseProgress> = {}
  let profile: Profile | null = null

  if (isDemo) {
    profile = { id: user.id, full_name: 'Demo', avatar_url: null, bio: null, role: 'student', created_at: '', updated_at: '' }
    enrollments = DEMO_PRODUCTS.map(p => ({
      id: `enr-${p.id}`, product_id: p.id,
      products: { ...p, product_type: p.product_type as string },
    }))
    progressMap = Object.fromEntries(DEMO_PROGRESS.map(p => [p.product_id, p]))
  } else {
    const [profileRes, enrollmentsRes, progressRes] = await Promise.all([
      sb.from('profiles').select('*').eq('id', user.id).single(),
      sb.from('enrollments').select(`
        id, product_id,
        products (id, slug, title, description, short_description, thumbnail_url,
                 product_type, badge_label, price, original_price, currency,
                 payment_type, cta_label, highlights, checkout_url, is_featured,
                 is_published, sort_order, created_by, created_at, updated_at)
      `).eq('user_id', user.id).eq('is_active', true),
      sb.from('course_progress').select('*').eq('user_id', user.id),
    ])
    profile = profileRes.data
    enrollments = enrollmentsRes.data ?? []
    progressMap = Object.fromEntries(
      ((progressRes.data ?? []) as CourseProgress[]).map((p: CourseProgress) => [p.product_id, p])
    )
  }

  if (!profile) redirect('/login')

  // Classificar cursos por progresso
  const enrolled = enrollments.filter(e => e.products)
  const inProgress = enrolled.filter(e => {
    const p = progressMap[e.product_id]
    return p && p.percent_complete > 0 && p.percent_complete < 100
  })
  const notStarted = enrolled.filter(e => {
    const p = progressMap[e.product_id]
    return !p || p.percent_complete === 0
  })
  const completed = enrolled.filter(e => progressMap[e.product_id]?.percent_complete === 100)

  // Produtos para upsell (não matriculados, com preço)
  const enrolledIds = enrolled.map(e => e.product_id)
  const upsellProducts = isDemo ? [] : await getUpsellProducts(enrolledIds)
  const featuredProduct = isDemo ? null : await getFeaturedProduct()

  // Slides do hero: cursos em andamento + destaque do upsell
  const heroSlides = [
    ...inProgress.slice(0, 3).map(e => ({
      product: e.products!,
      enrolled: true,
      progress: progressMap[e.product_id],
    })),
    ...(featuredProduct && !enrolledIds.includes(featuredProduct.id) ? [{
      product: featuredProduct,
      enrolled: false,
    }] : []),
    // Se não tiver nada em andamento, mostrar os cursos não iniciados
    ...(inProgress.length === 0 ? notStarted.slice(0, 2).map(e => ({
      product: e.products!,
      enrolled: true,
      progress: progressMap[e.product_id],
    })) : []),
  ].slice(0, 4)

  return (
    <div className="min-h-screen bg-[#0f0f0f]">

      {/* Hero Carousel */}
      {heroSlides.length > 0 && (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        <HeroCarousel slides={heroSlides as any} />
      )}

      {/* Carrosséis de conteúdo */}
      <div className="space-y-10 py-8">

        {/* Continue assistindo */}
        {inProgress.length > 0 && (
          <CourseCarousel
            title="Continue assistindo"
            subtitle="Retome de onde parou"
            items={inProgress.map(e => ({
              product: e.products! as unknown as Parameters<typeof CourseCarousel>[0]['items'][0]['product'],
              progress: progressMap[e.product_id],
            }))}
            showAllHref="/cursos?filtro=em-andamento"
          />
        )}

        {/* Cursos não iniciados */}
        {notStarted.length > 0 && (
          <CourseCarousel
            title="Seus cursos"
            subtitle="Prontos para começar"
            items={notStarted.map(e => ({
              product: e.products! as unknown as Parameters<typeof CourseCarousel>[0]['items'][0]['product'],
              progress: progressMap[e.product_id],
            }))}
            showAllHref="/cursos"
          />
        )}

        {/* Upsell — expanda sua jornada */}
        {upsellProducts.length > 0 && (
          <CourseCarousel
            title="Expanda sua jornada"
            subtitle="Cursos e mentorias para o próximo nível"
            items={upsellProducts.map(p => ({ product: p }))}
            showAllHref="/loja"
          />
        )}

        {/* Concluídos */}
        {completed.length > 0 && (
          <CourseCarousel
            title="Concluídos"
            subtitle="Seus certificados conquistados"
            items={completed.map(e => ({
              product: e.products! as unknown as Parameters<typeof CourseCarousel>[0]['items'][0]['product'],
              progress: progressMap[e.product_id],
            }))}
            showAllHref="/certificados"
          />
        )}

        {/* Estado vazio */}
        {enrolled.length === 0 && (
          <div className="px-6 sm:px-10 lg:px-16 py-16 text-center space-y-4">
            <p className="text-[#a0a0a0] text-lg">Você ainda não tem cursos.</p>
            <a
              href="/loja"
              className="inline-flex items-center gap-2 rounded-xl bg-[#c79a3b] px-6 py-3 text-sm font-bold text-[#0f0f0f] hover:bg-[#e8b84b] transition-colors"
            >
              Explorar cursos
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
