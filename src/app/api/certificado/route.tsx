import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createAdminClient } from '@/lib/supabase/admin'
import { CertificadoPDF } from '@/lib/pdf/certificado'
import fs from 'fs'
import path from 'path'

function getCertBgPath(): string | undefined {
  const filePath = path.join(process.cwd(), 'public', 'CERTIFICADO_NPA_SP_-_.png')
  return fs.existsSync(filePath) ? filePath : undefined
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalize(s: string) {
  return s.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function sanitize(s: string, max = 200) {
  return s.trim().replace(/[<>"']/g, '').substring(0, max)
}

function getIp(req: NextRequest) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

// ─── POST /api/certificado ────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const ip = getIp(request)

  // 1. Parse body
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Requisição inválida.' }, { status: 400 })
  }

  const { nome, telefone, email, palavra1, palavra2, palavra3 } = body

  // 2. Validar campos obrigatórios
  if (!nome?.trim() || !telefone?.trim() || !email?.trim() || !palavra1?.trim() || !palavra2?.trim() || !palavra3?.trim()) {
    return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 })
  }

  // 3. Validar formato de e-mail
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })
  }

  // 4. Normalizar dados sensíveis
  const emailNorm = email.trim().toLowerCase()
  const telefoneNorm = telefone.replace(/\D/g, '').substring(0, 20)

  let supabase
  try {
    supabase = createAdminClient()
  } catch (e: unknown) {
    console.error('[certificado] Admin client error:', (e as Error).message)
    return NextResponse.json({ error: 'Erro de configuração do servidor.' }, { status: 500 })
  }

  // 5. Rate limiting: máximo 3 requisições por IP por hora
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: ipCount } = await (supabase.from('tentativas_certificado') as any)
    .select('*', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('data_tentativa', oneHourAgo)

  if ((ipCount ?? 0) >= 3) {
    return NextResponse.json(
      { error: 'Limite de tentativas atingido para este endereço. Tente novamente em uma hora.' },
      { status: 429 }
    )
  }

  // 6. Verificar se e-mail já tentou antes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: emailCount } = await (supabase.from('tentativas_certificado') as any)
    .select('*', { count: 'exact', head: true })
    .eq('email', emailNorm)

  if ((emailCount ?? 0) > 0) {
    return NextResponse.json(
      { error: 'Este e-mail já foi utilizado em uma tentativa anterior.\nNão é possível tentar novamente.' },
      { status: 403 }
    )
  }

  // 7. Verificar se telefone já tentou antes
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count: phoneCount } = await (supabase.from('tentativas_certificado') as any)
    .select('*', { count: 'exact', head: true })
    .eq('telefone', telefoneNorm)

  if ((phoneCount ?? 0) > 0) {
    return NextResponse.json(
      { error: 'Este telefone já foi utilizado em uma tentativa anterior.\nNão é possível tentar novamente.' },
      { status: 403 }
    )
  }

  // 8. Validar palavras-chave (somente no backend, nunca logadas)
  const p1 = normalize(palavra1)
  const p2 = normalize(palavra2)
  const p3 = normalize(palavra3)

  const k1 = normalize(process.env.CERT_PALAVRA_1 ?? '')
  const k2 = normalize(process.env.CERT_PALAVRA_2 ?? '')
  const k3 = normalize(process.env.CERT_PALAVRA_3 ?? '')

  if (!k1 || !k2 || !k3) {
    console.error('[certificado] Palavras-chave não configuradas no ambiente.')
    return NextResponse.json({ error: 'Serviço temporariamente indisponível.' }, { status: 503 })
  }

  const acertou = p1 === k1 && p2 === k2 && p3 === k3

  // 9. Registrar tentativa no banco (sanitizado)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('tentativas_certificado') as any).insert({
    nome:     sanitize(nome),
    telefone: telefoneNorm,
    email:    emailNorm,
    ip,
    acertou,
  })

  // 10. Se errou → retornar erro (tentativa já registrada, não pode mais tentar)
  if (!acertou) {
    return NextResponse.json(
      { error: 'Infelizmente você não acertou as palavras-chave da aula.\nVocê não possui mais tentativas disponíveis.' },
      { status: 400 }
    )
  }

  // 11. Gerar PDF — JSX em .tsx resolve o erro de tipo do renderToBuffer
  const nomeFormatado = sanitize(nome, 100)
  let pdfBuffer: Buffer

  try {
    pdfBuffer = await renderToBuffer(
      <CertificadoPDF nome={nomeFormatado} bgUrl={getCertBgPath()} />
    )
  } catch (e: unknown) {
    console.error('[certificado] PDF generation error:', (e as Error).message)
    return NextResponse.json({ error: 'Erro ao gerar o certificado. Tente novamente.' }, { status: 500 })
  }

  // 12. Retornar PDF para download
  const filename = `certificado-${nomeFormatado.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.pdf`

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
