import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import { isEnrolledInFormacao } from '@/lib/formacao-queries'
import type { Profile } from '@/types'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from('profiles') as any)
    .select('*').eq('id', user.id).single()

  if (!profile) redirect('/login')

  const isAdmin = profile.role === 'admin'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: npaEnrollment } = await (supabase.from('enrollments') as any)
    .select('id, products!inner(slug)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('products.slug', 'mentoria-npa')
    .maybeSingle()

  const hasNpaAccess = isAdmin || Boolean(npaEnrollment)
  const formacaoEnrolled = isAdmin || (await isEnrolledInFormacao())

  return (
    <div className="min-h-screen bg-[#0D1638]">
      <TopNavbar profile={profile as Profile} hasNpaAccess={hasNpaAccess} formacaoEnrolled={formacaoEnrolled} />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
      <MobileTabBar hasNpaAccess={hasNpaAccess} />
    </div>
  )
}
