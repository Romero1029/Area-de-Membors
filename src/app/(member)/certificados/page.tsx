import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Award, Share2, ChevronRight, Sparkles, Download, Eye } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getFeaturedProduct } from '@/lib/actions/store'
import { CopyCodeButton } from './CopyCodeButton'
import { ShareCertificateButton } from './ShareCertificateButton'
import { BuyButton } from '@/components/marketing/BuyButton'

export default async function CertificadosPage({
  searchParams,
}: {
  searchParams: Promise<{ celebrar?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const celebrar = params.celebrar === 'true'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileRaw } = await (supabase as any)
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: certs } = await (supabase as any)
    .from('user_certificates')
    .select('*')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  const certificates = certs ?? []
  const userName = profileRaw?.full_name ?? 'Aluno'

  // Produto para upsell após certificado
  const nextProduct = celebrar ? await getFeaturedProduct() : null

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 space-y-8 pb-16">

      {/* Banner de celebração */}
      {celebrar && (
        <div className="relative overflow-hidden rounded-3xl border border-[#c79a3b]/30 bg-gradient-to-br from-[#c79a3b]/20 via-[#1a2430] to-[#0f2233] p-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c79a3b]/5 to-transparent" />
          <div className="relative space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="h-5 w-5 text-[#c79a3b]" />
              <span className="text-sm font-bold uppercase tracking-widest text-[#c79a3b]">Parabéns!</span>
              <Sparkles className="h-5 w-5 text-[#c79a3b]" />
            </div>
            <h2 className="font-fraunces text-2xl font-bold text-white">
              Você completou o lançamento!
            </h2>
            <p className="text-white/60 text-sm">
              Seu certificado foi emitido. Compartilhe sua conquista!
            </p>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)' }}>
          Meus Certificados
        </h1>
        <p className="text-sm text-white/50 mt-1">Seus certificados de participação e conclusão.</p>
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
          {certificates.map((cert: {
            id: string
            full_name: string
            certificate_code: string
            issued_at: string
            certificate_type: string
          }) => (
            <div
              key={cert.id}
              className="relative rounded-2xl overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #0f2233 0%, #172432 100%)', border: '1px solid rgba(199,154,59,0.25)' }}
            >
              {/* Linha dourada topo */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #c79a3b, #e8b84b, #c79a3b)' }} />

              <div className="p-6 space-y-4">
                <div className="flex items-start gap-5">
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

                  <CopyCodeButton code={cert.certificate_code} />
                </div>

                {/* Ações do certificado */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-white/10">
                  {/* Visualizar PDF */}
                  <Link
                    href={`/api/certificado/pdf?nome=${encodeURIComponent(cert.full_name)}&code=${cert.certificate_code}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: 'rgba(199,154,59,0.15)', color: '#e8b84b', border: '1px solid rgba(199,154,59,0.3)' }}
                  >
                    <Eye className="h-3.5 w-3.5" /> Visualizar PDF
                  </Link>

                  {/* Baixar PDF */}
                  <a
                    href={`/api/certificado/pdf?nome=${encodeURIComponent(cert.full_name)}&code=${cert.certificate_code}&download=1`}
                    download={`certificado-${cert.certificate_code}.pdf`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #c79a3b, #e8b84b)', color: '#0a0a0a' }}
                  >
                    <Download className="h-3.5 w-3.5" /> Baixar PDF
                  </a>

                  <ShareCertificateButton
                    userName={userName}
                    certType={cert.certificate_type === 'launch' ? 'Lançamento Gratuito' : 'Conclusão de Curso'}
                    issuedAt={cert.issued_at}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upsell pós-certificado */}
      {celebrar && nextProduct && (
        <div className="rounded-2xl border border-[#c79a3b]/20 bg-[#1a2430] p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-[#c79a3b]">Qual é o próximo passo?</p>
            <h3 className="font-fraunces text-xl font-bold text-white">{nextProduct.title}</h3>
            {nextProduct.short_description && (
              <p className="text-sm text-white/60">{nextProduct.short_description}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <BuyButton
              productId={nextProduct.id}
              label={nextProduct.cta_label ?? 'Quero evoluir'}
              checkoutUrl={nextProduct.checkout_url}
              variant="solid"
            />
            <Link href="/loja" className="flex items-center gap-1 text-xs text-white/40 hover:text-white/70 transition-colors">
              Ver todos os produtos <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {/* CTA para a loja */}
      {!celebrar && certificates.length > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-[#c79a3b]/20 bg-[#c79a3b]/8 p-4" style={{ background: 'rgba(199,154,59,0.07)' }}>
          <div className="flex items-center gap-3">
            <Share2 className="h-5 w-5 text-[#c79a3b]" />
            <div>
              <p className="text-sm font-semibold text-white">Pronto para o próximo nível?</p>
              <p className="text-xs text-white/50">Explore nossos cursos e mentorias.</p>
            </div>
          </div>
          <Link
            href="/loja"
            className="flex items-center gap-1 rounded-xl border border-[#c79a3b]/30 bg-[#c79a3b]/10 px-4 py-2 text-xs font-bold text-[#c79a3b] hover:bg-[#c79a3b]/20 transition-colors"
          >
            Ver loja <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      )}
    </div>
  )
}
