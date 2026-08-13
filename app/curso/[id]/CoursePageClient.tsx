"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Users, Star, Award, ArrowLeft, BookOpen, Pencil } from "lucide-react";
import Link from "next/link";
import { parseDriveUrl, type CourseWithModules } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { ModuleEditor } from "@/components/admin/ModuleEditor";
import { EditCourseModal } from "@/components/admin/EditCourseModal";
import { AdminBar } from "@/components/admin/AdminBar";

interface Props {
  course: CourseWithModules;
  isAdmin: boolean;
  totalLessons: number;
  tags: string[];
}

// Mock progress — future: fetch from Enrollment table
const MOCK_PROGRESS = 68;

export function CoursePageClient({ course, isAdmin, totalLessons, tags }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [showEditCourse, setShowEditCourse] = useState(false);
  const progress = MOCK_PROGRESS;
  const thumbnail = parseDriveUrl(course.thumbnail);
  const instructorAvatar = parseDriveUrl(course.instructorAvatar);
  const hasProgress = progress > 0;

  const completedLessons = Math.round((progress / 100) * totalLessons);

  return (
    <div className="min-h-screen pb-24">
      {/* Cinematic hero */}
      <div className="relative w-full h-[260px] md:h-[360px] lg:h-[440px] overflow-hidden">
        <img src={thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/60 to-[#0A0A0A]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-transparent to-transparent" />

        {/* Back */}
        <Link href="/dashboard">
          <motion.div whileHover={{ x: -2 }} className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </motion.div>
        </Link>

        {/* Admin edit button */}
        <AnimatePresence>
          {isAdmin && editMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setShowEditCourse(true)}
              className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1.5 bg-[#FFA902] text-black text-xs font-semibold rounded-full hover:bg-[#FFB832] transition-colors shadow-lg"
            >
              <Pencil className="w-3 h-3" />
              Editar curso
            </motion.button>
          )}
        </AnimatePresence>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-10 pb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-[#FFA902] uppercase tracking-[0.15em]">{course.category}</span>
              <span className="text-[#333333]">·</span>
              <Badge variant="level" label={course.level} />
              {course.isNew && <Badge variant="new" label="Novo" />}
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#F0F0F0] leading-tight tracking-tight max-w-[700px]">
              {course.title}
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mt-6 md:mt-8">
        {/* Left */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-base font-semibold text-[#F0F0F0] mb-3">Sobre o curso</h2>
            <p className="text-sm text-[#999999] leading-relaxed">{course.description}</p>
          </motion.div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag} className="text-[11px] text-[#666666] border border-[#1E1E1E] bg-[#111111] px-2.5 py-1 rounded-full hover:border-[#2E2E2E] transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Instructor */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="flex items-start gap-4 p-5 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[12px]">
            {course.instructorAvatar ? (
              <img src={instructorAvatar} alt={course.instructor} className="w-14 h-14 rounded-full bg-[#1A1A1A] flex-shrink-0 border border-[#222222]" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#1A1A1A] border border-[#222222] flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-[#444444]">{course.instructor[0]}</span>
              </div>
            )}
            <div>
              <p className="text-[10px] text-[#555555] uppercase tracking-wider mb-0.5">Instrutor</p>
              <h3 className="text-base font-semibold text-[#F0F0F0] mb-1.5">{course.instructor}</h3>
              {course.instructorBio && (
                <p className="text-sm text-[#777777] leading-relaxed">{course.instructorBio}</p>
              )}
            </div>
          </motion.div>

          {/* Modules — with admin inline editing */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-[#F0F0F0]">Conteúdo do curso</h2>
              <span className="text-xs text-[#555555]">{completedLessons}/{totalLessons} aulas</span>
            </div>

            <ModuleEditor
              modules={course.modules}
              courseId={course.id}
              editMode={isAdmin && editMode}
            />
          </motion.div>
        </div>

        {/* Right — sticky card */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="sticky top-24 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[16px] overflow-hidden"
          >
            {/* Preview */}
            <Link href={`/player/${course.id}`}>
              <div className="relative aspect-video bg-[#111111] group cursor-pointer overflow-hidden">
                <img src={thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-[#FFA902] flex items-center justify-center shadow-xl shadow-[#FFA902]/30 group-hover:scale-105 transition-transform duration-200">
                    <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                  </div>
                </div>
              </div>
            </Link>

            <div className="p-5">
              {hasProgress && (
                <div className="mb-4">
                  <ProgressBar value={progress} size="sm" showLabel animated />
                </div>
              )}

              <Link href={`/player/${course.id}`} className="block mb-3">
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full py-3 bg-[#FFA902] text-black font-bold text-sm rounded-[8px] hover:bg-[#FFB832] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-[#FFA902]/15"
                >
                  <Play className="w-4 h-4 fill-black" />
                  {hasProgress ? "Continuar assistindo" : "Assistir agora"}
                </motion.button>
              </Link>

              {!hasProgress && (
                <button className="w-full py-2.5 text-sm text-[#666666] hover:text-[#F0F0F0] font-medium rounded-[8px] border border-[#1A1A1A] hover:border-[#2A2A2A] transition-colors">
                  Salvar para depois
                </button>
              )}

              {/* Meta */}
              <div className="mt-5 pt-5 border-t border-[#161616] space-y-3">
                {[
                  { icon: Clock, label: "Duração", value: course.duration || "—" },
                  { icon: BookOpen, label: "Aulas", value: `${totalLessons} aulas` },
                  { icon: Users, label: "Alunos", value: course.students.toLocaleString("pt-BR") },
                  { icon: Star, label: "Avaliação", value: `${course.rating.toFixed(1)} / 5.0` },
                  { icon: Award, label: "Nível", value: course.level },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#555555]">
                      <item.icon className="w-3.5 h-3.5" />
                      <span className="text-xs">{item.label}</span>
                    </div>
                    <span className="text-xs font-medium text-[#AAAAAA]">{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-[#161616] flex items-center gap-2 text-xs text-[#555555]">
                <Award className="w-3.5 h-3.5 text-[#FFA902]" />
                <span>Certificado ao concluir</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Admin bar */}
      <AdminBar editMode={editMode} onToggleEditMode={() => setEditMode((e) => !e)} />

      {/* Edit course modal */}
      <AnimatePresence>
        {showEditCourse && (
          <EditCourseModal course={course} onClose={() => setShowEditCourse(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
