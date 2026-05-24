"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, BookOpen, PlusCircle, X } from "lucide-react";
import { CourseCard } from "@/components/ui/CourseCard";
import { AdminBar } from "@/components/admin/AdminBar";
import { type CourseWithModules } from "@/lib/types";

interface Props {
  courses: CourseWithModules[];
  isAdmin: boolean;
}

const LEVELS = ["Todos", "Iniciante", "Intermediário", "Avançado"];

export function CursosClient({ courses, isAdmin }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("Todos");
  const [category, setCategory] = useState("Todas");

  const categories = useMemo(() => {
    const cats = Array.from(new Set(courses.map((c) => c.category)));
    return ["Todas", ...cats];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchSearch =
        !search ||
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.instructor.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());
      const matchLevel = level === "Todos" || c.level === level;
      const matchCat = category === "Todas" || c.category === category;
      return matchSearch && matchLevel && matchCat;
    });
  }, [courses, search, level, category]);

  const hasFilters = search || level !== "Todos" || category !== "Todas";

  const clearFilters = () => {
    setSearch("");
    setLevel("Todos");
    setCategory("Todas");
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Explore as jornadas</h1>
        <p className="text-sm text-[#555555] mt-0.5">
          {courses.length === 0
            ? "Nenhum curso cadastrado ainda"
            : `${filtered.length} de ${courses.length} curso${courses.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar cursos, instrutores..."
            className="w-full bg-[#0D0D0D] border border-[#1A1A1A] rounded-[8px] pl-9 pr-4 py-2.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#2A2A2A] transition-colors"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-[#555555] hover:text-[#888888]" />
            </button>
          )}
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#444444] flex-shrink-0" />
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              className={`px-3 py-2 text-xs font-medium rounded-[6px] whitespace-nowrap flex-shrink-0 transition-colors ${
                level === l
                  ? "bg-[#FFA902]/15 text-[#FFA902] border border-[#FFA902]/30"
                  : "bg-[#0D0D0D] text-[#666666] border border-[#1A1A1A] hover:text-[#AAAAAA] hover:border-[#2A2A2A]"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Category pills */}
      {categories.length > 2 && (
        <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap flex-shrink-0 transition-colors ${
                category === cat
                  ? "bg-[#1A1A1A] text-[#F0F0F0] border border-[#333333]"
                  : "text-[#555555] border border-[#1A1A1A] hover:text-[#888888] hover:border-[#2A2A2A]"
              }`}
            >
              {cat}
            </button>
          ))}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-xs text-[#FFA902] border border-[#FFA902]/30 rounded-full whitespace-nowrap flex-shrink-0 hover:bg-[#FFA902]/5 transition-colors"
            >
              Limpar filtros
            </button>
          )}
        </div>
      )}

      {/* Empty state */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-[#FFA902]" />
          </div>
          <h2 className="text-lg font-bold text-[#F0F0F0] mb-2">Nenhum curso ainda</h2>
          <p className="text-sm text-[#555555] max-w-[280px] leading-relaxed mb-6">
            {isAdmin
              ? "Adicione seu primeiro curso pelo painel admin."
              : "Nenhum curso disponível no momento."}
          </p>
          {isAdmin && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FFA902] text-black text-sm font-bold rounded-[8px] hover:bg-[#FFB832] transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Adicionar curso
            </button>
          )}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-[#555555] mb-3">Nenhum curso encontrado para "{search}"</p>
          <button onClick={clearFilters} className="text-xs text-[#FFA902] hover:underline">
            Limpar filtros
          </button>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {filtered.map((course) => (
            <motion.div
              key={course.id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } }}
            >
              <CourseCard course={course} isAdmin={isAdmin} editMode={editMode} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <AdminBar editMode={editMode} onToggleEditMode={() => setEditMode((e) => !e)} />
    </div>
  );
}
