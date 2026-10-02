import { mkdir, writeFile } from 'node:fs/promises';

const origin = 'https://reecell.com.br';
const output = new URL('../docs/seo-migration/source/', import.meta.url);
await mkdir(output, { recursive: true });
const audit = { collectedAt: new Date().toISOString(), origin, requests: [], sitemapUrls: [], posts: [], pages: [], tags: [], categories: [] };
async function get(path, name) {
  const url = new URL(path, origin);
  if (url.origin !== origin) throw new Error(`Unexpected origin: ${url}`);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    const body = await response.text();
    audit.requests.push({ url: url.href, status: response.status, finalUrl: response.url });
    await writeFile(new URL(name, output), body);
    return { response, body };
  } catch (error) {
    audit.requests.push({ url: url.href, error: String(error), cause: String(error.cause ?? '') });
    return null;
  }
}
await get('/robots.txt', 'robots.txt');
const queue = ['/sitemap_index.xml'];
const visited = new Set();
while (queue.length && visited.size < 30) {
  const path = queue.shift();
  if (visited.has(path)) continue;
  visited.add(path);
  const result = await get(path, `sitemap-${visited.size}.xml`);
  if (!result?.response.ok) continue;
  const locations = [...result.body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map(m => m[1].replaceAll('&amp;', '&'));
  if (result.body.includes('<sitemapindex')) queue.push(...locations);
  else audit.sitemapUrls.push(...locations);
}
if (!audit.sitemapUrls.length) {
  const fallback = await get('/wp-sitemap.xml', 'wp-sitemap.xml');
  if (fallback?.response.ok) audit.fallbackSitemap = fallback.body;
}
for (const kind of ['posts', 'pages', 'tags', 'categories']) {
  const fields = kind === 'posts' ? 'id,link,slug,title,content,excerpt,categories,tags,date,modified' : kind === 'pages' ? 'id,link,slug,title' : 'id,link,slug,name,count,description';
  let totalPages = 1;
  for (let page = 1; page <= totalPages; page++) {
    const result = await get(`/wp-json/wp/v2/${kind}?per_page=100&page=${page}&_fields=${fields}`, `${kind}-${page}.json`);
    if (!result?.response.ok) break;
    try {
      const entries = JSON.parse(result.body);
      if (!Array.isArray(entries)) throw new Error('Expected array');
      audit[kind].push(...entries);
      totalPages = Number(result.response.headers.get('x-wp-totalpages') ?? 1);
    } catch (error) { audit.requests.at(-1).parseError = String(error); break; }
  }
}
audit.sitemapUrls = [...new Set(audit.sitemapUrls)].sort();
await writeFile(new URL('inventory.json', output), JSON.stringify(audit, null, 2) + '\n');
console.log(JSON.stringify({ requests: audit.requests, sitemapUrls: audit.sitemapUrls, counts: Object.fromEntries(['posts','pages','tags','categories'].map(k => [k, audit[k].length])) }, null, 2));
if (!audit.sitemapUrls.length && !audit.posts.length) process.exitCode = 1;
