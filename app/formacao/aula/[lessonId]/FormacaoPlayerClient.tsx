"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, Link2, Paperclip } from "lucide-react";
import { extractYouTubeId } from "@/lib/types";
import type { FormacaoLesson, StudentTask } from "@/lib/queries";
import { TaskSubmissionPanel } from "@/components/formacao/TaskSubmissionPanel";

interface Props {
  lesson: FormacaoLesson & { moduleTitle: string; moduleId: string };
  prevId: string | null;
  nextId: string | null;
  tasks: StudentTask[];
}

export function FormacaoPlayerClient({ lesson, prevId, nextId, tasks }: Props) {
  const router = useRouter();
  const youtubeId = lesson.lessonType === "video" ? extractYouTubeId(lesson.videoUrl) : null;

  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 md:px-8 py-6 max-w-[820px] mx-auto">
        <Link href="/formacao" className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Formação IDM
        </Link>

        <p className="text-xs text-[#555555] uppercase tracking-wider mb-1">{lesson.moduleTitle}</p>
        <h1 className="text-xl font-bold text-[#F0F0F0] mb-4">{lesson.title}</h1>

        {/* Content */}
        <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[14px] overflow-hidden mb-4">
          {lesson.lessonType === "video" && youtubeId && (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          )}
          {lesson.lessonType === "video" && !youtubeId && lesson.videoUrl && (
            <video src={lesson.videoUrl} controls className="w-full aspect-video bg-black" />
          )}
          {lesson.lessonType === "video" && !lesson.videoUrl && (
            <div className="aspect-video flex items-center justify-center text-sm text-[#555555]">Vídeo ainda não disponível</div>
          )}
          {lesson.lessonType === "text" && (
            <div className="p-6 text-sm text-[#CCCCCC] leading-relaxed whitespace-pre-wrap">{lesson.content || "Conteúdo em breve."}</div>
          )}
          {lesson.lessonType === "file" && (
            <div className="p-6 flex items-center justify-center">
              {lesson.fileUrl ? (
                <a href={lesson.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-[#FFA902] text-black text-sm font-semibold rounded-[8px] hover:bg-[#FFB832] transition-colors">
                  <FileText className="w-4 h-4" /> Abrir arquivo
                </a>
              ) : (
                <p className="text-sm text-[#555555]">Arquivo ainda não disponível</p>
              )}
            </div>
          )}
        </div>

        {lesson.description && (
          <p className="text-sm text-[#888888] leading-relaxed mb-6">{lesson.description}</p>
        )}

        {/* Materials */}
        {lesson.materials.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" /> Materiais complementares
            </h2>
            <div className="space-y-1.5">
              {lesson.materials.map((m) => (
                <a key={m.id} href={m.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[8px] text-sm text-[#AAAAAA] hover:border-[#FFA902]/30 hover:text-[#FFA902] transition-colors">
                  <Link2 className="w-3.5 h-3.5 flex-shrink-0" />
                  {m.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <TaskSubmissionPanel tasks={tasks} />

        {/* Prev/next */}
        <div className="flex items-center justify-between pt-4 border-t border-[#161616]">
          <button
            onClick={() => prevId && router.push(`/formacao/aula/${prevId}`)}
            disabled={!prevId}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-[#888888] hover:text-[#F0F0F0] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <button
            onClick={() => nextId && router.push(`/formacao/aula/${nextId}`)}
            disabled={!nextId}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FFA902] text-black text-sm font-semibold rounded-[8px] hover:bg-[#FFB832] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Próxima <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
