import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import type { CourseProgress } from '@/types'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: enrollmentsRaw } = await supabase
    .from('enrollments')
    .select('*, products (id, slug, title, description, thumbnail_url, product_type)')
    .eq('user_id', user.id)
    .eq('is_active', true)

  const enrollments = (enrollmentsRaw ?? []) as Array<{
    id: string; product_id: string;
    products: { id: string; slug: string; title: string; description: string | null; thumbnail_url: string | null; product_type: string } | null
  }>

  const { data: progressRaw } = await supabase
    .from('course_progress')
    .select('*')
    .eq('user_id', user.id)

  const progressMap: Record<string, CourseProgress> = Object.fromEntries(
    ((progressRaw ?? []) as CourseProgress[]).map((p) => [p.product_id, p])
  )

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Meus Cursos</h1>
        <p className="text-sm mt-1" style={{ color: '#888888' }}>
          {enrollments.length} curso{enrollments.length !== 1 ? 's' : ''} disponível{enrollments.length !== 1 ? 'is' : ''}
        </p>
      </div>

      {!enrollments.length ? (
        <div
          className="rounded-xl p-16 text-center space-y-3"
          style={{ background: '#111111', border: '1px dashed #222222' }}
        >
          <BookOpen className="w-12 h-12 mx-auto" style={{ color: '#333333' }} />
          <p className="font-medium text-white">Nenhum curso disponível</p>
          <p className="text-sm" style={{ color: '#555555' }}>Entre em contato para obter acesso.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enrollments.map((e) => {
            const product = e.products
            if (!product) return null
            const progress = progressMap[product.id]
            const percent = progress?.percent_complete ?? 0

            return (
              <Link
                key={e.id}
                href={`/cursos/${product.slug}`}
                className="group rounded-xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: '#111111', border: '1px solid #1a1a1a' }}
              >
                <div className="relative aspect-video overflow-hidden" style={{ background: '#1a1a1a' }}>
                  {product.thumbnail_url ? (
                    <img src={product.thumbnail_url} alt={product.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10" style={{ color: '#333333' }} />
                    </div>
                  )}
                  {percent === 100 && (
                    <div className="absolute top-2 right-2">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(34,197,94,0.9)', color: '#fff' }}>
                        <CheckCircle className="w-3 h-3" />
                        Concluído
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="font-semibold text-white leading-snug">{product.title}</p>
                    {product.description && (
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: '#666666' }}>{product.description}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: '#555555' }}>{progress?.completed_lessons ?? 0}/{progress?.total_lessons ?? 0} aulas</span>
                      <span className="font-semibold" style={{ color: percent === 100 ? '#22c55e' : '#FFA902' }}>{percent}%</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#222222' }}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${percent}%`, background: percent === 100 ? '#22c55e' : '#FFA902' }} />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
