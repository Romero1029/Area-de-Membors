import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SemanaDespertar38 } from '@/app/(member)/lancamento/SemanaDespertar38'

export default async function Semana38Page({
  searchParams,
}: {
  searchParams: { nome?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const firstName =
    (searchParams.nome ?? '').split(' ')[0] ||
    (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ||
    ''

  return <SemanaDespertar38 firstName={firstName} />
}
