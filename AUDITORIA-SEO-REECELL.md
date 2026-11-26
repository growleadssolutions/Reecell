# Auditoria técnica de SEO — ReeCell

**Data:** 09/11/2026. **Domínio:** https://reecell.com.br. **Escopo:** código do checkout, build estático, fontes históricas do WordPress e consultas HTTP públicas, somente auditoria.

## 1. Conclusão executiva

A migração principal está funcionando no conjunto conhecido: **61 páginas legadas responderam HTTP 200 e os 14 redirecionamentos do mapa responderam 301 para os destinos previstos**. As páginas importantes entregam conteúdo em HTML, sem depender de JavaScript. Não há evidência de bloqueio geral por robots, canonical ou noindex nas 61 páginas públicas do sitemap.

Os problemas confirmados concentram-se em **cobertura incompleta de variantes e anexos do WordPress, arquivos de taxonomia pouco úteis e isolados da navegação, ausência de links contextuais entre artigos e serviços e divergência entre checkout e produção**. Os oito artigos novos locais estão fora da publicação e têm caracteres corrompidos; não devem entrar numa publicação futura sem revisão.

**Não é possível atribuir individualmente os 106 erros 404, 45 URLs rastreadas não indexadas, dois 5xx e dez noindex sem as respectivas URLs e datas de rastreamento do Search Console.** Esses totais foram fornecidos pelo solicitante; não são contagens reproduzidas nesta auditoria. O arquivo histórico disponível contém 47 caminhos, sem identificação dessas quatro categorias atuais.

### Priorização por impacto

| ID | Prioridade / gravidade | Problema | Alcance confirmado | Ação recomendada após aprovação |
|---|---|---|---|---|
| A01 | P0 investigação / potencialmente crítica | Falta de correspondência entre os totais atuais do GSC e URLs concretas; 5xx históricos não reproduzidos | 106/45/2/10 informados, identidade pendente | Cruzar exportações, inspeção de URL e logs antes de alterar regras |
| A02 | P1 / alta | Permalinks WordPress por ID servem a home | `/?p=431`, `/?p=427` | Mapear IDs conhecidos individualmente ao artigo correto |
| A03 | P1 / alta condicionada ao histórico | Anexos e imagens WordPress fora do contrato de migração | Três páginas de anexo 404 e três imagens 403 verificadas | Inventariar todos os anexos; preservar recursos e tratar equivalência caso a caso |
| A04 | P1 / média-alta | Arquivos de tags/categorias/autor desconectados da navegação | 32 arquivos; 26 sem links de outras páginas | Criar caminhos úteis de descoberta, sem inserir links indiscriminadamente |
| A05 | P1 / média-alta | Tags com pouco conteúdo próprio e listas repetidas | 25 tags; 21 com apenas um artigo | Melhorar utilidade e curadoria nas URLs existentes; não aplicar noindex |
| A06 | P1 antes de publicação / alta local | Oito artigos locais não publicados e com texto corrompido | Oito URLs `/2026/10/06/` | Restaurar acentos, revisar e preparar publicação separada, apenas quando autorizada |
| A07 | P2 / média | Links contextuais blog ↔ serviços ausentes | 23 artigos públicos e três serviços | Incluir conexões por intenção e leituras úteis |
| A08 | P2 / média | Títulos longos e acoplados ao H1 | 18 artigos públicos + oito locais | Permitir título SEO independente; revisar com dados de desempenho |
| A09 | P2 / média | Seleção de relacionados usa apenas categoria/recência | Artigos e grupos temáticos | Curadoria explícita de relações por sintoma e etapa de decisão |
| A10 | P2 / baixa-média | Marcação Article sem autor; imagens editoriais incompletas | Todos os artigos sem author; 14 públicos sem image em Article | Completar apenas com autoria e imagens reais verificadas |
| A11 | P2 / média operacional | Evidências antigas e estado Git não equivalem à publicação | Documentação, oito artigos e regras locais | Atualizar registro de release e validação por ambiente |
| A12 | P3 / baixa | HTTP passa por 308 antes do 301 de caminho/host | Variante HTTP+www testada | Adequar expectativa dos testes; manter destinos corretos |

P0 aqui significa **prioridade de investigação**, não declaração de indisponibilidade atual. Não foi reproduzido 5xx nas consultas realizadas.

## 2. Método, cobertura e limites

- Leitura de rotas, layouts, componentes SEO, conteúdo, dados de negócio, mapa legado, configuração Astro/Vercel e scripts de validação.
- `npm.cmd run build`: sucesso; **70 HTMLs**, incluindo 404, **69 URLs no sitemap local**, 31 artigos, seis páginas principais e 32 arquivos.
- `npm.cmd run verify`: sucesso; valida HTML, H1, canonical, robots, JSON-LD, links, âncoras e fontes locais. Sem JS de cliente no build.
- Inspeção adicional dos HTMLs: links de navegação relativos/absolutos, recursos locais em `src`/`href`, IDs de âncoras, metadados, grafo de navegação e listas dos arquivos. Nenhum destino interno ou âncora quebrados nesses testes locais. Não foi feito teste de cada candidato de `srcset` nem de links externos de terceiros.
- Primeira bateria pública: **95 requisições GET com redirects manuais**, abrangendo as 75 entradas históricas, os oito artigos novos e controles técnicos. Respostas: 64 HTTP 200, 17 HTTP 301, dois HTTP 308, 12 HTTP 404; nenhum 5xx ou erro de conexão após liberação de rede.
- Bateria complementar: **146 requisições**, incluindo variantes sem barra e `index.html`, IDs reais de posts e seis URLs de mídia/anexos. Respostas: 138 HTTP 301, dois HTTP 200, três HTTP 403 e três HTTP 404. Contagens são por bateria, não soma de URLs únicas.
- Todos os links internos `<a href>` extraídos das páginas HTML públicas 200 da primeira bateria tinham destino presente na coleta e nenhum destino 4xx/5xx. Isso não cobre referências externas ou URLs históricas órfãs.
- Consultas ocorreram aproximadamente entre 14h59 e 15h03, horário de Brasília. As respostas são uma fotografia, não monitoramento de disponibilidade.
- A primeira tentativa de conexão no ambiente restrito falhou; a consulta autorizada fora dele funcionou. A falha inicial do ambiente **não foi contada como indisponibilidade do site**.
- Vercel público confirmado por headers. O conector só disponibilizou a equipe `gabriel-s-projects-a1979695`; a consulta por ReeCell nessa equipe retornou zero projetos. Não foi possível conferir configurações do projeto correto, logs, regras de firewall, deployment ID ou commit publicado.
- Não houve acesso à propriedade atual do Search Console, inspeção autenticada, cliques, impressões, backlinks, logs históricos, Core Web Vitals ou Rich Results Test. Não foram inventadas métricas nem escolhido conteúdo de “bom desempenho” sem dados.

