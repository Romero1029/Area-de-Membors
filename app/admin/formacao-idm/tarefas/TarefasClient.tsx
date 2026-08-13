"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus, Check, Loader2, Trash2, Pencil, ClipboardList, Users, AlertCircle,
} from "lucide-react";
import { createTask, updateTask, deleteTask } from "@/lib/actions/formacao";
import type { FormacaoTask } from "@/lib/queries";

interface ModuleOption { id: string; title: string }

interface Props {
  tasks: FormacaoTask[];
  modules: ModuleOption[];
}

export function TarefasClient({ tasks, modules }: Props) {
  const [creating, setCreating] = useState(false);

  return (
    <div className="px-4 md:px-8 py-8 max-w-[820px]">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-[8px] bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-[#FFA902]" />
            </div>
            <h1 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Tarefas</h1>
          </div>
          <p className="text-sm text-[#555555] ml-11">{tasks.length} tarefas cadastradas</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#FFA902] text-black text-sm font-semibold rounded-[8px] hover:bg-[#FFB832] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova tarefa
        </button>
      </div>

      {creating && <TaskForm modules={modules} onDone={() => setCreating(false)} />}

      <div className="space-y-2 mt-4">
        {tasks.map((t) => (
          <TaskRow key={t.id} task={t} modules={modules} />
        ))}
        {tasks.length === 0 && !creating && (
          <p className="text-sm text-[#555555] text-center py-12">Nenhuma tarefa criada ainda.</p>
        )}
      </div>
    </div>
  );
}

function TaskRow({ task, modules }: { task: FormacaoTask; modules: ModuleOption[] }) {
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setDeleting(true);
    await deleteTask(task.id);
  };

  if (editing) {
    return (
      <TaskForm
        modules={modules}
        initial={task}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <div className="bg-[#111111] border border-[#1E1E1E] rounded-[12px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#F0F0F0]">{task.title}</p>
          <p className="text-[11px] text-[#555555] mt-0.5">{task.moduleTitle}</p>
          {task.dueAt && (
            <p className="text-[11px] text-[#666666] mt-1">
              Prazo: {new Date(task.dueAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
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

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1A1A1A]">
        <Link href={`/admin/formacao-idm/tarefas/${task.id}`}
          className="flex items-center gap-1.5 text-xs text-[#888888] hover:text-[#FFA902] transition-colors">
          <Users className="w-3.5 h-3.5" /> {task.submissionCount} {task.submissionCount === 1 ? "envio" : "envios"}
        </Link>
        {task.pendingCount > 0 && (
          <Link href={`/admin/formacao-idm/tarefas/${task.id}`}
            className="flex items-center gap-1.5 text-xs text-[#FFA902]">
            <AlertCircle className="w-3.5 h-3.5" /> {task.pendingCount} aguardando revisão
          </Link>
        )}
        {!task.published && <span className="text-[10px] text-[#555555] uppercase tracking-wider">Rascunho</span>}
      </div>
    </div>
  );
}

function TaskForm({
  modules, initial, onDone,
}: {
  modules: ModuleOption[];
  initial?: FormacaoTask;
  onDone: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [instructions, setInstructions] = useState(initial?.instructions ?? "");
  const [rubric, setRubric] = useState(initial?.rubric ?? "");
  const [moduleId, setModuleId] = useState(initial?.moduleId ?? modules[0]?.id ?? "");
  const [dueAt, setDueAt] = useState(initial?.dueAt ? initial.dueAt.slice(0, 10) : "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!title.trim() || !instructions.trim() || !moduleId) return;
    setSaving(true);
    setError("");
    const dueAtIso = dueAt ? new Date(`${dueAt}T23:59:59`).toISOString() : null;

    const result = initial
      ? await updateTask(initial.id, { title, instructions, rubric, dueAt: dueAtIso, published })
      : await createTask({ title, instructions, rubric, moduleId, lessonId: null, dueAt: dueAtIso, published });

    setSaving(false);
    if (!result.ok) { setError(result.error); return; }
    onDone();
  };

  return (
    <div className="bg-[#111111] border border-[#FFA902]/30 rounded-[12px] p-4 space-y-3 mb-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da tarefa" autoFocus
        className="w-full bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40" />

      {!initial && (
        <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}
          className="w-full bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] outline-none">
          {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      )}

      <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3}
        placeholder="Instruções — o que o aluno deve responder"
        className="w-full bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none resize-none" />

      <textarea value={rubric} onChange={(e) => setRubric(e.target.value)} rows={3}
        placeholder="Gabarito / critério de correção (opcional — a IA usa isso como referência principal; se vazio, usa o conteúdo da aula)"
        className="w-full bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none resize-none" />

      <div className="flex items-center gap-3">
        <label className="text-xs text-[#888888]">Prazo:</label>
        <input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)}
          className="bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-2 py-1.5 text-xs text-[#F0F0F0] outline-none" />
        <label className="flex items-center gap-1.5 text-xs text-[#888888] cursor-pointer select-none ml-auto">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-[#FFA902]" />
          Publicada (visível pro aluno)
        </label>
      </div>

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
