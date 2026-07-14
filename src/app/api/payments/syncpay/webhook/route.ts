import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// ─────────────────────────────────────────────────────────────────────────────
// Recebe os webhooks do SyncPay (cashin.create / cashin.update) e atualiza o
// status do pedido em `pedidos_syncpay`. Todos os webhooks do SyncPay têm
// timeout de 5 segundos — este handler responde rápido e não faz chamadas
// extras à API deles.
// ─────────────────────────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, string> = {
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
  refunded: 'refunded',
  med: 'med',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const data = body?.data
    if (!data?.id || !data?.status) {
      return NextResponse.json({ ok: true })
    }

    const status = STATUS_MAP[data.status] ?? 'pending'
    const admin = createAdminClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin.from('pedidos_syncpay') as any)
      .update({ status })
      .eq('syncpay_identifier', data.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[syncpay/webhook] erro:', err)
    // Sempre responde 200 pro SyncPay não ficar re-tentando por erro nosso.
    return NextResponse.json({ ok: false })
  }
}
