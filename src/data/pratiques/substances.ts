// src/data/pratiques/substances.ts
// ─────────────────────────────────────────────────────────────────────────────
// SUBSTANCES — modifiable independamment du moteur et de l'UI
//
// Substances qui modifient les reservoirs de facon chimique/pharmacologique.
// Certaines sont neutres ou benefiques (creatine, magnesium),
// d'autres sont couteux (cafeine par emprunt, alcool par degradation).
//
// IDS STABLES — ne pas renommer :
//   "cafeine" "alcool" "creatine" "magnesium"
// ─────────────────────────────────────────────────────────────────────────────

import type { Pratique } from "./_schema"

export const pratiquesSubstances: Pratique[] = [

  {
    id: "cafeine",
    label: "Cafeine",
    note_ui: "Adenosine bloquee. Emprunt d'energie. Crash possible.",
    categorie: "substances",
    effets: {
      cog:  { delta:  15, immediat: true, note: "Blocage adenosine = vigilance accrue, temps de reaction ameliore" },
      met:  { delta:  10, immediat: true, note: "Lipolyse stimulee, oxydation graisses augmentee" },
      nerv: { delta: -10, immediat: true, note: "Cortisol et adrenaline augmentes — cout nerveux de l'emprunt" },
    },
    effets_repetes: {
      J4: {
        nerv: { delta: -5, note: "Tolerance croissante, doses plus elevees necessaires pour le meme effet" },
      },
      adaptation: {
        cog: { base_modifier: -8, note: "Tolerance complete : la cafeine restaure la baseline, ne l'ameliore plus" },
      },
    },
    source: "Fredholm et al. 1999 (cafeine et adenosine), Nehlig 2010 (cafeine et cerveau), Rogers et al. 2013",
    incertitude: "faible",
    conditions: [
      "La cafeine prise apres 14h perturbe le sommeil meme si l'endormissement semble normal",
      "La demi-vie est de 5-7h — encore active le soir si consommee l'apres-midi",
      "L'arret brutal provoque une periode de sevrage (cephalees, fatigue) de 1-3 jours",
    ],
  },

  {
    id: "alcool",
    label: "Alcool",
    note_ui: "Sommeil fragmente. REM supprime. Cortisol haut.",
    categorie: "substances",
    effets: {
      nerv: { delta: -25, immediat: true, note: "Perturbation GABA/glutamate, desequilibre neurotransmetteurs" },
      rec:  { delta: -35, immediat: true, note: "Sommeil lent fragmente, REM supprime, pas de secretion GH" },
      cog:  { delta: -20, immediat: true, note: "Consolidation mnesique nocturne compromise, BDNF reduit" },
      met:  { delta: -15, immediat: true, note: "Metabolisme hepatique detourne, lipogenese activee" },
    },
    effets_repetes: {
      J4: {
        nerv: { delta: -10, note: "Dependance physique progressive, anxiety de rebond en manque" },
        rec:  { delta: -15, note: "Dette de sommeil cumulee, microeveils nocturnes croissants" },
      },
    },
    source: "Ebrahim et al. 2013 (alcool et sommeil), Barnes et al. 2010 (alcool et muscle), Oscar-Berman & Marinkoviç 2003",
    incertitude: "faible",
    conditions: [
      "Meme faible dose (1-2 verres) degrade significativement le sommeil REM",
      "L'effet sedatif initial masque la degradation reelle de la qualite du sommeil",
    ],
  },

  {
    id: "creatine",
    label: "Creatine",
    note_ui: "ATP disponible. Benefice cognitif modere documente.",
    categorie: "substances",
    effets: {
      met: { delta: 10, immediat: false, delai_h: 168, note: "Stocks de phosphocreatine augmentes, ATP disponible plus rapidement" },
      cog: { delta:  5, immediat: false, delai_h: 168, note: "Disponibilite energetique cerebrale legerement amelioree" },
    },
    effets_repetes: {
      adaptation: {
        met: { base_modifier: 6, note: "Saturation des stocks musculaires apres 5-7 jours de charge ou 3-4 semaines de maintenance" },
      },
    },
    source: "Rawson & Volek 2003 (creatine et force), Rae et al. 2003 (creatine et cognition), Antonio & Ciccone 2013",
    incertitude: "modere",
    conditions: [
      "Effets maximaux sur le reservoir met apres saturation complete (5-7 jours de charge a 20g/j ou 3-4 semaines a 3-5g/j)",
      "Le benefice cognitif est surtout documente en situation de privation de sommeil ou stress",
    ],
  },

  {
    id: "magnesium",
    label: "Magnesium",
    note_ui: "Regulation SNP. Sommeil profond facilite.",
    categorie: "substances",
    effets: {
      nerv: { delta: 10, immediat: false, delai_h: 72, note: "Co-facteur GABA, reduction de l'hyperexcitabilite neuronale" },
      rec:  { delta: 15, immediat: false, delai_h: 72, note: "Sommeil profond N3 augmente, reparation cellulaire amelioree" },
    },
    effets_repetes: {
      adaptation: {
        nerv: { base_modifier: 4, note: "Correction d'une carence (frequente) restaure la regulation nerveux baseline" },
      },
    },
    source: "Abbasi et al. 2012 (magnesium et sommeil), Rondanelli et al. 2011, Nielsen et al. 2010",
    incertitude: "modere",
    conditions: [
      "Les effets sont plus prononces chez les personnes en carence — tres frequente (60-70% population occidentale)",
      "La forme compte : glycinate et threonate ont meilleure biodisponibilite que oxyde",
      "Les effets apparaissent apres plusieurs jours de supplementation reguliere",
    ],
  },

]