Somente este relatório é uma nova alteração documental da auditoria. O build atualizou artefatos gerados e ignorados em `dist/` e `.astro/`. Não foram executados gerador de hosting, importadores, scripts que sobrescrevem relatórios versionados, commit, push ou deploy. Alterações preexistentes foram preservadas.

## 3. Arquitetura e geração estática

| Camada | Implementação e resultado |
|---|---|
| Astro | `package.json`: dependência `astro: ^7.3.2`, Node `>=22.12.0`; execução local em Node 24.15.0. A faixa não comprova a versão do ambiente publicado. |
| Configuração | `astro.config.mjs`: `site: https://reecell.com.br`, `output: static`, `trailingSlash: always`. |
| Páginas principais | `src/pages/index.astro`, `blog/index.astro`, contato e três serviços; geradas em `dist/.../index.html`. |
| Artigos | `src/pages/[year]/[month]/[day]/[slug].astro`, `getStaticPaths()` e Markdown de `src/content/blog`. Datas e slugs dos permalinks são preservados. |
| Coleção | `src/content.config.ts` valida campos, datas e slugs; `draft` assume true e `getPublishedPosts()` exclui drafts. Os 31 arquivos atuais entram no build. |
| Arquivos legados | `src/pages/[...legacy].astro` gera 32 listagens com base nos membros explícitos de `src/data/legacy-migration.json`. Não é um catch-all que responde 200 para qualquer URL. |
| SEO global | `SeoHead.astro`, `BaseLayout.astro` e `structured-data.ts` geram metadados e JSON-LD no HTML inicial. |
| Sitemap/robots | Endpoints `.ts` são pré-gerados pelo modo estático; não exigem função serverless em cada acesso. |
| Vercel | `vercel.json`: framework Astro, saída `dist`, build `npm run build && npm run verify && npm run verify:seo`; 323 regras locais. Conteúdo confere com o gerador atual. |
| Git | Branch main, HEAD local `7133365`; remoto configurado `https://github.com/growleadssolutions/Reecell.git`. Não houve fetch nem confirmação de que origin/main local representa o remoto atual. |

Não há SSR, middleware ou dependência do WordPress em runtime identificados nas rotas auditadas. O HTML público das páginas principais e dos artigos contém texto e links rastreáveis. A requisição ao serviço de conserto com user-agent `Googlebot` respondeu 200; isso é uma simulação de user-agent, **não uma visita do Google nem prova de indexação**.

**URLs prioritárias confirmadas 200, com canonical próprio e index/follow:** `/`, `/blog/`, `/contato-reecell-bombinhas/`, `/conserto-de-celular-em-bombinhas/`, `/troca-de-tela-de-celular-em-bombinhas/` e `/troca-de-bateria-de-celular-em-bombinhas/`.

## 4. Diagnóstico dos grupos do Search Console — A01

| Grupo informado | Evidência atual | Causas a investigar, sem assumir confirmação | Próximo passo |
|---|---|---|---|
| 106 URLs 404 | Nenhuma das 61 páginas preservadas do mapa retornou 404; anexos fora do mapa retornam 404 | Anexos, mídias, feeds, arquivos por data, parâmetros, URLs não inventariadas, rastreamento anterior à correção | Comparar cada URL exata, última visita e origem com o inventário e status atual |
| 45 rastreadas, não indexadas | 61 páginas públicas com 200, canonical próprio, index/follow e robots liberado | Listagens repetitivas, pouco valor próprio, isolamento interno, sobreposição de intenção ou seleção algorítmica | Inspecionar canonical escolhido pelo Google e conteúdo rastreado; separar páginas comerciais de arquivos |
| Dois 5xx | Não reproduzidos nas duas baterias | Erro transitório de edge/origem antiga, configuração do deployment, mitigação, incidente na data da visita | Obter URLs, timestamps e logs da conta Vercel correta; testar recorrência |
| Dez noindex | Nas páginas públicas 200 testadas, não houve meta ou X-Robots-Tag noindex; páginas de erro têm meta noindex | Resposta 404, exclusão histórica do WordPress, ambiente preview ou header antigo | Identificar URLs; não remover noindex da 404 nem de preview para “zerar” o relatório |

Arquivo `docs/seo-migration/search-console-paths.txt`: 47 caminhos históricos, todos cobertos pelo mapa, mas não um export atual dos 163 casos. Não é correto deduzir que os oito artigos locais sejam parte dos 106/10 casos ou que 32 arquivos expliquem exatamente 32 das 45 exclusões.

**Arquivos eventualmente envolvidos:** `src/data/legacy-migration.json`, `scripts/seo-routing.mjs`, `vercel.json`, layouts e páginas específicas conforme o diagnóstico; para logs e inspeção, inicialmente nenhum arquivo precisa mudar. Um erro de build impede um novo deploy, mas não demonstra a causa de um 5xx numa página estática já publicada.

## 5. Lacunas reais da migração WordPress

### A02 — URLs por ID exibem conteúdo incorreto

| URL testada | Resultado público | Conteúdo correto segundo o backup da API WordPress |
|---|---|---|
| `https://reecell.com.br/?p=431` | 200 com título e canonical da home | `/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/` |
| `https://reecell.com.br/?p=427` | 200 com título e canonical da home | `/2026/08/04/melhores-lojas-de-celulares-em-bombinhas/` |

**Causa:** o roteamento considera caminhos; não há tradução de IDs WordPress. `SeoHead.astro` elimina a query do canonical, mas isso não recupera a intenção do permalink antigo. Não há uma regra genérica de redirect para a home; é a raiz sendo servida com parâmetros ignorados.

**Correção recomendada:** ampliar o mapa com IDs documentados em `docs/seo-migration/source/posts-1.json` e `pages-1.json`; após aprovação, implementar 301 individual ao permalink correspondente usando condições de query compatíveis com a hospedagem. Não tratar qualquer `?p=` como a home e não confundir parâmetros de campanha com IDs. O risco é perda de relevância e eventual soft-404 para essas referências, não soft-404 confirmado pelo GSC.

**Arquivos:** `scripts/seo-routing.mjs`, `src/data/legacy-migration.json` ou mapa dedicado de IDs, `vercel.json`, `scripts/test-seo-http.mjs` e `scripts/verify-seo-migration.mjs`.

### A03 — Anexos e arquivos de mídia históricos não cobertos

Os exemplos abaixo vêm de `docs/blog-source/wordpress-media.json`, portanto são URLs documentadas, não slugs inventados.

| URL/caminho histórico | Resposta observada |
|---|---|
| `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/rahul-himkar-jik2tatwgfm-unsplash-2/` | 404 |
| `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/christian-wiediger-70ku6p7kgmc-unsplash/` | 404 |
| `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/ashkan-forouzani-ivhsubxpvo0-unsplash/` | 404 |
| `/wp-content/uploads/2026/06/rahul-himkar-jIK2TATWgFM-unsplash-1-scaled.jpg` | 403 |
| `/wp-content/uploads/2026/06/christian-wiediger-70ku6P7kgmc-unsplash-scaled.jpg` | 403; confirmado com `Server: Vercel` e `X-Vercel-Mitigated: deny` |
| `/wp-content/uploads/2026/06/ashkan-forouzani-ivHSUBXpvo0-unsplash-scaled.jpg` | 403 |

