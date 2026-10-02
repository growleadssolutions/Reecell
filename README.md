# ReeCell — fundação Astro

Projeto local para migração SEO do WordPress. Astro 7.3.2, TypeScript strict,
CSS próprio e geração estática. Os 23 artigos mantêm as URLs datadas originais.

**Migração SEO:** consulte [o relatório atual](docs/seo-migration/REPORT.md),
com mapa de 75 URLs, arquivos preservados e regras HTTP 301 em `vercel.json`.
Vercel é um destino provisório: ainda não houve deploy ou validação da hospedagem.
Não trocar DNS antes de cumprir os gates do relatório.

## Executar no Windows

Node recomendado: 24 LTS (ambiente validado: 24.15.0). npm 11.12.1.

```powershell
npm.cmd ci
npm.cmd run dev -- --background
npm.cmd run astro -- dev status
npm.cmd run astro -- dev logs
npm.cmd run astro -- dev stop
npm.cmd run build
npm.cmd run verify
npm.cmd run test:migration
npm.cmd run preview
```

Desenvolvimento: http://localhost:4321. A prévia serve o conteúdo de dist.
`test:migration` cria dois arquivos temporários exclusivos, verifica a rota antiga
com datas editoriais diferentes e limpa ambos em finally; depois recompila a base.
Não execute esse teste simultaneamente com outro build ou servidor dev.

## Arquivos e responsabilidades

```text
src/
  assets/                         imagens reais futuras
  components/
    layout/Header.astro           marca provisória, navegação e CTA
    layout/Footer.astro           NAP e links centrais
    ui/Button.astro               link com variantes de botão
    ui/Container.astro            container de 1240px
    ui/SectionTitle.astro         títulos de seção
    seo/SeoHead.astro              metadados por página
    seo/Breadcrumbs.astro         navegação acessível
    seo/StructuredData.astro      serialização segura do @graph
    conversion/WhatsAppCTA.astro  número único, mensagem codificada e tracking
  content/blog/                   vazia nesta etapa
  content.config.ts              schema dos artigos
  data/business.ts               dados empresariais e pendências
  data/navigation.ts             navegação e serviços da home provisória
  data/site-pages.ts             páginas indexáveis para sitemap
  layouts/BaseLayout.astro       documento, fontes, header, footer e SEO
  layouts/BlogLayout.astro       artigo, datas, imagem, CTA e relacionados
  lib/blog.ts                    artigos publicados, ordenação e unicidade
  lib/permalinks.ts              preservação da URL WordPress
  lib/structured-data.ts         entidades e IDs estáveis
  pages/index.astro              homepage provisória
  pages/404.astro                página de erro com noindex
  pages/[year]/[month]/[day]/[slug].astro
  pages/sitemap.xml.ts           XML estático de páginas e posts publicados
  pages/robots.txt.ts            robots estático
  styles/tokens.css              paleta, espaços, tipografia e dimensões
  styles/global.css             estilos mobile-first
public/reecell-icon.svg          monograma provisório, não é logo oficial
scripts/verify-build.mjs         verifica HTML, links, SEO e fontes em dist
scripts/test-migration.mjs       teste do contrato das URLs
docs/migration.md                auditoria, frontmatter e próximos controles
```

## Decisões

- Zero dependências adicionadas. Sitemap e robots usam endpoints estáticos
  nativos; o sitemap consome a mesma lista de artigos usada pelas rotas.
- Fontes variáveis Manrope e Inter em `public/fonts`, com `swap` e preload.
  Desenvolvimento e build usam os arquivos locais, sem download de fontes.
- Menu mobile nativo com `details`/`summary`, teclado e indicação da página
  atual; navegação desktop a partir de 1200px. Sem JavaScript adicional.
- Sem React, Tailwind, CSS de Elementor, bibliotecas de ícones ou JS de cliente.
- `site` e trailing slash definidos em astro.config.mjs. O domínio também está
  em business.ts para entidades e endpoints; manter ambos consistentes.
- Title e description obrigatórios por página; canonical absoluto sem query ou
  hash. Open Graph, Twitter e dados de artigo são condicionais aos dados reais.
- Organization, LocalBusiness, WebSite e WebPage compartilham IDs estáveis.
  Blog acrescenta Article e BreadcrumbList. Service tem helper próprio.
  Sem ratings, preços, autores, imagens ou coordenadas inventadas.
- Dados de contato e horários têm como fonte a homepage atual, consultada em
  14/09/2026. Coordenadas, redes sociais e logo oficial ainda estão pendentes.
- A navegação provisória usa âncoras; as páginas antigas serão implementadas
  nos endereços exatos, após inventário completo. Não há redirects.
- A 404 fica fora do sitemap. Posts draft também ficam fora das rotas e sitemap.
- Não há adaptador Vercel: a saída estática `dist` dispensa SSR. Nenhuma conta,
  integração de hospedagem ou repositório remoto foi conectado.

## Estado e validação

A pasta ainda não possui `.git`; configurações do editor e instruções anteriores
foram preservadas. Os favicons do starter foram preservados, mas não são usados.

Os testes automatizados verificam saída estática e contrato de migração. A revisão
visual foi feita em desktop e mobile. Isso não mede Core Web Vitals de produção,
nem comprova indexação, entrega de mensagens ou status HTTP na Vercel.

Validação desta etapa: build final com 2 páginas (home e 404), teste de URLs e
verificação de dist aprovados. Layout conferido em 1440px, 390px e 320px; sem
overflow horizontal; âncora de contato e foco de teclado conferidos. A collection
vazia pode emitir avisos esperados. Seu loader limpa o store antes de sincronizar
para impedir que artigos removidos sobrevivam no cache. Servidor dev encerrado
após a validação. Nenhum arquivo de teste permaneceu em conteúdo ou dist.

Consulte [docs/migration.md](docs/migration.md) antes de migrar conteúdo ou publicar.
Esta fundação ainda não substitui todo o site indexado.
