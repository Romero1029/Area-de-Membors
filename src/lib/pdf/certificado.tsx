import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

// A4 paisagem em pontos PDF
const W = 841.89
const H = 595.28

const S = StyleSheet.create({
  page: { width: W, height: H, padding: 0, backgroundColor: '#ffffff' },
  bg:   { position: 'absolute', top: 0, left: 0, width: W, height: H },

  // Data — "Nos dias XX de MMMM de AAAA"
  // Posição: ~23% do topo, 10% da esquerda
  dateRow: {
    position: 'absolute',
    top: H * 0.265,
    left: W * 0.083,
    flexDirection: 'row',
    gap: 3,
  },
  dateBold: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1a2430' },
  dateNormal: { fontSize: 12, fontFamily: 'Helvetica', color: '#1a2430' },

  // Nome do aluno — centro vertical entre o cabeçalho e as assinaturas
  nameWrapper: {
    position: 'absolute',
    top: H * 0.37,
    left: 0,
    width: W,
    alignItems: 'center',
  },
  name: {
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    color: '#1a2430',
    textAlign: 'center',
  },

  // Código — rodapé direito
  codeRow: {
    position: 'absolute',
    bottom: H * 0.03,
    right: W * 0.04,
    flexDirection: 'row',
    gap: 4,
  },
  codeLabel: { fontSize: 7.5, fontFamily: 'Helvetica', color: '#888888' },
  codeValue: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#c79a3b' },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  const day   = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('pt-BR', { month: 'long' })
  const year  = date.getFullYear().toString()
  return { day, month, year }
}

function generateCode() {
  return `IDM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type CertificadoPDFProps = {
  nome: string
  code?: string
  issuedAt?: Date
  bgUrl?: string
}

// ─── Template ─────────────────────────────────────────────────────────────────

export function CertificadoPDF({ nome, code, issuedAt, bgUrl }: CertificadoPDFProps) {
  const certCode          = code ?? generateCode()
  const { day, month, year } = formatDate(issuedAt ?? new Date())

  return (
    <Document
      title={`Certificado — ${nome}`}
      author="Instituto Despertamente"
      subject="Certificado de Participação"
    >
      <Page size="A4" orientation="landscape" style={S.page}>

        {/* Fundo */}
        {bgUrl && <Image src={bgUrl} style={S.bg} />}

        {/* Data */}
        <View style={S.dateRow}>
          <Text style={S.dateBold}>{day}</Text>
          <Text style={S.dateNormal}> de </Text>
          <Text style={S.dateBold}>{month}</Text>
          <Text style={S.dateNormal}> de </Text>
          <Text style={S.dateBold}>{year}</Text>
        </View>

        {/* Nome */}
        <View style={S.nameWrapper}>
          <Text style={S.name}>{nome}</Text>
        </View>

        {/* Código */}
        <View style={S.codeRow}>
          <Text style={S.codeLabel}>Cód:</Text>
          <Text style={S.codeValue}>{certCode}</Text>
        </View>

      </Page>
    </Document>
  )
}
