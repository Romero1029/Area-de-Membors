import Link from 'next/link'
import Image from 'next/image'
import { CalendarHeart, Sparkles, ArrowUpRight } from 'lucide-react'

export const metadata = {
  title: 'Jocimara Anjos — Instituto Despertamente',
  description: 'Terapeuta e Coordenadora Pedagógica da Formação em Psicanálise do IDM. Agende sua sessão, conheça o Cicatrizes que Curam e o Mapa Numerológico.',
}

const WA_SESSAO = 'https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20sess%C3%A3o%20com%20a%20Jocimara.'

const links = [
  {
    href: WA_SESSAO,
    external: true,
    primary: true,
    icon: CalendarHeart,
    title: 'Agendar minha sessão',
    sub: 'Atendimento individual com a Jocimara',
  },
  {
    href: '/cicatrizes',
    external: false,
    primary: false,
    icon: Sparkles,
    title: 'Workshop Cicatrizes que Curam',
    sub: '3h · vagas limitadas · uma vez por mês',
    tag: 'R$ 37,80 com cupom',
  },
  {
    href: 'https://mapa.seunumerologo.com.br/',
    external: true,
    primary: false,
    icon: ArrowUpRight,
    title: 'Mapa Numerológico 7 Esferas',
    sub: 'Em parceria com Seu Numerólogo',
    tag: 'R$ 47,60',
  },
]

export default function LinksCarmenPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center px-6 py-14"
      style={{ background: 'radial-gradient(circle at 50% 0%, #111D48 0%, #0D1638 55%, #0A1232 100%)' }}
    >
      <div className="w-full max-w-[420px] flex flex-col items-center">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 mb-7">
          <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={14} height={14} className="object-contain opacity-80" />
          <span className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-white/50">
            Parceira do Instituto Despertamente
          </span>
        </div>

        <div
          className="w-[104px] h-[104px] rounded-full overflow-hidden mb-5 shrink-0"
          style={{ boxShadow: '0 0 0 4px rgba(255,184,0,0.14), 0 12px 32px rgba(0,0,0,0.35)' }}
        >
          <Image
            src="/jocimara-anjos.jpg"
            alt="Jocimara Anjos"
            width={104}
            height={104}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-[26px] font-bold text-white text-center">
          Jocimara Anjos
        </h1>
        <p className="text-sm text-white/60 text-center mt-1.5">Terapeuta · Psicanálise Integrativa</p>
        <p className="text-xs text-white/35 text-center mt-1 max-w-[300px] leading-relaxed">
          Coordenadora Pedagógica da Formação em Psicanálise · IDM
        </p>

        <div className="w-full flex flex-col gap-3 mt-9">
          {links.map((l) => {
            const Icon = l.icon
            const Wrapper = l.external ? 'a' : Link
            const extraProps = l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
            return (
              <Wrapper
                key={l.title}
                href={l.href}
                {...extraProps}
                className={`group flex items-center gap-3.5 rounded-2xl px-5 py-4 transition-all duration-200 ${
                  l.primary
                    ? 'bg-[#FFB800] hover:bg-[#FFC933] active:scale-[0.98]'
                    : 'bg-white/[0.04] border border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    l.primary ? 'bg-[#0D1638]/12' : 'bg-white/8'
                  }`}
                >
                  <Icon className={`w-[18px] h-[18px] ${l.primary ? 'text-[#0D1638]' : 'text-white/70'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] font-semibold ${l.primary ? 'text-[#0D1638]' : 'text-white'}`}>
                    {l.title}
                  </p>
                  <p className={`text-[12px] mt-0.5 ${l.primary ? 'text-[#0D1638]/70' : 'text-white/40'}`}>
                    {l.sub}
                  </p>
                </div>
                {l.tag && (
                  <span className="shrink-0 text-[10.5px] font-bold font-mono uppercase tracking-wide text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/25 rounded-full px-2.5 py-1">
                    {l.tag}
                  </span>
                )}
              </Wrapper>
            )
          })}
        </div>

        <p className="text-[11px] text-white/25 mt-6 italic">+ novos links em breve</p>

        <div className="flex items-center gap-2 mt-10 opacity-40">
          <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={16} height={16} className="object-contain" />
          <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-xs text-white">
            Instituto Despertamente
          </span>
        </div>
      </div>
    </div>
  )
}
