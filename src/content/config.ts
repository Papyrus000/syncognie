// src/content/config.ts
// Ajouter cette collection à votre config existante

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

// ── Nouvelle collection : carnet ──
const carnet = defineCollection({
  schema: z.object({
    // Obligatoires
    title: z.string(),
    date:  z.date(),

    // Type de note — détermine couleur et glyph dans la liste
    type: z.enum(['dialogue', 'note', 'essai', 'fragment']).default('note'),

    // Optionnels
    description: z.string().optional(),

    // Extrait affiché dans la liste (une phrase, une idée)
    extrait: z.string().optional(),

    // Tags pour le codex en bas de page
    tags: z.array(z.string()).optional(),

    // Stade de maturité (jardin numérique)
    stade: z.enum(["graine", "pousse", "arbre"]).optional(),

    // Niveau d'engagement / de lecture
    engagement: z.enum(["pause", "lecture", "immersion"]).optional(),
  }),
});

export const collections = { articles, fenetres, carnet };
