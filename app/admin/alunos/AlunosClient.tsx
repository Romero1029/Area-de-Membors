"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Users, Search, Shield, User, Mail, Calendar, Crown, ChevronLeft, ChevronRight, BookOpen, Plus, Check, Loader2 } from "lucide-react";
import { enrollStudentInTurma } from "@/lib/actions/formacao";
import { FORMACAO_PRODUCT_ID } from "@/lib/constants";

interface UserEnrollment {
  productId: string;
  title: string;
  isActive: boolean;
  turmaId: string | null;
  turmaCode: string | null;
}

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: Date;
  enrollments: UserEnrollment[];
}

interface Turma {
  id: string;
  code: string;
  name: string;
}

interface Props {
  users: UserRow[];
  total: number;
  page: number;
  pageSize: number;
  search: string;
  turmas: Turma[];
}

export function AlunosClient({ users, total, page, pageSize, search, turmas }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(search);
  const [, startTransition] = useTransition();

  // Debounce: atualiza a URL (?q=...) 350ms depois de parar de digitar, sempre voltando pra página 1
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query === search) return;
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      startTransition(() => router.replace(`${pathname}?${params.toString()}`));
    }, 350);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const goToPage = (p: number) => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    params.set("page", String(p));
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="px-4 md:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-[8px] bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center">
            <Users className="w-4 h-4 text-[#FFA902]" />
          </div>
          <h1 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Gerenciar Alunos</h1>
        </div>
        <p className="text-sm text-[#555555] ml-11">Visualize todos os membros da plataforma e o que cada um tem acesso.</p>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 bg-[#FFA902]/6 border border-[#FFA902]/12 rounded-[12px] px-4 py-3">
          <Users className="w-3.5 h-3.5 text-[#FFA902]" />
          <span className="text-xs text-[#888888]">Total de membros na plataforma</span>
          <span className="text-lg font-bold text-[#FFA902]">{total.toLocaleString("pt-BR")}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555555]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou email..."
          className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-[10px] pl-10 pr-4 py-2.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40 transition-colors"
        />
      </div>

      {/* Table */}
      <div className="bg-[#0D0D0D] border border-[#161616] rounded-[14px] overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1.2fr_1fr_auto_1.4fr_auto] gap-4 px-5 py-3 border-b border-[#111111]">
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider">Membro</span>
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider hidden md:block">Email</span>
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider">Função</span>
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider hidden lg:block">Acesso a</span>
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider hidden md:block">Entrada</span>
        </div>

        {users.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-[#222222] mx-auto mb-3" />
            <p className="text-sm text-[#555555]">Nenhum membro encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#111111]">
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02, duration: 0.2 }}
                className="grid grid-cols-[1.2fr_1fr_auto_1.4fr_auto] gap-4 px-5 py-4 items-center hover:bg-[#111111]/50 transition-colors"
              >
                {/* Name + avatar */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-[#666666]">{user.name[0]?.toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#F0F0F0] truncate">{user.name}</p>
                    <p className="text-xs text-[#555555] truncate md:hidden">{user.email}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="hidden md:flex items-center gap-1.5 min-w-0">
                  <Mail className="w-3 h-3 text-[#444444] flex-shrink-0" />
                  <span className="text-xs text-[#666666] truncate">{user.email}</span>
                </div>

                {/* Role badge */}
                <div>
                  {user.role === "admin" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Crown className="w-2.5 h-2.5" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <User className="w-2.5 h-2.5" /> Aluno
                    </span>
                  )}
                </div>

                {/* Enrollments */}
                <div className="hidden lg:flex flex-wrap items-center gap-1.5 min-w-0">
                  {user.enrollments.map((e) => (
                    <span
                      key={e.productId}
                      title={e.isActive ? "Matrícula ativa" : "Matrícula inativa/expirada"}
                      className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full border truncate max-w-[160px] ${
                        e.isActive
                          ? "text-[#AAAAAA] bg-[#1A1A1A] border-[#2A2A2A]"
                          : "text-[#555555] bg-[#141414] border-[#1E1E1E] opacity-60"
                      }`}
                    >
                      <BookOpen className="w-2.5 h-2.5 flex-shrink-0" />
                      <span className="truncate">
                        {e.title}{e.turmaCode ? ` · Turma ${e.turmaCode}` : ""}
                      </span>
                    </span>
                  ))}
                  {!user.enrollments.some((e) => e.productId === FORMACAO_PRODUCT_ID) && (
                    <EnrollFormacaoControl userId={user.id} turmas={turmas} />
                  )}
                </div>

                {/* Join date */}
                <div className="hidden md:flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-[#444444]" />
                  <span className="text-xs text-[#555555]">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-xs text-[#333333]">
          {total === 0 ? 0 : (page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} de {total.toLocaleString("pt-BR")} membros
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#888888] hover:text-[#F0F0F0] hover:bg-[#161616] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-[#555555] min-w-[70px] text-center">
            Página {page} de {totalPages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#888888] hover:text-[#F0F0F0] hover:bg-[#161616] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EnrollFormacaoControl({ userId, turmas }: { userId: string; turmas: Turma[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [turmaId, setTurmaId] = useState(turmas[0]?.id ?? "");
  const [saving, setSaving] = useState(false);

  const handleEnroll = async () => {
    if (!turmaId) return;
    setSaving(true);
    const result = await enrollStudentInTurma(userId, turmaId);
    setSaving(false);
    if (result.ok) {
      setOpen(false);
      router.refresh();
    }
  };

  if (turmas.length === 0) {
    return <span className="text-[10px] text-[#3A3A3A]">Crie uma turma primeiro</span>;
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-[10px] font-medium text-[#555555] hover:text-[#FFA902] border border-dashed border-[#2A2A2A] hover:border-[#FFA902]/40 px-2 py-0.5 rounded-full transition-colors"
      >
        <Plus className="w-2.5 h-2.5" /> Formação
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <select
        value={turmaId}
        onChange={(e) => setTurmaId(e.target.value)}
        className="bg-[#111111] border border-[#222222] rounded-full px-2 py-0.5 text-[10px] text-[#F0F0F0] outline-none"
      >
        {turmas.map((t) => (
          <option key={t.id} value={t.id}>Turma {t.code}</option>
        ))}
      </select>
      <button onClick={handleEnroll} disabled={saving} className="w-5 h-5 rounded-full bg-[#FFA902] flex items-center justify-center text-black disabled:opacity-40">
        {saving ? <Loader2 className="w-2.5 h-2.5 animate-spin" /> : <Check className="w-2.5 h-2.5" />}
      </button>
    </span>
  );
}
