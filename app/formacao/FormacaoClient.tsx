"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, PlayCircle, GraduationCap, CalendarClock } from "lucide-react";
import type { FormacaoModule } from "@/lib/queries";

interface Props {
  modules: FormacaoModule[];
  enrolled: boolean;
  isAdmin: boolean;
}

function formatUnlockDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

export function FormacaoClient({ modules, enrolled }: Props) {
  if (!enrolled) {
    return (
      <div className="px-4 md:px-8 py-16 max-w-[600px] mx-auto text-center">
        <div className="w-14 h-14 rounded-full bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center mx-auto mb-4">
          <GraduationCap className="w-6 h-6 text-[#FFA902]" />
        </div>
        <h1 className="text-lg font-bold text-[#F0F0F0] mb-2">Você ainda não está matriculado na Formação IDM</h1>
        <p className="text-sm text-[#666666]">Fale com a equipe do Instituto Despertamente pra liberar seu acesso.</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 py-8 max-w-[720px] mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-[8px] bg-[#FFA902]/10 border border-[#FFA902]/20 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-[#FFA902]" />
            </div>
            <h1 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Formação em Psicanálise</h1>
          </div>
          <p className="text-sm text-[#555555] ml-11">Sua jornada, módulo a módulo.</p>
        </div>
        <Link href="/formacao/calendario"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs text-[#888888] hover:text-[#FFA902] border border-[#222222] hover:border-[#FFA902]/30 transition-colors">
          <CalendarClock className="w-3.5 h-3.5" /> Calendário
        </Link>
      </div>

      <div className="space-y-2">
        {modules.map((mod, i) => {
          const unlocked = mod.released;
          const firstLesson = mod.lessons[0];

          const content = (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.2 }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-[12px] border transition-colors ${
                unlocked
                  ? "bg-[#111111] border-[#1E1E1E] hover:border-[#FFA902]/30 cursor-pointer"
                  : "bg-[#0D0D0D] border-[#161616] opacity-60"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                <span className="text-[11px] font-bold text-[#666666]">{i + 1}</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F0F0F0] truncate">{mod.title}</p>
                {unlocked ? (
                  <p className="text-[11px] text-[#555555]">
                    {mod.lessons.length} {mod.lessons.length === 1 ? "aula" : "aulas"}
                  </p>
                ) : (
                  <p className="text-[11px] text-[#555555] flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" />
                    {mod.releaseAt ? `Libera em ${formatUnlockDate(mod.releaseAt)}` : "Em breve"}
                  </p>
                )}
              </div>

              {unlocked ? (
                <PlayCircle className="w-5 h-5 text-[#FFA902] flex-shrink-0" />
              ) : (
                <Lock className="w-4 h-4 text-[#444444] flex-shrink-0" />
              )}
            </motion.div>
          );

          return unlocked && firstLesson ? (
            <Link key={mod.id} href={`/formacao/aula/${firstLesson.id}`}>
              {content}
            </Link>
          ) : (
            <div key={mod.id}>{content}</div>
          );
        })}
      </div>
    </div>
  );
}
