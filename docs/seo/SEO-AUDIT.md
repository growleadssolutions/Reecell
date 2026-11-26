# Auditoria consolidada de SEO — Reecell

Data: 25/11/2026. Escopo: código local Astro e amostra pública acessível; nenhuma publicação foi realizada.

## Resumo e linha de base

- Site Astro 7.3.2, Node 24.15.0, renderização estática, CSS próprio, artigos Markdown e rotas comerciais estáticas. Build anterior às alterações finais: 70 arquivos HTML (inclui 404), 69 URLs indexáveis no sitemap local.
- O Git já tinha alterações de migração, documentação e oito artigos novos não rastreados. Preservados; não foi feito reset, commit, push ou deploy.
- Base anterior registrada em `../otimizacao-2026-11-25/RELATORIO.md`: 187 verificações HTTP locais, 28 hashes históricos, 31 artigos com link contextual, 23 autorias verificadas, zero páginas órfãs.
- Host público observado: HTTPS sem www retorna 200; HTTPS www redireciona permanentemente ao host sem www; HTTP redireciona a HTTPS. A variante HTTP+www tem salto adicional. Nenhuma alteração de DNS/hospedagem foi executada.
- Amostra pública pré-deploy: 8 URLs prioritárias retornaram 200, canonical próprio e index/follow. Isso não prova indexação Google. Sitemap público tinha 61 URLs; os oito artigos locais de outubro não estavam publicados e apareciam como 404 publicamente no teste anterior.
- Não existe lint, typecheck standalone nem Lighthouse configurado; não foi instalada dependência.

## Dados de Search Console fornecidos

Período aproximado 24/08–23/11/2026. Valores informados pelo proprietário, não exportados diretamente nesta execução. Filtros podem sobrepor, arredondar e omitir consultas anonimizadas; não somar segmentos.

| Segmento | Impressões | Cliques | CTR | Posição |
|---|---:|---:|---:|---:|
| Geral | 188.000 | 391 | 0,2% | 7,3 |
| Local | 378 | 13 | 3,4% | 6,6 |
| Marca | 100 | 7 | 7% | 3,1 |
| Sem marca | 41.400 | 64 | 0,2% | 8,2 |
| Comercial | 1.020 | 12 | 1,2% | 6,9 |
| Comercial + localização | 123 | 6 | 4,9% | 4,0 |
| Problemas no celular | 28.800 | 39 | 0,1% | 8,1 |
| iPhone/Apple | 107 | 3 | 2,8% | 14,4 |
| Urgentes | 231 | 3 | 1,3% | 6,6 |
| Perguntas informativas | 8.720 | 11 | 0,1% | 8,4 |
| Cauda longa | 31.400 | 51 | 0,2% | 8,2 |
| Artigos do blog | 186.000 | 342 | 0,2% | 7,3 |

Também foram informadas 17.900 impressões em recursos de IA; não houve relatório original disponível para confirmar a definição. O CTR geral não é diagnóstico isolado: intenção, resposta sem clique, composição das SERPs, limite geográfico, sazonalidade e mistura de consultas importam. O recorte comercial local é promissor, mas pequeno em volume absoluto. O blog representa a maior parcela informada de impressões e cliques; preservar sua utilidade e URLs prioritárias.

## Inventário e achados por prioridade

