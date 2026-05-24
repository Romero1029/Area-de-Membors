"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SkipForward, SkipBack, ChevronRight, ChevronLeft, Lock,
  MessageSquare, Plus, ArrowLeft, PlayCircle, X, Zap,
  Tv2, FileText, Link2, Video, ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { parseDriveUrl, extractYouTubeId, type CourseWithModules } from "@/lib/types";
import { ProgressBar } from "@/components/ui/ProgressBar";

type FlatLesson = {
  id: string; title: string; duration: string; locked: boolean;
  videoUrl: string; contentType: string; moduleId: string; moduleTitle: string;
  moduleIndex: number; lessonIndex: number; order: number;
};

interface Props {
  course: CourseWithModules;
  isAdmin: boolean;
}


export function PlayerClient({ course, isAdmin }: Props) {
  const flatLessons: FlatLesson[] = course.modules.flatMap((m, mi) =>
    m.lessons.map((l, li) => ({
      ...l,
      moduleTitle: m.title,
      moduleIndex: mi,
      lessonIndex: li,
    }))
  );

  const firstUnlocked = Math.max(0, flatLessons.findIndex((l) => !l.locked));

  const [currentIdx, setCurrentIdx] = useState(firstUnlocked);
  const [showSidebar, setShowSidebar] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<"chapters" | "notes">("chapters");
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<{ id: number; time: string; text: string }[]>([]);

  const countdownTimer = useRef<NodeJS.Timeout | null>(null);

  const current = flatLessons[currentIdx];
  const next = flatLessons[currentIdx + 1];
  const prev = flatLessons[currentIdx - 1];

  const cancelCountdown = useCallback(() => {
    if (countdownTimer.current) clearInterval(countdownTimer.current);
    setShowCountdown(false);
  }, []);

  const goToNext = useCallback(() => {
    if (next && !next.locked) {
      setCurrentIdx((i) => i + 1);
    }
  }, [next]);

  const addNote = () => {
    if (!noteText.trim()) return;
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setNotes((prev) => [{ id: Date.now(), time, text: noteText.trim() }, ...prev]);
    setNoteText("");
  };

  if (!current) return (
    <div className="flex items-center justify-center h-screen bg-[#050505]">
      <p className="text-[#888888]">Nenhuma aula disponível.</p>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#060606] overflow-hidden select-none">
      {/* ── Video column ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 h-12 border-b border-[#0E0E0E] flex-shrink-0 bg-[#080808]">
          <div className="flex items-center gap-2 min-w-0">
            <Link href={`/curso/${course.id}`}>
              <motion.div whileHover={{ x: -2 }} className="flex items-center gap-1.5 text-sm text-[#555555] hover:text-[#888888] transition-colors cursor-pointer flex-shrink-0">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:block truncate max-w-[160px]">{course.title}</span>
              </motion.div>
            </Link>
            <span className="text-[#222222] hidden sm:block">›</span>
            <span className="text-xs text-[#444444] hidden sm:block truncate">{current.moduleTitle}</span>
            <span className="text-[#222222] hidden sm:block">›</span>
            <span className="text-xs text-[#AAAAAA] font-medium truncate">{current.title}</span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[11px] text-[#444444]">{currentIdx + 1}/{flatLessons.length}</span>
            <button
              onClick={() => setShowSidebar((s) => !s)}
              className="flex items-center gap-1 text-[11px] text-[#555555] hover:text-[#888888] transition-colors"
            >
              {showSidebar ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              <span className="hidden sm:block">{showSidebar ? "Ocultar" : "Capítulos"}</span>
            </button>
          </div>
        </div>

        {/* Player / content area */}
        <div className="flex-1 relative bg-black overflow-hidden">
          <LessonContent lesson={current} courseThumbnail={parseDriveUrl(course.thumbnail)} />

          {/* Autoplay countdown — shown after youtube/video finishes (manual for now) */}
          <AnimatePresence>
            {showCountdown && next && (
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="absolute bottom-6 right-4 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[12px] p-4 w-[260px] shadow-2xl z-50"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FFA902]" />
                    <span className="text-xs font-semibold text-[#F0F0F0]">Próxima em {countdown}s</span>
                  </div>
                  <button onClick={cancelCountdown}><X className="w-3.5 h-3.5 text-[#555555] hover:text-[#888888]" /></button>
                </div>
                <p className="text-xs text-[#666666] mb-3 line-clamp-1">{next.title}</p>
                <div className="flex gap-2">
                  <button onClick={cancelCountdown} className="flex-1 py-1.5 text-xs text-[#888888] border border-[#222222] rounded-[6px] hover:text-[#F0F0F0] transition-colors">Cancelar</button>
                  <button onClick={() => { cancelCountdown(); goToNext(); }} className="flex-1 py-1.5 text-xs text-black font-semibold bg-[#FFA902] rounded-[6px] hover:bg-[#FFB832] transition-colors">Agora</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation arrows */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-40">
            <button onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))} disabled={!prev}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#888888] bg-black/60 border border-[#222222] rounded-[6px] hover:text-[#F0F0F0] disabled:opacity-30 transition-colors backdrop-blur-sm">
              <SkipBack className="w-3.5 h-3.5" /> Anterior
            </button>
            <button onClick={goToNext} disabled={!next || next.locked}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-black bg-[#FFA902] rounded-[6px] hover:bg-[#FFB832] disabled:opacity-30 transition-colors font-medium">
              Próxima <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Notes bar */}
        <div className="border-t border-[#0E0E0E] px-4 py-2.5 flex-shrink-0 bg-[#080808]">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5 text-[#444444] flex-shrink-0" />
            <input
              value={noteText} onChange={(e) => setNoteText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNote()}
              placeholder="Adicionar anotação sobre esta aula..."
              className="flex-1 bg-transparent text-sm text-[#F0F0F0] placeholder-[#333333] outline-none"
            />
            <button onClick={addNote} disabled={!noteText.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-[6px] text-xs font-medium bg-[#FFA902]/10 text-[#FFA902] border border-[#FFA902]/15 hover:bg-[#FFA902]/15 transition-colors disabled:opacity-30">
              <Plus className="w-3 h-3" /> Salvar
            </button>
          </div>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <AnimatePresence>
        {showSidebar && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }} animate={{ width: 300, opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-l border-[#0E0E0E] flex flex-col overflow-hidden flex-shrink-0 bg-[#080808]"
          >
            {/* Tabs */}
            <div className="flex border-b border-[#0E0E0E] flex-shrink-0">
              {(["chapters", "notes"] as const).map((t) => (
                <button key={t} onClick={() => setSidebarTab(t)}
                  className={`flex-1 py-3 text-[11px] font-medium transition-colors ${sidebarTab === t ? "text-[#FFA902] border-b border-[#FFA902] -mb-px" : "text-[#555555] hover:text-[#888888]"}`}>
                  {t === "chapters" ? "Capítulos" : `Notas (${notes.length})`}
                </button>
              ))}
            </div>

            {/* Progress */}
            <div className="px-4 py-2.5 border-b border-[#0E0E0E] flex-shrink-0">
              <ProgressBar value={Math.round((currentIdx / flatLessons.length) * 100)} size="xs" showLabel />
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {sidebarTab === "chapters" ? (
                <div>
                  {course.modules.map((mod, mi) => (
                    <div key={mod.id}>
                      <div className="px-4 py-2 bg-[#050505] sticky top-0 border-b border-[#0E0E0E]">
                        <p className="text-[10px] font-semibold text-[#333333] uppercase tracking-wider">
                          Módulo {mi + 1} · {mod.title}
                        </p>
                      </div>
                      {mod.lessons.map((lesson, li) => {
                        const gIdx = flatLessons.findIndex((l) => l.id === lesson.id);
                        const isCurrent = gIdx === currentIdx;
                        return (
                          <button key={lesson.id} disabled={lesson.locked}
                            onClick={() => { if (!lesson.locked) { setCurrentIdx(gIdx); } }}
                            className={`w-full flex items-start gap-3 px-4 py-3 border-b border-[#0A0A0A] text-left transition-colors ${
                              isCurrent ? "bg-[#FFA902]/6 border-l-2 border-l-[#FFA902]"
                                : lesson.locked ? "opacity-35 cursor-not-allowed"
                                : "hover:bg-[#0D0D0D] cursor-pointer"
                            }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {lesson.locked ? <Lock className="w-3 h-3 text-[#333333]" />
                                : isCurrent ? <PlayCircle className="w-3 h-3 text-[#FFA902]" />
                                : <PlayCircle className="w-3 h-3 text-[#333333]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[11px] leading-snug ${isCurrent ? "text-[#FFA902] font-medium" : "text-[#888888]"}`}>
                                {li + 1}. {lesson.title}
                              </p>
                              <p className="text-[10px] text-[#444444] mt-0.5">{lesson.duration}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {notes.length === 0 ? (
                    <div className="text-center py-10">
                      <MessageSquare className="w-7 h-7 text-[#222222] mx-auto mb-2" />
                      <p className="text-xs text-[#444444]">Nenhuma anotação ainda.</p>
                    </div>
                  ) : notes.map((n) => (
                    <div key={n.id} className="p-3 bg-[#0D0D0D] border border-[#161616] rounded-[8px]">
                      <span className="text-[10px] font-semibold text-[#FFA902] bg-[#FFA902]/8 px-1.5 py-0.5 rounded mb-1.5 inline-block">{n.time}</span>
                      <p className="text-xs text-[#888888] leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </div>
  );
}

function LessonContent({ lesson, courseThumbnail }: { lesson: FlatLesson; courseThumbnail: string }) {
  const ct = lesson.contentType || "youtube";
  const url = lesson.videoUrl;

  if (ct === "youtube") {
    const ytId = extractYouTubeId(url);
    if (ytId) {
      return (
        <iframe
          key={lesson.id}
          src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
          title={lesson.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-0"
        />
      );
    }
    return <NoContent icon={<Tv2 className="w-10 h-10 text-red-400" />} label="Link do YouTube inválido ou não configurado." url={url} thumbnail={courseThumbnail} title={lesson.title} />;
  }

  if (ct === "pdf") {
    if (url) {
      return (
        <div className="w-full h-full flex flex-col">
          <iframe
            key={lesson.id}
            src={url}
            title={lesson.title}
            className="flex-1 border-0 bg-white"
          />
        </div>
      );
    }
    return <NoContent icon={<FileText className="w-10 h-10 text-blue-400" />} label="PDF não configurado para esta aula." url={url} thumbnail={courseThumbnail} title={lesson.title} />;
  }

  if (ct === "link") {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-5 bg-[#080808] px-6">
        <img src={courseThumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5" />
        <div className="relative z-10 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#111111] border border-[#2A2A2A] flex items-center justify-center">
            <Link2 className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <p className="text-lg font-semibold text-[#F0F0F0] mb-1">{lesson.title}</p>
            <p className="text-sm text-[#666666] mb-5">Este conteúdo abre em uma nova aba.</p>
          </div>
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#FFA902] text-black font-semibold rounded-[10px] hover:bg-[#FFB832] transition-colors shadow-lg shadow-[#FFA902]/20">
              <ExternalLink className="w-4 h-4" />
              Abrir conteúdo
            </a>
          ) : (
            <p className="text-sm text-[#555555]">Link não configurado.</p>
          )}
        </div>
      </div>
    );
  }

  if (ct === "video") {
    if (url) {
      return (
        <video
          key={lesson.id}
          src={url}
          controls
          autoPlay
          className="w-full h-full bg-black"
        />
      );
    }
    return <NoContent icon={<Video className="w-10 h-10 text-emerald-400" />} label="Vídeo não configurado para esta aula." url={url} thumbnail={courseThumbnail} title={lesson.title} />;
  }

  return <NoContent icon={<PlayCircle className="w-10 h-10 text-[#FFA902]" />} label="Conteúdo não disponível." url={url} thumbnail={courseThumbnail} title={lesson.title} />;
}

function NoContent({ icon, label, url, thumbnail, title }: { icon: React.ReactNode; label: string; url: string; thumbnail: string; title: string }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4 bg-[#080808] relative">
      <img src={thumbnail} alt="" className="absolute inset-0 w-full h-full object-cover opacity-5" />
      <div className="relative z-10 flex flex-col items-center gap-3 text-center px-6">
        {icon}
        <p className="text-base font-semibold text-[#F0F0F0]">{title}</p>
        <p className="text-sm text-[#555555]">{label}</p>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-[#FFA902] hover:text-[#FFB832] transition-colors mt-1">
            <ExternalLink className="w-3.5 h-3.5" /> Abrir link
          </a>
        )}
      </div>
    </div>
  );
}
