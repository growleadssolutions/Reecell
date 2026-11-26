# Validação SEO — Reecell

Data: 25/11/2026. Execução no projeto local; sem deploy.

## Resultados

| Teste | Resultado |
|---|---|
| `npm.cmd run build` | Sucesso após instalação GTM: Astro gerou 70 páginas estáticas. |
| `npm.cmd run verify` | Sucesso: H1, canonical, description, robots, JSON-LD, links, âncoras, fontes e presença única do GTM + bootstraps. Módulo próprio condicionado a consentimento. |
| `npm.cmd run verify:seo` | Sucesso: 75 entradas legadas, 8 artigos locais, 69 URLs no sitemap, 123 ocorrências de imagens locais, 28 hashes históricos preservados. |
| `npm.cmd run test:seo:http` | Sucesso: 187 verificações do contrato HTTP local. Não emula a Vercel completa. |
| `npm.cmd run verify:optimization` | Sucesso: 69 titles únicos, 31 artigos com serviço, 23 autorias comprovadas, zero páginas órfãs, profundidade máxima de três cliques. |
| `npm.cmd run test:migration` | Sucesso: URL, canonical, Article, breadcrumbs, datas, draft/campos editoriais e limpeza das fixtures. |
| `node scripts/verify-blog-editorial.mjs` | Sucesso: 31 artigos com imagens existentes e CTAs contextuais. |
| `node --test scripts/content-hash.test.mjs` | Sucesso: 28 testes, nenhum falhou. |
| Navegador local | Evidências 390 px/1440 px constam em `browser-validation.json` e screenshots; não medem produção nem CWV de campo. |
| URL pública | Verificação prévia a este trabalho: host canônico e oito URLs prioritárias em 200; sitemap público tinha 61 URLs. Mudanças locais ainda não publicadas. |

## Teste específico do GTM

Após build/verificação, confirmar que o HTML de todas as páginas tem exatamente um loader `GTM-5WFKFJ6P`, `dataLayer` criado antes do carregamento assíncrono e o evento `gtag('js', new Date())`. Confirmar que o código próprio não faz envio/requisição, cookie ou armazenamento e só envia eventos após consentimento. O navegador local não valida tags configuradas no serviço externo.

## Não validado / limites

- GTM Preview, publicação de contêiner, GA4, Consent Mode e recepção de eventos externos: dependem de acesso à conta/consentimento e não foram testados.
- Google Search Console: sem acesso autenticado; a indexação deve ser rechecadas após publicar.
- Produção: nenhum deploy ocorreu; redirects Vercel e conteúdo público requerem validação pós-deploy.
- Lint, verificação standalone de tipos, Lighthouse e dados CrUX: não estão configurados/disponíveis neste projeto.
- Contato: testes locais verificam URL/número/mensagem, não conversas, chamadas efetivas ou atendimento humano.
