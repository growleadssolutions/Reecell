import fs from 'node:fs';
import assert from 'node:assert/strict';
import { decodeHTML } from 'entities';
import { editorial } from './blog-editorial-data.mjs';

const posts = JSON.parse(fs.readFileSync('docs/blog-source/wordpress-posts.json', 'utf8'));
const media = JSON.parse(fs.readFileSync('docs/blog-source/wordpress-media.json', 'utf8'));
const mediaAlt = {
  355: 'Mão segurando um celular com o vidro da tela trincado',
  346: 'Celular Samsung com aplicativos na tela, segurado em uma mão',
  345: 'Celular Samsung com vidro trincado apoiado em uma superfície',
  343: 'Cabo conectado à entrada de carregamento de um celular',
  340: 'Pessoa manuseando componentes internos de um celular aberto',
  335: 'Celular com gotas de água sobre a tela, segurado ao ar livre',
  255: 'Mãos com luvas trabalhando em um celular aberto sobre uma bancada',
};
const clean = value => decodeHTML(value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ')).trim();
const plain = node => node.tag === '#text' ? node.value : node.children.map(plain).join(node.tag === 'br' ? ' ' : '');
const text = node => decodeHTML(plain(node)).replace(/\s+/g, ' ').trim();
function parse(html) {
  const root = { tag: 'root', children: [] };
  const stack = [root];
  for (const token of html.match(/<!--[\s\S]*?-->|<[^>]+>|[^<]+/g) ?? []) {
    if (token.startsWith('<!--')) continue;
    if (token.startsWith('</')) {
      const tag = token.match(/^<\/([\w-]+)/)?.[1].toLowerCase();
      const index = stack.findLastIndex(node => node.tag === tag);
      if (index > 0) stack.length = index;
    } else if (token.startsWith('<')) {
      const tag = token.match(/^<([\w-]+)/)?.[1].toLowerCase();
      if (!tag) continue;
      const node = { tag, raw: token, children: [] };
      stack.at(-1).children.push(node);
      if (!['br', 'hr', 'img', 'meta', 'link', 'input'].includes(tag)) stack.push(node);
    } else stack.at(-1).children.push({ tag: '#text', value: token });
  }
  return root;
}
function inline(node) {
  if (node.tag === '#text') return decodeHTML(node.value).replace(/\s+/g, ' ');
  if (node.tag === 'br') return ' ';
  const inside = node.children.map(inline).join('');
  if (node.tag === 'a') {
    let href = decodeHTML(node.raw.match(/href=["']([^"']+)/)?.[1] ?? '');
    if (href.startsWith('https://reecell.com.br/')) href = href.slice('https://reecell.com.br'.length);
    return href ? `[${inside.trim()}](${href})` : inside;
  }
  return inside;
}
function blocks(node, list = false) {
  if (node.tag === 'h1' || ['style', 'script'].includes(node.tag)) return [];
  if (['h2', 'h3', 'p', 'li'].includes(node.tag)) {
    const value = inline(node).replace(/\s+/g, ' ').trim();
    if (!value) return [];
    const first = node.children.find(child => child.tag !== '#text' || child.value.trim());
    const label = node.tag === 'p' && first?.tag === 'strong' && /^[^:]{1,100}:$/.test(text(first));
    return [{ type: node.tag === 'li' || list || label ? 'li' : node.tag, value, plain: text(node), onlyLink: /^\[[^\]]+\]\([^)]*\)$/.test(value) }];
  }
  if (!node.children) return [];
  const children = node.children.filter(child => child.tag !== '#text' || child.value.trim());
  const paragraphGroup = node.tag === 'div' && children.length >= 3 && children.every(child => child.tag === 'p' && text(child).length <= 240 && text(child).split(/\s+/).length <= 34 && !child.children.some(n => n.tag === 'a'));
  return children.flatMap(child => blocks(child, list || paragraphGroup || node.tag === 'ul'));
}
const replacements = [
  [/Reecell Assistência Técnica em Bombinhas/g, 'ReeCell'],
  [/Reecell Assistência Técnica/g, 'ReeCell'],
  [/Reecell/g, 'ReeCell'],
  [/\bé essencial para\b/g, 'ajuda a'],
  [/\bfaz toda a diferença\b/g, 'ajuda a evitar decisões por impulso'],
  [/Neste artigo, você vai entender /g, 'Veja '],
  [/\bO ideal é solicitar\b/g, 'Solicite'],
  [/\bO ideal é consultar\b/g, 'Consulte'],
  [/\bO ideal é procurar\b/g, 'Procure'],
  [/\bo ideal é procurar\b/g, 'procure'],
  [/\bo ideal é fazer\b/g, 'vale fazer'],
  [/\bO ideal é fazer\b/g, 'Faça'],
  [/\bO mais seguro é fazer\b/g, 'Solicite'],
  [/\bdescubra a melhor solução\b/g, 'consulte as opções de reparo'],
  [/\bcausa real do problema\b/g, 'causa da falha'],
  [/\bcausa correta do problema\b/g, 'causa da falha'],
];
function revise(value) {
  for (const [pattern, replacement] of replacements) value = value.replace(pattern, replacement);
  value = value.replace('Se você precisa de assistência técnica para celular em Bombinhas, a ReeCell pode avaliar problemas como tela quebrada, bateria ruim, conector de carga com defeito, celular molhado, aparelho que não liga, alto-falante falhando, microfone com problema, câmera embaçada e outros defeitos comuns.', 'A ReeCell recebe consultas sobre falhas de tela, bateria, carregamento, áudio e câmera em Bombinhas. Também avalia aparelhos que molharam ou não ligam.');
  value = value.replace('A ReeCell ocupa o primeiro lugar deste ranking por apresentar uma proposta especializada em diagnóstico e conserto de celulares, com atendimento para problemas em tela, bateria, placa, conector de carga, câmera, som, software e danos provocados por líquidos.', 'A ReeCell ocupa o primeiro lugar desta seleção editorial por sua proposta de diagnóstico e conserto de celulares. O atendimento divulgado inclui tela, bateria, placa, carregamento, câmera, som, software e danos por líquidos.');
  value = value.replace('Como existem poucas informações públicas atualizadas sobre a variedade de serviços, marcas atendidas e condições de garantia, a recomendação é confirmar diretamente se a empresa continua funcionando no endereço cadastrado e se realiza o tipo de manutenção procurado.', 'Há poucas informações públicas atualizadas sobre serviços, marcas e condições de garantia. Confirme diretamente o endereço de atendimento e se a empresa realiza a manutenção procurada.');
  return value;
}
function shortParagraphs(value) {
  // Quebras em limites de frases, sem inserir <br> ou cortar uma oração.
  const sentences = value.split(/(?<=[.!?])\s+/);
  const result = [];
  for (const sentence of sentences.map(s => s.trim()).filter(Boolean)) {
    if (result.length && result.at(-1).length + sentence.length < 210) result[result.length - 1] += ` ${sentence}`;
    else result.push(sentence);
  }
  return result.join('\n\n');
}
fs.mkdirSync('src/content/blog', { recursive: true });
const report = [];
assert.equal(posts.length, 23);
assert.equal(Object.keys(editorial).length, posts.length);
for (const post of posts) {
  const edit = editorial[post.slug];
  assert(edit, `Revisão ausente: ${post.slug}`);
  const parsed = blocks(parse(post.content.rendered));
  const firstHeading = parsed.findIndex(b => b.type === 'h2');
  const conclusion = parsed.findIndex(b => b.type === 'h2' && /^Conclusão/i.test(b.plain));
  assert(firstHeading >= 0 && conclusion > firstHeading, post.slug);
  const body = parsed.slice(firstHeading, conclusion);
  const method = parsed.slice(0, firstHeading).filter(b => /Esta é uma seleção editorial|Esta seleção|posição não representa|ranking foi elaborado/i.test(b.plain) && b.plain.length > 80);
  const chunks = [...edit.intro, ...method.map(b => shortParagraphs(revise(b.value)))];
  for (let index = 0; index < body.length; index++) {
    const block = body[index];
    if (block.onlyLink || /^(Resumo rápido:|Neste artigo,|Para solicitar uma avaliação|Para solicitar um diagnóstico|Para solicitar uma análise|Para agendar uma análise)/i.test(block.plain)) continue;
    let value = revise(block.value);
    if (block.type === 'h2' || block.type === 'h3') {
      value = edit.headings?.[block.plain] ?? value;
      chunks.push(`${block.type === 'h2' ? '##' : '###'} ${value}`);
    } else if (block.type === 'li') {
      value = value.replace(/^([^:]{2,95}): /, '**$1:** ');
      const bullet = `- ${value}`;
      if (chunks.at(-1)?.startsWith('- ')) chunks[chunks.length - 1] += `\n${bullet}`;
      else chunks.push(bullet);
    } else chunks.push(shortParagraphs(value));
  }
  chunks.push(`## ${edit.closingTitle}`, ...edit.closing);
  const match = new URL(post.link).pathname.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\/$/);
  assert(match && match[4] === post.slug, `URL inesperada: ${post.link}`);
  const data = {
    title: edit.title ?? clean(post.title.rendered), description: edit.description, slug: post.slug,
    permalinkDate: `${match[1]}-${match[2]}-${match[3]}`, publishedDate: post.date.slice(0, 10),
    updatedDate: '2026-09-22', category: edit.category, primaryKeyword: edit.keyword,
    draft: false,
  };
  if (post.featured_media) {
    const original = media.find(item => item.id === post.featured_media);
    assert(original && mediaAlt[original.id], `Imagem original ausente: ${post.slug}`);
    const extension = new URL(original.source_url).pathname.split('.').at(-1);
    data.image = `../../assets/blog/wordpress-${original.id}.${extension}`;
    data.imageAlt = mediaAlt[original.id];
  }
  const markdown = `---\n${Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\n\n${chunks.join('\n\n')}\n`;
  fs.writeFileSync(`src/content/blog/${post.slug}.md`, markdown);
  report.push({ slug: post.slug, originalURL: post.link, originalDate: post.date, permalinkDate: data.permalinkDate, originalTitle: clean(post.title.rendered), title: data.title, category: data.category, sourceWords: clean(post.content.rendered).split(/\s+/).length, revisedWords: chunks.join(' ').split(/\s+/).length });
}
fs.writeFileSync('docs/blog-source/revision-manifest.json', JSON.stringify(report, null, 2) + '\n');
console.log(`Importados e revisados ${report.length} artigos, com slugs e datas originais.`);
