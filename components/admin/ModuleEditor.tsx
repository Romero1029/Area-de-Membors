"use client";

import { useState, useRef } from "react";
import {
  Plus, Pencil, Trash2, ChevronDown, ChevronUp,
  GripVertical, Check, X, Loader2, Lock, LockOpen,
  PlayCircle, FileText, Link2, Video, Tv2,
} from "lucide-react";
import {
  createModule, updateModule, deleteModule,
  createLesson, updateLesson, deleteLesson,
} from "@/lib/actions/courses";

type ContentType = "youtube" | "pdf" | "link" | "video";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  locked: boolean;
  videoUrl: string;
  contentType: string;
  description: string;
  order: number;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface ModuleEditorProps {
  modules: Module[];
  courseId: string;
  editMode: boolean;
}

const CONTENT_TYPES: { type: ContentType; label: string; icon: React.ReactNode; placeholder: string; color: string }[] = [
  { type: "youtube", label: "YouTube", icon: <Tv2 className="w-3.5 h-3.5" />, placeholder: "https://youtube.com/watch?v=... ou https://youtu.be/...", color: "text-red-400" },
  { type: "pdf",     label: "PDF",     icon: <FileText className="w-3.5 h-3.5" />, placeholder: "https://... link direto para o PDF", color: "text-blue-400" },
  { type: "link",    label: "Link",    icon: <Link2 className="w-3.5 h-3.5" />,    placeholder: "https://... link externo", color: "text-purple-400" },
  { type: "video",   label: "Vídeo",   icon: <Video className="w-3.5 h-3.5" />,    placeholder: "https://... link direto do vídeo (MP4, Vimeo...)", color: "text-emerald-400" },
];

function getContentConfig(type: string) {
  return CONTENT_TYPES.find((c) => c.type === type) ?? CONTENT_TYPES[0];
}

function ContentTypeIcon({ type, className = "w-3.5 h-3.5" }: { type: string; className?: string }) {
  const config = getContentConfig(type);
  return <span className={config.color}>{config.icon}</span>;
}

export function ModuleEditor({ modules, courseId, editMode }: ModuleEditorProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set([modules[0]?.id ?? ""]));
  const [addingModule, setAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [savingModule, setSavingModule] = useState(false);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return;
    setSavingModule(true);
    await createModule(courseId, newModuleTitle.trim());
    setSavingModule(false);
    setNewModuleTitle("");
    setAddingModule(false);
  };

  return (
    <div className="space-y-2">
      {modules.map((mod) => (
        <ModuleBlock
          key={mod.id}
          module={mod}
          courseId={courseId}
          editMode={editMode}
          isExpanded={expanded.has(mod.id)}
          onToggle={() => toggle(mod.id)}
        />
      ))}

      {editMode && (
        addingModule ? (
          <div className="flex items-center gap-2 p-3 bg-[#111111] border border-[#FFA902]/30 rounded-[10px]">
            <input
              autoFocus
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAddModule(); if (e.key === "Escape") setAddingModule(false); }}
              placeholder="Título do novo módulo..."
              className="flex-1 bg-transparent text-sm text-[#F0F0F0] placeholder-[#444444] outline-none"
            />
            <button onClick={handleAddModule} disabled={savingModule || !newModuleTitle.trim()}
              className="w-7 h-7 rounded-[6px] bg-[#FFA902] flex items-center justify-center text-black hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
              {savingModule ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => setAddingModule(false)} className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[#555555] hover:text-[#F0F0F0] hover:bg-[#1A1A1A] transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setAddingModule(true)}
            className="w-full flex items-center gap-2 px-4 py-3 border border-dashed border-[#2A2A2A] rounded-[10px] text-[#555555] hover:text-[#888888] hover:border-[#333333] transition-all duration-150 text-sm"
          >
            <Plus className="w-4 h-4" />
            Adicionar módulo
          </button>
        )
      )}
    </div>
  );
}

