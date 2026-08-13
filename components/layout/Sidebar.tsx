"use client";

import { motion } from "framer-motion";
import { LayoutDashboard, BookOpen, User, Trophy, Settings, LogOut, Sparkles, Shield, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSupabaseUser } from "@/lib/supabase/useSupabaseUser";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const NAV = [
  { icon: LayoutDashboard, label: "Início",      href: "/dashboard" },
  { icon: GraduationCap,   label: "Formação IDM", href: "/formacao" },
  { icon: BookOpen,        label: "Cursos",      href: "/cursos" },
  { icon: Trophy,          label: "Conquistas",  href: "/perfil#conquistas" },
  { icon: User,            label: "Meu Perfil",  href: "/perfil" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAdmin } = useSupabaseUser();

  const handleSignOut = async () => {
    // scope: "global" revoga o refresh token no servidor (não só limpa localmente) —
    // evita que um token roubado continue válido depois do logout.
    await createBrowserSupabaseClient().auth.signOut({ scope: "global" });
    router.push("/login");
    router.refresh();
  };

  const active = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" || pathname === "/" : pathname.startsWith(href.split("#")[0]);

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] bg-[#080807] border-r border-[#111111] flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#111111] flex-shrink-0">
        <div className="w-8 h-8 rounded-[10px] bg-[#FFA902] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#FFA902]/20">
          <Sparkles className="w-4 h-4 text-black" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-[#EEEEEE] tracking-tight leading-none">Instituto</p>
          <p className="text-[11px] font-bold text-[#FFA902] tracking-tight leading-none mt-0.5">Despertamente</p>
        </div>
        {isAdmin && (
          <div className="ml-auto flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-[#FFA902]/50" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const on = active(item.href);
          return (
            <Link key={item.label} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                transition={{ duration: 0.1 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all duration-150 cursor-pointer ${
                  on
                    ? "bg-[#FFA902]/10 text-[#FFA902]"
                    : "text-[#4A4A4A] hover:text-[#CCCCCC] hover:bg-[#0F0F0F]"
                }`}
              >
                {on && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#FFA902] rounded-full"
                  />
                )}
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Inspirational widget */}
      <div className="mx-3 mb-3">
        <div className="relative overflow-hidden rounded-[12px] p-4 bg-gradient-to-br from-[#FFA902]/8 via-[#FF8C00]/5 to-violet-500/5 border border-[#FFA902]/10">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFA902]/5 rounded-full blur-xl" />
          <Sparkles className="w-3.5 h-3.5 text-[#FFA902] mb-2" />
          <p className="text-[11px] font-semibold text-[#FFA902] leading-snug">Desperte seu potencial</p>
          <p className="text-[10px] text-[#444444] mt-1 leading-relaxed">Cada aula é um passo na sua evolução interior.</p>
        </div>
      </div>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-[#111111] space-y-0.5">
        {isAdmin && (
          <Link href="/admin/alunos">
            <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[#4A4A4A] hover:text-[#FFA902] hover:bg-[#FFA902]/5 transition-all cursor-pointer">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">Gerenciar Alunos</span>
            </div>
          </Link>
        )}
        <Link href="/configuracoes">
          <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[#4A4A4A] hover:text-[#CCCCCC] hover:bg-[#0F0F0F] transition-colors cursor-pointer">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Configurações</span>
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[#4A4A4A] hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair</span>
        </button>

        {/* User */}
        {user && (
          <Link href="/perfil">
            <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-[10px] bg-[#0D0D0D] border border-[#161616] hover:border-[#222222] transition-colors cursor-pointer">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#FFA902]/20 to-violet-500/20 border border-[#2A2A2A] flex items-center justify-center flex-shrink-0 overflow-hidden">
                {user.image ? (
                  <img src={user.image} alt={user.name ?? ""} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[11px] font-bold text-[#FFA902]">{(user.name ?? "U")[0]}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#AAAAAA] truncate">{user.name}</p>
                <p className="text-[10px] text-[#3A3A3A] truncate">{user.email}</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </aside>
  );
}
