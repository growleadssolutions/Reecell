import assert from 'node:assert/strict';
import { readFile, readdir, access, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { migration, migrationRoutes, matchRoute, origin } from './seo-routing.mjs';
const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const fileFor = path => new URL(path.slice(1) + (path.endsWith('/') ? 'index.html' : ''), dist);
const read = path => readFile(new URL(path, root), 'utf8');
const routes = migration.entries;
const finals = new Set(routes.filter(e => e.treatment === 'preservada').map(e => e.finalPath));
const redirected = new Set(routes.filter(e => e.treatment === '301').map(e => e.oldPath));
const localResult = { checkedAt: new Date().toISOString(), layer: 'static-build-and-routing-contract', notDeploymentProof: true, results: [], images: 0, internalLinks: 0, contentHashes: 0 };
assert.equal(origin, 'https://reecell.com.br');
const config = JSON.parse(await read('vercel.json'));
assert.deepEqual(config.routes, migrationRoutes(), 'Configuração e mapa divergentes');
assert(!config.redirects && !config.rewrites && config.trailingSlash === undefined && !config.cleanUrls, 'Não misturar normalização automática com as regras exatas');
assert(config.routes.length < 1024, 'Limite de regras da hospedagem');
for (const path of (await read('docs/seo-migration/search-console-paths.txt')).trim().split(/\r?\n/)) assert(routes.some(e => e.oldPath === path), `URL fornecida sem tratamento: ${path}`);
for (const page of JSON.parse(await read('docs/seo-migration/source/crawl.json')).pages) assert(routes.some(e => e.oldPath === new URL(page.url).pathname), `URL descoberta sem tratamento: ${page.url}`);
for (const [path, hash] of Object.entries(JSON.parse(await read('docs/seo-migration/content-baseline.json')))) {
  assert.equal(createHash('sha256').update(await readFile(new URL(path, root))).digest('hex'), hash, `Conteúdo/estilo existente alterado: ${path}`);
  localResult.contentHashes++;
}
for (const entry of routes) {
  assert(entry.treatment !== 'pendente', `Pendência: ${entry.oldPath}`);
  await access(fileFor(entry.finalPath));
  assert(!redirected.has(entry.finalPath), `Cadeia ou loop: ${entry.oldPath}`);
  if (entry.treatment === '301') {
    assert.notEqual(entry.oldPath, entry.finalPath);
    const match = matchRoute(entry.oldPath);
    assert.equal(match.status, 301);
    assert.equal(match.location, entry.finalPath);
    await assert.rejects(access(fileFor(entry.oldPath)), `Fonte de redirect também gera página: ${entry.oldPath}`);
  } else {
    assert.equal(entry.oldPath, entry.finalPath);
    const html = await readFile(fileFor(entry.finalPath), 'utf8');
    assert(html.includes(`rel="canonical" href="${origin}${entry.finalPath}"`), `Canonical: ${entry.finalPath}`);
    assert(!/noindex/i.test(html), `Noindex: ${entry.finalPath}`);
    assert(!matchRoute(entry.finalPath).location, `Página final redireciona: ${entry.finalPath}`);
    for (const path of entry.memberPaths ?? []) assert(html.includes(`href="${path}"`), `Artigo perdido no arquivo: ${entry.oldPath}: ${path}`);
  }
  const variants = entry.oldPath === '/' ? ['/', '/index.html'] : entry.oldPath.endsWith('/') ? [entry.oldPath, entry.oldPath.slice(0,-1), `${entry.oldPath}index.html`] : [entry.oldPath];
  for (const path of variants) {
    for (const host of ['reecell.com.br', 'www.reecell.com.br']) {
      for (const protocol of ['https', 'http']) {
        const result = matchRoute(path, { host, protocol });
        const needsRedirect = entry.treatment === '301' || host.startsWith('www.') || protocol === 'http' || path !== entry.finalPath;
        if (needsRedirect) {
          assert.equal(result.status, 301, `${host} ${protocol} ${path}`);
          const location = new URL(result.location, origin);
          assert.equal(location.href, origin + entry.finalPath, `Destino direto: ${path}`);
          assert(!matchRoute(location.pathname, { host: location.host, protocol: location.protocol.slice(0,-1) }).location, `Cadeia: ${path}`);
        }
      }
    }
  }
  localResult.results.push({ oldPath: entry.oldPath, finalPath: entry.finalPath, treatment: entry.treatment, result: entry.treatment === 'preservada' ? 'HTML final, canonical, indexação e conteúdo do arquivo OK' : 'Regra 301 direta e destino existente OK; HTTP da hospedagem pendente' });
}
const sitemap = await read('dist/sitemap.xml');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
assert.equal(locations.length, new Set(locations).size, 'Sitemap com duplicação');
assert.deepEqual(new Set(locations), new Set([...finals].map(path => origin + path)), 'Sitemap deve conter apenas todas as páginas finais indexáveis');
const robots = await read('dist/robots.txt');
assert.match(robots, /User-agent: \*/);
assert.match(robots, /Allow: \//);
assert(!/^Disallow:\s*\//m.test(robots));
assert(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : new URL(e.name, dir)))).flat();
}
const htmlFiles = (await walk(dist)).filter(f => f.pathname.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert(!/http-equiv=["']refresh/i.test(html), `Meta refresh: ${file}`);
  assert(!/(localhost|127\.0\.0\.1|\.vercel\.app)/i.test(html), `Referência de preview: ${file}`);
  assert(!/wp-content\/|hostgator/i.test(html), `Dependência legada: ${file}`);
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    const url = new URL(match[1].replaceAll('&amp;', '&'), origin);
    assert.equal(url.origin, origin, `Imagem remota: ${url}`);
    await access(fileFor(url.pathname)); localResult.images++;
  }
  for (const match of html.matchAll(/\bhref="([^"]+)"/g)) {
    if (/^(?:mailto:|tel:|data:)/.test(match[1])) continue;
    const url = new URL(match[1].replaceAll('&amp;', '&'), origin);
    if (!['reecell.com.br', 'www.reecell.com.br'].includes(url.hostname)) continue;
    // Canonical da página de erro não representa uma página indexável.
    if (file.pathname.endsWith('/404.html') && url.pathname === '/404/') continue;
    assert.equal(url.origin, origin, `Host/protocolo interno não canônico: ${url}`);
    assert(!redirected.has(url.pathname), `Link interno aponta para redirect: ${url}`);
    if (!match[1].startsWith('#')) await access(fileFor(url.pathname));
    localResult.internalLinks++;
  }
}
const html404 = await read('dist/404.html');
assert.match(html404, /noindex, follow/);
localResult.pages = htmlFiles.length;
localResult.sitemapUrls = locations.length;
localResult.hostgatorImageDependencies = 0;
await writeFile(new URL('docs/seo-migration/local-validation.json', root), JSON.stringify(localResult, null, 2) + '\n');
console.log(`SEO OK: ${routes.length} URLs legadas, ${locations.length} URLs finais no sitemap, ${htmlFiles.length} HTMLs, ${localResult.images} imagens locais, ${localResult.contentHashes} hashes preservados. Não comprova a hospedagem.`);
