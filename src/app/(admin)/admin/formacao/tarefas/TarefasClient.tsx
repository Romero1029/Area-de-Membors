'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus, Check, Loader2, Trash2, Pencil, ClipboardList, Users, AlertCircle } from 'lucide-react'
import { createFormacaoTask, updateFormacaoTask, deleteFormacaoTask } from '@/lib/actions/formacao'
import type { FormacaoTaskAdmin } from '@/lib/formacao-queries'

interface ModuleOption { id: string; title: string }

interface Props {
  tasks: FormacaoTaskAdmin[]
  modules: ModuleOption[]
}

export function TarefasClient({ tasks, modules }: Props) {
  const [creating, setCreating] = useState(false)

  return (
    <div className="max-w-[820px] space-y-6">
      <Link href="/admin/formacao" className="inline-flex items-center gap-1.5 text-sm text-[#606060] hover:text-[#f0f0f0] transition-colors">
        <ArrowLeft className="w-4 h-4" /> Formação IDM
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-[#c79a3b]" />
            </div>
            <h1 className="text-xl font-bold text-[#f0f0f0] tracking-tight">Tarefas</h1>
          </div>
          <p className="text-sm text-[#606060] ml-11">{tasks.length} tarefas cadastradas</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-[#0a0a0a] bg-[#c79a3b] hover:bg-[#e8b84b] transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova tarefa
        </button>
      </div>

      {creating && <TaskForm modules={modules} onDone={() => setCreating(false)} />}

      <div className="space-y-2">
        {tasks.map((t) => <TaskRow key={t.id} task={t} modules={modules} />)}
        {tasks.length === 0 && !creating && (
          <p className="text-sm text-[#606060] text-center py-12">Nenhuma tarefa criada ainda.</p>
        )}
      </div>
    </div>
  )
}

function TaskRow({ task, modules }: { task: FormacaoTaskAdmin; modules: ModuleOption[] }) {
  const [editing, setEditing] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return }
    setDeleting(true)
    await deleteFormacaoTask(task.id)
  }

  if (editing) {
    return <TaskForm modules={modules} initial={task} onDone={() => setEditing(false)} />
  }

  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#111111] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#f0f0f0]">{task.title}</p>
          <p className="text-[11px] text-[#606060] mt-0.5">{task.moduleTitle}</p>
          {task.dueAt && (
            <p className="text-[11px] text-[#808080] mt-1">
              Prazo: {new Date(task.dueAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button onClick={() => setEditing(true)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[#606060] hover:text-[#c79a3b] hover:bg-[#c79a3b]/10 transition-colors">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${confirmDel ? 'text-red-400 bg-red-950/30' : 'text-[#606060] hover:text-red-400 hover:bg-red-950/20'}`}>
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#1e1e1e]">
        <Link href={`/admin/formacao/tarefas/${task.id}`} className="flex items-center gap-1.5 text-xs text-[#808080] hover:text-[#c79a3b] transition-colors">
          <Users className="w-3.5 h-3.5" /> {task.submissionCount} {task.submissionCount === 1 ? 'envio' : 'envios'}
        </Link>
        {task.pendingCount > 0 && (
          <Link href={`/admin/formacao/tarefas/${task.id}`} className="flex items-center gap-1.5 text-xs text-[#c79a3b]">
            <AlertCircle className="w-3.5 h-3.5" /> {task.pendingCount} aguardando revisão
          </Link>
        )}
        {!task.published && <span className="text-[10px] text-[#606060] uppercase tracking-wider">Rascunho</span>}
      </div>
    </div>
  )
}

function TaskForm({ modules, initial, onDone }: { modules: ModuleOption[]; initial?: FormacaoTaskAdmin; onDone: () => void }) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [instructions, setInstructions] = useState(initial?.instructions ?? '')
  const [rubric, setRubric] = useState(initial?.rubric ?? '')
  const [moduleId, setModuleId] = useState(initial?.moduleId ?? modules[0]?.id ?? '')
  const [dueAt, setDueAt] = useState(initial?.dueAt ? initial.dueAt.slice(0, 10) : '')
  const [published, setPublished] = useState(initial?.published ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!title.trim() || !instructions.trim() || !moduleId) return
    setSaving(true)
    setError('')
    const dueAtIso = dueAt ? new Date(`${dueAt}T23:59:59`).toISOString() : null

    const result = initial
      ? await updateFormacaoTask(initial.id, { title, instructions, rubric, due_at: dueAtIso, published })
      : await createFormacaoTask({ title, instructions, rubric, module_id: moduleId, lesson_id: null, due_at: dueAtIso, published })

    setSaving(false)
    if (!result.ok) { setError(result.error); return }
    onDone()
  }

  return (
    <div className="rounded-xl border border-[#c79a3b]/30 bg-[#111111] p-4 space-y-3">
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título da tarefa" autoFocus
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#f0f0f0] placeholder:text-[#505050] outline-none focus:border-[#c79a3b]" />

      {!initial && (
        <select value={moduleId} onChange={(e) => setModuleId(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#f0f0f0] outline-none">
          {modules.map((m) => <option key={m.id} value={m.id}>{m.title}</option>)}
        </select>
      )}

      <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} rows={3}
        placeholder="Instruções — o que o aluno deve responder"
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#f0f0f0] placeholder:text-[#505050] outline-none resize-none" />

      <textarea value={rubric} onChange={(e) => setRubric(e.target.value)} rows={3}
        placeholder="Gabarito / critério de correção (opcional — a IA usa isso como referência principal; se vazio, usa o conteúdo da aula)"
        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-3 py-2 text-sm text-[#f0f0f0] placeholder:text-[#505050] outline-none resize-none" />

      <div className="flex items-center gap-3">
        <label className="text-xs text-[#808080]">Prazo:</label>
        <input type="date" value={dueAt} onChange={(e) => setDueAt(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-2 py-1.5 text-xs text-[#f0f0f0] outline-none" />
        <label className="flex items-center gap-1.5 text-xs text-[#808080] cursor-pointer select-none ml-auto">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-[#c79a3b]" />
          Publicada (visível pro aluno)
        </label>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex justify-end gap-2">
        <button onClick={onDone} className="px-3 py-1.5 text-xs text-[#606060] hover:text-[#f0f0f0]">Cancelar</button>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#0a0a0a] bg-[#c79a3b] hover:bg-[#e8b84b] disabled:opacity-50 transition-colors">
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Salvar
        </button>
      </div>
    </div>
  )
}
