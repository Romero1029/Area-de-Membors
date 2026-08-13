import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Mensagem sempre genérica — nunca revela se o email existe, se é a senha que
// está errada, ou se a conta está bloqueada por excesso de tentativas.
const GENERIC_ERROR = "Email ou senha incorretos.";

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({ email: "", password: "" }));

  if (!email || !password) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 400 });
  }

  const ip = getClientIp(req);
  const supabase = await createServerSupabaseClient();

  const { data: gate } = await supabase.rpc("check_login_allowed", {
    p_identifier: email,
    p_ip: ip,
  });

  if (gate && gate.allowed === false) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 429 });
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  await supabase.rpc("record_login_attempt", {
    p_identifier: email,
    p_ip: ip,
    p_success: !error,
  });

  if (error) {
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
