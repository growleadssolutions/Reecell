import { readFile, readdir, writeFile, mkdir, stat } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { contentEntries } from './seo-routing.mjs';
const origin = 'https://reecell.com.br';
const output = 'docs/seo';
await mkdir(output, { recursive: true });
const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const text = s => decode(s.replace(/<[^>]*>/g, '').trim());
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]));
const posts = new Map();
for (const filename of (await readdir('src/content/blog')).filter(f => f.endsWith('.md'))) {
  const source = await readFile(`src/content/blog/${filename}`, 'utf8');
  const field = key => source.match(new RegExp(`^${key}: "(.*)"$`, 'm'))?.[1];
  posts.set(`/${field('permalinkDate')?.replaceAll('-', '/')}/${field('slug')}/`, {
    file: filename, keyword: field('primaryKeyword'), category: field('category'),
    date: field('publishedDate'), headings: [...source.matchAll(/^## (.*)$/gm)].map(m => m[1]),
    introduction: source.split(/\r?\n---\r?\n/)[1]?.trim().split(/\r?\n\r?\n/).slice(0, 2).join(' '),
  });
}
const pages = [];
for (const path of [...new Set(contentEntries.filter(e => e.treatment === 'preservada').map(e => e.finalPath))]) {
  const html = await readFile(`dist${path}index.html`, 'utf8');
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attributes(m[0]));
  const meta = name => metas.find(m => (m.name ?? m.property) === name)?.content;
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
  const links = [...new Set([...main.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(m => decode(m[1])).filter(h => h.startsWith('/') && !h.startsWith('//')))];
  const headings = [...main.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map(m => ({ level: Number(m[1]), text: text(m[2]) }));
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(m => ({ ...(/\salt(?:\s|>|=)/.test(m[0]) ? { alt: '' } : {}), ...attributes(m[0]) }));
  const styles = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attributes(m[0])).filter(a => a.rel === 'stylesheet').map(a => a.href);
  const scripts = [...html.matchAll(/<script\b[^>]*src="([^"]+)"/g)].map(m => m[1]);
  const resources = await Promise.all([...new Set([...styles, ...scripts])].map(async src => {
    const data = await readFile(`dist${src}`); return { src, bytes: data.length, gzipBytes: gzipSync(data).length };
  }));
  for (const match of html.matchAll(/<script type="module">([\s\S]*?)<\/script>/g)) resources.push({ src: 'inline-module.js', bytes: Buffer.byteLength(match[1]), gzipBytes: gzipSync(match[1]).length });
  const article = posts.get(path);
  const kind = article ? 'Artigo informativo' : path === '/' ? 'Comercial local geral' : path === '/blog/' ? 'Hub editorial' : path.includes('contato') ? 'Contato e localização' : path.startsWith('/tag/') || path.startsWith('/category/') || path.startsWith('/author/') ? 'Arquivo editorial' : 'Serviço comercial';
  pages.push({ path, kind, title: text(html.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? ''), description: meta('description'), canonical: attributes(html.match(/<link[^>]*rel="canonical"[^>]*>/)?.[0] ?? '').href, robots: meta('robots'), ogURL: meta('og:url'), twitterCard: meta('twitter:card'), language: html.match(/<html[^>]*lang="([^"]+)"/)?.[1], headings, links, images, resources, htmlBytes: Buffer.byteLength(html), article,
    schemas: [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap(m => JSON.parse(m[1])['@graph'].map(n => n['@type'])),
    findings: [!meta('description') && 'Meta description ausente', headings.filter(h => h.level === 1).length !== 1 && 'Quantidade inválida de H1', images.some(i => i.alt === undefined) && 'Alt ausente', images.some(i => !i.width || !i.height) && 'Dimensões de imagem ausentes', headings.some((h, i) => i && h.level > headings[i-1].level + 1) && 'Salto na hierarquia de headings'].filter(Boolean),
  });
}
const duplicateDescriptions = pages.filter((p, i) => pages.findIndex(other => other.description === p.description) !== i).map(p => p.path);
const report = { checkedAt: new Date().toISOString(), source: 'local static build; not indexation or field performance', pages, duplicateDescriptions };
await writeFile(`${output}/inventory.json`, JSON.stringify(report, null, 2) + '\n');
const cell = value => String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
let map = '# Mapa de intenção e metadados\n\nGerado por `node scripts/report-seo-inventory.mjs` a partir do HTML final. Não representa volume de pesquisa ou canonical escolhido pelo Google.\n\n';
map += '| URL | Intenção | Palavra-chave principal / tema | Variações semânticas | Title | H1 | Links no conteúdo | Oportunidade |\n|---|---|---|---|---|---|---|---|\n';
for (const p of pages) {
  const h1 = p.headings.find(h => h.level === 1)?.text;
  const variants = p.article ? p.article.headings.slice(0, 3).join('; ') : p.kind.includes('comercial') || p.path === '/' ? 'Bombas (bairro); Bombinhas (município); avaliação; orçamento' : p.kind;
  const opportunity = p.article ? 'Preservar intenção; medir consultas e contato local separadamente' : p.kind === 'Arquivo editorial' ? 'Preservar URL; avaliar utilidade sem presumir canibalização' : 'Facilitar contato; medir visitas e cliques comerciais';
  map += `| ${[p.path, p.kind, p.article?.keyword ?? h1, variants, p.title, h1, p.links.join(' · '), opportunity].map(cell).join(' | ')} |\n`;
}
await writeFile(`${output}/SEO-KEYWORD-MAP.md`, map);
console.log(JSON.stringify({ pages: pages.length, findings: pages.filter(p => p.findings.length).map(p => ({ path:p.path, findings:p.findings })), duplicateDescriptions, clientScriptBytes: pages[0].resources.filter(r => r.src.endsWith('.js')) }, null, 2));
