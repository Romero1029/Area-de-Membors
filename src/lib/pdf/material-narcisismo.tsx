import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'

const NAVY   = '#0D1638'
const SURFACE = '#0A1232'
const GOLD   = '#FFB800'
const WHITE  = '#FFFFFF'
const MUTED  = 'rgba(255,255,255,0.65)'

const S = StyleSheet.create({
  cover: {
    backgroundColor: NAVY,
    padding: 0,
    position: 'relative',
  },
  coverInner: {
    flex: 1,
    padding: 56,
    justifyContent: 'space-between',
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoSymbol: { width: 30, height: 30 },
  logoText: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: WHITE, letterSpacing: 1 },
  logoSub: { fontSize: 7, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },

  kicker: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: GOLD, letterSpacing: 3, marginBottom: 14 },
  coverTitle: { fontSize: 42, fontFamily: 'Helvetica-Bold', color: WHITE, lineHeight: 1.1 },
  coverSubtitle: { fontSize: 16, fontFamily: 'Helvetica', color: GOLD, marginTop: 10 },
  coverDivider: { width: 60, height: 3, backgroundColor: GOLD, marginTop: 26, marginBottom: 26, borderRadius: 2 },
  coverDesc: { fontSize: 10.5, fontFamily: 'Helvetica', color: MUTED, lineHeight: 1.6, maxWidth: 340 },

  coverFooter: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.12)', paddingTop: 14 },
  coverFooterText: { fontSize: 8, fontFamily: 'Helvetica', color: 'rgba(255,255,255,0.4)' },

  page: { backgroundColor: '#ffffff', padding: 48, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10 },
  headerBrand: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: NAVY, letterSpacing: 1 },
  headerPage: { fontSize: 8, fontFamily: 'Helvetica', color: '#999' },

  sectionKicker: { fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: GOLD, letterSpacing: 2, marginBottom: 6 },
  sectionTitle: { fontSize: 20, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 14 },
  paragraph: { fontSize: 10.5, fontFamily: 'Helvetica', color: '#333', lineHeight: 1.65, marginBottom: 12, textAlign: 'justify' },
  bold: { fontFamily: 'Helvetica-Bold', color: NAVY },

  boxTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: NAVY, marginTop: 18, marginBottom: 8 },
  bulletRow: { flexDirection: 'row', marginBottom: 8, gap: 8 },
  bulletDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: GOLD, marginTop: 4 },
  bulletText: { fontSize: 10.5, fontFamily: 'Helvetica', color: '#333', lineHeight: 1.55, flex: 1 },

  callout: { backgroundColor: '#FCF6E8', borderLeftWidth: 3, borderLeftColor: GOLD, padding: 14, marginTop: 16, marginBottom: 8, borderRadius: 4 },
  calloutText: { fontSize: 9.5, fontFamily: 'Helvetica-Oblique', color: '#555', lineHeight: 1.55 },

  footer: { position: 'absolute', bottom: 28, left: 48, right: 48, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: 7.5, fontFamily: 'Helvetica', color: '#999' },
  footerGold: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: GOLD },
})

function ContentPage({ page, total, children }: { page: number; total: number; children: React.ReactNode }) {
  return (
    <Page size="A4" style={S.page}>
      <View style={S.header}>
        <Text style={S.headerBrand}>INSTITUTO DESPERTAMENTE</Text>
        <Text style={S.headerPage}>{page}/{total}</Text>
      </View>
      {children}
      <View style={S.footer} fixed>
        <Text style={S.footerText}>Material de Apoio Exclusivo</Text>
        <Text style={S.footerGold}>Instituto Despertamente</Text>
      </View>
    </Page>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={S.bulletRow}>
      <View style={S.bulletDot} />
      <Text style={S.bulletText}>{children}</Text>
    </View>
  )
}

export type MaterialNarcisismoPDFProps = {
  logoUrl?: string
}

