"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, BookOpen, Star, Users, Clock, Pencil } from "lucide-react";
import Link from "next/link";
import { parseTags, parseDriveUrl, getTotalLessons, type CourseWithModules } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { Badge } from "./Badge";
import { EditCourseModal } from "@/components/admin/EditCourseModal";

interface HeroBannerProps {
  course: CourseWithModules;
  isAdmin?: boolean;
  editMode?: boolean;
  progress?: number;
}

export function HeroBanner({ course, isAdmin = false, editMode = false, progress = 68 }: HeroBannerProps) {
  const [showEdit, setShowEdit] = useState(false);
  const hasProgress = progress > 0;
  const totalLessons = getTotalLessons(course);
  const tags = parseTags(course.tags);
  const thumbnail = parseDriveUrl(course.thumbnail);

  return (
    <>
      <div
        className="relative w-full overflow-hidden rounded-[12px] md:rounded-[16px] mx-4 md:mx-6 lg:mx-8 h-[320px] md:h-[440px] lg:h-[520px]"
        style={{ width: "calc(100% - 2rem)" }}
      >
        {/* BG image */}
        <img
          src={thumbnail}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />

        {/* Admin edit button */}
        <AnimatePresence>
          {isAdmin && editMode && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setShowEdit(true)}
              className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-[#FFA902] text-black text-xs font-semibold rounded-full hover:bg-[#FFB832] transition-colors shadow-lg"
            >
              <Pencil className="w-3 h-3" />
              Editar destaque
            </motion.button>
          )}
        </AnimatePresence>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-5 md:p-8 lg:p-12 max-w-[640px]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-bold text-[#FFA902] uppercase tracking-[0.15em]">EM DESTAQUE</span>
              <span className="text-[#2A2A2A]">·</span>
              <span className="text-[10px] text-[#666666] uppercase tracking-wider">{course.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#F0F0F0] leading-[1.15] mb-3 tracking-tight">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-sm text-[#999999] leading-relaxed mb-5 max-w-[480px] line-clamp-2">
              {course.description}
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-4 mb-5 flex-wrap">
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#FFA902] fill-[#FFA902]" />
                <span className="text-sm font-bold text-[#F0F0F0]">{course.rating.toFixed(1)}</span>
              </div>
              <div className="w-px h-3.5 bg-[#2A2A2A]" />
              <div className="flex items-center gap-1.5 text-[#777777]">
                <Users className="w-3.5 h-3.5" />
                <span className="text-sm">{course.students.toLocaleString("pt-BR")} alunos</span>
              </div>
              <div className="w-px h-3.5 bg-[#2A2A2A]" />
              <div className="flex items-center gap-1.5 text-[#777777]">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-sm">{course.duration || `${totalLessons} aulas`}</span>
              </div>
              <div className="w-px h-3.5 bg-[#2A2A2A]" />
              <div className="flex items-center gap-1.5 text-[#777777]">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-sm">{totalLessons} aulas</span>
              </div>
            </div>

            {/* Progress */}
            {hasProgress && (
              <div className="mb-5 max-w-[300px]">
                <ProgressBar value={progress} size="sm" showLabel />
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="text-[10px] text-[#666666] bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="flex items-center gap-3">
              <Link href={`/player/${course.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#FFA902] text-black font-bold text-sm rounded-[8px] hover:bg-[#FFB832] transition-colors shadow-lg shadow-[#FFA902]/20"
                >
                  <Play className="w-4 h-4 fill-black" />
                  {hasProgress ? "Continuar" : "Começar agora"}
                </motion.button>
              </Link>
              <Link href={`/curso/${course.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-white/8 backdrop-blur-sm text-[#F0F0F0] font-semibold text-sm rounded-[8px] border border-white/10 hover:bg-white/12 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Ver curso
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Instructor badge */}
        {course.instructorAvatar && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="absolute top-5 right-5 flex items-center gap-2.5 bg-black/50 backdrop-blur-md border border-white/8 rounded-full pl-1 pr-4 py-1"
          >
            <img src={course.instructorAvatar} alt={course.instructor} className="w-7 h-7 rounded-full" />
            <div>
              <p className="text-[9px] text-[#666666] uppercase tracking-wider">Instrutor</p>
              <p className="text-xs font-semibold text-[#F0F0F0]">{course.instructor}</p>
            </div>
          </motion.div>
        )}

        {/* Level badge */}
        <div className="absolute bottom-5 right-5">
          <Badge variant="level" label={course.level} />
        </div>
      </div>

      <AnimatePresence>
        {showEdit && (
          <EditCourseModal
            course={course}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
