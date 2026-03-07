import { defineCollection, z } from 'astro:content';
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.date(),
    tags: z.array(z.string()).optional(),
    format: z.string().optional(),
    statut: z.string().optional(),
    stade: z.enum(['graine', 'pousse', 'arbre']).optional(),
    serie: z.string().optional(),
    episode: z.number().optional(),
    note_genese: z.array(z.object({
      date: z.string(),
      texte: z.string(),
    })).optional(),
    muri_par: z.array(z.object({
      slug: z.string(),
      note: z.string().optional(),
    })).optional(),
  }),
});
export const collections = { articles };