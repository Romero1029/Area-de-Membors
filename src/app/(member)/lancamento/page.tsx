import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Lock, Calendar, Clock, ExternalLink, ShoppingCart, Award, Video, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { YouTubePlayer } from '@/components/player/YouTubePlayer'
import { CertificadoForm } from '@/components/lancamento/CertificadoForm'

export default async function LancamentoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sb = supabase as any

  const [{ data: config }, { data: lives }, { data: existingCert }] = await Promise.all([
    sb.from('launch_config').select('*').eq('is_active', true).single(),
    sb.from('launch_lives').select('*').order('sort_order'),
    sb.from('user_certificates').select('*').eq('user_id', user.id).eq('certificate_type', 'launch').single(),
  ])

  return (
    <div className="max-w-4xl space-y-8 pb-16">

      {/* ── HERO ── */}
      <div
        className="relative rounded-3xl overflow-hidden px-7 py-8"
        style={{ background: 'linear-gradient(135deg, #0f2233 0%, #172432 100%)' }}
      >
        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
          <Image src="/despertamente-simbolo-branco.png" alt="" width={160} height={160} className="object-contain" />
        </div>
        <div className="relative space-y-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: 'rgba(199,154,59,0.15)', color: '#c79a3b', border: '1px solid rgba(199,154,59,0.25)' }}>
            <Sparkles className="w-3 h-3" /> Lançamento Gratuito
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
            Sua jornada começa aqui
          </h1>
          <p className="text-[15px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Assista a aula introdutória, participe das 3 aulas ao vivo e resgate seu certificado.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { label: '1 aula gratuita', color: '#22c55e' },
              { label: '3 aulas ao vivo', color: '#c79a3b' },
              { label: 'Certificado exclusivo', color: '#3b82f6' },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
                <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AULA INTRODUTÓRIA (DESBLOQUEADA) ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0" style={{ background: '#22c55e' }}>1</div>
          <div>
            <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
              {config?.intro_title ?? 'Aula Introdutória Gratuita'}
            </h2>
            <p className="text-sm text-[#5f6b78]">Desbloqueada — assista agora</p>
          </div>
          <span className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(34,197,94,0.1)', color: '#16a34a', border: '1px solid rgba(34,197,94,0.2)' }}>
            ✓ Liberado
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: '#fffaf3', border: '1px solid rgba(23,36,50,0.08)' }}>
          <div className="p-4">
            {config?.intro_video_url ? (
              <YouTubePlayer
                videoUrl={config.intro_video_url}
                lessonId="intro-launch"
                productSlug="lancamento"
                initialCompleted={false}
              />
            ) : (
              <div className="aspect-video rounded-xl flex items-center justify-center" style={{ background: '#f0ebe2' }}>
                <div className="text-center space-y-2">
                  <Video className="w-8 h-8 mx-auto text-[#5f6b78]" />
                  <p className="text-sm text-[#5f6b78]">Aula em breve</p>
                </div>
              </div>
            )}
            {config?.intro_description && (
              <p className="text-sm text-[#5f6b78] mt-4 leading-relaxed">{config.intro_description}</p>
            )}
          </div>
        </div>
      </section>

      {/* ── 3 AULAS AO VIVO ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0" style={{ background: '#c79a3b' }}>2</div>
          <div>
            <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
              3 Aulas ao Vivo
            </h2>
            <p className="text-sm text-[#5f6b78]">Presenças obrigatórias para o certificado</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {(lives ?? []).map((live: { id: string; number: number; title: string; description: string; date_label: string; time_label: string; live_url: string; is_locked: boolean }) => (
            <div
              key={live.id}
              className="rounded-2xl overflow-hidden relative"
              style={{ background: '#fffaf3', border: '1px solid rgba(23,36,50,0.08)' }}
            >
              {/* Topo colorido */}
              <div
                className="p-4 relative"
                style={{
                  background: live.is_locked
                    ? 'linear-gradient(135deg, #1a2430, #2d3f52)'
                    : 'linear-gradient(135deg, #0f2233, #172432)',
                  opacity: live.is_locked ? 0.7 : 1,
                }}
              >
                <div className="flex items-start justify-between">
                  <span className="text-xs font-black text-white/60 uppercase tracking-widest">Aula {live.number}</span>
                  {live.is_locked
                    ? <Lock className="w-4 h-4 text-white/40" />
                    : <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  }
                </div>
                <p className="text-sm font-bold text-white mt-2 leading-snug">{live.title}</p>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-[#5f6b78] leading-relaxed">{live.description}</p>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#5f6b78]">
                    <Calendar className="w-3.5 h-3.5 shrink-0" style={{ color: '#c79a3b' }} />
                    {live.date_label}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#5f6b78]">
                    <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: '#c79a3b' }} />
                    {live.time_label}
                  </div>
                </div>

                {live.is_locked ? (
                  <div className="text-xs font-semibold text-center py-2 rounded-xl" style={{ background: 'rgba(23,36,50,0.05)', color: '#5f6b78' }}>
                    🔒 Disponível em breve
                  </div>
                ) : (
                  <a
                    href={live.live_url ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #1a2430, #2d3f52)' }}
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> Entrar na aula ao vivo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRODUTO LOW TICKET (BLOQUEADO) ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0" style={{ background: '#3b82f6' }}>3</div>
          <div>
            <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
              Oferta Especial para Você
            </h2>
            <p className="text-sm text-[#5f6b78]">Exclusivo para participantes do lançamento</p>
          </div>
        </div>

        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f2233, #172432)', border: '1px solid rgba(199,154,59,0.2)' }}
        >
          {/* Faixa de desconto */}
          <div className="absolute top-0 right-0">
            <div className="px-4 py-2 text-xs font-black text-white rounded-bl-2xl" style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}>
              OFERTA EXCLUSIVA
            </div>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-[1fr_auto] gap-6 items-center">
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c79a3b' }}>✦ Acesso Imediato</p>
              <h3 className="text-xl font-bold text-white leading-snug" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
                {config?.product_name ?? 'Formação Completa'}
              </h3>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {config?.product_description ?? 'Acesso completo a toda a formação.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                {['Acesso vitalício', 'Suporte individual', 'Comunidade exclusiva', 'Certificado oficial'].map((f) => (
                  <span key={f} className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(199,154,59,0.12)', color: '#ead29b', border: '1px solid rgba(199,154,59,0.2)' }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="text-center space-y-3 shrink-0">
              <div>
                <p className="text-xs text-white/40 line-through">De R$ 497</p>
                <p className="text-3xl font-black" style={{ color: '#e8b84b' }}>
                  {config?.product_price ?? 'R$ 97'}
                </p>
                <p className="text-xs text-white/40">ou 12x no cartão</p>
              </div>
              <a
                href={config?.product_url ?? '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#1a2430', boxShadow: '0 8px 32px rgba(199,154,59,0.35)' }}
              >
                <ShoppingCart className="w-4 h-4" />
                Quero garantir!
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICADO ── */}
      <section className="space-y-4" id="certificado">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}>
            <Award className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
              Resgate seu Certificado
            </h2>
            <p className="text-sm text-[#5f6b78]">Insira as 3 palavras-chave reveladas nas aulas ao vivo</p>
          </div>
        </div>

        <div className="rounded-2xl p-6" style={{ background: '#fffaf3', border: '1px solid rgba(23,36,50,0.08)' }}>
          {/* Aviso estratégico */}
          {!existingCert && (
            <div className="rounded-xl px-4 py-3 mb-5 text-sm" style={{ background: 'rgba(199,154,59,0.08)', border: '1px solid rgba(199,154,59,0.2)' }}>
              <p className="font-bold text-[#1a2430]">💡 Como funciona?</p>
              <p className="text-[#5f6b78] mt-0.5">
                Durante cada aula ao vivo, uma palavra-chave especial é revelada.
                Colete as 3 palavras e resgate seu certificado de participação oficial do Instituto Despertamente.
              </p>
            </div>
          )}
          <CertificadoForm existingCert={existingCert} />
        </div>
      </section>
    </div>
  )
}
