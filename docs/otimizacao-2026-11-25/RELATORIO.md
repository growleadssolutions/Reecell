# ReeCell — auditoria e otimização de SEO, GEO, AEO e conversão

> Registro da primeira rodada. A continuação com as seções 3–23 da missão está consolidada em [docs/seo/SEO-AUDIT.md](../seo/SEO-AUDIT.md). O estado final limita a um title experimental fora das oito URLs prioritárias e acrescenta um módulo local de eventos condicionado a consentimento; as menções abaixo a seis títulos e zero JavaScript descrevem o estado anterior.

Data: 25/11/2026. Escopo executado: código local, site público, navegação, metadados, conteúdo, dados estruturados, migração e testes. **Sem commit, push ou deploy.**

## Resultado

Implementadas correções de texto em oito artigos locais; caminhos entre artigos, serviços e contato; sumários navegáveis; autoria comprovada dos 23 artigos históricos; seis títulos de busca mais concisos; descoberta dos arquivos históricos; dados locais complementares no JSON-LD; e redirects de 23 IDs WordPress para seus artigos correspondentes.

O build continua estático e sem JavaScript de cliente. Os 23 arquivos Markdown históricos e os quatro arquivos de estilos globais passaram pelo controle de integridade preexistente. Nenhuma URL histórica, data de permalink, canonical, regra de draft ou indexabilidade de página publicada foi removida ou alterada. Os oito artigos de outubro já estavam com `draft: false` no início do trabalho; foram reparados, não criados nesta execução.

## Dados de negócio e interpretação do Search Console

Fonte dos números: informações fornecidas pelo proprietário, período aproximado de 24/08 a 23/11/2026. Não houve consulta autenticada ao Search Console nesta execução.

| Segmento | Impressões | Cliques | CTR | Posição |
|---|---:|---:|---:|---:|
| Total | 188.000 | 391 | 0,2% | 7,3 |
| Local | 378 | 13 | 3,4% | 6,6 |
| Marca | 100 | 7 | 7% | 3,1 |
| Sem marca | 41.400 | 64 | 0,2% | 8,2 |
| Comercial | 1.020 | 12 | 1,2% | 6,9 |
| Comercial + localização | 123 | 6 | 4,9% | 4,0 |
| Problemas no celular | 28.800 | 39 | 0,1% | 8,1 |
| iPhone/Apple | 107 | 3 | 2,8% | 14,4 |
| Serviços urgentes | 231 | 3 | 1,3% | 6,6 |
| Perguntas informativas | 8.720 | 11 | 0,1% | 8,4 |
| Cauda longa | 31.400 | 51 | 0,2% | 8,2 |
| Artigos do blog | 186.000 | 342 | 0,2% | 7,3 |

Os filtros podem se sobrepor e não formam uma decomposição do total. Não somar segmentos ou projetar receita a partir deles. Os seis cliques comerciais locais são uma amostra pequena, embora a CTR seja maior que a geral. A posição média agrega consultas, dispositivos e tipos de resultado; não prova que toda página esteja na primeira página.

O segmento de serviços urgentes, informado posteriormente, tem 231 impressões e três cliques. Ele reforça a utilidade de facilitar o contato para consultar disponibilidade, mas não comprova demanda exclusivamente local nem capacidade de atendimento imediato. Manter os CTAs de consulta e a orientação para confirmar prazo conforme avaliação e peças; não anunciar atendimento 24 horas, reparo no mesmo dia ou prazo garantido sem confirmação da empresa.

O recorte de perguntas informativas, também informado posteriormente, reúne 8.720 impressões, 11 cliques, CTR de 0,1% e posição média de 8,4. A exposição com poucos cliques merece análise por consulta e página, mas não demonstra isoladamente perda de tráfego para respostas de IA nem baixa qualidade dos artigos. Preservar as respostas úteis e oferecer caminhos contextuais para serviços locais, como implementado. Não converter todos os artigos em páginas comerciais ou alterar seus títulos em massa com base nesse agregado. Esse segmento pode se sobrepor a problemas no celular e aos demais filtros.

O segmento de cauda longa reúne 31.400 impressões, 51 cliques, CTR informada de 0,2% e posição média de 8,2. O critério exato do filtro não foi fornecido. Consultas longas não são necessariamente comerciais ou locais: separar perguntas sobre sintomas de buscas por serviço, modelo e localização antes de priorizar novas mudanças. Os números não justificam criar uma página para cada variação de consulta. Preservar a cobertura dos artigos existentes e avaliar oportunidades por consulta e URL, sem somar esse recorte aos demais segmentos.