| Prioridade | Evidência/risco | Estado e ação |
|---|---|---|
| P0 | Canonical/host | Configuração pública observada já consolida www para sem www e HTTPS. Canonicals e sitemap usam `https://reecell.com.br`. Host está coerente no código. HTTP+www tem salto adicional; melhoria depende de hospedagem/CDN e fica pendente. |
| P0 | URLs e indexação | As oito URLs informadas como prioritárias foram preservadas. A amostra pública anterior respondeu 200; não há acesso GSC para estado real de indexação. |
| P0 | GTM e contato | GTM `GTM-5WFKFJ6P` adicionado ao layout. Eventos locais próprios só são enviados ao `dataLayer` depois do evento de consentimento explícito `reecell:analytics-consent`; o carregamento do GTM por si é uma chamada externa. Validar no GTM Preview após publicar e configurar consentimento no container. |
| P1 | Página inicial/local | Home reforça Reecell como assistência em Bombinhas e localização em Bombas, usando fatos existentes. Página comercial geral já existe; não foi criada URL concorrente. |
| P1 | Jornada comercial | CTAs existentes mantidos; links contextuais entre artigos, serviços e localização reforçados. Mensagens WhatsApp e número são derivados dos dados existentes. |
| P1 | Eventos | `whatsapp_click`, `phone_click`, `directions_click` e `service_view` são disparados no `dataLayer` com consentimento. Não foi criado `quote_request`/`contact_form_submit`: não há formulário nem fato de orçamento enviado que permita evento preciso. |
| P2 | Metadados/arquitetura | Auditoria de 69 páginas no `inventory.json` e mapa em `SEO-KEYWORD-MAP.md`; títulos principais preservados, exceto o piloto documentado no relatório anterior. Canonical/H1/description passam verificador local. |
| P2 | Conteúdo e autoridade | Artigos prioritários e slugs mantidos. Autoria só adicionada onde comprovada. Sem credenciais, reviews, prazos, garantias ou certificações inventados. |
| P2 | Schema | Grafo de entidades com IDs estáveis, dados da empresa já existentes e serviços ligados às páginas apropriadas. Sem rating/reviews inventados. Sintaxe JSON-LD validada pelo build/verificador; elegibilidade rich result precisa de ferramentas externas. |
| P3 | Desempenho/acessibilidade | Imagens locais otimizadas, dimensões/fontes locais e lazy loading já existiam. Verificações visuais locais em 390 e 1440 px documentadas no relatório anterior. Sem dados CrUX, Lighthouse ou CWV de campo. |
| P3 | Conteúdo sazonal | Já existem artigos sobre água/praia e proteção em Bombinhas. Pauta incremental consta no plano, sem publicação automática em massa. |

## Página inicial e cobertura semântica

Entidade-alvo: Reecell, assistência técnica de celulares localizada no bairro de Bombas, município de Bombinhas, Santa Catarina. Home é a página de intenção geral; páginas de troca de tela e bateria atendem serviços já comprovados. Consultas prioritárias incluem assistência/conserto em Bombinhas e Bombas, iPhone, tela e bateria. Não há evidência para atendimento domiciliar nem lojas em outros bairros.

O inventário individual e titles/H1 ficam em `SEO-KEYWORD-MAP.md`. `inventory.json` registra metadados extraídos do HTML final, não dados de ranking ou conversão.

## Páginas orgânicas a preservar

Manter slugs, canonical e conteúdo informativo das páginas listadas na missão: celular desligando sozinho; celular não liga; conector de carga; tela trincada; áudio; câmera; carregamento lento; melhores lojas de celulares em Bombinhas. Ver inventário e documentação anterior para os caminhos completos. Não foi feita consolidação ou remoção por CTR agregado.

## Lacunas e limites

- Acesso direto autenticado ao Search Console, Analytics e GTM Preview não disponível.
- URLs novas e mudanças locais só terão HTML público após publicação autorizada.
- Sem medição de campo de Core Web Vitals; captura de navegador local não substitui CrUX.
- Sem evidência de conversas concluídas, orçamentos, serviços fechados ou chamadas recebidas; eventos medem cliques/visualizações, não vendas.
- A auditoria não alterou configurações externas de hospedagem, DNS, Google Business Profile ou políticas de consentimento.

## Referências de status

- Implementação e validação local: `SEO-CHANGES.md`, `SEO-VALIDATION.md`.
- Acompanhamento: `SEO-MONITORING.md`.
- Inventário: `inventory.json`, `public-priority-validation.json`, `browser-validation.json`.
- Base anterior: `../otimizacao-2026-11-25/RELATORIO.md`.
