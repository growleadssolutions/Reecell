# Plano de correção de SEO — ReeCell

**Data:** 09/11/2026. **Objetivo:** preservar rankings e fortalecer o atendimento local em Bombinhas, com mudanças graduais e mensuráveis. **Status:** proposta para aprovação; nenhuma implementação ou publicação autorizada por este documento.

Base: [AUDITORIA-SEO-REECELL.md](AUDITORIA-SEO-REECELL.md), mapa legado e conteúdo do checkout. Os status HTTP são os registrados na auditoria de 09/11/2026, não um novo rastreamento desta etapa. Intenções de busca e conflitos abaixo são análises editoriais, sem estimativas de volume nem alegação de canibalização comprovada. Sem dados atuais de consultas/cliques, não é possível identificar com segurança quais páginas sustentam mais rankings.

## Diretrizes de preservação

- Manter as **61 URLs legadas preservadas**, os **14 redirecionamentos existentes**, as datas dos permalinks, slugs e canonicals próprios. O mapa tem 75 entradas; não são 75 páginas finais indexáveis.
- Não excluir páginas, criar redirects, aplicar noindex ou publicar os oito artigos nesta etapa. Não alterar o sitemap agora.
- As **32 páginas de arquivo fazem parte das 61**: seis páginas principais + 23 artigos + 32 arquivos = 61. Não somar esses grupos como se fossem independentes.
- Os oito artigos novos estão locais, com `draft: false`, e entrariam no build atual. **Nenhum deploy geral do checkout deve ocorrer enquanto não houver uma decisão explícita sobre esse lote.** Planejar uma futura entrega isolada; não presumir que “não commitado” equivale a bloqueio permanente de publicação.
- Obter baseline por URL/consulta antes de modificar títulos ou textos. Usar os últimos 28 dias completos e os 28 anteriores; quando disponível, comparar também sazonalidade anual. Segmentar marca/não marca, dispositivos e consultas com Bombinhas/Bombas. GSC não fornece atribuição municipal precisa de todos os usuários: não confundir palavras locais na consulta com localização comprovada.
- Tratar rankings orgânicos e presença no Maps separadamente. Dados do Perfil da Empresa, se acessíveis posteriormente, complementam o GSC.
- Preferir mudanças aditivas e pontuais; não reescrever o corpo de páginas que performam bem. Registrar alteração, URL, data e hipótese. Nenhuma promessa de ganho ou ausência de oscilação.

**Prioridades:** P0 = investigar risco operacional antes de mudanças; P1 = primeira execução aprovada; P2 = segunda execução, com baseline; P3 = refinamento. Não há indisponibilidade geral confirmada na auditoria.

## Grupo 1 — Correções técnicas urgentes

### 1.1 Matriz de execução técnica

| Problema | URL / escopo | Prioridade | Solução recomendada, ainda não executada | Riscos e condições | Arquivos envolvidos |
|---|---|---|---|---|---|
| Causas individuais do GSC desconhecidas | 106 URLs 404, 45 rastreadas não indexadas, dois 5xx e dez noindex; lista atual não fornecida | P0 | Reunir URLs exatas, última visita, canonical escolhido e logs; classificar atual vs. histórico | Alterar regras com base apenas nos totais pode remover páginas úteis; não atribuir os oito artigos aos erros sem evidência | Exportações futuras em `docs/seo-migration/`; inicialmente nenhum código |
| IDs antigos mostram home | `/?p=431` e `/?p=427` | P1 | Preparar mapeamento individual para os dois artigos equivalentes da tabela 1.3; implementar somente após aprovação específica | Não capturar parâmetros de campanha nem IDs desconhecidos; não mudar os 14 redirects atuais | `scripts/seo-routing.mjs`, mapa de IDs a definir, `vercel.json`, `scripts/test-seo-http.mjs` |
| Anexos antigos não mapeados | Três páginas de anexo listadas em 1.3 | P1 investigação | Conferir conteúdo antigo, backlinks e relação com artigo pai; escolher preservação ou tratamento individual | Artigo pai não é equivalente automático a qualquer anexo; 404 legítimo não precisa virar redirect | `docs/blog-source/wordpress-media.json` como fonte; `src/data/legacy-migration.json`, regras e eventual página correspondente |
| URLs de imagens antigas bloqueadas | Três `/wp-content/uploads/...` de 1.3 | P1 investigação | Consultar regra responsável pelo 403 e inventariar arquivo equivalente; preferir recurso estável e equivalente | Não desativar firewall global; imagens atuais do site não foram identificadas como quebradas | Configuração Vercel correta, `vercel.json`, eventual `public/wp-content/uploads/...` |
| Risco de publicar conteúdo ainda não aprovado | Oito URLs `/2026/10/06/.../` de 3.1 | P1 bloqueio de release | Isolar lote de conteúdo da futura entrega técnica e formalizar sua elegibilidade de publicação antes de qualquer build destinado a produção | Todos estão `draft: false`; corrigir só SEO técnico e fazer deploy do checkout inteiro publicaria o lote junto | Oito Markdown, `src/content.config.ts`, `src/lib/blog.ts`, procedimento Git/release; nenhuma mudança agora |
| Snapshot local diverge do público | 69 URLs locais vs. 61 públicas registradas | P1 | Identificar projeto/equipe, SHA e artefato realmente publicado; comparar manifesto de URLs | O conector consultado na auditoria não encontrou ReeCell na equipe acessível; não supor deploy atualizado | `vercel.json`, `docs/seo-migration/REPORT.md`, relatórios de validação |
| Preservar migração funcional | 61 URLs finais e 14 fontes 301 de 1.2/1.4 | P1, requisito de regressão | Congelar pares origem/destino; testar 200 final, canonical, conteúdo e variantes antes de futura publicação | Gerador não pode sobrescrever regras externas; não mover artigos para `/blog/slug/` | `src/data/legacy-migration.json`, `scripts/seo-routing.mjs`, `scripts/generate-seo-hosting.mjs`, `vercel.json` |
| Misturar status de erro com indexabilidade | `/404/`, `/404.html`, inexistentes e URLs excluídas do GSC | P1 investigação | Manter 404 real e noindex de erro; identificar qualquer 200 útil indevidamente bloqueado antes de corrigir | Remover noindex da 404 não recupera conteúdo; preview não deve ser tratado como produção | `src/pages/404.astro`, `src/components/seo/SeoHead.astro`, headers do projeto |
| Contrato HTTP exige uma única etapa que a plataforma não garante | `http://www.reecell.com.br/tag/iphone-nao-carrega/` | P3 | Aceitar HTTPS 308 seguido do 301 específico se a Vercel impuser; testar destino final e ausência de loop | Não alterar HTTPS nem redirects funcionais para satisfazer teste artificial | `scripts/test-seo-http.mjs`, documentação; regras só se necessário |

### 1.2 As 61 URLs preservadas e seus equivalentes atuais

**Todas as 61 têm equivalente no mesmo endereço**, conforme mapa e teste da auditoria. Não há página “perdida” dentro desse conjunto. Preservação de URL não prova identidade palavra por palavra com WordPress nem ranking estável. Todas devem ser relacionadas ao GSC para avaliar desempenho; isso é diferente de investigar ausência de equivalente.

