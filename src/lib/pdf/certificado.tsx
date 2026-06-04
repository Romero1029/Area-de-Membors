import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

// A4 paisagem em pontos PDF
const W = 841.89
const H = 595.28

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

// Tamanho de fonte dinâmico baseado no comprimento do nome
function nameFontSize(nome: string): number {
  const len = nome.length
  if (len <= 18) return 30
  if (len <= 26) return 26
  if (len <= 34) return 22
  return 18
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page:      { padding: 0, backgroundColor: '#ffffff' },
  container: { width: W, height: H, position: 'relative' },
  bg:        { position: 'absolute', top: 0, left: 0, width: W, height: H },

  // ── Dia: logo após "Nos dias" (~15% W, ~39% H)
  dayWrap: {
    position: 'absolute',
    top: H * 0.388,      // linha "Nos dias"
    left: W * 0.148,     // logo após "Nos dias "
    width: 28,
    alignItems: 'center',
  },

  // ── "de [mês] de [ano]": após o espaço do dia
  monthWrap: {
    position: 'absolute',
    top: H * 0.388,
    left: W * 0.188,     // após espaço do dia
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  dateBold:   { fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#1a2430' },
  dateNormal: { fontSize: 11, fontFamily: 'Helvetica',      color: '#1a2430' },

  // ── Nome: centralizado na área em branco entre a linha de data e o texto do curso
  nameWrapper: {
    position: 'absolute',
    top: H * 0.455,       // centro da área em branco do nome
    left: W * 0.12,
    width: W * 0.76,      // respeita as flores laterais
    alignItems: 'center',
  },

  // ── Código: canto inferior direito
  codeRow: {
    position: 'absolute',
    bottom: H * 0.03,
    right: W * 0.04,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  codeLabel: { fontSize: 7.5, fontFamily: 'Helvetica',      color: '#888888' },
  codeValue: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#c79a3b' },
})

// ─── Template ─────────────────────────────────────────────────────────────────

export type CertificadoPDFProps = {
  nome: string
  code?: string
  issuedAt?: Date
  bgUrl?: string
}

export function CertificadoPDF({ nome, code, issuedAt, bgUrl }: CertificadoPDFProps) {
  const certCode             = code ?? generateCode()
  const { day, month, year } = formatDate(issuedAt ?? new Date())
  const fontSize             = nameFontSize(nome)

  return (
    <Document
      title={`Certificado — ${nome}`}
      author="Instituto Despertamente"
      subject="Certificado de Participação"
    >
      <Page size="A4" orientation="landscape" style={S.page}>
        <View style={S.container}>

          {/* Fundo */}
          {bgUrl && <Image src={bgUrl} style={S.bg} />}

          {/* Dia */}
          <View style={S.dayWrap}>
            <Text style={S.dateBold}>{day}</Text>
          </View>

          {/* "de [mês] de [ano]" */}
          <View style={S.monthWrap}>
            <Text style={S.dateNormal}>de </Text>
            <Text style={S.dateBold}>{month}</Text>
            <Text style={S.dateNormal}> de </Text>
            <Text style={S.dateBold}>{year}</Text>
          </View>

          {/* Nome — fonte diminui para nomes longos */}
          <View style={S.nameWrapper}>
            <Text style={{ fontSize, fontFamily: 'Helvetica-Bold', color: '#1a2430', textAlign: 'center' }}>
              {nome}
            </Text>
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
