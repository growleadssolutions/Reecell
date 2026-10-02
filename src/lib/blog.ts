import { getCollection } from 'astro:content';
import { assertUniquePaths } from './permalinks';
export async function getPublishedPosts() {
  return assertUniquePaths(await getCollection('blog', ({ data }) => !data.draft))
    .sort((a, b) => b.data.publishedDate.localeCompare(a.data.publishedDate));
}
