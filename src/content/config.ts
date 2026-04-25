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

// ── Collection existante : atelier ──
const atelier = defineCollection({
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
  schema: z.object({
    // Obligatoires
    title:       z.string(),
    date:        z.date(),

    // Optionnels
    description: z.string().optional(),
    extrait:     z.string().optional(),   // accroche courte pour la grille
    draft:       z.boolean().optional(),

    // Image(s) de la planche — chemin(s) relatif(s) depuis /public
    image:       z.string(),              // image principale (miniature + lightbox)
    image2:      z.string().optional(),   // deuxième partie si la planche est en 2 volets

    // Méta
    sujet:       z.string().optional(),   // ex. "John Gottman", "CNV", "Attachement"
    serie:       z.string().optional(),   // nom d'une série de planches
    episode:     z.number().optional(),   // numéro dans la série
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
  }),
});

export const collections = { articles, fenetres, carnet, atelier, planches };
