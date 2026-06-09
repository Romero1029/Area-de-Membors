'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Check, Lock, MessageCircle, ChevronRight,
  Play, Download, Video, Calendar, Bell,
  Award, ExternalLink, ShoppingBag, Sparkles, X, Zap,
} from 'lucide-react'

// ─────────────────────────────────────────────
// CONFIG — edite aqui sem tocar no restante
// ─────────────────────────────────────────────

const WA_GROUP_URL   = 'https://chat.whatsapp.com/XXXXXXXXXX'
const INTRO_VIDEO_ID = ''
const EBOOK_URL      = '#'
const BANNER_URL     = ''  // ex: '/banner-sdw38.png' — deixe '' para usar placeholder

const OFERTA = {
  ativo: false,
  atencao:    'Você acabou de provar que é diferente.',
  interesse:  'A maioria das pessoas para na teoria. Você foi até aqui — e isso muda tudo. Agora existe um caminho mais rápido para ir além.',
  nome:       'Nome do produto aqui',
  descricao:  'Uma frase de impacto sobre a transformação que o produto entrega.',
  beneficios: [
    'O que a pessoa vai conseguir fazer',
    'Resultado específico em X tempo',
    'O que ela vai parar de sofrer',
    'Bônus ou acesso exclusivo',
  ],
  preco_original: 'R$ 297',
  preco:          'R$ 47',
  parcelamento:   'ou 3× de R$ 16,90',
  urgencia:       'Disponível só durante a Semana do Despertar.',
  url:            '#',
}

const AULAS: Aula[] = [
  {
    id: 1,
    titulo: 'Aula 1 — A Raiz dos Seus Padrões',
    data: 'A confirmar',
    horario: '20h (Horário de Brasília)',
    youtubeUrl: 'https://youtube.com/@institutodespertamente',
    gcal: { titulo: 'SDW #38 — Aula 1', inicio: '20250110T230000Z', fim: '20250111T010000Z', desc: 'Aula 1 da Semana do Despertar #38 · IDM' },
  },
  {
    id: 2,
    titulo: 'Aula 2 — Reprogramando o Inconsciente',
    data: 'A confirmar',
    horario: '20h (Horário de Brasília)',
    youtubeUrl: 'https://youtube.com/@institutodespertamente',
    gcal: { titulo: 'SDW #38 — Aula 2', inicio: '20250112T230000Z', fim: '20250113T010000Z', desc: 'Aula 2 da Semana do Despertar #38 · IDM' },
  },
  {
    id: 3,
    titulo: 'Aula 3 — Transformação em Ação',
    data: 'A confirmar',
    horario: '20h (Horário de Brasília)',
    youtubeUrl: 'https://youtube.com/@institutodespertamente',
    gcal: { titulo: 'SDW #38 — Aula 3', inicio: '20250114T230000Z', fim: '20250115T010000Z', desc: 'Aula 3 da Semana do Despertar #38 · IDM' },
  },
]

// XP por passo (Zichermann & Cunningham — "Gamification by Design")
const XP_PER_STEP = 200
const TOTAL_STEPS  = 5

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface Aula {
  id: number; titulo: string; data: string; horario: string; youtubeUrl: string
  gcal: { titulo: string; inicio: string; fim: string; desc: string }
}
interface Progress {
  step1_vip: boolean; step2_intro: boolean
  step3_modal_visto: boolean; step3_oferta: boolean
  step4_aula1: boolean; step4_aula2: boolean; step4_aula3: boolean
}
const EMPTY: Progress = {
  step1_vip: false, step2_intro: false,
  step3_modal_visto: false, step3_oferta: false,
  step4_aula1: false, step4_aula2: false, step4_aula3: false,
}
const STORAGE_KEY = 'sdw38_progress'
type StepStatus = 'locked' | 'available' | 'done'

