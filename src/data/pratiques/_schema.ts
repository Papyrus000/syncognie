// src/data/pratiques/_schema.ts
// ─────────────────────────────────────────────────────────────────────────────
// SCHEMA DES PRATIQUES — lire ce fichier avant de modifier une pratique
//
// Une Pratique = une action journaliere (sommeil, sport, substance...)
// Elle a des effets directs sur les reservoirs, et peut participer a des synergies.
//
// POUR AJOUTER UNE PRATIQUE :
//   1. Copier un objet existant dans le fichier de categorie concerne
//   2. Donner un id unique, sans espace, sans accent (ex: "jeune-omad")
//   3. Renseigner tous les champs — laisser 0 si pas d'effet, pas null
//   4. Si la pratique cree une synergie, l'ajouter dans data/synergies/
//   5. Ne pas modifier les ids existants (ils sont references en dur dans les synergies)
//
// CONVENTIONS OBLIGATOIRES :
//   - Pas d'apostrophes typographiques dans les strings TS (le parser esbuild les rejette)
//   - Utiliser les double quotes pour tout string contenant une apostrophe : "cout d'activation"
//   - Pas d'accents dans les identifiants TypeScript
//   - incertitude : "faible" = donne scientifique solide / "modere" = mecanisme connu,
//     donnees partielles / "speculatif" = plausible, peu etudie
// ─────────────────────────────────────────────────────────────────────────────

// Les quatre reservoirs du moteur
// Ajouter ici si un 5e reservoir est cree (ex: "emotionnel")
export type CleReservoir = "met" | "nerv" | "cog" | "rec"

// Effet immediat sur un reservoir
export interface EffetReservoir {
  delta: number          // valeur absolue, positif = gain, negatif = cout
  immediat: boolean      // true = effet le jour meme, false = effet differe
  delai_h?: number       // si immediat=false, delai en heures avant effet
  note: string           // mecanisme physiologique — obligatoire, meme court
}

// Effet repete : ce que produit la pratique si appliquee plusieurs jours
export interface EffetsRepetes {
  J4?: Partial<Record<CleReservoir, { delta: number; note: string }>>
  J7?: Partial<Record<CleReservoir, { delta: number; note: string }>>
  adaptation?: Partial<Record<CleReservoir, { base_modifier: number; note: string }>>
}

// Categorie d'affichage — correspond aux blocs visuels de l'UI
export type Categorie = "sommeil" | "alimentation" | "physique" | "systeme-nerveux" | "substances"

// Niveau d'incertitude de la donnee
export type Incertitude = "faible" | "modere" | "speculatif"

// Structure complete d'une pratique
export interface Pratique {
  id: string                                        // identifiant unique, stable
  label: string                                     // nom affiche dans l'UI
  note_ui: string                                   // phrase courte visible sous le nom
  categorie: Categorie
  groupe_exclusif?: string                          // si defini, une seule pratique de ce groupe peut etre active
  effets: Partial<Record<CleReservoir, EffetReservoir>>
  effets_repetes?: EffetsRepetes                    // vide si pas d'effet cumule connu
  source: string                                    // reference(s) — etude, auteur, annee
  incertitude: Incertitude
  conditions?: string[]                             // conditions qui modifient l'effet (ex: "avec apport proteique")
}
