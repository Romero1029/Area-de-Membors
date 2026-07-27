import { NavbarComecar } from '@/app/comecar/NavbarComecar'
import { WhatsAppButton } from '@/app/comecar/WhatsAppButton'
import { CookieBanner } from '@/app/comecar/CookieBanner'
import { CicatrizesContent } from './CicatrizesContent'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Cicatrizes que Curam — Workshop com Jocimara Anjos | Instituto Despertamente',
  description: 'Workshop vivencial de 3 horas com Jocimara Anjos, Coordenadora Pedagógica da Formação em Psicanálise do IDM. Vagas limitadas, uma turma por mês.',
  openGraph: {
    title: 'Cicatrizes que Curam — Jocimara Anjos',
    description: 'Um encontro de 3 horas para entender as marcas que você carrega — e transformá-las em ponto de virada.',
  },
}

export default function CicatrizesPage() {
  return (
    <div className="min-h-screen bg-[#0D1638] text-white overflow-x-hidden">
      <NavbarComecar />
      <WhatsAppButton />
      <CookieBanner />

      <CicatrizesContent />

      <footer className="border-t border-white/5 bg-[#0A1232]">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/despertamente-simbolo-branco.png" alt="IDM" width={22} height={22} className="object-contain opacity-60" />
            <span style={{ fontFamily: "'Fraunces', Georgia, serif" }} className="text-sm font-bold text-white/40">
              Instituto <span className="text-white/50">Despertamente</span> × Jocimara Anjos
            </span>
          </Link>
          <div className="flex gap-5 text-xs text-white/30">
            <Link href="/privacidade" className="hover:text-white/55 transition-colors">Privacidade</Link>
            <Link href="/termos" className="hover:text-white/55 transition-colors">Termos</Link>
            <Link href="/links-carmen" className="hover:text-white/55 transition-colors">Perfil da Jocimara</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
