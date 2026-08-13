"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp, Check, X, Loader2,
  Lock, LockOpen, CalendarClock, GraduationCap, FileText, Link2, Video, Type, Paperclip, Users2, ClipboardList,
} from "lucide-react";
import {
  createFormacaoModule, updateFormacaoModule, deleteFormacaoModule,
  createFormacaoLesson, updateFormacaoLesson, deleteFormacaoLesson,
  createMaterial, deleteMaterial, createTurma, updateTurmaModuleRelease,
  type FormacaoLessonInput,
} from "@/lib/actions/formacao";
import type { FormacaoModule, FormacaoLesson, Turma } from "@/lib/queries";

type ReleaseMap = Record<string, { released: boolean; releaseAt: string | null }>;

const LESSON_TYPES: { type: "video" | "text" | "file"; label: string; icon: React.ReactNode }[] = [
  { type: "video", label: "Vídeo", icon: <Video className="w-3.5 h-3.5" /> },
  { type: "text", label: "Texto", icon: <Type className="w-3.5 h-3.5" /> },
  { type: "file", label: "Arquivo", icon: <FileText className="w-3.5 h-3.5" /> },
];

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

interface Props {
  modules: FormacaoModule[];
  turmas: Turma[];
  selectedTurmaId: string;
  releases: ReleaseMap;
}

export function AdminFormacaoClient({ modules, turmas, selectedTurmaId, releases }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingModule, setAddingModule] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [addingTurma, setAddingTurma] = useState(false);
  const [turmaCode, setTurmaCode] = useState("");
  const [savingTurma, setSavingTurma] = useState(false);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleAddModule = async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    await createFormacaoModule({ title: newTitle.trim() });
    setSaving(false);
    setNewTitle("");
    setAddingModule(false);
  };

  const handleAddTurma = async () => {
    if (!turmaCode.trim()) return;
    setSavingTurma(true);
    const result = await createTurma({ code: turmaCode.trim(), name: "", startDate: null });
    setSavingTurma(false);
    if (result.ok) {
      setTurmaCode("");
      setAddingTurma(false);
      router.push(`${pathname}?turma=${result.data.id}`);
    }
  };

  const selectTurma = (id: string) => router.push(`${pathname}?turma=${id}`);

  const releasedCount =
    (modules[0]?.released ? 1 : 0) + modules.slice(1).filter((m) => releases[m.id]?.released).length;

  return (
    <div className="px-4 md:px-8 py-8 max-w-[820px]">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-[8px] bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-[#FFA902]" />
          </div>
          <h1 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Formação IDM</h1>
          <Link href="/admin/formacao-idm/tarefas"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-[#888888] hover:text-[#FFA902] border border-[#222222] hover:border-[#FFA902]/30 transition-colors">
            <ClipboardList className="w-3.5 h-3.5" /> Tarefas
          </Link>
          <Link href="/admin/formacao-idm/calendario"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-[#888888] hover:text-[#FFA902] border border-[#222222] hover:border-[#FFA902]/30 transition-colors">
            <CalendarClock className="w-3.5 h-3.5" /> Aulas ao vivo
          </Link>
        </div>
        <p className="text-sm text-[#555555] ml-11">
          {modules.length} módulos · {releasedCount} liberados para a turma selecionada
        </p>
      </div>

      {/* Turma selector */}
      <div className="flex items-center gap-2 mb-6 p-3 bg-[#0D0D0D] border border-[#161616] rounded-[10px]">
        <Users2 className="w-4 h-4 text-[#FFA902] flex-shrink-0" />
        <span className="text-xs text-[#888888] flex-shrink-0">Turma:</span>
        <select
          value={selectedTurmaId}
          onChange={(e) => selectTurma(e.target.value)}
          className="flex-1 bg-[#111111] border border-[#222222] rounded-[6px] px-2 py-1.5 text-sm text-[#F0F0F0] outline-none focus:border-[#FFA902]/40"
        >
          {turmas.length === 0 && <option value="">Nenhuma turma criada</option>}
          {turmas.map((t) => (
            <option key={t.id} value={t.id}>
              {t.code}{t.name && t.name !== `Turma ${t.code}` ? ` — ${t.name}` : ""}
            </option>
          ))}
        </select>

        {addingTurma ? (
          <div className="flex items-center gap-1.5">
            <input
              autoFocus value={turmaCode} onChange={(e) => setTurmaCode(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddTurma(); if (e.key === "Escape") setAddingTurma(false); }}
              placeholder="Código (ex: 02726)"
              className="w-32 bg-[#111111] border border-[#FFA902]/30 rounded-[6px] px-2 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none"
            />
            <button onClick={handleAddTurma} disabled={savingTurma || !turmaCode.trim()}
              className="w-7 h-7 rounded-[6px] bg-[#FFA902] flex items-center justify-center text-black hover:bg-[#FFB832] disabled:opacity-40 transition-colors flex-shrink-0">
              {savingTurma ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setAddingTurma(false)} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#555555] hover:text-[#F0F0F0] hover:bg-[#1A1A1A] transition-colors flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button onClick={() => setAddingTurma(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium text-[#888888] hover:text-[#FFA902] hover:bg-[#FFA902]/10 transition-colors flex-shrink-0">
            <Plus className="w-3.5 h-3.5" /> Nova turma
          </button>
        )}
      </div>

      <div className="space-y-2">
        {modules.map((mod, i) => (
          <ModuleBlock
            key={`${mod.id}-${selectedTurmaId}`}
            module={mod}
            isExpanded={expanded.has(mod.id)}
            onToggle={() => toggle(mod.id)}
            turmaId={selectedTurmaId}
            release={i === 0 ? null : releases[mod.id] ?? { released: false, releaseAt: null }}
          />
        ))}

        {addingModule ? (
          <div className="flex items-center gap-2 p-3 bg-[#111111] border border-[#FFA902]/30 rounded-[10px]">
            <input
              autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddModule(); if (e.key === "Escape") setAddingModule(false); }}
              placeholder="Título do novo módulo..."
              className="flex-1 bg-transparent text-sm text-[#F0F0F0] placeholder-[#444444] outline-none"
            />
            <button onClick={handleAddModule} disabled={saving || !newTitle.trim()}
              className="w-7 h-7 rounded-[6px] bg-[#FFA902] flex items-center justify-center text-black hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setAddingModule(false)} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#555555] hover:text-[#F0F0F0] hover:bg-[#1A1A1A] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button onClick={() => setAddingModule(true)}
            className="w-full flex items-center gap-2 px-4 py-3 border border-dashed border-[#2A2A2A] rounded-[10px] text-[#555555] hover:text-[#888888] hover:border-[#333333] transition-all duration-150 text-sm">
            <Plus className="w-4 h-4" />
            Adicionar módulo
          </button>
        )}
      </div>
    </div>
  );
}

