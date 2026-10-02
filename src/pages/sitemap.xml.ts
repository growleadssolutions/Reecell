import type { APIRoute } from 'astro';
import { business } from '../data/business';
import { sitePages } from '../data/site-pages';
import { getPublishedPosts } from '../lib/blog';
import { postPath } from '../lib/permalinks';
import { legacyArchives } from '../lib/legacy-archives';
const escapeXML = (value: string) => value.replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[char]!);
export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const entries = [
    ...sitePages.map(path => ({ path, modified: undefined as string | undefined })),
    ...posts.map(post => ({ path: postPath(post.data), modified: post.data.updatedDate ?? post.data.publishedDate })),
    ...legacyArchives.map(archive => ({ path: archive.oldPath, modified: undefined })),
  ];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries.map(entry => `<url><loc>${escapeXML(new URL(entry.path, business.url).href)}</loc>${entry.modified ? `<lastmod>${entry.modified}</lastmod>` : ''}</url>`).join('')}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
