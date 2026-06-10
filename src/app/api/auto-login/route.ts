import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createHmac } from 'crypto'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const email = Buffer.from(searchParams.get('e') ?? '', 'base64url').toString()
  const ts = parseInt(searchParams.get('t') ?? '0', 10)
  const sig = searchParams.get('s') ?? ''
  const nome = Buffer.from(searchParams.get('n') ?? '', 'base64url').toString()

  const secret = process.env.CRIAR_USUARIO_API_KEY
  const loginFallback = new URL('/login', request.url)

  if (!secret || !email) return NextResponse.redirect(loginFallback)

  // Token válido por 10 minutos
  const now = Math.floor(Date.now() / 1000)
  if (now - ts > 600) return NextResponse.redirect(loginFallback)

  const expected = createHmac('sha256', secret).update(`${email}:${ts}`).digest('hex')
  if (sig !== expected) return NextResponse.redirect(loginFallback)

  // Prepara o redirect antes de chamar signIn (para poder setar cookies na response)
  const nomeParam = nome ? `?nome=${encodeURIComponent(nome)}` : ''
  const response = NextResponse.redirect(new URL(`/semana38${nomeParam}`, request.url))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: 'idm2026',
  })

  if (error) return NextResponse.redirect(loginFallback)

  return response
}
