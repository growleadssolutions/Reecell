import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { contentEntries, legacyPostIds, matchRoute, origin } from './seo-routing.mjs';

const paths = [...new Set(contentEntries.filter(e => e.treatment === 'preservada').map(e => e.finalPath))];
const priorityPages = JSON.parse(await readFile('docs/seo/public-priority-validation.json', 'utf8')).priorityPages;
for (const page of priorityPages) {
  const html = await readFile(`dist${page.path}index.html`, 'utf8');
  assert(html.includes(`<title>${page.title}</title>`), `Title prioritário alterado: ${page.path}`);
  assert(html.includes(`rel="canonical" href="${page.canonical}"`), `Canonical prioritário alterado: ${page.path}`);
  assert(paths.includes(page.path), `URL prioritária removida: ${page.path}`);
}
const pages = new Map();
const titles = new Set();
let authors = 0, editorialOrganizations = 0, localArticleLinks = 0, internalFragmentChecks = 0;
for (const path of paths) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title), `Título ausente/duplicado: ${path}`);
  titles.add(title);
  const links = [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => new URL(m[1].replaceAll('&amp;', '&'), origin + path)).filter(url => url.origin === origin);
  pages.set(path, links.map(url => url.pathname));
  for (const url of links.filter(url => url.pathname === path && url.hash)) {
    assert(html.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `Âncora quebrada: ${url}`);
    internalFragmentChecks++;
  }
  const visible = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<[^>]+>/g, ' ');
  assert(!/[\p{L}]\?[\p{L}]|\uFFFD/u.test(visible), `Texto corrompido: ${path}`);
  if (/^\/\d{4}\//.test(path)) {
    assert(html.includes('class="article-local"'), `Artigo sem atendimento local: ${path}`);
    assert(links.some(url => /\/(conserto|troca-de-tela|troca-de-bateria)-.*bombinhas\/$/.test(url.pathname)), `Artigo sem serviço: ${path}`);
    localArticleLinks++;
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const graph = JSON.parse(match[1])['@graph'];
    const local = graph.find(node => node['@type'] === 'LocalBusiness');
    assert.equal(local.address.addressLocality, 'Bombinhas');
    assert.equal(local.areaServed.name, 'Bombinhas');
    const article = graph.find(node => node['@type'] === 'Article');
    if (article?.author) {
      if (article.author['@type'] === 'Organization') {
        assert.equal(article.author['@id'], `${origin}/#organization`);
        assert.equal(article.author.name, 'ReeCell');
        assert(html.includes('rel="author"'));
        editorialOrganizations++;
        continue;
      }
      assert.equal(article.author.name, 'Gabriel Souza');
      assert(html.includes('rel="author"'));
      assert(!path.startsWith('/2026/10/06/'), 'Não atribuir autoria histórica aos artigos novos');
      authors++;
    }
  }
}
const distance = new Map([['/', 0]]);
const queue = ['/'];
for (let i = 0; i < queue.length; i++) for (const target of pages.get(queue[i]) ?? []) {
  if (pages.has(target) && !distance.has(target)) {
    distance.set(target, distance.get(queue[i]) + 1); queue.push(target);
  }
}
const unreachable = paths.filter(path => !distance.has(path));
assert.deepEqual(unreachable, [], 'Páginas órfãs na navegação');
assert.equal(authors, Object.keys(legacyPostIds).length);
assert.equal(localArticleLinks, paths.filter(path => /^\/\d{4}\//.test(path)).length);
for (const [id, destination] of Object.entries(legacyPostIds)) {
  for (const host of ['reecell.com.br', 'www.reecell.com.br', 'preview.example']) for (const protocol of ['http', 'https']) {
    const route = matchRoute('/', { host, protocol, searchParams: new URLSearchParams(`p=${id}&utm_source=test`) });
    assert.equal(route.status, 301);
    assert.equal(new URL(route.location, `https://${host}`).pathname, destination);
  }
}
for (const query of ['', 'utm_source=test', 'p=999999', 'p=4310', 'p=invalid']) {
  assert(!matchRoute('/', { searchParams: new URLSearchParams(query) }).location, `Redirect indevido: ${query}`);
}
const report = { checkedAt: new Date().toISOString(), layer: 'local-build', deploymentValidated: false, pages: pages.size, priorityURLsAndTitlesPreserved: priorityPages.length, uniqueTitles: titles.size, authors, editorialOrganizations, localArticleLinks, internalFragmentChecks, unreachable, maxClicksFromHome: Math.max(...distance.values()), legacyIds: Object.keys(legacyPostIds).length, failures: [] };
await writeFile('docs/otimizacao-2026-11-25/validation.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
