import assert from 'node:assert/strict';
import { writeFile, unlink, readFile, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { postPath, assertUniquePaths } from '../src/lib/permalinks.ts';

const root = new URL('../', import.meta.url);
const fixture = new URL('src/content/blog/__migration-test.md', root);
const draft = new URL('src/content/blog/__migration-draft.md', root);
const created = [];
const runBuild = () => {
  const result = spawnSync(process.execPath, ['node_modules/astro/bin/astro.mjs', 'build'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`${result.stdout}\n${result.stderr}`);
};
const data = { permalinkDate: '2026-06-08', slug: '__teste-migracao' };
assert.equal(postPath(data), '/2026/06/08/__teste-migracao/');
assert.throws(() => assertUniquePaths([{ data }, { data }]), /duplicada/);
const content = `---\ntitle: "Teste de migração"\ndescription: "Conteúdo temporário de verificação."\nslug: "__teste-migracao"\npermalinkDate: "2026-06-08"\npublishedDate: "2026-06-09"\nupdatedDate: "2026-09-14"\nprimaryKeyword: "PALAVRA_INTERNA_NAO_PUBLICAR"\nlocalIntent: "INTENCAO_INTERNA_NAO_PUBLICAR"\ndraft: false\n---\n\n## Conteúdo de verificação\n\nEste arquivo é removido automaticamente após o teste.\n`;
try {
  await writeFile(fixture, content, { flag: 'wx' }); created.push(fixture);
  await writeFile(draft, content.replace('slug: "__teste-migracao"', 'slug: "__teste-rascunho"').replace('draft: false', 'draft: true'), { flag: 'wx' }); created.push(draft);
  runBuild();
  const html = await readFile(new URL('dist/2026/06/08/__teste-migracao/index.html', root), 'utf8');
  assert.match(html, /rel="canonical" href="https:\/\/reecell\.com\.br\/2026\/06\/08\/__teste-migracao\/"/);
  assert.match(html, /"@type":"Article"/);
  assert.match(html, /"@type":"BreadcrumbList"/);
  assert.match(html, /datetime="2026-06-09"/);
  assert(!html.includes('PALAVRA_INTERNA_NAO_PUBLICAR') && !html.includes('INTENCAO_INTERNA_NAO_PUBLICAR'));
  const sitemap = await readFile(new URL('dist/sitemap.xml', root), 'utf8');
  assert(sitemap.includes('/2026/06/08/__teste-migracao/'));
  assert(!sitemap.includes('__teste-rascunho'));
  await assert.rejects(access(new URL('dist/2026/06/08/__teste-rascunho/index.html', root)));
  console.log('Migração OK: URL imutável, canonical, Article, breadcrumbs, datas e exclusão de rascunho/campos editoriais.');
} finally {
  for (const file of created) await unlink(file);
  if (created.length) {
    runBuild();
    await assert.rejects(access(new URL('dist/2026/06/08/__teste-migracao/index.html', root)));
    const cleanSitemap = await readFile(new URL('dist/sitemap.xml', root), 'utf8');
    assert(!cleanSitemap.includes('__teste-'), 'Conteúdo de teste permaneceu no sitemap após limpeza');
    console.log('Limpeza OK: fixtures ausentes do conteúdo, das rotas e do sitemap final.');
  }
}
