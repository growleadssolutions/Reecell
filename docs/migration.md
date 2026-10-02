# Fundação da migração ReeCell

## Auditoria inicial — 14/09/2026

> Registro histórico. As afirmações abaixo sobre artigos não migrados foram
> superadas. O estado atual e os bloqueios de DNS estão em
> [seo-migration/REPORT.md](seo-migration/REPORT.md).

Astro 7.3.2 instalado, TypeScript strict, uma página de exemplo. Não havia
conteúdo WordPress local, assets empresariais ou repositório Git inicializado.
Preservados AGENTS.md, CLAUDE.md, .vscode, tsconfig.json, lockfile e favicons
originais. Os favicons Astro não são usados pelo novo layout.

Esta etapa é uma fundação local. Não publicar em substituição ao WordPress ainda.

## Evidências do site atual

Fonte consultada: https://reecell.com.br/

URLs de páginas identificadas por navegação, ainda não migradas:

- https://reecell.com.br/
- https://reecell.com.br/troca-de-tela-de-celular-em-bombinhas/
- https://reecell.com.br/conserto-de-celular-em-bombinhas/
- https://reecell.com.br/contato-reecell-bombinhas/

O link de troca de bateria foi identificado, mas sua página não foi recuperada.
Não foi possível recuperar robots.txt e wp-sitemap.xml pela ferramenta de consulta.
Esta lista NÃO é um inventário completo de URLs. A URL datada citada no briefing
é um exemplo de formato, não um artigo migrado ou confirmado nesta auditoria.

Dados empresariais foram extraídos da homepage atual e centralizados em
src/data/business.ts. Coordenadas, redes e logo permanecem pendentes. Validar
NAP e horários com a empresa antes da publicação final.

## Contrato de URLs do blog

Cada arquivo Markdown recebe `slug` e `permalinkDate` explícitos, copiados da URL
original. `permalinkDate` usa YYYY-MM-DD e não acompanha alterações em
publishedDate/updatedDate. Não converter slug, caixa, acentos ou data via UTC.

O helper src/lib/permalinks.ts é compartilhado por rotas, links e sitemap.
Trailing slash preservado. Nenhum redirect e nenhuma rota /blog/slug/.
URLs duplicadas interrompem o build. Rascunhos não geram página nem sitemap.
As datas devem ser strings entre aspas. Não migrar artigos nesta etapa.

Exemplo de frontmatter, apenas documentação:

```yaml
title: "Título original revisado"
description: "Descrição específica do artigo."
slug: "slug-exatamente-como-na-url-original"
permalinkDate: "2026-06-08"
publishedDate: "2026-06-08"
updatedDate: "2026-09-14"
# image: "../../assets/foto-real.webp"
# imageAlt: "Descrição objetiva da foto"
category: "Cuidados com o celular"
primaryKeyword: "uso editorial interno"
localIntent: "uso editorial interno"
relatedServices: []
draft: true
```

Imagens são locais e validadas pela collection, usando Image do Astro para
dimensões e srcset. A capa é eager; imagens abaixo da dobra devem usar lazy,
width e height no conteúdo. Não atribuir autor nem credenciais sem confirmação.

## Antes da migração real

- Exportar URLs de páginas, posts, categorias, mídias e demais rotas relevantes
  do WordPress, sitemap e Search Console. Salvar também títulos, descrições,
  canonicals, status HTTP e links internos atuais.
- Recriar cada página em seu endereço original e adicionar páginas indexáveis
  a src/data/site-pages.ts. O sitemap dos artigos já é automático.
- Comparar inventário antigo com dist: toda URL preservada deve retornar 200,
  canonical próprio e conteúdo equivalente. Só usar 301 quando uma mudança
  for necessária e aprovada; nunca redirecionar todo 404 para a homepage.
- Validar imagens reais, logo, autores, NAP, metadados e dados estruturados.
- Proteger previews de indexação na hospedagem, mantendo a produção indexável.
- Verificar status 404 real, robots, sitemap, HTTPS e redirecionamento de host
  no ambiente final. O build local não comprova esses comportamentos.
- Medir CWV e testar WhatsApp em aparelhos reais; não há nota Lighthouse ou
  garantia de posicionamento/GEO nesta fundação.

Não houve deploy, conexão de domínio, alteração de DNS ou migração de artigos.
