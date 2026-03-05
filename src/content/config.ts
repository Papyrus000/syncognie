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
  }),
});
export const collections = { articles };