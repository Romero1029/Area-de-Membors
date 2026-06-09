'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { href: '#projetos',     label: 'Projetos' },
  { href: '#formacao',     label: 'Formação' },
  { href: '#certificados', label: 'Certificados' },
  { href: '#depoimentos',  label: 'Depoimentos' },
]

export function NavbarComecar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 sm:px-8 h-16 transition-all duration-300 ${
          scrolled || open
            ? 'bg-[#0B0F1A]/96 backdrop-blur-xl border-b border-white/6 shadow-lg'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 select-none">
          <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={28} height={28} className="object-contain" />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-base font-bold text-white">
            Instituto <span className="text-[#FFB800]">Despertamente</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map(l => (
            <a key={l.href} href={l.href}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-white/50 hover:text-white transition-colors">
            Já tenho conta
          </Link>
          <Link href="/turma38"
            className="text-sm font-bold px-4 py-2 rounded-xl bg-[#FFB800] text-[#0B0F1A] hover:bg-[#FFC933] transition-colors">
            Começar grátis
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/6 transition-colors"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="absolute top-16 left-0 right-0 bg-[#0B0F1A] border-b border-white/8 px-5 py-4 space-y-1"
            onClick={e => e.stopPropagation()}
          >
            {navLinks.map(l => (
              <a key={l.href} href={l.href}
                className="block py-3 px-3 rounded-xl text-[15px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setOpen(false)}>
                {l.label}
              </a>
            ))}
            <div className="pt-3 mt-1 space-y-2 border-t border-white/8">
              <Link href="/turma38"
                className="flex items-center justify-center py-3.5 rounded-xl text-[15px] font-bold bg-[#FFB800] text-[#0B0F1A] hover:bg-[#FFC933] transition-colors"
                onClick={() => setOpen(false)}>
                Começar grátis
              </Link>
              <Link href="/login"
                className="flex items-center justify-center py-3 rounded-xl text-[15px] font-medium text-white/40 hover:text-white/70 transition-colors"
                onClick={() => setOpen(false)}>
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