**Causa:** o inventário principal não inclui páginas de anexo nem URLs antigas de uploads. A mitigação observada em mídia atua antes da resposta estática normal; a regra específica não pôde ser consultada. Não atribuir 403 a uma regra concreta de firewall sem acesso à configuração.

**Correção:** inventariar anexos e uploads completos, verificar tráfego/backlinks e correspondência com imagens locais. Preservar ou restaurar os recursos úteis no caminho antigo quando viável; alternativamente usar redirect exato para a mesma imagem em destino estável. Para página de anexo, confirmar se conteúdo e intenção são atendidos pelo artigo pai antes de propor redirect. Se uma URL não tiver conteúdo equivalente, um 404 verdadeiro pode ser correto. Não direcionar toda `/wp-content/` para a homepage, não desativar proteção global e não criar conteúdo artificial para zerar erros.

**Arquivos/configuração envolvidos:** mapa legado, `scripts/seo-routing.mjs`, `vercel.json`, eventual `public/wp-content/uploads/...` e regras do projeto Vercel após identificação do bloqueio. A prioridade depende do valor das URLs históricas. As imagens utilizadas pelo HTML atual têm recursos locais presentes; este achado não significa imagens quebradas no layout atual.

### Outros padrões para inventariar

`/feed/` e `/wp-sitemap.xml` responderam 404. O sitemap antigo documentado era `/sitemap_index.xml`, que já redireciona corretamente. A existência de WordPress **não prova** que `/wp-sitemap.xml`, arquivos `/2026/`, `/2026/06/`, `?page_id=`, `?attachment_id=`, `/page/N/` ou `/comments/feed/` tenham sido indexados. Investigar esses padrões no export, nos backlinks e no backup antes de propor novas regras. Não há razão para criar páginas de busca `/?s=` indexáveis automaticamente.

## 6. Arquivos de taxonomia e arquitetura interna — A04 e A05

**Confirmado:** 32 listagens indexáveis em HTML e no sitemap: 25 tags, quatro páginas de categoria e três de autor. Todas responderam 200. A navegação iniciada na home alcança as páginas principais e os artigos, mas **não alcança nenhuma dessas 32 listagens**.

- **26 páginas sem link recebido de outra página:** as 25 tags e `/category/uncategorized/assistencia-tecnica/`.
- Os seis arquivos restantes recebem links de paginação dentro dos próprios grupos de autor/categoria, mas esses grupos não têm entrada pela home/blog. São conjuntos isolados, ainda que não sejam órfãos individuais.
- Links do sitemap e referências externas podem permitir descoberta; “não alcançável” aqui significa pelo grafo de links HTML internos, não inacessível ao Google.
- Das 25 tags, **21 têm um único artigo**, três têm dois e uma tem quatro. Conteúdo principal estimado entre 45 e 146 palavras, incluindo títulos, resumos e navegação. A contagem é descritiva, não um limite de qualidade do Google.
- As listagens não oferecem introdução temática própria: `src/pages/[...legacy].astro` imprime título, cards, paginação e retorno ao blog. Há grupos diferentes com exatamente os mesmos artigos, listados no anexo.
- Os **11 casos de thin content** da auditoria externa não vieram acompanhados de URLs. Não foram artificialmente reduzidos aos mesmos 11: o padrão atual abrange 25 tags, especialmente as 21 de um artigo.

**Causa provável:** preservação técnica das taxonomias WordPress sem integração editorial no Astro. Os membros são um snapshot histórico fixo: novos posts não entram nos arquivos automaticamente.

**Correção recomendada:** manter URLs e páginas; escolher taxonomias com utilidade real, acrescentar orientação específica e curadoria e conectar a partir de conteúdos relacionados. Exibir associação temática nos artigos ou um índice de assuntos no blog quando isso ajudar o leitor. Não colocar 32 links em todas as páginas, não preencher com texto genérico e não aplicar noindex/canonical para outra página em massa. Arquivo de autor deve ter informação verificável sobre autoria; não transformar apenas o título “Gabriel Souza” em prova de autor de todos os artigos.

**Arquivos:** `src/pages/[...legacy].astro`, `src/pages/blog/index.astro`, `src/layouts/BlogLayout.astro`, `src/content.config.ts`, `src/lib/legacy-archives.ts` e dados editoriais próprios. Se separar o snapshot da taxonomia editorial, manter `legacy-migration.json` como evidência de migração, sem sobrescrever a história inadvertidamente.

## 7. Divergência de publicação e corrupção textual — A06

Produção tem **61 URLs no sitemap e 23 artigos**; local tem **69 URLs e 31 artigos**. Os oito artigos de 06/10/2026 estão como arquivos não rastreados pelo Git e `draft: false`, são gerados localmente, mas retornam 404 em produção. O blog público não aponta a eles; não foi encontrado link interno quebrado público para esse conjunto.

Todos os oito arquivos contêm substituições literais por `?`, como `n?o`, `avalia??o` e `pe?a`. A leitura UTF-8 e o HTML gerado reproduzem o problema, portanto não se trata apenas de exibição incorreta do terminal. Três títulos também são afetados diretamente. Exemplo: `Celular n?o reconhece chip: o que verificar antes do conserto | ReeCell`.

**Causa provável:** perda de caracteres durante a gravação/importação dos novos textos. O build valida presença de conteúdo, mas não sua integridade linguística. Alterar apenas a declaração UTF-8 não recupera caracteres que já viraram pontos de interrogação.

**Correção:** restaurar a partir da versão textual íntegra, revisar títulos, descrições, corpo e mensagens WhatsApp, sem mexer em slugs ou datas de permalink. Comparar diff e validar novamente. Só depois preparar commit/deploy numa etapa autorizada. Enquanto não publicados, esses problemas **não explicam a não indexação dos artigos antigos**.

**Arquivos:** os oito Markdown listados no anexo A; opcionalmente validação editorial em `scripts/verify-blog-editorial.mjs`, distinguindo interrogação legítima de corrupção.

## 8. Links entre artigos e serviços — A07 e A09

O menu e o rodapé já apontam aos serviços. O blog também tem cards para os três serviços. Contudo, **os 23 artigos publicados não contêm links contextuais para as três landing pages de serviço no conteúdo principal**; os links de contato e WhatsApp não substituem essa conexão temática. As três páginas de serviço não têm links para artigos no seu conteúdo principal.

`relatedServices` existe no schema de conteúdo, mas não é consumido pelo `BlogLayout.astro`. Os relacionados são escolhidos em `[year]/[month]/[day]/[slug].astro` por igualdade de categoria, ordenação por publicação e `slice(0, 3)`, e não por vínculo explícito. Isso pode concentrar links nos mesmos artigos recentes e deixar relações úteis de fora.

