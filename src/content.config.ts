import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(value => {
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}, 'Informe uma data válida YYYY-MM-DD entre aspas.');

const blogLoader = glob({ pattern: '**/*.md', base: './src/content/blog' });
const blog = defineCollection({
  loader: {
    ...blogLoader,
    async load(context) {
      // O glob pode retornar antes da limpeza quando a pasta está vazia.
      // Reconstruir o store evita publicar artigos removidos de um build anterior.
      context.store.clear();
      await blogLoader.load(context);
    },
  },
  schema: ({ image }) => z.object({
    title: z.string().min(1), description: z.string().min(1),
    slug: z.string().min(1).refine(value => !/[\s/?#\\]/.test(value) && !['.', '..'].includes(value), 'Use exatamente o segmento da URL original, sem barras.'),
    // Obrigatório e imutável: data extraída da URL WordPress, não da revisão editorial.
    permalinkDate: calendarDate,
    publishedDate: calendarDate, updatedDate: calendarDate.optional(),
    image: image().optional(), imageAlt: z.string().optional(),
    cta: z.object({ heading: z.string().min(1), description: z.string().min(1), label: z.string().min(1), message: z.string().min(1) }).optional(),
    category: z.string().optional(), primaryKeyword: z.string().optional(),
    localIntent: z.string().optional(), relatedServices: z.array(z.string()).default([]),
    draft: z.boolean().default(true),
  }).superRefine((data, ctx) => {
    if (data.image && !data.imageAlt?.trim()) ctx.addIssue({ code: 'custom', message: 'Informe imageAlt para a imagem.', path: ['imageAlt'] });
    if (data.updatedDate && data.updatedDate < data.publishedDate) ctx.addIssue({ code: 'custom', message: 'A atualização não pode anteceder a publicação.', path: ['updatedDate'] });
  }),
});
export const collections = { blog };
