# Alterações SEO — Reecell

Data: 25/11/2026. Alterações locais não publicadas.

| Área/arquivos | Alteração | Motivo/impacto esperado | Risco e reversão |
|---|---|---|---|
| `src/components/home/*`, `src/pages/index.astro` | Apresentação local, serviços, localização e conteúdos técnicos relacionados reorganizados/reforçados em mudanças incrementais. | Tornar explícitos Bombas como bairro e Bombinhas como município e facilitar caminho comercial. | Baixo. Reverter somente trechos identificados no diff se necessário. |
| `src/data/editorial.ts`, `src/layouts/BlogLayout.astro`, `src/layouts/ServiceLayout.astro`, rota de artigo | Ligações contextuais entre artigo, serviço existente e contato/localização; sumário; autoria comprovada e conteúdo relacionado. | Aproveitar páginas informativas sem convertê-las em páginas comerciais. | Baixo. Remover bloco/associação específica mantendo corpo e URL. |
| `src/data/business.ts`, `src/lib/structured-data.ts`, páginas comerciais/blog | Geografia/entidades mais consistentes no JSON-LD e nos links; Service e Breadcrumb ligados a entidades existentes. | Melhor interpretação local e semântica. | Baixo. Restaurar campos específicos sem remover o grafo anterior. |
| oito artigos `src/content/blog/*` de outubro | Codificação de caracteres corrigida; slugs/datas mantidos. | Corrigir texto danificado já presente no estado local. | Baixo. Reversão pontual via diff; não restaurar texto corrompido. |
| `src/components/conversion/ContactEvents.astro`, `src/layouts/BaseLayout.astro` | GTM `GTM-5WFKFJ6P` carregado; bootstrap GTM e `gtag('js', new Date())`; eventos de WhatsApp, telefone, rotas e visualização de serviço para `dataLayer`, condicionados a `reecell:analytics-consent` explícito. | Viabilizar configuração no contêiner e medir intenção de contato sem enviar automaticamente eventos próprios antes do consentimento. | Médio: o loader do GTM faz requisição externa e regras nativas do contêiner podem disparar tags. Reversão: remover os três scripts de BaseLayout e ContactEvents do layout; não remova demais atributos/CTAs. Configurar Consent Mode/tags no GTM antes do deploy conforme política aplicável. |
| `scripts/verify-build.mjs` | Verifica presença única do GTM e permite apenas os scripts inline previstos além do módulo local. | Evitar que o verificador considere bootstrap do GTM como código de evento inesperado. | Baixo. Reverter apenas as asserções GTM/ramo de script inline. |
| `docs/seo/*` | Auditoria, mapa, validação e plano de acompanhamento. | Registrar evidências e separar local/público/pendências externas. | Nenhum risco de runtime. |

## Identificadores/eventos

- Container informado pelo proprietário: `GTM-5WFKFJ6P`.
- `whatsapp_click`, `phone_click`, `directions_click`, `service_view`.
- Parâmetros: caminho canônico, categoria da página, serviço, posição do CTA e contexto. Sem PII intencional.
- O código escuta `reecell:analytics-consent` com `detail.granted === true`; nenhum mecanismo de consentimento foi encontrado/criado. O site/container ainda precisa integrar esse evento ao consentimento real antes de publicar eventos. GTM pode executar Page View/tags sem depender do código de eventos, conforme configuração do contêiner.

## Não implementado

Não foram criadas páginas comerciais genéricas adicionais; não foram alterados DNS, redirecionamentos externos, telefones, horários, preços, políticas, reviews, garantias, credenciais ou datas editoriais. Não foi feita implantação.
