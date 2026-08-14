import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getMyPublishedFormacaoGrades, isEnrolledInFormacao } from '@/lib/formacao-queries'
import { NotasClient } from './NotasClient'

export const metadata = { title: 'Minhas Notas — Formação em Psicanálise' }

export default async function FormacaoNotasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  const enrolled = isAdmin || (await isEnrolledInFormacao())
  if (!enrolled) redirect('/formacao')

  const grades = await getMyPublishedFormacaoGrades()
  return <NotasClient grades={grades} />
}