O recorte de artigos do blog registra 186.000 impressões, 342 cliques, CTR de 0,2% e posição média de 7,3. Se período, propriedade e demais filtros forem equivalentes aos do total informado, os valores correspondem a aproximadamente 98,9% das impressões e 87,5% dos cliques. A comparação de impressões exige cautela: o Search Console pode agregar dados por propriedade ou por página, e os totais informados são arredondados. O resultado indica forte concentração da aquisição orgânica no blog e reforça a preservação de suas URLs e conteúdo, com caminhos contextuais para serviços locais. Não demonstra que esses visitantes estejam em Bombinhas ou que tenham intenção de contratar; a conversão local precisa ser medida separadamente.

As 17.900 impressões atribuídas a recursos de IA foram registradas como dado informado, sem confirmação independente do relatório, filtro ou definição. Não foram tratadas como tráfego adicional ao total nem como citações no ChatGPT/Perplexity. A documentação do Google consultada orienta acompanhar os recursos de IA dentro do desempenho de pesquisa; é necessário o export original para interpretar precisamente esse recorte.

Decisão: fortalecer o caminho comercial local e conservar a utilidade nacional dos artigos. CTR baixa pode envolver intenção, títulos, composição da SERP e respostas sem clique, mas os agregados não permitem isolar a causa. Não há previsão de crescimento prometida.

## Auditoria pública e local

- Público: leitura de HTML renderizado, JSON-LD, robots e sitemap no navegador. As **61 URLs do sitemap público** retornaram 200, um H1, canonical próprio e ausência de noindex na amostra de 25/11. Isso demonstra acessibilidade naquele momento, não indexação pelo Google.
- Público: `/?p=431` retornou a home com 200, em vez do artigo existente. `/2026/10/06/celular-nao-reconhece-chip/` retornou 404. Não foi presumido que os oito artigos de outubro já estivessem publicados.
- Local: 70 HTMLs incluindo a página 404; 69 URLs finais indexáveis; 31 artigos, seis páginas principais e 32 arquivos históricos. Os oito artigos extras explicam a diferença de sitemap entre build e produção.
- Arquitetura: páginas comerciais, imagens locais otimizadas, fontes locais, lazy loading, canonical e JSON-LD já existiam. Não foram apresentados como funcionalidades criadas nesta execução.
- Geografia: Bombas é o bairro no endereço; Bombinhas é o município em texto e `PostalAddress.addressLocality`. Telefone, endereço e horários continuam vindo de `src/data/business.ts`.
- Sem coleta nova de avaliações, preços, prazos, certificações, garantias ou coordenadas. Não houve alteração do Perfil da Empresa no Google nem do Maps.

## Problemas e correções executadas

