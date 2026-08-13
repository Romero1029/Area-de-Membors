"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Check, Loader2, Trash2, Pencil, Video, EyeOff } from "lucide-react";
import { createLive, updateLive, deleteLive } from "@/lib/actions/formacao";
import type { FormacaoLive } from "@/lib/queries";

interface Props {
  lives: FormacaoLive[];
}

export function LivesAdminClient({ lives }: Props) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="px-4 md:px-8 py-8 max-w-[820px]">
      <Link href="/admin/formacao-idm" className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Formação IDM
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-[8px] bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center">
              <Video className="w-4 h-4 text-[#FFA902]" />
            </div>
            <h1 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Aulas ao vivo</h1>
          </div>
          <p className="text-sm text-[#555555] ml-11">Link do Meet + data/horário exibidos no calendário do aluno</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#FFA902] text-black text-sm font-semibold rounded-[8px] hover:bg-[#FFB832] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova aula
        </button>
      </div>

      {creating && <LiveForm onDone={() => setCreating(false)} />}

      <div className="space-y-2 mt-4">
        {lives.map((l) => (
          <LiveRow key={l.id} live={l} />
        ))}
        {lives.length === 0 && !creating && (
          <p className="text-sm text-[#555555] text-center py-12">Nenhuma aula ao vivo cadastrada ainda.</p>
        )}
      </div>
    </div>
  );
}

function LiveRow({ live }: { live: FormacaoLive }) {
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setDeleting(true);
    await deleteLive(live.id);
  };

  if (editing) {
    return <LiveForm initial={live} onDone={() => setEditing(false)} />;
  }

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-[12px] p-4 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#F0F0F0]">{live.title}</p>
          {!live.isActive && (
            <span className="flex items-center gap-1 text-[10px] text-[#555555] uppercase tracking-wider">
              <EyeOff className="w-3 h-3" /> Oculta
            </span>
          )}
        </div>
        <p className="text-[11px] text-[#666666] mt-0.5">{live.dateLabel} {live.timeLabel && `· ${live.timeLabel}`}</p>
        {live.joinUrl && (
          <a href={live.joinUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#FFA902] hover:underline mt-1 inline-block truncate max-w-full">
            {live.joinUrl}
          </a>
        )}
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        <button onClick={() => setEditing(true)} className="w-7 h-7 rounded flex items-center justify-center text-[#444444] hover:text-[#FFA902] hover:bg-[#FFA902]/10 transition-colors">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button onClick={handleDelete} disabled={deleting}
          className={`w-7 h-7 rounded flex items-center justify-center transition-colors ${confirmDel ? "text-red-400 bg-red-500/10" : "text-[#444444] hover:text-red-400 hover:bg-red-500/10"}`}>
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function LiveForm({ initial, onDone }: { initial?: FormacaoLive; onDone: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [dateLabel, setDateLabel] = useState(initial?.dateLabel ?? "");
  const [timeLabel, setTimeLabel] = useState(initial?.timeLabel ?? "");
  const [joinUrl, setJoinUrl] = useState(initial?.joinUrl ?? "");
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError("");
    const result = initial
      ? await updateLive(initial.id, { title, dateLabel, timeLabel, joinUrl, isActive })
      : await createLive({ title, dateLabel, timeLabel, joinUrl, isActive });
    setSaving(false);
    if (!result.ok) { setError(result.error); return; }
    onDone();
  };

  return (
    <div className="bg-[#111111] border border-[#FFA902]/30 rounded-[12px] p-4 space-y-3 mb-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da aula (ex: Aula 01 — Abertura)" autoFocus
        className="w-full bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40" />

      <div className="flex gap-2">
        <input value={dateLabel} onChange={(e) => setDateLabel(e.target.value)} placeholder="Data (ex: 20 de agosto)"
          className="flex-1 bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none" />
        <input value={timeLabel} onChange={(e) => setTimeLabel(e.target.value)} placeholder="Horário (ex: 19h30)"
          className="w-40 bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none" />
      </div>

      <input value={joinUrl} onChange={(e) => setJoinUrl(e.target.value)} placeholder="Link do Google Meet"
        className="w-full bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none" />

      <label className="flex items-center gap-1.5 text-xs text-[#888888] cursor-pointer select-none">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="accent-[#FFA902]" />
        Visível pro aluno
      </label>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="px-3 py-1.5 text-xs text-[#888888] hover:text-[#F0F0F0]">Cancelar</button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#FFA902] text-black text-xs font-medium rounded-[6px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Salvar
        </button>
      </div>
    </div>
  );
}
