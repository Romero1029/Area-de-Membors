'use client'

import { useState, useMemo } from 'react'
import { Users, Search, CheckCircle, XCircle, BookOpen, Mail } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import type { AlunoRow } from './page'

export function AlunosClient({ initialRows }: { initialRows: AlunoRow[] }) {
  const [rows, setRows] = useState(initialRows)
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState<'todos' | 'ativos' | 'inativos'>('todos')
  const [loading, setLoading] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchBusca = !busca ||
        (r.full_name ?? '').toLowerCase().includes(busca.toLowerCase()) ||
        (r.email ?? '').toLowerCase().includes(busca.toLowerCase()) ||
        r.product_title.toLowerCase().includes(busca.toLowerCase())
      const matchFiltro = filtro === 'todos' || (filtro === 'ativos' ? r.is_active : !r.is_active)
      return matchBusca && matchFiltro
    })
  }, [rows, busca, filtro])

  async function toggleEnrollment(enrollmentId: string, current: boolean) {
    setLoading(enrollmentId)
    const supabase = createClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).from('enrollments').update({ is_active: !current }).eq('id', enrollmentId)
    setRows(rs => rs.map(r => r.enrollment_id === enrollmentId ? { ...r, is_active: !current } : r))
    setLoading(null)
  }

  const totalAtivos = rows.filter(r => r.is_active).length
  const totalAlunos = new Set(rows.map(r => r.user_id)).size

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-[#f0f0f0]">Alunos</h1>
          <p className="text-sm text-[#606060] mt-0.5">
            <span className="text-[#f0f0f0] font-semibold">{totalAlunos}</span> alunos ·{' '}
            <span className="text-[#f0f0f0] font-semibold">{totalAtivos}</span> matrículas ativas
          </p>
        </div>
      </div>

      {/* Busca + Filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#505050]" />
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, email ou curso..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111111] border border-[#1e1e1e] text-[#f0f0f0] placeholder:text-[#505050] text-sm outline-none focus:border-[#c79a3b]"
          />
        </div>
        <div className="flex gap-1 bg-[#111111] border border-[#1e1e1e] rounded-xl p-1">
          {(['todos', 'ativos', 'inativos'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filtro === f
                  ? 'bg-[#c79a3b] text-[#0a0a0a]'
                  : 'text-[#606060] hover:text-[#f0f0f0]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-[#1e1e1e] bg-[#0d0d0d] overflow-hidden">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[1fr_1fr_140px_100px] gap-4 px-4 py-2.5 border-b border-[#1e1e1e]">
          <span className="text-xs font-bold text-[#505050] uppercase tracking-wide">Aluno</span>
          <span className="text-xs font-bold text-[#505050] uppercase tracking-wide">Curso</span>
          <span className="text-xs font-bold text-[#505050] uppercase tracking-wide">Matrícula</span>
          <span className="text-xs font-bold text-[#505050] uppercase tracking-wide text-right">Status</span>
        </div>

        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-[#505050]">
            {busca ? `Nenhum resultado para "${busca}"` : 'Nenhuma matrícula encontrada.'}
          </div>
        )}

        {filtered.map((row, i) => (
          <div
            key={row.enrollment_id}
            className={`grid sm:grid-cols-[1fr_1fr_140px_100px] gap-2 sm:gap-4 px-4 py-3.5 items-center ${
              i < filtered.length - 1 ? 'border-b border-[#111111]' : ''
            } ${!row.is_active ? 'opacity-50' : ''}`}
          >
            {/* Aluno */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c79a3b]/80 to-[#e8b84b]/80 flex items-center justify-center text-xs font-bold text-[#0a0a0a] shrink-0">
                {(row.full_name ?? row.email ?? 'A').charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#f0f0f0] truncate">
                  {row.full_name ?? 'Sem nome'}
                </p>
                {row.email && (
                  <p className="text-xs text-[#606060] truncate flex items-center gap-1">
                    <Mail className="w-2.5 h-2.5 shrink-0" />{row.email}
                  </p>
                )}
              </div>
            </div>

            {/* Curso */}
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#c79a3b] shrink-0" />
              <p className="text-sm text-[#a0a0a0] truncate">{row.product_title}</p>
            </div>

            {/* Data */}
            <p className="text-xs text-[#505050]">
              {new Date(row.enrolled_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>

            {/* Ação */}
            <div className="flex items-center justify-end gap-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                row.is_active
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {row.is_active ? 'Ativo' : 'Inativo'}
              </span>
              <button
                onClick={() => toggleEnrollment(row.enrollment_id, row.is_active)}
                disabled={loading === row.enrollment_id}
                title={row.is_active ? 'Revogar acesso' : 'Reativar acesso'}
                className="p-1.5 rounded-lg text-[#606060] hover:text-[#f0f0f0] hover:bg-[#1a1a1a] transition-colors disabled:opacity-50"
              >
                {row.is_active
                  ? <XCircle className="w-4 h-4" />
                  : <CheckCircle className="w-4 h-4 text-green-400" />
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-[#505050] text-center">
          Mostrando {filtered.length} de {rows.length} matrículas
        </p>
      )}
    </div>
  )
}
