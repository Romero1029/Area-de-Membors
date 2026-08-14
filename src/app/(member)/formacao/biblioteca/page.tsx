import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getFormacaoLibrary, isEnrolledInFormacao } from '@/lib/formacao-queries'
import { BibliotecaClient } from './BibliotecaClient'

export const metadata = { title: 'Biblioteca — Formação em Psicanálise' }

export default async function FormacaoBibliotecaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any).from('profiles').select('role').eq('id', user.id).single()
  const isAdmin = profile?.role === 'admin'

  const enrolled = isAdmin || (await isEnrolledInFormacao())
  if (!enrolled) redirect('/formacao')

  const files = await getFormacaoLibrary()
  return <BibliotecaClient files={files} />
}
