import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { TopNavbar } from '@/components/layout/TopNavbar'
import { MobileTabBar } from '@/components/layout/MobileTabBar'
import type { Profile } from '@/types'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from('profiles') as any)
    .select('*').eq('id', user.id).single()

  if (!profile) redirect('/login')

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <TopNavbar profile={profile as Profile} />
      <main className="pb-20 md:pb-8">
        {children}
      </main>
      <MobileTabBar />
    </div>
  )
}