export function MaterialNarcisismoPDF({ logoUrl }: MaterialNarcisismoPDFProps) {
  const TOTAL_PAGES = 4

  return (
    <Document title="Narcisismo na Ótica da Psicanálise — Material de Apoio" author="Instituto Despertamente" subject="Material de Apoio">

      {/* CAPA */}
      <Page size="A4" style={S.cover}>
        <View style={S.coverInner}>
          <View style={S.logoRow}>
            {logoUrl && <Image src={logoUrl} style={S.logoSymbol} />}
            <View>
              <Text style={S.logoSub}>INSTITUTO</Text>
              <Text style={S.logoText}>DESPERTAMENTE</Text>
            </View>
          </View>

          <View>
            <Text style={S.kicker}>MATERIAL DE APOIO EXCLUSIVO</Text>
            <Text style={S.coverTitle}>Narcisismo</Text>
            <Text style={S.coverSubtitle}>na Ótica da Psicanálise</Text>
            <View style={S.coverDivider} />
            <Text style={S.coverDesc}>
              Um aprofundamento no conceito psicanalítico de narcisismo — suas origens teóricas,
              suas formas saudáveis e patológicas, e como reconhecer essas dinâmicas nas relações.
              Complementa o conteúdo da aula que você acabou de assistir.
            </Text>
          </View>

          <View style={S.coverFooter}>
            <Text style={S.coverFooterText}>Conteúdo produzido pelo Instituto Despertamente · Uso educativo</Text>
          </View>
        </View>
      </Page>

      {/* PÁGINA 1 — O que é narcisismo para a psicanálise */}
      <ContentPage page={1} total={TOTAL_PAGES}>
        <Text style={S.sectionKicker}>ORIGEM DO CONCEITO</Text>
        <Text style={S.sectionTitle}>O que é o narcisismo para a psicanálise</Text>
        <Text style={S.paragraph}>
          O termo <Text style={S.bold}>narcisismo</Text> tem origem no mito grego de Narciso, o jovem que se apaixona
          pela própria imagem refletida na água e é incapaz de se afastar dela. Freud toma esse mito para nomear um
          fenômeno psíquico: a libido — a energia do desejo — voltada para o próprio eu, em vez de dirigida a um objeto externo.
        </Text>
        <Text style={S.paragraph}>
          Em <Text style={S.bold}>&quot;Sobre o Narcisismo: Uma Introdução&quot; (1914)</Text>, Freud estabelece o narcisismo
          como um conceito central da teoria psicanalítica — não como um defeito de caráter isolado, mas como uma etapa
          estrutural do desenvolvimento psíquico, presente em todo ser humano.
        </Text>
        <Text style={S.boxTitle}>Narcisismo primário x secundário</Text>
        <Bullet>
          <Text style={S.bold}>Narcisismo primário</Text> — o investimento libidinal original no próprio eu, típico da
          primeiríssima infância, antes de o bebê diferenciar-se claramente do mundo externo.
        </Bullet>
        <Bullet>
          <Text style={S.bold}>Narcisismo secundário</Text> — ocorre quando a libido, já direcionada a objetos externos
          (pessoas, vínculos), retorna a se concentrar no eu — frequentemente como resposta a frustrações ou feridas emocionais.
        </Bullet>
        <View style={S.callout}>
          <Text style={S.calloutText}>
            Importante: um grau saudável de narcisismo é necessário para a autoestima e a autopreservação.
            O problema surge quando ele se torna rígido, excessivo ou a principal forma de regular a autoimagem.
          </Text>
        </View>
      </ContentPage>

      {/* PÁGINA 2 — contribuições pós-freudianas */}
      <ContentPage page={2} total={TOTAL_PAGES}>
        <Text style={S.sectionKicker}>DESENVOLVIMENTOS TEÓRICOS</Text>
        <Text style={S.sectionTitle}>Contribuições pós-freudianas</Text>
        <Text style={S.paragraph}>
          Depois de Freud, outros autores aprofundaram o estudo do narcisismo, especialmente em suas formas patológicas —
          quando ele deixa de ser uma etapa do desenvolvimento e passa a organizar toda a personalidade.
        </Text>
        <Text style={S.boxTitle}>Heinz Kohut — o &quot;self grandioso&quot;</Text>
        <Text style={S.paragraph}>
          Kohut descreveu o <Text style={S.bold}>self grandioso</Text>: uma imagem inflada e idealizada de si mesmo,
          construída para compensar uma fragilidade interna. Para ele, a grandiosidade não é o oposto da insegurança —
          é, muitas vezes, a máscara dela.
        </Text>
        <Text style={S.boxTitle}>Otto Kernberg — organização narcisista de personalidade</Text>
        <Text style={S.paragraph}>
          Kernberg descreveu como o narcisismo patológico se estrutura como um traço estável de personalidade,
          marcado por um senso de si grandioso, forte necessidade de admiração externa e dificuldade genuína
          de reconhecer o outro como um sujeito com necessidades próprias.
        </Text>
        <View style={S.callout}>
          <Text style={S.calloutText}>
            Esses conceitos ajudam a entender por que pessoas com traços narcisistas intensos costumam ter
            relações instáveis: a admiração alheia funciona como sustento da autoimagem — e qualquer ameaça a
            ela pode gerar reações desproporcionais.
          </Text>
        </View>
      </ContentPage>

      {/* PÁGINA 3 — identificando traços */}
      <ContentPage page={3} total={TOTAL_PAGES}>
        <Text style={S.sectionKicker}>NA PRÁTICA</Text>
        <Text style={S.sectionTitle}>Como reconhecer traços narcisistas</Text>
        <Text style={S.paragraph}>
          Nenhuma lista substitui uma avaliação clínica — este material tem fins educativos. Ainda assim, a
          psicanálise aponta alguns padrões recorrentes que ajudam a entender essas dinâmicas nas relações do dia a dia:
        </Text>
        <Bullet>Necessidade constante de admiração e validação externa para sustentar a autoimagem.</Bullet>
        <Bullet>Dificuldade genuína de reconhecer os sentimentos e necessidades do outro como legítimos.</Bullet>
        <Bullet>Sensibilidade intensa a críticas, mesmo construtivas — vividas como ataque.</Bullet>
        <Bullet>Tendência a usar as relações para reforçar a própria imagem, mais do que para se conectar.</Bullet>
        <Bullet>Alternância entre grandiosidade e momentos de esvaziamento ou vazio interno.</Bullet>
        <Text style={S.boxTitle}>Por que isso importa</Text>
        <Text style={S.paragraph}>
          Entender essas dinâmicas — em si mesmo ou em relações importantes — é o primeiro passo para lidar com
          elas de forma mais consciente, seja buscando apoio terapêutico, seja estabelecendo limites mais saudáveis.
        </Text>
      </ContentPage>

      {/* PÁGINA 4 — fechamento */}
      <ContentPage page={4} total={TOTAL_PAGES}>
        <Text style={S.sectionKicker}>PARA REFLETIR</Text>
        <Text style={S.sectionTitle}>O que levar dessa aula</Text>
        <Text style={S.paragraph}>
          Compreender o narcisismo pela ótica da psicanálise não é sobre rotular pessoas — é sobre desenvolver um
          olhar mais atento para as dinâmicas psíquicas que moldam a forma como nos relacionamos, conosco e com os outros.
        </Text>
        <Text style={S.paragraph}>
          Se esse tema tocou em alguma relação da sua vida, vale a pena aprofundar: converse com um profissional,
          revisite os pontos deste material e observe esses padrões com mais calma antes de tirar conclusões definitivas.
        </Text>
        <View style={S.callout}>
          <Text style={S.calloutText}>
            Este conteúdo é educativo e não substitui acompanhamento psicológico ou psiquiátrico profissional.
          </Text>
        </View>
        <Text style={{ ...S.paragraph, marginTop: 24 }}>
          Obrigado por concluir esta aula com a gente. Continue acompanhando o Instituto Despertamente para
          mais conteúdos como este.
        </Text>
      </ContentPage>

    </Document>
  )
}