### Proposta de conexões, mantendo as URLs

| Serviço central | Artigos públicos a conectar em ambos os sentidos | Contexto/âncora sugerido |
|---|---|---|
| `/troca-de-tela-de-celular-em-bombinhas/` | `/2026/06/08/tela-de-celular-bombinhas/`; `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/`; `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/`; `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | “avaliação para troca de tela em Bombinhas”; serviço recomenda leitura sobre custo, trinca e sintomas |
| `/troca-de-bateria-de-celular-em-bombinhas/` | `/2026/06/08/troca-de-bateria-de-celular-sinais/`; `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/`; `/2026/06/16/celular-esquentando-muito/` | “consultar a avaliação da bateria”; não prometer que a troca resolve toda falha |
| `/conserto-de-celular-em-bombinhas/` | `/2026/06/08/celular-nao-liga-principais-causas/`; `/2026/06/08/conector-de-carga-com-defeito-sinais/`; `/2026/06/08/iphone-nao-carrega-causas-solucoes/`; `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` | “avaliação do celular em Bombinhas”; guias de sintomas ajudam a preparar a consulta |
| `/contato-reecell-bombinhas/` | Páginas de serviço e guias locais | Preservar links existentes para endereço, horário e atendimento |

Incluir os oito novos artigos nessa curadoria somente após revisão e publicação autorizada; não adicionar links públicos para URLs que hoje retornam 404. Preferir relações explícitas e fallback por categoria. Alterações devem ser pontuais, justificadas pela navegação, sem reescrever páginas de bom desempenho.

**Arquivos:** `src/layouts/ServiceLayout.astro`, `src/layouts/BlogLayout.astro`, rota dinâmica dos artigos, `src/content.config.ts`, `src/data/service-pages.ts` ou mapa editorial dedicado, e Markdown específicos quando necessário.

### Sobreposição editorial a investigar

Há interseção de intenção entre os dois guias de água/mar, entre “onde consertar com segurança” e “assistência confiável”, e entre o artigo `/2026/06/16/assistencia-tecnica-celular-bombinhas/` e o serviço de conserto. As evidências/editoriais anteriores estão em `docs/auditoria-conteudo/`, mas propostas antigas de consolidação **não são correções aprovadas nesta etapa**. Comparar consultas e desempenho antes de mudar conteúdo. Priorizar delimitação e links úteis; não excluir páginas nem trocar seus slugs.

## 9. Títulos, descrições, canonicals e indexabilidade — A08

### Títulos

Foram encontrados **18 títulos acima de 60 caracteres nas páginas públicas**, todos em artigos. Os oito novos elevam a contagem local a 26. A relação exata consta do anexo B. O título mais longo tem 92 caracteres, em `/2026/06/08/tela-de-celular-bombinhas/`.

**Causa:** `BlogLayout.astro` usa `${data.title} | ReeCell`; `data.title` também é H1. Assim, reduzir o título SEO hoje também exige alterar o título editorial, salvo mudança do modelo.

**Recomendação:** campo opcional `seoTitle` no schema, com fallback para o título atual; permitir títulos de busca mais concisos sem modificar URL, H1 ou corpo. Avaliar consulta principal, CTR e impressões antes de alterar páginas com tráfego. Exemplo a revisar: “Troca de tela em Bombinhas: o que define o preço | ReeCell”. Não implementar a sugestão automaticamente.

**60 caracteres é critério desta auditoria, não limite rígido do Google.** O Google pode truncar conforme largura e dispositivo; título longo isoladamente não explica exclusão do índice. [Referência oficial sobre títulos](https://developers.google.com/search/docs/appearance/title-link).

**Arquivos:** `src/content.config.ts`, `src/layouts/BlogLayout.astro` e os Markdown correspondentes.

### Meta descriptions

Todas as páginas HTML locais têm descrição preenchida; não há descrições idênticas entre páginas nem acima de 160 caracteres na extração. As descrições das páginas públicas comparadas correspondem ao padrão do projeto; as dos arquivos são formulaicas (“Consulte os artigos ... neste arquivo”), apesar de diferentes pelo nome. Melhorar descrições de arquivos junto com seu conteúdo, não apenas alongá-las. Seis descrições dos novos artigos exibem corrupção textual; os oito corpos precisam de revisão.

### Canonicals e robots

- Uma canonical por HTML, absoluta, HTTPS e sem www; páginas indexáveis usam a própria URL com barra final. Não foram detectados canonicals de preview ou localhost nos testes executados.
- As 61 páginas públicas preservadas têm `index, follow`; sem `X-Robots-Tag: noindex` nas respostas verificadas.
- Remoção de query/hash em `SeoHead.astro` evita variantes de rastreamento no canonical, mas não resolve IDs WordPress que deveriam ser redirecionados (A02).
- `robots.txt` público responde 200, `Allow: /` e sitemap correto. Não bloqueia CSS, imagens ou páginas por regra geral.
- Página inexistente responde **404 verdadeiro**, com `noindex, follow`. Canonical de erro aponta a `/404/`, que também retorna 404. Isso não cria uma página indexável e não justifica remover o noindex.
- O sitemap público tem 61 destinos 200, únicos, canônicos e sem noindex. O local tem 69; os oito extras estão corretos apenas no build local. Não enviar sitemap local ao GSC como se já estivesse publicado.
- `lastmod` é derivado de `updatedDate`/`publishedDate`; não é atualizado automaticamente a cada build. Páginas fixas e arquivos não têm `lastmod`, o que não é erro obrigatório. Atualizar datas apenas quando houver mudança real.

## 10. Dados estruturados — A10

O JSON-LD local é parseável, sem IDs duplicados por grafo nos testes. Há `Organization`, `LocalBusiness`, `WebSite`, `WebPage`, `Article`, `BreadcrumbList`, `Service` e `ItemList`, conforme o tipo de página. Serviço possui provider e breadcrumbs; artigos possuem headline, datas e publisher. Não há necessidade de adicionar reviews ou avaliações inventadas.

**Lacunas:** todos os 23 artigos públicos e oito locais omitem `Article.author`. Quatorze artigos públicos e os oito novos não possuem `Article.image`, porque não têm imagem editorial definida. O fallback de `og:image` para fachada não equivale a uma imagem editorial no schema Article. A listagem existente `/author/gabriel-souza/` não substitui autoria no conteúdo e na marcação.

**Recomendação:** confirmar responsabilidade editorial, exibir autoria real e declarar `Person` ou `Organization` coerente. Usar imagem relevante disponível e autorizada; não inventar fotos. `geo` e `sameAs` estão pendentes em `business.ts`: preencher somente com coordenadas e perfis oficiais confirmados. Não assumir que ausência desses campos causa não indexação. Validar resultados enriquecidos depois da correção, pois parse de JSON não equivale a elegibilidade no Google. [Documentação Article](https://developers.google.com/search/docs/appearance/structured-data/article).

**Arquivos:** `src/layouts/BlogLayout.astro`, `src/content.config.ts`, `src/lib/structured-data.ts`, `src/data/business.ts` e frontmatter dos artigos. A lista de artigos sem imagem está no anexo E.

## 11. Deploy, regras e evidências — A11 e A12

### Estado local versus produção

O checkout já começou com alterações em `vercel.json`, quatro scripts de hosting/SEO e dois JSONs de validação, além dos oito Markdown e um documento editorial não rastreados. O build da auditoria não levou essas alterações à Vercel. Não é possível concluir o SHA publicado pelo header Last-Modified nem por um build local bem-sucedido.

`docs/seo-migration/REPORT.md` ainda descreve um estado anterior ao deploy. `local-validation.json` e `http-contract-validation.json` têm data de 06/10/2026 e explicitam validação local, não produção. O relatório editorial antigo considera 23 artigos. Esses documentos são úteis como histórico, mas não devem ser usados como certificação atual de release.

**Recomendação:** futuramente registrar SHA, projeto/equipe, deployment ID, domínio e resultado HTTP em evidências separadas. Atualizar documentação somente após identificar o ambiente correto. O comando `verify:seo` grava `docs/seo-migration/local-validation.json`; por isso ele não foi executado nesta auditoria, evitando sobrescrever alterações do usuário. A comparação de regras foi feita em modo leitura e confirmou 323 regras iguais às geradas.

### Redirecionamentos

As 14 regras históricas funcionam em produção, sem destino intermediário nas URLs HTTPS canônicas testadas. Incluem sete tags de assunto idêntico ao artigo, seis sitemaps e `/home-v3/`. Este último é um redirecionamento específico de uma home alternativa documentada, **não fallback indiscriminado para a homepage**. A tabela exata está no anexo D.

Variantes sem barra e `index.html` das rotas históricas responderam 301 com destinos esperados. Não foram detectados loops nessas regras. A produção pode impor HTTPS antes das regras do projeto:

```text
http://www.reecell.com.br/tag/iphone-nao-carrega/
  308 → https://www.reecell.com.br/tag/iphone-nao-carrega/
  301 → https://reecell.com.br/2026/06/08/iphone-nao-carrega-causas-solucoes/
  200
