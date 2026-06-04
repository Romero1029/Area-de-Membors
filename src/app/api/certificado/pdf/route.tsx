import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { CertificadoPDF } from '@/lib/pdf/certificado'
import { getLiveDates } from '@/lib/pdf/get-live-dates'
import fs from 'fs'
import path from 'path'

function getCertBgPath(): string | undefined {
  const filePath = path.join(process.cwd(), 'public', 'CERTIFICADO_NPA_SP_-_.png')
  return fs.existsSync(filePath) ? filePath : undefined
}

// GET /api/certificado/pdf?nome=João&code=IDM-2026-XXXXX
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const nome = searchParams.get('nome')?.trim()
  const code = searchParams.get('code')?.trim()

  if (!nome) {
    return NextResponse.json({ error: 'Nome obrigatório.' }, { status: 400 })
  }

  let pdfBuffer: Buffer
  try {
    const { diasLive, mesLive, anoLive } = await getLiveDates()
    pdfBuffer = await renderToBuffer(
      <CertificadoPDF
        nome={nome}
        code={code ?? undefined}
        bgUrl={getCertBgPath()}
        diasLive={diasLive}
        mesLive={mesLive}
        anoLive={anoLive}
      />
    )
  } catch (e: unknown) {
    console.error('[pdf] generation error:', (e as Error).message)
    return NextResponse.json({ error: 'Erro ao gerar PDF.' }, { status: 500 })
  }

  const filename = `certificado-${nome.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.pdf`

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
