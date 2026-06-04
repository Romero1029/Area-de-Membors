import {
  Document, Page, View, Text, Image, Font,
  StyleSheet,
} from '@react-pdf/renderer'

// ─── Fonts ────────────────────────────────────────────────────────────────────
// Usando fontes built-in do react-pdf (sem dependência de arquivos externos).
// Quando você tiver a fonte IDM, registre aqui com Font.register().
//
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
// })

// ─── Estilos ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#0f1e2d',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Helvetica',
  },

  // Quando você tiver a imagem de fundo, descomente:
  // backgroundImage: {
  //   position: 'absolute',
  //   top: 0, left: 0, right: 0, bottom: 0,
  // },

  outerBorder: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    border: '1pt solid #c79a3b',
    borderRadius: 4,
  },

  innerBorder: {
    position: 'absolute',
    top: 22,
    left: 22,
    right: 22,
    bottom: 22,
    border: '0.5pt solid rgba(199,154,59,0.4)',
    borderRadius: 3,
  },

  container: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 50,
    gap: 0,
  },

  topLine: {
    width: 80,
    height: 2,
    backgroundColor: '#c79a3b',
    marginBottom: 20,
  },

  instituteName: {
    fontSize: 9,
    letterSpacing: 3,
    color: '#c79a3b',
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: 'Helvetica',
  },

  certTitle: {
    fontSize: 22,
    color: '#f0f0f0',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    textAlign: 'center',
  },

  certSubtitle: {
    fontSize: 10,
    color: 'rgba(240,240,240,0.5)',
    marginBottom: 32,
    textAlign: 'center',
  },

  certifiesLabel: {
    fontSize: 9,
    color: 'rgba(240,240,240,0.45)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
    fontFamily: 'Helvetica',
  },

  participantName: {
    fontSize: 32,
    color: '#ffffff',
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
    textAlign: 'center',
  },

  nameLine: {
    width: 260,
    height: 1,
    backgroundColor: 'rgba(199,154,59,0.4)',
    marginBottom: 28,
  },

  descriptionText: {
    fontSize: 10,
    color: 'rgba(240,240,240,0.55)',
    textAlign: 'center',
    lineHeight: 1.6,
    maxWidth: 360,
    marginBottom: 36,
  },

  courseName: {
    color: '#e8b84b',
    fontFamily: 'Helvetica-Bold',
  },

  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 36,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(199,154,59,0.2)',
    maxWidth: 80,
  },

  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#c79a3b',
  },

  footerRow: {
    flexDirection: 'row',
    gap: 60,
    alignItems: 'flex-start',
  },

  footerBlock: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },

  footerLine: {
    width: 100,
    height: 1,
    backgroundColor: 'rgba(199,154,59,0.35)',
  },

  footerLabel: {
    fontSize: 7.5,
    color: 'rgba(240,240,240,0.4)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },

  footerValue: {
    fontSize: 8,
    color: 'rgba(240,240,240,0.65)',
    textAlign: 'center',
    fontFamily: 'Helvetica',
  },

  codeRow: {
    position: 'absolute',
    bottom: 32,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  codeLabel: {
    fontSize: 7,
    color: 'rgba(240,240,240,0.25)',
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontFamily: 'Helvetica',
  },

  codeValue: {
    fontSize: 7.5,
    color: '#c79a3b',
    letterSpacing: 1.5,
    fontFamily: 'Helvetica-Bold',
  },

  cornament: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'rgba(199,154,59,0.5)',
  },
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function generateCode() {
  return `IDM-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

// ─── Props ────────────────────────────────────────────────────────────────────

export type CertificadoPDFProps = {
  nome: string
  courseName?: string
  code?: string
  issuedAt?: Date
}

// ─── Template ─────────────────────────────────────────────────────────────────
//
// PARA USAR SUA IMAGEM DE FUNDO:
// 1. Coloque o arquivo em /public/certificado-bg.png (ou .jpg)
// 2. No <Page>, descomente o componente <Image> abaixo
// 3. Ajuste as posições absolutas dos textos conforme necessário

export function CertificadoPDF({
  nome,
  courseName = 'Instituto Despertamente',
  code,
  issuedAt,
}: CertificadoPDFProps) {
  const certCode = code ?? generateCode()
  const date = issuedAt ?? new Date()

  return (
    <Document
      title={`Certificado — ${nome}`}
      author="Instituto Despertamente"
      subject="Certificado de Participação"
    >
      <Page size="A4" orientation="landscape" style={styles.page}>

        {/*
          DESCOMENTE QUANDO TIVER A IMAGEM DE FUNDO:
          <Image
            src="/public/certificado-bg.png"
            style={styles.backgroundImage}
            fixed
          />
        */}

        {/* Bordas decorativas */}
        <View style={styles.outerBorder} />
        <View style={styles.innerBorder} />

        {/* Conteúdo central */}
        <View style={styles.container}>
          <View style={styles.topLine} />

          <Text style={styles.instituteName}>Instituto Despertamente</Text>
          <Text style={styles.certTitle}>Certificado de Participação</Text>
          <Text style={styles.certSubtitle}>{courseName}</Text>

          <Text style={styles.certifiesLabel}>Certifica que</Text>

          <Text style={styles.participantName}>{nome}</Text>
          <View style={styles.nameLine} />

          <Text style={styles.descriptionText}>
            participou e concluiu com êxito as atividades propostas pelo{'\n'}
            <Text style={styles.courseName}>{courseName}</Text>,{'\n'}
            demonstrando dedicação e comprometimento com o aprendizado.
          </Text>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footerRow}>
            <View style={styles.footerBlock}>
              <View style={styles.footerLine} />
              <Text style={styles.footerLabel}>Data de emissão</Text>
              <Text style={styles.footerValue}>{formatDate(date)}</Text>
            </View>
            <View style={styles.footerBlock}>
              <View style={styles.footerLine} />
              <Text style={styles.footerLabel}>Diretor</Text>
              <Text style={styles.footerValue}>Instituto Despertamente</Text>
            </View>
          </View>
        </View>

        {/* Código do certificado */}
        <View style={styles.codeRow}>
          <Text style={styles.codeLabel}>Cód:</Text>
          <Text style={styles.codeValue}>{certCode}</Text>
        </View>
      </Page>
    </Document>
  )
}