function ModuleBlock({ module, courseId, editMode, isExpanded, onToggle }: {
  module: Module; courseId: string; editMode: boolean; isExpanded: boolean; onToggle: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(module.title);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalDuration = module.lessons.reduce((acc, l) => {
    const [m = 0, s = 0] = l.duration.split(":").map(Number);
    return acc + m * 60 + s;
  }, 0);
  const durationStr = totalDuration > 0 ? `${Math.floor(totalDuration / 60)}min` : "";

  const handleSaveTitle = async () => {
    if (!title.trim() || title === module.title) { setEditing(false); setTitle(module.title); return; }
    setSaving(true);
    await updateModule(module.id, title.trim(), courseId);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setDeleting(true);
    await deleteModule(module.id, courseId);
  };

  return (
    <div className={`bg-[#111111] border rounded-[12px] overflow-hidden transition-colors duration-150 ${editMode ? "border-[#2A2A2A]" : "border-[#1E1E1E]"}`}>
      {/* Module header */}
      <div className={`flex items-center gap-2 px-4 py-3.5 ${editMode ? "hover:bg-[#161616]" : ""} transition-colors`}>
        {editMode && <GripVertical className="w-4 h-4 text-[#333333] cursor-grab flex-shrink-0" />}

        <div className="w-6 h-6 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-[#555555]">{module.order + 1}</span>
        </div>

        {editing ? (
          <input
            ref={inputRef} autoFocus value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => { if (e.key === "Enter") handleSaveTitle(); if (e.key === "Escape") { setEditing(false); setTitle(module.title); } }}
            className="flex-1 bg-transparent text-sm font-semibold text-[#F0F0F0] outline-none border-b border-[#FFA902]/50"
          />
        ) : (
          <button className="flex-1 text-left" onClick={onToggle}>
            <span className="text-sm font-semibold text-[#F0F0F0]">{module.title}</span>
            <span className="text-[11px] text-[#555555] ml-2">
              {module.lessons.length} {module.lessons.length === 1 ? "aula" : "aulas"}{durationStr ? ` · ${durationStr}` : ""}
            </span>
          </button>
        )}

        {editMode && !editing && (
          <div className="flex items-center gap-1">
            <button onClick={() => setEditing(true)}
              className="w-6 h-6 rounded flex items-center justify-center text-[#444444] hover:text-[#FFA902] hover:bg-[#FFA902]/10 transition-colors">
              <Pencil className="w-3 h-3" />
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${confirmDel ? "text-red-400 bg-red-500/10" : "text-[#444444] hover:text-red-400 hover:bg-red-500/10"}`}>
              {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            </button>
          </div>
        )}

        {saving && <Loader2 className="w-3.5 h-3.5 text-[#FFA902] animate-spin flex-shrink-0" />}

        <button onClick={onToggle} className="text-[#444444] hover:text-[#888888] transition-colors flex-shrink-0">
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Lessons */}
      {isExpanded && (
        <div className="border-t border-[#1A1A1A]">
          {module.lessons.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              lesson={lesson}
              index={i}
              courseId={courseId}
              moduleId={module.id}
              editMode={editMode}
            />
          ))}

          {editMode && (
            <div className="px-4 py-2 border-t border-[#1A1A1A]">
              {addingLesson ? (
                <AddLessonForm
                  moduleId={module.id}
                  courseId={courseId}
                  onDone={() => setAddingLesson(false)}
                />
              ) : (
                <button
                  onClick={() => setAddingLesson(true)}
                  className="flex items-center gap-2 text-xs text-[#555555] hover:text-[#FFA902] transition-colors py-2"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar aula
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LessonRow({ lesson, index, courseId, moduleId, editMode }: {
  lesson: Lesson; index: number; courseId: string; moduleId: string; editMode: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: lesson.title,
    duration: lesson.duration,
    videoUrl: lesson.videoUrl,
    contentType: (lesson.contentType || "youtube") as ContentType,
    locked: lesson.locked,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateLesson(lesson.id, courseId, form);
    setSaving(false);
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setDeleting(true);
    await deleteLesson(lesson.id, courseId);
  };

  const handleToggleLock = async () => {
    await updateLesson(lesson.id, courseId, { locked: !lesson.locked });
  };

  const cfg = getContentConfig(form.contentType);
  const currentCfg = getContentConfig(lesson.contentType || "youtube");

  if (editing) {
    return (
      <div className="px-4 py-3 border-b border-[#161616] bg-[#0D0D0D] space-y-3">
        {/* Title + Duration */}
        <div className="flex gap-2">
          <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Título da aula" autoFocus
            className="flex-1 bg-[#111111] border border-[#FFA902]/30 rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] outline-none" />
          <input value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))}
            placeholder="00:00" className="w-20 bg-[#111111] border border-[#222222] rounded-[6px] px-2 py-1.5 text-sm text-[#F0F0F0] outline-none text-center" />
        </div>

        {/* Content type pills */}
        <div>
          <p className="text-[10px] text-[#555555] mb-1.5 uppercase tracking-wider font-medium">Tipo de conteúdo</p>
          <div className="flex gap-1.5 flex-wrap">
            {CONTENT_TYPES.map((ct) => (
              <button
                key={ct.type}
                type="button"
                onClick={() => setForm((p) => ({ ...p, contentType: ct.type }))}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-all border ${
                  form.contentType === ct.type
                    ? "bg-[#FFA902]/15 border-[#FFA902]/40 text-[#FFA902]"
                    : "bg-[#111111] border-[#222222] text-[#555555] hover:text-[#888888] hover:border-[#333333]"
                }`}
              >
                <span className={form.contentType === ct.type ? "text-[#FFA902]" : ct.color}>{ct.icon}</span>
                {ct.label}
              </button>
            ))}
          </div>
        </div>

        {/* URL input */}
        <div className="flex gap-2 items-center">
          <div className={`flex-shrink-0 ${cfg.color}`}>{cfg.icon}</div>
          <input
            value={form.videoUrl}
            onChange={(e) => setForm((p) => ({ ...p, videoUrl: e.target.value }))}
            placeholder={cfg.placeholder}
            className="flex-1 bg-[#111111] border border-[#222222] rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40 transition-colors"
          />
        </div>

        {/* Locked + actions */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-[#888888] cursor-pointer select-none">
            <input type="checkbox" checked={form.locked} onChange={(e) => setForm((p) => ({ ...p, locked: e.target.checked }))} className="accent-[#FFA902]" />
            Aula bloqueada (prévia desativada)
          </label>
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setForm({ title: lesson.title, duration: lesson.duration, videoUrl: lesson.videoUrl, contentType: (lesson.contentType || "youtube") as ContentType, locked: lesson.locked }); }}
              className="px-3 py-1 text-xs text-[#888888] hover:text-[#F0F0F0] transition-colors">Cancelar</button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1 px-3 py-1 bg-[#FFA902] text-black text-xs font-medium rounded-[6px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
              {saving && <Loader2 className="w-3 h-3 animate-spin" />} Salvar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 border-b border-[#161616] last:border-0 group transition-colors duration-100 ${editMode ? "hover:bg-[#161616]" : lesson.locked ? "opacity-50" : "hover:bg-[#0F0F0F]"}`}>
      {editMode && <GripVertical className="w-3.5 h-3.5 text-[#2A2A2A] cursor-grab flex-shrink-0 group-hover:text-[#333333]" />}

      {/* Content type / lock icon */}
      <div className="w-5 flex-shrink-0">
        {lesson.locked
          ? <Lock className="w-3.5 h-3.5 text-[#444444]" />
          : <ContentTypeIcon type={lesson.contentType || "youtube"} />
        }
      </div>

      <span className="text-[11px] text-[#3A3A3A] w-4 flex-shrink-0">{index + 1}</span>

      <span className="flex-1 text-sm text-[#AAAAAA] group-hover:text-[#D0D0D0] transition-colors truncate">
        {lesson.title}
      </span>

      {/* Content type badge (edit mode) */}
      {editMode && (
        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#1A1A1A] flex-shrink-0 ${currentCfg.color}`}>
          {currentCfg.label}
        </span>
      )}

      <span className="text-[11px] text-[#444444] flex-shrink-0">{lesson.duration}</span>

      {editMode && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleToggleLock} title={lesson.locked ? "Desbloquear" : "Bloquear"}
            className="w-5 h-5 rounded flex items-center justify-center text-[#444444] hover:text-[#FFA902] transition-colors">
            {lesson.locked ? <LockOpen className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          </button>
          <button onClick={() => setEditing(true)}
            className="w-5 h-5 rounded flex items-center justify-center text-[#444444] hover:text-[#FFA902] transition-colors">
            <Pencil className="w-3 h-3" />
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${confirmDel ? "text-red-400" : "text-[#444444] hover:text-red-400"}`}>
            {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          </button>
        </div>
      )}
    </div>
  );
}

function AddLessonForm({ moduleId, courseId, onDone }: { moduleId: string; courseId: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [contentType, setContentType] = useState<ContentType>("youtube");
  const [saving, setSaving] = useState(false);

  const cfg = getContentConfig(contentType);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await createLesson(moduleId, courseId, {
      title: title.trim(),
      duration: duration || "00:00",
      videoUrl,
      contentType,
      locked: false,
      description: "",
    });
    setSaving(false);
    onDone();
  };

  return (
    <div className="space-y-2.5 py-2">
      {/* Title + Duration */}
      <div className="flex gap-2">
        <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Escape") onDone(); }}
          placeholder="Título da aula *"
          className="flex-1 bg-[#111111] border border-[#FFA902]/30 rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none" />
        <input value={duration} onChange={(e) => setDuration(e.target.value)}
          placeholder="00:00" className="w-20 bg-[#111111] border border-[#222222] rounded-[6px] px-2 py-1.5 text-sm text-[#F0F0F0] outline-none text-center" />
      </div>

      {/* Content type pills */}
      <div className="flex gap-1.5 flex-wrap">
        {CONTENT_TYPES.map((ct) => (
          <button
            key={ct.type}
            type="button"
            onClick={() => setContentType(ct.type)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-all border ${
              contentType === ct.type
                ? "bg-[#FFA902]/15 border-[#FFA902]/40 text-[#FFA902]"
                : "bg-[#111111] border-[#222222] text-[#555555] hover:text-[#888888] hover:border-[#333333]"
            }`}
          >
            <span className={contentType === ct.type ? "text-[#FFA902]" : ct.color}>{ct.icon}</span>
            {ct.label}
          </button>
        ))}
      </div>

      {/* URL input */}
      <div className="flex gap-2 items-center">
        <div className={`flex-shrink-0 ${cfg.color}`}>{cfg.icon}</div>
        <input
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder={cfg.placeholder}
          className="flex-1 bg-[#111111] border border-[#222222] rounded-[6px] px-3 py-1.5 text-sm text-[#F0F0F0] placeholder-[#444444] outline-none focus:border-[#FFA902]/40 transition-colors"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 justify-end">
        <button onClick={onDone} className="px-3 py-1 text-xs text-[#555555] hover:text-[#888888] transition-colors">Cancelar</button>
        <button onClick={handleSave} disabled={saving || !title.trim()}
          className="flex items-center gap-1 px-3 py-1 bg-[#FFA902] text-black text-xs font-medium rounded-[6px] hover:bg-[#FFB832] disabled:opacity-40 transition-colors">
          {saving && <Loader2 className="w-3 h-3 animate-spin" />} Adicionar aula
        </button>
      </div>
    </div>
  );
}