```

**Causa:** camada HTTPS da plataforma precede a normalização customizada. É uma cadeia curta permanente, não falha de indexabilidade. A expectativa antiga de um único 301 para todas as variantes HTTP não corresponde integralmente ao comportamento público.

**Recomendação:** manter links e sitemap em HTTPS final, preservar os 301 específicos e adequar o teste da plataforma para aceitar a etapa HTTPS quando inevitável, verificando ausência de loop e destino correto. Não enfraquecer HTTPS para satisfazer um teste local.

**Arquivos:** `scripts/test-seo-http.mjs`, documentação de migração; `scripts/seo-routing.mjs` e `vercel.json` apenas se houver ajuste concreto justificado. Configurações reais do dashboard ainda precisam ser inspecionadas na equipe correta.

## 12. Plano de correção proposto, sem execução

1. **Obter evidência operacional:** exportações completas dos quatro grupos do GSC, data do relatório e últimos rastreamentos; acesso de leitura ao projeto Vercel correto. Separar URLs úteis, URLs removidas, aliases e erros transitórios.
2. **Fechar lacunas de migração:** mapa de IDs WordPress, anexos e mídias com equivalência comprovada; preservar URLs úteis e contratos HTTP. Não redirecionar desconhecidas para a home.
3. **Preparar os oito artigos com integridade textual:** corrigir caracteres, revisar metadados e links; manter URLs existentes. Publicação é uma etapa posterior, dependente de autorização.
4. **Reforçar descoberta e utilidade:** conectar arquivos selecionados a conteúdo relevante e adicionar links recíprocos blog/serviços. Melhorar arquivos rasos sem apagar páginas nem aplicar noindex.
5. **Otimizar títulos e schema:** títulos SEO separados do H1, revisão orientada a desempenho, autoria real e imagens verificadas.
6. **Validar antes e depois de uma publicação futura:** build, links, canonicals, sitemap, HTML, regressão dos redirects e HTTP na hospedagem. Registrar versões e repetir inspeções no GSC; um 200 com index/follow torna a página elegível, mas não garante indexação.

### Critérios de aceite das futuras correções

- Nenhum slug/permalink existente alterado e nenhuma página excluída.
- Todos os destinos úteis respondem 200, com canonical coerente e conteúdo equivalente; redirects permanentes apenas quando aprovados individualmente.
- Inexistentes continuam 404 reais; noindex da página de erro permanece.
- Sitemap publicado coincide com as URLs finais realmente publicadas, sem 4xx/5xx/noindex ou redirects.
- Links internos apontam diretamente a páginas finais, com âncoras válidas.
- Arquivos priorizados recebem links internos úteis e conteúdo próprio, sem introduções artificiais repetidas.
- Texto novo legível em UTF-8; nenhuma substituição de acento por `?`.
- Alterações em páginas com tráfego só após justificativa e comparação de desempenho.
- Verificação de GSC/logs é separada da validação de código e do teste público pontual.

## 13. Referências técnicas consultadas

- [Astro: routing](https://docs.astro.build/en/guides/routing/) — rotas e geração estática.
- [Astro: content collections](https://docs.astro.build/en/guides/content-collections/) — coleção e conteúdo.
- [Astro: components](https://docs.astro.build/en/basics/astro-components/) — renderização dos componentes.
- [Google: migração e mapeamento de URLs](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes) — correspondência entre endereços antigos e destinos relevantes.
- [Google: códigos HTTP](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes) — 200 não garante indexação; 4xx e 5xx precisam de diagnóstico distinto.
- [Google: links rastreáveis](https://developers.google.com/search/docs/crawling-indexing/links-crawlable) — links HTML e âncoras contextuais.
- [Google: noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing) — diferença entre diretiva de indexação e bloqueio de rastreamento.

Os anexos seguintes fazem parte da auditoria e identificam as URLs de cada grupo. Caminhos iniciados por `/` usam o domínio `https://reecell.com.br`.


## Anexo A — Oito artigos locais: 404 público e caracteres corrompidos (A06)

| URL | Arquivo a revisar | Status público |
| --- | --- | --- |
| `/2026/10/06/celular-nao-reconhece-chip/` | `src/content/blog/celular-nao-reconhece-chip.md` | 404 |
| `/2026/10/06/celular-sem-sinal-ou-sem-rede/` | `src/content/blog/celular-sem-sinal-ou-sem-rede.md` | 404 |
| `/2026/10/06/celular-travando-muito/` | `src/content/blog/celular-travando-muito.md` | 404 |
| `/2026/10/06/quanto-tempo-demora-consertar-celular/` | `src/content/blog/quanto-tempo-demora-consertar-celular.md` | 404 |
| `/2026/10/06/tela-do-celular-com-manchas-ou-linhas/` | `src/content/blog/tela-do-celular-com-manchas-ou-linhas.md` | 404 |
| `/2026/10/06/tela-do-celular-piscando/` | `src/content/blog/tela-do-celular-piscando.md` | 404 |
| `/2026/10/06/touch-do-celular-nao-funciona/` | `src/content/blog/touch-do-celular-nao-funciona.md` | 404 |
| `/2026/10/06/vale-a-pena-consertar-celular-antigo/` | `src/content/blog/vale-a-pena-consertar-celular-antigo.md` | 404 |

