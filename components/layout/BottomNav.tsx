"use client";

import { LayoutDashboard, BookOpen, User, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { icon: LayoutDashboard, label: "Início",    href: "/dashboard" },
  { icon: BookOpen,        label: "Cursos",    href: "/cursos" },
  { icon: Trophy,          label: "Conquistas",href: "/perfil" },
  { icon: User,            label: "Perfil",    href: "/perfil" },
];

export function BottomNav() {
  const pathname = usePathname();

  const active = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard" || pathname === "/"
      : pathname.startsWith(href.split("#")[0]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#070707] border-t border-[#111111] safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {NAV.map((item) => {
          const on = active(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full py-2 relative"
            >
              {on && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#FFA902] rounded-full" />
              )}
              <item.icon
                className={`w-5 h-5 transition-colors ${
                  on ? "text-[#FFA902]" : "text-[#444444]"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  on ? "text-[#FFA902]" : "text-[#444444]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
