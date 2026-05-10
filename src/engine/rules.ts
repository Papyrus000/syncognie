// src/engine/rules.ts
// Regles du moteur Syncognie.
// Chaque regle est independante, observable, modifiable.
// Ajouter une regle = ajouter un objet dans le tableau `regles`.
// Supprimer une regle = retirer l'objet. Rien d'autre ne change.

import type { Regle } from './types';

export const regles: Regle[] = [

  // ── COUCHE BIOLOGIQUE ──────────────────────────────────────────────────────

  {
    id: 'bio-fatigue-elevee',
    description: "Fatigue mentale elevee → recherche de soulagement immediat",
    evaluer: (etat) => {
      if (etat.fatigueMentale !== 'eleve') return null;
      return {
        forces: [
          {
            label: "fatigue nerveuse elevee",
            polarite: 'defavorable',
            couche: 'biologique',
          },
          {
            label: "recherche de soulagement immediat",
            polarite: 'defavorable',
            couche: 'biologique',
          },
        ],
        concepts: [
          {
            name: "cout d'activation",
            text: "Certaines actions demandent plus d'energie mentale pour etre initiees. La fatigue augmente ce cout, rendant les actions simples plus attractives.",
            couche: 'biologique',
          },
        ],
      };
    },
  },

  {
    id: 'bio-sommeil-faible',
    description: "Sommeil faible → regulation affaiblie",
    evaluer: (etat) => {
      if (etat.sommeil !== 'faible') return null;
      return {
        forces: [
          {
            label: "regulation emotionnelle affaiblie",
            polarite: 'defavorable',
            couche: 'biologique',
          },
        ],
        concepts: [
          {
            name: "dette de sommeil",
            text: "Un sommeil insuffisant altere la capacite de regulation emotionnelle et reduit la tolerance a l'effort.",
            couche: 'biologique',
          },
        ],
      };
    },
  },

  {
    id: 'bio-stress-moyen',
    description: "Stress moyen → activation physiologique ambivalente",
    evaluer: (etat) => {
      if (etat.stress === 'faible') return null;
      return {
        forces: [
          {
            label: etat.stress === 'eleve' ? 'stress eleve' : 'stress modere present',
            polarite: 'defavorable',
            couche: 'biologique',
          },
        ],
      };
    },
  },

  // ── COUCHE COGNITIVE ───────────────────────────────────────────────────────

  {
    id: 'cog-identite-sportive',
    description: "Identite sportive presente → force favorable cognitive",
    evaluer: (etat) => {
      if (!etat.identiteSportive) return null;
      return {
        forces: [
          {
            label: "identite sante presente",
            polarite: 'favorable',
            couche: 'cognitive',
          },
        ],
        concepts: [
          {
            name: "systeme 1 / systeme 2",
            text: "Une partie des decisions est automatique (systeme 1), une autre demande un effort conscient (systeme 2). L'identite sportive peut activer l'un ou l'autre selon le contexte.",
            couche: 'cognitive',
          },
        ],
      };
    },
  },

  {
    id: 'cog-objectif-long-terme',
    description: "Objectif long terme present → desir de progression active",
    evaluer: (etat) => {
      if (!etat.objectifLongTerme) return null;
      return {
        forces: [
          {
            label: "desir de progression",
            polarite: 'favorable',
            couche: 'cognitive',
          },
          {
            label: "comprehension des benefices long terme",
            polarite: 'favorable',
            couche: 'cognitive',
          },
        ],
        concepts: [
          {
            name: "recompense differee",
            text: "La capacite a anticiper un benefice futur entre en tension avec la preference pour le soulagement immediat.",
            couche: 'cognitive',
          },
        ],
      };
    },
  },

  {
    id: 'cog-tension-savoir-faire',
    description: "Identite sportive + fatigue elevee → tension savoir/faire",
    evaluer: (etat) => {
      if (!etat.identiteSportive || etat.fatigueMentale !== 'eleve') return null;
      return {
        concepts: [
          {
            name: "recompense immediate",
            text: "Le cerveau privilegie souvent les comportements offrant un soulagement rapide, meme quand un objectif differe est connu et desire.",
            couche: 'cognitive',
          },
        ],
      };
    },
  },

  // ── COUCHE NARRATIVE ───────────────────────────────────────────────────────

  {
    id: 'nar-recit-flou',
    description: "Recit de soi flou → tension narrative identitaire",
    evaluer: (etat) => {
      if (etat.recitDeSoi !== 'flou') return null;
      return {
        forces: [
          {
            label: "recit de soi ambigu",
            polarite: 'defavorable',
            couche: 'narrative',
          },
        ],
        concepts: [
          {
            name: "identite narrative",
            text: "Le recit qu'une personne construit sur elle-meme influence ses decisions autant que ses capacites reelles.",
            couche: 'narrative',
          },
        ],
        anglesMorts: [
          {
            label: "Le recit de soi de Johan est flou — la couche narrative est partiellement lisible.",
            couche: 'narrative',
          },
        ],
      };
    },
  },

  // ── COUCHE SOCIALE ─────────────────────────────────────────────────────────

  {
    id: 'soc-contexte-absent',
    description: "Contexte social inconnu → angle mort social",
    evaluer: (etat) => {
      if (etat.contexteAmi || etat.presseSociale) return null;
      return {
        anglesMorts: [
          {
            label: "Le contexte social est absent du modele.",
            couche: 'sociale',
          },
        ],
      };
    },
  },

  // ── COUCHE EMOTIONNELLE ────────────────────────────────────────────────────

  {
    id: 'emo-charge-inconnue',
    description: "Charge emotionnelle moyenne → presente mais sous-estimee",
    evaluer: (etat) => {
      if (etat.chargeEmotionnelle === 'faible') return null;
      return {
        forces: [
          {
            label: etat.chargeEmotionnelle === 'eleve'
              ? "charge emotionnelle elevee"
              : "charge emotionnelle non negligeable",
            polarite: 'defavorable',
            couche: 'emotionnelle',
          },
        ],
        anglesMorts: [
          {
            label: "La charge emotionnelle de la journee est connue partiellement seulement.",
            couche: 'emotionnelle',
          },
        ],
      };
    },
  },

  // ── COUCHE ENVIRONNEMENTALE ────────────────────────────────────────────────

  {
    id: 'env-equipement-dispo',
    description: "Equipement disponible → facteur d'accessibilite favorable",
    evaluer: (etat) => {
      if (!etat.equipementDispo) return null;
      return {
        forces: [
          {
            label: "equipement accessible",
            polarite: 'favorable',
            couche: 'environnementale',
          },
        ],
      };
    },
  },

  {
    id: 'env-recuperation-inconnue',
    description: "Recuperation physique non mesuree → angle mort",
    evaluer: (_etat) => {
      // Toujours actif dans ce prototype : la recuperation physique reelle n'est jamais connue
      return {
        anglesMorts: [
          {
            label: "Le niveau reel de recuperation physique est inconnu.",
            couche: 'biologique',
          },
        ],
      };
    },
  },
];