Todos: gravidade alta antes de publicação, prioridade P1; recomendação e causa na seção 7.

## Anexo B — Títulos acima de 60 caracteres (A08)

| URL | Caracteres | Título extraído | Estado |
| --- | --- | --- | --- |
| `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` | 74 | Celular caiu na água: o que fazer antes de levar na assistência? \| ReeCell | Público 200 |
| `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` | 66 | Celular desligando sozinho: é bateria, sistema ou placa? \| ReeCell | Público 200 |
| `/2026/06/08/celular-nao-liga-principais-causas/` | 75 | Celular não liga: principais causas e quando procurar assistência \| ReeCell | Público 200 |
| `/2026/06/08/conector-de-carga-com-defeito-sinais/` | 69 | Conector de carga com defeito: sinais de que precisa trocar \| ReeCell | Público 200 |
| `/2026/06/08/tela-de-celular-bombinhas/` | 92 | Quanto custa trocar a tela do celular em Bombinhas? Veja o que influencia no valor \| ReeCell | Público 200 |
| `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` | 74 | Tela trincada do celular: posso continuar usando ou devo trocar? \| ReeCell | Público 200 |
| `/2026/06/08/troca-de-bateria-de-celular-sinais/` | 65 | Troca de bateria de celular: sinais de que está na hora \| ReeCell | Público 200 |
| `/2026/06/15/celular-carregando-lentamente/` | 64 | Celular Carregando Lentamente: Carregador ou Aparelho? \| ReeCell | Público 200 |
| `/2026/06/15/celular-molhou-na-praia/` | 70 | Celular Molhou na Praia: O Que Fazer Para Evitar Perda Total \| ReeCell | Público 200 |
| `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/` | 64 | iPhone com Tela Quebrada em Bombinhas: Vale Consertar? \| ReeCell | Público 200 |
| `/2026/06/16/assistencia-tecnica-celular-bombinhas/` | 75 | Assistência técnica de celular em Bombinhas: serviços e avaliação \| ReeCell | Público 200 |
| `/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/` | 63 | Assistência Técnica de Celular Confiável em Bombinhas \| ReeCell | Público 200 |
| `/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/` | 73 | Assistência Técnica para Celular em Bombinhas: Quando Procurar? \| ReeCell | Público 200 |
| `/2026/06/16/botao-power-ou-volume-parou-de-funcionar/` | 65 | Botão Power ou Volume Parou de Funcionar: Tem Conserto? \| ReeCell | Público 200 |
| `/2026/06/16/camera-do-celular-embacada-ou-tremendo/` | 65 | Câmera do Celular Embaçada ou Tremendo: O Que Pode Ser? \| ReeCell | Público 200 |
| `/2026/06/16/celular-esquentando-muito/` | 68 | Celular Esquentando Muito: Causas e Riscos Para o Aparelho \| ReeCell | Público 200 |
| `/2026/06/16/como-proteger-seu-celular-em-bombinhas/` | 68 | Como Proteger Seu Celular em Bombinhas: Película e Capinha \| ReeCell | Público 200 |
| `/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/` | 64 | Melhores assistências técnicas de celular em Bombinhas \| ReeCell | Público 200 |
| `/2026/10/06/celular-nao-reconhece-chip/` | 71 | Celular n?o reconhece chip: o que verificar antes do conserto \| ReeCell | Somente local; público 404 |
| `/2026/10/06/celular-sem-sinal-ou-sem-rede/` | 63 | Celular sem sinal ou sem rede: operadora ou aparelho? \| ReeCell | Somente local; público 404 |
| `/2026/10/06/celular-travando-muito/` | 72 | Celular travando muito: como separar lentid?o e falha no toque \| ReeCell | Somente local; público 404 |
| `/2026/10/06/quanto-tempo-demora-consertar-celular/` | 74 | Quanto tempo demora para consertar um celular? Entenda as etapas \| ReeCell | Somente local; público 404 |
| `/2026/10/06/tela-do-celular-com-manchas-ou-linhas/` | 75 | Tela do celular com manchas pretas, roxas ou linhas: como avaliar \| ReeCell | Somente local; público 404 |
| `/2026/10/06/tela-do-celular-piscando/` | 66 | Tela do celular piscando: o que observar antes do reparo \| ReeCell | Somente local; público 404 |
| `/2026/10/06/touch-do-celular-nao-funciona/` | 72 | Touch do celular n?o funciona: imagem normal, mas sem resposta \| ReeCell | Somente local; público 404 |
| `/2026/10/06/vale-a-pena-consertar-celular-antigo/` | 63 | Vale a pena consertar um celular antigo? Como decidir \| ReeCell | Somente local; público 404 |

Gravidade média, P2. Arquivo individual: `src/content/blog/<último segmento da URL>.md`; implementação compartilhada: `src/content.config.ts` e `src/layouts/BlogLayout.astro`. Nenhum título foi alterado.

## Anexo C — Arquivos indexáveis isolados da navegação (A04/A05)

