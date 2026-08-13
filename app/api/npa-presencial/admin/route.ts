import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSistema11Client } from "@/lib/sistema11";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const supabase = getSistema11Client();
    const { data, error } = await supabase
      .from("npa_eventos")
      .select(
        "id, nome, local, data_evento, ativo, slug, ebook_url, telas_url, telas_liberado, telas_liberado_em"
      )
      .order("data_evento", { ascending: false, nullsFirst: false });

    if (error) {
      console.error("npa-presencial admin GET:", error);
      return NextResponse.json({ error: "Erro ao listar eventos." }, { status: 500 });
    }

    return NextResponse.json({ eventos: data ?? [] });
  } catch (e) {
    console.error("npa-presencial admin GET: erro inesperado", e);
    return NextResponse.json({ error: "Erro inesperado ao listar eventos." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
  const body = await req.json().catch(() => null);
  const eventoId = typeof body?.eventoId === "string" ? body.eventoId : "";
  if (!eventoId) return NextResponse.json({ error: "eventoId é obrigatório." }, { status: 400 });

  const supabase = getSistema11Client();
  const updates: Record<string, unknown> = {};

  if (typeof body.slug === "string") updates.slug = body.slug.trim() || null;
  if (typeof body.ebook_url === "string") updates.ebook_url = body.ebook_url.trim() || null;
  if (typeof body.telas_url === "string") updates.telas_url = body.telas_url.trim() || null;

  if (typeof body.telas_liberado === "boolean") {
    if (body.telas_liberado) {
      const { data: atual, error: atualError } = await supabase
        .from("npa_eventos")
        .select("telas_url")
        .eq("id", eventoId)
        .maybeSingle();

      if (atualError) {
        return NextResponse.json({ error: "Erro ao verificar evento." }, { status: 500 });
      }

      const telasUrl = (updates.telas_url as string | undefined) ?? atual?.telas_url;
      if (!telasUrl) {
        return NextResponse.json(
          { error: "Preencha o link das telas antes de liberar." },
          { status: 400 }
        );
      }
      updates.telas_liberado = true;
      updates.telas_liberado_em = new Date().toISOString();
    } else {
      updates.telas_liberado = false;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("npa_eventos")
    .update(updates)
    .eq("id", eventoId)
    .select("id, nome, slug, ebook_url, telas_url, telas_liberado, telas_liberado_em")
    .single();

  if (error) {
    console.error("npa-presencial admin PATCH:", error);
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json(
        { error: "Esse link (slug) já está em uso por outro evento." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Erro ao salvar." }, { status: 500 });
  }

  return NextResponse.json({ evento: data });
  } catch (e) {
    console.error("npa-presencial admin PATCH: erro inesperado", e);
    return NextResponse.json({ error: "Erro inesperado ao salvar." }, { status: 500 });
  }
}
