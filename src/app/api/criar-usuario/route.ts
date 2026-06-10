import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expectedKey = process.env.CRIAR_USUARIO_API_KEY

  if (!expectedKey || authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { email, nome, whatsapp } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'email obrigatório' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'idm2026',
    email_confirm: true,
    user_metadata: {
      full_name: nome ?? email.split('@')[0],
      whatsapp: whatsapp ?? '',
    },
  })

  if (error) {
    // Se o usuário já existe, retorna 200 para não bloquear o fluxo de lead
    if (error.message.includes('already been registered') || error.message.includes('already exists')) {
      return NextResponse.json({ success: true, message: 'Usuário já existe' }, { status: 200 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, userId: data.user?.id }, { status: 201 })
}
