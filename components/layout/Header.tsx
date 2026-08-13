"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, X } from "lucide-react";
import Link from "next/link";
import { useSupabaseUser } from "@/lib/supabase/useSupabaseUser";
import { useRouter } from "next/navigation";

interface Course { id: string; title: string; category: string; thumbnail: string; }

const NOTIFS = [
  { id: 1, text: "Uma nova aula foi adicionada na plataforma!", time: "2h atrás", unread: true },
  { id: 2, text: "Continue sua jornada — você está progredindo muito.", time: "1d atrás", unread: true },
  { id: 3, text: "Bem-vindo ao Instituto Despertamente 🌟", time: "7d atrás", unread: false },
];

interface HeaderProps {
  courses?: Course[];
}

export function Header({ courses = [] }: HeaderProps) {
  const { user } = useSupabaseUser();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "Usuário";
  const unread = NOTIFS.filter((n) => n.unread).length;

  const results = query.length > 1
    ? courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <header className="fixed top-0 right-0 left-0 md:left-[220px] h-16 bg-[#080807]/90 backdrop-blur-xl border-b border-[#111111] z-30 flex items-center justify-between px-4 md:px-6 lg:px-8">
      {/* Greeting */}
      <div className="flex items-center gap-1.5">
        <span className="text-sm text-[#555555]">Bem-vinda,</span>
        <span className="text-sm font-semibold text-[#DDDDDD]">{firstName} ✨</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className="relative">
          <AnimatePresence>
            {searchOpen ? (
              <motion.div initial={{ width: 36 }} animate={{ width: 280 }} exit={{ width: 36 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 bg-[#0D0D0D] border border-[#1A1A1A] rounded-[8px] px-3 py-2 overflow-hidden">
                <Search className="w-3.5 h-3.5 text-[#555555] flex-shrink-0" />
                <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar cursos..." className="flex-1 bg-transparent text-sm text-[#F0F0F0] placeholder-[#444444] outline-none min-w-0" />
                <button onClick={() => { setSearchOpen(false); setQuery(""); }}>
                  <X className="w-3.5 h-3.5 text-[#555555] hover:text-[#888888]" />
                </button>
              </motion.div>
            ) : (
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={() => setSearchOpen(true)}
                className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[#555555] hover:text-[#F0F0F0] hover:bg-[#111111] transition-colors">
                <Search className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {results.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                className="absolute top-full mt-2 right-0 w-[320px] bg-[#0D0D0D] border border-[#1A1A1A] rounded-[12px] shadow-2xl overflow-hidden z-50">
                {results.map((c) => (
                  <Link key={c.id} href={`/curso/${c.id}`} onClick={() => { setSearchOpen(false); setQuery(""); }}>
                    <div className="flex items-center gap-3 px-4 py-3 hover:bg-[#111111] transition-colors">
                      <img src={c.thumbnail} alt={c.title} className="w-10 h-7 object-cover rounded-[6px] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#F0F0F0] truncate">{c.title}</p>
                        <p className="text-xs text-[#555555]">{c.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setNotifOpen((n) => !n)}
            className="w-9 h-9 rounded-[8px] flex items-center justify-center text-[#555555] hover:text-[#F0F0F0] hover:bg-[#111111] transition-colors relative">
            <Bell className="w-4 h-4" />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FFA902]" />}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-[340px] bg-[#0D0D0D] border border-[#1A1A1A] rounded-[12px] shadow-2xl shadow-black/50 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#111111]">
                    <h3 className="text-sm font-semibold text-[#F0F0F0]">Notificações</h3>
                    {unread > 0 && <span className="text-xs text-[#FFA902]">{unread} novas</span>}
                  </div>
                  {NOTIFS.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-[#111111] last:border-0 hover:bg-[#111111] transition-colors ${n.unread ? "bg-[#FFA902]/2" : ""}`}>
                      <div className="flex items-start gap-3">
                        {n.unread && <div className="w-1.5 h-1.5 rounded-full bg-[#FFA902] mt-1.5 flex-shrink-0" />}
                        <div className={n.unread ? "" : "pl-4"}>
                          <p className="text-sm text-[#DDDDDD] leading-snug">{n.text}</p>
                          <p className="text-xs text-[#444444] mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <Link href="/perfil">
          <motion.div whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-full overflow-hidden border border-[#1A1A1A] hover:border-[#FFA902]/40 transition-colors cursor-pointer bg-[#111111] flex items-center justify-center">
            {user?.image ? (
              <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs font-bold text-[#666666]">{(user?.name ?? "U")[0]}</span>
            )}
          </motion.div>
        </Link>
      </div>
    </header>
  );
}
