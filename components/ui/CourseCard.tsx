"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Users, Star, Pencil } from "lucide-react";
import Link from "next/link";
import { parseTags, parseDriveUrl, getTotalLessons, type CourseWithModules } from "@/lib/types";
import { ProgressBar } from "./ProgressBar";
import { Badge } from "./Badge";
import { EditCourseModal } from "@/components/admin/EditCourseModal";

// Category → accent color map
const CATEGORY_COLORS: Record<string, { text: string; bg: string }> = {
  "Autoconhecimento":     { text: "text-amber-400",   bg: "bg-amber-500/10" },
  "Psicanálise":          { text: "text-violet-400",  bg: "bg-violet-500/10" },
  "Numerologia":          { text: "text-yellow-400",  bg: "bg-yellow-500/10" },
  "PNL":                  { text: "text-blue-400",    bg: "bg-blue-500/10" },
  "Espiritualidade":      { text: "text-purple-400",  bg: "bg-purple-500/10" },
  "Meditação":            { text: "text-cyan-400",    bg: "bg-cyan-500/10" },
  "Terapia":              { text: "text-rose-400",    bg: "bg-rose-500/10" },
  "Desenvolvimento Pessoal": { text: "text-emerald-400", bg: "bg-emerald-500/10" },
  "Outro":                { text: "text-[#888888]",   bg: "bg-[#222222]" },
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? { text: "text-[#888888]", bg: "bg-[#222222]" };
}

interface CourseCardProps {
  course: CourseWithModules;
  variant?: "default" | "compact";
  showProgress?: boolean;
  isAdmin?: boolean;
  editMode?: boolean;
  progress?: number;
}

