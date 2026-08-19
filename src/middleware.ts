import { NextRequest, NextResponse } from 'next/server'

// Domínios próprios de parceiras que devem mostrar uma página específica
// do site, sem precisar mexer em rota nem redirecionar visivelmente a URL.
const DOMINIOS_PARCEIRAS: Record<string, string> = {
  'links.jocimaraanjos.com.br': '/jocimara-anjos',
}

export function middleware(req: NextRequest) {
  const hostname = (req.headers.get('host') || '').split(':')[0]
  const destino = DOMINIOS_PARCEIRAS[hostname]

  if (destino && req.nextUrl.pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = destino
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