| URL | Artigos | Palavras aproximadas no main local | Links recebidos | HTTP público |
| --- | --- | --- | --- | --- |
| `/author/gabriel-souza/` | 10 | 324 | Apenas conjunto isolado de paginação | 200 |
| `/author/gabriel-souza/page/2/` | 10 | 338 | Apenas conjunto isolado de paginação | 200 |
| `/author/gabriel-souza/page/3/` | 3 | 134 | Apenas conjunto isolado de paginação | 200 |
| `/category/uncategorized/` | 10 | 322 | Apenas conjunto isolado de paginação | 200 |
| `/category/uncategorized/assistencia-tecnica/` | 9 | 305 | Nenhum de outra página | 200 |
| `/category/uncategorized/page/2/` | 10 | 336 | Apenas conjunto isolado de paginação | 200 |
| `/category/uncategorized/page/3/` | 3 | 132 | Apenas conjunto isolado de paginação | 200 |
| `/tag/assistencia-tecnica-bombinhas/` | 4 | 146 | Nenhum de outra página | 200 |
| `/tag/assistencia-tecnica-iphone/` | 1 | 50 | Nenhum de outra página | 200 |
| `/tag/assistencia-tecnica-samsung/` | 1 | 49 | Nenhum de outra página | 200 |
| `/tag/bateria-de-celular/` | 2 | 84 | Nenhum de outra página | 200 |
| `/tag/bateria-estufada/` | 1 | 50 | Nenhum de outra página | 200 |
| `/tag/bombinhas/` | 1 | 45 | Nenhum de outra página | 200 |
| `/tag/celular-descarregando-rapido/` | 1 | 52 | Nenhum de outra página | 200 |
| `/tag/celular-molhado/` | 1 | 49 | Nenhum de outra página | 200 |
| `/tag/celular-nao-carrega/` | 1 | 52 | Nenhum de outra página | 200 |
| `/tag/celular-tela-preta/` | 1 | 51 | Nenhum de outra página | 200 |
| `/tag/conector-de-carga/` | 1 | 50 | Nenhum de outra página | 200 |
| `/tag/consertar-celular-em-bombinhas/` | 1 | 49 | Nenhum de outra página | 200 |
| `/tag/conserto-de-celular/` | 2 | 79 | Nenhum de outra página | 200 |
| `/tag/conserto-de-tela/` | 1 | 53 | Nenhum de outra página | 200 |
| `/tag/diagnostico-celular/` | 1 | 49 | Nenhum de outra página | 200 |
| `/tag/iphone-bombinhas/` | 1 | 48 | Nenhum de outra página | 200 |
| `/tag/limpeza-de-conector/` | 1 | 52 | Nenhum de outra página | 200 |
| `/tag/manutencao-de-celular/` | 1 | 47 | Nenhum de outra página | 200 |
| `/tag/problema-na-placa/` | 1 | 51 | Nenhum de outra página | 200 |
| `/tag/reecell/` | 2 | 74 | Nenhum de outra página | 200 |
| `/tag/tela-quebrada/` | 1 | 51 | Nenhum de outra página | 200 |
| `/tag/troca-de-bateria/` | 1 | 52 | Nenhum de outra página | 200 |
| `/tag/troca-de-conector/` | 1 | 52 | Nenhum de outra página | 200 |
| `/tag/troca-de-tela-samsung/` | 1 | 51 | Nenhum de outra página | 200 |
| `/tag/troca-de-tela/` | 1 | 53 | Nenhum de outra página | 200 |

As 32 URLs acima estão no sitemap público, têm canonical próprio e index/follow, mas não são alcançadas a partir da home por links internos. As 21 tags com um artigo são candidatas prioritárias à revisão de utilidade, sem exclusão/noindex automático. Arquivos compartilhados e recomendações estão na seção 6.

### Conjuntos com os mesmos membros, na mesma ordem
- `/author/gabriel-souza/` + `/category/uncategorized/`
- `/author/gabriel-souza/page/2/` + `/category/uncategorized/page/2/`
- `/author/gabriel-souza/page/3/` + `/category/uncategorized/page/3/`
- `/tag/assistencia-tecnica-iphone/` + `/tag/conector-de-carga/` + `/tag/iphone-bombinhas/`
- `/tag/assistencia-tecnica-samsung/` + `/tag/bombinhas/` + `/tag/troca-de-tela-samsung/`
- `/tag/bateria-estufada/` + `/tag/celular-descarregando-rapido/` + `/tag/troca-de-bateria/`
- `/tag/celular-molhado/` + `/tag/celular-tela-preta/`
- `/tag/celular-nao-carrega/` + `/tag/limpeza-de-conector/` + `/tag/troca-de-conector/`
- `/tag/consertar-celular-em-bombinhas/` + `/tag/manutencao-de-celular/`
- `/tag/conserto-de-tela/` + `/tag/tela-quebrada/` + `/tag/troca-de-tela/`
- `/tag/diagnostico-celular/` + `/tag/problema-na-placa/`

Isso comprova repetição das listagens, não duplicação integral de todos os títulos/metadados nem penalidade do Google.

## Anexo D — Todos os redirecionamentos históricos verificados

| Origem | Destino | HTTP público | Justificativa no mapa |
| --- | --- | --- | --- |
| `/author-sitemap.xml` | `/sitemap.xml` | 301 | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| `/category-sitemap.xml` | `/sitemap.xml` | 301 | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| `/home-v3/` | `/` | 301 | Versão alternativa da página inicial; H1 antigo: Loja de celular em Bombinhas com assistência técnica. A Home atual cumpre a mesma finalidade. |
| `/page-sitemap.xml` | `/sitemap.xml` | 301 | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| `/post_tag-sitemap.xml` | `/sitemap.xml` | 301 | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| `/post-sitemap.xml` | `/sitemap.xml` | 301 | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| `/sitemap_index.xml` | `/sitemap.xml` | 301 | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| `/tag/celular-desligando-sozinho/` | `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` | 301 | Arquivo “celular desligando sozinho” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| `/tag/celular-nao-liga/` | `/2026/06/08/celular-nao-liga-principais-causas/` | 301 | Arquivo “celular não liga” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| `/tag/conector-de-carga-com-defeito/` | `/2026/06/08/conector-de-carga-com-defeito-sinais/` | 301 | Arquivo “conector de carga com defeito” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| `/tag/iphone-nao-carrega/` | `/2026/06/08/iphone-nao-carrega-causas-solucoes/` | 301 | Arquivo “iPhone não carrega” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| `/tag/samsung-com-tela-verde/` | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | 301 | Arquivo “Samsung com tela verde” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| `/tag/tela-trincada-do-celular/` | `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` | 301 | Arquivo “tela trincada do celular” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| `/tag/tela-verde-samsung/` | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | 301 | Arquivo “tela verde Samsung” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |

Todos os destinos finais foram verificados em 200 (página ou sitemap). Manter essas regras; não são propostas de redirecionamentos novos. Fontes: `src/data/legacy-migration.json`, `scripts/seo-routing.mjs` e `vercel.json`.

## Anexo E — Metadados e schema por página principal/artigo

