import { NextRequest, NextResponse } from "next/server";
import { getSistema11Client } from "@/lib/sistema11";
import { normalizeEmail, normalizePhone } from "@/lib/npaPresencial";

export async function POST(req: NextRequest) {
  try {
  const body = await req.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
  const nome = typeof body?.nome === "string" ? body.nome.trim() : "";
  const emailRaw = typeof body?.email === "string" ? body.email.trim() : "";
  const whatsappRaw = typeof body?.whatsapp === "string" ? body.whatsapp.trim() : "";

  if (!slug || !nome || (!emailRaw && !whatsappRaw)) {
    return NextResponse.json(
      { error: "Preencha nome e e-mail ou WhatsApp." },
      { status: 400 }
    );
  }

  const email = emailRaw ? normalizeEmail(emailRaw) : "";
  const whatsapp = whatsappRaw ? normalizePhone(whatsappRaw) : "";

  const supabase = getSistema11Client();

  const { data: evento, error: eventoError } = await supabase
    .from("npa_eventos")
    .select("id, ebook_url, telas_url, telas_liberado")
    .eq("slug", slug)
    .maybeSingle();

  if (eventoError) {
    console.error("npa-presencial claim: erro buscando evento", eventoError);
    return NextResponse.json({ error: "Erro ao buscar evento." }, { status: 500 });
  }
  if (!evento) {
    return NextResponse.json({ error: "Evento não encontrado." }, { status: 404 });
  }

  const { data: leadsDoEvento, error: leadsError } = await supabase
    .from("npa_evento_leads")
    .select("id, email, whatsapp")
    .eq("npa_evento_id", evento.id);

  if (leadsError) {
    console.error("npa-presencial claim: erro buscando leads", leadsError);
    return NextResponse.json({ error: "Erro ao buscar seu cadastro." }, { status: 500 });
  }

  const match = (leadsDoEvento ?? []).find((lead) => {
    const leadEmail = lead.email ? normalizeEmail(lead.email) : "";
    const leadWhatsapp = lead.whatsapp ? normalizePhone(lead.whatsapp) : "";
    return (!!email && leadEmail === email) || (!!whatsapp && leadWhatsapp === whatsapp);
  });

  let leadId: string;
  const now = new Date().toISOString();

  if (match) {
    leadId = match.id;
    const { error: updateError } = await supabase
      .from("npa_evento_leads")
      .update({
        comprou_material: true,
        material_entregue_em: now,
        ultima_atividade: now,
        ...(emailRaw && !match.email ? { email: emailRaw } : {}),
        ...(whatsappRaw && !match.whatsapp ? { whatsapp: whatsappRaw } : {}),
      })
      .eq("id", leadId);

    if (updateError) {
      console.error("npa-presencial claim: erro atualizando lead", updateError);
      return NextResponse.json({ error: "Erro ao confirmar sua entrega." }, { status: 500 });
    }
  } else {
    const { data: novoLead, error: insertError } = await supabase
      .from("npa_evento_leads")
      .insert({
        npa_evento_id: evento.id,
        nome,
        email: emailRaw || null,
        whatsapp: whatsappRaw || null,
        fase: "novo",
        comprou_material: true,
        material_entregue_em: now,
        observacoes:
          "Criado via página /npa-presencial — não encontrado no CRM previamente.",
      })
      .select("id")
      .single();

    if (insertError || !novoLead) {
      console.error("npa-presencial claim: erro criando lead", insertError);
      return NextResponse.json({ error: "Erro ao confirmar sua entrega." }, { status: 500 });
    }
    leadId = novoLead.id;
  }

  await supabase.from("npa_eventos_log").insert({
    npa_evento_id: evento.id,
    evento: "material_entregue",
    payload: {
      lead_id: leadId,
      nome,
      email: emailRaw || null,
      whatsapp: whatsappRaw || null,
      encontrado: !!match,
    },
  });

  return NextResponse.json({
    lead_id: leadId,
    ebook_url: evento.ebook_url,
    telas_liberado: !!evento.telas_liberado,
    telas_url: evento.telas_liberado ? evento.telas_url : null,
  });
  } catch (e) {
    console.error("npa-presencial claim: erro inesperado", e);
    return NextResponse.json({ error: "Erro inesperado ao confirmar sua entrega." }, { status: 500 });
  }
}
