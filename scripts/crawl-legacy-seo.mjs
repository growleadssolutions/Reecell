import { readFile, writeFile } from 'node:fs/promises';
const folder = new URL('../docs/seo-migration/source/', import.meta.url);
const inventory = JSON.parse(await readFile(new URL('inventory.json', folder), 'utf8'));
const origin = inventory.origin;
const queue = [...inventory.sitemapUrls, `${origin}/category/uncategorized/page/3/`];
const seen = new Set();
const pages = [];
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&#038;', '&');
while (queue.length && seen.size < 200) {
  const batch = queue.splice(0, 4).filter(url => !seen.has(url));
  for (const url of batch) seen.add(url);
  await Promise.all(batch.map(async url => {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
      const html = await response.text();
      const links = [...html.matchAll(/href=["']([^"']+)["']/g)].map(m => decode(m[1]));
      const pagination = [...new Set(links.filter(link => link.startsWith(origin + '/') && /\/page\/\d+\/$/.test(link)))];
      queue.push(...pagination.filter(link => !seen.has(link) && !queue.includes(link)));
      const postIds = [...new Set([...html.matchAll(/<article[^>]*\bid=["']post-(\d+)["']/g)].map(m => Number(m[1])))];
      pages.push({ url, status: response.status, finalUrl: response.url, title: html.match(/<title>([\s\S]*?)<\/title>/)?.[1], canonical: html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/)?.[1], h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/g)].map(m => m[1].replace(/<[^>]+>/g, '')), postIds, pagination });
    } catch (error) { pages.push({ url, error: String(error), cause: String(error.cause ?? '') }); }
  }));
}
pages.sort((a,b) => a.url.localeCompare(b.url));
const result = { collectedAt: new Date().toISOString(), pages };
await writeFile(new URL('crawl.json', folder), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ count: pages.length, failures: pages.filter(p => p.status !== 200), paginated: pages.filter(p => /\/page\//.test(p.url)) }, null, 2));
