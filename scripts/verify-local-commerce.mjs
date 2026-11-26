import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';

const expected = [
  ['celular', 'Olá! Encontrei a Reecell pelo site e gostaria de consultar os celulares disponíveis na loja de Bombas.'],
  ['carregador', 'Olá! Gostaria de consultar os carregadores disponíveis e verificar a compatibilidade com meu celular.'],
  ['cabo-carregador', 'Olá! Gostaria de consultar os cabos de carregamento disponíveis para meu celular.'],
  ['pelicula', 'Olá! Gostaria de consultar as opções de película para meu celular.'],
  ['capinhas', 'Olá! Gostaria de consultar as capinhas disponíveis para o modelo do meu celular.'],
];
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const blog = await readFile('dist/blog/index.html', 'utf8');
const titles = new Set(), descriptions = new Set();
const articles = [];
for (const [topic, message] of expected) {
  const slug = `onde-comprar-${topic}-em-bombinhas`;
  const source = await readFile(`src/content/blog/${slug}.md`, 'utf8');
  const field = name => JSON.parse(source.match(new RegExp(`^${name}: (.+)$`, 'm'))[1]);
  const path = `/${field('permalinkDate').replaceAll('-', '/')}/${slug}/`;
  const url = `https://reecell.com.br${path}`;
  const html = await readFile(`dist${path}index.html`, 'utf8');
  const title = field('seoTitle'), description = field('description');
  assert(!titles.has(title) && !descriptions.has(description), 'Duplicate commercial metadata');
  titles.add(title); descriptions.add(description);
  assert(html.includes(`<title>${title}</title>`));
  assert(html.includes(`name="description" content="${description}"`));
  assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
  assert(html.includes(field('title')));
  assert(html.includes(`rel="canonical" href="${url}"`));
  assert(html.includes('name="robots" content="index, follow"'));
  for (const [key, value] of [['title', title], ['description', description], ['url', url], ['type', 'article']]) {
    assert(html.includes(`property="og:${key}" content="${value}"`));
  }
  assert(html.includes('property="og:image"'));
  assert(sitemap.includes(`<loc>${url}</loc>`));
  assert(blog.includes(`href="${path}"`));
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const article = graph.find(node => node['@type'] === 'Article');
  assert.equal(article.author['@id'], 'https://reecell.com.br/#organization');
  assert.equal(article.author.name, 'ReeCell');
  assert.equal(article.datePublished, field('publishedDate'));
  assert(graph.some(node => node['@type'] === 'BreadcrumbList'));
  assert(!graph.some(node => node['@type'] === 'Product'));
  const cta = `https://wa.me/5547988758993?text=${encodeURIComponent(message)}`;
  const articleCTA = [...html.matchAll(/<a\b[^>]*>/g)].map(m => m[0]).filter(tag => tag.includes('data-cta-location="article"'));
  assert.equal(articleCTA.length, 1);
  assert(articleCTA[0].includes(`href="${cta}"`));
  assert(articleCTA[0].includes('data-cta="whatsapp"'));
  assert(!articleCTA[0].includes('onclick='));
  assert.equal((html.match(/gtm\.js\?id=GTM-5WFKFJ6P/g) ?? []).length, 1);
  const body = html.split('class="article-content"')[1].split('class="article-local"')[0];
  assert(body.includes('loading="lazy"') && body.includes('/reecell-fachada.webp'));
  const internalLinks = [...new Set([...body.matchAll(/href="(\/[^"#]*)/g)].map(m => m[1]))];
  articles.push({ title: field('title'), seoTitle: title, url, primaryKeyword: field('primaryKeyword'), description, intent: field('localIntent'), internalLinks, cta: { message, url: cta }, checks: 'passed' });
}
await mkdir('docs/seo-comercial-2026-11-26', { recursive: true });
await writeFile('docs/seo-comercial-2026-11-26/articles.json', JSON.stringify({ checkedAt: new Date().toISOString(), layer: 'local-build', productionPublished: false, articles }, null, 2) + '\n');
const inventory = ['# Cinco artigos comerciais locais', '', 'Implementados localmente. URLs de destino, ainda sem publicação em produção. Para a prévia, substitua https://reecell.com.br por http://localhost:4321.', ''];
for (const article of articles) {
  inventory.push(`## ${article.title}`, '', `- URL final: ${article.url}`, `- Title SEO: ${article.seoTitle}`, `- Palavra-chave: ${article.primaryKeyword}`, `- Intenção: ${article.intent}`, `- Meta description: ${article.description}`, `- Autoria institucional: ReeCell.`, '', 'Links internos no corpo:', '', ...article.internalLinks.map(path => `- ${path}`), '', 'O layout também inclui home, contato, breadcrumbs e artigos relacionados.', '', `CTA: ${article.cta.message}`, '', `[Abrir link de WhatsApp](${article.cta.url})`, '');
}
await writeFile('docs/seo-comercial-2026-11-26/ARTIGOS.md', inventory.join('\n').trimEnd() + '\n');
console.log('5 commercial articles: unique metadata, indexability, sitemap, author, breadcrumbs, GTM loader and exact WhatsApp CTAs verified.');
