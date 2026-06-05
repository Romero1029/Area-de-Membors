import { DEMO_PROFILE } from '@/lib/demo-data'
import { ProfileForm } from '@/components/shared/ProfileForm'

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default async function PerfilPage() {
  let profile = DEMO_PROFILE
  let userEmail = 'admin@idmtools.com'

  if (!DEMO_MODE) {
    const { redirect } = await import('next/navigation')
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('profiles') as any).select('*').eq('id', user!.id).single()
    if (!data) redirect('/login')
    profile = data
    userEmail = user!.email ?? ''
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>Meu Perfil</h1>
        <p className="text-sm mt-1 text-white/50">Gerencie suas informações pessoais.</p>
      </div>
      <ProfileForm profile={profile} userEmail={userEmail} />
    </div>
  )
}
