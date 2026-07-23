import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const FRANQUIA_HOSTS = ['idmpsifranquia.com.br', 'idmpsifranquia.com', 'www.idmpsifranquia.com.br', 'www.idmpsifranquia.com']

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host')?.replace(/:\d+$/, '') || ''

  if (FRANQUIA_HOSTS.includes(host)) {
    const { pathname } = request.nextUrl

    // Serve static assets from /franquia-assets/
    if (pathname.startsWith('/franquia-assets/')) {
      return NextResponse.next()
    }

    // Rewrite root and /franquia to franquia.html
    if (pathname === '/' || pathname === '/franquia') {
      const url = request.nextUrl.clone()
      url.pathname = '/franquia.html'
      return NextResponse.rewrite(url)
    }

    // Any other path on franquia domain → redirect to root
    if (!pathname.startsWith('/_next') && !pathname.startsWith('/favicon')) {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }

  // For the main domain, run Supabase session middleware
  return updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image).*)',
  ],
}