Na tabela, “mesma URL” é correspondência exata entre caminho antigo e atual em `https://reecell.com.br`. **Manter no sitemap** é a decisão conservadora deste plano; não representa garantia de indexação. Os arquivos de taxonomia ficam sujeitos à melhoria de utilidade, sem remoção automática.

| # | URL antiga | Equivalente atual | Tipo | Decisão / investigação |
| --- | --- | --- | --- | --- |
| 1 | `/` | Mesma URL | Página principal | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 2 | `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 3 | `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 4 | `/2026/06/08/celular-nao-liga-principais-causas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 5 | `/2026/06/08/conector-de-carga-com-defeito-sinais/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 6 | `/2026/06/08/iphone-nao-carrega-causas-solucoes/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 7 | `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 8 | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 9 | `/2026/06/08/tela-de-celular-bombinhas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 10 | `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 11 | `/2026/06/08/troca-de-bateria-de-celular-sinais/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 12 | `/2026/06/15/celular-carregando-lentamente/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 13 | `/2026/06/15/celular-molhou-na-praia/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 14 | `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 15 | `/2026/06/16/alto-falante-ou-microfone-do-celular-nao-funciona/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 16 | `/2026/06/16/assistencia-tecnica-celular-bombinhas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 17 | `/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 18 | `/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 19 | `/2026/06/16/botao-power-ou-volume-parou-de-funcionar/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 20 | `/2026/06/16/camera-do-celular-embacada-ou-tremendo/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 21 | `/2026/06/16/celular-esquentando-muito/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 22 | `/2026/06/16/como-proteger-seu-celular-em-bombinhas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 23 | `/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 24 | `/2026/08/04/melhores-lojas-de-celulares-em-bombinhas/` | Mesma URL | Artigo | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 25 | `/author/gabriel-souza/` | Mesma URL | Autor público | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 26 | `/author/gabriel-souza/page/2/` | Mesma URL | Autor público | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 27 | `/author/gabriel-souza/page/3/` | Mesma URL | Autor público | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 28 | `/blog/` | Mesma URL | Página principal | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 29 | `/category/uncategorized/` | Mesma URL | Categoria pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 30 | `/category/uncategorized/assistencia-tecnica/` | Mesma URL | Categoria pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 31 | `/category/uncategorized/page/2/` | Mesma URL | Categoria pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 32 | `/category/uncategorized/page/3/` | Mesma URL | Categoria pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 33 | `/conserto-de-celular-em-bombinhas/` | Mesma URL | Página principal | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 34 | `/contato-reecell-bombinhas/` | Mesma URL | Página principal | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 35 | `/tag/assistencia-tecnica-bombinhas/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 36 | `/tag/assistencia-tecnica-iphone/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 37 | `/tag/assistencia-tecnica-samsung/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 38 | `/tag/bateria-de-celular/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 39 | `/tag/bateria-estufada/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 40 | `/tag/bombinhas/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 41 | `/tag/celular-descarregando-rapido/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 42 | `/tag/celular-molhado/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 43 | `/tag/celular-nao-carrega/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 44 | `/tag/celular-tela-preta/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 45 | `/tag/conector-de-carga/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 46 | `/tag/consertar-celular-em-bombinhas/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 47 | `/tag/conserto-de-celular/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 48 | `/tag/conserto-de-tela/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 49 | `/tag/diagnostico-celular/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 50 | `/tag/iphone-bombinhas/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 51 | `/tag/limpeza-de-conector/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 52 | `/tag/manutencao-de-celular/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 53 | `/tag/problema-na-placa/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 54 | `/tag/reecell/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 55 | `/tag/tela-quebrada/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 56 | `/tag/troca-de-bateria/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 57 | `/tag/troca-de-conector/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 58 | `/tag/troca-de-tela-samsung/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 59 | `/tag/troca-de-tela/` | Mesma URL | Tag pública | Preservar 200 + sitemap; revisar utilidade e links (2.2) |
| 60 | `/troca-de-bateria-de-celular-em-bombinhas/` | Mesma URL | Página principal | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |
| 61 | `/troca-de-tela-de-celular-em-bombinhas/` | Mesma URL | Página principal | Preservar 200 + sitemap; avaliar desempenho; equivalente conhecido |

Arquivos envolvidos: páginas fixas em `src/pages/`; artigos em `src/content/blog/<slug>.md` e rota `src/pages/[year]/[month]/[day]/[slug].astro`; arquivos de taxonomia em `src/pages/[...legacy].astro`, `src/lib/legacy-archives.ts` e mapa legado. Os 32 arquivos são detalhados individualmente em 2.2.

### 1.3 URLs fora da cobertura principal que precisam de investigação

| URL antiga | Equivalente atual | Evidência / pendência | Recomendação |
| --- | --- | --- | --- |
| `/?p=431` | `/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/` | Equivalente comprovado pelo ID; 200 com home incorreta | Propor regra exata em etapa aprovada; preservar artigo |
| `/?p=427` | `/2026/08/04/melhores-lojas-de-celulares-em-bombinhas/` | Equivalente comprovado pelo ID; 200 com home incorreta | Mesma abordagem; nenhuma regra aplicada |
| `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/rahul-himkar-jik2tatwgfm-unsplash-2/` | `Artigo pai é candidato; equivalência não comprovada` | 404 na auditoria | Investigar conteúdo próprio e backlinks; não presumir redirect |
| `/wp-content/uploads/2026/06/rahul-himkar-jIK2TATWgFM-unsplash-1-scaled.jpg` | `Arquivo de imagem correspondente ainda a identificar` | 403 na auditoria | Identificar bloqueio e arquivo equivalente; não inventar destino |
| `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/christian-wiediger-70ku6p7kgmc-unsplash/` | `Artigo pai é candidato; equivalência não comprovada` | 404 na auditoria | Investigar conteúdo próprio e backlinks; não presumir redirect |
| `/wp-content/uploads/2026/06/christian-wiediger-70ku6P7kgmc-unsplash-scaled.jpg` | `Arquivo de imagem correspondente ainda a identificar` | 403 na auditoria | Identificar bloqueio e arquivo equivalente; não inventar destino |
| `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/ashkan-forouzani-ivhsubxpvo0-unsplash/` | `Artigo pai é candidato; equivalência não comprovada` | 404 na auditoria | Investigar conteúdo próprio e backlinks; não presumir redirect |
| `/wp-content/uploads/2026/06/ashkan-forouzani-ivHSUBXpvo0-unsplash-scaled.jpg` | `Arquivo de imagem correspondente ainda a identificar` | 403 na auditoria | Identificar bloqueio e arquivo equivalente; não inventar destino |

Também inventariar `?page_id=`, `?attachment_id=`, arquivos por ano/mês, `/page/N/` e feeds quando constarem dos dados históricos. São **padrões a pesquisar**, não URLs cuja existência foi comprovada. `/feed/` e `/wp-sitemap.xml` retornaram 404 na auditoria; o sitemap WordPress documentado é `/sitemap_index.xml`, cujo redirect já funciona. Não criar páginas de busca indexáveis nem redirects genéricos.

### 1.4 Preservar integralmente os 14 redirecionamentos existentes

| Origem | Destino imutável neste plano | Decisão |
| --- | --- | --- |
| `/author-sitemap.xml` | `/sitemap.xml` | Preservar 301 existente |
| `/category-sitemap.xml` | `/sitemap.xml` | Preservar 301 existente |
| `/home-v3/` | `/` | Preservar 301 existente |
| `/page-sitemap.xml` | `/sitemap.xml` | Preservar 301 existente |
| `/post_tag-sitemap.xml` | `/sitemap.xml` | Preservar 301 existente |
| `/post-sitemap.xml` | `/sitemap.xml` | Preservar 301 existente |
| `/sitemap_index.xml` | `/sitemap.xml` | Preservar 301 existente |
| `/tag/celular-desligando-sozinho/` | `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` | Preservar 301 existente |
| `/tag/celular-nao-liga/` | `/2026/06/08/celular-nao-liga-principais-causas/` | Preservar 301 existente |
| `/tag/conector-de-carga-com-defeito/` | `/2026/06/08/conector-de-carga-com-defeito-sinais/` | Preservar 301 existente |
| `/tag/iphone-nao-carrega/` | `/2026/06/08/iphone-nao-carrega-causas-solucoes/` | Preservar 301 existente |
| `/tag/samsung-com-tela-verde/` | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | Preservar 301 existente |
| `/tag/tela-trincada-do-celular/` | `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` | Preservar 301 existente |
| `/tag/tela-verde-samsung/` | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | Preservar 301 existente |

Todos responderam 301 e seus destinos foram verificados em 200 na auditoria. Não renomear, remover ou apontar essas origens para outro destino. `/home-v3/ → /` é equivalência específica documentada de uma home alternativa, não fallback para URLs desconhecidas. Fontes: `src/data/legacy-migration.json`, `scripts/seo-routing.mjs` e `vercel.json`.

### 1.5 Política de sitemap e indexação proposta

| Grupo / URL | Deve constar como página no sitemap? | Prioridade / ação | Risco | Arquivos envolvidos |
|---|---|---|---|---|
| Home, contato, blog e três serviços: seis URLs da tabela 1.2 | Sim | P1: preservar URLs canônicas públicas 200 | Não trocar host, slash ou caminho | `src/data/site-pages.ts`, `src/pages/sitemap.xml.ts` |
| 23 artigos legados da tabela 1.2 | Sim | P1: manter todos enquanto públicos e indexáveis | Não retirar por título longo ou sobreposição presumida | `src/lib/blog.ts`, `src/lib/permalinks.ts`, sitemap |
| 32 páginas públicas de arquivo de 2.2, incluindo paginações | Manter nesta etapa | P2: melhorar utilidade e navegação, mantendo canonical próprio | Não confundir thin content com arquivo técnico; eventual mudança futura exige análise individual | `src/lib/legacy-archives.ts`, sitemap e template de arquivo |
| Oito artigos locais de 3.1 | Não no sitemap público ainda | Só adicionar no futuro junto de publicação expressamente aprovada e URL 200 | O sitemap local já os inclui; não enviá-lo ao GSC como se fosse público | Coleção, `src/lib/blog.ts`, `src/pages/sitemap.xml.ts`, manifesto da entrega |
| 14 origens 301 da tabela 1.4 | Não | Manter apenas destinos finais que sejam páginas | Incluir fonte 301 cria sinal inconsistente | Mapa e sitemap |
| `/404/`, `/404.html`, teste inexistente e URLs 4xx/5xx | Não | Preservar fora do sitemap | Não usar sitemap para “forçar” indexação de erro | `src/pages/404.astro`, sitemap |
| `/?p=431`, `/?p=427`, queries técnicas, busca `?s=`, UTMs, aliases sem barra ou `index.html`, HTTP/www | Não como URLs separadas | Manter somente permalink canônico final | Não confundir canonical com tratamento completo de IDs antigos | `SeoHead.astro`, roteamento e sitemap |
| `/robots.txt`, `/sitemap.xml`, `/sitemap_index.xml`, sitemaps filhos e `/feed/` | Não como entradas de páginas | Robots deve indicar sitemap; sitemap antigo mantém redirect | Um índice de sitemaps pode listar XMLs, mas este sitemap de páginas não deve fazê-lo | Endpoints de robots/sitemap e regras |
| `/_astro/*`, fontes, CSS, JS, ícones e imagens avulsas | Não como entradas de páginas | Continuar acessíveis quando necessários; imagens podem usar extensão de sitemap específica futuramente | Exclusão do sitemap não significa bloqueio por robots ou noindex | `public/`, assets e sitemap |
| Documentos internos `docs/`, scripts, Markdown-fonte, arquivos `.astro/.ts/.json`, dependências | Não | Não publicar cópias de documentação técnica como páginas | Arquivo-fonte não é a URL HTML que ele gera | Configuração de build/saída e organização do repositório |
| Preview `*.vercel.app`, localhost e staging | Não no sitemap de produção | Manter separação de ambientes | Não remover proteção/noindex de preview para corrigir produção | Configuração Vercel e `astro.config.mjs` |

Sitemap é mecanismo de descoberta, não diretiva de exclusão nem garantia de indexação. Não retirar taxonomias do sitemap como substituto de uma estratégia editorial. O alvo imediato permanece **61 URLs públicas**, não 69; esse alvo deve ser revalidado antes da execução se houver publicação posterior à auditoria.

## Grupo 2 — Melhorias de SEO local em Bombinhas

### 2.1 Páginas centrais e arquitetura de links

Não criar uma nova landing page de conector neste plano. A contratação de reparo de carga fica na página existente de conserto; o artigo de conector atende a investigação do sintoma. O contexto local deve aparecer onde ajuda a solicitar atendimento, sem acrescentar “Bombinhas” artificialmente a todos os títulos informacionais.

| Problema / tema | URL central | Prioridade | Solução recomendada | Riscos | Arquivos envolvidos |
|---|---|---|---|---|---|
| Relevância da empresa e navegação | `/` | P1 | Preservar posicionamento; manter acesso direto aos três serviços, contato e blog; incluir apenas orientações locais verificadas | Reescrever home pode deslocar consultas existentes; não inserir listas de bairros sem cobertura real | `src/pages/index.astro`, `src/components/home/`, `src/data/home.ts` |
| Assistência técnica / conserto em Bombinhas | `/conserto-de-celular-em-bombinhas/` | P1 | Central comercial para avaliação; ligar guias de sintomas e escolha de assistência | Evitar duplicar o catálogo da home ou transformar todo artigo em landing page | `src/layouts/ServiceLayout.astro`, `src/data/service-pages.ts` |
| Troca de tela em Bombinhas | `/troca-de-tela-de-celular-em-bombinhas/` | P1 | Central comercial; leituras de preço, trinca, iPhone e Samsung; retorno dos artigos ao serviço | Não garantir troca como solução de todo sintoma de imagem | ServiceLayout, dados de serviços e Markdown relacionados |
| Troca de bateria em Bombinhas | `/troca-de-bateria-de-celular-em-bombinhas/` | P1 | Central comercial; guias de desgaste, desligamento e aquecimento | Não confundir falha de carga com bateria defeituosa | ServiceLayout, dados e Markdown relacionados |
| Conector de carga em Bombinhas | `/conserto-de-celular-em-bombinhas/` + `/2026/06/08/conector-de-carga-com-defeito-sinais/` | P1 | Bloco contextual de avaliação do conector no serviço, se oferta confirmada; artigo explica sinais e encaminha ao serviço | Não criar URL concorrente nem declarar limpeza/troca necessária sem diagnóstico; não alterar intenção do artigo para puramente comercial | `src/components/conversion/RepairGuidance.astro`, `src/data/service-pages.ts`, Markdown do conector |
| Contato e confiança local | `/contato-reecell-bombinhas/` | P1 | Conferir nome/endereço/telefone/horários com a empresa e Perfil da Empresa; manter WhatsApp e rota até a loja | Não inventar horários, estacionamento, coordenadas ou atendimento em toda a região | `src/data/business.ts`, página de contato, `LocationMap.astro`, `src/lib/structured-data.ts` |
| Descoberta de temas | `/blog/` e 32 arquivos de 2.2 | P1/P2 | Organizar entrada por assunto e arquivos úteis; manter todos os artigos acessíveis | Não promover 25 tags quase iguais no menu global | `src/pages/blog/index.astro`, template de arquivos e BlogLayout |
| Evidência local incompleta | Páginas principais e Perfil da Empresa, URL oficial ainda a confirmar | P2 | Planejar conferência do perfil, categoria real, horário especial, fotos autênticas, autoria e perfis oficiais; preencher schema só após comprovação | Não fabricar avaliações, fotos ou schema de nota; perfil externo não foi auditado nem alterado | `business.ts`, `structured-data.ts`, componentes locais; perfil externo somente em etapa autorizada |

**Papel de home e serviço:** home apresenta a empresa; serviço de conserto explica avaliação/contratação. Não trocar automaticamente seus títulos para a mesma expressão exata. Os artigos informacionais devem ajudar a decidir e preparar a consulta, preservando seus assuntos específicos.

### Links concretos a implementar em uma etapa aprovada

| Origem comercial → artigo público | Âncora no serviço | Retorno artigo → serviço | Prioridade / arquivos |
| --- | --- | --- | --- |
| `/conserto-de-celular-em-bombinhas/` → `/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/` | quando procurar assistência | avaliação de celular em Bombinhas → `/conserto-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar.md` |
| `/conserto-de-celular-em-bombinhas/` → `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` | como escolher assistência com segurança | consultar o conserto na ReeCell → `/conserto-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/onde-consertar-celular-em-bombinhas-com-seguranca.md` |
| `/conserto-de-celular-em-bombinhas/` → `/2026/06/08/celular-nao-liga-principais-causas/` | celular não liga: causas e avaliação | avaliação do celular que não liga → `/conserto-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/celular-nao-liga-principais-causas.md` |
| `/troca-de-tela-de-celular-em-bombinhas/` → `/2026/06/08/tela-de-celular-bombinhas/` | o que influencia o preço da troca de tela | troca de tela de celular em Bombinhas → `/troca-de-tela-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/tela-de-celular-bombinhas.md` |
| `/troca-de-tela-de-celular-em-bombinhas/` → `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` | cuidados com a tela trincada | consultar a avaliação da tela → `/troca-de-tela-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar.md` |
| `/troca-de-tela-de-celular-em-bombinhas/` → `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/` | iPhone com tela quebrada: vale consertar? | avaliação para troca de tela em Bombinhas → `/troca-de-tela-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/iphone-com-tela-quebrada-em-bombinhas.md` |
| `/troca-de-tela-de-celular-em-bombinhas/` → `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` | tela verde no Samsung: o que observar | consultar a avaliação da tela → `/troca-de-tela-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/samsung-com-tela-verde-o-que-pode-ser.md` |
| `/troca-de-bateria-de-celular-em-bombinhas/` → `/2026/06/08/troca-de-bateria-de-celular-sinais/` | sinais de desgaste da bateria | troca de bateria em Bombinhas → `/troca-de-bateria-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/troca-de-bateria-de-celular-sinais.md` |
| `/troca-de-bateria-de-celular-em-bombinhas/` → `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` | desligamento: bateria, sistema ou placa? | consultar a avaliação da bateria, quando indicada → `/troca-de-bateria-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/celular-desligando-sozinho-bateria-sistema-placa.md` |
| `/troca-de-bateria-de-celular-em-bombinhas/` → `/2026/06/16/celular-esquentando-muito/` | celular esquentando: causas e cuidados | avaliação da bateria e do aparelho → `/troca-de-bateria-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/celular-esquentando-muito.md` |
| `/conserto-de-celular-em-bombinhas/` → `/2026/06/08/conector-de-carga-com-defeito-sinais/` | sinais de defeito no conector de carga | avaliação do conector de carga em Bombinhas → `/conserto-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/conector-de-carga-com-defeito-sinais.md` |
| `/conserto-de-celular-em-bombinhas/` → `/2026/06/08/iphone-nao-carrega-causas-solucoes/` | iPhone não carrega: o que verificar | avaliação de falhas de carregamento → `/conserto-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/iphone-nao-carrega-causas-solucoes.md` |
| `/conserto-de-celular-em-bombinhas/` → `/2026/06/15/celular-carregando-lentamente/` | carregamento lento: carregador ou aparelho? | consultar avaliação de carga na ReeCell → `/conserto-de-celular-em-bombinhas/` | P1; ServiceLayout + dados do serviço + `src/content/blog/celular-carregando-lentamente.md` |

**Links entre guias:** `/2026/06/08/iphone-nao-carrega-causas-solucoes/` e `/2026/06/15/celular-carregando-lentamente/` → `/2026/06/08/conector-de-carga-com-defeito-sinais/` quando houver contexto de encaixe/conexão; guia de conector → guia de carga lenta para diferenciar sintomas. `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` → `/2026/06/08/troca-de-bateria-de-celular-sinais/` para sinais de desgaste. Serviço de conserto → tela/bateria somente em trechos de sintomas correspondentes, e esses serviços → contato para endereço/atendimento. Não apresentar conector como sinônimo de bateria.

Para cada grupo, começar com poucas leituras realmente úteis no serviço e um link contextual de retorno no artigo. Usar `<a href>` com URL final, sem tracking interno ou `nofollow`. Links de menu e WhatsApp continuam, mas não substituem o elo temático. `relatedServices` existe no schema e não é consumido atualmente; avaliar usá-lo para relações explícitas. Relações entre artigos devem priorizar sintoma/intenção, com categoria apenas como fallback. Não usar a mesma âncora comercial em todo parágrafo.

**Critério:** manter a home a um clique dos serviços e permitir que o usuário chegue a guias principais pelo serviço/blog. Páginas de arquivo aprovadas para destaque devem ter pelo menos uma entrada contextual real. Não criar links públicos para os oito artigos ainda ausentes da produção.

### 2.2 Os 32 arquivos desconectados: todos são páginas públicas

“Arquivo” aqui significa **archive do WordPress**, uma página HTML de listagem. **32 públicos, zero apenas internos.** São 25 tags, quatro páginas de categoria e três de autor; todos responderam 200 na auditoria. Vinte e seis não recebiam link de outra página; as seis páginas de autor/categoria paginados tinham links dentro dos grupos, mas os grupos estavam isolados da home.

As entradas abaixo são **recomendações**, não links já existentes. P1 destaca categorias úteis para o usuário local. Nas tags redundantes, P2 condiciona o link a conteúdo próprio que justifique sua existência como destino. Não colocar todas em menus/rodapés nem criar uma seção repetitiva “assuntos” com muitos sinônimos do mesmo artigo.

**Arquivos envolvidos em cada linha (AR):** `src/pages/[...legacy].astro`, `src/lib/legacy-archives.ts`, `src/data/legacy-migration.json` (preservar histórico), `src/pages/blog/index.astro`, `src/layouts/BlogLayout.astro` e `src/content/blog/<slug do artigo de origem>.md` quando houver link no corpo. Novo dado editorial deve ser separado do inventário histórico quando apropriado. Risco comum: aumentar repetição e competição com serviço/artigo sem oferecer utilidade adicional.

| URL / problema: isolamento | Classificação | Prioridade | Links e solução recomendados | Riscos | Arquivos |
| --- | --- | --- | --- | --- | --- |
| `/author/gabriel-souza/` | Pública; author; 10 artigo(s) | P2 | `/blog/` → esta URL; esta URL → `/author/gabriel-souza/page/2/`. Link de autoria a partir de artigos somente após confirmar autor; blog pode apresentar índice de autores | Não inventar autoria; listas iguais às categorias não justificam texto repetido | AR |
| `/author/gabriel-souza/page/2/` | Pública; author; 10 artigo(s) | P2 | `/author/gabriel-souza/` → esta URL; esta URL → `/author/gabriel-souza/page/3/`. Preservar navegação anterior/próxima e retorno ao autor; sem adicionar no menu global | Não inventar autoria; listas iguais às categorias não justificam texto repetido | AR |
| `/author/gabriel-souza/page/3/` | Pública; author; 3 artigo(s) | P2 | `/author/gabriel-souza/page/2/` → esta URL; esta URL → `/author/gabriel-souza/`. Preservar navegação anterior/próxima e retorno ao autor; sem adicionar no menu global | Não inventar autoria; listas iguais às categorias não justificam texto repetido | AR |
| `/category/uncategorized/` | Pública; category; 10 artigo(s) | P2 | `/blog/` → esta URL; esta URL → `/category/uncategorized/page/2/`. Link secundário Arquivo de artigos no blog; manter slug uncategorized, sem promover como serviço | Evitar duplicar blog/autor ou tratar paginação como landing local | AR |
| `/category/uncategorized/assistencia-tecnica/` | Pública; category; 9 artigo(s) | P1 | `/blog/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Índice de guias de assistência, com entrada editorial no blog | Evitar duplicar blog/autor ou tratar paginação como landing local | AR |
| `/category/uncategorized/page/2/` | Pública; category; 10 artigo(s) | P2 | `/category/uncategorized/` → esta URL; esta URL → `/category/uncategorized/page/3/`. Preservar paginação e retorno ao índice; manter membros históricos | Evitar duplicar blog/autor ou tratar paginação como landing local | AR |
| `/category/uncategorized/page/3/` | Pública; category; 3 artigo(s) | P2 | `/category/uncategorized/page/2/` → esta URL; esta URL → `/category/uncategorized/`. Preservar paginação e retorno ao índice; manter membros históricos | Evitar duplicar blog/autor ou tratar paginação como landing local | AR |
| `/tag/assistencia-tecnica-bombinhas/` | Pública; tag; 4 artigo(s) | P1 | `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Organizar guias de avaliação local, distintos da contratação | Repetição/canibalização se funcionar como segunda landing | AR |
| `/tag/assistencia-tecnica-iphone/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/iphone-nao-carrega-causas-solucoes/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Ampliar curadoria real de iPhone antes de destacar; não alegar assistência autorizada | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/assistencia-tecnica-samsung/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` → esta URL; esta URL → `/troca-de-tela-de-celular-em-bombinhas/`. Curadoria Samsung, sem atribuir todo defeito à tela | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/bateria-de-celular/` | Pública; tag; 2 artigo(s) | P1 | `/2026/06/08/troca-de-bateria-de-celular-sinais/` → esta URL; esta URL → `/troca-de-bateria-de-celular-em-bombinhas/`. Arquivo principal de orientações de bateria; manter distinção do serviço | Repetição/canibalização se funcionar como segunda landing | AR |
| `/tag/bateria-estufada/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/troca-de-bateria-de-celular-sinais/` → esta URL; esta URL → `/troca-de-bateria-de-celular-em-bombinhas/`. Orientação específica ao sintoma, sem repetir arquivo de troca | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/bombinhas/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Lista atual só de Samsung não representa Bombinhas; rever curadoria antes de linkar do blog local | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/celular-descarregando-rapido/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/troca-de-bateria-de-celular-sinais/` → esta URL; esta URL → `/troca-de-bateria-de-celular-em-bombinhas/`. Delimitar autonomia versus defeito confirmado de bateria | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/celular-molhado/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Curar guias de água e praia; lista atual só de celular que não liga é insuficiente | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/celular-nao-carrega/` | Pública; tag; 1 artigo(s) | P1 | `/2026/06/08/conector-de-carga-com-defeito-sinais/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Curadoria de falhas de carga com diferenciação de sintomas | Repetição/canibalização se funcionar como segunda landing | AR |
| `/tag/celular-tela-preta/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/celular-nao-liga-principais-causas/` → esta URL; esta URL → `/troca-de-tela-de-celular-em-bombinhas/`. Distinguir falta de imagem de aparelho desligado; não prometer troca | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/conector-de-carga/` | Pública; tag; 1 artigo(s) | P1 | `/2026/06/08/conector-de-carga-com-defeito-sinais/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Curar guia genérico de conector além do iPhone; preservar artigos históricos | Repetição/canibalização se funcionar como segunda landing | AR |
| `/tag/consertar-celular-em-bombinhas/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Arquivo de escolha do atendimento; evitar outra landing comercial | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/conserto-de-celular/` | Pública; tag; 2 artigo(s) | P1 | `/2026/06/08/celular-nao-liga-principais-causas/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Seleção de guias de sintomas e decisão, não duplicação do serviço | Repetição/canibalização se funcionar como segunda landing | AR |
| `/tag/conserto-de-tela/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` → esta URL; esta URL → `/troca-de-tela-de-celular-em-bombinhas/`. Separar papel editorial das tags tela quebrada/troca de tela antes de destacar | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/diagnostico-celular/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Organizar observações para avaliação, sem diagnóstico automático | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/iphone-bombinhas/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/` → esta URL; esta URL → `/troca-de-tela-de-celular-em-bombinhas/`. Curadoria local de iPhone; lista atual só de carga exige revisão | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/limpeza-de-conector/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/conector-de-carga-com-defeito-sinais/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Explicar avaliação profissional; não promover limpeza doméstica invasiva | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/manutencao-de-celular/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Delimitar manutenção e prevenção sem repetir escolha de assistência | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/problema-na-placa/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Evitar inferir placa defeituosa pelo sintoma; melhorar utilidade antes de linkar | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/reecell/` | Pública; tag; 2 artigo(s) | P2 | `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` → esta URL; esta URL → `/contato-reecell-bombinhas/`. Arquivo de marca só após curadoria; home/contato continuam principais para marca | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/tela-quebrada/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` → esta URL; esta URL → `/troca-de-tela-de-celular-em-bombinhas/`. Delimitar dano físico; não repetir três arquivos de tela idênticos | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/troca-de-bateria/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/troca-de-bateria-de-celular-sinais/` → esta URL; esta URL → `/troca-de-bateria-de-celular-em-bombinhas/`. Leituras de decisão sobre troca, mantendo página de serviço como destino comercial | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/troca-de-conector/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/conector-de-carga-com-defeito-sinais/` → esta URL; esta URL → `/conserto-de-celular-em-bombinhas/`. Orientações sobre avaliação para troca; confirmar serviço antes de prometer execução | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/troca-de-tela-samsung/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/` → esta URL; esta URL → `/troca-de-tela-de-celular-em-bombinhas/`. Manter recorte Samsung e diferenciar arquivo de assistência Samsung | Só linkar após utilidade distinta; não inflar links sinônimos | AR |
| `/tag/troca-de-tela/` | Pública; tag; 1 artigo(s) | P2 | `/2026/06/08/tela-de-celular-bombinhas/` → esta URL; esta URL → `/troca-de-tela-de-celular-em-bombinhas/`. Curadoria de custo e decisão; ampliar utilidade além do artigo de trinca | Só linkar após utilidade distinta; não inflar links sinônimos | AR |

#### O que é interno, então?

| Arquivo/pasta do projeto | Natureza | Relação com o público | Recomendação |
|---|---|---|---|
| `docs/auditoria-conteudo/`, `docs/seo-migration/`, `docs/blog-source/` e relatórios `.md` na raiz | Documentação e evidências internas | Não são as 32 páginas de arquivo | Fora do sitemap; não criar links na navegação pública |
| `src/data/legacy-migration.json` | Dados internos | Define membros e tratamentos das URLs antigas | Não indexar o JSON como substituto de página |
| `src/pages/[...legacy].astro` e `src/lib/legacy-archives.ts` | Template e lógica internos | Geram as 32 páginas públicas | Melhorar o resultado HTML; não apontar links ao arquivo-fonte |
| `src/content/blog/*.md` | Fontes internas | Geram os permalinks de artigos quando elegíveis | Sitemap recebe URL HTML publicada, nunca caminho `.md` |
| `scripts/`, `.git/`, `node_modules/`, `.astro/` | Ferramentas, versionamento, dependências e cache | Não são páginas comerciais/editoriais | Não incluir no deploy público como conteúdo |
| `dist/tag/.../index.html`, `dist/category/.../index.html`, `dist/author/.../index.html` | Artefatos de build local | Cópias das páginas a publicar, não arquivos privados só por estarem em `dist` | Auditar URL pública correspondente; não editar `dist` manualmente |

## Grupo 3 — Otimizações de conteúdo

### 3.1 Oito artigos locais: intenção, conflitos e condição de uso

**Não publicar.** Todos têm permalink de 06/10/2026, texto com acentos corrompidos e `draft: false`. Os títulos na coluna “atual” transcrevem o frontmatter, incluindo `?` reais. A forma legível indicada é proposta documental; o arquivo não foi corrigido. Nenhuma intenção foi validada por volume ou SERP nesta etapa.

**Arquivos de cada linha:** `src/content/blog/<slug>.md`; lógica comum em `src/content.config.ts`, `src/lib/blog.ts` e `src/layouts/BlogLayout.astro`. Risco transversal: publicar corrupção textual, links para outros artigos ainda ausentes e expansão redundante do conteúdo.

| Título atual → forma legível proposta | Slug e URL preservados | Intenção de busca | Conflito / URLs existentes | Prioridade e solução | Arquivos |
| --- | --- | --- | --- | --- | --- |
| Celular n?o reconhece chip: o que verificar antes do conserto → Celular não reconhece chip: o que verificar antes do conserto | `celular-nao-reconhece-chip`; `/2026/10/06/celular-nao-reconhece-chip/` | Informacional: SIM/eSIM não reconhecido, identificação e ativação | Médio com o outro novo; baixo com conserto geral: `/2026/10/06/celular-sem-sinal-ou-sem-rede/`; `/conserto-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Separar Sem SIM de linha reconhecida sem serviço. Confirmar operadora antes da avaliação; encaminhar ao conserto local. Não publicar. | `src/content/blog/celular-nao-reconhece-chip.md` |
| Celular sem sinal ou sem rede: operadora ou aparelho? → Celular sem sinal ou sem rede: operadora ou aparelho? | `celular-sem-sinal-ou-sem-rede`; `/2026/10/06/celular-sem-sinal-ou-sem-rede/` | Informacional: linha reconhecida, mas sem cobertura/serviço | Médio entre os dois novos; baixo com páginas comerciais: `/2026/10/06/celular-nao-reconhece-chip/`; `/conserto-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Focar perda de serviço e verificações da operadora; não prometer corrigir cobertura em Bombinhas. Não publicar. | `src/content/blog/celular-sem-sinal-ou-sem-rede.md` |
| Celular travando muito: como separar lentid?o e falha no toque → Celular travando muito: como separar lentidão e falha no toque | `celular-travando-muito`; `/2026/10/06/celular-travando-muito/` | Informacional: lentidão/congelamento com aparelho ligado | Médio; também se aproxima do novo touch: `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/`; `/conserto-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Manter lentidão/sistema distintos de desligamento e falha de toque; linkar ao diagnóstico geral. Não publicar. | `src/content/blog/celular-travando-muito.md` |
| Quanto tempo demora para consertar um celular? Entenda as etapas → Quanto tempo demora para consertar um celular? Entenda as etapas | `quanto-tempo-demora-consertar-celular`; `/2026/10/06/quanto-tempo-demora-consertar-celular/` | Informacional pré-contratação: etapas e previsão de prazo | Médio com dúvidas do serviço e artigo quando procurar: `/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/`; `/conserto-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Explicar avaliação, peças, aprovação e testes; não prometer prazo fixo ou no mesmo dia. Não publicar. | `src/content/blog/quanto-tempo-demora-consertar-celular.md` |
| Tela do celular com manchas pretas, roxas ou linhas: como avaliar → Tela do celular com manchas pretas, roxas ou linhas: como avaliar | `tela-do-celular-com-manchas-ou-linhas`; `/2026/10/06/tela-do-celular-com-manchas-ou-linhas/` | Informacional: manchas/linhas na imagem de diferentes aparelhos | Médio-alto com Samsung, trinca e serviço de tela: `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/`; `/troca-de-tela-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Manter sinais visuais genéricos; Samsung conserva recorte de marca/tela verde. Não criar guia de preço concorrente. Não publicar. | `src/content/blog/tela-do-celular-com-manchas-ou-linhas.md` |
| Tela do celular piscando: o que observar antes do reparo → Tela do celular piscando: o que observar antes do reparo | `tela-do-celular-piscando`; `/2026/10/06/tela-do-celular-piscando/` | Informacional: oscilação/intermitência da imagem | Médio com Samsung e novo manchas/linhas: `/2026/06/08/samsung-com-tela-verde-o-que-pode-ser/`; `/troca-de-tela-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Focar intermitência e observações; diferenciar mancha fixa, tela preta e falha de aplicativo. Não publicar. | `src/content/blog/tela-do-celular-piscando.md` |
| Touch do celular n?o funciona: imagem normal, mas sem resposta → Touch do celular não funciona: imagem normal, mas sem resposta | `touch-do-celular-nao-funciona`; `/2026/10/06/touch-do-celular-nao-funciona/` | Informacional: perda total/parcial do toque com imagem presente | Médio-alto com trinca, serviço de tela e novo lentidão: `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/`; `/troca-de-tela-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Definir toque versus imagem e sistema; não exigir vidro quebrado nem virar catálogo de troca. Não publicar. | `src/content/blog/touch-do-celular-nao-funciona.md` |
| Vale a pena consertar um celular antigo? Como decidir → Vale a pena consertar um celular antigo? Como decidir | `vale-a-pena-consertar-celular-antigo`; `/2026/10/06/vale-a-pena-consertar-celular-antigo/` | Investigação comercial: reparar ou substituir um aparelho antigo | Médio com vale consertar iPhone e FAQ do serviço: `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/`; `/conserto-de-celular-em-bombinhas/` | P1 integridade; P2 decisão editorial. Decisão geral por orçamento, estado e uso; iPhone preserva recorte modelo/tela. Não inventar percentual de custo ou vida útil. Não publicar. | `src/content/blog/vale-a-pena-consertar-celular-antigo.md` |

**Ordem editorial sugerida:** primeiro prazo e decisão de reparo, pela utilidade na conversão e dúvidas de atendimento; depois sintomas de tela, após delimitar diferenças com trinca/Samsung; por fim rede/chip e lentidão. Isso é prioridade de revisão, **não calendário de publicação**. Os pares que se interligam devem ser planejados juntos; uma eventual publicação parcial não pode deixar links para os demais 404. Se um artigo não demonstrar diferença suficiente, mantê-lo sem publicação e reavaliar o escopo, sem excluir arquivo ou alterar URL.

### 3.2 Os 18 títulos públicos longos: propostas individuais

O corpo, H1, slug e permalink devem permanecer na primeira rodada. Propor `seoTitle` opcional com fallback ao título atual, usado consistentemente em `<title>` e metadados sociais; não concatenar a marca duas vezes. `Article.headline` pode continuar refletindo o título editorial visível. Esta mudança de modelo só será implementada após aprovação.

Os títulos sugeridos preservam o assunto e qualificadores importantes. Não transformar todo título em “Assistência em Bombinhas”; guias genéricos têm intenção informacional própria. Nas URLs já locais, preservar Bombinhas. O foco é concisão e clareza, não atingir um número rígido de caracteres.

**Arquivos comuns (TI):** `src/content.config.ts`, `src/layouts/BlogLayout.astro`; arquivo específico indicado em cada linha. **Risco comum:** mudança de CTR/consultas e reescrita do título pelo Google. Antes de aplicar, verificar consultas e impressões da URL; se o título atual sustentar tráfego relevante, considerar mantê-lo mesmo sendo longo. Sugestões não são garantia de melhor ranking.

| URL | Título atual completo | Sugestão otimizada completa | Caracteres atual → proposta | Prioridade / preservação de intenção | Arquivos |
| --- | --- | --- | --- | --- | --- |
| `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` | Celular caiu na água: o que fazer antes de levar na assistência? \| ReeCell | Celular caiu na água: o que fazer? \| ReeCell | 74 → 44 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/celular-caiu-na-agua-o-que-fazer.md` + TI |
| `/2026/06/08/celular-desligando-sozinho-bateria-sistema-placa/` | Celular desligando sozinho: é bateria, sistema ou placa? \| ReeCell | Celular desligando sozinho: bateria, sistema ou placa? | 66 → 54 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/celular-desligando-sozinho-bateria-sistema-placa.md` + TI |
| `/2026/06/08/celular-nao-liga-principais-causas/` | Celular não liga: principais causas e quando procurar assistência \| ReeCell | Celular não liga: causas e quando buscar assistência | 75 → 52 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/celular-nao-liga-principais-causas.md` + TI |
| `/2026/06/08/conector-de-carga-com-defeito-sinais/` | Conector de carga com defeito: sinais de que precisa trocar \| ReeCell | Conector de carga com defeito: sinais de troca \| ReeCell | 69 → 56 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/conector-de-carga-com-defeito-sinais.md` + TI |
| `/2026/06/08/tela-de-celular-bombinhas/` | Quanto custa trocar a tela do celular em Bombinhas? Veja o que influencia no valor \| ReeCell | Quanto custa trocar a tela do celular em Bombinhas? | 92 → 51 | P2; preservar intenção local em Bombinhas; comparar GSC antes de aplicar | `src/content/blog/tela-de-celular-bombinhas.md` + TI |
| `/2026/06/08/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar/` | Tela trincada do celular: posso continuar usando ou devo trocar? \| ReeCell | Tela trincada do celular: usar ou trocar? \| ReeCell | 74 → 51 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar.md` + TI |
| `/2026/06/08/troca-de-bateria-de-celular-sinais/` | Troca de bateria de celular: sinais de que está na hora \| ReeCell | Troca de bateria de celular: quando fazer? \| ReeCell | 65 → 52 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/troca-de-bateria-de-celular-sinais.md` + TI |
| `/2026/06/15/celular-carregando-lentamente/` | Celular Carregando Lentamente: Carregador ou Aparelho? \| ReeCell | Celular carregando lentamente: carregador ou aparelho? | 64 → 54 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/celular-carregando-lentamente.md` + TI |
| `/2026/06/15/celular-molhou-na-praia/` | Celular Molhou na Praia: O Que Fazer Para Evitar Perda Total \| ReeCell | Celular molhou na praia: o que fazer? \| ReeCell | 70 → 47 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/celular-molhou-na-praia.md` + TI |
| `/2026/06/15/iphone-com-tela-quebrada-em-bombinhas/` | iPhone com Tela Quebrada em Bombinhas: Vale Consertar? \| ReeCell | iPhone com tela quebrada em Bombinhas: vale consertar? | 64 → 54 | P2; preservar intenção local em Bombinhas; comparar GSC antes de aplicar | `src/content/blog/iphone-com-tela-quebrada-em-bombinhas.md` + TI |
| `/2026/06/16/assistencia-tecnica-celular-bombinhas/` | Assistência técnica de celular em Bombinhas: serviços e avaliação \| ReeCell | Assistência técnica de celular em Bombinhas: avaliação | 75 → 54 | P2; preservar intenção local em Bombinhas; comparar GSC antes de aplicar | `src/content/blog/assistencia-tecnica-celular-bombinhas.md` + TI |
| `/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/` | Assistência Técnica de Celular Confiável em Bombinhas \| ReeCell | Assistência técnica de celular confiável em Bombinhas | 63 → 53 | P2; preservar intenção local em Bombinhas; comparar GSC antes de aplicar | `src/content/blog/assistencia-tecnica-de-celular-confiavel-em-bombinhas.md` + TI |
| `/2026/06/16/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar/` | Assistência Técnica para Celular em Bombinhas: Quando Procurar? \| ReeCell | Assistência técnica de celular em Bombinhas: quando buscar? | 73 → 59 | P2; preservar intenção local em Bombinhas; comparar GSC antes de aplicar | `src/content/blog/assistencia-tecnica-para-celular-em-bombinhas-quando-procurar.md` + TI |
| `/2026/06/16/botao-power-ou-volume-parou-de-funcionar/` | Botão Power ou Volume Parou de Funcionar: Tem Conserto? \| ReeCell | Botão Power ou Volume parou de funcionar: tem conserto? | 65 → 55 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/botao-power-ou-volume-parou-de-funcionar.md` + TI |
| `/2026/06/16/camera-do-celular-embacada-ou-tremendo/` | Câmera do Celular Embaçada ou Tremendo: O Que Pode Ser? \| ReeCell | Câmera do celular embaçada ou tremendo: causas \| ReeCell | 65 → 56 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/camera-do-celular-embacada-ou-tremendo.md` + TI |
| `/2026/06/16/celular-esquentando-muito/` | Celular Esquentando Muito: Causas e Riscos Para o Aparelho \| ReeCell | Celular esquentando muito: causas e riscos \| ReeCell | 68 → 52 | P2; preservar sintoma e dúvida original; comparar GSC antes de aplicar | `src/content/blog/celular-esquentando-muito.md` + TI |
| `/2026/06/16/como-proteger-seu-celular-em-bombinhas/` | Como Proteger Seu Celular em Bombinhas: Película e Capinha \| ReeCell | Proteger celular em Bombinhas: película e capinha \| ReeCell | 68 → 59 | P2; preservar intenção local em Bombinhas; comparar GSC antes de aplicar | `src/content/blog/como-proteger-seu-celular-em-bombinhas.md` + TI |
| `/2026/08/04/melhores-assistencias-tecnicas-de-celular-em-bombinhas/` | Melhores assistências técnicas de celular em Bombinhas \| ReeCell | Melhores assistências técnicas de celular em Bombinhas | 64 → 54 | P2; preservar intenção local em Bombinhas; comparar GSC antes de aplicar | `src/content/blog/melhores-assistencias-tecnicas-de-celular-em-bombinhas.md` + TI |

### 3.3 Outras otimizações editoriais, sem reescrita em massa

| Problema | URL / escopo | Prioridade | Solução recomendada | Riscos | Arquivos envolvidos |
|---|---|---|---|---|---|
| Tags com pouco valor próprio | 25 URLs de 2.2; 21 têm um artigo | P2 | Curadoria temática e orientação exclusiva; não apenas meta description maior | Conteúdo artificial pode ampliar duplicação; não aplicar noindex nem consolidar automaticamente | AR; dados editoriais dedicados se aprovados |
| Sobreposição de água e praia | `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` e `/2026/06/15/celular-molhou-na-praia/` | P2 | Manter primeiro como cuidados gerais e segundo focado no contexto de praia/água salgada; revisar escopo com consultas reais | Não mover trechos valiosos nem redirecionar um ao outro sem análise específica | Dois Markdown, mapa de relacionados |
| Sobreposição de escolha de assistência | `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` e `/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/` | P2 investigação | Comparar consultas e conteúdo antes de mudar; preservar ambos enquanto não houver proposta justificada | Não inventar distinção editorial apenas para justificar páginas repetidas | Dois Markdown e GSC |
| Artigo e serviço têm intenção próxima | `/2026/06/16/assistencia-tecnica-celular-bombinhas/` e `/conserto-de-celular-em-bombinhas/` | P2 | Artigo orienta entendimento/avaliação; serviço concentra contratação, contato e condições verificadas | Não reduzir cobertura que já atrai consultas; evitar títulos comerciais idênticos | Markdown, ServiceLayout e dados de serviço |
| Autoria incompleta no schema | 23 artigos públicos e oito locais | P2 | Confirmar autor/organização responsável, mostrar autoria e marcar de forma coerente | Não presumir autor pelo nome do arquivo legado | `BlogLayout.astro`, `content.config.ts`, `structured-data.ts` |
| Imagens editoriais/identidade local incompletas | Artigos sem `Article.image` e páginas institucionais | P2 | Usar apenas imagens relevantes disponíveis e fotos reais aprovadas; validar alt e schema | Não usar fachada como prova de reparo ou inventar foto/resultado | Frontmatter, assets reais, `business.ts`, layouts |

## Sequência de execução futura e critérios de aprovação

| Etapa | Grupo | Entrega para revisão | Dependência | Critério de aceite |
|---|---|---|---|---|
| 0 — Baseline e proteção | Técnico | Matriz GSC por URL, lista de páginas sensíveis, mapa 61 + 14 e manifesto do release | Exportações/conta correta; nenhuma alteração necessária | Identificar URLs de erro e registrar métricas sem pressupor causas |
| 1 — Lacunas de migração | Técnico | Proposta exata de IDs/anexos/mídias e testes de regressão | Etapa 0 e aprovação de cada tratamento | Sem alteração das 61 URLs/14 pares; destino equivalente, sem home genérica |
| 2 — Navegação local | SEO local | Diff pequeno de links em serviços/blog e entrada para arquivos úteis | Baseline e aprovação da arquitetura | Links finais 200; serviço e guia com papéis claros; nenhum link aos oito não publicados |
| 3 — Metadados e arquivos | Conteúdo | Primeira amostra pequena de títulos e taxonomias, com justificativa por URL | Dados de consultas/CTR e revisão editorial | H1/corpo/URL preservados inicialmente; sem noindex/canonical cruzado automático |
| 4 — Conteúdo não publicado | Conteúdo | Oito textos restaurados e análise final de sobreposição, em lote separado | Fonte íntegra e aprovação editorial individual | Sem corrupção; links dependentes resolvidos; continuar sem publicação até autorização |
| 5 — Validação de release | Técnico | Build, verificação e comparação de manifesto em ambiente isolado, quando autorizados | Aprovação da implementação e escopo de publicação | Nenhum artigo não aprovado incluído, sitemap coerente, links/redirects/canonicals corretos |
| 6 — Monitoramento após eventual publicação | Todos | Relatório em 7, 14 e 28 dias e comparação de períodos completos | Publicação autorizada em outro momento | Investigar queda sustentada por URL/consulta; não atribuir variação diária isolada à mudança |

Hoje, a única entrega é este plano. Nenhuma etapa de implementação, teste que gere build, alteração externa ou deploy foi executada neste pedido.

### Como reduzir o risco aos rankings

- Fazer lotes pequenos e registrar qual hipótese cada lote testa. Não mudar título, corpo, arquitetura e canonical da mesma página simultaneamente.
- Definir com o negócio uma tolerância de variação usando o baseline, volume e sazonalidade; não inventar percentual universal de “queda aceitável”.
- Se houver regressão consistente após mudança, verificar disponibilidade, indexação e consultas antes de atribuir causalidade; manter diff reversível para restaurar somente o lote afetado.
- Métricas de sucesso: manutenção de URLs que já recebem cliques, cobertura das páginas prioritárias, redução de erros nas URLs realmente úteis, melhoria de descoberta e consultas/conversões locais. “Zerar todos os 404” e “indexar toda tag” não são metas obrigatórias.

## Referências e limites

- [Auditoria do projeto](AUDITORIA-SEO-REECELL.md): fonte dos status, contagens, lacunas e limites de acesso.
- `src/data/legacy-migration.json`: inventário de 61 preservações e 14 redirects; nenhuma alteração realizada.
- `src/content/blog/`: títulos, slugs, escopos e conflitos dos oito textos locais; leitura atual do checkout.
- [Google: títulos nos resultados](https://developers.google.com/search/docs/appearance/title-link): recomenda concisão, títulos distintos e evita excesso de palavras-chave; não define limite rígido de caracteres.
- [Google: classificação local](https://support.google.com/business/answer/7091?hl=pt-BR): relevância, distância e destaque participam dos resultados locais; informações comerciais precisas ajudam a representar o negócio. O plano não promete controlar distância ou garantir posições.

Não houve nova medição de rankings, tráfego ou indexação. As propostas preservam a separação entre código local, conteúdo aprovado, publicação e evidência pública.
