import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

// A4 paisagem em pontos PDF
const W = 841.89
const H = 595.28

const S = StyleSheet.create({
  page: { padding: 0, backgroundColor: '#ffffff' },

  // Container raiz com dimensões explícitas — impede geração de segunda página
  container: {
    width: W,
    height: H,
    position: 'relative',
  },

  bg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: W,
    height: H,
  },

  dateRow: {
    position: 'absolute',
    top: 157,       // ~26% de 595
    left: 70,       // ~8% de 842
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateBold:   { fontSize: 12, fontFamily: 'Helvetica-Bold', color: '#1a2430' },
  dateNormal: { fontSize: 12, fontFamily: 'Helvetica',      color: '#1a2430' },

  nameWrapper: {
    position: 'absolute',
    top: 220,       // ~37% de 595
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

  codeRow: {
    position: 'absolute',
    bottom: 18,
    right: 34,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  codeLabel: { fontSize: 7.5, fontFamily: 'Helvetica',      color: '#888888' },
  codeValue: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#c79a3b' },
})

function formatDate(date: Date) {
  const day   = date.getDate().toString().padStart(2, '0')
  const month = date.toLocaleDateString('pt-BR', { month: 'long' })
  const year  = date.getFullYear().toString()
  return { day, month, year }
}

function generateCode() {
  return `IDM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

export type CertificadoPDFProps = {
  nome: string
  code?: string
  issuedAt?: Date
  bgUrl?: string
}

export function CertificadoPDF({ nome, code, issuedAt, bgUrl }: CertificadoPDFProps) {
  const certCode             = code ?? generateCode()
  const { day, month, year } = formatDate(issuedAt ?? new Date())

  return (
    <Document
      title={`Certificado — ${nome}`}
      author="Instituto Despertamente"
      subject="Certificado de Participação"
    >
      <Page size="A4" orientation="landscape" style={S.page}>
        {/*
          Container com height: H fixo.
          Todos os filhos são absolutamente posicionados DENTRO desse container.
          Isso impede que o react-pdf gere uma segunda página.
        */}
        <View style={S.container}>

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

        </View>
      </Page>
    </Document>
  )
}
