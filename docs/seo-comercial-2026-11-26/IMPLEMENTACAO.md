# Conteúdo comercial local — ReeCell

Execução: 26/11/2026. Cinco artigos implementados no blog Astro. Sem commit, push, deploy ou alteração de DNS nesta entrega.

## Entrega editorial

O inventário completo está em [ARTIGOS.md](ARTIGOS.md): H1, title SEO, URL final, palavra-chave, meta description, intenção, links internos e mensagem/link codificado do WhatsApp para cada artigo. A versão verificável por ferramentas está em [articles.json](articles.json).

As páginas estão em `draft: false` para renderização, sitemap e testes locais. Isso não representa publicação pública. A data 26/11/2026 é a data desta preparação e da prévia local. No momento da autorização de publicação, confirmar a data efetiva e ajustar `publishedDate` se necessário; as cinco URLs ainda não publicadas usam a data desta entrega. Não alterar datas ou URLs dos artigos históricos.

## Decisão sobre duplicação e intenção

| Oportunidade | Decisão | Limite editorial |
|---|---|---|
| Celulares | Criar página comercial e complementar a linkagem do guia anterior | O artigo de melhores lojas compara estabelecimentos. O novo orienta a consulta de compra na ReeCell, a escolha por uso e a compatibilidade. Não reproduz ranking, concorrentes nem alegações de superioridade. |
| Carregadores | Criar | Fonte de alimentação, tomada, tensão, potência e protocolo. O artigo anterior de carga lenta continua voltado a investigar falhas. |
| Cabos | Criar | Conectores nas duas pontas, transferência de dados e compatibilidade. Não replica o guia de fonte nem o diagnóstico do conector. |
| Películas | Criar | Consulta de produto e aplicação. O artigo anterior de proteção na praia continua preventivo; o de tela trincada continua voltado à avaliação de dano. |
| Capinhas | Criar | Compra por modelo exato, ajuste, materiais e consulta de opções. Não promete proteção absoluta. |

O link do guia antigo para o novo artigo de celulares foi acrescentado pelo mapa editorial em `src/data/editorial.ts`. O corpo histórico, seus metadados e permalink foram preservados. Os cinco textos novos se conectam entre si conforme a utilidade e à home, contato e serviços relevantes. A listagem do blog e os relacionados usam a coleção existente.

## Base comercial e pendências

- Fonte local para acessórios: `src/data/home.ts`, item `acessorios`, com película, capinha, cabo e carregador; artigos históricos também mencionam acessórios. Isso comprova a categoria divulgada, não o estoque atual.
- O usuário respondeu “sim” à confirmação de venda de celulares e aplicação de película. Foi registrada somente essa confirmação geral. Não se inferiu se vende novos, seminovos ou ambos.
- Endereço, contato e horários foram conferidos em `src/data/business.ts`. Os textos usam Bombas como bairro de Bombinhas, Santa Catarina, e remetem à página de contato para horários.
- Pendentes: condição dos aparelhos, marcas/modelos, cores, tipos específicos de película, potências, protocolos de cada produto, estoque, preços, prazos, garantia específica e se aplicação está incluída no valor. Nenhum desses detalhes foi inventado.
- Os números de Search Console fornecidos pelo usuário são contexto estratégico, não resultados desta entrega. Não foi acessada a propriedade para confirmá-los e não se somaram impressões de IA às demais.
- O ranking histórico de lojas não foi revalidado como comparação independente nem reproduzido nos textos novos.

## Imagens

Usada a foto real `public/reecell-fachada.webp` (53.514 bytes), identificada nas legendas como fachada, nunca como demonstração do estoque. Dimensões declaradas 680 × 382, formato WebP, carregamento lazy e decodificação assíncrona. O CSS existente mantém a imagem responsiva. Open Graph utiliza a imagem institucional existente.

Material ainda necessário para futuras fotos de produto: aparelhos realmente à venda, fontes com identificação legível, as duas pontas dos cabos, películas e aplicação real, capinhas e seus recortes. Registrar quais produtos aparecem e obter autorização de uso; não fotografar dados de clientes. Não foram geradas fotos fictícias.

## Integração e preservação

- Novos campos opcionais `seoTitle` e `editorialAuthor` na coleção. Os artigos antigos mantêm o comportamento anterior.
- Autoria dos novos artigos: Organization ReeCell, ligada à entidade já existente e exibida como conteúdo comercial da empresa. Nenhuma pessoa ou experiência foi atribuída sem comprovação.
- `BlogLayout.astro` apresenta um bloco de visita/compra nos artigos comerciais, em lugar do convite genérico a diagnóstico. Usa o mesmo componente de CTA, estrutura visual, sumário e breadcrumbs.
- `vercel.json` recebeu somente regras adicionais para os cinco novos caminhos: 210 linhas acrescentadas, sem remoção de regras anteriores. O gerador passa a aceitar inclusão aditiva quando todas as regras anteriores permanecem idênticas e na mesma ordem; regras personalizadas desconhecidas continuam bloqueadas.
- GTM, GA4, eventos, consentimento, número e botão flutuante não foram alterados. Não há novo script de evento, tag ou schema Product.

## Rastreamento observado

