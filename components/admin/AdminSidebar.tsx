"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Users, CalendarDays, LogOut, Shield, ExternalLink, GraduationCap } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

const NAV = [
  { icon: LayoutDashboard, label: "Visão geral", href: "/admin" },
  { icon: GraduationCap, label: "Formação IDM", href: "/admin/formacao-idm" },
  { icon: BookOpen, label: "Cursos", href: "/cursos" },
  { icon: Users, label: "Alunos", href: "/admin/alunos" },
  { icon: CalendarDays, label: "NPA Presencial", href: "/admin/npa-presencial" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await createBrowserSupabaseClient().auth.signOut({ scope: "global" });
    router.push("/login");
    router.refresh();
  };

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[220px] bg-[#080807] border-r border-[#111111] flex-col z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-[#111111] flex-shrink-0">
        <div className="w-8 h-8 rounded-[10px] bg-[#FFA902] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#FFA902]/20">
          <Shield className="w-4 h-4 text-black" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-[#EEEEEE] tracking-tight leading-none">Painel</p>
          <p className="text-[11px] font-bold text-[#FFA902] tracking-tight leading-none mt-0.5">Admin</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {NAV.map((item) => {
          const on = active(item.href);
          return (
            <Link key={item.label} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-colors duration-150 cursor-pointer ${
                  on ? "bg-[#FFA902]/10 text-[#FFA902]" : "text-[#4A4A4A] hover:text-[#CCCCCC] hover:bg-[#0F0F0F]"
                }`}
              >
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 border-t border-[#111111] space-y-0.5">
        <Link href="/dashboard">
          <div className="flex items-center gap-3 px-3 py-2 rounded-[8px] text-[#4A4A4A] hover:text-[#CCCCCC] hover:bg-[#0F0F0F] transition-colors cursor-pointer">
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">Ver plataforma</span>
          </div>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-[8px] text-[#4A4A4A] hover:text-red-400 hover:bg-red-500/5 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </aside>
  );
}
