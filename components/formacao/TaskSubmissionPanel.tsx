"use client";

import { useState } from "react";
import { ClipboardCheck, Check, Loader2, CheckCircle2, Clock } from "lucide-react";
import { submitTask } from "@/lib/actions/formacao";
import type { StudentTask } from "@/lib/queries";

interface Props {
  tasks: StudentTask[];
}

export function TaskSubmissionPanel({ tasks }: Props) {
  if (tasks.length === 0) return null;

  return (
    <div className="mb-6 space-y-3">
      <h2 className="text-xs font-semibold text-[#555555] uppercase tracking-wider flex items-center gap-1.5">
        <ClipboardCheck className="w-3.5 h-3.5" /> Tarefas do módulo
      </h2>
      {tasks.map((t) => (
        <TaskCard key={t.id} task={t} />
      ))}
    </div>
  );
}

function TaskCard({ task }: { task: StudentTask }) {
  const [answer, setAnswer] = useState(task.mySubmission?.answer ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [submission, setSubmission] = useState(task.mySubmission);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setSubmitting(true);
    setError("");
    const result = await submitTask(task.id, answer);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSubmission({ answer, status: "submitted", finalScore: null, finalFeedback: "", published: false });
  };

  const overdue = task.dueAt ? new Date(task.dueAt) < new Date() : false;

  return (
    <div className="bg-[#0D0D0D] border border-[#1A1A1A] rounded-[14px] p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <p className="text-sm font-semibold text-[#F0F0F0]">{task.title}</p>
        {task.dueAt && (
          <span className={`flex items-center gap-1 text-[10px] uppercase tracking-wider flex-shrink-0 ${overdue && !submission ? "text-red-400" : "text-[#666666]"}`}>
            <Clock className="w-3 h-3" />
            {new Date(task.dueAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
          </span>
        )}
      </div>

      <p className="text-sm text-[#888888] leading-relaxed mb-3 whitespace-pre-wrap">{task.instructions}</p>

      {submission?.published ? (
        <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[10px] p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Nota: {submission.finalScore?.toFixed(1)}
          </div>
          {submission.finalFeedback && (
            <p className="text-sm text-[#CCCCCC] leading-relaxed">{submission.finalFeedback}</p>
          )}
        </div>
      ) : (
        <>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={5}
            placeholder="Digite sua resposta aqui..."
            className="w-full bg-[#111111] border border-[#222222] rounded-[8px] px-3 py-2 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none resize-none focus:border-[#FFA902]/40"
          />
          {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
          <div className="flex items-center justify-between mt-3">
            {submission ? (
              <span className="text-[11px] text-[#666666]">Enviado — aguardando correção</span>
            ) : (
              <span />
            )}
            <button
              onClick={handleSubmit}
              disabled={submitting || !answer.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFA902] text-black text-xs font-semibold rounded-[6px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors"
            >
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              {submission ? "Reenviar" : "Enviar resposta"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
