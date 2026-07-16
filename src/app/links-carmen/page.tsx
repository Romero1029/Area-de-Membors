import Link from 'next/link'
import Image from 'next/image'
import { Caveat } from 'next/font/google'
import { CalendarHeart, Sparkles, ArrowUpRight } from 'lucide-react'

const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], display: 'swap' })

export const metadata = {
  title: 'Jocimara Anjos — Terapeuta',
  description: 'Terapeuta, Psicanálise Integrativa. Agende sua sessão, conheça o Cicatrizes que Curam e o Mapa Numerológico.',
}

const WA_SESSAO = 'https://wa.me/5511999999999?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20sess%C3%A3o%20com%20a%20Jocimara.'

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
    <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
    <circle cx="12" cy="12" r="4.3" />
    <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

const BrainBloomIcon = () => (
  <svg viewBox="0 0 64 64" fill="none" stroke="#C7912F" strokeWidth="1.6" className="w-full h-full">
    <circle cx="32" cy="32" r="29" strokeWidth="1.2" opacity="0.55" />
    <path d="M32 15c-5 0-9 3.3-9 8.2 0 2 .8 3.5 2 4.6-2 1-3.3 3-3.3 5.4 0 2.7 1.8 5 4.3 5.8-.2.7-.3 1.4-.3 2.2 0 4 3.2 7 7.3 7s7.3-3 7.3-7c0-.8-.1-1.5-.3-2.2 2.5-.8 4.3-3.1 4.3-5.8 0-2.4-1.3-4.4-3.3-5.4 1.2-1.1 2-2.6 2-4.6 0-4.9-4-8.2-9-8.2-1.4 0-2.7.3-3.9.8"
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M32 18v22" strokeLinecap="round" opacity="0.7" />
    <path d="M27 24c1.6 1 3.4 1 5 0M27 31c1.6 1 3.4 1 5 0" strokeLinecap="round" opacity="0.6" />
    <path d="M32 45v6M32 51c-3 0-5.5 2-6.5 4.5M32 51c3 0 5.5 2 6.5 4.5M32 51c-1.6-1.8-1.6-4 0-6M32 51c1.6-1.8 1.6-4 0-6"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const links = [
  {
    href: 'https://instagram.com/jocimaraanjos.psi',
    external: true,
    style: 'outline' as const,
    icon: InstagramIcon,
    title: '@jocimaraanjos.psi',
    sub: 'Me segue lá pra acompanhar de perto',
  },
  {
    href: WA_SESSAO,
    external: true,
    style: 'primary' as const,
    icon: CalendarHeart,
    title: 'Agendar minha sessão',
    sub: 'Atendimento individual comigo',
  },
  {
    href: '/cicatrizes',
    external: false,
    style: 'card' as const,
    icon: Sparkles,
    title: 'Workshop Cicatrizes que Curam',
    sub: '3h · vagas limitadas · uma vez por mês',
    tag: 'R$ 49,90',
  },
  {
    href: 'https://mapa.seunumerologo.com.br/',
    external: true,
    style: 'card' as const,
    icon: ArrowUpRight,
    title: 'Mapa Numerológico 7 Esferas',
    sub: 'Em parceria com Seu Numerólogo',
    tag: 'R$ 47,60',
  },
]

export default function LinksCarmenPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center px-6 py-16" style={{ background: '#FBF3E7' }}>
      {/* watercolor blooms */}
      <div className="absolute -top-24 -left-28 w-[380px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,169,60,0.35), rgba(232,169,60,0) 70%)' }} />
      <div className="absolute -bottom-32 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(30,42,82,0.28), rgba(30,42,82,0) 70%)' }} />
      <div className="absolute top-1/3 -right-16 w-[220px] h-[220px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(232,169,60,0.18), rgba(232,169,60,0) 70%)' }} />

      <div className="relative w-full max-w-[420px] flex flex-col items-center">
        <div className="w-14 h-14 mb-4">
          <BrainBloomIcon />
        </div>

        <div
          className="w-[112px] h-[112px] rounded-full overflow-hidden mb-5 shrink-0"
          style={{ boxShadow: '0 0 0 5px rgba(255,255,255,0.9), 0 0 0 6.5px rgba(199,145,47,0.35), 0 14px 30px rgba(30,42,82,0.18)' }}
        >
          <Image
            src="/jocimara-anjos.jpg"
            alt="Jocimara Anjos"
            width={112}
            height={112}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        <h1 style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-[28px] font-bold text-[#1E2A52] text-center">
          Jocimara Anjos
        </h1>
        <p className={`${caveat.className} text-[26px] leading-none text-[#C7912F] text-center mt-1`}>
          Terapeuta · Psicanálise Integrativa
        </p>
        <p className="text-[11.5px] font-medium text-[#5B5344] text-center mt-2.5 max-w-[300px] leading-relaxed tracking-wide">
          Coordenadora Pedagógica da Formação em Psicanálise · Instituto Despertamente
        </p>

        <div className="w-full flex flex-col gap-3 mt-9">
          {links.map((l) => {
            const Icon = l.icon
            const Wrapper = l.external ? 'a' : Link
            const extraProps = l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
            const isPrimary = l.style === 'primary'
            const isOutline = l.style === 'outline'
            return (
              <Wrapper
                key={l.title}
                href={l.href}
                {...extraProps}
                className={`group flex items-center gap-3.5 rounded-2xl px-5 py-4 transition-all duration-200 ${
                  isPrimary
                    ? 'active:scale-[0.98]'
                    : isOutline
                    ? 'bg-white/50 border-[1.5px] border-[#C7912F]/45 hover:border-[#C7912F]/70 hover:bg-white/70'
                    : 'bg-white/70 border border-[#1E2A52]/10 hover:border-[#1E2A52]/25 hover:bg-white/90'
                }`}
                style={isPrimary ? { background: 'linear-gradient(135deg, #E8B056, #C7912F)' } : undefined}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                    isPrimary ? 'bg-white/25' : isOutline ? 'bg-[#C7912F]/10' : 'bg-[#1E2A52]/6'
                  }`}
                >
                  <Icon className={isPrimary ? 'text-white' : isOutline ? 'text-[#C7912F]' : 'text-[#1E2A52]/70'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-[15px] font-semibold ${isPrimary ? 'text-white' : 'text-[#1E2A52]'}`}>
                    {l.title}
                  </p>
                  <p className={`text-[12px] mt-0.5 ${isPrimary ? 'text-white/75' : 'text-[#5B5344]/70'}`}>
                    {l.sub}
                  </p>
                </div>
                {l.tag && (
                  <span className="shrink-0 text-[10.5px] font-bold uppercase tracking-wide text-[#C7912F] bg-[#C7912F]/10 border border-[#C7912F]/25 rounded-full px-2.5 py-1">
                    {l.tag}
                  </span>
                )}
              </Wrapper>
            )
          })}
        </div>

        <p className={`${caveat.className} text-[20px] text-[#C7912F]/70 mt-7`}>+ novos links em breve</p>

        <div className="flex items-center gap-2 mt-8 opacity-45">
          <Image src="/despertamente-simbolo.png" alt="IDM" width={15} height={15} className="object-contain" />
          <span className="text-[11px] text-[#1E2A52]">Instituto Despertamente</span>
        </div>
      </div>
    </div>
  )
}