| Prioridade | Evidência / problema | Implementação e propósito | Arquivos principais |
|---|---|---|---|
| Alta | Oito textos continham `n?o`, `avalia??o`, `Meu modelo ?` etc. | Reparação de acentos, inclusive metadados, texto, alt e mensagens de WhatsApp, mantendo slugs e datas. | Oito Markdown de 06/10; `scripts/repair-content-encoding.mjs` |
| Alta | `/?p=431` abria conteúdo incorreto; backup contém 23 IDs reais. | Redirect 301 condicionado ao ID exato na raiz ou `/index.html`, para a URL equivalente. Host www/HTTP normaliza para produção; preview permanece no próprio host. Parâmetros e IDs desconhecidos não são capturados por regra genérica. | `src/data/legacy-post-ids.json`, `scripts/seo-routing.mjs`, gerador, `vercel.json`, testes HTTP |
| Média-alta | Cartões da home usavam “Ver solução” para abrir WhatsApp. | Link interno para entender o serviço e CTA de WhatsApp com rótulo específico, mantendo mensagem contextual. | `HomeServices.astro` |
| Média-alta | Não havia ponte uniforme entre artigo, serviço pertinente e localização. | Bloco local nos 31 artigos com serviço escolhido por intenção e link para endereço/horários. Carregamento não é automaticamente tratado como necessidade de bateria. | `src/data/editorial.ts`, `BlogLayout.astro` |
| Média | Páginas de serviço não ofereciam trilhas de leitura correspondentes. | Três artigos selecionados em cada um dos três serviços; todos derivados da coleção publicada. | `ServiceLayout.astro`, `editorial.ts` |
| Média | Artigos longos exigiam rolagem para localizar tópicos. | Sumário de H2 gerado com os IDs reais do Markdown, sem JS e sem alterar os parágrafos informativos. | Rota datada, `BlogLayout.astro` |
| Média | Article sem autoria apesar da evidência histórica. | Nome e link visíveis e `author` no JSON-LD somente para os 23 artigos presentes nos arquivos de autor do WordPress. Não foi criada biografia, formação ou revisão técnica fictícia. | `BlogLayout.astro` |
| Média | Arquivos históricos isolados da navegação útil. | Tags correspondentes ligadas pelos próprios artigos, categorias ligadas pelo blog e autor ligado pela assinatura. URLs e paginação preservadas. Todos os 69 destinos passaram a ser alcançáveis a partir da home. | `BlogLayout.astro`, `blog/index.astro` |
| Média | Títulos extensos acoplados ao H1; maior título público tinha 92 caracteres. | Overrides de SEO para seis artigos, sem editar H1/corpo/canonical. Blog ganhou título descritivo. Mudança por clareza, não alegação de problema de indexação. | `editorial.ts`, layouts, blog |
| Média | H1 do contato era genérico. | “Contato e localização da ReeCell em Bombinhas.” | `contato-reecell-bombinhas.astro` |
| Média | Grafo local sem foto, mapa e município atendido explícitos. | Foto real já usada no site, URL de mapa centralizada e `areaServed` Bombinhas; Service ligado à página correspondente. BreadcrumbList também no blog. | `business.ts`, `structured-data.ts`, `HomeLocation.astro`, blog |

## Títulos de busca alterados

Os H1 e corpos dos artigos históricos foram preservados. A escolha não pressupõe dados de CTR por URL, indisponíveis nesta execução.

| Slug do artigo | Novo title |
|---|---|
| `tela-de-celular-bombinhas` | Quanto custa trocar a tela em Bombinhas? \| ReeCell |
| `celular-nao-liga-principais-causas` | Celular não liga: causas e próximos passos \| ReeCell |
| `celular-caiu-na-agua-o-que-fazer` | Celular caiu na água: o que fazer agora? \| ReeCell |
| `tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar` | Tela trincada: posso usar ou preciso trocar? \| ReeCell |
| `assistencia-tecnica-para-celular-em-bombinhas-quando-procurar` | Quando procurar assistência em Bombinhas? \| ReeCell |
| `assistencia-tecnica-celular-bombinhas` | Conserto em Bombinhas: serviços e avaliação \| ReeCell |

## GEO e AEO

O conteúdo principal permanece no HTML inicial, com perguntas e respostas já existentes, títulos semânticos, sumários e ligação entre empresa, serviços e localização. O bloco local explica em linguagem direta onde fica a loja e o que é necessário para consultar atendimento. A autoria histórica torna a origem editorial verificável.

Não foi criado conteúdo duplicado “para IA”, arquivo `llms.txt` como requisito de ranqueamento, avaliação fictícia, marcação de perguntas sem conteúdo visível ou páginas quase iguais para bairros. Os fundamentos de elegibilidade indicados pelo Google continuam sendo os de SEO; não há promessa de citação ou resultado enriquecido. FAQs visíveis foram mantidas sem promessa de rich results de FAQ para uma assistência técnica.

## Validação executada

| Verificação | Resultado |
|---|---|
| `npm.cmd run build` | 70 páginas; sucesso |
| `npm.cmd run verify` | H1, canonical, description, robots, JSON-LD, links, âncoras e fontes; sucesso; sem JS de cliente |
| `npm.cmd run verify:seo` | 75 entradas legadas + oito artigos locais; 69 URLs de sitemap; 123 ocorrências de imagens locais; 28 hashes históricos preservados |
| `npm.cmd run test:seo:http` | 187 verificações sem falha; inclui os 23 IDs; servidor de contrato local, não emulação completa da Vercel |
| `node scripts/verify-blog-editorial.mjs` | 31 artigos com imagens e CTAs contextuais |
| `npm.cmd run test:migration` | Datas de URL, draft, campos internos, JSON-LD e remoção de fixtures; sucesso |
| `node --test scripts/content-hash.test.mjs` | 28 testes passaram |
| `npm.cmd run verify:optimization` | 69 títulos únicos; 31 artigos com serviço; 23 autorias verificadas; zero páginas órfãs; profundidade máxima de quatro cliques |
| Navegador, 390px e 1440px | Home, contato, serviço de tela, artigo iPhone e artigo chip sem overflow horizontal; sumário e menu mobile funcionais |
| Carregamento de imagens | Home e artigo iPhone sem falhas após solicitar/decodificar imagens lazy; screenshot inicial antes do carregamento não foi usado como evidência final |

