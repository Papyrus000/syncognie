// src/data/synergies/tensions.ts
// ─────────────────────────────────────────────────────────────────────────────
// SYNERGIES NEGATIVES : antagonistes, dangers, hormese
//
// "antagoniste" : les pratiques s'annulent ou se contredisent
// "danger"      : risque physiologique reel, effets severes
// "hormese"     : destructeur par defaut, potentiellement adaptatif si conditions_hormese remplies
//
// Le moteur (engine/synergy-resolver.ts) affiche les hormeses avec un warning
// et verifie si condition_hormese.reservoirs_requis est satisfaite pour
// afficher le benefice potentiel.
//
// NE PAS supprimer — marquer deprecated: true si obsolete.
// ─────────────────────────────────────────────────────────────────────────────

import type { Synergie } from "./_schema"

export const synergiesTensions: Synergie[] = [

  {
    id: "syn-hiit-dette-sommeil",
    pratiques: ["hiit", "sommeil-4"],
    type: "danger",
    label_ui: "HIIT + Dette de sommeil severe",
    detail_ui: "Cortisol chronique + catabolisme musculaire. Les benefices du HIIT sont annules. Risque de surentrainement et de blessure eleve.",
    effets: { nerv: -20, met: -15, rec: -20 },
    source: "Fullagar et al. 2015 (sommeil et performance), Meeusen et al. 2013 (surentrainement)",
    incertitude: "faible",
  },

  {
    id: "syn-hiit-jeune-24",
    pratiques: ["hiit", "jeune-24"],
    type: "hormese",
    label_ui: "HIIT + Jeune 24h",
    detail_ui: "Reserves glycogene vides + effort maximal. Stress metabolique extreme. Possible si le corps est parfaitement adapte, destructeur sinon.",
    effets: { met: -25, nerv: -15 },
    condition_hormese: {
      reservoirs_requis: { rec: { min: 70 } },
      benefice_si_condition: {
        met: {
          base_modifier: 5,
          delai_jours: 14,
          note: "Adaptation a l'utilisation des lipides apres 2 semaines de protocole regulier",
        },
      },
      label_ui: "Adaptation possible si recuperation > 70 et protocole progressif sur 2 semaines",
    },
    source: "Moro et al. 2016 (IF + entrainement), Longo & Mattson 2014",
    incertitude: "modere",
  },

  {
    id: "syn-alcool-musculation",
    pratiques: ["alcool", "force"],
    type: "antagoniste",
    label_ui: "Alcool + Musculation",
    detail_ui: "Synthese proteique reduite de 20-30%. REM supprime = pas de secretion de GH. La recuperation musculaire est significativement compromise.",
    effets: { rec: -20, met: -10 },
    source: "Barnes et al. 2010 (alcool et synthese proteique), Prat et al. 2021 (sommeil et alcool)",
    incertitude: "faible",
  },

  {
    id: "syn-ecran-sommeil",
    pratiques: ["ecran-soir", "sommeil-8"],
    type: "antagoniste",
    label_ui: "Ecran le soir + Sommeil 8h",
    detail_ui: "Melatonine supprimee par la lumiere bleue. L'endormissement est retarde, transformant 8h planifiees en 6h effectives.",
    effets: { rec: -15, nerv: -10 },
    source: "Chang et al. 2015 (lumiere bleue et melatonine), Gooley et al. 2011",
    incertitude: "faible",
  },

  {
    id: "syn-cafeine-meditation",
    pratiques: ["cafeine", "meditation"],
    type: "antagoniste",
    label_ui: "Cafeine + Meditation",
    detail_ui: "Adenosine bloquee vs SNP recherche. La meditation reste accessible mais moins profonde — etat de vigilance incompatible avec le relachement complet.",
    effets: { nerv: -5 },
    source: "Fredholm et al. 1999 (cafeine et adenosine) — tension plausible, peu etudiee directement",
    incertitude: "speculatif",
  },

  {
    id: "syn-keto-hiit",
    pratiques: ["keto", "hiit"],
    type: "hormese",
    label_ui: "Keto + HIIT",
    detail_ui: "HIIT necessite du glucose rapide. En keto, la performance anaerobique est reduite car les cetones ne peuvent pas alimenter les efforts intenses en raison de la voie glycolytique.",
    effets: { met: -15 },
    condition_hormese: {
      reservoirs_requis: { met: { min: 60 }, rec: { min: 70 } },
      benefice_si_condition: {
        met: {
          base_modifier: 4,
          delai_jours: 42,
          note: "Apres 4-6 semaines d'adaptation complete au regime cetogene",
        },
      },
      label_ui: "La performance se restaure partiellement apres 4-6 semaines d'adaptation stricte",
    },
    source: "Burke et al. 2017 (keto et performance), Volek et al. 2016",
    incertitude: "modere",
  },

]
