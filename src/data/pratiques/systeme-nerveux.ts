// src/data/pratiques/systeme-nerveux.ts
// ─────────────────────────────────────────────────────────────────────────────
// PRATIQUES SYSTEME NERVEUX — modifiable independamment du moteur et de l'UI
//
// Cette categorie contient a la fois des pratiques benefiques (meditation,
// respiration, froid, sauna) et des comportements couteux (ecran le soir,
// travail cognitif intense).
//
// IDS STABLES — ne pas renommer :
//   "meditation" "froid" "sauna" "respiration" "ecran-soir" "cognitif-intense"
// ─────────────────────────────────────────────────────────────────────────────

import type { Pratique } from "./_schema"

export const pratiquesSystemeNerveux: Pratique[] = [

  {
    id: "meditation",
    label: "Meditation",
    note_ui: "Cortisol reduit. Attention renforcee.",
    categorie: "systeme-nerveux",
    effets: {
      nerv: { delta: 20, immediat: true, note: "Reduction du cortisol, activation SNP, coherence cardiaque" },
      cog:  { delta: 15, immediat: true, note: "Attention selective et soutenue renforcees, rumination reduite" },
      rec:  { delta:  5, immediat: true, note: "Relaxation profonde, facilite l'endormissement" },
    },
    effets_repetes: {
      adaptation: {
        nerv: { base_modifier: 8, note: "Modifications structurelles prefrontales apres 8 semaines de pratique reguliere" },
        cog:  { base_modifier: 6, note: "Epaississement cortex prefrontal, meilleure regulation emotionnelle" },
      },
    },
    source: "Hoge et al. 2013 (cortisol), Tang et al. 2015 (neuro-imagerie), Lazar et al. 2005 (cortex)",
    incertitude: "modere",
    conditions: [
      "Les effets structurels (adaptation) necessitent une pratique reguliere sur 6-8 semaines minimum",
      "La qualite de la pratique importe plus que la duree — difficulte non modelisee ici",
    ],
  },

  {
    id: "froid",
    label: "Exposition au froid",
    note_ui: "Norepinephrine. Hormese neurovasculaire.",
    categorie: "systeme-nerveux",
    effets: {
      nerv: { delta:  15, immediat: true,  note: "Pic de norepinephrine (200-300%), dopamine elevee durablement" },
      met:  { delta:  10, immediat: true,  note: "Thermogenese, activation graisse brune, metabolisme eleve" },
      rec:  { delta:  -5, immediat: true,  note: "Stress oxydatif aigu — hormese si dose adequate" },
    },
    effets_repetes: {
      adaptation: {
        nerv: { base_modifier: 5, note: "Meilleure tolerance au stress, regulation dopaminergique amelioree" },
      },
    },
    source: "Srámek et al. 2000 (froid et norepinephrine), Huberman Lab — Søberg et al. 2021 (protocole froid)",
    incertitude: "modere",
    conditions: [
      "L'effet sur la recuperation musculaire est debattu : peut inhiber l'adaptation hypertrophique si utilise post-musculation",
      "Benefice nerveux maximal avec eau froide (10-15C), 2-3 min minimum",
    ],
  },

  {
    id: "sauna",
    label: "Sauna",
    note_ui: "Proteines de choc thermique. Vasodilatation. HSP.",
    categorie: "systeme-nerveux",
    effets: {
      nerv: { delta:  10, immediat: true, note: "Endorphines, relaxation SNP post-session" },
      rec:  { delta:  20, immediat: true, note: "Proteines HSP, reparation cellulaire, vasodilatation" },
      met:  { delta: -10, immediat: true, note: "Depense energetique moderee, dehydratation partielle" },
    },
    effets_repetes: {
      adaptation: {
        rec:  { base_modifier: 6, note: "Adaptation cardiovasculaire, reduction inflammation chronique" },
      },
    },
    source: "Laukkanen et al. 2018 (sauna et mortalite cardiovasculaire), Scoon et al. 2007 (sauna et recuperation)",
    incertitude: "modere",
    conditions: [
      "Hydratation adequate obligatoire avant et apres",
      "Contre-indique en etat de fatigue extreme ou de maladie aigue",
    ],
  },

  {
    id: "respiration",
    label: "Respiration intense",
    note_ui: "Alcalose transitoire. Activation SNS puis SNP.",
    categorie: "systeme-nerveux",
    effets: {
      nerv: { delta: 12, immediat: true, note: "Regulation du SNS par hyperventilation puis coherence cardiaque" },
      cog:  { delta:  8, immediat: true, note: "Alerte cognitive elevee pendant, calme profond apres" },
    },
    source: "Brown & Gerbarg 2005 (respiration yogique), Lehrer & Gevirtz 2014 (coherence cardiaque)",
    incertitude: "modere",
    conditions: [
      "L'effet depend fortement du protocole : Wim Hof (stress puis relaxation) vs coherence cardiaque (regulation douce)",
      "L'alcalose transitoire peut provoquer vertiges si pratique mal encadree",
    ],
  },

  {
    id: "ecran-soir",
    label: "Ecran le soir",
    note_ui: "Melatonine supprimee. Sommeil differe. Cortisol haut.",
    categorie: "systeme-nerveux",
    effets: {
      nerv: { delta: -15, immediat: true, note: "Lumiere bleue = suppression melatonine, cortisol maintenu haut" },
      rec:  { delta: -25, immediat: true, note: "Endormissement retarde, architecture du sommeil degradee" },
      cog:  { delta: -10, immediat: true, note: "Eveil artificiel, memoire de consolidation nocturne reduite" },
    },
    effets_repetes: {
      J4: {
        nerv: { delta: -8, note: "Dysregulation circadienne croissante, rythme melatonine perturbe" },
      },
    },
    source: "Chang et al. 2015 (iPad et melatonine), Gooley et al. 2011 (lumiere et melatonine)",
    incertitude: "faible",
    conditions: [
      "Les lunettes anti-lumiere bleue reduisent l'effet mais ne l'eliminent pas",
      "Le contenu (stimulant vs neutre) joue aussi un role — non modelise ici",
    ],
  },

  {
    id: "cognitif-intense",
    label: "Travail cognitif intense",
    note_ui: "Ego depletion. Glucose cerebral consomme.",
    categorie: "systeme-nerveux",
    effets: {
      cog:  { delta: -30, immediat: true, note: "Epuisement ressources attentionnelles, ego depletion" },
      nerv: { delta: -15, immediat: true, note: "Activation SNS prolongee, cortisol eleve en travail de concentration" },
      met:  { delta: -10, immediat: true, note: "Consommation accrue de glucose cerebral (cerveau = 20% de la depense totale)" },
    },
    effets_repetes: {
      J4: {
        cog:  { delta: -10, note: "Burnout cognitif progressif sans recuperation adequate" },
      },
    },
    source: "Baumeister et al. 1998 (ego depletion), Hagger et al. 2016 (meta-analyse ego depletion)",
    incertitude: "modere",
    conditions: [
      "Le concept d'ego depletion est debattu — certaines replications echouent. Effet reel mais mecanisme incertain.",
      "La recuperation cognitive rapide est possible avec pause, marche ou sommeil court (nap)",
    ],
  },

]
