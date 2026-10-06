// Inventário local. Execute após npm run build. Decisões editoriais são hipóteses,
// não métricas de busca nem autorização automática para modificar URLs.
import fs from 'node:fs';
import path from 'node:path';
const out = 'docs/auditoria-conteudo';
fs.mkdirSync(out, { recursive: true });
const migration = JSON.parse(fs.readFileSync('src/data/legacy-migration.json', 'utf8'));
const text = s => s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<[^>]*>/g, ' ').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const posts = fs.readdirSync('src/content/blog').filter(f => f.endsWith('.md')).map(file => {
  const raw = fs.readFileSync(`src/content/blog/${file}`, 'utf8');
  const [, frontmatter, body] = raw.split('---');
  const get = key => frontmatter.match(new RegExp(`^${key}: "(.*)"`, 'm'))?.[1];
  return { file, body, slug: get('slug'), keyword: get('primaryKeyword'), urlPath: `/${get('permalinkDate').replaceAll('-', '/')}/${get('slug')}/` };
});
const decisions = {
  'assistencia-tecnica-celular-bombinhas': ['Comercial local: encontrar serviços e avaliação', 'há canibalização', 'CONSOLIDAR', 'Candidato editorial; repete catálogo e avaliação da página de conserto. Transferir detalhes úteis para o serviço antes de considerar 301.'],
  'assistencia-tecnica-de-celular-confiavel-em-bombinhas': ['Comercial investigativa: escolher assistência segura', 'há canibalização', 'CONSOLIDAR', 'Mesmo problema e critérios do artigo onde-consertar: diagnóstico, orçamento, peças e garantia.'],
  'onde-consertar-celular-em-bombinhas-com-seguranca': ['Comercial investigativa: escolher assistência segura', 'há canibalização', 'EXPANDIR', 'Principal editorial provisória para escolha segura; incorporar critérios exclusivos do artigo confiável.'],
  'assistencia-tecnica-para-celular-em-bombinhas-quando-procurar': ['Informacional: reconhecer quando buscar avaliação', 'já existe, mas precisa atualização', 'ATUALIZAR', 'Concentrar em sinais e momento da avaliação; reduzir catálogo e escolha de loja repetidos.'],
  'celular-caiu-na-agua-o-que-fazer': ['Informacional: cuidados após contato com líquido', 'há canibalização', 'EXPANDIR', 'Principal provisória do grupo; já contém água do mar, cuidados imediatos e falhas posteriores.'],
  'celular-molhou-na-praia': ['Informacional: cuidados após contato com líquido', 'há canibalização', 'CONSOLIDAR', 'Repete primeiros cuidados, práticas a evitar e FAQs do artigo caiu na água; incorporar areia e resistência à água na principal.'],
  'tela-de-celular-bombinhas': ['Informacional comercial: fatores do preço da tela', 'já existe, mas precisa atualização', 'ATUALIZAR', 'Title e abertura tratam custo, mas primaryKeyword disputa a keyword do serviço; alinhar metadados ao orçamento, sem inventar valores.'],
  'melhores-lojas-de-celulares-em-bombinhas': ['Comercial investigativa: comparar lojas e acessórios', 'já existe, mas precisa atualização', 'ATUALIZAR', 'Diferenciar compra/acessórios do guia de assistências; revalidar dados de terceiros antes de atualizar.'],
  'melhores-assistencias-tecnicas-de-celular-em-bombinhas': ['Comercial investigativa: comparar prestadores de reparo', 'já existe, mas precisa atualização', 'ATUALIZAR', 'Manter comparação de prestadores; reduzir guia genérico repetido e revalidar dados de terceiros.'],
  'iphone-com-tela-quebrada-em-bombinhas': ['Informacional comercial: decidir reparar iPhone ou substituí-lo', 'já existe, mas precisa atualização', 'ATUALIZAR', 'Preservar decisão econômica e cuidados do iPhone; boa parte dos sintomas é genérica e se repete no artigo tela trincada.'],
};
const subjects = {
 'alto-falante-ou-microfone-do-celular-nao-funciona': 'Distinguir falha de reprodução, gravação, Bluetooth e aplicativos',
 'botao-power-ou-volume-parou-de-funcionar': 'Falha mecânica e funcional de botões',
 'camera-do-celular-embacada-ou-tremendo': 'Lente, foco, estabilização e aplicativos',
 'celular-carregando-lentamente': 'Carga lenta: cabo, adaptador, temperatura e aparelho',
 'celular-desligando-sozinho-bateria-sistema-placa': 'Desligamentos: diferenciar bateria, sistema e placa',
 'celular-esquentando-muito': 'Aquecimento: causas, sinais e avaliação',
 'celular-nao-liga-principais-causas': 'Ausência de inicialização e distinção de tela preta',
 'como-proteger-seu-celular-em-bombinhas': 'Prevenção com acessórios e cuidados no litoral',
 'conector-de-carga-com-defeito-sinais': 'Mau contato e diagnóstico do conector',
 'iphone-nao-carrega-causas-solucoes': 'Falha de carregamento no iPhone',
 'samsung-com-tela-verde-o-que-pode-ser': 'Alteração de cor no display Samsung',
 'tela-trincada-do-celular-posso-continuar-usando-ou-devo-trocar': 'Riscos de uso e decisão após trincar a tela',
 'troca-de-bateria-de-celular-sinais': 'Sinais de desgaste e decisão de trocar bateria',
};
const files = fs.readdirSync('dist', {recursive: true}).filter(f => f.endsWith('.html'));
const rows = files.map(file => {
 const html = fs.readFileSync(path.join('dist', file), 'utf8');
 const urlPath = file === '404.html' ? '/404.html' : '/' + file.replaceAll('\\', '/').replace(/index\.html$/, '');
 const post = posts.find(p => p.urlPath === urlPath);
 const legacy = migration.entries.find(e => e.oldPath === urlPath);
 const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)].map(m => text(m[1]));
 const title = text(html.match(/<title[^>]*>([\s\S]*?)<\/title>/)?.[1] ?? '');
 const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? '';
 const isArchive = !!legacy?.memberPaths?.length;
 const type = post ? 'artigo' : isArchive ? 'arquivo' : urlPath === '/404.html' ? 'erro' : 'página';
 const decision = post ? decisions[post.slug] : undefined;
 const keyword = post?.keyword ?? (urlPath === '/' ? 'assistência técnica de celulares em Bombinhas' : urlPath.includes('contato-') ? 'contato ReeCell Bombinhas' : urlPath === '/blog/' ? 'blog ReeCell' : h1s[0]);
 const intent = decision?.[0] ?? (post ? 'Informacional: ' + subjects[post.slug] : isArchive ? 'Navegacional: reunir artigos associados' : urlPath.includes('troca-') || urlPath.includes('conserto-') ? 'Transacional local: consultar reparo e orçamento' : 'Navegacional: conhecer a empresa ou acessar conteúdo/contato');
 return {url: migration.origin + urlPath, path: urlPath, slug: urlPath.split('/').filter(Boolean).at(-1) ?? '', tipo: type, title, h1: h1s.join(' | '), h1Count: h1s.length,
 assunto: post ? subjects[post.slug] ?? intent : isArchive ? legacy.title : h1s[0], keyword, keywordFonte: post ? 'primaryKeyword declarado' : 'inferida do conteúdo', intencao: intent,
 status: decision?.[1] ?? (type === 'arquivo' || type === 'erro' ? 'fora do planejamento editorial' : 'já existe e está boa'), acao: decision?.[2] ?? 'MANTER', observacao: decision?.[3] ?? (post ? 'Cobertura suficiente para a intenção atual; manter URL e evitar variações semânticas em novas páginas.' : 'Preservar função e URL existentes.'), fonte: post ? 'src/content/blog/' + post.file : isArchive ? 'src/pages/[...legacy].astro' : 'dist/' + file.replaceAll('\\', '/'), headings: [...main.matchAll(/<h[2-3]\b[^>]*>([\s\S]*?)<\/h[2-3]>/g)].map(m => text(m[1])), conteudoPrincipal: text(main), linksInternos: [...new Set([...main.matchAll(/href="(\/[^"#]*)"/g)].map(m => m[1]))]};
}).sort((a,b) => a.path.localeCompare(b.path));
const csv = (data, keys) => '\ufeff' + [keys, ...data.map(r => keys.map(k => r[k] ?? ''))].map(r => r.map(v => '"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n') + '\r\n';
fs.writeFileSync(`${out}/inventario.json`, JSON.stringify({geradoEm: new Date().toISOString(), escopo: 'Build local; sem comprovação de indexação ou rankings', paginas: rows}, null, 2));
fs.writeFileSync(`${out}/inventario.csv`, csv(rows, ['url','slug','tipo','title','h1','assunto','keyword','keywordFonte','intencao','status','acao','observacao','fonte']));
const redirects = migration.entries.filter(e => e.treatment !== 'preservada');
fs.writeFileSync(`${out}/redirecionamentos-existentes.csv`, csv(redirects, ['oldPath','finalPath','treatment','reason']));
const indexed = rows.filter(r => r.tipo !== 'erro');
const sitemap = fs.readFileSync('dist/sitemap.xml','utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
if (new Set(rows.map(r=>r.url)).size !== rows.length || rows.some(r=>!r.title || r.h1Count !== 1) || indexed.some(r=>!sitemapUrls.includes(r.url)) || sitemapUrls.some(u=>!indexed.some(r=>r.url===u))) throw Error('Inventário inconsistente com H1, title ou sitemap');
console.log(JSON.stringify({html: rows.length, artigos: rows.filter(r=>r.tipo==='artigo').length, arquivos: rows.filter(r=>r.tipo==='arquivo').length, paginas: rows.filter(r=>r.tipo==='página').length, sitemap: sitemapUrls.length, redirects: redirects.length, validacao: 'URLs únicas, title/H1 e cobertura bidirecional do sitemap OK'}));
