import { NextRequest, NextResponse } from "next/server";
import { getSistema11Client } from "@/lib/sistema11";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    if (!slug) return NextResponse.json({ error: "slug é obrigatório." }, { status: 400 });

    const supabase = getSistema11Client();
    const { data: evento, error } = await supabase
      .from("npa_eventos")
      .select("nome, local, data_evento, professor_convidado")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("npa-presencial evento:", error);
      return NextResponse.json({ error: "Erro ao buscar evento." }, { status: 500 });
    }
    if (!evento) return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });

    return NextResponse.json(evento);
  } catch (e) {
    console.error("npa-presencial evento: erro inesperado", e);
    return NextResponse.json({ error: "Erro inesperado ao buscar evento." }, { status: 500 });
  }
}
