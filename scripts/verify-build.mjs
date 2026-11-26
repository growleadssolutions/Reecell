import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';
import { business } from '../src/data/business.ts';

const root = new URL('../dist/', import.meta.url);
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(new URL(`${e.name}/`, dir)) : new URL(e.name, dir)))).flat();
}
const files = await walk(root);
const htmlFiles = files.filter(f => f.pathname.endsWith('.html'));
assert(!htmlFiles.some(f => f.pathname.includes('__teste-')), 'Fixture de migração encontrada no build final');
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${file}: H1`);
  assert.equal((html.match(/<link\b[^>]*\brel="canonical"/g) ?? []).length, 1, `${file}: canonical`);
  assert.match(html, /<html lang="pt-BR"/);
  assert.match(html, /name="description" content="[^"]+"/);
  assert.match(html, /https:\/\/reecell\.com\.br/);
  assert.equal((html.match(/https:\/\/www\.googletagmanager\.com\/gtm\.js\?id=GTM-5WFKFJ6P/g) ?? []).length, 1, `${file}: GTM loader`);
  assert.match(html, /event: 'gtm\.js'/, `${file}: dataLayer bootstrap`);
  assert.match(html, /gtag\('js', new Date\(\)\)/, `${file}: gtag bootstrap`);
  for (const script of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    if (script[1].includes('type="application/ld+json"')) continue;
    const src = script[1].match(/src="([^"]+)"/)?.[1];
    if (src === 'https://www.googletagmanager.com/gtm.js?id=GTM-5WFKFJ6P') continue;
    if (!script[1].includes('type="module"')) {
      assert.match(script[2], /dataLayer|gtag\(/, 'Script inline inesperado');
      continue;
    }
    assert(script[1].includes('type="module"') && (!src || (src.startsWith('/_astro/') && src.endsWith('.js'))), 'Somente módulo local de eventos esperado');
    const js = src ? await readFile(new URL(src.slice(1), root), 'utf8') : script[2];
    assert(js.includes('reecell:analytics-consent'), 'Módulo inesperado');
    assert(Buffer.byteLength(js) < 6000, 'Revisar aumento do bundle de eventos');
    assert(!/fetch\(|sendBeacon|localStorage|document\.cookie/.test(js), 'Coleta externa/storage não autorizada');
  }
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const graph = JSON.parse(match[1])['@graph'];
    assert(Array.isArray(graph));
    const ids = graph.map(node => node['@id']);
    assert.equal(ids.length, new Set(ids).size, 'IDs duplicados no graph');
  }
  for (const match of html.matchAll(/href="(\/[^"\s]*)"/g)) {
    const url = new URL(match[1], 'https://reecell.com.br');
    const target = url.pathname.endsWith('/') ? `${url.pathname}index.html` : url.pathname;
    const targetURL = new URL(target.slice(1), root);
    await access(targetURL);
    if (url.hash) {
      const targetHTML = await readFile(targetURL, 'utf8');
      assert(targetHTML.includes(`id="${url.hash.slice(1)}"`), `Âncora ausente: ${match[1]}`);
    }
  }
}
const home = await readFile(new URL('index.html', root), 'utf8');
for (const match of home.matchAll(/href="(https:\/\/wa\.me\/[^\"]+)"/g)) {
  const url = new URL(match[1].replace(/&amp;/g, '&'));
  assert.equal(url.pathname, `/${business.whatsapp}`);
  assert(url.searchParams.get('text')?.trim(), 'CTA sem mensagem contextual');
}
assert.match(home, /name="robots" content="index, follow"/);
assert.match(await readFile(new URL('404.html', root), 'utf8'), /noindex, follow/);
const sitemap = await readFile(new URL('sitemap.xml', root), 'utf8');
// Contrato com as URLs publicadas no WordPress: não derivar do cadastro,
// para detectar uma alteração acidental de slug durante a migração.
for (const path of [
  '/troca-de-bateria-de-celular-em-bombinhas/',
  '/troca-de-tela-de-celular-em-bombinhas/',
  '/conserto-de-celular-em-bombinhas/',
  '/contato-reecell-bombinhas/',
]) {
  const html = await readFile(new URL(`${path.slice(1)}index.html`, root), 'utf8');
  assert(html.includes(`rel="canonical" href="https://reecell.com.br${path}"`), `Canonical original ausente: ${path}`);
  assert.match(html, /name="robots" content="index, follow"/);
  assert(sitemap.includes(`<loc>https://reecell.com.br${path}</loc>`), `URL original ausente no sitemap: ${path}`);
}
assert(!sitemap.includes('/404'));
assert.match(sitemap, /<loc>https:\/\/reecell\.com\.br\/<\/loc>/);
assert.match(await readFile(new URL('robots.txt', root), 'utf8'), /Sitemap: https:\/\/reecell\.com\.br\/sitemap.xml/);
const fonts = files.filter(f => f.pathname.endsWith('.woff2'));
assert(fonts.length >= 2, 'As duas fontes precisam existir no build');
console.log(`Verificação OK: ${htmlFiles.length} páginas, canonical, robots, JSON-LD, links, âncoras e ${fonts.length} fontes locais. Módulo local de eventos condicionado a consentimento, sem transmissão.`);
