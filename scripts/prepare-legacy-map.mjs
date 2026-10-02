import assert from 'node:assert/strict';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const source = JSON.parse(await readFile(new URL('docs/seo-migration/source/inventory.json', root), 'utf8'));
const crawl = JSON.parse(await readFile(new URL('docs/seo-migration/source/crawl.json', root), 'utf8'));
const supplied = (await readFile(new URL('docs/seo-migration/search-console-paths.txt', root), 'utf8')).trim().split(/\r?\n/);
const pathname = url => new URL(url, source.origin).pathname;
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#8211;', '–');
// Decisões explícitas: só estes sete arquivos de um único artigo repetem
// precisamente o assunto do artigo. Os assuntos mais amplos mantêm o arquivo.
const exactTags = new Map([
  ['iphone-nao-carrega', 'iphone-nao-carrega-causas-solucoes'],
  ['tela-trincada-do-celular', 'tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar'],
  ['celular-desligando-sozinho', 'celular-desligando-sozinho-bateria-sistema-placa'],
  ['conector-de-carga-com-defeito', 'conector-de-carga-com-defeito-sinais'],
  ['samsung-com-tela-verde', 'samsung-com-tela-verde-o-que-pode-ser'],
  ['tela-verde-samsung', 'samsung-com-tela-verde-o-que-pode-ser'],
  ['celular-nao-liga', 'celular-nao-liga-principais-causas'],
]);
const posts = new Map(source.posts.map(p => [p.id, p]));
const entries = [];
for (const page of crawl.pages) {
  assert.equal(page.status, 200, `Não decidir automaticamente URL indisponível: ${page.url}`);
  const oldPath = pathname(page.url);
  const tag = source.tags.find(t => pathname(t.link) === oldPath);
  const category = source.categories.find(c => oldPath === pathname(c.link) || oldPath.startsWith(pathname(c.link) + 'page/'));
  const isAuthor = oldPath.startsWith('/author/');
  const isArticle = source.posts.some(p => pathname(p.link) === oldPath);
  const kind = isArticle ? 'article' : tag ? 'tag' : category ? 'category' : isAuthor ? 'author' : 'page';
  const entry = { oldPath, finalPath: oldPath, treatment: 'preservada', kind, sources: ['WordPress HTTP 200', ...(source.sitemapUrls.includes(page.url) ? ['sitemap WordPress'] : []), ...(supplied.includes(oldPath) ? ['Search Console fornecido'] : [])], reason: isArticle ? 'Artigo já existe no Astro com a mesma data e slug; conteúdo atual mantido.' : 'Página existente preservada no mesmo endereço.' };
  if (oldPath === '/home-v3/') {
    Object.assign(entry, { treatment: '301', finalPath: '/', reason: 'Versão alternativa da página inicial; H1 antigo: Loja de celular em Bombinhas com assistência técnica. A Home atual cumpre a mesma finalidade.' });
  } else if (tag && exactTags.has(tag.slug)) {
    const post = source.posts.find(p => p.slug === exactTags.get(tag.slug));
    assert(post && page.postIds.length === 1 && page.postIds[0] === post.id, `Rever equivalência de ${oldPath}`);
    Object.assign(entry, { treatment: '301', finalPath: pathname(post.link), reason: `Arquivo “${tag.name}” contém somente o artigo de mesmo assunto, confirmado no WordPress. Consolidação direta nesse artigo.` });
  } else if (tag || category || isAuthor) {
    assert(page.postIds.length > 0, `Arquivo sem artigos: ${oldPath}`);
    const memberPaths = page.postIds.map(id => { assert(posts.has(id), `Post ausente: ${id}`); return pathname(posts.get(id).link); });
    const basePath = oldPath.replace(/page\/\d+\/$/, '');
    const siblings = crawl.pages.filter(p => pathname(p.url).replace(/page\/\d+\/$/, '') === basePath).map(p => pathname(p.url));
    siblings.sort((a,b) => Number(a.match(/\/page\/(\d+)\//)?.[1] ?? 1) - Number(b.match(/\/page\/(\d+)\//)?.[1] ?? 1));
    Object.assign(entry, { title: decode(page.h1[0] || tag?.name || category?.name), memberPaths, pagination: siblings.length > 1 ? siblings : [], reason: tag ? `Arquivo tem ${memberPaths.length} artigo(s) reais. O rótulo “${tag.name}” é mais amplo ou diferente de um artigo isolado; preservados os vínculos originais, sem redirecionar a serviço genérico.` : `Arquivo ${isAuthor ? 'de autor' : 'de categoria'} com ${memberPaths.length} artigos nesta página; associação, ordem e paginação confirmadas no HTML WordPress, incluindo categorias filhas.` });
  }
  entries.push(entry);
}
for (const oldPath of supplied) {
  if (!entries.some(e => e.oldPath === oldPath)) entries.push({ oldPath, finalPath: null, treatment: 'pendente', kind: 'unknown', sources: ['Search Console fornecido'], reason: 'URL não encontrada na coleta; exige revisão manual.' });
}
for (const req of source.requests.filter(r => r.status === 200 && /sitemap.*\.xml$/.test(r.url))) {
  const oldPath = pathname(req.url);
  if (oldPath !== '/sitemap.xml') entries.push({ oldPath, finalPath: '/sitemap.xml', treatment: '301', kind: 'sitemap', sources: ['sitemap WordPress'], reason: 'Sitemap legado substituído pelo sitemap XML único com as URLs finais.' });
}
entries.sort((a,b) => a.oldPath.localeCompare(b.oldPath));
assert.equal(new Set(entries.map(e => e.oldPath)).size, entries.length);
await writeFile(new URL('src/data/legacy-migration.json', root), JSON.stringify({ origin: source.origin, collectedAt: source.collectedAt, entries }, null, 2) + '\n');
// Registro de integridade: criado uma única vez antes de editar a implementação.
const hashes = {};
async function hashTree(dir) {
  for (const entry of await readdir(new URL(dir, root), { withFileTypes: true })) {
    const p = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await hashTree(p);
    else hashes[p] = createHash('sha256').update(await readFile(new URL(p, root))).digest('hex');
  }
}
await hashTree('src/content/blog');
await hashTree('src/styles');
try { await writeFile(new URL('docs/seo-migration/content-baseline.json', root), JSON.stringify(hashes, null, 2) + '\n', { flag: 'wx' }); }
catch (error) { if (error.code !== 'EEXIST') throw error; }
console.log(JSON.stringify({ mapped: entries.length, counts: entries.reduce((a,e) => ({...a,[e.treatment]:(a[e.treatment] ?? 0)+1}),{}) }));
