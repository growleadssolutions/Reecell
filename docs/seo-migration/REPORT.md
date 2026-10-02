# Migração SEO ReeCell — relatório de implementação

Atualizado em 2026-10-01T22:20:04.762Z. Domínio final: **https://reecell.com.br**.

## Estado para o DNS

**Ainda não liberar a troca do DNS.** Implementação e testes locais concluídos; falta validar o build e as regras na hospedagem real. Nenhum DNS, nameserver, registro de e-mail ou arquivo da HostGator foi alterado. Não houve deploy.

Não existiam configuração de hospedagem nem vínculo de projeto neste checkout. A conta Vercel conectada foi consultada em modo leitura e não retornou projeto ReeCell. A Vercel foi **preparada como destino provisório**, sem presumir que já seja o destino escolhido. Confirmar hospedagem e conta/projeto antes de publicar. Se não for Vercel, aplicar os 301 na camada do provedor escolhido; HTML estático sozinho não os executa.

## Inventário e evidências

- A [lista fornecida](search-console-paths.txt) contém 47 caminhos.
- Coleta pública: robots, índice e cinco sitemaps filhos, API WordPress de artigos, páginas, tags e categorias.
- Sitemap antigo: **65 URLs**. Rastreamento com paginação: **69 URLs, todas HTTP 200** no WordPress.
- API: 23 artigos, 7 páginas, 32 tags e 2 categorias.
- Mapa: **75 entradas**, incluindo seis sitemaps: **61 preservadas e 14 redirects 301**.
- Evidências: [inventário](source/inventory.json), [rastreamento](source/crawl.json) e XMLs/HTMLs em `source/`.
- O acesso inicial foi bloqueado no ambiente restrito; a coleta com acesso à rede foi concluída. Não há limitação de acesso pendente para as fontes coletadas.
- Este inventário cobre as fontes consultadas, não prova cobertura de URLs órfãs, anexos, feeds, parâmetros e backlinks históricos. Comparar exportação integral do Search Console antes do corte.

## Alterações implementadas

