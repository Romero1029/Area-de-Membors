import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Formato inválido. Use JPG, PNG ou WebP." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Arquivo muito grande. Máximo 10MB." }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;

  const supabase = await createServerSupabaseClient();
  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage
    .from("uploads")
    .upload(filename, bytes, { contentType: file.type });

  if (error) {
    return NextResponse.json({ error: "Falha ao enviar arquivo." }, { status: 500 });
  }

  const { data } = supabase.storage.from("uploads").getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl });
}
