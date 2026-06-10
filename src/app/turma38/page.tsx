'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Check, MessageCircle, Video, Award, BookOpen, Zap } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const BENEFICIOS = [
  { icon: MessageCircle, texto: 'Grupo VIP exclusivo no WhatsApp' },
  { icon: BookOpen,       texto: 'Aula introdutória + e-book de apoio' },
  { icon: Video,          texto: '3 aulas ao vivo no YouTube' },
  { icon: Zap,            texto: 'Oferta especial de encerramento' },
  { icon: Award,          texto: 'Certificado de participação' },
]

function SuccessState({ email }: { email: string }) {
  return (
    <div className="min-h-screen bg-[#0D1638] flex items-center justify-center px-6"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)', backgroundSize: '48px 48px' }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-[#FFB800]/15 border border-[#FFB800]/30 flex items-center justify-center mx-auto">
          <Check className="h-7 w-7 text-[#FFB800]" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold text-white">
            Você está dentro.
          </h1>
          <p className="text-sm text-white/40 leading-relaxed">
            Enviamos um link de acesso para <span className="text-white/70">{email}</span>.<br />
            Clique no link para acessar a área de membros.
          </p>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-[#0A1232] p-5 text-left space-y-3">
          <p className="text-xs font-mono uppercase tracking-widest text-white/25">Próximos passos</p>
          {[
            'Abra seu email e clique no link de acesso',
            'Acesse o Grupo VIP no WhatsApp',
            'Assista a aula introdutória',
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs font-mono text-[#FFB800]/60 mt-0.5 w-4 shrink-0">{i + 1}.</span>
              <p className="text-sm text-white/50">{s}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/20">
          Não encontrou o email?{' '}
          <button
            className="text-white/40 underline underline-offset-2 hover:text-white/70"
            onClick={() => window.location.reload()}
          >
            Tentar novamente.
          </button>
        </p>
      </div>
    </div>
  )
}

export default function Turma38Page() {
  const [name, setName]     = useState('')
  const [email, setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')
  const [sent, setSent]     = useState(false)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
        data: { full_name: name.trim() },
        emailRedirectTo: `${window.location.origin}/lancamento`,
      },
    })

    if (err) {
      setError('Ocorreu um erro. Tente novamente.')
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) return <SuccessState email={email} />

  return (
    <div
      className="min-h-screen bg-[#0D1638] text-white overflow-x-hidden"
      style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)', backgroundSize: '48px 48px' }}
    >
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-[#FFB800]/[0.04] blur-[250px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-16 sm:py-24">

        {/* Logo */}
        <div className="mb-14">
          <Link href="/comecar">
            <Image
              src="/despertamente-simbolo-branco.png"
              alt="Instituto Despertamente"
              width={28}
              height={28}
              className="object-contain opacity-60"
            />
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-start">
          {/* ── LEFT: info ── */}
          <div className="space-y-10">
            <div className="space-y-5">
              <p className="text-[11px] font-mono tracking-[0.22em] uppercase text-white/25">
                Instituto Despertamente · Evento gratuito
              </p>
              <h1 className="font-display text-5xl sm:text-6xl font-bold leading-[0.97] tracking-tight">
                Semana do<br />Despertar <span className="text-[#FFB800]">#38</span>
              </h1>
              <div className="w-full h-px bg-white/[0.08]" />
              <p className="text-base text-white/50 leading-relaxed max-w-md">
                3 aulas gratuitas ao vivo sobre Psicanálise, Neurociência e PNL. Entenda por que você repete os mesmos padrões — e como mudar isso de vez.
              </p>
            </div>

            <ul className="space-y-4">
              {BENEFICIOS.map(({ icon: Icon, texto }) => (
                <li key={texto} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#FFB800]/10 flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-[#FFB800]" />
                  </span>
                  <span className="text-sm text-white/50">{texto}</span>
                </li>
              ))}
            </ul>

            <p className="text-xs font-mono text-white/20">Gratuito · Online · Ao vivo</p>
          </div>

          {/* ── RIGHT: form ── */}
          <div className="lg:pt-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0A1232] p-7 sm:p-8 space-y-6">
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-bold text-white">
                  Garantir minha vaga.
                </h2>
                <p className="text-xs text-white/30">
                  Gratuito. Acesso imediato após o cadastro.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-white/25">
                    Seu nome
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Como devemos te chamar?"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#091028] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFB800]/40 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-widest text-white/25">
                    Seu email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="email@exemplo.com"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#091028] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#FFB800]/40 transition-colors"
                  />
                </div>

                {error && <p className="text-xs text-red-400">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-[#FFB800] py-4 text-sm font-bold text-[#0D1638] hover:bg-[#FFC933] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  style={{ boxShadow: '0 8px 32px rgba(255,184,0,0.22)' }}
                >
                  {loading ? 'Enviando...' : (
                    <>Quero participar <ArrowRight className="h-4 w-4" /></>
                  )}
                </button>
              </form>

              <p className="text-[11px] text-white/20 text-center leading-relaxed">
                Você receberá um link de acesso por email.{' '}
                Sem spam. Sem cobrança.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
