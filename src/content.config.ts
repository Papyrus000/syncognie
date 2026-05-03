// src/content.config.ts
// ── REMPLACE ton fichier existant ──

import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// ── Collection existante : articles ──
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
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
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/fenetres' }),
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
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/carnet' }),
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

// ── Collection existante : atelier ──
const atelier = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/atelier' }),
  schema: z.object({
    title:       z.string(),
    date:        z.date(),
    description: z.string().optional(),
    extrait:     z.string().optional(),
    draft:       z.boolean().optional(),
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
    penseur:     z.string().optional(),
  }),
});

// ── Collection : planches ──
const planches = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/planches' }),
  schema: z.object({
    title:       z.string(),
    date:        z.date(),
    description: z.string().optional(),
    extrait:     z.string().optional(),
    draft:       z.boolean().optional(),
    image:       z.string(),
    image2:      z.string().optional(),
    sujet:       z.string().optional(),
    serie:       z.string().optional(),
    episode:     z.number().optional(),
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
  }),
});

// ── Collection NOUVELLE : journal ──
// Chaque fichier = une entrée de journal, classée par date
const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title:       z.string(),
    date:        z.date(),
    description: z.string().optional(),
    // Temps de lecture estimé (en minutes) — calculé auto si absent
    lecture:     z.number().optional(),
    // Étiquette libre : 'réflexion', 'processus', 'observation', etc.
    type:        z.string().optional(),
    // Stade du jardin numérique
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
    // Masquer de l'index public
    draft:       z.boolean().optional(),
  }),
});

// ── Collection NOUVELLE : nouvelles ──
// Chaque fichier = une courte fiction, classée par date
const nouvelles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/nouvelles' }),
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    description: z.string().optional(),
    genre:       z.enum(['fragment', 'conte', 'recit', 'fable', 'prose']).default('fragment'),
    lecture:     z.number().optional(),
    // Stade du jardin numérique
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
    draft:       z.boolean().optional(),
    tags:        z.array(z.string()).optional(),
  }),
});

export const collections = { articles, fenetres, carnet, atelier, planches, journal, nouvelles };
