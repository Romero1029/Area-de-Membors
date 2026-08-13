"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check, Loader2, CheckCircle2 } from "lucide-react";
import { reviewGrade } from "@/lib/actions/formacao";
import type { FormacaoTask, TaskSubmissionRow } from "@/lib/queries";

interface Props {
  task: FormacaoTask;
  submissions: TaskSubmissionRow[];
}

export function SubmissionsReviewClient({ task, submissions }: Props) {
  return (
    <div className="px-4 md:px-8 py-8 max-w-[820px]">
      <Link href="/admin/formacao-idm/tarefas" className="inline-flex items-center gap-1.5 text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors mb-4">
        <ArrowLeft className="w-4 h-4" /> Tarefas
      </Link>

      <h1 className="text-xl font-bold text-[#F0F0F0] mb-1">{task.title}</h1>
      <p className="text-sm text-[#555555] mb-6">{task.moduleTitle} · {submissions.length} envios</p>

      <div className="space-y-4">
        {submissions.map((s) => (
          <SubmissionCard key={s.id} submission={s} />
        ))}
        {submissions.length === 0 && (
          <p className="text-sm text-[#555555] text-center py-12">Nenhum aluno enviou essa tarefa ainda.</p>
        )}
      </div>
    </div>
  );
}

function SubmissionCard({ submission }: { submission: TaskSubmissionRow }) {
  const [finalScore, setFinalScore] = useState(
    submission.finalScore?.toString() ?? submission.aiScore?.toString() ?? ""
  );
  const [finalFeedback, setFinalFeedback] = useState(submission.finalFeedback || submission.aiFeedback || "");
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [published, setPublished] = useState(submission.published);

  const handleSave = async (publish: boolean) => {
    if (!submission.gradeId) return;
    const score = parseFloat(finalScore);
    if (isNaN(score)) return;
    setSaving(publish ? "publish" : "draft");
    const result = await reviewGrade(submission.gradeId, { finalScore: score, finalFeedback, publish });
    setSaving(null);
    if (result.ok && publish) setPublished(true);
  };

  return (
    <div className={`bg-[#111111] border rounded-[12px] p-4 ${published ? "border-emerald-500/20" : "border-[#1E1E1E]"}`}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold text-[#F0F0F0]">{submission.studentName}</p>
        {published ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            <CheckCircle2 className="w-2.5 h-2.5" /> Publicada
          </span>
        ) : submission.gradeId ? (
          <span className="text-[10px] text-[#FFA902] uppercase tracking-wider font-bold">Aguardando revisão</span>
        ) : (
          <span className="text-[10px] text-[#555555] uppercase tracking-wider">IA ainda não corrigiu</span>
        )}
      </div>

      <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[8px] p-3 mb-3">
        <p className="text-[10px] text-[#555555] uppercase tracking-wider mb-1">Resposta do aluno</p>
        <p className="text-sm text-[#CCCCCC] whitespace-pre-wrap">{submission.answer}</p>
      </div>

      {submission.aiScore !== null && (
        <div className="flex items-center gap-1.5 text-[11px] text-[#666666] mb-3">
          <Sparkles className="w-3 h-3 text-[#FFA902]" />
          Sugestão da IA: nota {submission.aiScore.toFixed(1)} — &quot;{submission.aiFeedback}&quot;
        </div>
      )}

      {submission.gradeId && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#888888]">Nota final:</label>
            <input
              type="number" min={0} max={10} step={0.5}
              value={finalScore}
              onChange={(e) => setFinalScore(e.target.value)}
              className="w-20 bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-2 py-1 text-sm text-[#F0F0F0] outline-none focus:border-[#FFA902]/40"
            />
          </div>
          <textarea
            value={finalFeedback}
            onChange={(e) => setFinalFeedback(e.target.value)}
            rows={3}
            placeholder="Feedback final pro aluno"
            className="w-full bg-[#0D0D0D] border border-[#222222] rounded-[6px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none resize-none focus:border-[#FFA902]/40"
          />
          <div className="flex justify-end gap-2">
            <button onClick={() => handleSave(false)} disabled={saving !== null}
              className="px-3 py-1.5 text-xs text-[#888888] hover:text-[#F0F0F0] transition-colors disabled:opacity-40">
              {saving === "draft" ? <Loader2 className="w-3 h-3 animate-spin inline" /> : "Salvar rascunho"}
            </button>
            <button onClick={() => handleSave(true)} disabled={saving !== null}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#FFA902] text-black text-xs font-medium rounded-[6px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
              {saving === "publish" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Publicar nota
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
