"use client";

import { useEffect, useMemo, useState } from "react";

interface Evento {
  id: string;
  nome: string;
  local: string | null;
  data_evento: string | null;
  ativo: boolean;
  slug: string | null;
  ebook_url: string | null;
  telas_url: string | null;
  telas_liberado: boolean;
  telas_liberado_em: string | null;
}

function escolherEventoPadrao(eventos: Evento[]): Evento | null {
  if (eventos.length === 0) return null;
  const hoje = Date.now();
  const ativos = eventos.filter((e) => e.ativo && e.data_evento);
  const base = ativos.length > 0 ? ativos : eventos;

  return [...base].sort((a, b) => {
    if (!a.data_evento) return 1;
    if (!b.data_evento) return -1;
    const da = Math.abs(new Date(a.data_evento).getTime() - hoje);
    const db = Math.abs(new Date(b.data_evento).getTime() - hoje);
    return da - db;
  })[0];
}

export function NpaPresencialAdminClient() {
  const [eventos, setEventos] = useState<Evento[] | null>(null);
  const [selecionadoId, setSelecionadoId] = useState<string>("");
  const [slug, setSlug] = useState("");
  const [ebookUrl, setEbookUrl] = useState("");
  const [telasUrl, setTelasUrl] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(
    null
  );
  const [erroLista, setErroLista] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/npa-presencial/admin")
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error || "Erro ao carregar eventos.");
        }
        const lista: Evento[] = data.eventos ?? [];
        setEventos(lista);
        const padrao = escolherEventoPadrao(lista);
        if (padrao) setSelecionadoId(padrao.id);
      })
      .catch((e: Error) => {
        setErroLista(e.message || "Erro ao carregar eventos.");
        setEventos([]);
      });
  }, []);

  const selecionado = useMemo(
    () => eventos?.find((e) => e.id === selecionadoId) ?? null,
    [eventos, selecionadoId]
  );

  useEffect(() => {
    if (!selecionado) return;
    setSlug(selecionado.slug ?? "");
    setEbookUrl(selecionado.ebook_url ?? "");
    setTelasUrl(selecionado.telas_url ?? "");
    setMensagem(null);
  }, [selecionado]);

  function atualizarEventoLocal(atualizado: Evento) {
    setEventos((prev) => prev?.map((e) => (e.id === atualizado.id ? atualizado : e)) ?? prev);
  }

  async function salvar(patch: Record<string, unknown>, sucesso: string) {
    if (!selecionado) return;
    setSalvando(true);
    setMensagem(null);
    try {
      const res = await fetch("/api/npa-presencial/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventoId: selecionado.id, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMensagem({ tipo: "erro", texto: data?.error || "Erro ao salvar." });
        return;
      }
      atualizarEventoLocal({ ...selecionado, ...data.evento });
      setMensagem({ tipo: "ok", texto: sucesso });
    } catch {
      setMensagem({ tipo: "erro", texto: "Erro de conexão." });
    } finally {
      setSalvando(false);
    }
  }

  const linkPublico = selecionado?.slug
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/npa-presencial/${selecionado.slug}`
    : "";

  return (
    <div style={{ minHeight: "100vh", background: "#080807", color: "#EEEEEE", padding: "20px 16px 60px" }}>
      <div style={{ maxWidth: 480, margin: "0 auto" }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>NPA Presencial</h1>
        <p style={{ fontSize: 13, color: "#999", marginBottom: 20 }}>
          Escolha a edição/cidade, configure os links e libere as telas quando quiser.
        </p>

        {!eventos && !erroLista && <p style={{ color: "#999", fontSize: 14 }}>Carregando eventos...</p>}

        {erroLista && (
          <p style={{ color: "#e08f8f", fontSize: 14 }}>{erroLista}</p>
        )}

        {eventos && !erroLista && eventos.length === 0 && (
          <p style={{ color: "#999", fontSize: 14 }}>Nenhum evento NPA cadastrado.</p>
        )}

        {eventos && eventos.length > 0 && (
          <>
            <label style={{ display: "block", fontSize: 12, color: "#aaa", marginBottom: 6 }}>
              Evento / cidade
            </label>
            <select
              value={selecionadoId}
              onChange={(e) => setSelecionadoId(e.target.value)}
              style={selectStyle}
            >
              {eventos.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nome} {e.data_evento ? `— ${e.data_evento}` : ""}
                </option>
              ))}
            </select>

            {selecionado && (
              <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={labelStyle}>Slug (caminho da URL)</label>
                  <input
                    style={inputStyle}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="npa-17-campinas"
                  />
                  {linkPublico && (
                    <p style={{ fontSize: 11, color: "#777", marginTop: 4, wordBreak: "break-all" }}>
                      {linkPublico}
                    </p>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Link do e-book</label>
                  <input
                    style={inputStyle}
                    value={ebookUrl}
                    onChange={(e) => setEbookUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label style={labelStyle}>Link das telas</label>
                  <input
                    style={inputStyle}
                    value={telasUrl}
                    onChange={(e) => setTelasUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                {mensagem && (
                  <div
                    style={{
                      fontSize: 13,
                      padding: "8px 12px",
                      borderRadius: 6,
                      background: mensagem.tipo === "ok" ? "#123a1f" : "#3a1212",
                      color: mensagem.tipo === "ok" ? "#8fe0a8" : "#e08f8f",
                    }}
                  >
                    {mensagem.texto}
                  </div>
                )}

                <button
                  disabled={salvando}
                  onClick={() => salvar({ slug, ebook_url: ebookUrl, telas_url: telasUrl }, "Links salvos.")}
                  style={secondaryButtonStyle}
                >
                  Salvar links
                </button>

                {!selecionado.telas_liberado ? (
                  <button
                    disabled={salvando}
                    onClick={() =>
                      salvar(
                        { slug, ebook_url: ebookUrl, telas_url: telasUrl, telas_liberado: true },
                        "Telas liberadas!"
                      )
                    }
                    style={primaryButtonStyle}
                  >
                    Liberar telas agora
                  </button>
                ) : (
                  <button
                    disabled={salvando}
                    onClick={() => salvar({ telas_liberado: false }, "Telas bloqueadas de novo.")}
                    style={dangerButtonStyle}
                  >
                    Bloquear de novo
                  </button>
                )}

                {selecionado.telas_liberado && selecionado.telas_liberado_em && (
                  <p style={{ fontSize: 11, color: "#777" }}>
                    Liberado em {new Date(selecionado.telas_liberado_em).toLocaleString("pt-BR")}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  background: "#161616",
  color: "#EEEEEE",
  border: "1px solid #2a2a2a",
  fontSize: 14,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  color: "#aaa",
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  background: "#161616",
  color: "#EEEEEE",
  border: "1px solid #2a2a2a",
  fontSize: 14,
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: 8,
  background: "#FFA902",
  color: "#0A0A0A",
  fontWeight: 700,
  fontSize: 14,
  border: "none",
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: 8,
  background: "transparent",
  color: "#FFA902",
  fontWeight: 700,
  fontSize: 14,
  border: "1px solid #FFA902",
};

const dangerButtonStyle: React.CSSProperties = {
  padding: "14px",
  borderRadius: 8,
  background: "transparent",
  color: "#e08f8f",
  fontWeight: 700,
  fontSize: 14,
  border: "1px solid #5a2a2a",
};
