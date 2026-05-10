// src/engine/calculator.ts
// ─────────────────────────────────────────────────────────────────────────────
// MOTEUR DE CALCUL — ne pas modifier sans raison precise
//
// Ce fichier contient la logique pure de calcul des reservoirs.
// Il ne connait PAS l'UI. Il ne connait PAS les donnees directement —
// il recoit tout en parametre.
//
// API PUBLIQUE :
//   calculerEtat(pratiquesActives, toutesLesPratiques, toutesLesSynergies, profil, temporel?)
//   → ResultatCalcul
//
// MODIFIER CE FICHIER si :
//   - La logique de calcul change (ex: ajouter des effets temporels)
//   - On ajoute un nouveau reservoir
//   - On change la formule de base
//
// NE PAS MODIFIER ce fichier pour :
//   - Changer les valeurs d'une pratique → aller dans data/pratiques/
//   - Ajouter une synergie → aller dans data/synergies/
//   - Changer l'affichage → aller dans le composant UI
// ─────────────────────────────────────────────────────────────────────────────

import type { Pratique, CleReservoir } from "../data/pratiques/_schema"
import type { Synergie } from "../data/synergies/_schema"

// ── Types de sortie du moteur ─────────────────────────────────────────────────

export interface SourceEffect {
  pratique_id: string
  delta: number
}

export interface ResultatReservoir {
  base: number
  effets_pratiques: number
  effets_synergies: number
  effets_temporels: number                // nouveau : cumul des effets J4 et adaptation
  total: number                           // clamp [0, max]
  sources: SourceEffect[]                 // quelles pratiques contribuent
}

export interface ResultatCalcul {
  reservoirs: Record<CleReservoir, ResultatReservoir>
  synergies_actives: Synergie[]
  alertes_groupes: string[]               // incoherences detectees (2 sommeils actifs, etc.)
  alertes_temporelles: string[]           // nouveau : avertissements lies aux effets J4/adaptation
}

// ── Profil ────────────────────────────────────────────────────────────────────

export interface Profil {
  sexe: "M" | "F" | null
  age: "18-25" | "26-35" | "36-50" | "50+" | null
}

// ── Contexte temporel ─────────────────────────────────────────────────────────
//
// jours_consecutifs : combien de jours de suite cette pratique est realisee
//   → active les malus J4 si >= 4
// semaines_regulier : combien de semaines de pratique reguliere (3+ fois/semaine)
//   → active les bonus d'adaptation si >= 3 (musculation) ou >= 6 (HIIT)
//   → seuil par pratique defini dans effets_repetes.adaptation (non encore encode)
//     Pour l'instant : seuil fixe a 3 semaines pour tous les bonus d'adaptation.

export interface ContexteTemporel {
  // Par pratique : { "hiit": { jours_consecutifs: 5, semaines_regulier: 2 } }
  par_pratique: Record<string, {
    jours_consecutifs?: number
    semaines_regulier?: number
  }>
}

// Seuil a partir duquel les effets_repetes.J4 s'appliquent
const SEUIL_J4 = 4

// Seuil en semaines a partir duquel les effets_repetes.adaptation s'appliquent
const SEUIL_ADAPTATION_SEMAINES = 3

// Modificateurs de base par profil
const BASE_PROFIL: Record<string, Partial<Record<CleReservoir, number>>> = {
  "F-18-25": { met: 70,  nerv: 66,  cog: 70,  rec: 77 },
  "F-26-35": { met: 66,  nerv: 66,  cog: 70,  rec: 70 },
  "F-36-50": { met: 63,  nerv: 63,  cog: 66,  rec: 63 },
  "F-50+":   { met: 59,  nerv: 59,  cog: 63,  rec: 56 },
  "M-18-25": { met: 73,  nerv: 70,  cog: 70,  rec: 73 },
  "M-26-35": { met: 70,  nerv: 70,  cog: 70,  rec: 70 },
  "M-36-50": { met: 64,  nerv: 64,  cog: 66,  rec: 61 },
  "M-50+":   { met: 59,  nerv: 61,  cog: 63,  rec: 56 },
}

const BASE_DEFAUT: Record<CleReservoir, number> = { met: 70, nerv: 70, cog: 70, rec: 70 }
const MAX_RESERVOIR = 150
const MIN_RESERVOIR = 0

// Groupes mutuellement exclusifs
const GROUPES_EXCLUSIFS: Record<string, string[]> = {
  sommeil: ["sommeil-4", "sommeil-6", "sommeil-8", "sommeil-9plus"],
}

// ── Fonction principale ───────────────────────────────────────────────────────

