import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const FRANQUIA_HOSTS = ['idmpsifranquia.com.br', 'idmpsifranquia.com', 'www.idmpsifranquia.com.br', 'www.idmpsifranquia.com']

export async function proxy(request: NextRequest) {
  const host = request.headers.get('host')?.replace(/:\d+$/, '') || ''

  if (FRANQUIA_HOSTS.includes(host)) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/franquia-assets/') || pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
      return NextResponse.next()
    }

    if (pathname !== '/franquia') {
      const url = request.nextUrl.clone()
      url.pathname = '/franquia'
      return NextResponse.rewrite(url)
    }

    return NextResponse.next()
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
