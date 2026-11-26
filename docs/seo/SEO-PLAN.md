# Plano incremental e linha de base — 25/11/2026

Esta continuação incorpora as seções 3–23 fornecidas após a primeira rodada. O estado anterior está em `../otimizacao-2026-11-25/RELATORIO.md`; os documentos desta pasta passam a descrever o estado final consolidado.

## Preflight

- Lidos AGENTS.md, README, package.json, astro.config.mjs, tsconfig.json, configuração de rotas/hosting e layouts. Somente um AGENTS.md encontrado fora de dependências. Guias oficiais Astro de componentes, conteúdo, rotas e estilos consultados na primeira rodada.
- Stack confirmada: Astro instalado 7.3.2, Node 24.15.0, TypeScript strict configurado, Markdown, CSS próprio, saída estática e sem CMS em runtime. Rotas comerciais fixas, artigos datados e 32 arquivos históricos. Não há framework de UI hidratado.
- Git: main com alterações anteriores à missão em scripts/configuração/relatórios de migração e oito artigos não rastreados. Não sobrescrever ou usar checkout/reset global. A primeira rodada adicionou melhorias próprias; a continuação preserva e revisa essas melhorias.
- Base antes desta continuação: build com 70 HTMLs e 69 URLs no sitemap; 187 testes HTTP locais passaram; 28 hashes históricos intactos; 31 artigos ligados a atendimento; 23 assinaturas comprovadas; zero destinos órfãos. Evidências datadas na pasta anterior.
- README contém descrições históricas obsoletas (coleção vazia, ausência de Git, dois HTMLs). Foi adicionado um aviso apontando para a auditoria atual sem apagar a documentação histórica de migração.
- Sem lint configurado, TypeScript standalone, @astrojs/check ou Lighthouse instalados. Não instalar pacotes só para produzir pontuação. Build não equivale a typecheck.
- No início da auditoria não havia GTM/GA4 nem mecanismo de consentimento identificado. Em seguida, o proprietário forneceu o container `GTM-5WFKFJ6P`; o loader foi instalado no HTML e eventos próprios foram condicionados ao evento explícito `reecell:analytics-consent`. Não existe ainda CMP nem validação no GTM Preview.
- HTTP público atual: HTTPS sem www = 200; HTTPS www = 301 para sem www; HTTP = 308 para HTTPS; HTTP+www exige dois saltos. Caminho e query preservados no teste de www. Não alterar infraestrutura para eliminar o salto automático de TLS.

## Execução por impacto e risco

| Prioridade | Trabalho | Risco / controle |
|---|---|---|
| P0 | Validar oito URLs prioritárias, host, canonical, 404, sitemap e redirects | Sem remoção de rotas; teste local e amostra pública separados |
| P1 | Introdução local objetiva na home; âncoras específicas por sintoma | Mudança pequena de texto/layout; preservar design e informações reais |
| P1 | Preparar eventos de contato e visualização de serviço, condicionados a consentimento explícito | Sem coletor/ID/network/storage; validar ausência de disparos sem consentimento e duplicação |
| P2 | Conservar títulos dos artigos prioritários; propor somente um piloto de title | Sem mudança de H1, data, conteúdo ou canonical; registro antes/depois e controle |
| P2 | Inventário renderizado e mapa individual de intenção para todas as URLs | Extração de dist; separar diagnóstico editorial de fatos de indexação |
| P3 | Verificar peso de recursos, dimensões, lazy/LCP, mobile, foco e contraste | Melhorar somente problemas reproduzidos; sem declarar CWV de campo |
| P2 | Documentar autoria, privacidade, lacunas comerciais e pauta sazonal | Não publicar biografia/política/serviços não comprovados |
| P0 | Build, regressão, validação dos eventos e revisão do diff | Parar dev antes de testes que criam fixtures; nenhuma publicação |

Publicação em produção, DNS, credenciais e configuração de propriedade Analytics ficam fora da execução automática.