export function calculerEtat(
  pratiquesActivesIds: Set<string>,
  toutesLesPratiques: Pratique[],
  toutesLesSynergies: Synergie[],
  profil: Profil,
  temporel?: ContexteTemporel
): ResultatCalcul {

  const clesProfil: CleReservoir[] = ["met", "nerv", "cog", "rec"]

  // 1. Base selon profil
  const cle_profil = profil.sexe && profil.age ? `${profil.sexe}-${profil.age}` : null
  const base = cle_profil ? BASE_PROFIL[cle_profil] ?? BASE_DEFAUT : BASE_DEFAUT

  // 2. Effets des pratiques actives (immediats)
  const effets_pratiques: Record<CleReservoir, number> = { met: 0, nerv: 0, cog: 0, rec: 0 }
  const sources: Record<CleReservoir, SourceEffect[]> = { met: [], nerv: [], cog: [], rec: [] }

  for (const id of pratiquesActivesIds) {
    const pratique = toutesLesPratiques.find(p => p.id === id)
    if (!pratique) continue

    for (const cle of clesProfil) {
      const effet = pratique.effets[cle]
      if (!effet || effet.delta === 0) continue
      effets_pratiques[cle] += effet.delta
      sources[cle].push({ pratique_id: id, delta: effet.delta })
    }
  }

  // 3. Synergies actives
  const synergies_actives = toutesLesSynergies.filter(s =>
    !s.deprecated && s.pratiques.every((id: string) => pratiquesActivesIds.has(id))
  )

  const effets_synergies: Record<CleReservoir, number> = { met: 0, nerv: 0, cog: 0, rec: 0 }
  for (const syn of synergies_actives) {
    for (const cle of clesProfil) {
      effets_synergies[cle] += syn.effets[cle] ?? 0
    }
  }

  // 4. Effets temporels (J4 et adaptation)
  //    Appliques uniquement si un contexte temporel est fourni.
  const effets_temporels: Record<CleReservoir, number> = { met: 0, nerv: 0, cog: 0, rec: 0 }
  const base_modifiers: Record<CleReservoir, number> = { met: 0, nerv: 0, cog: 0, rec: 0 }
  const alertes_temporelles: string[] = []

  if (temporel) {
    for (const id of pratiquesActivesIds) {
      const pratique = toutesLesPratiques.find(p => p.id === id)
      if (!pratique?.effets_repetes) continue

      const ctx = temporel.par_pratique[id]
      if (!ctx) continue

      // 4a. Malus J4 : pratique repetee sans recuperation suffisante
      const jours = ctx.jours_consecutifs ?? 0
      if (jours >= SEUIL_J4 && pratique.effets_repetes.J4) {
        const j4 = pratique.effets_repetes.J4
        let alerte_produite = false

        for (const cle of clesProfil) {
          const effet_j4 = j4[cle as keyof typeof j4]
          if (!effet_j4) continue
          effets_temporels[cle] += effet_j4.delta
          if (!alerte_produite) {
            alertes_temporelles.push(
              `${pratique.label} — ${jours}j consecutifs : malus d'accumulation actif.`
            )
            alerte_produite = true
          }
        }
      }

      // 4b. Bonus d'adaptation : pratique reguliere depuis N semaines
      const semaines = ctx.semaines_regulier ?? 0
      if (semaines >= SEUIL_ADAPTATION_SEMAINES && pratique.effets_repetes.adaptation) {
        const adapt = pratique.effets_repetes.adaptation
        let alerte_produite = false

        for (const cle of clesProfil) {
          const effet_adapt = adapt[cle as keyof typeof adapt]
          if (!effet_adapt) continue
          // base_modifier s'applique a la base du reservoir, pas aux deltas immediats
          base_modifiers[cle] += effet_adapt.base_modifier
          if (!alerte_produite) {
            alertes_temporelles.push(
              `${pratique.label} — ${semaines} semaines regulieres : bonus d'adaptation actif.`
            )
            alerte_produite = true
          }
        }
      }
    }
  }

  // 5. Totaux avec clamp
  //    base_modifier s'applique sur la base avant le reste du calcul.
  const reservoirs = {} as Record<CleReservoir, ResultatReservoir>
  for (const cle of clesProfil) {
    const b = (base[cle] ?? BASE_DEFAUT[cle]) + base_modifiers[cle]
    const total = Math.max(
      MIN_RESERVOIR,
      Math.min(
        MAX_RESERVOIR,
        b + effets_pratiques[cle] + effets_synergies[cle] + effets_temporels[cle]
      )
    )
    reservoirs[cle] = {
      base: b,
      effets_pratiques: effets_pratiques[cle],
      effets_synergies: effets_synergies[cle],
      effets_temporels: effets_temporels[cle],
      total,
      sources: sources[cle],
    }
  }

  // 6. Alertes de coherence (groupes exclusifs)
  const alertes_groupes: string[] = []
  for (const [groupe, ids] of Object.entries(GROUPES_EXCLUSIFS)) {
    const actifs = ids.filter(id => pratiquesActivesIds.has(id))
    if (actifs.length > 1) {
      alertes_groupes.push(`Plusieurs options "${groupe}" selectionnees — une seule est possible.`)
    }
  }

  return { reservoirs, synergies_actives, alertes_groupes, alertes_temporelles }
}

// ── Verdict textuel ───────────────────────────────────────────────────────────
// Separe du calcul pour pouvoir etre modifie independamment

export function formulerVerdict(
  reservoirs: Record<CleReservoir, ResultatReservoir>,
  nb_pratiques_actives: number
): string {
  if (nb_pratiques_actives === 0) return "Ajoutez des pratiques pour voir les tensions."

  const totaux = Object.values(reservoirs).map(r => r.total)
  const min = Math.min(...totaux)
  const moy = totaux.reduce((a, b) => a + b, 0) / totaux.length

  if (min <= 10) return "Zone critique. Un ou plusieurs reservoirs sont epuises. Le systeme est en danger de cascade."
  if (min <= 30) return "Tension severe. L'adaptation est possible mais la fenetre de recuperation est etroite."
  if (min <= 50 && moy >= 60) return "Desequilibre : certaines dimensions compensent d'autres. Modelement soutenable a court terme."
  if (moy >= 80) return "Combinaison favorable. Les reservoirs se renforcent mutuellement."
  if (moy >= 60) return "Equilibre raisonnable. Des marges d'optimisation existent."
  return "Combinaison chargee. La recuperation sera determinante."
}
