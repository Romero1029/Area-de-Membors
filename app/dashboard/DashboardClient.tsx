"use client";

import { useState } from "react";
import { Sparkles, BookOpen, Award, TrendingUp, PlusCircle, Star, Play, Clock, Users } from "lucide-react";
import Link from "next/link";
import { CourseWithModules } from "@/lib/types";
import { HeroBanner } from "@/components/ui/HeroBanner";
import { AdminBar } from "@/components/admin/AdminBar";
import { parseDriveUrl } from "@/lib/types";

interface Props {
  featured: CourseWithModules | null;
  inProgress: CourseWithModules[];
  newCourses: CourseWithModules[];
  popular: CourseWithModules[];
  allCourses: CourseWithModules[];
  isAdmin: boolean;
}

export function DashboardClient({ featured, inProgress, newCourses, popular, allCourses, isAdmin }: Props) {
  const [editMode, setEditMode] = useState(false);

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (allCourses.length === 0 && !featured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-6 text-center">
        <div className="w-20 h-20 rounded-3xl bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center mb-6">
          <Sparkles className="w-9 h-9 text-[#FFA902]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          {isAdmin ? "Tudo pronto para começar" : "Sua jornada começa aqui"}
        </h2>
        <p className="text-[#888888] max-w-[360px] leading-relaxed mb-8 text-sm">
          {isAdmin
            ? "Crie o primeiro curso e comece a transformar vidas através do autoconhecimento, Psicanálise e PNL."
            : "Em breve novos conteúdos de Autoconhecimento, Psicanálise, Numerologia e Espiritualidade estarão disponíveis para você."}
        </p>
        {isAdmin && (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#FFA902] text-black text-sm font-bold rounded-xl hover:bg-[#FFB832] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Criar primeiro curso
          </button>
        )}
        <AdminBar editMode={editMode} onToggleEditMode={() => setEditMode((e) => !e)} />
      </div>
    );
  }

  // ── Stats ────────────────────────────────────────────────────────────────────
  const stats = [
    { icon: BookOpen, label: "Jornadas", value: allCourses.length, color: "text-[#FFA902]", bg: "bg-[#FFA902]/8", border: "border-[#FFA902]/15" },
    { icon: TrendingUp, label: "Em andamento", value: inProgress.length, color: "text-violet-400", bg: "bg-violet-500/8", border: "border-violet-500/15" },
    { icon: Sparkles, label: "Novidades", value: newCourses.length, color: "text-amber-300", bg: "bg-amber-400/8", border: "border-amber-400/15" },
    { icon: Award, label: "Alunas", value: allCourses.reduce((a, c) => a + c.students, 0).toLocaleString("pt-BR"), color: "text-rose-400", bg: "bg-rose-500/8", border: "border-rose-500/15" },
  ];

  return (
    <div className="pb-24">
      {/* Hero banner */}
      {featured && (
        <div className="pt-6 pb-8">
          <HeroBanner course={featured} isAdmin={isAdmin} editMode={editMode} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 md:px-6 lg:px-8 mb-10 mt-6">
        {stats.map((s) => (
          <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <s.icon className={`w-4 h-4 ${s.color}`} />
              <span className="text-xs text-[#666666]">{s.label}</span>
            </div>
            <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Em andamento */}
      {inProgress.length > 0 && (
        <Section title="Continuar jornada" subtitle="Retome de onde parou">
          <CourseRow courses={inProgress} isAdmin={isAdmin} editMode={editMode} showProgress />
        </Section>
      )}

      {/* Novos */}
      {newCourses.length > 0 && (
        <Section title="Novos conteúdos" subtitle="Acabaram de chegar na plataforma">
          <CourseRow courses={newCourses} isAdmin={isAdmin} editMode={editMode} />
        </Section>
      )}

      {/* Populares */}
      {popular.length > 0 && (
        <Section title="Mais acessados" subtitle="Os favoritos da nossa comunidade">
          <CourseRow courses={popular} isAdmin={isAdmin} editMode={editMode} />
        </Section>
      )}

      {/* Grid todos */}
      <div className="px-4 md:px-6 lg:px-8">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">Todas as jornadas</h2>
          <p className="text-sm text-[#666666] mt-0.5">{allCourses.length} {allCourses.length === 1 ? "curso disponível" : "cursos disponíveis"}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {allCourses.map((c) => (
            <CourseGridCard key={c.id} course={c} isAdmin={isAdmin} editMode={editMode} />
          ))}
        </div>
      </div>

      <AdminBar editMode={editMode} onToggleEditMode={() => setEditMode((e) => !e)} />
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────────────────────

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-end justify-between px-4 md:px-6 lg:px-8 mb-4">
        <div>
          <h2 className="text-base font-bold text-white">{title}</h2>
          <p className="text-xs text-[#555555] mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function CourseRow({ courses, isAdmin, editMode, showProgress = false }: { courses: CourseWithModules[]; isAdmin: boolean; editMode: boolean; showProgress?: boolean }) {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 md:px-6 lg:px-8 pb-2 scrollbar-hide">
      {courses.map((c) => (
        <MiniCard key={c.id} course={c} showProgress={showProgress} />
      ))}
    </div>
  );
}

function MiniCard({ course, showProgress }: { course: CourseWithModules; showProgress?: boolean }) {
  const thumb = parseDriveUrl(course.thumbnail);
  return (
    <Link href={`/curso/${course.id}`} className="flex-shrink-0 w-[260px] group">
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden hover:border-[#FFA902]/30 transition-colors">
        <div className="relative h-[146px] bg-[#1A1A1A]">
          {thumb && <img src={thumb} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-10 h-10 rounded-full bg-[#FFA902] flex items-center justify-center">
              <Play className="w-4 h-4 fill-black text-black ml-0.5" />
            </div>
          </div>
          {course.isNew && (
            <span className="absolute top-2 left-2 text-[10px] font-bold text-black bg-[#FFA902] px-2 py-0.5 rounded-full">NOVO</span>
          )}
        </div>
        {showProgress && (
          <div className="h-0.5 bg-[#1A1A1A]"><div className="h-full bg-[#FFA902] w-1/3" /></div>
        )}
        <div className="p-3">
          <p className="text-xs text-[#FFA902] font-semibold mb-1">{course.category}</p>
          <h3 className="text-sm font-semibold text-white line-clamp-2 leading-snug mb-2">{course.title}</h3>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#555555] flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration || "—"}</span>
            <span className="text-[11px] text-[#FFA902] font-semibold flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#FFA902]" />{course.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function CourseGridCard({ course, isAdmin, editMode }: { course: CourseWithModules; isAdmin: boolean; editMode: boolean }) {
  const thumb = parseDriveUrl(course.thumbnail);
  return (
    <Link href={`/curso/${course.id}`} className="group">
      <div className="bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden hover:border-[#FFA902]/30 hover:shadow-xl hover:shadow-black/40 transition-all duration-200">
        <div className="relative aspect-video bg-[#1A1A1A]">
          {thumb && <img src={thumb} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-12 h-12 rounded-full bg-[#FFA902] flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 fill-black text-black ml-0.5" />
            </div>
          </div>
          {course.isNew && (
            <span className="absolute top-3 left-3 text-[10px] font-bold text-black bg-[#FFA902] px-2.5 py-1 rounded-full">NOVO</span>
          )}
          <span className="absolute top-3 right-3 text-[10px] font-semibold text-[#CCCCCC] bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
            {course.level}
          </span>
        </div>
        <div className="p-4">
          <p className="text-[11px] font-bold text-[#FFA902] uppercase tracking-wide mb-1.5">{course.category}</p>
          <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug mb-1.5">{course.title}</h3>
          <p className="text-xs text-[#555555] line-clamp-2 mb-3 leading-relaxed">{course.description}</p>
          <div className="flex items-center gap-3 pt-3 border-t border-[#1A1A1A] text-[#444444]">
            <span className="text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" />{course.duration || "—"}</span>
            <span className="text-[11px] flex items-center gap-1"><Users className="w-3 h-3" />{course.students.toLocaleString("pt-BR")}</span>
            <span className="ml-auto text-[11px] text-[#FFA902] font-bold flex items-center gap-0.5"><Star className="w-3 h-3 fill-[#FFA902]" />{course.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