// ─────────────────────────────────────────────
// CALENDAR UTIL
// ─────────────────────────────────────────────
function openCalendar(aula: Aula) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
  const { titulo, inicio, fim, desc } = aula.gcal
  const descFull = `${desc}\n\nAssista em: ${aula.youtubeUrl}`
  if (isIOS) {
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//IDM//SDW38//PT','BEGIN:VEVENT',
      `SUMMARY:${titulo}`,`DTSTART:${inicio}`,`DTEND:${fim}`,
      `DESCRIPTION:${descFull.replace(/\n/g,'\\n')}`,`URL:${aula.youtubeUrl}`,
      'END:VEVENT','END:VCALENDAR'].join('\r\n')
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `sdw38-aula${aula.id}.ics` })
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    return
  }
  window.open(
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(titulo)}&dates=${inicio}/${fim}&details=${encodeURIComponent(descFull)}&location=${encodeURIComponent(aula.youtubeUrl)}`,
    '_blank','noopener'
  )
}

// ─────────────────────────────────────────────
// PROGRESS TRACKER
// Ref: Zeigarnik Effect — tarefas incompletas criam
// tensão motivacional que impulsiona conclusão
// ─────────────────────────────────────────────
function ProgressTracker({ done, total, xp }: { done: number; total: number; xp: number }) {
  const pct = Math.round((done / total) * 100)
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-[#c79a3b]" />
          <span className="text-sm font-semibold text-[#c79a3b]">{xp} XP</span>
          <span className="text-xs text-[#404040]">· {done}/{total} etapas</span>
        </div>
        <span className="text-xs font-mono text-[#404040]">{pct}%</span>
      </div>
      {/* Track */}
      <div className="h-1.5 w-full rounded-full bg-white/6 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #c79a3b, #e8b84b)' }}
        />
      </div>
      {/* Milestones */}
      <div className="flex justify-between">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors duration-500 ${i < done ? 'bg-[#c79a3b]' : 'bg-white/10'}`} />
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP NUMBER BADGE
// Ref: Self-Determination Theory (Deci & Ryan) —
// senso de competência via feedback visual claro
// ─────────────────────────────────────────────
function StepBadge({ numero, status }: { numero: number; status: StepStatus }) {
  if (status === 'done') {
    return (
      <div className="w-10 h-10 rounded-full bg-[#22c55e]/15 border-2 border-[#22c55e]/40 flex items-center justify-center shrink-0">
        <Check className="h-4 w-4 text-[#22c55e]" />
      </div>
    )
  }
  if (status === 'locked') {
    return (
      <div className="w-10 h-10 rounded-full bg-white/4 border-2 border-white/10 flex items-center justify-center shrink-0">
        <Lock className="h-3.5 w-3.5 text-[#353535]" />
      </div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-full bg-[#c79a3b]/15 border-2 border-[#c79a3b]/50 flex items-center justify-center shrink-0 relative">
      <span className="text-sm font-bold text-[#c79a3b]">{numero}</span>
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full border border-[#c79a3b]/30 animate-ping" />
    </div>
  )
}

// ─────────────────────────────────────────────
// STEP CARD
// Ref: Fogg Behavior Model — cada card tem
// motivação + habilidade + gatilho explícito
// ─────────────────────────────────────────────
function StepCard({
  numero, titulo, status, subtitle, badge, children,
}: {
  numero: number; titulo: string; status: StepStatus
  subtitle?: string; badge?: React.ReactNode; children?: React.ReactNode
}) {
  const border =
    status === 'done'      ? 'border-[#22c55e]/15' :
    status === 'available' ? 'border-[#c79a3b]/25'  :
                             'border-white/5'

  const bg =
    status === 'available' ? 'bg-[#0d0c09]' : 'bg-[#080808]'

  return (
    <div className={`rounded-2xl border ${border} ${bg} overflow-hidden transition-all duration-300 ${status === 'locked' ? 'opacity-40' : ''}`}>
      {/* Header da etapa */}
      <div className="flex items-start gap-4 px-5 py-5">
        <StepBadge numero={numero} status={status} />
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <p className={`text-base font-semibold leading-snug ${status === 'locked' ? 'text-[#404040]' : 'text-[#e0e0e0]'}`}>
              {titulo}
            </p>
            {badge}
          </div>
          {status === 'done' && !subtitle && (
            <p className="text-xs text-[#22c55e]/60 mt-0.5">Concluído ✓</p>
          )}
          {status === 'locked' && (
            <p className="text-xs text-[#353535] mt-0.5">Complete a etapa anterior para desbloquear.</p>
          )}
          {subtitle && status !== 'locked' && (
            <p className="text-xs text-[#505050] mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {/* Corpo — só renderiza quando disponível ou feito */}
      {status !== 'locked' && children && (
        <div className="border-t border-white/5 px-5 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// OFERTA MODAL
// Ref: Variable Reward (Skinner) — revelação
// progressiva de recompensa aumenta engajamento
// ─────────────────────────────────────────────
function OfertaModal({ firstName, onAceitar, onFechar }: {
  firstName: string; onAceitar: () => void; onFechar: () => void
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:px-5"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      onClick={onFechar}
    >
      {[{ top:'15%',left:'10%',d:'0s',dur:'2.4s' },{ top:'75%',left:'15%',d:'0.5s',dur:'2.0s' },
        { top:'20%',left:'82%',d:'0.8s',dur:'2.6s' },{ top:'70%',left:'80%',d:'0.3s',dur:'1.9s' }]
        .map((p, i) => (
          <span key={i} className="absolute w-1 h-1 rounded-full bg-[#c79a3b]/40 animate-ping pointer-events-none"
            style={{ top:p.top, left:p.left, animationDelay:p.d, animationDuration:p.dur }} />
        ))}

      <div
        className="relative w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden"
        style={{ background:'linear-gradient(170deg,#131208 0%,#0d0d0d 50%,#0a0a0a 100%)',
                 border:'1px solid rgba(199,154,59,0.22)', boxShadow:'0 0 100px rgba(199,154,59,0.10),0 32px 80px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="h-px w-full" style={{ background:'linear-gradient(90deg,transparent,#c79a3b,#e8b84b,#c79a3b,transparent)' }} />
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-9 h-1 rounded-full bg-white/10" />
        </div>
        <button onClick={onFechar}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-[#484848] hover:text-[#a0a0a0] transition-colors">
          <X className="h-3.5 w-3.5" />
        </button>

        <div className="px-6 sm:px-7 pt-5 pb-7 space-y-5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#c79a3b]/25 bg-[#c79a3b]/8 px-3 py-1">
            <Sparkles className="h-3 w-3 text-[#c79a3b]" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#c79a3b]">
              {firstName}, você foi selecionado
            </span>
          </div>

          {OFERTA.ativo ? (
            <>
              <h2 style={{ fontFamily:"'Fraunces',Georgia,serif" }}
                className="text-2xl sm:text-[26px] font-bold leading-[1.1] text-[#f0f0f0]">
                {OFERTA.atencao}
              </h2>
              <p className="text-sm text-[#565656] leading-relaxed">{OFERTA.interesse}</p>
              <div className="rounded-2xl border border-white/6 bg-[#080808] p-4 space-y-3">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-[#c79a3b]/60 mb-1">Oferta exclusiva</p>
                  <p className="text-base font-semibold text-[#e0e0e0] leading-snug">{OFERTA.nome}</p>
                  <p className="text-xs text-[#484848] mt-1 leading-relaxed">{OFERTA.descricao}</p>
                </div>
                <div className="h-px bg-white/5" />
                <ul className="space-y-2">
                  {OFERTA.beneficios.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-4 h-4 rounded-full bg-[#c79a3b]/15 border border-[#c79a3b]/25 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="h-2.5 w-2.5 text-[#c79a3b]" />
                      </span>
                      <span className="text-sm text-[#808080]">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-3">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-[#383838] line-through tabular-nums">{OFERTA.preco_original}</p>
                    <p className="text-4xl font-black text-[#c79a3b] tabular-nums leading-none">{OFERTA.preco}</p>
                    {OFERTA.parcelamento && <p className="text-[11px] text-[#484848] mt-1">{OFERTA.parcelamento}</p>}
                  </div>
                  {OFERTA.urgencia && <p className="text-[11px] text-[#383838] leading-snug text-right max-w-[120px]">{OFERTA.urgencia}</p>}
                </div>
                <a href={OFERTA.url} target="_blank" rel="noopener noreferrer" onClick={onAceitar}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-[#080808] transition-all active:scale-[0.98]"
                  style={{ background:'linear-gradient(135deg,#c79a3b,#e8b84b)', boxShadow:'0 8px 32px rgba(199,154,59,0.30)' }}>
                  <ShoppingBag className="h-4 w-4" /> Quero aproveitar essa condição
                </a>
                <button onClick={onFechar} className="w-full py-2 text-xs text-[#363636] hover:text-[#606060] transition-colors">
                  Não, obrigado
                </button>
              </div>
            </>
          ) : (
            <>
              <h2 style={{ fontFamily:"'Fraunces',Georgia,serif" }}
                className="text-2xl font-bold leading-[1.1] text-[#f0f0f0]">
                Você acabou de provar<br />que é diferente.
              </h2>
              <p className="text-sm text-[#565656] leading-relaxed">
                A maioria das pessoas desiste antes da aula introdutória. Você foi até aqui — e por isso uma condição especial foi reservada para o seu perfil.
              </p>
              <div className="rounded-xl border border-[#c79a3b]/12 bg-[#c79a3b]/4 px-4 py-3 space-y-1">
                <p className="text-xs font-semibold text-[#c79a3b]/70">Oferta exclusiva em breve</p>
                <p className="text-xs text-[#505050] leading-relaxed">
                  Os detalhes do produto serão revelados durante a Semana do Despertar. Você já está na fila de acesso prioritário.
                </p>
              </div>
              <div className="space-y-2.5">
                <button onClick={onAceitar}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-sm font-bold text-[#080808] transition-all"
                  style={{ background:'linear-gradient(135deg,#c79a3b,#e8b84b)', boxShadow:'0 8px 32px rgba(199,154,59,0.25)' }}>
                  Garantir minha condição exclusiva
                </button>
                <button onClick={onFechar} className="w-full py-2 text-xs text-[#363636] hover:text-[#606060] transition-colors">
                  Ver depois
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export function SemanaDespertar38({ firstName }: { firstName: string }) {
  const [progress, setProgress] = useState<Progress>(EMPTY)
  const [hydrated, setHydrated] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProgress({ ...EMPTY, ...JSON.parse(raw) })
    } catch {}
    setHydrated(true)
  }, [])

  // Modal após completar aula introdutória
  useEffect(() => {
    if (!hydrated) return
    if (progress.step2_intro && !progress.step3_modal_visto) {
      const t = setTimeout(() => setShowModal(true), 600)
      return () => clearTimeout(t)
    }
  }, [hydrated, progress.step2_intro, progress.step3_modal_visto])

  const mark = useCallback((key: keyof Progress) => {
    setProgress(prev => {
      const next = { ...prev, [key]: true }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  if (!hydrated) return null

  const { step1_vip, step2_intro, step3_modal_visto, step3_oferta, step4_aula1, step4_aula2, step4_aula3 } = progress
  const todasAulasFeitas = step4_aula1 && step4_aula2 && step4_aula3

  const s1: StepStatus = step1_vip       ? 'done'      : 'available'
  const s2: StepStatus = !step1_vip      ? 'locked'    : step2_intro   ? 'done' : 'available'
  const s3: StepStatus = !step2_intro    ? 'locked'    : step3_oferta  ? 'done' : 'available'
  const s4: StepStatus = !step3_oferta   ? 'locked'    : todasAulasFeitas ? 'done' : 'available'
  const s5: StepStatus = !todasAulasFeitas ? 'locked'  : 'available'

  // XP e contagem de etapas concluídas
  const stepsCompleted = [step1_vip, step2_intro, step3_oferta, todasAulasFeitas, false].filter(Boolean).length
  const xp = stepsCompleted * XP_PER_STEP

  return (
    <>
      {showModal && (
        <OfertaModal
          firstName={firstName}
          onAceitar={() => { mark('step3_modal_visto'); mark('step3_oferta'); setShowModal(false) }}
          onFechar={() => { mark('step3_modal_visto'); setShowModal(false) }}
        />
      )}

      <div className="min-h-screen w-full" style={{ background: 'linear-gradient(160deg, #0c0c0a 0%, #0f0f0f 40%, #0a0a08 100%)' }}>
        <div className="w-full max-w-2xl mx-auto px-5 sm:px-8 pt-10 pb-24">

          {/* ── BANNER ─────────────────────────── */}
          {BANNER_URL ? (
            <div className="w-full rounded-2xl overflow-hidden mb-6 relative">
              <img
                src={BANNER_URL}
                alt="Semana do Despertar #38"
                className="w-full block"
                style={{ maxHeight: 280, objectFit: 'cover' }}
              />
              {/* fade bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none rounded-b-2xl"
                style={{ background: 'linear-gradient(to bottom, transparent, #0c0c0a)' }}
              />
            </div>
          ) : (
            <div
              className="w-full rounded-2xl overflow-hidden mb-6 flex items-center justify-center border border-white/6 bg-[#0d0d0d]"
              style={{ height: 200 }}
            >
              <p className="text-xs font-mono text-[#2a2a2a] tracking-widest uppercase">
                Banner de Boas-Vindas — configure BANNER_URL
              </p>
            </div>
          )}

          {/* ── HEADER ─────────────────────────── */}
          <div className="mb-8 space-y-5">
            {/* Identidade + boas-vindas */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#404040] mb-2">
                Instituto Despertamente
              </p>
              <h1 style={{ fontFamily:"'Fraunces',Georgia,serif" }}
                className="text-3xl sm:text-4xl font-bold text-[#f0f0f0] leading-[1.1]">
                Semana do Despertar <span className="text-[#c79a3b]">#38</span>
              </h1>
              <p className="mt-2 text-sm text-[#505050]">
                Olá, <span className="text-[#a0a0a0] font-medium">{firstName}</span>! Siga as etapas abaixo para aproveitar tudo.
              </p>
            </div>

            {/* Progress tracker gamificado */}
            <div className="rounded-2xl border border-white/6 bg-[#0d0d0d] px-5 py-4">
              <ProgressTracker done={stepsCompleted} total={TOTAL_STEPS} xp={xp} />
            </div>
          </div>

          {/* ── ETAPAS ─────────────────────────── */}
          <div className="space-y-3">

            {/* ETAPA 1 — GRUPO VIP */}
            <StepCard
              numero={1}
              titulo="Entre no Grupo VIP"
              status={s1}
              subtitle="Receba avisos, conteúdos e acesso à comunidade de alunos."
            >
              <a href={WA_GROUP_URL} target="_blank" rel="noopener noreferrer"
                onClick={() => mark('step1_vip')}
                className="group flex items-center gap-4 rounded-xl border border-[#25D366]/20 bg-[#25D366]/6 p-4 hover:bg-[#25D366]/10 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-5 w-5 text-[#25D366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#f0f0f0]">Grupo Exclusivo — Turma #38</p>
                  <p className="text-xs text-[#606060] mt-0.5">WhatsApp · Avisos e comunidade</p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white shrink-0">
                  Entrar <ChevronRight className="h-3 w-3" />
                </div>
              </a>
              {!step1_vip && (
                <button onClick={() => mark('step1_vip')}
                  className="mt-3 w-full text-xs text-[#383838] hover:text-[#606060] transition-colors py-2">
                  Já entrei no grupo →
                </button>
              )}
            </StepCard>

            {/* ETAPA 2 — AULA INTRODUTÓRIA */}
            <StepCard
              numero={2}
              titulo="Assista a Aula Introdutória"
              status={s2}
              subtitle="Prepare sua mente para a semana que começa."
            >
              {INTRO_VIDEO_ID ? (
                <div className="rounded-xl overflow-hidden bg-black aspect-video mb-4">
                  <iframe
                    src={`https://www.youtube.com/embed/${INTRO_VIDEO_ID}`}
                    title="Aula Introdutória"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-white/6 bg-[#0a0a0a] aspect-video flex flex-col items-center justify-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/4 border border-white/8 flex items-center justify-center">
                    <Play className="h-5 w-5 text-[#404040] ml-0.5" />
                  </div>
                  <p className="text-xs text-[#404040]">Aula disponível em breve</p>
                </div>
              )}

              <a href={EBOOK_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-white/8 bg-[#0a0a0a] p-4 hover:border-white/15 transition-colors group mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#c79a3b]/10 flex items-center justify-center shrink-0">
                  <Download className="h-4 w-4 text-[#c79a3b]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#d0d0d0] group-hover:text-[#f0f0f0] transition-colors">Material de Apoio — E-book</p>
                  <p className="text-xs text-[#484848] mt-0.5">Baixe o material complementar da aula.</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-[#404040] shrink-0" />
              </a>

              {!step2_intro && (
                <button onClick={() => mark('step2_intro')}
                  className="w-full rounded-xl border border-[#c79a3b]/20 bg-[#c79a3b]/4 py-3.5 text-sm font-semibold text-[#c79a3b] hover:bg-[#c79a3b]/8 transition-colors">
                  ✓ Concluí a aula introdutória — próxima etapa
                </button>
              )}
            </StepCard>

            {/* ETAPA 3 — ACESSO ESPECIAL */}
            <StepCard
              numero={3}
              titulo="Acesso Especial"
              status={s3}
              subtitle="Uma condição exclusiva foi reservada para você."
              badge={
                step3_modal_visto && s3 !== 'locked' ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#c79a3b]/25 bg-[#c79a3b]/8 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#c79a3b]">
                    <Sparkles className="h-2.5 w-2.5" /> selecionado
                  </span>
                ) : undefined
              }
            >
              {step3_oferta ? (
                <div className="flex items-center gap-3 rounded-xl border border-[#22c55e]/15 bg-[#22c55e]/4 p-4">
                  <div className="w-9 h-9 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center shrink-0">
                    <Check className="h-4 w-4 text-[#22c55e]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#d0d0d0]">Condição reservada ✓</p>
                    <p className="text-xs text-[#484848] mt-0.5">Sua condição exclusiva está garantida para este evento.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-[#c79a3b]/15 bg-[#c79a3b]/4 px-4 py-3 flex items-start gap-3">
                    <Sparkles className="h-4 w-4 text-[#c79a3b]/60 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-[#c0c0c0]">Condição exclusiva reservada</p>
                      <p className="text-xs text-[#505050] leading-relaxed">
                        {OFERTA.ativo ? OFERTA.descricao : 'Sua condição especial está reservada. Ela será revelada durante a Semana do Despertar.'}
                      </p>
                    </div>
                  </div>
                  {OFERTA.ativo ? (
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-2xl font-bold text-[#c79a3b]">{OFERTA.preco}</p>
                      <a href={OFERTA.url} target="_blank" rel="noopener noreferrer"
                        onClick={() => mark('step3_oferta')}
                        className="flex items-center gap-2 rounded-xl bg-[#c79a3b] px-5 py-3 text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors">
                        <ShoppingBag className="h-4 w-4" /> Garantir
                      </a>
                    </div>
                  ) : (
                    <button onClick={() => mark('step3_oferta')}
                      className="w-full rounded-xl border border-[#c79a3b]/20 bg-[#c79a3b]/4 py-3.5 text-sm font-semibold text-[#c79a3b] hover:bg-[#c79a3b]/8 transition-colors">
                      ✓ Entendi — continuar para as aulas
                    </button>
                  )}
                  <button onClick={() => setShowModal(true)}
                    className="w-full text-[11px] text-[#303030] hover:text-[#505050] transition-colors py-1">
                    Ver detalhes da condição →
                  </button>
                </div>
              )}
            </StepCard>

            {/* ETAPA 4 — 3 AULAS AO VIVO */}
            <StepCard
              numero={4}
              titulo="Assista às 3 Aulas ao Vivo"
              status={s4}
              subtitle={`${[step4_aula1, step4_aula2, step4_aula3].filter(Boolean).length}/3 aulas assistidas`}
            >
              <div className="space-y-3">
                {AULAS.map((aula) => {
                  const aulaKey = `step4_aula${aula.id}` as keyof Progress
                  const aulaFeita = progress[aulaKey]
                  return (
                    <div key={aula.id}
                      className={`rounded-xl border p-4 space-y-3 transition-all duration-300 ${
                        aulaFeita ? 'border-[#22c55e]/20 bg-[#22c55e]/4' : 'border-white/8 bg-[#0a0a0a]'
                      }`}>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-[11px] font-mono text-[#404040]">Aula {aula.id}</p>
                          <p className="text-sm font-semibold text-[#d0d0d0] leading-snug mt-0.5">{aula.titulo}</p>
                          <p className="text-xs text-[#484848] mt-1">{aula.data} · {aula.horario}</p>
                        </div>
                        {aulaFeita && (
                          <div className="w-7 h-7 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/25 flex items-center justify-center shrink-0">
                            <Check className="h-3.5 w-3.5 text-[#22c55e]" />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <a href={aula.youtubeUrl} target="_blank" rel="noopener noreferrer"
                          onClick={() => mark(aulaKey)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF0000]/10 border border-[#FF0000]/20 px-3 py-1.5 text-[11px] font-semibold text-[#FF6666] hover:bg-[#FF0000]/15 transition-colors">
                          <Video className="h-3.5 w-3.5" /> Ativar lembrete <Bell className="h-3 w-3" />
                        </a>
                        <button onClick={() => openCalendar(aula)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-[11px] font-semibold text-[#a0a0a0] hover:border-white/20 hover:text-[#d0d0d0] transition-colors">
                          <Calendar className="h-3.5 w-3.5" /> Agendar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-[11px] text-[#383838] mt-3 leading-relaxed">
                Clique em "Ativar lembrete" para ser notificado quando a aula começar. O calendário detecta iOS, Android ou desktop automaticamente.
              </p>
            </StepCard>

            {/* ETAPA 5 — CERTIFICADO */}
            <StepCard
              numero={5}
              titulo="Resgate seu Certificado"
              status={s5}
              subtitle="Disponível após concluir as 3 aulas ao vivo."
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-[#c79a3b]/10 border border-[#c79a3b]/20 flex items-center justify-center shrink-0">
                  <Award className="h-7 w-7 text-[#c79a3b]" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-semibold text-[#f0f0f0]">Certificado da Semana do Despertar #38</p>
                  <p className="text-xs text-[#505050] leading-relaxed">
                    Resgate com as palavras-chave reveladas ao vivo durante as aulas.
                  </p>
                </div>
                <Link href="/certificados"
                  className="flex items-center gap-2 rounded-xl bg-[#c79a3b] px-5 py-3 text-sm font-bold text-[#080808] hover:bg-[#e8b84b] transition-colors shrink-0">
                  <Award className="h-4 w-4" /> Resgatar
                </Link>
              </div>
            </StepCard>

          </div>
        </div>
      </div>
    </>
  )
}
