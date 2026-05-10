// src/data/pratiques/sommeil.ts
// ─────────────────────────────────────────────────────────────────────────────
// PRATIQUES DE SOMMEIL — modifiable independamment du moteur et de l'UI
//
// groupe_exclusif: "sommeil" — une seule pratique de ce groupe peut etre
// active logiquement. Le moteur signale l'incoherence si plusieurs sont actives.
//
// IDS STABLES — ne pas renommer :
//   "sommeil-4" "sommeil-6" "sommeil-8" "sommeil-9plus"
// ─────────────────────────────────────────────────────────────────────────────

import type { Pratique } from "./_schema"

export const pratiquesSommeil: Pratique[] = [

  {
    id: "sommeil-4",
    label: "4-5h",
    note_ui: "Dette severe. Risque cascade.",
    categorie: "sommeil",
    groupe_exclusif: "sommeil",
    effets: {
      met:  { delta: -40, immediat: true, note: "Regulation glucidique alteree, resistane a l'insuline accrue" },
      nerv: { delta: -50, immediat: true, note: "Cortisol chronique, systeme sympathique hyperactif" },
      cog:  { delta: -40, immediat: true, note: "Memoire de travail effondree, temps de reaction degrade" },
      rec:  { delta: -60, immediat: true, note: "Sommeil lent quasi absent, pas de secretion GH, inflammation elevee" },
    },
    effets_repetes: {
      J4: {
        nerv: { delta: -15, note: "Accumulation de dette cognitive non percue subjectivement — danger" },
        rec:  { delta: -20, note: "Inflammation systemique croissante, CRP elevee" },
      },
    },
    source: "Van Dongen et al. 2003 (dette cognitive), Spiegel et al. 1999 (insulin et sommeil), Irwin 2015 (inflammation)",
    incertitude: "faible",
    conditions: [
      "La dette subjective est sous-estimee apres plusieurs jours : danger de fausse confiance",
    ],
  },

  {
    id: "sommeil-6",
    label: "6h",
    note_ui: "Sous-optimal. Subjectif trompeur.",
    categorie: "sommeil",
    groupe_exclusif: "sommeil",
    effets: {
      met:  { delta: -15, immediat: true, note: "Regulation metabolique legerement alteree" },
      nerv: { delta: -20, immediat: true, note: "Cortisol matinal eleve, recuperation SNS incomplete" },
      cog:  { delta: -20, immediat: true, note: "Performances cognitives equivalentes a 24h de privation apres 10j" },
      rec:  { delta: -20, immediat: true, note: "Cycles de sommeil lent incomplets, sommeil paradoxal tronque" },
    },
    effets_repetes: {
      J4: {
        cog: { delta: -10, note: "Degradation cumulative non percue — le sujet se croit adapte" },
      },
    },
    source: "Van Dongen et al. 2003 (6h chronique), Walker 2017 (Why We Sleep — synthese)",
    incertitude: "faible",
    conditions: [
      "Certains individus (mutations DEC2) fonctionnent bien a 6h — rare, non modelise ici",
    ],
  },

  {
    id: "sommeil-8",
    label: "7-8h",
    note_ui: "Zone optimale. Restauration complete.",
    categorie: "sommeil",
    groupe_exclusif: "sommeil",
    effets: {
      met:  { delta: 20, immediat: true, note: "Regulation glucidique optimale, sensibilite insuline preservee" },
      nerv: { delta: 25, immediat: true, note: "Equilibre SNS/SNP restaure, cortisol normalise" },
      cog:  { delta: 20, immediat: true, note: "Consolidation mnesique complete, attention et volonte pleines" },
      rec:  { delta: 30, immediat: true, note: "Cycles N3 complets, GH secretee, inflammation reduite" },
    },
    source: "Consensus NIH, Walker 2017, Hirshkowitz et al. 2015 (National Sleep Foundation)",
    incertitude: "faible",
    conditions: [],
  },

  {
    id: "sommeil-9plus",
    label: "9h+",
    note_ui: "Benefice marginal. Inertie possible.",
    categorie: "sommeil",
    groupe_exclusif: "sommeil",
    effets: {
      met:  { delta: 10, immediat: true, note: "Benefice marginal au-dela de 8h pour la plupart des individus" },
      nerv: { delta: 15, immediat: true, note: "Recuperation complete + possible recharge" },
      cog:  { delta: 10, immediat: true, note: "Inertie de sommeil possible — vigilance initiale reduite" },
      rec:  { delta: 20, immediat: true, note: "Reparation maximale — benefique en recuperation post-effort intense" },
    },
    source: "Hirshkowitz et al. 2015, Cappuccio et al. 2010 (meta-analyse duree sommeil et sante)",
    incertitude: "modere",
    conditions: [
      "Benefice reel en recuperation apres surmenage ou maladie",
      "Sommeil excessif chronique associe a des outcomes negatifs — probablement signal de maladie sous-jacente",
    ],
  },

]
