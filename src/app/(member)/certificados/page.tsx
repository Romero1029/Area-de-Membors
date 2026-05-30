import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Award, Copy, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function CertificadosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: certs } = await (supabase as any)
    .from('user_certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  const certificates = certs ?? []

  return (
    <div className="max-w-3xl space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#1a2430]" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
          Meus Certificados
        </h1>
        <p className="text-sm text-[#5f6b78] mt-1">Seus certificados de participação e conclusão.</p>
      </div>

      {certificates.length === 0 ? (
        <div
          className="rounded-2xl p-14 text-center space-y-4"
          style={{ background: '#fffaf3', border: '1px dashed rgba(23,36,50,0.12)' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto" style={{ background: 'rgba(199,154,59,0.1)', border: '1px solid rgba(199,154,59,0.2)' }}>
            <Award className="w-7 h-7" style={{ color: '#c79a3b' }} />
          </div>
          <div>
            <p className="font-bold text-[#1a2430]">Nenhum certificado ainda</p>
            <p className="text-sm text-[#5f6b78] mt-1">
              Participe das aulas ao vivo e resgate seu primeiro certificado.
            </p>
          </div>
          <Link
            href="/lancamento#certificado"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)' }}
          >
            <Award className="w-4 h-4" /> Resgatar certificado
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert: { id: string; full_name: string; certificate_code: string; issued_at: string; certificate_type: string }) => (
            <div
              key={cert.id}
              className="relative rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0f2233 0%, #172432 100%)', border: '1px solid rgba(199,154,59,0.25)' }}
            >
              {/* Linha dourada topo */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c79a3b, #e8b84b, #c79a3b)' }} />

              <div className="p-6 flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(199,154,59,0.15)', border: '1px solid rgba(199,154,59,0.3)' }}>
                  <Award className="w-7 h-7" style={{ color: '#c79a3b' }} />
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: '#c79a3b' }}>
                      {cert.certificate_type === 'launch' ? 'Lançamento Gratuito' : 'Certificado de Conclusão'}
                    </p>
                    <p className="text-base font-bold text-white mt-0.5" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
                      {cert.full_name}
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      Instituto Despertamente
                    </p>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    <code className="text-xs font-bold px-2.5 py-1 rounded-lg" style={{ background: 'rgba(199,154,59,0.12)', color: '#e8b84b' }}>
                      {cert.certificate_code}
                    </code>
                    <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      Emitido em {new Date(cert.issued_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigator.clipboard?.writeText(cert.certificate_code)}
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
                  style={{ color: 'rgba(255,255,255,0.4)' }}
                  title="Copiar código"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
