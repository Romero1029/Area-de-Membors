"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { updateCourse, deleteCourse, toggleFeatured } from "@/lib/actions/courses";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorBio: string;
  instructorAvatar: string;
  thumbnail: string;
  category: string;
  level: string;
  duration: string;
  isNew: boolean;
  isFeatured: boolean;
  published: boolean;
  tags: string;
}

interface EditCourseModalProps {
  course: Course;
  onClose: () => void;
}

const CATEGORIES = [
  "Autoconhecimento", "Psicanálise", "Numerologia", "PNL",
  "Espiritualidade", "Meditação", "Terapia", "Desenvolvimento Pessoal", "Outro",
];
const LEVELS = ["Iniciante", "Intermediário", "Avançado"];

export function EditCourseModal({ course, onClose }: EditCourseModalProps) {
  const router = useRouter();
  const [tab, setTab] = useState<"info" | "instructor" | "settings">("info");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const parsedTags = (() => {
    try { return (JSON.parse(course.tags) as string[]).join(", "); }
    catch { return ""; }
  })();

  const [form, setForm] = useState({
    title: course.title,
    description: course.description,
    instructor: course.instructor,
    instructorBio: course.instructorBio,
    instructorAvatar: course.instructorAvatar,
    thumbnail: course.thumbnail,
    category: course.category,
    level: course.level,
    duration: course.duration,
    isNew: course.isNew,
    isFeatured: course.isFeatured,
    published: course.published,
    tagsRaw: parsedTags,
  });

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const val = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((p) => ({ ...p, [field]: val }));
    };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    const tags = form.tagsRaw
      .split(",").map((t) => t.trim()).filter(Boolean);

    const result = await updateCourse(course.id, {
      title: form.title,
      description: form.description,
      instructor: form.instructor,
      instructorBio: form.instructorBio,
      instructorAvatar: form.instructorAvatar,
      thumbnail: form.thumbnail,
      category: form.category,
      level: form.level as any,
      duration: form.duration,
      isNew: form.isNew,
      isFeatured: form.isFeatured,
      published: form.published,
      tags: JSON.stringify(tags),
    });

    setLoading(false);
    if (!result.ok) { setError(result.error); return; }

    setSuccess(true);
    setTimeout(() => { onClose(); router.refresh(); }, 900);
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await deleteCourse(course.id);
    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[580px] bg-[#0D0D0D] border border-[#222222] rounded-[16px] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
          <div>
            <h2 className="text-base font-semibold text-[#F0F0F0]">Editar curso</h2>
            <p className="text-xs text-[#555555] mt-0.5 truncate max-w-[340px]">{course.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-[6px] flex items-center justify-center text-[#555555] hover:text-[#F0F0F0] hover:bg-[#1A1A1A] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1A1A1A] px-6">
          {(["info", "instructor", "settings"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`py-3 px-1 mr-5 text-xs font-medium transition-colors border-b-2 -mb-px ${
                tab === t ? "text-[#FFA902] border-[#FFA902]" : "text-[#555555] border-transparent hover:text-[#888888]"
              }`}
            >
              {t === "info" ? "Informações" : t === "instructor" ? "Instrutor" : "Configurações"}
            </button>
          ))}
        </div>

        {/* Success */}
        {success ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            <p className="text-sm font-medium text-[#F0F0F0]">Alterações salvas!</p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4 max-h-[65vh] overflow-y-auto">
            {tab === "info" && (
              <>
                <Field label="Título">
                  <input value={form.title} onChange={set("title")} className={inputCls} />
                </Field>
                <Field label="Descrição">
                  <textarea value={form.description} onChange={set("description")} rows={4} className={`${inputCls} resize-none`} />
                </Field>
                <ImageUploader
                  label="Capa do curso"
                  ratio="16/9"
                  value={form.thumbnail}
                  onChange={(url) => setForm((p) => ({ ...p, thumbnail: url }))}
                  hint="Proporção 16:9 · 1280×720px recomendado"
                />
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
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Duração">
                    <input value={form.duration} onChange={set("duration")} placeholder="24h 30min" className={inputCls} />
                  </Field>
                  <Field label="Tags (vírgula)">
                    <input value={form.tagsRaw} onChange={set("tagsRaw")} placeholder="meditação, mente, cura" className={inputCls} />
                  </Field>
                </div>
              </>
            )}

            {tab === "instructor" && (
              <>
                <Field label="Nome">
                  <input value={form.instructor} onChange={set("instructor")} className={inputCls} />
                </Field>
                <Field label="Bio">
                  <textarea value={form.instructorBio} onChange={set("instructorBio")} rows={4} className={`${inputCls} resize-none`} />
                </Field>
                <ImageUploader
                  label="Foto do instrutor"
                  ratio="1/1"
                  value={form.instructorAvatar}
                  onChange={(url) => setForm((p) => ({ ...p, instructorAvatar: url }))}
                  hint="Foto quadrada · 400×400px recomendado"
                />
              </>
            )}

            {tab === "settings" && (
              <div className="space-y-2">
                {[
                  { key: "isNew" as const, label: "Marcar como Novo", desc: "Badge 'Novo' nos cards" },
                  { key: "isFeatured" as const, label: "Curso em destaque", desc: "Aparece no hero banner" },
                  { key: "published" as const, label: "Publicado", desc: "Visível para os alunos" },
                ].map((item) => (
                  <Toggle key={item.key} label={item.label} description={item.desc}
                    checked={form[item.key] as boolean}
                    onChange={(v) => setForm((p) => ({ ...p, [item.key]: v }))}
                  />
                ))}

                {/* Delete zone */}
                <div className="mt-6 pt-6 border-t border-[#1A1A1A]">
                  <p className="text-xs font-medium text-red-400 mb-2">Zona de perigo</p>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-[8px] border transition-colors w-full justify-center ${
                      confirmDelete
                        ? "bg-red-500/15 border-red-500/30 text-red-400 hover:bg-red-500/20"
                        : "border-[#222222] text-[#888888] hover:border-red-500/30 hover:text-red-400"
                    }`}
                  >
                    {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    {confirmDelete ? "Confirmar exclusão permanente" : "Excluir curso"}
                  </button>
                  {confirmDelete && (
                    <p className="text-[11px] text-[#555555] text-center mt-2">
                      Todos os módulos e aulas serão deletados. Clique novamente para confirmar.
                    </p>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/8 border border-red-500/20 rounded-[8px] text-sm text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        {!success && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#1A1A1A]">
            <button onClick={onClose} className="px-4 py-2 text-sm text-[#888888] hover:text-[#F0F0F0] transition-colors">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 bg-[#FFA902] text-black text-sm font-semibold rounded-[8px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Salvar alterações
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const inputCls = "w-full bg-[#111111] border border-[#222222] rounded-[8px] px-3 py-2.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/50 focus:ring-1 focus:ring-[#FFA902]/20 transition-all duration-150";
const selectCls = "w-full bg-[#111111] border border-[#222222] rounded-[8px] px-3 py-2.5 text-sm text-[#F0F0F0] outline-none focus:border-[#FFA902]/50 transition-all duration-150";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#888888] mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!checked)} className="flex items-center justify-between p-3 bg-[#111111] border border-[#1A1A1A] rounded-[8px] cursor-pointer hover:border-[#222222] transition-colors">
      <div>
        <p className="text-sm font-medium text-[#F0F0F0]">{label}</p>
        <p className="text-[11px] text-[#555555] mt-0.5">{description}</p>
      </div>
      <div className={`w-9 h-5 rounded-full transition-colors duration-200 flex items-center px-0.5 ${checked ? "bg-[#FFA902]" : "bg-[#222222]"}`}>
        <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
      </div>
    </div>
  );
}
