import "server-only";

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, "");
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export interface NpaEventoPublico {
  nome: string;
  local: string | null;
  data_evento: string | null;
  professor_convidado: string | null;
}

export interface NpaEntregaEstado {
  ebook_url: string | null;
  telas_liberado: boolean;
  telas_url: string | null;
}
