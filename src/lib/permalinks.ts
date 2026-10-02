export interface PermalinkData { slug: string; permalinkDate: string }
// Não normalizar slug, remover acentos, mudar caixa ou derivar da data editorial.
export function postParams(data: PermalinkData) {
  const [year, month, day] = data.permalinkDate.split('-');
  return { year, month, day, slug: data.slug };
}
export function postPath(data: PermalinkData): string {
  const { year, month, day, slug } = postParams(data);
  return `/${year}/${month}/${day}/${slug}/`;
}
export function assertUniquePaths<T extends { data: PermalinkData }>(posts: T[]): T[] {
  const paths = new Set<string>();
  for (const post of posts) {
    const path = postPath(post.data);
    if (paths.has(path)) throw new Error(`URL de artigo duplicada: ${path}`);
    paths.add(path);
  }
  return posts;
}
