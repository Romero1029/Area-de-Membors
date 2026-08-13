"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Zap, Clock, Award, BookOpen, Calendar, Download, ExternalLink,
  TrendingUp, Target, Shield, GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { type CourseWithModules } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { AdminBar } from "@/components/admin/AdminBar";
import type { MyGrade } from "@/lib/queries";

interface SessionUser { name?: string | null; email?: string | null; image?: string | null; role?: string; }
interface Props { user: SessionUser; courses: CourseWithModules[]; isAdmin: boolean; grades: MyGrade[]; }

const WEEK = [
  { day: "Seg", h: 1.5 }, { day: "Ter", h: 2.0 }, { day: "Qua", h: 0.5 },
  { day: "Qui", h: 3.0 }, { day: "Sex", h: 1.0 }, { day: "Sáb", h: 2.5 }, { day: "Dom", h: 0 },
];
const MAX_H = Math.max(...WEEK.map((d) => d.h));

const BADGES = [
  { id: "b1", title: "Primeiro Despertar", icon: "🌅", desc: "Completou a primeira aula", earned: true },
  { id: "b2", title: "Semana Consciente", icon: "🔥", desc: "7 dias consecutivos de estudo", earned: true },
  { id: "b3", title: "Mente Aberta", icon: "✨", desc: "5 horas de aprendizado em um dia", earned: true },
  { id: "b4", title: "Mestre Interior", icon: "💎", desc: "Complete 5 cursos", earned: false },
  { id: "b5", title: "Guardião do Saber", icon: "🏆", desc: "Top 10% da plataforma", earned: false },
  { id: "b6", title: "Guia de Jornada", icon: "🌙", desc: "Inspire outros membros", earned: false },
];

