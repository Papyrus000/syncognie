// src/engine/situation.ts
// Situation active — donnees separees du moteur et du composant.
// Ce fichier peut etre remplace ou multiplie pour explorer d'autres situations.

import type { Situation } from './types';

export const situationActive: Situation = {
  titre: "18h41 — Johan rentre du travail",
  contexte:
    "Toute la journee, aller a la salle semblait simple. Maintenant, la situation parait differente.",

  // A completer selon la logique du moteur V2
  question: "Sport ou repos ?",

  prior: {
    score: 0,
    confiance: 'faible',
    justification: "Contexte ambigu — fatigue elevee vs identite sportive presente.",
  },

  informateurs: [],         // A peupler si le moteur V2 est active sur cette situation
  anglesMortsInitiaux: [],  // A peupler si necessaire

  actions: [
    {
      id: 'scroller',
      label: 'Scroller',
      icon: '📱',
      note: "soulagement immediat - faible cout d'activation",
      benefices: [
        { label: "repos passif immediat", couche: 'biologique', intensite: 1 },
      ],
      couts: [
        { label: "stimulation passive, rumination possible", couche: 'cognitive', intensite: 2 },
      ],
      conditionnels: [],
    },
    {
      id: 'salle',
      label: 'Salle de sport',
      icon: '🏋️',
      note: "benefice differe - cout energetique plus eleve",
      benefices: [
        { label: "adaptation physique", couche: 'biologique', intensite: 3 },
        { label: "coherence avec identite sportive", couche: 'cognitive', intensite: 2 },
      ],
      couts: [
        { label: "depense energetique elevee", couche: 'biologique', intensite: 3 },
        { label: "cout d'activation important en etat de fatigue", couche: 'cognitive', intensite: 2 },
      ],
      conditionnels: [],
    },
    {
      id: 'marcher',
      label: 'Marcher',
      icon: '🚶',
      note: "reduction stimulation - transition plus douce",
      benefices: [
        { label: "reduction du cortisol", couche: 'biologique', intensite: 2 },
        { label: "reduction de la rumination", couche: 'cognitive', intensite: 2 },
      ],
      couts: [
        { label: "depense energetique legere", couche: 'biologique', intensite: 1 },
      ],
      conditionnels: [],
    },
    {
      id: 'cuisiner',
      label: 'Cuisiner',
      icon: '🍳',
      note: "ancrage concret - engagement modere",
      benefices: [
        { label: "ancrage sensoriel, reduction de la charge mentale", couche: 'cognitive', intensite: 2 },
        { label: "apport nutritionnel", couche: 'biologique', intensite: 2 },
      ],
      couts: [
        { label: "effort organisationnel modere", couche: 'cognitive', intensite: 1 },
      ],
      conditionnels: [],
    },
  ],

  etat: {
    // couche biologique
    fatigueMentale: 'eleve',
    stress: 'moyen',
    sommeil: 'faible',
    // couche cognitive
    identiteSportive: true,
    objectifLongTerme: true,
    // couche sociale
    contexteAmi: false,       // inconnu — angle mort
    presseSociale: false,
    // couche emotionnelle
    chargeEmotionnelle: 'moyen', // inconnu — angle mort partiel
    // couche environnementale
    meteo: 'neutre',
    equipementDispo: true,
    // couche narrative
    recitDeSoi: 'flou',
  },
};