Evidências: `validation.json`, capturas `home-mobile.png` e `article-desktop.png`, mais os relatórios atualizados em `docs/seo-migration/`. As capturas são do servidor de desenvolvimento local. O teste de WhatsApp conferiu número, URL e mensagem; não enviou mensagem nem comprova atendimento humano.

## Limites, riscos e próximos controles

1. **Publicação pendente:** nenhuma melhoria local foi comprovada em produção. Depois do deploy, executar o teste HTTP com `--base-url https://reecell.com.br`, verificar redirects por ID, oito URLs de outubro, canonical, sitemap e visual. Os 187 testes locais não substituem esse controle remoto.
2. **Desempenho real:** fontes locais, imagens dimensionadas e ausência de JS próprio foram preservadas. Não houve medição Lighthouse/CrUX nem acesso aos Core Web Vitals da propriedade. Não atribuir pontuação ou redução de LCP a este trabalho.
3. **Medição de conversões:** existem atributos `data-cta` nos links, mas não foi identificado coletor GA4/GTM no projeto. Cliques não estão sendo contabilizados por uma integração adicionada aqui. Antes de configurar, obter a propriedade/ID e política de consentimento aplicável. Separar clique em WhatsApp, conversa recebida, orçamento e serviço fechado.
4. **Dados por URL:** acompanhar os seis títulos alterados por página/consulta/dispositivo após recrawl. Comparar janelas de 28 dias e controlar sazonalidade, especialmente turismo. Não trocar todos os títulos em resposta à CTR agregada.
5. **Autoridade informativa:** não excluir nem redirecionar artigos só por tráfego não local. Há sobreposição entre artigos comerciais locais, mas não há evidência por consulta suficiente para decidir consolidações nesta execução.
6. **Arquivos históricos:** passaram a ser navegáveis, mas alguns têm somente um artigo. Foram mantidos para evitar perda de URLs sem dados; maior profundidade editorial depende de conteúdo relevante, não preenchimento artificial.
7. **Mídias/anexos antigos:** a auditoria anterior registrou problemas fora do sitemap. Não há inventário atual completo desses acessos nesta execução; não foram criados redirects de anexos sem equivalência comprovada.
8. **Autoria e imagens:** oito textos novos permanecem sem atribuição pessoal comprovada. Nem todo Article tem uma imagem de capa editorial; não foi usada a fachada como se fosse imagem do assunto técnico.
9. **Release e rollback:** havia mudanças anteriores em scripts de migração, `vercel.json`, relatórios e oito Markdown não rastreados. Este relatório distingue esse estado. Evitar `git reset` ou checkout global; reverter apenas os trechos desta entrega se necessário. Os hashes históricos não foram regenerados para esconder diferenças.

## Referências técnicas consultadas

- [Astro: componentes](https://docs.astro.build/en/basics/astro-components/), [coleções](https://docs.astro.build/en/guides/content-collections/), [rotas](https://docs.astro.build/en/guides/routing/) e [estilos](https://docs.astro.build/en/guides/styling/).
- [Google: recursos de IA e sites](https://developers.google.com/search/docs/appearance/ai-features).
- [Google: Article](https://developers.google.com/search/docs/appearance/structured-data/article) e [LocalBusiness](https://developers.google.com/search/docs/appearance/structured-data/local-business).
- [Vercel: configuração estática e condições de query](https://vercel.com/docs/project-configuration/vercel-json).
- Fontes factuais locais: `src/data/business.ts`, `docs/seo-migration/source/posts-1.json`, `docs/blog-source/wordpress-posts.json`, `src/data/legacy-migration.json` e arquivos históricos de autor. Sem mudanças em informações institucionais verificadas.
