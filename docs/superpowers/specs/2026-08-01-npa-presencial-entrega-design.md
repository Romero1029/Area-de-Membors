# /npa-presencial — Página de entrega do material NPA (e-book + telas)

**Data:** 2026-08-01
**Status:** aprovado para virar plano de implementação
**Substitui:** a versão anterior deste spec, escrita no repositório `Sistema 11ds`
(`docs/superpowers/specs/2026-08-01-npa-entrega-material-design.md`), que colocava a
página dentro daquele projeto. O usuário confirmou que a página deve ficar na Área de
Membros IDM (`idm-membros`), em `/npa-presencial`, mesmo que os dados continuem vivendo
no CRM do Sistema 11ds.

## Contexto e motivação

Nas aulas presenciais do NPA (Numerologia Pitagórica Aplicada), depois de cada turma são
vendidos um e-book e as "telas" (mapas numerológicos individuais) como material
complementar. O pedido é criar uma página, com a estética já usada em "Seu Numerólogo" e
no Instituto Despertamente (parceiro nesta entrega), que:

- Identifica o comprador e casa o cadastro com o CRM real — tabela `npa_evento_leads`,
  no projeto Supabase **"Plataforma 11ds"** (id `usqiyekfmwwnvkmkdlej`,
  `https://usqiyekfmwwnvkmkdlej.supabase.co`), que é o "Sistema 11 Digital" citado pelo
  usuário — marcando `comprou_material = true`.
- Só libera qualquer conteúdo (inclusive o e-book) depois dessa identificação. Antes de
  identificar, a pessoa só vê o nome do evento e o formulário.
- Entrega o e-book (link fixo por edição, liberado assim que a pessoa se identifica).
- Mantém as telas bloqueadas até o apresentador liberar ao vivo, no fim da aula — o link
  das telas só é definido depois, ao vivo.
- Junto da liberação das telas, mostra uma oferta de sessão individual do mapa com o
  Rodrygo (R$850 → R$300, vagas limitadas), os Instagrams `@murarirodrygo` e
  `@institutodespertamente`, e um botão fixo de WhatsApp da equipe (5511919434040).
- Funciona para qualquer edição/cidade do NPA (hoje é o NPA #17 Campinas, mas o mesmo
  evento se repete em outras cidades), com um jeito rápido de trocar os links por edição.

Investigação no banco confirmou que `npa_eventos` já tem uma linha ativa **"NPA #17
Campinas"** (data 2026-08-01, hoje) e que `npa_evento_leads` já tem o campo
`comprou_material`. Todas as tabelas envolvidas exigem `auth.role() = 'authenticated'`
via RLS — inacessíveis a partir do cliente público com a chave anônima.

## Onde vive

A feature inteira — página pública, painel de controle e as chamadas ao banco — é
implementada dentro do **idm-membros** (Next.js 14, App Router), o mesmo projeto da Área
de Membros IDM. O idm-membros passa a agir como um servidor de confiança que acessa o
projeto Supabase do Sistema 11ds pelo lado do servidor (Route Handlers), usando a
**service role key** — nunca exposta ao navegador. Isso evita duplicar lógica de negócio
em dois repositórios/linguagens diferentes (não se cria nenhuma Edge Function no
Supabase para isso): todo o backend desta feature é código Next.js dentro do
idm-membros.

O idm-membros continua com seu próprio banco Prisma/SQLite para as próprias entidades
(cursos, usuários) — isso não muda. A conexão com o Supabase do Sistema 11ds é só para
esta feature, isolada num client próprio.

**Segredo novo necessário em `idm-membros/.env`** (o usuário precisa pegar no painel do
Supabase → Settings → API do projeto `usqiyekfmwwnvkmkdlej`, não é algo que dá pra obter
via ferramenta automatizada por ser uma chave secreta):

```
SISTEMA11_SUPABASE_URL=https://usqiyekfmwwnvkmkdlej.supabase.co
SISTEMA11_SUPABASE_SERVICE_ROLE_KEY=<pegar no dashboard do Supabase>
```

## Arquitetura

### 1. Migration no Supabase do Sistema 11ds (`npa_eventos` / `npa_evento_leads`)

Continua igual — roda contra o projeto `usqiyekfmwwnvkmkdlej`, independente de qual app
chama o banco depois:

