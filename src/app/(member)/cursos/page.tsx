import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DEMO_PRODUCTS, DEMO_PROGRESS } from '@/lib/demo-data'
import { CourseCardNetflix } from '@/components/ui/CourseCardNetflix'
import { FilterTabs } from './FilterTabs'
import type { CourseProgress } from '@/types'

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ filtro?: string; busca?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const filtro = params.filtro ?? 'todos'
  const busca  = params.busca ?? ''

  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  type EnrProduct = { id: string; slug: string; title: string; description: string | null; short_description: string | null; thumbnail_url: string | null; product_type: string; badge_label: string | null; is_featured: boolean; is_published: boolean; sort_order: number; price: number | null; original_price: number | null; currency: string; payment_type: string; cta_label: string | null; highlights: string[] | null; checkout_url: string | null; created_by: string | null; created_at: string; updated_at: string }
  type EnrItem = { id: string; product_id: string; products: EnrProduct | null }

  let enrollments: EnrItem[] = []
  let progressMap: Record<string, CourseProgress> = {}

  if (isDemo) {
    enrollments = DEMO_PRODUCTS.map(p => ({ id: `enr-${p.id}`, product_id: p.id, products: { ...p, product_type: p.product_type as string } }))
    progressMap = Object.fromEntries(DEMO_PROGRESS.map(p => [p.product_id, p]))
  } else {
    const [enrRes, progRes] = await Promise.all([
      sb.from('enrollments')
        .select('id, product_id, products (id, slug, title, description, short_description, thumbnail_url, product_type, badge_label, is_featured, is_published, sort_order, price, original_price, currency, payment_type, cta_label, highlights, checkout_url, created_by, created_at, updated_at)')
        .eq('user_id', user.id).eq('is_active', true),
      sb.from('course_progress').select('*').eq('user_id', user.id),
    ])
    enrollments = enrRes.data ?? []
    progressMap = Object.fromEntries(((progRes.data ?? []) as CourseProgress[]).map((p: CourseProgress) => [p.product_id, p]))
  }

  // Filtrar
  const filtered = enrollments.filter(e => {
    if (!e.products) return false
    if (busca && !e.products.title.toLowerCase().includes(busca.toLowerCase())) return false
    const pct = progressMap[e.product_id]?.percent_complete ?? 0
    if (filtro === 'em-andamento')  return pct > 0 && pct < 100
    if (filtro === 'concluidos')    return pct === 100
    if (filtro === 'nao-iniciados') return pct === 0
    return true
  })

  const valid = enrollments.filter(e => !!e.products)
  const counts = {
    todos:          valid.length,
    'em-andamento': valid.filter(e => { const p = progressMap[e.product_id]?.percent_complete ?? 0; return p > 0 && p < 100 }).length,
    concluidos:     valid.filter(e => (progressMap[e.product_id]?.percent_complete ?? 0) === 100).length,
    'nao-iniciados': valid.filter(e => (progressMap[e.product_id]?.percent_complete ?? 0) === 0).length,
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-4 sm:px-6 lg:px-10 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#f0f0f0]">Meus Cursos</h1>
        <p className="text-sm text-[#606060]">
          {counts.todos} curso{counts.todos !== 1 ? 's' : ''} disponível{counts.todos !== 1 ? 'is' : ''}
        </p>
      </div>

      <FilterTabs filtro={filtro} counts={counts} busca={busca} />

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#2a2a2a] p-16 text-center">
          <p className="text-[#a0a0a0]">
            {busca
              ? `Nenhum curso encontrado para "${busca}"`
              : filtro === 'em-andamento'   ? 'Comece qualquer curso para ver aqui.'
              : filtro === 'concluidos'     ? 'Complete um curso para ganhar seu certificado.'
              : 'Nenhum curso disponível.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((e, i) => {
            if (!e.products) return null
            return (
              <CourseCardNetflix
                key={e.id}
                product={e.products as unknown as Parameters<typeof CourseCardNetflix>[0]['product']}
                progress={progressMap[e.product_id]}
                href={`/cursos/${e.products.slug}`}
                priority={i < 8}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
