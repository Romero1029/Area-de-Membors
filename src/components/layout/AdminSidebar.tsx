'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, Sparkles, BarChart3, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'
import type { Profile } from '@/types'

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: BarChart3 },
  { href: '/admin/lancamento', label: 'Lançamento', icon: Rocket },
  { href: '/admin/produtos', label: 'Produtos', icon: BookOpen },
  { href: '/admin/alunos', label: 'Alunos', icon: Users },
  { href: '/admin/configuracoes', label: 'Configurações', icon: Settings },
]

export function AdminSidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 sticky top-0 h-screen overflow-y-auto bg-white" style={{ borderRight: '1px solid #E8E6E0' }}>
      {/* Logo + badge admin */}
      <div className="flex items-center gap-3 px-5 h-16 shrink-0" style={{ borderBottom: '1px solid #F0EEE9' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#FFA902' }}>
          <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-bold text-gray-900">Despertamente</p>
            <span className="text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded uppercase" style={{ background: '#FFF8E8', color: '#B87800' }}>
              ADMIN
            </span>
          </div>
          <p className="text-[11px] text-gray-400">Painel administrativo</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {adminNavItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
          return (
            <Link key={href} href={href}
              className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all', active ? 'text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50')}
              style={active ? { background: '#FFA902' } : undefined}>
              <Icon className="w-4 h-4 shrink-0" strokeWidth={active ? 2.5 : 2} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-5 space-y-1" style={{ borderTop: '1px solid #F0EEE9', paddingTop: '12px' }}>
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all">
          <LayoutDashboard className="w-4 h-4" />
          Área do Aluno
        </Link>
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4" />Sair
          </button>
        </form>
      </div>
    </aside>
  )
}
