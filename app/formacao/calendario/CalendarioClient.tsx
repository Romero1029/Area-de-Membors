"use client";

import Link from "next/link";
import { ArrowLeft, Video, Clock, CalendarClock, ExternalLink } from "lucide-react";
import type { FormacaoLive, FormacaoDeadline } from "@/lib/queries";

interface Props {
  lives: FormacaoLive[];
  deadlines: FormacaoDeadline[];
}

export function CalendarioClient({ lives, deadlines }: Props) {
  return (
    <div className="min-h-screen pb-24">
      <div className="px-4 md:px-8 py-6 max-w-[820px] mx-auto">
        <Link href="/formacao" className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Formação IDM
        </Link>

        <h1 className="text-xl font-bold text-[#F0F0F0] mb-6">Calendário da turma</h1>

        <section className="mb-8">
          <h2 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5" /> Aulas ao vivo
          </h2>

          {lives.length === 0 ? (
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[14px] p-6 text-center">
              <p className="text-sm text-[#555555]">A equipe está organizando o cronograma de aulas ao vivo.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {lives.map((l) => (
                <div key={l.id} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[14px] p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F0F0F0]">{l.title}</p>
                    <p className="text-xs text-[#666666] mt-0.5">{l.dateLabel} {l.timeLabel && `· ${l.timeLabel}`}</p>
                  </div>
                  {l.joinUrl ? (
                    <a href={l.joinUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-[#FFA902] text-black text-xs font-semibold rounded-[8px] hover:bg-[#FFB832] transition-colors flex-shrink-0">
                      <ExternalLink className="w-3.5 h-3.5" /> Entrar
                    </a>
                  ) : (
                    <span className="text-[10px] text-[#555555] uppercase tracking-wider flex-shrink-0">Link em breve</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <CalendarClock className="w-3.5 h-3.5" /> Prazos de tarefas
          </h2>

          {deadlines.length === 0 ? (
            <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[14px] p-6 text-center">
              <p className="text-sm text-[#555555]">Nenhum prazo definido no momento.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {deadlines.map((d) => (
                <div key={d.id} className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[14px] p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#F0F0F0]">{d.title}</p>
                    <p className="text-xs text-[#666666] mt-0.5">{d.moduleTitle}</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs text-[#FFA902] flex-shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(d.dueAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