export function PerfilClient({ user, courses, isAdmin, grades }: Props) {
  const [tab, setTab] = useState<"progresso" | "notas" | "conquistas" | "certificados">("progresso");
  const [editMode, setEditMode] = useState(false);

  const inProgress = courses.slice(0, 3);
  const earned = BADGES.filter((b) => b.earned);
  const locked = BADGES.filter((b) => !b.earned);

  const stats = [
    { icon: Clock, label: "Horas de jornada", value: courses.length > 0 ? "—" : "0", suffix: "h", color: "text-purple-400", bg: "bg-purple-500/8", border: "border-purple-500/15" },
    { icon: Zap, label: "Streak atual", value: "0", suffix: "dias", color: "text-[#FFA902]", bg: "bg-[#FFA902]/8", border: "border-[#FFA902]/15" },
    { icon: BookOpen, label: "Cursos em andamento", value: String(courses.length), suffix: "", color: "text-emerald-400", bg: "bg-emerald-500/8", border: "border-emerald-500/15" },
    { icon: Award, label: "Certificados", value: "0", suffix: "", color: "text-blue-400", bg: "bg-blue-500/8", border: "border-blue-500/15" },
  ];

  const mockCerts: { id: string; title: string; issued: string; cred: string }[] = [];

  return (
    <div className="min-h-screen pb-24">
      {/* Cover */}
      <div className="relative">
        <div className="h-44 bg-gradient-to-br from-[#FFA902]/15 via-[#FF6B02]/8 to-purple-500/10 border-b border-[#111111]" />

        <div className="px-8 pb-6">
          {/* Avatar row */}
          <div className="flex items-end gap-5 -mt-14 mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-[#0A0A0A] bg-[#111111] flex items-center justify-center overflow-hidden shadow-2xl">
                {user.image ? (
                  <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-[#444444]">{(user.name ?? "U")[0]}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#FFA902] flex items-center justify-center border-2 border-[#0A0A0A]">
                {isAdmin ? <Shield className="w-3.5 h-3.5 text-black" /> : <Zap className="w-3.5 h-3.5 text-black" />}
              </div>
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#F0F0F0] tracking-tight">{user.name}</h1>
                {isAdmin && (
                  <span className="text-[10px] font-bold text-[#FFA902] bg-[#FFA902]/10 border border-[#FFA902]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">Admin</span>
                )}
              </div>
              <p className="text-sm text-[#555555] mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-xs text-[#FFA902] flex items-center gap-1">
                  <Zap className="w-3 h-3" /> 12 dias de streak
                </span>
                <span className="text-[#222222]">·</span>
                <span className="text-xs text-[#555555] flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Membro do Instituto
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {stats.map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-[12px] p-4`}>
                <div className="flex items-center gap-2 mb-2">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-[#666666]">{s.label}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
                  {s.suffix && <span className="text-xs text-[#666666]">{s.suffix}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Weekly chart */}
          <div className="bg-[#0D0D0D] border border-[#161616] rounded-[12px] p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#F0F0F0]">Atividade semanal</h3>
                <p className="text-xs text-[#555555] mt-0.5">Horas estudadas por dia</p>
              </div>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14% esta semana
              </span>
            </div>
            <div className="flex items-end gap-2 h-16">
              {WEEK.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full relative" style={{ height: 52 }}>
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: `${(d.h / MAX_H) * 100}%` }}
                      transition={{ duration: 0.5, delay: 0.05 }}
                      className={`absolute bottom-0 left-0 right-0 rounded-t-[3px] ${d.h === 0 ? "bg-[#1A1A1A]" : d.day === "Qui" ? "bg-[#FFA902]" : "bg-[#2A2A2A]"}`}
                    />
                  </div>
                  <span className="text-[10px] text-[#444444]">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 bg-[#0D0D0D] border border-[#161616] rounded-[10px] p-1 w-fit mb-6">
            {(["progresso", "notas", "conquistas", "certificados"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 text-xs font-medium rounded-[8px] transition-all duration-150 ${
                  tab === t ? "bg-[#FFA902] text-black shadow-sm" : "text-[#555555] hover:text-[#888888]"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "progresso" && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-[#F0F0F0] mb-3">Em andamento</h3>
              {inProgress.length === 0 ? (
                <div className="text-center py-12">
                  <Target className="w-10 h-10 text-[#222222] mx-auto mb-3" />
                  <p className="text-sm text-[#555555]">Nenhum curso em andamento.</p>
                  <Link href="/dashboard"><button className="mt-3 text-xs text-[#FFA902] hover:underline">Explorar cursos</button></Link>
                </div>
              ) : inProgress.map((c) => (
                <Link key={c.id} href={`/curso/${c.id}`}>
                  <div className="flex items-center gap-4 p-4 bg-[#0D0D0D] border border-[#161616] rounded-[12px] hover:border-[#222222] transition-colors cursor-pointer">
                    <img src={c.thumbnail} alt={c.title} className="w-16 h-11 object-cover rounded-[8px] flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#F0F0F0] truncate">{c.title}</p>
                      <p className="text-xs text-[#555555] mb-2">{c.instructor}</p>
                      <ProgressBar value={68} size="xs" />
                      <p className="text-[10px] text-[#555555] mt-1">68% concluído</p>
                    </div>
                    <Badge variant="inProgress" label="68%" />
                  </div>
                </Link>
              ))}
            </div>
          )}

          {tab === "notas" && (
            <div className="space-y-3">
              {grades.length === 0 ? (
                <div className="text-center py-12">
                  <GraduationCap className="w-10 h-10 text-[#222222] mx-auto mb-3" />
                  <p className="text-sm text-[#555555]">Nenhuma nota publicada ainda.</p>
                </div>
              ) : grades.map((g) => (
                <div key={g.taskId} className="p-4 bg-[#0D0D0D] border border-[#161616] rounded-[12px]">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#F0F0F0] truncate">{g.taskTitle}</p>
                      <p className="text-xs text-[#555555]">{g.moduleTitle}</p>
                    </div>
                    <span className="text-lg font-bold text-[#FFA902] flex-shrink-0">{g.finalScore.toFixed(1)}</span>
                  </div>
                  {g.finalFeedback && (
                    <p className="text-xs text-[#888888] leading-relaxed mt-2 whitespace-pre-wrap">{g.finalFeedback}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {tab === "conquistas" && (
            <div>
              <h3 className="text-sm font-semibold text-[#F0F0F0] mb-4">Desbloqueadas ({earned.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                {earned.map((b) => (
                  <motion.div key={b.id} whileHover={{ y: -2 }}
                    className="bg-[#0D0D0D] border border-[#161616] rounded-[12px] p-4 text-center hover:border-[#FFA902]/20 transition-colors">
                    <div className="text-3xl mb-2">{b.icon}</div>
                    <h4 className="text-xs font-semibold text-[#F0F0F0] mb-1">{b.title}</h4>
                    <p className="text-[10px] text-[#555555] leading-relaxed">{b.desc}</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <Award className="w-3 h-3 text-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Conquistado</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <h3 className="text-sm font-semibold text-[#333333] mb-4">Bloqueadas ({locked.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {locked.map((b) => (
                  <div key={b.id} className="bg-[#090909] border border-[#111111] rounded-[12px] p-4 text-center opacity-40">
                    <div className="text-3xl mb-2 grayscale">{b.icon}</div>
                    <h4 className="text-xs font-semibold text-[#555555] mb-1">{b.title}</h4>
                    <p className="text-[10px] text-[#444444] leading-relaxed">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "certificados" && (
            <div className="space-y-3">
              {mockCerts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-14 h-14 rounded-2xl bg-[#FFA902]/8 border border-[#FFA902]/15 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-7 h-7 text-[#FFA902]/50" />
                  </div>
                  <p className="text-sm font-medium text-[#555555]">Nenhum certificado ainda</p>
                  <p className="text-xs text-[#333333] mt-1">Conclua um curso para receber seu certificado</p>
                </div>
              ) : mockCerts.map((cert) => (
                <div key={cert.id} className="flex items-center gap-5 p-5 bg-[#0D0D0D] border border-[#161616] rounded-[12px] hover:border-[#222222] transition-colors">
                  <div className="w-14 h-14 rounded-[10px] bg-[#FFA902]/8 border border-[#FFA902]/15 flex items-center justify-center flex-shrink-0">
                    <Award className="w-7 h-7 text-[#FFA902]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-[#F0F0F0] truncate">{cert.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-[#555555]">
                        {new Date(cert.issued).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-[#222222]">·</span>
                      <span className="text-[10px] text-[#444444] font-mono">{cert.cred}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#666666] hover:text-[#F0F0F0] border border-[#1A1A1A] hover:border-[#2A2A2A] rounded-[6px] transition-colors">
                      <Download className="w-3.5 h-3.5" /> Baixar
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#FFA902] border border-[#FFA902]/15 bg-[#FFA902]/6 hover:bg-[#FFA902]/12 rounded-[6px] transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" /> Verificar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AdminBar editMode={editMode} onToggleEditMode={() => setEditMode((e) => !e)} />
    </div>
  );
}
