# Auditoria de conteúdo — fase 1

Data: 06/10/2026. Escopo: checkout local e HTML gerado nesta auditoria. Nenhum artigo, serviço, URL ou redirect foi criado ou alterado.

## Entregas

- [Matriz das 15 keywords](matriz-keywords.md): URL principal candidata, slug, title, H1, sobreposição, status, ação e conteúdos relacionados.
- [Inventário completo em CSV](inventario.csv): todas as páginas HTML, incluindo arquivos e 404.
- [Inventário detalhado em JSON](inventario.json): inclui conteúdo principal, headings e links internos para rastrear as conclusões.
- [Redirecionamentos já existentes](redirecionamentos-existentes.csv): separado de propostas futuras.

## Cobertura e método

23 artigos, 6 páginas principais (home, blog, contato e 3 serviços), 32 arquivos de tags/categorias/autor/paginação: 61 URLs no sitemap. A 404 foi inventariada separadamente, totalizando 62 HTMLs. Há 14 redirecionamentos no mapa legado, incluindo recursos técnicos; eles não são 14 artigos duplicados.

Foram extraídos title e H1 do build atual e lidos frontmatters, aberturas, seções e conteúdos dos grupos relacionados. A análise considera o problema que o leitor quer resolver, não apenas palavras no slug. O JSON preserva o texto principal completo para conferência; elementos de navegação e leituras relacionadas dentro do main não constituem conteúdo original do artigo.

Keywords de artigos vêm do campo primaryKeyword; nas demais páginas são inferidas. “Já existe e está boa” significa cobertura editorial suficiente para a intenção examinada, não certificação de precisão técnica, ranking ou desempenho comercial. “Há canibalização” nas tabelas é a categoria solicitada para **potencial conflito editorial**, não perda de ranking comprovada. A sobreposição é qualitativa. Esta auditoria não consultou SERPs, métricas, backlinks ou dados atuais de Search Console.

## Sobreposições prioritárias

### Água e mar

Principal provisória: `/2026/06/08/celular-caiu-na-agua-o-que-fazer/`.

Candidata à consolidação: `/2026/06/15/celular-molhou-na-praia/`.

Ambos ensinam primeiros cuidados, proíbem práticas semelhantes, tratam água salgada, funcionamento após molhar e urgência da avaliação. O artigo geral já tem seção de água do mar. Incorporar nele os detalhes de areia e resistência à água da outra URL. A seleção da principal decorre da abrangência do conteúdo, não de autoridade presumida pela data.

### Escolha de assistência confiável

Principal provisória: `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/`.

Candidata à consolidação: `/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/`.

Os dois explicam diagnóstico, orçamento, peças, garantia e cuidados para escolher o prestador. A diferença de redação não demonstra intenção distinta. Incorporar à principal os critérios detalhados que faltarem, reduzindo repetições de catálogo de serviços.

### Catálogo e contratação local

Principal comercial candidata: `/conserto-de-celular-em-bombinhas/`.

Candidata à consolidação: `/2026/06/16/assistencia-tecnica-celular-bombinhas/`.

O artigo apresenta os serviços da própria ReeCell, os sintomas avaliados e como consultar atendimento; sobrepõe-se ao serviço e à home. Transferir primeiro informações úteis para a página de conserto. Manter a home como apresentação da empresa. O artigo “quando procurar” deve ser atualizado para triagem e momento da avaliação, sem repetir o catálogo ou o guia de escolha.

### Grupos que exigem delimitação, não consolidação automática

- Carregamento: ausência de carga, carga lenta e falha do conector têm interseções, mas não são diagnósticos equivalentes. Atualizar a URL de conector para as duas keywords genéricas de carga e manter a de carga lenta em seu papel. O guia de iPhone permanece específico à marca.
- Tela: contratação do serviço, custo, riscos da trinca e defeito verde no Samsung podem coexistir. Ajustar o artigo de custo, cujo primaryKeyword atual coincide com o serviço. Os sintomas genéricos de touch, manchas e piscar têm cobertura parcial; ampliar inicialmente os blocos de orientação do serviço sem converter um artigo de Samsung em guia para todas as marcas.
- Bateria: manter o serviço para contratação e o artigo para sinais de desgaste. Autonomia baixa pode ter causas além da bateria.
- Lojas versus assistências: há empresas e critérios repetidos, mas compra de acessórios/aparelhos e contratação de reparo podem ser objetivos diferentes. Atualizar o foco de cada guia e revalidar dados externos antes de republicar.

## Propostas de redirect, ainda não implementadas

| Origem candidata | Destino candidato | Condição |
| --- | --- | --- |
| `/2026/06/15/celular-molhou-na-praia/` | `/2026/06/08/celular-caiu-na-agua-o-que-fazer/` | Incorporar conteúdo exclusivo e confirmar URL principal com histórico disponível. |
| `/2026/06/16/assistencia-tecnica-de-celular-confiavel-em-bombinhas/` | `/2026/06/08/onde-consertar-celular-em-bombinhas-com-seguranca/` | Consolidar critérios de escolha e comparar desempenho das duas URLs. |
| `/2026/06/16/assistencia-tecnica-celular-bombinhas/` | `/conserto-de-celular-em-bombinhas/` | Absorver informações de serviço e confirmar equivalência completa do destino. |

A escolha final deve considerar consultas, cliques, impressões e links recebidos quando disponíveis; a evidência local não permite afirmar qual URL tem mais autoridade. Um redirect só deve suceder a consolidação. Na execução, atualizar também links internos, membros dos arquivos legados, sitemap, canonicals, mapa de migração e seu contrato de preservação de conteúdo, evitando destinos em cadeia. Não aplicar redirects genéricos só por coincidência de keyword.

## Resultado do planejamento

Nenhuma das 15 keywords justifica criar URL imediatamente nesta fase. Isso não significa que todas já estejam plenamente atendidas: touch, manchas, piscar, reinicialização e carga genérica pedem expansão. Onde a intenção informacional só encontra cobertura parcial numa página comercial, reavaliar a suficiência após a expansão; não alegar equivalência integral nem aprovar nova URL apenas pelo volume de termos.

Antes de qualquer produção futura, atualizar este inventário e registrar KEYWORD → intenção → URL existente → ação. Na dúvida, reutilizar a URL. Os arquivos em docs/blog-source e docs/seo-migration/source são evidências/fontes, não novas páginas públicas.

## Validação

Build concluído. O gerador conferiu URLs únicas, title preenchido, um H1 por HTML e correspondência nos dois sentidos entre as 61 URLs do inventário indexável e o sitemap local. Essas verificações não comprovam publicação ou indexação em produção.

Reprodução: `npm.cmd run build`, `node scripts/audit-content.mjs`, `node scripts/audit-keywords.mjs`.
