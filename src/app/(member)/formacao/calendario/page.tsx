import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLives } from '@/lib/actions/lives'
import { FORMACAO_PRODUCT_ID } from '@/lib/constants'
import { getFormacaoDeadlines, isEnrolledInFormacao } from '@/lib/formacao-queries'
import { CalendarioClient } from './CalendarioClient'

export const metadata = { title: 'Calendário — Formação em Psicanálise' }

export default async function FormacaoCalendarioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  const enrolled = isAdmin || (await isEnrolledInFormacao())
  if (!enrolled) redirect('/formacao')

  const [lives, deadlines] = await Promise.all([
    getLives(FORMACAO_PRODUCT_ID),
    getFormacaoDeadlines(),
  ])

  return <CalendarioClient lives={lives} deadlines={deadlines} />
}
