// src/content.config.ts

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

// ── Collection : journal ──
const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title:       z.string(),
    date:        z.date(),
    description: z.string().optional(),
    lecture:     z.number().optional(),
    type:        z.string().optional(),
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
    draft:       z.boolean().optional(),
  }),
});

// ── Collection : nouvelles ──
const nouvelles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/nouvelles' }),
  schema: z.object({
    title:       z.string(),
    date:        z.coerce.date(),
    description: z.string().optional(),
    genre:       z.enum(['fragment', 'conte', 'recit', 'fable', 'prose']).default('fragment'),
    lecture:     z.number().optional(),
    stade:       z.enum(['graine', 'pousse', 'arbre']).optional(),
    draft:       z.boolean().optional(),
    tags:        z.array(z.string()).optional(),
    illustration: z.string().optional(),
    illustration_teaser: z.string().optional(),
    video:        z.string().optional(),
  }),
});

// ── Collection : jardin ──
const jardin = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/jardin' }),
  schema: z.object({
    id:          z.string(),
    titre:       z.string(),
    tags:        z.array(z.string()).default([]),
    stade:       z.enum(['graine', 'pousse', 'arbre']).default('graine'),
    date:        z.coerce.date(),
    description: z.string().optional(),
  }),
});

// ── Schéma fiche synthèse — Partie II ──
// Injecté dans le JSON de concepts via le champ `fiche` de chaque concept.
const ficheSyntheseSchema = z.object({
  essentiel:  z.string(),                  // Formule mémorable à retenir
  mots_cles:  z.array(z.string()),         // 4-6 ancres conceptuelles
  usages:     z.array(z.string()),         // 2-3 usages concrets quotidiens
});

// ── Schéma d'un concept individuel ──
const conceptSchema = z.object({
  penseur:  z.string(),
  nom:      z.string(),
  corps:    z.string(),
  extrait:  z.string().optional(),
  vie:      z.string().optional(),
  fiche:    ficheSyntheseSchema.optional(), // Présent = fiche Partie II disponible
  jauges:   z.record(z.string(), z.number()).optional(),
});

// ── Collection NOUVELLE : sous-la-surface ──
// Articles hybrides : scène narrative + analyse conceptuelle interactive.
// Partie I  — spans data-sls="conceptId"              → sidebar explication
// Partie II — spans data-sls="conceptId" data-sls-mode="fiche" → fiche synthèse verte
const souslasurface = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/sous-la-surface' }),
  schema: z.object({
    title:        z.string(),
    date:         z.coerce.date(),
    description:  z.string().optional(),
    // Personnages de la scène, ex. "Mélanie & Johan"
    personnages:  z.string().optional(),
    // Liste des concepts abordés dans l'article
    concepts:     z.array(z.string()).optional(),
    // Temps de lecture estimé (auto-calculé si absent)
    lecture:      z.number().optional(),
    // Stade du jardin numérique
    stade:        z.enum(['graine', 'pousse', 'arbre']).optional(),
    // Masquer de l'index
    draft:        z.boolean().optional(),
    // Image d'en-tête optionnelle
    illustration: z.string().optional(),
    // Nom du fichier JSON de concepts (sans extension), dans src/content/sous-la-surface/
    // Structure attendue : Record<conceptId, conceptSchema> — voir conceptSchema ci-dessus
    concepts_data: z.string().optional(),
  }),
});

export const collections = {
  articles,
  fenetres,
  carnet,
  atelier,
  planches,
  journal,
  nouvelles,
  jardin,
  'sous-la-surface': souslasurface,
};
