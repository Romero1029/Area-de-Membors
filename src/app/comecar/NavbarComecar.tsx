'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, MessageCircle } from 'lucide-react'

const navLinks = [
  { href: '#metodologia', label: 'Método' },
  { href: '#jornadas',    label: 'Jornadas' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#faq',         label: 'FAQ' },
]

const WA_URL = 'https://wa.me/5511999999999?text=Olá! Tenho interesse no Instituto Despertamente.'

export function NavbarComecar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 sm:px-8 h-16 transition-all duration-300 ${
          scrolled || open
            ? 'bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 select-none">
          <Image
            src="/despertamente-simbolo-branco.png"
            alt="IDM"
            width={28}
            height={28}
            className="object-contain"
          />
          <span
            style={{ fontFamily: "'Fraunces', Georgia, serif" }}
            className="text-base font-bold text-[#f0f0f0]"
          >
            Instituto <span className="text-[#c79a3b]">Despertamente</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-[#a0a0a0] hover:text-[#f0f0f0] transition-colors"
          >
            Já tenho conta
          </Link>
          <Link
            href="/register"
            className="text-sm font-bold px-4 py-2 rounded-xl bg-[#c79a3b] text-[#080808] hover:bg-[#e8b84b] transition-colors"
          >
            Começar grátis
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="absolute top-16 left-0 right-0 bg-[#0a0a0a] border-b border-white/5 px-5 py-4 space-y-1"
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="block py-3 px-3 rounded-xl text-[15px] font-medium text-[#a0a0a0] hover:text-[#f0f0f0] hover:bg-white/5 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="pt-3 mt-1 space-y-2 border-t border-white/8">
              <a
                href={WA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 py-3 px-3 rounded-xl text-[15px] font-medium text-[#25D366] hover:bg-[#25D366]/8 transition-colors"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                Falar pelo WhatsApp
              </a>
              <Link
                href="/register"
                className="flex items-center justify-center py-3.5 rounded-xl text-[15px] font-bold bg-[#c79a3b] text-[#080808] hover:bg-[#e8b84b] transition-colors"
                onClick={() => setOpen(false)}
              >
                Começar grátis — é grátis
              </Link>
              <Link
                href="/login"
                className="flex items-center justify-center py-3 rounded-xl text-[15px] font-medium text-[#606060] hover:text-[#a0a0a0] transition-colors"
                onClick={() => setOpen(false)}
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
