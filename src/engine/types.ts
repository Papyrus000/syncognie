// src/engine/types.ts

export type Couche =
  | 'biologique'
  | 'cognitive'
  | 'narrative'
  | 'sociale'
  | 'emotionnelle'
  | 'environnementale';

export const TOUTES_LES_COUCHES: Couche[] = [
  'biologique','cognitive','narrative','sociale','emotionnelle','environnementale',
];

export type NiveauTrois = 'faible' | 'moyen' | 'eleve';

export interface EtatVariables {
  fatigueMentale: NiveauTrois;
  stress: NiveauTrois;
  sommeil: NiveauTrois;
  identiteSportive: boolean;
  objectifLongTerme: boolean;
  contexteAmi: boolean;
  presseSociale: boolean;
  chargeEmotionnelle: NiveauTrois;
  meteo: 'favorable' | 'defavorable' | 'neutre';
  equipementDispo: boolean;
  recitDeSoi: 'actif' | 'passif' | 'flou';
}

export type OrientationLabel =
  | 'repos probable'
  | 'legere tendance repos'
  | 'incertain'
  | 'legere tendance sport'
  | 'sport probable';

export type OrientationScore = -2 | -1 | 0 | 1 | 2;

export interface Prior {
  score: OrientationScore;
  confiance: 'tres faible' | 'faible' | 'moderee' | 'elevee';
  justification: string;
}

export type EffetOrientation = 'sport' | 'repos' | 'neutre';

export interface Informateur {
  id: string;
  label: string;
  description: string;
  impact: string;
  couche: Couche;
  effet: {
    vers: EffetOrientation;
    poids: 1 | 2 | 3;
  };
  forces?: Omit<Force, 'source'>[];
  concepts?: Concept[];
  anglesMortsLeves?: string[];
  anglesMortsAjoutes?: AngleMort[];
}

export type Polarite = 'favorable' | 'defavorable';

export interface Force {
  label: string;
  polarite: Polarite;
  source: string;
  couche: Couche;
}

export interface Concept {
  name: string;
  text: string;
  couche: Couche;
}

export interface AngleMort {
  label: string;
  couche: Couche;
}

export interface AnalyseCouches {
  couvertes: Couche[];
  faibles: Couche[];
  absentes: Couche[];
}

export interface ResultatMoteur {
  forces: Force[];
  concepts: Concept[];
  anglesMorts: AngleMort[];
  couches: AnalyseCouches;
  lisibilite: number;
  orientation: OrientationLabel;
  confianceOrientation: Prior['confiance'];
  hypothese: string;
}

export interface Regle {
  id: string;
  description: string;
  evaluer: (etat: EtatVariables) => {
    forces?: Omit<Force, 'source'>[];
    concepts?: Concept[];
    anglesMorts?: AngleMort[];
  } | null;
}

// Consequence d'une action (benefice ou cout)
export interface Consequence {
  label: string;
  couche: Couche;
  intensite: 1 | 2 | 3;
}

// Consequence conditionnelle — ne s'active que si un informateur est actif
export interface ConsequenceConditionnelle extends Consequence {
  siInformateurActif: string;
  type: 'benefice' | 'cout';
}

// Action simulee — ce qui se passe si Melanie choisit cette option.
// note : description courte affichee dans l'UI sous le label (optionnel).
export interface ActionSimulee {
  id: string;
  label: string;
  icon: string;
  note?: string;
  benefices: Consequence[];
  couts: Consequence[];
  conditionnels: ConsequenceConditionnelle[];
}

export interface Situation {
  titre: string;
  contexte: string;
  question: string;
  prior: Prior;
  informateurs: Informateur[];
  anglesMortsInitiaux: AngleMort[];
  actions: ActionSimulee[];
}
