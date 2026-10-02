import { readFile } from 'node:fs/promises';
export const migration = JSON.parse(await readFile(new URL('../src/data/legacy-migration.json', import.meta.url), 'utf8'));
export const origin = migration.origin;
const escaped = path => path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = path => `^${escaped(path)}$`;
const variants = path => path === '/' ? ['/', '/index.html'] : path.endsWith('/') ? [path, path.slice(0,-1), `${path}index.html`] : [path];
const allVariants = path => `^(?:${variants(path).map(escaped).join('|')})$`;
export function migrationRoutes() {
  const routes = [];
  const www = [{ type: 'host', value: 'www.reecell.com.br' }];
  const productionHttp = [{ type: 'host', value: 'reecell.com.br' }, { type: 'header', key: 'x-forwarded-proto', value: 'http' }];
  // Redirects combine host, old URL and slash normalization in a single hop.
  // Preview requests stay on their preview host unless they explicitly use www.
  for (const entry of migration.entries.filter(e => e.treatment === '301')) {
    const src = allVariants(entry.oldPath);
    for (const has of [www, productionHttp]) routes.push({ src, has, headers: { Location: origin + entry.finalPath }, status: 301 });
    routes.push({ src, headers: { Location: entry.finalPath }, status: 301 });
  }
  for (const entry of migration.entries.filter(e => e.treatment === 'preservada')) {
    const src = allVariants(entry.oldPath);
    for (const has of [www, productionHttp]) routes.push({ src, has, headers: { Location: origin + entry.finalPath }, status: 301 });
    const aliases = variants(entry.oldPath).filter(path => path !== entry.finalPath);
    routes.push({ src: `^(?:${aliases.map(escaped).join('|')})$`, headers: { Location: entry.finalPath }, status: 301 });
  }
  // Only normalizes host for unknown routes/assets, keeping the same path.
  routes.push({ src: '^/(.*)$', has: www, headers: { Location: `${origin}/$1` }, status: 301 });
  routes.push({ src: '^/(.*)$', has: productionHttp, headers: { Location: `${origin}/$1` }, status: 301 });
  // Explicit mapping prevents directory-index heuristics or implicit 308s.
  for (const entry of migration.entries.filter(e => e.treatment === 'preservada')) {
    routes.push({ src: exact(entry.finalPath), dest: `${entry.finalPath}index.html` });
  }
  routes.push({ src: '^/404(?:\.html|/)?$', dest: '/404.html', status: 404 });
  routes.push({ handle: 'filesystem' });
  routes.push({ src: '^/.*$', dest: '/404.html', status: 404 });
  return routes;
}

// Local contract evaluation, NOT an emulator of the Vercel edge network.
// The HTTP validator against a real preview is the deployment acceptance gate.
export function matchRoute(path, { host = 'localhost', protocol = 'https' } = {}) {
  for (const route of migrationRoutes()) {
    if (route.handle) return { filesystem: true };
    const matched = path.match(new RegExp(route.src));
    if (!matched) continue;
    if (route.has?.some(condition => condition.type === 'host' ? host !== condition.value : protocol !== condition.value)) continue;
    const expand = value => value?.replace(/\$(\d+)/g, (_, n) => matched[Number(n)] ?? '');
    return { status: route.status, location: expand(route.headers?.Location), dest: expand(route.dest) };
  }
  return { status: 404, dest: '/404.html' };
}
