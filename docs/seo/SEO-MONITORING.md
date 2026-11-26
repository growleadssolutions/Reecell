# Monitoramento SEO e conversão — Reecell

## Linha de base

Usar como linha de base os dados fornecidos do Search Console para aproximadamente 24/08–23/11/2026, registrando que filtros podem se sobrepor e não são exportação da API. Destacar o recorte comercial + localização (123 impressões, 6 cliques, CTR 4,9%, posição 4,0) sem inferir crescimento ou somá-lo aos demais. Medir cliques em paralelo com contatos efetivos informados pela empresa.

## Search Console

Salvar export por consulta, página, país, dispositivo, data e aparência da pesquisa. Separar:

- Consultas com Bombas/Bombinhas e variações comerciais; página inicial e páginas de serviços.
- Marca Reecell.
- Intenção comercial sem local e consultas informativas dos artigos prioritários.
- Impressões/cliques em recursos de IA conforme relatório disponível na propriedade; não somar como tráfego independente sem entender a dimensão.
- Páginas orgânicas prioritárias: preservar slugs e comparar cada URL individualmente.

Comparar janelas de 28 dias com janela equivalente anterior, além de comparação anual quando houver histórico e sazonalidade comparável. Observar férias/temporada turística, mudanças de SERP, posição, dispositivo e demanda. CTR média isolada não é meta.

## Eventos no GTM

O código envia eventos ao `dataLayer` após `reecell:analytics-consent` receber `detail.granted === true`:

| Evento | O que mede | Parâmetros disponíveis |
|---|---|---|
| `whatsapp_click` | Clique no link WhatsApp, não conversa enviada/recebida | `page_path`, `page_category`, `service_type`, `contact_type`, `button_position`, `content_context` |
| `phone_click` | Clique em link `tel:`; não chamada completada | mesmos parâmetros |
| `directions_click` | Clique no link Maps reconhecido | mesmos parâmetros |
| `service_view` | Página de serviço visualizada após consentimento | caminho, categoria e serviço |

No GTM Preview, validar cada evento uma vez, consentimento negado/concedido, navegação em várias páginas e ausência de duplicação. Publicar tags GA4 somente com Measurement ID confirmado e configuração de consentimento revisada. Marcar como evento principal no GA4 apenas após aprovação do responsável. Não marcar `service_view` como conversão principal sem justificativa. Não enviar telefone, nome ou texto digitado.

Pendências: vincular o consentimento real ao evento customizado; revisar Consent Mode/tag settings dentro do GTM; validar propriedade GA4 e destinos; documentar banner/política com responsável. O GTM Preview e transmissão externa ainda não foram testados.

## Cadência

| Prazo pós-publicação | Verificação |
|---|---|
| 7 dias | HTTP/canonical/sitemap; rastreamento das URLs; GTM Preview, consentimento, erros de tags e duplicação. Revisar mensagens/reclamações de contato. |
| 14 dias | Indexação e inspeção de URLs prioritárias; validar se novos artigos/redirects foram publicados intencionalmente; primeiras amostras de eventos. |
| 28 dias | Comparar consulta/página/dispositivo e os segmentos locais/comerciais; analisar CTR com posição e aparência da SERP; comparar cliques com conversas reais agregadas. |
| 60 dias | Reavaliar páginas de serviços, consultas de Bombas/Bombinhas, estabilidade de tráfego informativo e sazonalidade. Ajustar CTA só com evidência. |
| 90 dias | Decidir próximo ciclo de conteúdo/experimentos; comparar janela equivalente e temporada; rever eventos, privacidade, CWV de campo e URLs. |

## Indicadores prioritários

Cliques/impressões de consultas comerciais locais; posição dessas consultas; sessões que geram cliques de contato; conversas/orçamentos reais medidos pela empresa; pedidos de rota; desempenho individual dos oito artigos prioritários; cobertura de indexação; disponibilidade das rotas; Core Web Vitals de campo quando disponíveis. CTR geral não é KPI isolado.
