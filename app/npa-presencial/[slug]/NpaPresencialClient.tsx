"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./NpaPresencial.module.css";

const EQUIPE_WHATSAPP = "5511919434040";
const INSTAGRAM_RODRYGO = "murarirodrygo";
const INSTAGRAM_DESPERTAMENTE = "institutodespertamente";
const REFRESH_INTERVAL_MS = 20000;

interface EventoInfo {
  nome: string;
  local: string | null;
  data_evento: string | null;
  professor_convidado: string | null;
}

interface Identificacao {
  leadId: string;
  nome: string;
}

function storageKey(slug: string) {
  return `npa-presencial:${slug}`;
}

function formatarData(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function NpaPresencialClient({ slug }: { slug: string }) {
  const [loadingEvento, setLoadingEvento] = useState(true);
  const [eventoNaoEncontrado, setEventoNaoEncontrado] = useState(false);
  const [evento, setEvento] = useState<EventoInfo | null>(null);

  const [identificacao, setIdentificacao] = useState<Identificacao | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [ebookUrl, setEbookUrl] = useState<string | null>(null);
  const [telasLiberado, setTelasLiberado] = useState(false);
  const [telasUrl, setTelasUrl] = useState<string | null>(null);
  const [mostrarOferta, setMostrarOferta] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Carrega os dados públicos do evento
  useEffect(() => {
    let cancelado = false;
    fetch("/api/npa-presencial/evento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then(async (res) => {
        if (cancelado) return;
        if (res.status === 404) {
          setEventoNaoEncontrado(true);
          return;
        }
        if (!res.ok) throw new Error("Erro ao buscar evento");
        const data = await res.json();
        setEvento(data);
      })
      .catch(() => {
        if (!cancelado) setEventoNaoEncontrado(true);
      })
      .finally(() => {
        if (!cancelado) setLoadingEvento(false);
      });
    return () => {
      cancelado = true;
    };
  }, [slug]);

  // Recupera identificação salva neste aparelho
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (raw) {
        const parsed = JSON.parse(raw) as Identificacao;
        if (parsed?.leadId) setIdentificacao(parsed);
      }
    } catch {
      // localStorage indisponível — segue pedindo identificação normalmente
    }
  }, [slug]);

  async function buscarEstadoAtual(leadId: string) {
    try {
      const res = await fetch("/api/npa-presencial/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, lead_id: leadId }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setEbookUrl(data.ebook_url ?? null);
      setTelasLiberado(!!data.telas_liberado);
      setTelasUrl(data.telas_url ?? null);
    } catch {
      // silencioso — próxima tentativa de polling cobre isso
    }
  }

  // Depois de identificado: pega o estado atual e mantém consultando enquanto as telas
  // não forem liberadas.
  useEffect(() => {
    if (!identificacao) return;

    buscarEstadoAtual(identificacao.leadId);

    function tick() {
      if (identificacao) buscarEstadoAtual(identificacao.leadId);
    }

    function onFocus() {
      tick();
    }

    pollRef.current = setInterval(tick, REFRESH_INTERVAL_MS);
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [identificacao?.leadId, slug]);

  // Para o polling assim que as telas forem liberadas — não tem mais o que consultar
  useEffect(() => {
    if (telasLiberado && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, [telasLiberado]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!nome.trim() || (!email.trim() && !whatsapp.trim())) {
      setErro("Preencha seu nome e pelo menos e-mail ou WhatsApp.");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/npa-presencial/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, nome, email, whatsapp }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErro(data?.error || "Não conseguimos confirmar seus dados. Tente de novo.");
        return;
      }

      const nova: Identificacao = { leadId: data.lead_id, nome };
      setIdentificacao(nova);
      try {
        localStorage.setItem(storageKey(slug), JSON.stringify(nova));
      } catch {
        // segue sem persistir — funciona igual nesta sessão
      }

      setEbookUrl(data.ebook_url ?? null);
      setTelasLiberado(!!data.telas_liberado);
      setTelasUrl(data.telas_url ?? null);
    } catch {
      setErro("Erro de conexão. Tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  function handleVerTelas() {
    if (telasUrl) window.open(telasUrl, "_blank", "noopener,noreferrer");
    setMostrarOferta(true);
  }

  const whatsappGeral = `https://wa.me/${EQUIPE_WHATSAPP}?text=${encodeURIComponent(
    "Olá! Estou na página de entrega do material do NPA e preciso de ajuda."
  )}`;

  const whatsappOferta = `https://wa.me/${EQUIPE_WHATSAPP}?text=${encodeURIComponent(
    `Olá! Sou ${identificacao?.nome ?? ""}, estive no ${
      evento?.nome ?? "NPA"
    } e quero garantir minha sessão promocional de R$300 com o Rodrygo.`
  )}`;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {evento && (
          <>
            <p className={styles.eyebrow}>{evento.nome}</p>
            <p className={styles.eyebrowSub}>em parceria com Instituto Despertamente</p>
            <div className={styles.divider} />
          </>
        )}

        {loadingEvento && <p className={styles.centerState}>Carregando...</p>}

        {!loadingEvento && eventoNaoEncontrado && (
          <div className={styles.centerState}>
            <p className={styles.title}>Evento não encontrado</p>
            <p className={styles.subtitle}>
              Confira o link com a equipe do NPA — ele pode ter mudado.
            </p>
          </div>
        )}

        {!loadingEvento && !eventoNaoEncontrado && evento && !identificacao && (
          <>
            <p className={styles.title}>Sua entrega está aqui</p>
            <p className={styles.subtitle}>
              Digite seus dados pra liberar seu material
              {evento.local ? ` — ${evento.local}` : ""}
              {evento.data_evento ? ` (${formatarData(evento.data_evento)})` : ""}
            </p>

            <form className={styles.form} onSubmit={handleSubmit}>
              <input
                className={styles.input}
                placeholder="Nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                autoComplete="name"
              />
              <input
                className={styles.input}
                placeholder="E-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <input
                className={styles.input}
                placeholder="WhatsApp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                autoComplete="tel"
              />
              {erro && <div className={styles.errorBox}>{erro}</div>}
              <button className={styles.submitButton} type="submit" disabled={enviando}>
                {enviando ? "Enviando..." : "Liberar meu material"}
              </button>
            </form>
          </>
        )}

        {!loadingEvento && !eventoNaoEncontrado && evento && identificacao && (
          <>
            <p className={styles.title}>Olá, {identificacao.nome.split(" ")[0]}!</p>
            <p className={styles.subtitle}>Aqui está o seu material</p>

            <div className={styles.card}>
              <p className={styles.cardTitle}>📖 Seu E-book</p>
              <p className={styles.cardHint}>Acesso liberado — toque para abrir</p>
              {ebookUrl ? (
                <a
                  className={styles.cardLink}
                  href={ebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Abrir e-book →
                </a>
              ) : (
                <p className={styles.cardHint}>
                  O link ainda não foi configurado — fale com a equipe.
                </p>
              )}
            </div>

            {!telasLiberado && (
              <div className={styles.lockedCard}>
                <div className={styles.lockedPreview} />
                <div className={styles.lockedOverlay} />
                <div className={styles.lockedContent}>
                  <div className={styles.lockIcon}>🔒</div>
                  <p className={styles.lockedTitle}>Suas Telas Numerológicas</p>
                  <p className={styles.lockedHint}>Libera ao vivo, no fim da aula de hoje</p>
                </div>
              </div>
            )}

            {telasLiberado && (
              <div className={`${styles.card} ${styles.unlockedCard}`}>
                <p className={styles.cardTitle}>✨ Suas Telas Numerológicas</p>
                <p className={styles.cardHint}>Liberado agora!</p>
                <button
                  className={styles.submitButton}
                  style={{ marginTop: 12 }}
                  onClick={handleVerTelas}
                >
                  Ver minhas telas →
                </button>
              </div>
            )}

            {telasLiberado && mostrarOferta && (
              <>
                <div className={styles.offerCard}>
                  <p className={styles.offerTitle}>
                    Sessão individual do seu mapa com o Rodrygo
                  </p>
                  <p className={styles.offerHint}>Vagas limitadas hoje</p>
                  <p className={styles.offerPrice}>
                    <span className={styles.offerPriceOld}>R$850</span>
                    <span className={styles.offerPriceNew}>R$300</span>
                  </p>
                  <a
                    className={styles.offerButton}
                    href={whatsappOferta}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Quero garantir minha vaga
                  </a>
                </div>

                <div className={styles.socialRow}>
                  <a
                    className={styles.socialLink}
                    href={`https://instagram.com/${INSTAGRAM_RODRYGO}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📸 @{INSTAGRAM_RODRYGO}
                  </a>
                  <a
                    className={styles.socialLink}
                    href={`https://instagram.com/${INSTAGRAM_DESPERTAMENTE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    📸 @{INSTAGRAM_DESPERTAMENTE}
                  </a>
                </div>
              </>
            )}
          </>
        )}
      </div>

      <a
        className={styles.whatsappFloat}
        href={whatsappGeral}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com a equipe no WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
