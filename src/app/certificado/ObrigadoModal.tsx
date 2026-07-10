'use client'

import { X, Award, Gift } from 'lucide-react'
import { WA_URL, WhatsAppIcon } from './whatsapp'

const INSTAGRAM_URL = 'https://www.instagram.com/institutodespertamente'

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 shrink-0" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
)

type Props = {
  nome: string
  onClose: () => void
}

export function ObrigadoModal({ nome, onClose }: Props) {
  const primeiroNome = nome.trim().split(' ')[0] || 'tudo bem'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(3,6,20,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl p-7 space-y-5"
        style={{
          background: 'linear-gradient(135deg, #0A1232 0%, #0F1940 100%)',
          border: '1px solid rgba(255,184,0,0.2)',
          boxShadow: '0 32px 100px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
        >
          <X className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
        </button>

        <div className="text-center space-y-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ background: 'rgba(255,184,0,0.15)', border: '2px solid rgba(255,184,0,0.4)' }}
          >
            <Award className="w-7 h-7" style={{ color: '#FFB800' }} />
          </div>
          <h2 className="text-xl font-bold text-white">
            Obrigado por resgatar seu certificado, {primeiroNome}!
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            O download do seu PDF já começou. Antes de continuar, dá uma olhada nisso:
          </p>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-12 rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #F58529, #DD2A7B, #8134AF)' }}
        >
          <InstagramIcon />
          Seguir @institutodespertamente
        </a>

        <div
          className="flex items-start gap-3 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(255,184,0,0.08)', border: '1px solid rgba(255,184,0,0.2)' }}
        >
          <Gift className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#FFB800' }} />
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Quem resgatou o certificado hoje garante <strong className="text-white">bônus especiais</strong> ao entrar para a Formação em Psicanálise. Fala com a gente para saber mais.
          </p>
        </div>

        <a
          href={WA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-[52px] rounded-2xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: '#25D366', boxShadow: '0 8px 24px rgba(37,211,102,0.25)' }}
        >
          <WhatsAppIcon />
          Quero saber mais da Formação
        </a>
      </div>
    </div>
  )
}
