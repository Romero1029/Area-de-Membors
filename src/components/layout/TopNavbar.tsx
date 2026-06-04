'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, Menu, X, LayoutDashboard, BookOpen, ShoppingBag, Video, Award, User, LogOut, ChevronDown, Rocket } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'
import { IdmWordmark } from './IdmWordmark'
import type { Profile } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'

const navLinks = [
  { href: '/dashboard',   label: 'Início',        icon: LayoutDashboard },
  { href: '/cursos',      label: 'Meus Cursos',   icon: BookOpen },
  { href: '/certificados',label: 'Certificados',  icon: Award },
  { href: '/lancamento',  label: 'Lançamento',    icon: Rocket, highlight: true },
  { href: '/loja',        label: 'Loja',          icon: ShoppingBag, badge: 'Novo' },
  { href: '/ao-vivo',     label: 'Ao Vivo',       icon: Video },
]

interface TopNavbarProps {
  profile: Profile
}

export function TopNavbar({ profile }: TopNavbarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/cursos?busca=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const initials = profile.full_name
    ? profile.full_name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
    : 'U'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 h-14 flex items-center transition-all duration-300',
          scrolled ? 'navbar-scrolled border-b border-[#2a2a2a]' : 'navbar-transparent'
        )}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 flex items-center gap-6">

          {/* Logo */}
          <Link href="/dashboard" className="flex-shrink-0">
            <IdmWordmark size="sm" variant="white" />
          </Link>

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map(({ href, label, badge, highlight }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150',
                  isActive(href)
                    ? 'text-[#c79a3b] bg-[rgba(199,154,59,0.1)]'
                    : highlight
                    ? 'text-[#c79a3b] hover:bg-[rgba(199,154,59,0.08)]'
                    : 'text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#242424]'
                )}
              >
                {label}
                {badge && !isActive(href) && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-[#c79a3b] px-1 py-px text-[9px] font-bold text-[#0f0f0f] leading-none">
                    {badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* Ações direita */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Search — desktop */}
            <div className="hidden md:block">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2 animate-fade-in">
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Buscar cursos..."
                    className="w-48 h-8 text-sm bg-[#242424] border-[#333] text-[#f0f0f0] placeholder:text-[#606060]"
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                    className="text-[#606060] hover:text-[#f0f0f0] transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#242424] transition-colors"
                  aria-label="Buscar"
                >
                  <Search className="h-4.5 w-4.5" />
                </button>
              )}
            </div>

            {/* Notificações */}
            <button
              className="p-2 rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#242424] transition-colors relative"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
            </button>

            {/* Avatar + dropdown — desktop */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hidden md:flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#242424] transition-colors">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#c79a3b] to-[#e8b84b] flex items-center justify-center text-[11px] font-bold text-[#0f0f0f] flex-shrink-0">
                    {initials}
                  </div>
                  <span className="text-xs text-[#a0a0a0] max-w-[80px] truncate hidden lg:block">
                    {profile.full_name?.split(' ')[0] ?? 'Aluno'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-[#606060]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 bg-[#1a1a1a] border-[#2a2a2a] text-[#f0f0f0]"
              >
                <DropdownMenuLabel className="text-[#a0a0a0] font-normal text-xs">
                  {profile.full_name ?? 'Aluno'}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#242424] focus:bg-[#242424]">
                  <Link href="/perfil" className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" /> Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-[#242424] focus:bg-[#242424]">
                  <Link href="/certificados" className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5" /> Certificados
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#2a2a2a]" />
                <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-[#242424] focus:bg-[#242424]" asChild>
                  <form action={signOut}>
                    <button type="submit" className="flex items-center gap-2 w-full">
                      <LogOut className="h-3.5 w-3.5" /> Sair
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hamburger — mobile */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="md:hidden p-2 rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#242424] transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-[#0f0f0f] border-r border-[#2a2a2a] p-0">
                <div className="flex flex-col h-full">
                  {/* Header do Sheet */}
                  <div className="flex items-center justify-between px-5 h-14 border-b border-[#2a2a2a]">
                    <IdmWordmark size="sm" variant="white" />
                    <button onClick={() => setMobileOpen(false)} className="text-[#606060] hover:text-[#f0f0f0]">
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Perfil mobile */}
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2a2a2a]">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#c79a3b] to-[#e8b84b] flex items-center justify-center text-sm font-bold text-[#0f0f0f]">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#f0f0f0] truncate">{profile.full_name ?? 'Aluno'}</p>
                      <p className="text-xs text-[#606060]">{profile.role === 'admin' ? 'Admin' : 'Aluno'}</p>
                    </div>
                  </div>

                  {/* Links mobile */}
                  <nav className="flex-1 px-3 py-4 space-y-1">
                    {[...navLinks, { href: '/certificados', label: 'Certificados', icon: Award }, { href: '/perfil', label: 'Meu Perfil', icon: User }].map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                          isActive(href)
                            ? 'bg-[rgba(199,154,59,0.1)] text-[#c79a3b]'
                            : 'text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-[#1a1a1a]'
                        )}
                      >
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        {label}
                      </Link>
                    ))}
                  </nav>

                  {/* Busca mobile */}
                  <div className="px-5 pb-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                      <Input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar cursos..."
                        className="flex-1 h-9 text-sm bg-[#1a1a1a] border-[#2a2a2a] text-[#f0f0f0] placeholder:text-[#606060]"
                      />
                      <button type="submit" className="px-3 rounded-lg bg-[#c79a3b] text-[#0f0f0f]">
                        <Search className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  {/* Sair mobile */}
                  <div className="px-3 pb-6 border-t border-[#2a2a2a] pt-3">
                    <form action={signOut}>
                      <button type="submit" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/30 transition-colors">
                        <LogOut className="h-4 w-4" /> Sair da conta
                      </button>
                    </form>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Spacer para compensar navbar fixed */}
      <div className="h-14" aria-hidden="true" />
    </>
  )
}
