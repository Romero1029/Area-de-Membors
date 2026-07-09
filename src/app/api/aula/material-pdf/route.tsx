import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { MaterialNarcisismoPDF } from '@/lib/pdf/material-narcisismo'
import fs from 'fs'
import path from 'path'

function getLogoDataUri(): string | undefined {
  const filePath = path.join(process.cwd(), 'public', 'despertamente-simbolo-branco.png')
  if (!fs.existsSync(filePath)) return undefined
  try {
    return `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`
  } catch {
    return undefined
  }
}

// GET /api/aula/material-pdf
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })

  let pdfBuffer: Buffer
  try {
    pdfBuffer = await renderToBuffer(<MaterialNarcisismoPDF logoUrl={getLogoDataUri()} />)
  } catch (e: unknown) {
    console.error('[aula/material-pdf] generation error:', (e as Error).message)
    return NextResponse.json({ error: 'Erro ao gerar PDF.' }, { status: 500 })
  }

  const { searchParams } = new URL(request.url)
  const forceDownload = searchParams.get('download') === '1'
  const disposition = forceDownload
    ? 'attachment; filename="narcisismo-na-otica-da-psicanalise.pdf"'
    : 'inline; filename="narcisismo-na-otica-da-psicanalise.pdf"'

  return new NextResponse(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': disposition,
      'Cache-Control': 'no-store',
    },
  })
}
