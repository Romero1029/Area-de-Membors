import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Acesso ao Supabase do Sistema 11ds (o CRM "Sistema 11 Digital"), usado pela
 * feature /npa-presencial. A service role key nunca deve ser importada em um
 * Client Component — o `server-only` acima garante isso em build time.
 */
export function getSistema11Client() {
  const url = process.env.SISTEMA11_SUPABASE_URL;
  const key = process.env.SISTEMA11_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SISTEMA11_SUPABASE_URL / SISTEMA11_SUPABASE_SERVICE_ROLE_KEY não configuradas no .env"
    );
  }

  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
