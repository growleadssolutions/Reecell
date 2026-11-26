import { readFile, readdir } from 'node:fs/promises';
export const migration = JSON.parse(await readFile(new URL('../src/data/legacy-migration.json', import.meta.url), 'utf8'));
export const origin = migration.origin;
// IDs e destinos extraídos do backup da API WordPress em source/posts-1.json.
export const legacyPostIds = JSON.parse(await readFile(new URL('../src/data/legacy-post-ids.json', import.meta.url), 'utf8'));
// Artigos novos não são URLs legadas. Derivar suas rotas do conteúdo publicado
// mantém o inventário histórico intacto e inclui futuras publicações no contrato.
const blogDirectory = new URL('../src/content/blog/', import.meta.url);
const articlePaths = [];
for (const file of (await readdir(blogDirectory)).filter(file => file.endsWith('.md')).sort()) {
  const source = await readFile(new URL(file, blogDirectory), 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!frontmatter || !/^draft: false\s*$/m.test(frontmatter)) continue;
  const field = name => JSON.parse(frontmatter.match(new RegExp(`^${name}: (.+)$`, 'm'))?.[1] ?? 'null');
  const date = field('permalinkDate');
  const slug = field('slug');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !slug || /[\s/?#\\]/.test(slug)) throw new Error(`Permalink inválido: ${file}`);
  articlePaths.push(`/${date.replaceAll('-', '/')}/${slug}/`);
}
if (new Set(articlePaths).size !== articlePaths.length) throw new Error('URLs de artigos duplicadas');
const legacyPaths = new Set(migration.entries.map(entry => entry.oldPath));
export const editorialEntries = articlePaths.filter(path => !legacyPaths.has(path)).map(path => ({ oldPath: path, finalPath: path, treatment: 'preservada', kind: 'article' }));
export const contentEntries = [...migration.entries, ...editorialEntries];
const escaped = path => path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exact = path => `^${escaped(path)}$`;
const variants = path => path === '/' ? ['/', '/index.html'] : path.endsWith('/') ? [path, path.slice(0,-1), `${path}index.html`] : [path];
const allVariants = path => `^(?:${variants(path).map(escaped).join('|')})$`;
export function migrationRoutes({ includeEditorial = true, includeLegacyQuery = true } = {}) {
  const entries = includeEditorial ? contentEntries : migration.entries;
  const routes = [];
  const www = [{ type: 'host', value: 'www.reecell.com.br' }];
  const productionHttp = [{ type: 'host', value: 'reecell.com.br' }, { type: 'header', key: 'x-forwarded-proto', value: 'http' }];
  if (includeLegacyQuery) for (const [id, destination] of Object.entries(legacyPostIds)) {
    if (!entries.some(entry => entry.finalPath === destination && entry.treatment === 'preservada')) throw new Error(`Destino de ID legado ausente: ${id}`);
    const query = { type: 'query', key: 'p', value: `^${id}$` };
    for (const has of [www, productionHttp]) routes.push({ src: '^/(?:index\\.html)?$', has: [...has, query], headers: { Location: origin + destination }, status: 301 });
    routes.push({ src: '^/(?:index\\.html)?$', has: [query], headers: { Location: destination }, status: 301 });
  }
  // Redirects combine host, old URL and slash normalization in a single hop.
  // Preview requests stay on their preview host unless they explicitly use www.
  for (const entry of entries.filter(e => e.treatment === '301')) {
    const src = allVariants(entry.oldPath);
    for (const has of [www, productionHttp]) routes.push({ src, has, headers: { Location: origin + entry.finalPath }, status: 301 });
    routes.push({ src, headers: { Location: entry.finalPath }, status: 301 });
  }
  for (const entry of entries.filter(e => e.treatment === 'preservada')) {
    const src = allVariants(entry.oldPath);
    for (const has of [www, productionHttp]) routes.push({ src, has, headers: { Location: origin + entry.finalPath }, status: 301 });
    const aliases = variants(entry.oldPath).filter(path => path !== entry.finalPath);
    routes.push({ src: `^(?:${aliases.map(escaped).join('|')})$`, headers: { Location: entry.finalPath }, status: 301 });
  }
  // Only normalizes host for unknown routes/assets, keeping the same path.
  routes.push({ src: '^/(.*)$', has: www, headers: { Location: `${origin}/$1` }, status: 301 });
  routes.push({ src: '^/(.*)$', has: productionHttp, headers: { Location: `${origin}/$1` }, status: 301 });
  // Explicit mapping prevents directory-index heuristics or implicit 308s.
  for (const entry of entries.filter(e => e.treatment === 'preservada')) {
    routes.push({ src: exact(entry.finalPath), dest: `${entry.finalPath}index.html` });
  }
  routes.push({ src: '^/404(?:\.html|/)?$', dest: '/404.html', status: 404 });
  routes.push({ handle: 'filesystem' });
  routes.push({ src: '^/.*$', dest: '/404.html', status: 404 });
  return routes;
}

// Local contract evaluation, NOT an emulator of the Vercel edge network.
// The HTTP validator against a real preview is the deployment acceptance gate.
export function matchRoute(path, { host = 'localhost', protocol = 'https', searchParams = new URLSearchParams() } = {}) {
  for (const route of migrationRoutes()) {
    if (route.handle) return { filesystem: true };
    const matched = path.match(new RegExp(route.src));
    if (!matched) continue;
    if (route.has?.some(condition => condition.type === 'host' ? host !== condition.value : condition.type === 'query' ? !new RegExp(condition.value).test(searchParams.get(condition.key) ?? '') : protocol !== condition.value)) continue;
    const expand = value => value?.replace(/\$(\d+)/g, (_, n) => matched[Number(n)] ?? '');
    return { status: route.status, location: expand(route.headers?.Location), dest: expand(route.dest) };
  }
  return { status: 404, dest: '/404.html' };
}
