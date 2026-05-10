// src/data/pratiques/alimentation.ts
// ─────────────────────────────────────────────────────────────────────────────
// PRATIQUES ALIMENTAIRES — modifiable independamment du moteur et de l'UI
//
// Pas de groupe_exclusif strict ici — plusieurs strategies peuvent coexister
// (ex: keto + jeune 16h). Le moteur alerte si plus de 2 sont actives simultanement
// car la coherence devient difficile a interpreter.
//
// IDS STABLES — ne pas renommer :
//   "jeune-16" "jeune-24" "keto" "equilibre" "ultra-transforme" "glucides-charge"
// ─────────────────────────────────────────────────────────────────────────────

import type { Pratique } from "./_schema"

export const pratiquesAlimentation: Pratique[] = [

  {
    id: "jeune-16",
    label: "Jeune 16h",
    note_ui: "Autophagique leger. Cetose partielle possible.",
    categorie: "alimentation",
    effets: {
      met: { delta: -15, immediat: true,  note: "Depletion glycogene hepatique partielle, mobilisation lipides" },
      rec: { delta:  15, immediat: false, delai_h: 12, note: "Autophagie activee apres ~12-14h de jeune" },
    },
    effets_repetes: {
      adaptation: {
        met: { base_modifier: 4, note: "Amelioration de la flexibilite metabolique apres 2-4 semaines" },
      },
    },
    source: "Longo & Mattson 2014 (IF et autophagie), Anton et al. 2018 (IF humain)",
    incertitude: "modere",
    conditions: [
      "La cetose partielle necessite un glycogene bas — variable selon l'activite precedente",
      "Effets reduits si le jeune est brise par des aliments glucidiques",
    ],
  },

  {
    id: "jeune-24",
    label: "Jeune 24h",
    note_ui: "Autophagie profonde. Stress metabolique reel.",
    categorie: "alimentation",
    effets: {
      met:  { delta: -35, immediat: true,  note: "Glycogene hepatique epuise, gluconeogenese activee" },
      nerv: { delta: -10, immediat: true,  note: "Stress adaptatif — cortisol et glucagon eleves" },
      rec:  { delta:  25, immediat: false, delai_h: 18, note: "Autophagie profonde, nettoyage cellulaire intense" },
    },
    effets_repetes: {
      J4: {
        met:  { delta: -15, note: "Catabolisme musculaire croissant si pratique consecutive sans proteines" },
        nerv: { delta: -10, note: "Fatigue surrenalienne si jeunes rapproches sans periode de recharge" },
      },
    },
    source: "Longo & Mattson 2014, Cahill 2006 (metabolisme du jeune prolonge)",
    incertitude: "modere",
    conditions: [
      "Contre-indique sans experience prealable du jeune intermittent",
      "Risque de catabolisme musculaire si pratique frequente sans apport proteique adequat en fenetre alimentaire",
    ],
  },

  {
    id: "keto",
    label: "Keto",
    note_ui: "Stable post-adaptation. Transition couteuse.",
    categorie: "alimentation",
    effets: {
      met:  { delta:  0,  immediat: false, delai_h: 336, note: "Neutre apres adaptation (2-4 semaines). Couteux pendant la transition." },
      nerv: { delta:  10, immediat: false, delai_h: 336, note: "Stabilite glycemique = moins de fluctuations de cortisol" },
      cog:  { delta:  10, immediat: false, delai_h: 336, note: "Corps cetoniques carburant cerebral efficace post-adaptation" },
    },
    effets_repetes: {
      adaptation: {
        met: { base_modifier: 5, note: "Flexibilite metabolique accrue apres 4-6 semaines d'adaptation complete" },
      },
    },
    source: "Volek & Phinney 2012, Paoli et al. 2013, Newman & Verdin 2014 (cetones et cerveau)",
    incertitude: "modere",
    conditions: [
      "Les effets cognitifs et nerveux ne sont presents qu'apres adaptation complete (2-4 semaines minimum)",
      "La transition initiale (keto flu) peut couter -20 a -30 sur tous les reservoirs pendant 1-2 semaines — non modele ici",
    ],
  },

  {
    id: "equilibre",
    label: "Diet equilibree",
    note_ui: "Socle robuste. Pas de peak, pas de crash.",
    categorie: "alimentation",
    effets: {
      met:  { delta: 15, immediat: true, note: "Apport glucidique stable, glycemie regulee, glycogene maintenu" },
      nerv: { delta:  5, immediat: true, note: "Stabilite de l'humeur et de l'energie liee a la glycemie stable" },
      cog:  { delta:  5, immediat: true, note: "Glucose cerebral maintenu de facon reguliere" },
    },
    source: "Consensus nutritionnel (OMS, ANSES) — effet de base d'une alimentation non restrictive et variee",
    incertitude: "faible",
    conditions: [],
  },

  {
    id: "ultra-transforme",
    label: "Ultra-transforme",
    note_ui: "Inflammation. Microbiote perturbe.",
    categorie: "alimentation",
    effets: {
      met:  { delta: -20, immediat: true, note: "Pic glycemique suivi de crash, charge glycemique elevee" },
      nerv: { delta: -15, immediat: true, note: "Inflammation systemique, dysbiose intestinale, axe gut-brain perturbe" },
      rec:  { delta: -20, immediat: true, note: "Inflammation chronique de bas grade, reparation cellulaire ralentie" },
    },
    effets_repetes: {
      J4: {
        nerv: { delta: -10, note: "Dysbiose intestinale croissante, production de SCFA reduite" },
        rec:  { delta: -10, note: "Inflammation systemique persistante" },
      },
    },
    source: "Monteiro et al. 2019 (classification NOVA), Zinöcker & Lindseth 2018 (aliments transformes et inflammation)",
    incertitude: "modere",
    conditions: [
      "L'effet varie selon le type d'aliment ultra-transforme — modele simplifie ici",
    ],
  },

  {
    id: "glucides-charge",
    label: "Charge glucidique",
    note_ui: "Pic d'energie court. Chute glycemique apres.",
    categorie: "alimentation",
    effets: {
      met:  { delta:  25, immediat: true, note: "Reconstitution rapide du glycogene musculaire et hepatique" },
      nerv: { delta:  -5, immediat: true, note: "Pic insulinique suivi d'hypoglycemie reactive possible" },
    },
    source: "Burke et al. 2011 (carbohydrate loading et performance), Jeukendrup 2011",
    incertitude: "faible",
    conditions: [
      "Pertinent avant effort intense (J-1 ou J-2). Contre-productif sans effort physique suivant.",
      "La chute glycemique reactive varie selon la sensibilite a l'insuline",
    ],
  },

]
