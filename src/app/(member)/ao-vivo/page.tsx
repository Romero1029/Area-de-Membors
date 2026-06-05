import { Video, Calendar, Users, Radio, Lock } from 'lucide-react'

const LIVES = [
  {
    id: '1',
    title: 'Psicanálise Integrativa — Aula 1',
    date: 'Sábado, 07 de Junho',
    time: '14h00',
    audience: 'Todos os alunos',
    status: 'scheduled',
    description: 'Fundamentos da Psicanálise Integrativa e o inconsciente na prática clínica.',
  },
  {
    id: '2',
    title: 'NLP na Prática — Tira-dúvidas',
    date: 'Sexta, 13 de Junho',
    time: '19h00',
    audience: 'Módulo 2+',
    status: 'scheduled',
    description: 'Espaço aberto para perguntas, casos clínicos e aplicações práticas de PNL.',
  },
  {
    id: '3',
    title: 'Constelação Familiar — Introdução',
    date: 'Sábado, 21 de Junho',
    time: '10h00',
    audience: 'Módulo 3+',
    status: 'locked',
    description: 'Uma imersão nos padrões sistêmicos e como eles influenciam nossa mente.',
  },
]

const statusConfig = {
  live:      { label: 'Ao Vivo', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-500' },
  scheduled: { label: 'Agendado', bg: 'bg-[#c79a3b]/10', text: 'text-[#c79a3b]', border: 'border-[#c79a3b]/20', dot: '' },
  locked:    { label: 'Em breve', bg: 'bg-white/5', text: 'text-white/40', border: 'border-white/10', dot: '' },
}

export default function AoVivoPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16 space-y-8">

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#c79a3b]" />
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
            Aulas ao Vivo
          </h1>
        </div>
        <p className="text-sm text-white/50">Encontros exclusivos com o time do Instituto Despertamente.</p>
      </div>

      {/* Próxima aula em destaque */}
      <div
        className="relative overflow-hidden rounded-3xl p-6 sm:p-8"
        style={{ background: 'linear-gradient(135deg, #0f2233 0%, #172432 60%, #1a2430 100%)', border: '1px solid rgba(199,154,59,0.2)' }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #c79a3b, transparent)' }} />
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #c79a3b, transparent)' }} />

        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c79a3b] animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Próxima aula</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
            Psicanálise Integrativa — Aula 1
          </h2>
          <div className="flex flex-wrap gap-4 text-sm text-white/60">
            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-[#c79a3b]" /> Sábado, 07 de Junho · 14h00</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4 text-[#c79a3b]" /> Todos os alunos</span>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a', boxShadow: '0 8px 24px rgba(199,154,59,0.25)' }}
            >
              <Video className="w-4 h-4" /> Entrar na sala
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all">
              <Calendar className="w-4 h-4" /> Adicionar ao calendário
            </button>
          </div>
        </div>
      </div>

      {/* Lista de aulas */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/40">Agenda completa</h2>

        {LIVES.map((live) => {
          const s = statusConfig[live.status as keyof typeof statusConfig]
          const isLocked = live.status === 'locked'

          return (
            <div
              key={live.id}
              className={`rounded-2xl p-5 flex items-start gap-4 transition-all ${isLocked ? 'opacity-60' : 'hover:border-[#c79a3b]/30'}`}
              style={{ background: '#111111', border: '1px solid #1e1e1e' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: isLocked ? 'rgba(255,255,255,0.04)' : 'rgba(199,154,59,0.1)', border: isLocked ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(199,154,59,0.2)' }}
              >
                {isLocked
                  ? <Lock className="w-4 h-4 text-white/30" />
                  : <Video className="w-4 h-4 text-[#c79a3b]" />}
              </div>

              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-semibold text-white leading-snug">{live.title}</p>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 border ${s.bg} ${s.text} ${s.border}`}>
                    {s.dot && <span className={`inline-block w-1.5 h-1.5 rounded-full ${s.dot} mr-1 animate-pulse`} />}
                    {s.label}
                  </span>
                </div>
                <p className="text-sm text-white/50 leading-relaxed">{live.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/35 pt-0.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />{live.date} · {live.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />{live.audience}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info */}
      <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background: 'rgba(199,154,59,0.05)', border: '1px solid rgba(199,154,59,0.1)' }}>
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(199,154,59,0.1)' }}>
          <Radio className="w-4 h-4 text-[#c79a3b]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Como funcionam as aulas ao vivo?</p>
          <p className="text-xs text-white/50 mt-1 leading-relaxed">
            As aulas acontecem via Zoom ou YouTube Live. O link de acesso é enviado por e-mail 30 minutos antes. Gravações ficam disponíveis na plataforma em até 24h após o término.
          </p>
        </div>
      </div>
    </div>
  )
}
