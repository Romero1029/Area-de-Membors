"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCourse, type CourseInput } from "@/lib/actions/courses";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface CreateCourseModalProps {
  onClose: () => void;
}

const CATEGORIES = [
  "Autoconhecimento", "Psicanálise", "Numerologia", "PNL",
  "Espiritualidade", "Meditação", "Terapia", "Desenvolvimento Pessoal", "Outro"
];

const LEVELS = ["Iniciante", "Intermediário", "Avançado"] as const;

export function CreateCourseModal({ onClose }: CreateCourseModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<CourseInput>({
    title: "",
    description: "",
    instructor: "",
    instructorBio: "",
    instructorAvatar: "",
    thumbnail: "",
    category: CATEGORIES[0],
    level: "Intermediário",
    duration: "",
    rating: 0,
    students: 0,
    isNew: true,
    isFeatured: false,
    published: true,
    tags: "[]",
  });

  const set = (field: keyof CourseInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // Parse tags from comma-separated string
    const tagsInput = (form.tags as any) as string;
    const tagsArray = tagsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    const result = await createCourse({ ...form, tags: JSON.stringify(tagsArray) });

    setLoading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      onClose();
      router.push(`/curso/${result.data.id}`);
      router.refresh();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[560px] bg-[#0D0D0D] border border-[#222222] rounded-[16px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <div>
            <h2 className="text-base font-semibold text-[#F0F0F0]">Novo curso</h2>
            <p className="text-xs text-[#555555] mt-0.5">
              {step === 1 ? "Informações básicas" : "Instrutor & configurações"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Step indicator */}
            <div className="flex items-center gap-1.5">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`w-6 h-1 rounded-full transition-colors duration-200 ${
                    s <= step ? "bg-[#FFA902]" : "bg-[#222222]"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#555555] hover:text-[#F0F0F0] hover:bg-[#1A1A1A] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success state */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-400" />
            </motion.div>
            <p className="text-sm font-medium text-[#F0F0F0]">Curso criado com sucesso!</p>
            <p className="text-xs text-[#888888]">Redirecionando...</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {step === 1 ? (
              <>
                {/* Title */}
                <Field label="Título do curso *">
                  <input
                    value={form.title}
                    onChange={set("title")}
                    placeholder="Ex: Psicanálise para o Autoconhecimento"
                    className={inputCls}
                  />
                </Field>

                {/* Description */}
                <Field label="Descrição *">
                  <textarea
                    value={form.description}
                    onChange={set("description")}
                    placeholder="Descreva o que o aluno vai aprender..."
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                {/* Thumbnail */}
                <ImageUploader
                  label="Capa do curso *"
                  ratio="16/9"
                  value={form.thumbnail}
                  onChange={(url) => setForm((p) => ({ ...p, thumbnail: url }))}
                  hint="Proporção 16:9 · 1280×720px recomendado"
                />

                {/* Category + Level */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Categoria">
                    <select value={form.category} onChange={set("category")} className={selectCls}>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </Field>
                  <Field label="Nível">
                    <select value={form.level} onChange={set("level")} className={selectCls}>
                      {LEVELS.map((l) => <option key={l}>{l}</option>)}
                    </select>
                  </Field>
                </div>

                {/* Duration + Tags */}
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Duração estimada">
                    <input
                      value={form.duration}
                      onChange={set("duration")}
                      placeholder="Ex: 24h 30min"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Tags (vírgula)">
                    <input
                      value={form.tags as any}
                      onChange={set("tags")}
                      placeholder="meditação, mente, cura, despertar"
                      className={inputCls}
                    />
                  </Field>
                </div>
              </>
            ) : (
              <>
                {/* Instructor */}
                <Field label="Nome do instrutor *">
                  <input
                    value={form.instructor}
                    onChange={set("instructor")}
                    placeholder="Nome completo"
                    className={inputCls}
                  />
                </Field>

                <Field label="Bio do instrutor">
                  <textarea
                    value={form.instructorBio}
                    onChange={set("instructorBio")}
                    placeholder="Experiência e background..."
                    rows={3}
                    className={`${inputCls} resize-none`}
                  />
                </Field>

                <ImageUploader
                  label="Foto do instrutor"
                  ratio="1/1"
                  value={form.instructorAvatar}
                  onChange={(url) => setForm((p) => ({ ...p, instructorAvatar: url }))}
                  hint="Foto quadrada · 400×400px recomendado"
                />

                {/* Toggles */}
                <div className="space-y-2 pt-2">
                  <Toggle
                    label="Marcar como Novo"
                    description="Aparece com badge 'Novo' nos cards"
                    checked={form.isNew}
                    onChange={(v) => setForm((p) => ({ ...p, isNew: v }))}
                  />
                  <Toggle
                    label="Curso em destaque"
                    description="Aparece no hero banner do dashboard"
                    checked={form.isFeatured}
                    onChange={(v) => setForm((p) => ({ ...p, isFeatured: v }))}
                  />
                  <Toggle
                    label="Publicado"
                    description="Visível para os alunos"
                    checked={form.published}
                    onChange={(v) => setForm((p) => ({ ...p, published: v }))}
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-sm text-red-400 bg-red-500/8 border border-red-500/20 rounded-[8px] px-3 py-2">
                {error}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        {!success && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#1A1A1A]">
            <button
              onClick={step === 1 ? onClose : () => setStep(1)}
              className="px-4 py-2 text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors"
            >
              {step === 1 ? "Cancelar" : "Voltar"}
            </button>

            <button
              onClick={step === 1 ? () => setStep(2) : handleSubmit}
              disabled={loading || (step === 1 && (!form.title || !form.description || !form.thumbnail))}
              className="flex items-center gap-2 px-5 py-2 bg-[#FFA902] text-black text-sm font-semibold rounded-[8px] hover:bg-[#FFB832] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {step === 1 ? "Próximo" : "Criar curso"}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const inputCls =
  "w-full bg-[#111111] border border-[#222222] rounded-[8px] px-3 py-2.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/50 focus:ring-1 focus:ring-[#FFA902]/20 transition-all duration-150";

const selectCls =
  "w-full bg-[#111111] border border-[#222222] rounded-[8px] px-3 py-2.5 text-sm text-[#F0F0F0] outline-none focus:border-[#FFA902]/50 transition-all duration-150";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#888888] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-[#111111] border border-[#1A1A1A] rounded-[8px] cursor-pointer hover:border-[#222222] transition-colors"
      onClick={() => onChange(!checked)}
    >
      <div>
        <p className="text-sm font-medium text-[#F0F0F0]">{label}</p>
        <p className="text-[11px] text-[#555555] mt-0.5">{description}</p>
      </div>
      <div
        className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${
          checked ? "bg-[#FFA902]" : "bg-[#222222]"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
}
