import { Video, Calendar, Clock } from 'lucide-react'

const DEMO_LIVES = [
  {
    id: '1',
    title: 'Semana da Numerologia — Aula Especial',
    date: 'Sábado, 07 de Junho · 14h00',
    audience: 'Todos os alunos',
    status: 'scheduled',
    description: 'Uma imersão profunda nos números do seu mapa de nascimento.',
  },
  {
    id: '2',
    title: 'Psicanálise na Prática — Tira-dúvidas',
    date: 'Sexta, 13 de Junho · 19h00',
    audience: 'Módulo 2+',
    status: 'scheduled',
    description: 'Espaço aberto para perguntas e aplicações práticas.',
  },
]

export default function AoVivoPage() {
  return (
    <div className="max-w-3xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
          Aulas ao Vivo
        </h1>
        <p className="text-sm text-[#5f6b78] mt-1">Encontros ao vivo com o time Instituto Despertamente.</p>
      </div>

      <div className="grid gap-4">
        {DEMO_LIVES.map((live) => (
          <div key={live.id} className="rounded-2xl p-5 flex items-start gap-4"
            style={{ background: '#fffaf3', border: '1px solid rgba(23,36,50,0.08)', boxShadow: '0 2px 8px rgba(23,36,50,0.04)' }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(23,36,50,0.05)' }}>
              <Video className="w-5 h-5 text-[#1a2430]" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-[#1a2430] leading-snug">{live.title}</p>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: 'rgba(199,154,59,0.12)', color: '#c79a3b', border: '1px solid rgba(199,154,59,0.2)' }}>
                  Agendado
                </span>
              </div>
              <p className="text-sm text-[#5f6b78]">{live.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-[#5f6b78]">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{live.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{live.audience}</span>
              </div>
              <button className="mt-1 text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #1a2430, #2d3f52)', color: '#fff' }}>
                Adicionar ao calendário
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