| URL | HTTP público | Título: caracteres | Descrição: caracteres | Article.image | Arquivo principal |
| --- | --- | --- | --- | --- | --- |
| `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` | 200 | 74 | 116 | Presente | `src/content/blog/celular-caiu-na-agua-o-que-fazer.md` |
| `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` | 200 | 66 | 133 | Presente | `src/content/blog/celular-desligando-sozinho-bateria-sistema-placa.md` |
| `/2026/06/08/celular-nao-liga-principais-causas/` | 200 | 75 | 114 | Presente | `src/content/blog/celular-nao-liga-principais-causas.md` |
| `/2026/06/08/conector-de-carga-com-defeito-sinais/` | 200 | 69 | 125 | Presente | `src/content/blog/conector-de-carga-com-defeito-sinais.md` |
| `/2026/06/08/iphone-nao-carrega-causas-solucoes/` | 200 | 57 | 120 | Presente | `src/content/blog/iphone-nao-carrega-causas-solucoes.md` |
| `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` | 200 | 60 | 122 | Presente | `src/content/blog/onde-consertar-celular-em-bombinhas-com-seguranca.md` |
| `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | 200 | 49 | 111 | Presente | `src/content/blog/samsung-com-tela-verde-o-que-pode-ser.md` |
| `/2026/06/08/tela-de-celular-bombinhas/` | 200 | 92 | 122 | Ausente | `src/content/blog/tela-de-celular-bombinhas.md` |
| `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` | 200 | 74 | 118 | Presente | `src/content/blog/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar.md` |
| `/2026/06/08/troca-de-bateria-de-celular-sinais/` | 200 | 65 | 117 | Presente | `src/content/blog/troca-de-bateria-de-celular-sinais.md` |
| `/2026/06/15/celular-carregando-lentamente/` | 200 | 64 | 123 | Ausente | `src/content/blog/celular-carregando-lentamente.md` |
| `/2026/06/15/celular-molhou-na-praia/` | 200 | 70 | 113 | Ausente | `src/content/blog/celular-molhou-na-praia.md` |
| `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/` | 200 | 64 | 119 | Ausente | `src/content/blog/iphone-com-tela-quebrada-em-bombinhas.md` |
| `/2026/06/16/alto-falante-ou-microfone-do-celular-nao-funciona/` | 200 | 60 | 133 | Ausente | `src/content/blog/alto-falante-ou-microfone-do-celular-nao-funciona.md` |
| `/2026/06/16/assistencia-tecnica-celular-bombinhas/` | 200 | 75 | 121 | Ausente | `src/content/blog/assistencia-tecnica-celular-bombinhas.md` |
| `/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/` | 200 | 63 | 128 | Ausente | `src/content/blog/assistencia-tecnica-de-celular-confiavel-em-bombinhas.md` |
| `/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/` | 200 | 73 | 120 | Ausente | `src/content/blog/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar.md` |
| `/2026/06/16/botao-power-ou-volume-parou-de-funcionar/` | 200 | 65 | 127 | Ausente | `src/content/blog/botao-power-ou-volume-parou-de-funcionar.md` |
| `/2026/06/16/camera-do-celular-embacada-ou-tremendo/` | 200 | 65 | 137 | Ausente | `src/content/blog/camera-do-celular-embacada-ou-tremendo.md` |
| `/2026/06/16/celular-esquentando-muito/` | 200 | 68 | 112 | Ausente | `src/content/blog/celular-esquentando-muito.md` |
| `/2026/06/16/como-proteger-seu-celular-em-bombinhas/` | 200 | 68 | 123 | Ausente | `src/content/blog/como-proteger-seu-celular-em-bombinhas.md` |
| `/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/` | 200 | 64 | 129 | Ausente | `src/content/blog/melhores-assistencias-tecnicas-de-celular-em-bombinhas.md` |
| `/2026/08/04/melhores-lojas-de-celulares-em-bombinhas/` | 200 | 50 | 114 | Ausente | `src/content/blog/melhores-lojas-de-celulares-em-bombinhas.md` |
| `/2026/10/06/celular-nao-reconhece-chip/` | 404 | 71 | 119 | Ausente | `src/content/blog/celular-nao-reconhece-chip.md` |
| `/2026/10/06/celular-sem-sinal-ou-sem-rede/` | 404 | 63 | 129 | Ausente | `src/content/blog/celular-sem-sinal-ou-sem-rede.md` |
| `/2026/10/06/celular-travando-muito/` | 404 | 72 | 122 | Ausente | `src/content/blog/celular-travando-muito.md` |
| `/2026/10/06/quanto-tempo-demora-consertar-celular/` | 404 | 74 | 126 | Ausente | `src/content/blog/quanto-tempo-demora-consertar-celular.md` |
| `/2026/10/06/tela-do-celular-com-manchas-ou-linhas/` | 404 | 75 | 125 | Ausente | `src/content/blog/tela-do-celular-com-manchas-ou-linhas.md` |
| `/2026/10/06/tela-do-celular-piscando/` | 404 | 66 | 124 | Ausente | `src/content/blog/tela-do-celular-piscando.md` |
| `/2026/10/06/touch-do-celular-nao-funciona/` | 404 | 72 | 128 | Ausente | `src/content/blog/touch-do-celular-nao-funciona.md` |
| `/2026/10/06/vale-a-pena-consertar-celular-antigo/` | 404 | 63 | 130 | Ausente | `src/content/blog/vale-a-pena-consertar-celular-antigo.md` |
| `/blog/` | 200 | 12 | 114 | Não aplicável | `src/pages/blog/index.astro` |
| `/conserto-de-celular-em-bombinhas/` | 200 | 42 | 149 | Não aplicável | `src/pages/conserto-de-celular-em-bombinhas.astro` |
| `/contato-reecell-bombinhas/` | 200 | 47 | 141 | Não aplicável | `src/pages/contato-reecell-bombinhas.astro` |
| `/` | 200 | 55 | 143 | Não aplicável | `src/pages/index.astro` |
| `/troca-de-bateria-de-celular-em-bombinhas/` | 200 | 50 | 127 | Não aplicável | `src/pages/troca-de-bateria-de-celular-em-bombinhas.astro` |
| `/troca-de-tela-de-celular-em-bombinhas/` | 200 | 47 | 140 | Não aplicável | `src/pages/troca-de-tela-de-celular-em-bombinhas.astro` |

Todos os artigos locais acima omitem `Article.author`; nos artigos públicos a marcação extraída também omite autor. Para os oito 404, os metadados da tabela são do build local, não da página de erro pública. As 61 páginas públicas canônicas não têm títulos ou descrições vazios/duplicados na extração; o mesmo vale para as 69 páginas indexáveis locais. Ausência de image/author é oportunidade de enriquecimento, não diagnóstico de bloqueio de indexação.

## Anexo F — Reprodução e trilha de evidências

- Fontes WordPress preservadas: `docs/seo-migration/source/posts-1.json`, `pages-1.json`, `tags-1.json`, `categories-1.json`, `sitemap-*.xml`, `crawl.json` e `docs/blog-source/wordpress-media.json`. São snapshots históricos, não o site atual.
- Inventário da migração: `src/data/legacy-migration.json` (75 entradas); lista histórica do GSC: `docs/seo-migration/search-console-paths.txt` (47 caminhos).
- Análise temporária, fora do projeto: `%TEMP%/reecell-audit-local.json`, `%TEMP%/reecell-audit-remote.json` e `%TEMP%/reecell-audit-variants.json`, com URLs/status/metadados e HTML público da primeira bateria. Esses arquivos são auxiliares locais e podem ser removidos pela limpeza do sistema; as conclusões e matrizes necessárias foram incorporadas a este relatório.
- Rotinas temporárias: `%TEMP%/reecell-audit.mjs` e `%TEMP%/reecell-variants.mjs`. Leem o projeto e consultam URLs, sem editar fontes.
- A validação pública foi feita com GET, sem seguir redirects automaticamente; destinos foram consultados separadamente. A requisição de exemplo com user-agent Googlebot foi adicional.

Comandos de conferência local já executados:

```powershell
npm.cmd run build
npm.cmd run verify
git status --short --branch
```

As estatísticas deste relatório são de inventário/HTTP/HTML, não estimativas de tráfego ou ranking. Nenhuma correção, exclusão de página, alteração de slug, mudança de noindex ou publicação foi realizada.
