'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, ShoppingBag, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', label: 'Início',  icon: LayoutDashboard },
  { href: '/cursos',    label: 'Cursos',  icon: BookOpen },
  { href: '/loja',      label: 'Loja',    icon: ShoppingBag },
  { href: '/perfil',    label: 'Perfil',  icon: User },
]

export function MobileTabBar() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0f0f0f] border-t border-[#2a2a2a]"
      style={{ paddingBottom: 'max(env(safe-area-inset-bottom), 8px)' }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-1">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors"
              style={{
                background: active ? 'rgba(199,154,59,0.1)' : 'transparent',
              }}
            >
              <Icon
                className={cn('h-5 w-5 transition-colors', active ? 'text-[#c79a3b]' : 'text-[#606060]')}
                strokeWidth={active ? 2.5 : 1.8}
              />
              <span
                className={cn('text-[10px] font-medium transition-colors', active ? 'text-[#c79a3b]' : 'text-[#606060]')}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
