// src/data/index.ts
// ─────────────────────────────────────────────────────────────────────────────
// POINT D'ENTREE UNIQUE des donnees
//
// Tout le code qui consomme des donnees importe depuis ici.
// Ne jamais importer directement depuis les sous-fichiers dans les composants.
//
// Usage :
//   import { TOUTES_PRATIQUES, TOUTES_SYNERGIES } from "../data"
//
// Ajouter une nouvelle categorie de pratiques :
//   1. Creer le fichier dans data/pratiques/
//   2. Importer et ajouter dans TOUTES_PRATIQUES ci-dessous
// ─────────────────────────────────────────────────────────────────────────────

import { pratiquesSommeil }       from "./pratiques/sommeil"
import { pratiquesAlimentation }  from "./pratiques/alimentation"
import { pratiquesPhysique }      from "./pratiques/physique"
import { pratiquesSystemeNerveux } from "./pratiques/systeme-nerveux"
import { pratiquesSubstances }    from "./pratiques/substances"

import { synergiesPositives }     from "./synergies/positives"
import { synergiesTensions }      from "./synergies/tensions"

import type { Pratique }  from "./pratiques/_schema"
import type { Synergie }  from "./synergies/_schema"

// Remplacer les trois lignes export type par :
export type { Pratique, CleReservoir, Categorie, Incertitude } from "./pratiques/_schema"
export type { Synergie, TypeSynergie, ConditionHormese }       from "./synergies/_schema"
export type { Reservoir, ModificateurProfil }                  from "./reservoirs/_schema"

// Toutes les pratiques dans l'ordre d'affichage UI
export const TOUTES_PRATIQUES: Pratique[] = [
  ...pratiquesSommeil,
  ...pratiquesAlimentation,
  ...pratiquesPhysique,
  ...pratiquesSystemeNerveux,
  ...pratiquesSubstances,
]

// Toutes les synergies — positives d'abord, tensions ensuite
export const TOUTES_SYNERGIES: Synergie[] = [
  ...synergiesPositives,
  ...synergiesTensions,
]

// Index rapide par id — utile dans le moteur et l'UI
export const PRATIQUES_PAR_ID: Record<string, Pratique> = Object.fromEntries(
  TOUTES_PRATIQUES.map(p => [p.id, p])
)

// Pratiques groupees par categorie — utile pour le rendu de la grille
export const PRATIQUES_PAR_CATEGORIE = {
  sommeil:           pratiquesSommeil,
  alimentation:      pratiquesAlimentation,
  physique:          pratiquesPhysique,
  "systeme-nerveux": pratiquesSystemeNerveux,
  substances:        pratiquesSubstances,
} as const