function ModuleBlock({
  module, isExpanded, onToggle, turmaId, release,
}: {
  module: FormacaoModule;
  isExpanded: boolean;
  onToggle: () => void;
  turmaId: string;
  release: { released: boolean; releaseAt: string | null } | null; // null = módulo comum a todas as turmas (onboarding)
}) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [savingTitle, setSavingTitle] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const isReleased = release ? release.released : module.released;
  const [releaseAt, setReleaseAt] = useState(toDatetimeLocal(release ? release.releaseAt : module.releaseAt));
  const [savingRelease, setSavingRelease] = useState(false);

  const handleSaveTitle = async () => {
    if (!title.trim() || title === module.title) { setEditingTitle(false); setTitle(module.title); return; }
    setSavingTitle(true);
    await updateFormacaoModule(module.id, { title: title.trim() });
    setSavingTitle(false);
    setEditingTitle(false);
  };

  const handleToggleReleased = async () => {
    setSavingRelease(true);
    if (release && turmaId) {
      await updateTurmaModuleRelease(turmaId, module.id, { released: !isReleased });
    } else {
      await updateFormacaoModule(module.id, { released: !isReleased });
    }
    setSavingRelease(false);
  };

  const handleSetReleaseAt = async (value: string) => {
    setReleaseAt(value);
    setSavingRelease(true);
    const iso = value ? new Date(value).toISOString() : null;
    if (release && turmaId) {
      await updateTurmaModuleRelease(turmaId, module.id, { releaseAt: iso });
    } else {
      await updateFormacaoModule(module.id, { releaseAt: iso });
    }
    setSavingRelease(false);
  };

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setDeleting(true);
    await deleteFormacaoModule(module.id);
  };

  return (
    <div className={`bg-[#111111] border rounded-[12px] overflow-hidden transition-colors duration-150 ${isReleased ? "border-[#1E1E1E]" : "border-[#2A2A2A]"}`}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3.5 hover:bg-[#161616] transition-colors flex-wrap">
        <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-[#555555]">{module.order + 1}</span>
        </div>

        {editingTitle ? (
          <input
            autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => { if (e.key === "Enter") handleSaveTitle(); if (e.key === "Escape") { setEditingTitle(false); setTitle(module.title); } }}
            className="flex-1 bg-transparent text-sm font-semibold text-[#F0F0F0] outline-none border-b border-[#FFA902]/50 min-w-[160px]"
          />
        ) : (
          <button className="flex-1 text-left min-w-[160px]" onClick={onToggle}>
            <span className="text-sm font-semibold text-[#F0F0F0]">{module.title}</span>
            <span className="text-[11px] text-[#555555] ml-2">
              {module.lessons.length} {module.lessons.length === 1 ? "aula" : "aulas"}
            </span>
            {!release && <span className="text-[10px] text-[#FFA902]/70 ml-2">· comum a todas as turmas</span>}
          </button>
        )}

        {/* Release toggle */}
        <button
          onClick={handleToggleReleased}
          disabled={savingRelease || (release !== null && !turmaId)}
          title={isReleased ? "Liberado — clique pra bloquear" : "Bloqueado — clique pra liberar"}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-colors ${
            isReleased
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15"
              : "text-[#666666] bg-[#1A1A1A] border-[#2A2A2A] hover:text-[#999999]"
          }`}
        >
          {isReleased ? <LockOpen className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
          {isReleased ? "Liberado" : "Bloqueado"}
        </button>

        <div className="flex items-center gap-1">
          <button onClick={() => setEditingTitle(true)} className="w-6 h-6 rounded flex items-center justify-center text-[#444444] hover:text-[#FFA902] hover:bg-[#FFA902]/10 transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${confirmDel ? "text-red-400 bg-red-500/10" : "text-[#444444] hover:text-red-400 hover:bg-red-500/10"}`}>
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          </button>
        </div>

        {savingTitle && <Loader2 className="w-3.5 h-3.5 text-[#FFA902] animate-spin flex-shrink-0" />}

        <button onClick={onToggle} className="text-[#444444] hover:text-[#888888] transition-colors flex-shrink-0">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Scheduled release date */}
      <div className="px-4 pb-3 flex items-center gap-2 text-[11px] text-[#555555]">
        <CalendarClock className="w-3 h-3" />
        <span>Liberação agendada:</span>
        <input
          type="datetime-local"
          value={releaseAt}
          onChange={(e) => handleSetReleaseAt(e.target.value)}
          disabled={release !== null && !turmaId}
          className="bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-2 py-1 text-[11px] text-[#AAAAAA] outline-none focus:border-[#FFA902]/40 disabled:opacity-40"
        />
        {releaseAt && (
          <button onClick={() => handleSetReleaseAt("")} className="text-[#444444] hover:text-red-400">
            limpar
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-[#1A1A1A]">
          {module.lessons.map((lesson) => (
            <LessonRow key={lesson.id} lesson={lesson} />
          ))}

          <div className="px-4 py-2 border-t border-[#1A1A1A]">
            {addingLesson ? (
              <AddLessonForm moduleId={module.id} onDone={() => setAddingLesson(false)} />
            ) : (
              <button onClick={() => setAddingLesson(true)} className="flex items-center gap-2 text-xs text-[#555555] hover:text-[#FFA902] transition-colors py-2">
                <Plus className="w-3.5 h-3.5" />
                Adicionar aula
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function LessonRow({ lesson }: { lesson: FormacaoLesson }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<FormacaoLessonInput>({
    title: lesson.title,
    description: lesson.description,
    lessonType: (lesson.lessonType as "video" | "text" | "file") || "video",
    videoUrl: lesson.videoUrl,
    fileUrl: lesson.fileUrl,
    content: lesson.content,
    videoDuration: lesson.videoDuration,
    isFreePreview: lesson.isFreePreview,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [showMaterials, setShowMaterials] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateFormacaoLesson(lesson.id, form);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setDeleting(true);
    await deleteFormacaoLesson(lesson.id);
  };

  if (editing) {
    return (
      <div className="px-4 py-3 border-b border-[#161616] bg-[#0D0D0D] space-y-3">
        <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Título da aula" autoFocus
          className="w-full bg-[#111111] border border-[#FFA902]/30 rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] outline-none" />

        <div className="flex gap-1.5">
          {LESSON_TYPES.map((lt) => (
            <button key={lt.type} type="button" onClick={() => setForm((p) => ({ ...p, lessonType: lt.type }))}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-all border ${
                form.lessonType === lt.type ? "bg-[#FFA902]/15 border-[#FFA902]/40 text-[#FFA902]" : "bg-[#111111] border-[#222222] text-[#555555] hover:text-[#888888]"
              }`}>
              {lt.icon} {lt.label}
            </button>
          ))}
        </div>

        {form.lessonType === "video" && (
          <input value={form.videoUrl} onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/watch?v=... ou link direto do vídeo"
            className="w-full bg-[#111111] border border-[#222222] rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40" />
        )}
        {form.lessonType === "file" && (
          <input value={form.fileUrl} onChange={(e) => setForm((p) => ({ ...p, fileUrl: e.target.value }))}
            placeholder="Link do arquivo (PDF, doc...)"
            className="w-full bg-[#111111] border border-[#222222] rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40" />
        )}
        {form.lessonType === "text" && (
          <textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
            placeholder="Conteúdo em texto da aula..." rows={4}
            className="w-full bg-[#111111] border border-[#222222] rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40 resize-none" />
        )}

        <textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
          placeholder="Descrição (opcional)" rows={2}
          className="w-full bg-[#111111] border border-[#222222] rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40 resize-none" />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-[#888888] cursor-pointer select-none">
            <input type="checkbox" checked={form.isFreePreview} onChange={(e) => setForm((p) => ({ ...p, isFreePreview: e.target.checked }))} className="accent-[#FFA902]" />
            Prévia gratuita
          </label>
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="px-3 py-1 text-xs text-[#888888] hover:text-[#F0F0F0] transition-colors">Cancelar</button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1 px-3 py-1 bg-[#FFA902] text-black text-xs font-medium rounded-[6px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
              {saving && <Loader2 className="w-3 h-3 animate-spin" />} Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-[#161616] last:border-0">
      <div className="flex items-center gap-3 px-4 py-2.5 group hover:bg-[#0F0F0F] transition-colors">
        <div className="w-5 flex-shrink-0 text-[#555555]">
          {lesson.lessonType === "video" ? <Video className="w-3.5 h-3.5" /> : lesson.lessonType === "file" ? <FileText className="w-3.5 h-3.5" /> : <Type className="w-3.5 h-3.5" />}
        </div>
        <span className="flex-1 text-sm text-[#AAAAAA] group-hover:text-[#D0D0D0] transition-colors truncate">{lesson.title}</span>
        {lesson.isFreePreview && (
          <span className="text-[9px] font-bold text-[#FFA902] bg-[#FFA902]/10 px-1.5 py-0.5 rounded uppercase tracking-wider flex-shrink-0">Prévia</span>
        )}
        <button onClick={() => setShowMaterials((s) => !s)} className="flex items-center gap-1 text-[11px] text-[#555555] hover:text-[#FFA902] transition-colors flex-shrink-0">
          <Paperclip className="w-3 h-3" /> {lesson.materials.length}
        </button>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setEditing(true)} className="w-5 h-5 rounded flex items-center justify-center text-[#444444] hover:text-[#FFA902] transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${confirmDel ? "text-red-400" : "text-[#444444] hover:text-red-400"}`}>
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {showMaterials && <MaterialsPanel lesson={lesson} />}
    </div>
  );
}

function MaterialsPanel({ lesson }: { lesson: FormacaoLesson }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    if (!title.trim() || !url.trim()) return;
    setSaving(true);
    const type = url.toLowerCase().endsWith(".pdf") ? "pdf" : "link";
    await createMaterial({ title: title.trim(), url: url.trim(), type, lessonId: lesson.id, moduleId: null });
    setSaving(false);
    setTitle("");
    setUrl("");
    setAdding(false);
  };

  return (
    <div className="px-4 pb-3 pl-12 space-y-1.5 bg-[#0A0A0A]">
      {lesson.materials.map((m) => (
        <div key={m.id} className="flex items-center gap-2 text-xs text-[#888888] py-1">
          <Link2 className="w-3 h-3 text-[#555555] flex-shrink-0" />
          <a href={m.url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-[#FFA902] transition-colors">{m.title}</a>
          <button onClick={() => deleteMaterial(m.id)} className="ml-auto text-[#444444] hover:text-red-400 flex-shrink-0">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}

      {adding ? (
        <div className="flex items-center gap-1.5 pt-1">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nome do material"
            className="flex-1 bg-[#111111] border border-[#222222] rounded-[6px] px-2 py-1 text-xs text-[#F0F0F0] placeholder-[#444444] outline-none" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL"
            className="flex-1 bg-[#111111] border border-[#222222] rounded-[6px] px-2 py-1 text-xs text-[#F0F0F0] placeholder-[#444444] outline-none" />
          <button onClick={handleAdd} disabled={saving} className="w-6 h-6 rounded bg-[#FFA902] flex items-center justify-center text-black flex-shrink-0 disabled:opacity-40">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
          </button>
          <button onClick={() => setAdding(false)} className="w-6 h-6 rounded text-[#555555] hover:text-[#F0F0F0] flex-shrink-0"><X className="w-3 h-3" /></button>
        </div>
      ) : (
        <button onClick={() => setAdding(true)} className="flex items-center gap-1.5 text-[11px] text-[#555555] hover:text-[#FFA902] transition-colors pt-1">
          <Plus className="w-3 h-3" /> Adicionar material
        </button>
      )}
    </div>
  );
}

function AddLessonForm({ moduleId, onDone }: { moduleId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [lessonType, setLessonType] = useState<"video" | "text" | "file">("video");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await createFormacaoLesson(moduleId, {
      title: title.trim(),
      description: "",
      lessonType,
      videoUrl: lessonType === "video" ? url : "",
      fileUrl: lessonType === "file" ? url : "",
      content: "",
      videoDuration: 0,
      isFreePreview: false,
    });
    setSaving(false);
    onDone();
  };

  return (
    <div className="space-y-2.5 py-2">
      <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Escape") onDone(); }}
        placeholder="Título da aula *"
        className="w-full bg-[#111111] border border-[#FFA902]/30 rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none" />

      <div className="flex gap-1.5">
        {LESSON_TYPES.map((lt) => (
          <button key={lt.type} type="button" onClick={() => setLessonType(lt.type)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-all border ${
              lessonType === lt.type ? "bg-[#FFA902]/15 border-[#FFA902]/40 text-[#FFA902]" : "bg-[#111111] border-[#222222] text-[#555555] hover:text-[#888888]"
            }`}>
            {lt.icon} {lt.label}
          </button>
        ))}
      </div>

      {lessonType !== "text" && (
        <input value={url} onChange={(e) => setUrl(e.target.value)}
          placeholder={lessonType === "video" ? "https://youtube.com/watch?v=..." : "Link do arquivo"}
          className="w-full bg-[#111111] border border-[#222222] rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40" />
      )}

      <div className="flex gap-2 justify-end">
        <button onClick={onDone} className="px-3 py-1 text-xs text-[#555555] hover:text-[#888888] transition-colors">Cancelar</button>
        <button onClick={handleSave} disabled={saving || !title.trim()}
          className="flex items-center gap-1 px-3 py-1 bg-[#FFA902] text-black text-xs font-medium rounded-[6px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
          {saving && <Loader2 className="w-3 h-3 animate-spin" />} Adicionar aula
        </button>
      </div>
    </div>
  );
}
