import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import type { Profile } from '@/types'

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from('profiles') as any)
    .select('*').eq('id', user.id).single()

  if (!profile) redirect('/login')
  // Admin vai para /admin (exceto se acessar cursos/perfil diretamente)
  if (profile.role === 'admin') {
    // Admin pode acessar cursos e perfil
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#f6f0e7' }}>
      <Sidebar profile={profile as Profile} />
      <div className="flex flex-col flex-1 min-w-0">
        <TopBar profile={profile as Profile} />
        <main className="flex-1 p-5 md:p-7 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}