```sql
alter table npa_eventos
  add column slug              text unique,
  add column ebook_url         text,
  add column telas_url         text,
  add column telas_liberado    boolean not null default false,
  add column telas_liberado_em timestamptz;

alter table npa_evento_leads
  add column material_entregue_em timestamptz;
```

`slug` é preenchido manualmente pelo painel admin (ex: `npa-17-campinas`) — é o segmento
de URL em `/npa-presencial/[slug]`. As 10 linhas hoje existentes em `npa_eventos`
(incluindo o NPA #17 Campinas) nascem com `slug` vazio; o operador preenche antes de
divulgar o link daquela edição.

### 2. Client Supabase server-only (`lib/sistema11.ts`, novo)

Um helper que cria um `SupabaseClient` (pacote `@supabase/supabase-js`, nova dependência
do idm-membros) usando `SISTEMA11_SUPABASE_URL` + `SISTEMA11_SUPABASE_SERVICE_ROLE_KEY`.
Só é importado a partir de Route Handlers (`app/api/**`) — nunca de um Client Component,
já que a service role key não pode vazar pro navegador.

### 3. Route Handlers (`app/api/npa-presencial/...`, novos)

| Rota | Método | Entrada | O que faz | Saída |
|---|---|---|---|---|
| `/api/npa-presencial/evento` | POST | `{ slug }` | Busca o evento pelo slug no Supabase do Sistema 11ds. Não retorna nenhum link nem dado sensível. | `{ nome, local, data_evento, professor_convidado }` |
| `/api/npa-presencial/claim` | POST | `{ slug, nome, email, whatsapp }` | Busca lead em `npa_evento_leads` (do evento) por `email` ou `whatsapp` normalizado (só dígitos). Achou → atualiza `comprou_material=true`, `material_entregue_em=now()`. Não achou → insere lead novo com `fase='novo'`, `comprou_material=true`, `observacoes` sinalizando que veio da página sem match prévio no CRM. Registra em `npa_eventos_log` (evento=`material_entregue`). | `{ lead_id, ebook_url, telas_liberado, telas_url? }` |
| `/api/npa-presencial/refresh` | POST | `{ slug, lead_id }` | Confirma que o `lead_id` pertence ao evento e devolve o estado atual das telas — sem escrever nada, sem logar. Usado pelo polling. | `{ telas_liberado, telas_url? }` |
| `/api/npa-presencial/admin` | PATCH | `{ eventoId, slug?, ebook_url?, telas_url?, telas_liberado? }` | **Protegida**: confere `getServerSession` + `role === "ADMIN"` (mesmo padrão de `app/admin/alunos/layout.tsx`) antes de aceitar a escrita. Atualiza o evento no Supabase do Sistema 11ds. Se `telas_liberado: true`, exige `telas_url` já preenchido (no evento ou no próprio payload) e grava `telas_liberado_em=now()`. | evento atualizado |
| `/api/npa-presencial/admin` | GET | — | **Protegida** (mesma checagem). Lista os eventos de `npa_eventos` pra popular o seletor do painel. | lista de eventos |

`claim` só roda uma vez por identificação (não é chamado de novo no polling — por isso
existe `refresh` separado, pra não duplicar linhas de log a cada ciclo).

### 4. Página pública `/npa-presencial/[slug]`

`app/npa-presencial/[slug]/page.tsx` (Server Component simples, só resolve o `params` e
renderiza o client component) + `NpaPresencialClient.tsx` (Client Component com todo o
estado/interação), seguindo o padrão já usado em `app/cursos/page.tsx` +
`CursosClient.tsx`.

**Fluxo:**

1. Ao montar, chama `POST /api/npa-presencial/evento` pra pegar nome/cidade/data e
   mostrar no topo — nenhum outro conteúdo (nem o card do e-book) aparece antes disso.
2. Se já existe uma identificação salva no `localStorage` (chave por slug) com
   `lead_id`, pula direto pro passo 4.
3. Mostra só o formulário (nome, e-mail, WhatsApp) sobre o nome do evento. Ao enviar,
   chama `claim`. Erro de rede → mensagem com botão "Tentar de novo". Se o evento não
   existir (slug errado) → tela de "evento não encontrado", sem formulário.
4. Salva `{ lead_id, nome }` no `localStorage` e mostra:
   - Card do e-book, sempre liberado (usa `ebook_url` retornado).
   - Card das telas: se `telas_liberado` for falso, aparece bloqueado — cadeado sobre uma
     prévia abstrata borrada (gráfico numerológico genérico em SVG/CSS, sem depender de
     imagem real) e o texto "libera ao vivo, no fim da aula". Se verdadeiro, mostra o
     botão "Ver minhas telas".
5. Enquanto `telas_liberado` for falso, a página consulta `refresh` a cada ~20s (e
   também ao voltar o foco na aba) pra saber se já foi liberado, sem precisar recarregar.
6. Ao clicar em "Ver minhas telas": abre `telas_url` numa aba nova **e** revela, na
   mesma página, o card da oferta do Rodrygo (preço riscado 850 → 300, "vagas
   limitadas", botão que abre o WhatsApp da equipe com mensagem pronta) junto dos links
   dos dois Instagrams. Nada disso aparece antes desse clique.
7. Botão flutuante de WhatsApp da equipe (5511919434040) fica sempre visível no canto,
   independente do estado — para dúvidas gerais, não é a oferta do Rodrygo.

**Visual:** estética "elegante/editorial" do Seu Numerólogo — fundo quase preto
(`#0C0800`/`#0a0700`), dourado em variações (`#D4B06A`, `#C8951A`, `#F0CC80`), tipografia
serifada nos títulos, cabeçalho discreto "NPA #[N] [Cidade] × Instituto Despertamente".
Mesma paleta e espaçamento em todos os estados (formulário → e-book liberado → telas
bloqueadas → telas liberadas → oferta), pra não parecer telas desenhadas em momentos
diferentes. Estilos escritos com CSS escopado a essa rota (não mexe no tema Tailwind
escuro/dourado `#FFA902` já usado no resto da Área de Membros — os dois convivem, mas
essa rota tem identidade visual própria por ser co-branded com o Instituto Despertamente
e o Seu Numerólogo, não uma tela interna de curso).

### 5. Painel `/admin/npa-presencial`

`app/admin/npa-presencial/page.tsx`, protegida com a mesma checagem server-side de
`app/admin/alunos/layout.tsx` (`getServerSession` + `role === "ADMIN"`, redireciona pra
`/login` ou `/dashboard` se não passar). Não usa o shell completo de
Sidebar/Header/BottomNav do resto do admin — é uma tela enxuta e mobile-first (poucos
campos, botões grandes), pensada pra abrir rápido pelo celular durante a aula.

Conteúdo: lista os eventos de `npa_eventos` (busca por nome, evento com `ativo=true` e
data mais próxima de hoje aparece primeiro), e ao selecionar um permite editar `slug`,
`ebook_url`, `telas_url`, e apertar **"Liberar telas"** (chama o PATCH, exige `telas_url`
preenchido) ou **"Bloquear de novo"**.

## Erros e casos de borda

- Slug não encontrado → página de erro amigável, sem formulário.
- Falha ao identificar (rede/servidor) → botão de tentar de novo, sem perder o que foi
  digitado.
- Lead que já foi identificado antes (já tem `lead_id` salvo no navegador) mas
  `comprou_material` for alterado manualmente pra `false` no CRM → a página não
  reverte sozinha; ela só lê o estado das telas via `refresh`, que sempre responde com
  base no `lead_id` já obtido.
- Tentativa de liberar telas no painel sem `telas_url` preenchido → bloqueado com aviso
  antes de gravar.
- Dois dispositivos diferentes se identificando com os mesmos dados → cada um recebe seu
  próprio fluxo normalmente; o `claim` é idempotente em relação ao lead do CRM (atualiza
  o mesmo registro, não duplica).
- Acesso a `/admin/npa-presencial` ou às rotas `/api/npa-presencial/admin` sem sessão
  ADMIN válida → bloqueado, mesmo padrão do resto do admin do idm-membros.

## Fora de escopo (não pedido, não incluído)

- Nenhum fluxo de pagamento nesta página — o material já foi vendido ao vivo no evento;
  aqui só se confirma a identidade e libera a entrega.
- Nenhuma tela de gestão de leads além do necessário para liberar as telas (a gestão
  completa de leads do NPA já existe no painel interno do Sistema 11ds).
- Preço/condições da oferta do Rodrygo, Instagrams e WhatsApp da equipe são fixos no
  código (não variam por edição/cidade) — não pedido, sem campo no banco para isso.
- Nenhuma Edge Function nova no Supabase — toda a lógica de servidor fica em Route
  Handlers do idm-membros.