1. Os 23 artigos, Home, três serviços, Contato e Blog mantêm suas URLs. Os artigos usam `/YYYY/MM/DD/slug/` por `permalinkDate` imutável; não foram movidos para `/blog/slug/`.
2. `src/pages/[...legacy].astro` gera 25 arquivos de tags, categoria Uncategorized com três páginas, categoria filha Assistência Técnica e arquivo de Gabriel Souza com três páginas. Associação, ordem e divisão dos artigos por página foram extraídas do HTML WordPress. Nenhuma página vazia foi criada.
3. Sete tags repetem precisamente o assunto de seu único artigo e recebem 301 direto a ele. Tags com tema mais amplo/diferente mantêm a listagem original, mesmo quando há somente um artigo. Não houve redirecionamento indiscriminado para Home, Blog ou serviço. Justificativas individuais estão na matriz.
4. `/home-v3/` é uma versão alternativa da Home: seu H1 antigo é “Loja de celular em Bombinhas com assistência técnica”. Recebe 301 para `/`. Seis sitemaps WordPress recebem 301 para `/sitemap.xml`.
5. `vercel.json` aplica HTTP 301 com destinos finais exatos e combina variantes www, HTTPS, barra final e `index.html` no mesmo salto. Redirects em preview permanecem relativos para não serem validados por engano no WordPress antigo.
6. Usam-se regras `routes` com regex ancorada e status explícito, sem os 308 implícitos de `trailingSlash`/`cleanUrls`. Não existiam regras anteriores. O gerador recusa configurações divergentes para evitar sobrescrever futuras regras. Referência: [Vercel](https://vercel.com/docs/project-configuration/vercel-json).
7. Rotas finais conhecidas apontam ao HTML correspondente; assets passam pelo filesystem. Desconhecidas recebem 404 real, com página 404 e noindex; não há fallback 200 para Home. Nenhuma URL auditada exigiu retirada 404/410, pois todos os conteúdos tinham destino ou arquivo preservável.
8. Sitemap contém 61 URLs finais indexáveis, sem redirects/404. Canonicals usam HTTPS sem www e barra final. Robots permite rastrear e informa `https://reecell.com.br/sitemap.xml`.
9. Links internos apontam diretamente às rotas finais. O build contém 107 referências de imagens locais existentes, sem dependência de wp-content/HostGator. Não foi necessário baixar outras imagens; os assets necessários já estavam em `src/assets` e `public`.
10. 23 arquivos Markdown e cinco folhas de estilo estão idênticos por SHA-256. Não houve reescrita de artigos, palavras-chave ou do layout existente.

**Artigos ou serviços ausentes no conjunto auditado: nenhum.**

## Testes e limites de evidência

| Camada | Resultado | Limite |
|---|---|---|
| WordPress antigo | 69 URLs com 200 | Prova a coleta antiga, não a migração |
| Build Astro | 62 HTMLs; 61 URLs no sitemap | Geração estática |
| verify / test:migration / verify-blog-editorial | Passaram | Links, H1, canonical, JSON-LD, datas, drafts, imagens e CTAs |
| verify:seo | Passou | 75 tratamentos, destinos, sitemap, contrato sem loops/cadeias, 28 hashes intactos |
| HTTP do contrato local | 148 casos, 0 falhas | Servidor Node de teste, **não é a Vercel** |
| Preview/produção Vercel | **PENDENTE** | Precisa do deploy real para comprovar comportamento da plataforma |

O servidor local do Astro não aplica `vercel.json`. O servidor Node de contrato também não equivale à infraestrutura Vercel. Evidências: [build/contrato](local-validation.json), [HTTP local](http-contract-validation.json). Não se afirma que a migração está publicada.

```powershell
npm.cmd run build
npm.cmd run verify
npm.cmd run test:migration
node scripts/verify-blog-editorial.mjs
npm.cmd run verify:seo
npm.cmd run test:seo:http
# Depois de obter uma URL REAL de preview:
npm.cmd run test:seo:http -- --base-url https://URL-REAL-DO-PREVIEW
```

O teste remoto usa redirects manuais: exige 301, destino final 200 sem novo redirect, canonical de produção, sitemap, robots e 404 real. Não aceita redirect de preview para o WordPress antigo como prova. Deployment Protection pode usar `VERCEL_AUTOMATION_BYPASS_SECRET` no ambiente, nunca no repositório. Noindex de preview via header é permitido pelo teste; em produção é rejeitado.

## Bloqueios antes da troca

- Confirmar destino e conta/projeto. Publicar preview sem alterar DNS e executar o teste HTTP remoto contra esse build.
- Validar na hospedagem as quatro variantes HTTP/HTTPS e www/sem www, com/sem barra e fontes de 301. A plataforma pode impor HTTPS antes das regras; verificar a ordem real. Não criar redirect de domínio www separado que introduza um salto antes do redirect de caminho; ambos os hosts devem atender pelo mesmo projeto.
- Conferir certificado para ambos os hosts, proteção de preview e headers. Noindex de preview não pode chegar à produção.
- Comparar uma exportação completa do Search Console/backlinks com o mapa; acrescentar URLs históricas ausentes individualmente.
- Fazer backup do WordPress, banco e uploads, preservando a HostGator para consulta e rollback. Preservar MX/SPF/DKIM/DMARC se alterar DNS. Nada foi excluído nesta tarefa.

## Depois da troca

1. Confirmar DNS e HTTPS, host final e cadeia de redirects; repetir o teste com `--base-url https://reecell.com.br`.
2. Conferir canonical, ausência de noindex em HTML/headers, robots permitido, sitemap 200 e inexistentes 404.
3. Manter a propriedade de domínio no Search Console, reenviar o sitemap e inspecionar artigos/serviços/arquivos/redirects. Com o domínio inalterado, não usar mudança de endereço apenas por trocar hospedagem.
4. Monitorar indexação, 404/soft-404/5xx, logs, cliques e impressões nas primeiras semanas. Tratar novas URLs antigas individualmente e manter os 301 enquanto houver referências.
5. Conferir imagens, navegação mobile, WhatsApp e e-mail; manter backup e plano de rollback.

Pode haver oscilações de rastreamento, indexação e ranking; não há garantia de ausência de oscilações.

## Matriz completa

“HTTP local” refere-se ao servidor de contrato, **não confirma Vercel/produção**. Versões [CSV](url-report.csv) e [JSON](url-report.json).

| URL antiga | URL final | Tratamento | Validação | Justificativa individual |
|---|---|---|---|---|
| https://reecell.com.br/ | https://reecell.com.br/ | preservada | 200 HTTP local; hospedagem pendente | Página existente preservada no mesmo endereço. |
| https://reecell.com.br/2026/06/08/celular-caiu-na-agua-o-que-fazer/ | https://reecell.com.br/2026/06/08/celular-caiu-na-agua-o-que-fazer/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/ | https://reecell.com.br/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/celular-nao-liga-principais-causas/ | https://reecell.com.br/2026/06/08/celular-nao-liga-principais-causas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/conector-de-carga-com-defeito-sinais/ | https://reecell.com.br/2026/06/08/conector-de-carga-com-defeito-sinais/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/iphone-nao-carrega-causas-solucoes/ | https://reecell.com.br/2026/06/08/iphone-nao-carrega-causas-solucoes/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/ | https://reecell.com.br/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/ | https://reecell.com.br/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/tela-de-celular-bombinhas/ | https://reecell.com.br/2026/06/08/tela-de-celular-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/ | https://reecell.com.br/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/08/troca-de-bateria-de-celular-sinais/ | https://reecell.com.br/2026/06/08/troca-de-bateria-de-celular-sinais/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/15/celular-carregando-lentamente/ | https://reecell.com.br/2026/06/15/celular-carregando-lentamente/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/15/celular-molhou-na-praia/ | https://reecell.com.br/2026/06/15/celular-molhou-na-praia/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/ | https://reecell.com.br/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/alto-falante-ou-microfone-do-celular-nao-funciona/ | https://reecell.com.br/2026/06/16/alto-falante-ou-microfone-do-celular-nao-funciona/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/assistencia-tecnica-celular-bombinhas/ | https://reecell.com.br/2026/06/16/assistencia-tecnica-celular-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/ | https://reecell.com.br/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/ | https://reecell.com.br/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/botao-power-ou-volume-parou-de-funcionar/ | https://reecell.com.br/2026/06/16/botao-power-ou-volume-parou-de-funcionar/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/camera-do-celular-embacada-ou-tremendo/ | https://reecell.com.br/2026/06/16/camera-do-celular-embacada-ou-tremendo/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/celular-esquentando-muito/ | https://reecell.com.br/2026/06/16/celular-esquentando-muito/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/06/16/como-proteger-seu-celular-em-bombinhas/ | https://reecell.com.br/2026/06/16/como-proteger-seu-celular-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/ | https://reecell.com.br/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/2026/08/04/melhores-lojas-de-celulares-em-bombinhas/ | https://reecell.com.br/2026/08/04/melhores-lojas-de-celulares-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido. |
| https://reecell.com.br/author-sitemap.xml | https://reecell.com.br/sitemap.xml | 301 | 301 → 200 HTTP local; hospedagem pendente | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| https://reecell.com.br/author/gabriel-souza/ | https://reecell.com.br/author/gabriel-souza/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo de autor com 10 artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas. |
| https://reecell.com.br/author/gabriel-souza/page/2/ | https://reecell.com.br/author/gabriel-souza/page/2/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo de autor com 10 artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas. |
| https://reecell.com.br/author/gabriel-souza/page/3/ | https://reecell.com.br/author/gabriel-souza/page/3/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo de autor com 3 artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas. |
| https://reecell.com.br/blog/ | https://reecell.com.br/blog/ | preservada | 200 HTTP local; hospedagem pendente | Página existente preservada no mesmo endereço. |
| https://reecell.com.br/category-sitemap.xml | https://reecell.com.br/sitemap.xml | 301 | 301 → 200 HTTP local; hospedagem pendente | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| https://reecell.com.br/category/uncategorized/ | https://reecell.com.br/category/uncategorized/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo de categoria com 10 artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas. |
| https://reecell.com.br/category/uncategorized/assistencia-tecnica/ | https://reecell.com.br/category/uncategorized/assistencia-tecnica/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo de categoria com 9 artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas. |
| https://reecell.com.br/category/uncategorized/page/2/ | https://reecell.com.br/category/uncategorized/page/2/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo de categoria com 10 artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas. |
| https://reecell.com.br/category/uncategorized/page/3/ | https://reecell.com.br/category/uncategorized/page/3/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo de categoria com 3 artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas. |
| https://reecell.com.br/conserto-de-celular-em-bombinhas/ | https://reecell.com.br/conserto-de-celular-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Página existente preservada no mesmo endereço. |
| https://reecell.com.br/contato-reecell-bombinhas/ | https://reecell.com.br/contato-reecell-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Página existente preservada no mesmo endereço. |
| https://reecell.com.br/home-v3/ | https://reecell.com.br/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Versão alternativa da página inicial; H1 antigo: Loja de celular em Bombinhas com assistência técnica. A Home atual cumpre a mesma finalidade. |
| https://reecell.com.br/page-sitemap.xml | https://reecell.com.br/sitemap.xml | 301 | 301 → 200 HTTP local; hospedagem pendente | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| https://reecell.com.br/post_tag-sitemap.xml | https://reecell.com.br/sitemap.xml | 301 | 301 → 200 HTTP local; hospedagem pendente | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| https://reecell.com.br/post-sitemap.xml | https://reecell.com.br/sitemap.xml | 301 | 301 → 200 HTTP local; hospedagem pendente | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| https://reecell.com.br/sitemap_index.xml | https://reecell.com.br/sitemap.xml | 301 | 301 → 200 HTTP local; hospedagem pendente | Sitemap legado substituído pelo sitemap XML único com as URLs finais. |
| https://reecell.com.br/tag/assistencia-tecnica-bombinhas/ | https://reecell.com.br/tag/assistencia-tecnica-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 4 artigo(s) reais. O rótulo “assistência técnica Bombinhas” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/assistencia-tecnica-iphone/ | https://reecell.com.br/tag/assistencia-tecnica-iphone/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “assistência técnica iPhone” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/assistencia-tecnica-samsung/ | https://reecell.com.br/tag/assistencia-tecnica-samsung/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “assistência técnica Samsung” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/bateria-de-celular/ | https://reecell.com.br/tag/bateria-de-celular/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 2 artigo(s) reais. O rótulo “bateria de celular” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/bateria-estufada/ | https://reecell.com.br/tag/bateria-estufada/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “bateria estufada” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/bombinhas/ | https://reecell.com.br/tag/bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “Bombinhas” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/celular-descarregando-rapido/ | https://reecell.com.br/tag/celular-descarregando-rapido/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “celular descarregando rápido” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/celular-desligando-sozinho/ | https://reecell.com.br/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Arquivo “celular desligando sozinho” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| https://reecell.com.br/tag/celular-molhado/ | https://reecell.com.br/tag/celular-molhado/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “celular molhado” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/celular-nao-carrega/ | https://reecell.com.br/tag/celular-nao-carrega/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “celular não carrega” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/celular-nao-liga/ | https://reecell.com.br/2026/06/08/celular-nao-liga-principais-causas/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Arquivo “celular não liga” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| https://reecell.com.br/tag/celular-tela-preta/ | https://reecell.com.br/tag/celular-tela-preta/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “celular tela preta” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/conector-de-carga-com-defeito/ | https://reecell.com.br/2026/06/08/conector-de-carga-com-defeito-sinais/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Arquivo “conector de carga com defeito” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| https://reecell.com.br/tag/conector-de-carga/ | https://reecell.com.br/tag/conector-de-carga/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “conector de carga” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/consertar-celular-em-bombinhas/ | https://reecell.com.br/tag/consertar-celular-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “consertar celular em Bombinhas” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/conserto-de-celular/ | https://reecell.com.br/tag/conserto-de-celular/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 2 artigo(s) reais. O rótulo “conserto de celular” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/conserto-de-tela/ | https://reecell.com.br/tag/conserto-de-tela/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “conserto de tela” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/diagnostico-celular/ | https://reecell.com.br/tag/diagnostico-celular/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “diagnóstico celular” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/iphone-bombinhas/ | https://reecell.com.br/tag/iphone-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “iPhone Bombinhas” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/iphone-nao-carrega/ | https://reecell.com.br/2026/06/08/iphone-nao-carrega-causas-solucoes/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Arquivo “iPhone não carrega” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| https://reecell.com.br/tag/limpeza-de-conector/ | https://reecell.com.br/tag/limpeza-de-conector/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “limpeza de conector” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/manutencao-de-celular/ | https://reecell.com.br/tag/manutencao-de-celular/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “manutenção de celular” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/problema-na-placa/ | https://reecell.com.br/tag/problema-na-placa/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “problema na placa” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/reecell/ | https://reecell.com.br/tag/reecell/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 2 artigo(s) reais. O rótulo “Reecell” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/samsung-com-tela-verde/ | https://reecell.com.br/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Arquivo “Samsung com tela verde” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| https://reecell.com.br/tag/tela-quebrada/ | https://reecell.com.br/tag/tela-quebrada/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “tela quebrada” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/tela-trincada-do-celular/ | https://reecell.com.br/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Arquivo “tela trincada do celular” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| https://reecell.com.br/tag/tela-verde-samsung/ | https://reecell.com.br/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/ | 301 | 301 → 200 HTTP local; hospedagem pendente | Arquivo “tela verde Samsung” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo. |
| https://reecell.com.br/tag/troca-de-bateria/ | https://reecell.com.br/tag/troca-de-bateria/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “troca de bateria” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/troca-de-conector/ | https://reecell.com.br/tag/troca-de-conector/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “troca de conector” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/troca-de-tela-samsung/ | https://reecell.com.br/tag/troca-de-tela-samsung/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “troca de tela Samsung” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/tag/troca-de-tela/ | https://reecell.com.br/tag/troca-de-tela/ | preservada | 200 HTTP local; hospedagem pendente | Arquivo tem 1 artigo(s) reais. O rótulo “troca de tela” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico. |
| https://reecell.com.br/troca-de-bateria-de-celular-em-bombinhas/ | https://reecell.com.br/troca-de-bateria-de-celular-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Página existente preservada no mesmo endereço. |
| https://reecell.com.br/troca-de-tela-de-celular-em-bombinhas/ | https://reecell.com.br/troca-de-tela-de-celular-em-bombinhas/ | preservada | 200 HTTP local; hospedagem pendente | Página existente preservada no mesmo endereço. |
