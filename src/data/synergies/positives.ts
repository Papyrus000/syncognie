// src/data/synergies/positives.ts
// ─────────────────────────────────────────────────────────────────────────────
// SYNERGIES POSITIVES (amplifications)
//
// Chaque synergie s'active quand TOUTES les pratiques listees dans "pratiques"
// sont actives simultanement. L'effet est additionnel aux effets individuels.
//
// POUR AJOUTER :
//   Copier un bloc complet. Verifier que les ids existent dans les fichiers pratiques.
//   Renseigner source et incertitude — ne pas laisser vide.
//
// POUR MODIFIER un delta : changer uniquement le nombre dans effets.
// POUR DESACTIVER sans supprimer : passer deprecated: true
//
// IDS STABLES — ne pas renommer :
//   "syn-sommeil-meditation" "syn-jeune-marche" "syn-jeune-keto"
//   "syn-contraste-thermique" "syn-meditation-respiration"
//   "syn-force-sommeil" "syn-magnesium-sommeil" "syn-jeune-cognition"
// ─────────────────────────────────────────────────────────────────────────────

import type { Synergie } from "./_schema"

export const synergiesPositives: Synergie[] = [

  {
    id: "syn-sommeil-meditation",
    pratiques: ["sommeil-8", "meditation"],
    type: "amplification",
    label_ui: "Sommeil + Meditation",
    detail_ui: "Cortisol bas + ondes delta renforcees. La meditation approfondit les cycles de sommeil lent, amplifiant la reparation cellulaire.",
    effets: { nerv: 10, rec: 10 },
    source: "Hoge et al. 2018 (meditation et sommeil), Cahn & Polich 2006 (EEG meditation)",
    incertitude: "modere",
  },

  {
    id: "syn-jeune-marche",
    pratiques: ["jeune-16", "marche"],
    type: "amplification",
    label_ui: "Jeune + Marche",
    detail_ui: "Lipides comme carburant principal. L'effort modere en etat de jeune optimise l'oxydation des graisses et favorise la cetose.",
    effets: { met: 10, rec: 5 },
    source: "Van Proeyen et al. 2011 (exercice a jeun), Volek & Phinney 2012",
    incertitude: "modere",
  },

  {
    id: "syn-jeune-keto",
    pratiques: ["jeune-16", "keto"],
    type: "amplification",
    label_ui: "Jeune + Keto",
    detail_ui: "Autophagie renforcee. La restriction calorique et la cetose convergent pour accelerer le renouvellement cellulaire.",
    effets: { rec: 15, met: 5 },
    source: "Longo & Mattson 2014 (jeune et autophagie), Paoli et al. 2013 (keto)",
    incertitude: "modere",
    conditions: ["Benefice maximal apres 2-4 semaines d'adaptation au regime cetogene"],
  } as Synergie & { conditions?: string[] },

  {
    id: "syn-contraste-thermique",
    pratiques: ["froid", "sauna"],
    type: "amplification",
    label_ui: "Contraste froid / chaud",
    detail_ui: "Protocole de contraste vasculaire. Vasoconstriction + vasodilatation alternees. Secretion de norepinephrine et proteines HSP.",
    effets: { nerv: 15, rec: 10 },
    source: "Bleakley & Davison 2010 (contraste thermique), Laukkanen et al. 2018 (sauna)",
    incertitude: "modere",
  },

  {
    id: "syn-meditation-respiration",
    pratiques: ["meditation", "respiration"],
    type: "amplification",
    label_ui: "Meditation + Respiration",
    detail_ui: "SNP profond. La coherence cardiaque produite par la respiration rythmee potentialise l'etat meditatif et la regulation du cortisol.",
    effets: { nerv: 12, cog: 8 },
    source: "Lehrer & Gevirtz 2014 (coherence cardiaque), Brown & Gerbarg 2005 (respiration yogique)",
    incertitude: "modere",
  },

  {
    id: "syn-force-sommeil",
    pratiques: ["sommeil-8", "force"],
    type: "amplification",
    label_ui: "Sommeil optimal + Musculation",
    detail_ui: "GH secretee en sommeil profond. La synthese proteique post-effort est maximisee quand le sommeil lent est complet.",
    effets: { rec: 15, met: 10 },
    source: "Van Cauter et al. 2000 (GH et sommeil), Dattilo et al. 2011 (sommeil et muscle)",
    incertitude: "faible",
  },

  {
    id: "syn-magnesium-sommeil",
    pratiques: ["magnesium", "sommeil-8"],
    type: "amplification",
    label_ui: "Magnesium + Sommeil",
    detail_ui: "GABA facilite par le magnesium. Le sommeil profond (N3) est augmente, amplifiant la recuperation cellulaire.",
    effets: { rec: 12, nerv: 8 },
    source: "Abbasi et al. 2012 (magnesium et qualite du sommeil), Rondanelli et al. 2011",
    incertitude: "modere",
  },

  {
    id: "syn-jeune-cognition",
    pratiques: ["jeune-16", "cognitif-intense"],
    type: "amplification",
    label_ui: "Jeune court + Travail cognitif",
    detail_ui: "Corps cetoniques comme carburant cerebral alternatif. La concentration peut etre maintenue — mais la fenetre est etroite et variable.",
    effets: { cog: 8 },
    source: "Cahill 2006 (cetones et cerveau), Owen et al. 1967",
    incertitude: "speculatif",
    conditions: ["Documentee surtout apres adaptation metabolique (2-4 semaines). Fragile en debut de regime cetonique."],
  } as Synergie & { conditions?: string[] },

]
