"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSupabaseUser } from "@/lib/supabase/useSupabaseUser";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import {
  Shield,
  Plus,
  LogOut,
  ChevronUp,
  Pencil,
  Users,
} from "lucide-react";
import Link from "next/link";
import { CreateCourseModal } from "./CreateCourseModal";

interface AdminBarProps {
  editMode: boolean;
  onToggleEditMode: () => void;
}

export function AdminBar({ editMode, onToggleEditMode }: AdminBarProps) {
  const router = useRouter();
  const { isAdmin } = useSupabaseUser();
  const [expanded, setExpanded] = useState(true);
  const [showCreateCourse, setShowCreateCourse] = useState(false);

  const handleSignOut = async () => {
    await createBrowserSupabaseClient().auth.signOut({ scope: "global" });
    router.push("/login");
    router.refresh();
  };

  if (!isAdmin) return null;

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#FFA902]/30 rounded-full pl-3 pr-2 py-2 shadow-2xl shadow-[#FFA902]/10">
              {/* Admin badge */}
              <div className="flex items-center gap-1.5 mr-1">
                <Shield className="w-3.5 h-3.5 text-[#FFA902]" />
                <span className="text-[11px] font-semibold text-[#FFA902] tracking-wide uppercase">
                  Admin
                </span>
              </div>

              <div className="w-px h-4 bg-[#222222]" />

              {/* Edit mode toggle */}
              <button
                onClick={onToggleEditMode}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 ${
                  editMode
                    ? "bg-[#FFA902] text-black"
                    : "text-[#888888] hover:text-[#F0F0F0] hover:bg-[#1A1A1A]"
                }`}
              >
                <Pencil className="w-3 h-3" />
                {editMode ? "Editando" : "Modo edição"}
              </button>

              {/* Add course */}
              <button
                onClick={() => setShowCreateCourse(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#888888] hover:text-[#F0F0F0] hover:bg-[#1A1A1A] transition-colors duration-150"
              >
                <Plus className="w-3 h-3" />
                Novo curso
              </button>

              {/* Students */}
              <Link href="/admin/alunos">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#888888] hover:text-[#F0F0F0] hover:bg-[#1A1A1A] transition-colors duration-150 cursor-pointer">
                  <Users className="w-3 h-3" />
                  Alunos
                </span>
              </Link>

              <div className="w-px h-4 bg-[#222222]" />

              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-[#888888] hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150"
              >
                <LogOut className="w-3 h-3" />
                Sair
              </button>

              {/* Collapse */}
              <button
                onClick={() => setExpanded(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#555555] hover:text-[#888888] hover:bg-[#1A1A1A] transition-colors"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed dot */}
      <AnimatePresence>
        {!expanded && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setExpanded(true)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-10 h-10 rounded-full bg-[#FFA902] flex items-center justify-center shadow-lg shadow-[#FFA902]/30 hover:bg-[#FFB832] transition-colors"
          >
            <Shield className="w-4 h-4 text-black" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Create course modal */}
      <AnimatePresence>
        {showCreateCourse && (
          <CreateCourseModal onClose={() => setShowCreateCourse(false)} />
        )}
      </AnimatePresence>
    </>
  );
}
