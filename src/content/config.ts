// src/content/config.ts

import { defineCollection, z } from 'astro:content';

// ── Collection existante : articles ──
const articles = defineCollection({
  schema: z.object({
    title:       z.string(),
    description: z.string().optional(),
    date:        z.date(),
    tags:        z.array(z.string()).optional(),
    format:      z.string().optional(),
    rubrique:    z.string().optional(),
    engagement:  z.enum(['survol', 'pause', 'lecture', 'immersion']).optional(),
    type:        z.string().optional(),
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
    serie:       z.string().optional(),
    episode:     z.number().optional(),
    lien_fenetre:z.string().optional(),
    note_genese: z.array(z.object({
      date:  z.string(),
      texte: z.string(),
    })).optional(),
  }),
});

// ── Collection existante : fenetres ──
const fenetres = defineCollection({
  schema: z.object({
    personnage: z.string(),
    heure:      z.string().optional(),
    amorce:     z.string().optional(),
    date:       z.date(),
    featured:   z.boolean().optional(),
  }),
});

// ── Collection existante : carnet ──
const carnet = defineCollection({
  schema: z.object({
    title:       z.string(),
    date:        z.date(),
    type:        z.enum(['dialogue', 'note', 'essai', 'fragment']).default('note'),
    description: z.string().optional(),
    extrait:     z.string().optional(),
    tags:        z.array(z.string()).optional(),
    stade:       z.enum(["graine", "pousse", "arbre"]).optional(),
    engagement:  z.enum(["pause", "lecture", "immersion"]).optional(),
  }),
});

// ── Nouvelle collection : atelier ──
const atelier = defineCollection({
  schema: z.object({
    // Obligatoires
    title:       z.string(),
    date:        z.date(),

    // Optionnels
    description: z.string().optional(),

    // Extrait affiché dans la liste index
    extrait:     z.string().optional(),

    // Pour masquer une entrée de la liste sans la supprimer
    draft:       z.boolean().optional(),
  }),
});

export const collections = { articles, fenetres, carnet, atelier };
