"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Shield, User, Mail, Calendar, Crown } from "lucide-react";

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: Date;
}

interface Props { users: UserRow[]; }

export function AlunosClient({ users }: Props) {
  const [query, setQuery] = useState("");

  const filtered = query.length > 1
    ? users.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
      )
    : users;

  const admins = users.filter((u) => u.role === "ADMIN").length;
  const students = users.filter((u) => u.role !== "ADMIN").length;

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
        <p className="text-sm text-[#555555] ml-11">Visualize e gerencie todos os membros da plataforma.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#FFA902]/6 border border-[#FFA902]/12 rounded-[12px] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-3.5 h-3.5 text-[#FFA902]" />
            <span className="text-xs text-[#888888]">Total de membros</span>
          </div>
          <span className="text-2xl font-bold text-[#FFA902]">{users.length}</span>
        </div>
        <div className="bg-emerald-500/6 border border-emerald-500/12 rounded-[12px] p-4">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-[#888888]">Alunos</span>
          </div>
          <span className="text-2xl font-bold text-emerald-400">{students}</span>
        </div>
        <div className="bg-violet-500/6 border border-violet-500/12 rounded-[12px] p-4">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-xs text-[#888888]">Admins</span>
          </div>
          <span className="text-2xl font-bold text-violet-400">{admins}</span>
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
        <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-3 border-b border-[#111111]">
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider">Membro</span>
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider hidden md:block">Email</span>
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider">Função</span>
          <span className="text-[11px] font-semibold text-[#555555] uppercase tracking-wider hidden md:block">Entrada</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="w-10 h-10 text-[#222222] mx-auto mb-3" />
            <p className="text-sm text-[#555555]">Nenhum membro encontrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#111111]">
            {filtered.map((user, i) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.25 }}
                className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 px-5 py-4 items-center hover:bg-[#111111]/50 transition-colors"
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
                  {user.role === "ADMIN" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Crown className="w-2.5 h-2.5" /> Admin
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <User className="w-2.5 h-2.5" /> Aluno
                    </span>
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

      <p className="text-xs text-[#333333] text-center mt-4">
        {filtered.length} {filtered.length === 1 ? "membro" : "membros"} exibidos
      </p>
    </div>
  );
}
