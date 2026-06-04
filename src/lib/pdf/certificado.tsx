import { Document, Page, View, Text, Image, Font, StyleSheet } from '@react-pdf/renderer'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  const day   = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('pt-BR', { month: 'long' })
  const year  = date.getFullYear()
  return { day, month, year }
}

function generateCode() {
  return `IDM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  // Imagem de fundo cobre a página inteira
  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  // Overlay com todos os textos dinâmicos
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },

  // ── Data: "Nos dias XX de MMMM de AAAA"
  // Posicionado na linha após o subtítulo do certificado
  dateRow: {
    position: 'absolute',
    top: '23%',       // ajuste vertical conforme a imagem
    left: '10%',
    right: '10%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 4,
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2430',
  },

  // ── Nome do aluno: área grande centralizada
  nameWrapper: {
    position: 'absolute',
    top: '37%',       // ajuste vertical conforme a imagem
    left: '10%',
    right: '10%',
    alignItems: 'center',
  },
  name: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2430',
    textAlign: 'center',
  },

  // ── Código discreto no rodapé
  codeRow: {
    position: 'absolute',
    bottom: '5%',
    right: '5%',
    flexDirection: 'row',
    gap: 4,
  },
  codeLabel: {
    fontSize: 7,
    color: '#888888',
    fontFamily: 'Helvetica',
  },
  codeValue: {
    fontSize: 7,
    color: '#c79a3b',
    fontFamily: 'Helvetica-Bold',
  },
})

// ─── Componente ───────────────────────────────────────────────────────────────

export type CertificadoPDFProps = {
  nome: string
  code?: string
  issuedAt?: Date
  bgUrl?: string     // URL pública da imagem de fundo (default: /certificado-bg.png)
}

export function CertificadoPDF({
  nome,
  code,
  issuedAt,
  bgUrl,
}: CertificadoPDFProps) {
  const certCode = code ?? generateCode()
  const date     = issuedAt ?? new Date()
  const { day, month, year } = formatDate(date)

  // URL da imagem — usa a URL do site em produção, ou placeholder em desenvolvimento
  const siteUrl    = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const imageUrl   = bgUrl ?? `${siteUrl}/CERTIFICADO_NPA_SP_-_.png`

  return (
    <Document
      title={`Certificado — ${nome}`}
      author="Instituto Despertamente"
      subject="Certificado de Participação"
    >
      <Page size="A4" orientation="landscape" style={S.page}>

        {/* ── Fundo: imagem do certificado ── */}
        <Image src={imageUrl} style={S.bg} />

        {/* ── Overlays dinâmicos ── */}
        <View style={S.overlay}>

          {/* Data */}
          <View style={S.dateRow}>
            <Text style={S.dateText}>{day}</Text>
            <Text style={[S.dateText, { fontFamily: 'Helvetica' }]}> de </Text>
            <Text style={S.dateText}>{month}</Text>
            <Text style={[S.dateText, { fontFamily: 'Helvetica' }]}> de </Text>
            <Text style={S.dateText}>{year}</Text>
          </View>

          {/* Nome do aluno */}
          <View style={S.nameWrapper}>
            <Text style={S.name}>{nome}</Text>
          </View>

          {/* Código do certificado */}
          <View style={S.codeRow}>
            <Text style={S.codeLabel}>Cód:</Text>
            <Text style={S.codeValue}>{certCode}</Text>
          </View>

        </View>
      </Page>
    </Document>
  )
}