Contêiner público carregado: GTM-5WFKFJ6P. Destino observado: G-HX67PMTJFG. Foram feitos dois cliques no CTA principal de cada artigo, totalizando dez: antes e depois de emitir o sinal local `reecell:analytics-consent` com `granted: true`.

Cada clique produziu exatamente uma tentativa de envio de `whatsapp_click` ao GA4. Os links foram clicados no navegador, com navegação ao WhatsApp impedida para não sair do teste. As requisições de coleta foram interceptadas e abortadas, sem enviar os eventos de teste ao Analytics. Nenhuma mensagem foi enviada pelo WhatsApp.

Isso valida a formação dos links e o disparo no ambiente testado. Não comprova recebimento no GA4, DebugView, conversas recebidas ou configuração completa do consentimento. O GTM já dispara pelo link antes do sinal de consentimento do módulo local; esse comportamento preexistente foi preservado. O conector GTM não tinha sessão autenticada, portanto não houve inspeção administrativa nem publicação de contêiner. Não foram adicionados parâmetros de cliente, texto digitado, telefone de cliente ou outros dados pessoais aos eventos.

Evidência: [browser-validation.json](browser-validation.json). O primeiro contador amplo de H1 do Playwright incluía elementos do shadow DOM da barra de desenvolvimento; a conferência no documento e no HTML estático confirmou exatamente um H1 por página.

## Validações executadas

| Verificação | Resultado |
|---|---|
| `npm.cmd run build` | 75 páginas geradas, sucesso |
| `npm.cmd run verify` | H1, canonical, robots, JSON-LD, links, âncoras, fontes e loader GTM único, sucesso |
| `npm.cmd run verify:seo` | 74 URLs no sitemap; 75 URLs legadas e 13 artigos novos no contrato; 28 hashes históricos preservados |
| `npm.cmd run verify:optimization` | 74 títulos únicos; 23 autores pessoais históricos e cinco autorias institucionais; nenhuma página órfã; até três cliques da home |
| `node scripts/verify-blog-editorial.mjs` | 36 artigos com imagens existentes e CTA contextual |
| `npm.cmd run test:seo:http` | 197 verificações locais sem falha; não emula integralmente a hospedagem |
| `npm.cmd run test:migration` | Permalinks, datas, rascunhos, campos internos e remoção de fixtures, sucesso |
| `node --test scripts/content-hash.test.mjs` | 28 testes passaram |
| `node scripts/verify-local-commerce.mjs` | Cinco artigos: metadados exclusivos, H1, OG, canonical, indexabilidade, sitemap, listagem, autoria, breadcrumbs e mensagens exatas |
| Navegador | Cinco artigos em 1440, 390 e 320 px, sem overflow horizontal; CTA dentro da largura disponível |
| Inspeção visual | Cabeçalho desktop e corpo/CTA mobile conferidos; capturas desktop.png e mobile.png |
| Rastreamento | Dez cliques, uma tentativa de evento comercial por clique, coleta abortada |
| `git diff --check` | Sem erros de whitespace |
| Lint | Não há comando lint configurado no package.json; nenhum resultado de lint alegado |

## Arquivos criados e modificados

Criados:

- `src/content/blog/onde-comprar-celular-em-bombinhas.md`
- `src/content/blog/onde-comprar-carregador-em-bombinhas.md`
- `src/content/blog/onde-comprar-cabo-carregador-em-bombinhas.md`
- `src/content/blog/onde-comprar-pelicula-em-bombinhas.md`
- `src/content/blog/onde-comprar-capinhas-em-bombinhas.md`
- `scripts/verify-local-commerce.mjs`
- `docs/seo-comercial-2026-11-26/`: este relatório, ARTIGOS.md, articles.json, browser-validation.json e duas capturas.

Modificados:

- `src/content.config.ts`
- `src/layouts/BlogLayout.astro`
- `src/data/editorial.ts`
- `scripts/generate-seo-hosting.mjs`
- `scripts/verify-optimization.mjs`
- `vercel.json`
- `docs/seo-migration/local-validation.json`
- `docs/seo-migration/http-contract-validation.json`
- `docs/otimizacao-2026-11-25/validation.json` (saída do verificador existente, com timestamp novo)

## Fontes técnicas consultadas

- [Astro: coleções de conteúdo](https://docs.astro.build/en/guides/content-collections/), [rotas](https://docs.astro.build/en/guides/routing/), [componentes](https://docs.astro.build/en/basics/astro-components/) e [estilos](https://docs.astro.build/en/guides/styling/).
- [USB-IF: USB Power Delivery](https://usb.org/usb-charger-pd) e [terminologia USB-C](https://www.usb.org/sites/default/files/usb_type-c_language_product_and_packaging_guidelines_20230320.pdf).
- [Apple: cabo USB-C para Lightning](https://support.apple.com/en-us/111752).
- [Site público da ReeCell](https://reecell.com.br/) como contexto institucional, sem presumir que seu conteúdo público represente estoque atualizado.

Após autorização para publicação, conferir a data efetiva, publicar no destino correto e repetir a validação HTTP e visual nas URLs públicas. Não há promessa de posições, CTR ou citações em IA.
