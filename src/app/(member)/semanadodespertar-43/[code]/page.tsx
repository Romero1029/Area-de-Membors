import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SemanaDespertar43 } from '@/app/(member)/lancamento/SemanaDespertar43'
import { MetaPixelEvent } from '@/components/MetaPixelEvent'

export default async function SemanaDespertar43Page({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>
  searchParams: Promise<{ nome?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { code } = await params
  const sp = await searchParams

  if (code !== user.id) {
    const nomeParam = sp.nome ? `?nome=${encodeURIComponent(sp.nome)}` : ''
    redirect(`/semanadodespertar-43/${user.id}${nomeParam}`)
  }

  const firstName =
    (sp.nome ?? '').split(' ')[0] ||
    (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ||
    ''

  return (
    <>
      <MetaPixelEvent event="CompleteRegistration" />
      <SemanaDespertar43 firstName={firstName} />
    </>
  )
}
