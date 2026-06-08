import Link from 'next/link'
import { Video, Calendar, Users, Radio } from 'lucide-react'
import { getLives } from '@/lib/actions/lives'
import type { Live } from '@/lib/actions/lives'

export const metadata = { title: 'Aulas ao Vivo — Instituto Despertamente' }

const STATUS_CONFIG = {
  live:      { label: 'Ao Vivo',   bg: 'bg-red-500/10',      text: 'text-red-400',      border: 'border-red-500/20',    dot: true },
  scheduled: { label: 'Agendado',  bg: 'bg-[#c79a3b]/10',   text: 'text-[#c79a3b]',    border: 'border-[#c79a3b]/20',  dot: false },
  ended:     { label: 'Encerrada', bg: 'bg-white/5',         text: 'text-white/40',     border: 'border-white/10',      dot: false },
  cancelled: { label: 'Cancelada', bg: 'bg-red-500/5',       text: 'text-red-400/60',   border: 'border-red-500/10',    dot: false },
}

function LiveCard({ live, featured = false }: { live: Live; featured?: boolean }) {
  const s = STATUS_CONFIG[live.status]
  const isEnded = live.status === 'ended' || live.status === 'cancelled'

  if (featured) {
    return (
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{ background: 'linear-gradient(135deg, #0f2233 0%, #172432 60%, #1a2430 100%)', border: '1px solid rgba(199,154,59,0.2)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c79a3b, transparent)' }} />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #c79a3b, transparent)' }} />

        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            {live.status === 'live' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-red-400">Ao Vivo agora</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-[#c79a3b] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Próxima aula</span>
              </>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
            {live.title}
          </h2>
          {live.description && <p className="text-sm text-white/60 max-w-lg">{live.description}</p>}
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#c79a3b]" /> {live.date_label} · {live.time_label}</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#c79a3b]" /> {live.audience}</span>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            {live.join_url ? (
              <Link
                href={live.join_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a', boxShadow: '0 8px 24px rgba(199,154,59,0.25)' }}
              >
                <Video className="w-4 h-4" /> {live.status === 'live' ? 'Entrar agora' : 'Entrar na sala'}
              </Link>
            ) : (
              <button
                disabled
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold opacity-40 cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a' }}
                title="Link disponível em breve"
              >
                <Video className="w-4 h-4" /> Entrar na sala
              </button>
            )}
            {live.calendar_url && (
              <Link
                href={live.calendar_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all"
              >
                <Calendar className="w-4 h-4" /> Adicionar ao calendário
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl p-5 flex items-start gap-4 transition-all border ${isEnded ? 'opacity-50' : 'hover:border-[#c79a3b]/30'}`}
      style={{ background: '#111111', borderColor: '#1e1e1e' }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: isEnded ? 'rgba(255,255,255,0.03)' : 'rgba(199,154,59,0.1)',
          border: isEnded ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(199,154,59,0.2)',
        }}
      >
        <Video className={`w-4 h-4 ${isEnded ? 'text-white/20' : 'text-[#c79a3b]'}`} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-white leading-snug">{live.title}</p>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 border ${s.bg} ${s.text} ${s.border}`}>
            {s.dot && <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 animate-pulse" />}
            {s.label}
          </span>
        </div>
        {live.description && <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{live.description}</p>}
        <div className="flex flex-wrap items-center gap-4 text-xs text-white/35 pt-0.5">
          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{live.date_label} · {live.time_label}</span>
          <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" />{live.audience}</span>
        </div>
        {live.join_url && !isEnded && (
          <Link href={live.join_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-[#c79a3b] hover:underline mt-0.5">
            <Video className="w-3 h-3" /> Acessar sala
          </Link>
        )}
      </div>
    </div>
  )
}

export default async function AoVivoPage() {
  const lives = await getLives()

  const nextLive = lives.find(l => l.status === 'live') ?? lives.find(l => l.status === 'scheduled')
  const otherLives = lives.filter(l => l !== nextLive)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-24 md:pb-16 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#c79a3b]" />
          <h1 className="text-2xl font-bold text-[#f0f0f0]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
            Aulas ao Vivo
          </h1>
        </div>
        <p className="text-sm text-[#606060]">Encontros exclusivos com o time do Instituto Despertamente.</p>
      </div>

      {/* Próxima / Ao vivo agora */}
      {nextLive ? (
        <LiveCard live={nextLive} featured />
      ) : (
        <div className="rounded-2xl border border-dashed border-[#2a2a2a] p-10 text-center space-y-2">
          <Radio className="w-8 h-8 text-[#c79a3b]/40 mx-auto" />
          <p className="text-[#606060] text-sm">Nenhuma live agendada no momento.</p>
          <p className="text-[#505050] text-xs">Fique de olho — novos encontros são anunciados em breve.</p>
        </div>
      )}

      {/* Agenda */}
      {otherLives.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#505050]">Agenda completa</h2>
          {otherLives.map(live => (
            <LiveCard key={live.id} live={live} />
          ))}
        </div>
      )}

      {/* Info sobre funcionamento */}
      <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background: 'rgba(199,154,59,0.05)', border: '1px solid rgba(199,154,59,0.1)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(199,154,59,0.1)' }}>
          <Radio className="w-4 h-4 text-[#c79a3b]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#f0f0f0]">Como funcionam as aulas ao vivo?</p>
          <p className="text-xs text-[#606060] mt-1 leading-relaxed">
            As aulas acontecem via Zoom ou YouTube Live. O link de acesso é enviado por e-mail 30 minutos antes. Gravações ficam disponíveis na plataforma em até 24h após o término.
          </p>
        </div>
      </div>
    </div>
  )
}
