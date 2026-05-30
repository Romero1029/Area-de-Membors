'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error, data } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: 'E-mail ou senha inválidos.' }

  // Redireciona por role
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase.from('profiles') as any)
    .select('role').eq('id', data.user.id).single()

  redirect(profile?.role === 'admin' ? '/admin' : '/dashboard')
}

export async function signUp(formData: FormData) {
  const supabase = await createClient()
  const email    = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
    },
  })

  if (error) return { error: error.message }
  return { success: 'Verifique seu e-mail para confirmar o cadastro.' }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function sendPasswordReset(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
  })

  if (error) return { error: error.message }
  return { success: 'E-mail de redefinição enviado. Verifique sua caixa de entrada.' }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  redirect('/dashboard')
}
