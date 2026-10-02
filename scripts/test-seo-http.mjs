import { createServer } from 'node:http';
import { readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { migration, matchRoute, origin } from './seo-routing.mjs';

const root = new URL('../', import.meta.url);
const dist = path.resolve(fileURLToPath(new URL('dist/', root)));
const baseOption = process.argv.indexOf('--base-url');
const live = baseOption !== -1;
const baseUrl = live ? new URL(process.argv[baseOption + 1]) : undefined;
if (live && (!baseUrl || !['http:', 'https:'].includes(baseUrl.protocol))) throw new Error('Informe --base-url https://preview-real');
let server;
let base = baseUrl?.origin;
if (!live) {
  // Servidor de contrato local, não é a Vercel e não substitui o gate remoto.
  server = createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const rule = matchRoute(url.pathname, { host: req.headers.host?.split(':')[0], protocol: req.headers['x-forwarded-proto'] ?? 'https' });
    if (rule.location) { res.writeHead(rule.status, { Location: rule.location + url.search }); res.end(); return; }
    let target = path.resolve(dist, '.' + (rule.dest ?? url.pathname));
    if (!target.startsWith(dist + path.sep) && target !== dist) { res.writeHead(400); res.end(); return; }
    let status = rule.status ?? 200;
    try { if ((await stat(target)).isDirectory()) target = path.join(target, 'index.html'); await stat(target); }
    catch { target = path.join(dist, '404.html'); status = 404; }
    try {
      const content = await readFile(target);
      const type = target.endsWith('.html') ? 'text/html; charset=utf-8' : target.endsWith('.xml') ? 'application/xml' : 'text/plain';
      res.writeHead(status, { 'Content-Type': type }); res.end(content);
    } catch { res.writeHead(500); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
}
const output = { checkedAt: new Date().toISOString(), layer: live ? 'remote-hosting-http' : 'local-contract-http-NOT-Vercel', base, deploymentValidated: live, results: [], failures: [] };
const headers = process.env.VERCEL_AUTOMATION_BYPASS_SECRET ? { 'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET } : {};
async function request(route, extraHeaders = {}) {
  return fetch(new URL(route, base), { redirect: 'manual', headers: { ...headers, ...extraHeaders }, signal: AbortSignal.timeout(20000) });
}
async function check(entry, variant = entry.oldPath) {
  const first = await request(variant);
  const location = first.headers.get('location');
  const expected = entry.treatment === '301' || variant !== entry.finalPath ? 301 : 200;
  const result = { oldPath: variant, finalPath: entry.finalPath, expected, status: first.status, location, ok: first.status === expected };
  let response = first;
  if (expected === 301) {
    const destination = location ? new URL(location, base) : null;
    result.ok &&= destination?.pathname === entry.finalPath;
    // Do not follow a preview redirect to the old live WordPress and call it a pass.
    result.ok &&= destination?.origin === base;
    response = await request(entry.finalPath);
    result.finalStatus = response.status;
    result.ok &&= response.status === 200 && !response.headers.get('location');
  }
  const body = await response.text();
  if (entry.kind !== 'sitemap') {
    result.canonicalOK = body.includes(`rel="canonical" href="${origin}${entry.finalPath}"`);
    result.noindex = /<meta[^>]+name=["']robots["'][^>]+noindex/i.test(body) || /noindex/i.test(response.headers.get('x-robots-tag') ?? '');
    result.ok &&= result.canonicalOK;
    if (base === origin) result.ok &&= !result.noindex;
    if (!live) result.ok &&= !result.noindex;
  }
  output.results.push(result);
  if (!result.ok) output.failures.push(result);
}
try {
  for (const entry of migration.entries) {
    await check(entry);
    if (entry.oldPath !== '/' && entry.oldPath.endsWith('/')) await check(entry, entry.oldPath.slice(0,-1));
  }
  for (const route of ['/url-inexistente-teste-seo/', '/tag/nao-existe/', '/category/uncategorized/page/999/', '/blog/slug-inexistente/', '/404.html']) {
    const response = await request(route);
    const body = await response.text();
    const result = { oldPath: route, expected: 404, status: response.status, ok: response.status === 404 && /noindex/.test(body) };
    output.results.push(result); if (!result.ok) output.failures.push(result);
  }
  const sitemapResponse = await request('/sitemap.xml');
  const sitemap = await sitemapResponse.text();
  const sitemapPaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const expectedPaths = migration.entries.filter(e => e.treatment === 'preservada').map(e => origin + e.finalPath).sort();
  output.sitemapOK = sitemapResponse.status === 200 && JSON.stringify(sitemapPaths.sort()) === JSON.stringify(expectedPaths);
  const robotsResponse = await request('/robots.txt');
  const robots = await robotsResponse.text();
  output.robotsOK = robotsResponse.status === 200 && robots.includes(`Sitemap: ${origin}/sitemap.xml`) && !/^Disallow:\s*\//m.test(robots);
  if (!output.sitemapOK || !output.robotsOK) output.failures.push({ sitemapOK: output.sitemapOK, robotsOK: output.robotsOK });
} catch (error) {
  output.failures.push({ error: error instanceof Error ? error.message : String(error) });
} finally {
  if (server) await new Promise(resolve => server.close(resolve));
  output.deploymentValidated = live && output.failures.length === 0;
  await writeFile(new URL(`docs/seo-migration/${live ? 'hosting' : 'http-contract'}-validation.json`, root), JSON.stringify(output, null, 2) + '\n');
}
console.log(JSON.stringify({ layer: output.layer, checks: output.results.length, deploymentValidated: output.deploymentValidated, failures: output.failures }, null, 2));
if (output.failures.length) process.exitCode = 1;
