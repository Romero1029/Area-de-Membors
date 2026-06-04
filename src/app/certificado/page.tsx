import { Sparkles, Award } from 'lucide-react'
import { CertificadoForm } from './CertificadoForm'

export const metadata = {
  title: 'Certificado — Instituto Despertamente',
  description: 'Resgate seu certificado de participação preenchendo as palavras-chave da aula.',
}

export default function CertificadoPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ background: '#0a0a0a' }}
    >
      {/* Glow decorativo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top, #c79a3b 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-md space-y-8">

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(199,154,59,0.12)', border: '1px solid rgba(199,154,59,0.25)' }}>
              <Sparkles className="w-7 h-7" style={{ color: '#c79a3b' }} />
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#c79a3b' }}>
              Instituto Despertamente
            </p>
            <h1 className="text-3xl font-bold text-white leading-tight">
              Resgate seu<br />certificado
            </h1>
            <p className="text-sm mt-3" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Preencha seus dados e as 3 palavras-chave reveladas durante a aula para receber seu certificado em PDF.
            </p>
          </div>

          {/* Info badges */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {['PDF gratuito', '1 tentativa por e-mail', 'Download imediato'].map(label => (
              <span
                key={label}
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Card do formulário */}
        <div
          className="rounded-3xl p-7"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #0f1a24 100%)',
            border: '1px solid rgba(199,154,59,0.15)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          }}
        >
          <CertificadoForm />
        </div>

        {/* Footer */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Award className="w-3.5 h-3.5" style={{ color: 'rgba(199,154,59,0.5)' }} />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
              Instituto Despertamente · Certificado digital
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
