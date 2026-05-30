'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, User, Award, Video, LogOut, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'
import { IdmWordmark } from './IdmWordmark'
import type { Profile } from '@/types'

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/lancamento', label: 'Lançamento Gratuito', icon: Rocket, highlight: true },
  { href: '/cursos', label: 'Meus Cursos', icon: BookOpen },
  { href: '/ao-vivo', label: 'Aulas ao Vivo', icon: Video },
  { href: '/certificados', label: 'Certificados', icon: Award },
  { href: '/perfil', label: 'Meu Perfil', icon: User },
]

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0 sticky top-0 h-screen overflow-y-auto"
      style={{ background: '#fffaf3', borderRight: '1px solid rgba(23,36,50,0.08)' }}
    >
      {/* Wordmark */}
      <div className="flex items-center px-5 h-16 shrink-0" style={{ borderBottom: '1px solid rgba(23,36,50,0.07)' }}>
        <IdmWordmark size="md" />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, highlight }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
                active ? 'text-white'
                : highlight ? 'hover:bg-[rgba(199,154,59,0.08)]'
                : 'text-[#5f6b78] hover:text-[#1a2430] hover:bg-[rgba(23,36,50,0.04)]'
              )}
              style={active ? {
                background: 'linear-gradient(135deg, #1a2430 0%, #2d3f52 100%)',
                boxShadow: '0 4px 12px rgba(23,36,50,0.2)',
              } : highlight ? { color: '#c79a3b' } : undefined}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={active ? { background: 'rgba(255,255,255,0.12)' } : { background: 'rgba(23,36,50,0.05)' }}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
              </span>
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Usuário */}
      <div className="px-3 pb-5 space-y-1" style={{ borderTop: '1px solid rgba(23,36,50,0.07)', paddingTop: '12px' }}>
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'rgba(23,36,50,0.03)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}>
            {profile.full_name?.charAt(0)?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#1a2430] truncate leading-tight">{profile.full_name ?? 'Usuário'}</p>
            <p className="text-xs text-[#5f6b78] leading-tight">{profile.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
          </div>
        </div>
        <form action={signOut}>
          <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-[#5f6b78] hover:text-red-500 hover:bg-red-50 transition-all">
            <LogOut className="w-4 h-4 shrink-0" />Sair da conta
          </button>
        </form>
      </div>
    </aside>
  )
}
