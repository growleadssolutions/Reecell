import fs from 'node:fs';
const files = fs.readdirSync('src/content/blog').filter(file => file.endsWith('.md'));
for (const file of files) {
  const source = fs.readFileSync(`src/content/blog/${file}`, 'utf8');
  const field = name => JSON.parse(source.match(new RegExp(`^${name}: (.+)$`, 'm'))[1]);
  const html = fs.readFileSync(`dist/${field('permalinkDate').replaceAll('-', '/')}/${field('slug')}/index.html`, 'utf8');
  const body = html.split('class="article-content"')[1]?.split('class="article-cta"')[0];
  if (!body?.includes('<img') || !html.includes('class="article-cta"') || html.includes('Tirar uma dúvida no WhatsApp')) throw new Error(`Missing editorial content: ${file}`);
  for (const [, src] of html.matchAll(/<img[^>]+src="([^"]+)/g)) {
    if (src.startsWith('/') && !fs.existsSync(`dist${src}`)) throw new Error(`Missing image: ${src}`);
  }
  const label = JSON.parse(source.match(/^  label: (.+)$/m)[1]);
  const message = JSON.parse(source.match(/^  message: (.+)$/m)[1]);
  if (!html.includes(label) || !html.includes(encodeURIComponent(message))) throw new Error(`Missing contextual CTA: ${file}`);
}
console.log(`OK: ${files.length} articles with inline images, existing image files and contextual WhatsApp CTAs.`);
