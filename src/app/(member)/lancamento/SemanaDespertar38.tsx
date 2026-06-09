'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Check, Lock, MessageCircle, ChevronRight,
  Play, Download, Video, Calendar, Bell,
  Award, ExternalLink, ShoppingBag,
} from 'lucide-react'

// ─────────────────────────────────────────────
// CONFIG — edite aqui sem tocar no restante
// ─────────────────────────────────────────────

const WA_GROUP_URL = 'https://chat.whatsapp.com/XXXXXXXXXX'
const INTRO_VIDEO_ID = ''          // ex: 'dQw4w9WgXcQ'
const EBOOK_URL = '#'              // link para download do e-book

const OFERTA = {
  nome: 'Em breve',
  descricao: 'O produto low ticket será anunciado durante a Semana do Despertar. Fique de olho!',
  preco: 'A confirmar',
  url: '#',
  ativo: false,                    // mude para true quando tiver o produto
}

const AULAS: Aula[] = [
  {
    id: 1,
    titulo: 'Aula 1 — A Raiz dos Seus Padrões',
    data: 'A confirmar',
    horario: '20h (Horário de Brasília)',
    youtubeUrl: 'https://youtube.com/@institutodespertamente',
    gcal: {
      titulo: 'Semana do Despertar #38 — Aula 1',
      inicio: '20250110T230000Z',
      fim:    '20250111T010000Z',
      desc:   'Aula 1 da Semana do Despertar #38 · Instituto Despertamente',
    },
  },
  {
    id: 2,
    titulo: 'Aula 2 — Reprogramando o Inconsciente',
    data: 'A confirmar',
    horario: '20h (Horário de Brasília)',
    youtubeUrl: 'https://youtube.com/@institutodespertamente',
    gcal: {
      titulo: 'Semana do Despertar #38 — Aula 2',
      inicio: '20250112T230000Z',
      fim:    '20250113T010000Z',
      desc:   'Aula 2 da Semana do Despertar #38 · Instituto Despertamente',
    },
  },
  {
    id: 3,
    titulo: 'Aula 3 — Transformação em Ação',
    data: 'A confirmar',
    horario: '20h (Horário de Brasília)',
    youtubeUrl: 'https://youtube.com/@institutodespertamente',
    gcal: {
      titulo: 'Semana do Despertar #38 — Aula 3',
      inicio: '20250114T230000Z',
      fim:    '20250115T010000Z',
      desc:   'Aula 3 da Semana do Despertar #38 · Instituto Despertamente',
    },
  },
]

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Aula {
  id: number
  titulo: string
  data: string
  horario: string
  youtubeUrl: string
  gcal: { titulo: string; inicio: string; fim: string; desc: string }
}

interface Progress {
  step1_vip:   boolean
  step2_intro: boolean
  step3_oferta: boolean
  step4_aula1: boolean
  step4_aula2: boolean
  step4_aula3: boolean
}

const EMPTY: Progress = {
  step1_vip: false, step2_intro: false, step3_oferta: false,
  step4_aula1: false, step4_aula2: false, step4_aula3: false,
}

const STORAGE_KEY = 'sdw38_progress'

// ─────────────────────────────────────────────
// CALENDAR UTIL
// ─────────────────────────────────────────────

