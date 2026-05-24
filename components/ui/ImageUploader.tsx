"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon, Link2 } from "lucide-react";

type Ratio = "16/9" | "1/1" | "21/9" | "4/3";

interface Props {
  value: string;
  onChange: (url: string) => void;
  ratio?: Ratio;
  label?: string;
  hint?: string;
  /** "thumbnail" | "banner" | "avatar" */
  variant?: "thumbnail" | "banner" | "avatar";
}

const RATIO_CONFIG: Record<Ratio, { cls: string; label: string; w: number; h: number }> = {
  "16/9":  { cls: "aspect-video",          label: "16:9",  w: 1280, h: 720  },
  "1/1":   { cls: "aspect-square",         label: "1:1",   w: 400,  h: 400  },
  "21/9":  { cls: "aspect-[21/9]",         label: "21:9",  w: 1920, h: 823  },
  "4/3":   { cls: "aspect-[4/3]",          label: "4:3",   w: 800,  h: 600  },
};

export function ImageUploader({ value, onChange, ratio = "16/9", label, hint, variant = "thumbnail" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState(value && value.startsWith("http") ? value : "");

  const cfg = RATIO_CONFIG[ratio];

  // ── Upload handler ───────────────────────────────────────────────────────────
  async function handleFile(file: File) {
    setError("");
    setLoading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erro ao enviar."); return; }
      onChange(data.url);
    } catch {
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function applyUrl() {
    if (urlInput.trim()) onChange(urlInput.trim());
  }

  const preview = value || "";

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider">{label}</label>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-[#111111] border border-[#1E1E1E] rounded-[8px] p-0.5 w-fit">
        {(["upload", "url"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[6px] text-xs font-medium transition-all ${
              tab === t ? "bg-[#FFA902] text-black" : "text-[#555555] hover:text-[#AAAAAA]"
            }`}
          >
            {t === "upload" ? <Upload className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
            {t === "upload" ? "Fazer upload" : "Colar link"}
          </button>
        ))}
      </div>

      {tab === "upload" ? (
        /* Drop zone */
        <div
          onClick={() => !loading && inputRef.current?.click()}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className={`relative border-2 border-dashed rounded-[12px] overflow-hidden cursor-pointer transition-colors ${
            preview ? "border-[#2A2A2A]" : "border-[#1E1E1E] hover:border-[#FFA902]/40"
          } ${cfg.cls} bg-[#0D0D0D]`}
        >
          {loading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
              <Loader2 className="w-6 h-6 text-[#FFA902] animate-spin" />
            </div>
          )}

          {preview ? (
            <>
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-5 h-5 text-white" />
                  <span className="text-xs text-white font-medium">Trocar imagem</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); setUrlInput(""); }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-500/80 transition-colors z-10"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
              <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-[#444444]" />
              </div>
              <p className="text-xs text-[#555555] text-center leading-relaxed">
                Clique ou arraste a imagem aqui
              </p>
              <p className="text-[10px] text-[#333333]">
                {cfg.label} · {cfg.w}×{cfg.h}px · JPG, PNG ou WebP · máx 10MB
              </p>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" className="hidden" onChange={onInputChange} />
        </div>
      ) : (
        /* URL input */
        <div className="space-y-2">
          <div className={`relative border-2 border-dashed rounded-[12px] overflow-hidden ${cfg.cls} bg-[#0D0D0D] border-[#1E1E1E]`}>
            {preview ? (
              <>
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => { onChange(""); setUrlInput(""); }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-500/80 transition-colors"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-[#333333]">Preview da imagem</p>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyUrl()}
              placeholder="https://... ou link do Google Drive"
              className="flex-1 bg-[#111111] border border-[#1E1E1E] rounded-[8px] px-3 py-2 text-xs text-[#F0F0F0] placeholder-[#333333] outline-none focus:border-[#FFA902]/40 transition-colors"
            />
            <button
              type="button"
              onClick={applyUrl}
              className="px-3 py-2 text-xs font-semibold bg-[#FFA902] text-black rounded-[8px] hover:bg-[#FFB832] transition-colors whitespace-nowrap"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && <p className="text-[10px] text-[#444444]">{hint}</p>}
    </div>
  );
}
