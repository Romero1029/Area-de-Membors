import Link from "next/link";
import { Users, BookOpen, CheckCircle2, CalendarDays, ArrowRight } from "lucide-react";
import { getAdminOverviewStats } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const stats = await getAdminOverviewStats();

  const cards = [
    { icon: Users, label: "Membros cadastrados", value: stats.totalMembers, color: "text-[#FFA902]", bg: "bg-[#FFA902]/6 border-[#FFA902]/12" },
    { icon: BookOpen, label: "Cursos", value: stats.totalCourses, color: "text-blue-400", bg: "bg-blue-500/6 border-blue-500/12" },
    { icon: CheckCircle2, label: "Cursos publicados", value: stats.publishedCourses, color: "text-emerald-400", bg: "bg-emerald-500/6 border-emerald-500/12" },
  ];

  const shortcuts = [
    { icon: BookOpen, label: "Gerenciar cursos", description: "Criar, editar módulos e aulas", href: "/cursos" },
    { icon: Users, label: "Gerenciar alunos", description: "Ver membros e o que cada um acessa", href: "/admin/alunos" },
    { icon: CalendarDays, label: "NPA Presencial", description: "Configurar entrega de material do evento", href: "/admin/npa-presencial" },
  ];

  return (
    <div className="px-4 md:px-8 py-8 max-w-[900px]">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-[#F0F0F0] tracking-tight">Visão geral</h1>
        <p className="text-sm text-[#555555] mt-1">Configurações e status da área de membros em produção.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`border rounded-[12px] p-4 ${c.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <c.icon className={`w-3.5 h-3.5 ${c.color}`} />
              <span className="text-xs text-[#888888]">{c.label}</span>
            </div>
            <span className={`text-2xl font-bold ${c.color}`}>{c.value.toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </div>

      {/* Shortcuts */}
      <h2 className="text-xs font-semibold text-[#555555] uppercase tracking-wider mb-3">Configurar</h2>
      <div className="space-y-2">
        {shortcuts.map((s) => (
          <Link key={s.href} href={s.href}>
            <div className="flex items-center gap-4 p-4 bg-[#0D0D0D] border border-[#161616] rounded-[12px] hover:border-[#2A2A2A] transition-colors group">
              <div className="w-9 h-9 rounded-[8px] bg-[#151515] border border-[#222222] flex items-center justify-center flex-shrink-0">
                <s.icon className="w-4 h-4 text-[#888888]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F0F0F0]">{s.label}</p>
                <p className="text-xs text-[#555555] mt-0.5">{s.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#333333] group-hover:text-[#888888] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
