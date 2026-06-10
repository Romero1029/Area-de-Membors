import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createHmac } from 'crypto'

function buildLoginUrl(email: string, nome: string, secret: string): string {
  const ts = Math.floor(Date.now() / 1000)
  const sig = createHmac('sha256', secret).update(`${email}:${ts}`).digest('hex')
  const e = Buffer.from(email).toString('base64url')
  const n = Buffer.from(nome).toString('base64url')
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  return `${siteUrl}/api/auto-login?e=${e}&t=${ts}&s=${sig}&n=${n}`
}

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
  const nomeResolved = nome ?? email.split('@')[0]

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: 'idm2026',
    email_confirm: true,
    user_metadata: {
      full_name: nomeResolved,
      whatsapp: whatsapp ?? '',
    },
  })

  if (error) {
    if (error.message.includes('already been registered') || error.message.includes('already exists')) {
      const loginUrl = buildLoginUrl(email, nomeResolved, expectedKey)
      return NextResponse.json({ success: true, message: 'Usuário já existe', loginUrl }, { status: 200 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const loginUrl = buildLoginUrl(email, nomeResolved, expectedKey)
  return NextResponse.json({ success: true, userId: data.user?.id, loginUrl }, { status: 201 })
}
