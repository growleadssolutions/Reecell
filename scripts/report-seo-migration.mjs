import { readFile, writeFile } from 'node:fs/promises';
import { migration, origin } from './seo-routing.mjs';
const root = new URL('../', import.meta.url);
const read = async file => JSON.parse(await readFile(new URL(file, root), 'utf8'));
const local = await read('docs/seo-migration/local-validation.json');
const http = await read('docs/seo-migration/http-contract-validation.json');
const source = await read('docs/seo-migration/source/inventory.json');
const crawl = await read('docs/seo-migration/source/crawl.json');
const rows = migration.entries.map(entry => {
  const result = http.results.find(r => r.oldPath === entry.oldPath);
  return { oldURL: origin + entry.oldPath, finalURL: entry.finalPath ? origin + entry.finalPath : null, treatment: entry.treatment, kind: entry.kind, validation: result?.ok ? `${result.status}${result.finalStatus ? ` → ${result.finalStatus}` : ''} HTTP local; hospedagem pendente` : 'FALHA/PENDENTE', reason: entry.reason, sources: entry.sources };
});
await writeFile(new URL('docs/seo-migration/url-report.json', root), JSON.stringify(rows, null, 2) + '\n');
const csv = v => `"${String(v ?? '').replaceAll('"','""')}"`;
await writeFile(new URL('docs/seo-migration/url-report.csv', root), '\uFEFF' + ['URL antiga;URL final;Tratamento;Tipo;Validação;Justificativa', ...rows.map(r => [r.oldURL,r.finalURL,r.treatment,r.kind,r.validation,r.reason].map(csv).join(';'))].join('\n') + '\n');
const md = `# Migração SEO ReeCell — relatório de implementação

Atualizado em ${new Date().toISOString()}. Domínio final: **${origin}**.

## Estado para o DNS

**Ainda não liberar a troca do DNS.** Implementação e testes locais concluídos; falta validar o build e as regras na hospedagem real. Nenhum DNS, nameserver, registro de e-mail ou arquivo da HostGator foi alterado. Não houve deploy.

Não existiam configuração de hospedagem nem vínculo de projeto neste checkout. A conta Vercel conectada foi consultada em modo leitura e não retornou projeto ReeCell. A Vercel foi **preparada como destino provisório**, sem presumir que já seja o destino escolhido. Confirmar hospedagem e conta/projeto antes de publicar. Se não for Vercel, aplicar os 301 na camada do provedor escolhido; HTML estático sozinho não os executa.

## Inventário e evidências

- A [lista fornecida](search-console-paths.txt) contém 47 caminhos.
- Coleta pública: robots, índice e cinco sitemaps filhos, API WordPress de artigos, páginas, tags e categorias.
- Sitemap antigo: **${source.sitemapUrls.length} URLs**. Rastreamento com paginação: **${crawl.pages.length} URLs, todas HTTP 200** no WordPress.
- API: 23 artigos, 7 páginas, 32 tags e 2 categorias.
- Mapa: **75 entradas**, incluindo seis sitemaps: **61 preservadas e 14 redirects 301**.
- Evidências: [inventário](source/inventory.json), [rastreamento](source/crawl.json) e XMLs/HTMLs em §source/§.
- O acesso inicial foi bloqueado no ambiente restrito; a coleta com acesso à rede foi concluída. Não há limitação de acesso pendente para as fontes coletadas.
- Este inventário cobre as fontes consultadas, não prova cobertura de URLs órfãs, anexos, feeds, parâmetros e backlinks históricos. Comparar exportação integral do Search Console antes do corte.

## Alterações implementadas

1. Os 23 artigos, Home, três serviços, Contato e Blog mantêm suas URLs. Os artigos usam §/YYYY/MM/DD/slug/§ por §permalinkDate§ imutável; não foram movidos para §/blog/slug/§.
2. §src/pages/[...legacy].astro§ gera 25 arquivos de tags, categoria Uncategorized com três páginas, categoria filha Assistência Técnica e arquivo de Gabriel Souza com três páginas. Associação, ordem e divisão dos artigos por página foram extraídas do HTML WordPress. Nenhuma página vazia foi criada.
3. Sete tags repetem precisamente o assunto de seu único artigo e recebem 301 direto a ele. Tags com tema mais amplo/diferente mantêm a listagem original, mesmo quando há somente um artigo. Não houve redirecionamento indiscriminado para Home, Blog ou serviço. Justificativas individuais estão na matriz.
4. §/home-v3/§ é uma versão alternativa da Home: seu H1 antigo é “Loja de celular em Bombinhas com assistência técnica”. Recebe 301 para §/§. Seis sitemaps WordPress recebem 301 para §/sitemap.xml§.
5. §vercel.json§ aplica HTTP 301 com destinos finais exatos e combina variantes www, HTTPS, barra final e §index.html§ no mesmo salto. Redirects em preview permanecem relativos para não serem validados por engano no WordPress antigo.
6. Usam-se regras §routes§ com regex ancorada e status explícito, sem os 308 implícitos de §trailingSlash§/§cleanUrls§. Não existiam regras anteriores. O gerador recusa configurações divergentes para evitar sobrescrever futuras regras. Referência: [Vercel](https://vercel.com/docs/project-configuration/vercel-json).
7. Rotas finais conhecidas apontam ao HTML correspondente; assets passam pelo filesystem. Desconhecidas recebem 404 real, com página 404 e noindex; não há fallback 200 para Home. Nenhuma URL auditada exigiu retirada 404/410, pois todos os conteúdos tinham destino ou arquivo preservável.
8. Sitemap contém ${local.sitemapUrls} URLs finais indexáveis, sem redirects/404. Canonicals usam HTTPS sem www e barra final. Robots permite rastrear e informa §${origin}/sitemap.xml§.
9. Links internos apontam diretamente às rotas finais. O build contém ${local.images} referências de imagens locais existentes, sem dependência de wp-content/HostGator. Não foi necessário baixar outras imagens; os assets necessários já estavam em §src/assets§ e §public§.
10. 23 arquivos Markdown e cinco folhas de estilo estão idênticos por SHA-256. Não houve reescrita de artigos, palavras-chave ou do layout existente.

**Artigos ou serviços ausentes no conjunto auditado: nenhum.**

## Testes e limites de evidência

| Camada | Resultado | Limite |
|---|---|---|
| WordPress antigo | ${crawl.pages.length} URLs com 200 | Prova a coleta antiga, não a migração |
| Build Astro | ${local.pages} HTMLs; ${local.sitemapUrls} URLs no sitemap | Geração estática |
| verify / test:migration / verify-blog-editorial | Passaram | Links, H1, canonical, JSON-LD, datas, drafts, imagens e CTAs |
| verify:seo | Passou | 75 tratamentos, destinos, sitemap, contrato sem loops/cadeias, 28 hashes intactos |
| HTTP do contrato local | ${http.results.length} casos, ${http.failures.length} falhas | Servidor Node de teste, **não é a Vercel** |
| Preview/produção Vercel | **PENDENTE** | Precisa do deploy real para comprovar comportamento da plataforma |

O servidor local do Astro não aplica §vercel.json§. O servidor Node de contrato também não equivale à infraestrutura Vercel. Evidências: [build/contrato](local-validation.json), [HTTP local](http-contract-validation.json). Não se afirma que a migração está publicada.

§§§powershell
npm.cmd run build
npm.cmd run verify
npm.cmd run test:migration
node scripts/verify-blog-editorial.mjs
npm.cmd run verify:seo
npm.cmd run test:seo:http
# Depois de obter uma URL REAL de preview:
npm.cmd run test:seo:http -- --base-url https://URL-REAL-DO-PREVIEW
§§§

O teste remoto usa redirects manuais: exige 301, destino final 200 sem novo redirect, canonical de produção, sitemap, robots e 404 real. Não aceita redirect de preview para o WordPress antigo como prova. Deployment Protection pode usar §VERCEL_AUTOMATION_BYPASS_SECRET§ no ambiente, nunca no repositório. Noindex de preview via header é permitido pelo teste; em produção é rejeitado.

## Bloqueios antes da troca

- Confirmar destino e conta/projeto. Publicar preview sem alterar DNS e executar o teste HTTP remoto contra esse build.
- Validar na hospedagem as quatro variantes HTTP/HTTPS e www/sem www, com/sem barra e fontes de 301. A plataforma pode impor HTTPS antes das regras; verificar a ordem real. Não criar redirect de domínio www separado que introduza um salto antes do redirect de caminho; ambos os hosts devem atender pelo mesmo projeto.
- Conferir certificado para ambos os hosts, proteção de preview e headers. Noindex de preview não pode chegar à produção.
- Comparar uma exportação completa do Search Console/backlinks com o mapa; acrescentar URLs históricas ausentes individualmente.
- Fazer backup do WordPress, banco e uploads, preservando a HostGator para consulta e rollback. Preservar MX/SPF/DKIM/DMARC se alterar DNS. Nada foi excluído nesta tarefa.

## Depois da troca

1. Confirmar DNS e HTTPS, host final e cadeia de redirects; repetir o teste com §--base-url https://reecell.com.br§.
2. Conferir canonical, ausência de noindex em HTML/headers, robots permitido, sitemap 200 e inexistentes 404.
3. Manter a propriedade de domínio no Search Console, reenviar o sitemap e inspecionar artigos/serviços/arquivos/redirects. Com o domínio inalterado, não usar mudança de endereço apenas por trocar hospedagem.
4. Monitorar indexação, 404/soft-404/5xx, logs, cliques e impressões nas primeiras semanas. Tratar novas URLs antigas individualmente e manter os 301 enquanto houver referências.
5. Conferir imagens, navegação mobile, WhatsApp e e-mail; manter backup e plano de rollback.

Pode haver oscilações de rastreamento, indexação e ranking; não há garantia de ausência de oscilações.

## Matriz completa

“HTTP local” refere-se ao servidor de contrato, **não confirma Vercel/produção**. Versões [CSV](url-report.csv) e [JSON](url-report.json).

| URL antiga | URL final | Tratamento | Validação | Justificativa individual |
|---|---|---|---|---|
${rows.map(r => `| ${r.oldURL} | ${r.finalURL ?? '—'} | ${r.treatment} | ${r.validation} | ${r.reason.replaceAll('|','/')} |`).join('\n')}
`;
await writeFile(new URL('docs/seo-migration/REPORT.md', root), md.replaceAll('§', String.fromCharCode(96)));
console.log(`Relatório, CSV e JSON gerados com ${rows.length} entradas.`);