export function CourseCard({
  course,
  variant = "default",
  showProgress = false,
  isAdmin = false,
  editMode = false,
  progress = 0,
}: CourseCardProps) {
  const [showEdit, setShowEdit] = useState(false);
  const catColor = getCategoryColor(course.category);
  const totalLessons = getTotalLessons(course);
  const isCompleted = progress === 100;
  const hasProgress = progress > 0;
  const tags = parseTags(course.tags);
  const thumbnail = parseDriveUrl(course.thumbnail);
  const avatar = parseDriveUrl(course.instructorAvatar);

  const editButton = isAdmin && editMode && (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowEdit(true); }}
      className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full bg-[#FFA902] flex items-center justify-center shadow-lg hover:bg-[#FFB832] transition-colors"
    >
      <Pencil className="w-3 h-3 text-black" />
    </motion.button>
  );

  if (variant === "compact") {
    return (
      <>
        <Link href={`/curso/${course.id}`}>
          <motion.div
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ duration: 0.18 }}
            className={`group relative bg-[#111111] border rounded-[12px] overflow-hidden cursor-pointer flex-shrink-0 w-[272px] transition-colors duration-200 ${
              editMode ? "border-[#FFA902]/20 hover:border-[#FFA902]/40" : "border-[#1E1E1E] hover:border-[#2E2E2E]"
            }`}
          >
            {editButton}

            {/* Thumbnail */}
            <div className="relative w-full h-[153px] overflow-hidden bg-[#1A1A1A]">
              <img
                src={thumbnail}
                alt={course.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111111]/60 via-transparent to-transparent" />

              {/* Play on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-10 h-10 rounded-full bg-[#FFA902] flex items-center justify-center shadow-lg shadow-[#FFA902]/30">
                  <Play className="w-4 h-4 text-black fill-black ml-0.5" />
                </div>
              </div>

              {/* Badges */}
              <div className="absolute top-2 left-2 flex gap-1">
                {course.isNew && <Badge variant="new" label="Novo" />}
                {isCompleted && <Badge variant="completed" label="Concluído" />}
              </div>
            </div>

            {/* Progress */}
            {showProgress && hasProgress && (
              <ProgressBar value={progress} size="xs" className="rounded-none" />
            )}

            {/* Content */}
            <div className="p-3">
              <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${catColor.bg} ${catColor.text}`}>
                {course.category}
              </span>
              <h3 className="text-sm font-semibold text-[#F0F0F0] line-clamp-2 leading-snug mb-2.5">
                {course.title}
              </h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#555555]">
                  <Clock className="w-3 h-3" />
                  <span className="text-[11px]">{course.duration || `${totalLessons} aulas`}</span>
                </div>
                <div className="flex items-center gap-1 text-[#FFA902]">
                  <Star className="w-3 h-3 fill-[#FFA902]" />
                  <span className="text-[11px] font-semibold">{course.rating.toFixed(1)}</span>
                </div>
              </div>
              {showProgress && hasProgress && (
                <p className="text-[10px] text-[#555555] mt-1.5">{progress}% concluído</p>
              )}
            </div>
          </motion.div>
        </Link>

        <AnimatePresence>
          {showEdit && (
            <EditCourseModal
              course={{ ...course, tags: course.tags }}
              onClose={() => setShowEdit(false)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  // Default (grid) variant
  return (
    <>
      <Link href={`/curso/${course.id}`}>
        <motion.div
          whileHover={{ y: -3 }}
          transition={{ duration: 0.18 }}
          className={`group relative bg-[#111111] border rounded-[12px] overflow-hidden cursor-pointer transition-all duration-200 ${
            editMode ? "border-[#FFA902]/20 hover:border-[#FFA902]/40" : "border-[#1E1E1E] hover:border-[#2E2E2E] hover:shadow-xl hover:shadow-black/50"
          }`}
        >
          {editButton}

          {/* Thumbnail */}
          <div className="relative w-full aspect-video overflow-hidden bg-[#1A1A1A]">
            <img
              src={thumbnail}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-70" />

            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 rounded-full bg-[#FFA902] flex items-center justify-center shadow-xl shadow-[#FFA902]/30">
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              </div>
            </div>

            {/* Status badges */}
            <div className="absolute top-3 left-3 flex gap-1.5">
              {course.isNew && <Badge variant="new" label="Novo" />}
              {hasProgress && !isCompleted && <Badge variant="inProgress" label="Em andamento" />}
              {isCompleted && <Badge variant="completed" label="Concluído" />}
            </div>
            <div className="absolute top-3 right-3">
              <Badge variant="level" label={course.level} />
            </div>
          </div>

          {/* Progress bar flush */}
          {showProgress && hasProgress && (
            <ProgressBar value={progress} size="xs" className="rounded-none" />
          )}

          {/* Content */}
          <div className="p-4">
            <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full mb-2 ${catColor.bg} ${catColor.text}`}>
              {course.category}
            </span>
            <h3 className="text-base font-semibold text-[#F0F0F0] line-clamp-2 leading-snug mb-1.5">
              {course.title}
            </h3>
            <p className="text-xs text-[#666666] line-clamp-2 mb-3 leading-relaxed">{course.description}</p>

            {/* Instructor */}
            <div className="flex items-center gap-2 mb-3">
              {course.instructorAvatar ? (
                <img src={avatar} alt={course.instructor} className="w-5 h-5 rounded-full bg-[#222222]" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-[#222222] flex items-center justify-center">
                  <span className="text-[9px] text-[#888888] font-bold">{course.instructor[0]}</span>
                </div>
              )}
              <span className="text-xs text-[#666666]">{course.instructor}</span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 pt-3 border-t border-[#1A1A1A]">
              <div className="flex items-center gap-1 text-[#555555]">
                <Clock className="w-3 h-3" />
                <span className="text-[11px]">{course.duration || `${totalLessons} aulas`}</span>
              </div>
              <div className="flex items-center gap-1 text-[#555555]">
                <Users className="w-3 h-3" />
                <span className="text-[11px]">{course.students.toLocaleString("pt-BR")}</span>
              </div>
              <div className="flex items-center gap-1 text-[#FFA902] ml-auto">
                <Star className="w-3 h-3 fill-[#FFA902]" />
                <span className="text-[11px] font-bold">{course.rating.toFixed(1)}</span>
              </div>
            </div>

            {showProgress && hasProgress && (
              <div className="mt-3 pt-3 border-t border-[#1A1A1A]">
                <ProgressBar value={progress} size="xs" showLabel />
              </div>
            )}
          </div>
        </motion.div>
      </Link>

      <AnimatePresence>
        {showEdit && (
          <EditCourseModal
            course={{ ...course, tags: course.tags }}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