function openCalendar(aula: Aula) {
  const isIOS     = /iPhone|iPad|iPod/.test(navigator.userAgent)
  const url       = aula.youtubeUrl
  const { titulo, inicio, fim, desc } = aula.gcal
  const descFull  = `${desc}\n\nAssista em: ${url}`

  if (isIOS) {
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//IDM//SDW38//PT',
      'BEGIN:VEVENT',
      `SUMMARY:${titulo}`,
      `DTSTART:${inicio}`,
      `DTEND:${fim}`,
      `DESCRIPTION:${descFull.replace(/\n/g, '\\n')}`,
      `URL:${url}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n')

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const a    = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(blob),
      download: `sdw38-aula${aula.id}.ics`,
    })
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    return
  }

  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${inicio}/${fim}&details=${encodeURIComponent(descFull)}&location=${encodeURIComponent(url)}`
  window.open(gcalUrl, '_blank', 'noopener')
}

// ─────────────────────────────────────────────
// STEP CARD PRIMITIVE
// ─────────────────────────────────────────────

type StepStatus = 'locked' | 'available' | 'done'

function StepCard({
  numero, titulo, status, children,
}: {
  numero: number
  titulo: string
  status: StepStatus
  children?: React.ReactNode
}) {
  const colors = {
    locked:    { border: 'border-white/6',         ring: 'border-white/15 bg-white/4 text-[#404040]' },
    available: { border: 'border-[#c79a3b]/30',    ring: 'border-[#c79a3b]/40 bg-[#c79a3b]/10 text-[#c79a3b]' },
    done:      { border: 'border-[#22c55e]/20',    ring: 'border-[#22c55e]/30 bg-[#22c55e]/8 text-[#22c55e]' },
  }[status]

  return (
    <div className={`rounded-2xl border ${colors.border} bg-[#0d0d0d] overflow-hidden transition-all duration-300 ${status === 'locked' ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-4 px-6 py-5">
        <div className={`w-8 h-8 rounded-full border-2 ${colors.ring} flex items-center justify-center shrink-0`}>
          {status === 'done'   ? <Check className="h-3.5 w-3.5" /> :
           status === 'locked' ? <Lock  className="h-3 w-3" /> :
           <span className="text-xs font-bold">{numero}</span>}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#e0e0e0] leading-snug">{titulo}</p>
          {status === 'locked' && (
            <p className="text-[11px] text-[#404040] mt-0.5">Complete o passo anterior para desbloquear.</p>
          )}
          {status === 'done' && (
            <p className="text-[11px] text-[#22c55e]/70 mt-0.5">Concluído</p>
          )}
        </div>
      </div>
      {status !== 'locked' && children && (
        <div className="border-t border-white/5 px-6 pb-6 pt-5">
          {children}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

export function SemanaDespertar38({ firstName }: { firstName: string }) {
  const [progress, setProgress] = useState<Progress>(EMPTY)
  const [hydrated, setHydrated]  = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProgress({ ...EMPTY, ...JSON.parse(raw) })
    } catch {}
    setHydrated(true)
  }, [])

  const mark = useCallback((key: keyof Progress) => {
    setProgress(prev => {
      const next = { ...prev, [key]: true }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  if (!hydrated) return null

  const { step1_vip, step2_intro, step3_oferta, step4_aula1, step4_aula2, step4_aula3 } = progress
  const todasAulasFeitas = step4_aula1 && step4_aula2 && step4_aula3

  // Status de cada step
  const s1: StepStatus = step1_vip ? 'done' : 'available'
  const s2: StepStatus = !step1_vip ? 'locked' : step2_intro ? 'done' : 'available'
  const s3: StepStatus = !step2_intro ? 'locked' : step3_oferta ? 'done' : 'available'
  const s4: StepStatus = !step3_oferta ? 'locked' : todasAulasFeitas ? 'done' : 'available'
  const s5: StepStatus = !todasAulasFeitas ? 'locked' : 'available'

  return (
    <div className="min-h-screen w-full bg-[#0f0f0f]">
      <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 py-10 pb-24 space-y-4">

        {/* Header */}
        <div className="space-y-1 mb-8">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#404040]">
            Instituto Despertamente
          </p>
          <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-3xl sm:text-4xl font-bold text-[#f0f0f0]">
            Semana do Despertar <span className="text-[#c79a3b]">#38</span>
          </h1>
          <p className="text-sm text-[#505050]">Olá, {firstName}! Siga os passos abaixo.</p>
        </div>

        {/* ── PASSO 1: GRUPO VIP ─────────────── */}
        <StepCard numero={1} titulo="Grupo VIP" status={s1}>
          <a
            href={WA_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => mark('step1_vip')}
            className="group flex items-center gap-4 rounded-xl border border-[#25D366]/20 bg-[#25D366]/6 p-4 hover:bg-[#25D366]/10 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#f0f0f0]">Grupo Exclusivo — Turma #38</p>
              <p className="text-xs text-[#606060] mt-0.5">Avisos, conteúdos e comunidade de alunos.</p>
            </div>
            <div className="flex items-center gap-1 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white shrink-0">
              Entrar <ChevronRight className="h-3 w-3" />
            </div>
          </a>
          {!step1_vip && (
            <button
              onClick={() => mark('step1_vip')}
              className="mt-3 w-full text-xs text-[#383838] hover:text-[#606060] transition-colors py-2"
            >
              Já entrei no grupo →
            </button>
          )}
        </StepCard>

        {/* ── PASSO 2: AULA INTRODUTÓRIA ─────── */}
        <StepCard numero={2} titulo="Aula Introdutória" status={s2}>
          {/* Video */}
          {INTRO_VIDEO_ID ? (
            <div className="rounded-xl overflow-hidden bg-black aspect-video mb-4">
              <iframe
                src={`https://www.youtube.com/embed/${INTRO_VIDEO_ID}`}
                title="Aula Introdutória"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-white/6 bg-[#0a0a0a] aspect-video flex flex-col items-center justify-center gap-2 mb-4">
              <Play className="h-8 w-8 text-[#303030]" />
              <p className="text-xs text-[#404040]">Aula em breve</p>
            </div>
          )}

          {/* E-book */}
          <a
            href={EBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-white/8 bg-[#0a0a0a] p-4 hover:border-white/15 transition-colors group"
          >
            <div className="w-9 h-9 rounded-lg bg-[#c79a3b]/10 flex items-center justify-center shrink-0">
              <Download className="h-4 w-4 text-[#c79a3b]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#d0d0d0] group-hover:text-[#f0f0f0] transition-colors">
                Material de Apoio — E-book
              </p>
              <p className="text-xs text-[#484848] mt-0.5">Baixe o material complementar da aula.</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-[#404040] shrink-0" />
          </a>

          {!step2_intro && (
            <button
              onClick={() => mark('step2_intro')}
              className="mt-4 w-full rounded-xl border border-[#c79a3b]/20 py-3 text-xs font-semibold text-[#c79a3b] hover:bg-[#c79a3b]/6 transition-colors"
            >
              ✓ Concluí a aula introdutória
            </button>
          )}
        </StepCard>

        {/* ── PASSO 3: OFERTA ────────────────── */}
        <StepCard numero={3} titulo="Oferta Especial" status={s3}>
          {OFERTA.ativo ? (
            <div className="space-y-5">
              <div className="h-px bg-gradient-to-r from-[#c79a3b] to-[#e8b84b]" />
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#c79a3b]">
                  Oferta exclusiva para participantes
                </span>
                <h3 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xl font-bold text-[#f0f0f0]">
                  {OFERTA.nome}
                </h3>
                <p className="text-sm text-[#606060] leading-relaxed">{OFERTA.descricao}</p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <p className="text-3xl font-bold text-[#c79a3b]">{OFERTA.preco}</p>
                <a
                  href={OFERTA.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => mark('step3_oferta')}
                  className="flex items-center gap-2 rounded-xl bg-[#c79a3b] px-5 py-3 text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Quero garantir
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-[#505050] leading-relaxed">{OFERTA.descricao}</p>
              <button
                onClick={() => mark('step3_oferta')}
                className="w-full rounded-xl border border-[#c79a3b]/20 py-3 text-xs font-semibold text-[#c79a3b] hover:bg-[#c79a3b]/6 transition-colors"
              >
                ✓ Entendi, continuar
              </button>
            </div>
          )}
        </StepCard>

        {/* ── PASSO 4: 3 AULAS AO VIVO ───────── */}
        <StepCard numero={4} titulo="3 Aulas ao Vivo" status={s4}>
          <div className="space-y-3">
            {AULAS.map((aula, i) => {
              const aulaKey = `step4_aula${aula.id}` as keyof Progress
              const aулаFei = progress[aulaKey]

              return (
                <div
                  key={aula.id}
                  className={`rounded-xl border ${aулаFei ? 'border-[#22c55e]/20 bg-[#22c55e]/4' : 'border-white/8 bg-[#0a0a0a]'} p-4 space-y-3 transition-colors`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-mono text-[#404040]">Aula {aula.id}</p>
                      <p className="text-sm font-semibold text-[#d0d0d0] leading-snug">{aula.titulo}</p>
                      <p className="text-xs text-[#484848]">{aula.data} · {aula.horario}</p>
                    </div>
                    {aулаFei && (
                      <div className="w-6 h-6 rounded-full bg-[#22c55e]/20 flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 text-[#22c55e]" />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Ativar lembrete no YouTube */}
                    <a
                      href={aula.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => mark(aulaKey)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0000]/10 border border-[#FF0000]/20 px-3 py-1.5 text-[11px] font-semibold text-[#FF6666] hover:bg-[#FF0000]/15 transition-colors"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Ativar lembrete
                      <Bell className="h-3 w-3" />
                    </a>

                    {/* Marcar no calendário */}
                    <button
                      onClick={() => openCalendar(aula)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-semibold text-[#a0a0a0] hover:border-white/20 hover:text-[#d0d0d0] transition-colors"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Marcar no calendário
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-[11px] text-[#383838] mt-3">
            Clique em "Ativar lembrete" para ser notificado quando a aula começar no YouTube. O calendário detecta automaticamente iOS, Android ou desktop.
          </p>
        </StepCard>

        {/* ── PASSO 5: CERTIFICADO ───────────── */}
        <StepCard numero={5} titulo="Certificado de Participação" status={s5}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 flex items-center justify-center shrink-0">
              <Award className="h-7 w-7 text-[#c79a3b]" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-[#f0f0f0]">
                Certificado da Semana do Despertar #38
              </p>
              <p className="text-xs text-[#505050] leading-relaxed">
                Disponível após a conclusão das 3 aulas. Resgate com as palavras-chave reveladas ao vivo.
              </p>
            </div>
            <Link
              href="/certificados"
              className="flex items-center gap-2 rounded-xl bg-[#c79a3b] px-5 py-3 text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors shrink-0"
            >
              <Award className="h-4 w-4" />
              Resgatar
            </Link>
          </div>
        </StepCard>

      </div>
    </div>
  )
}
