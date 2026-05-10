// src/engine/situation-melanie.ts
// Melanie, 17h00. Sport ou repos ?

import type { Situation } from './types';

export const situationMelanie: Situation = {
  titre: "Melanie — 17h00",
  contexte: "Fin de journee de travail. Melanie a prevu d'aller courir. Elle est chez elle depuis dix minutes.",
  question: "Sport ou repos ?",

  prior: {
    score: -1,
    confiance: 'tres faible',
    justification: "Fin de journee : contexte generalement defavorable a l'effort physique. La tension elle-meme indique que le sport reste envisage — signal faible mais reel.",
  },

  anglesMortsInitiaux: [
    { label: "niveau de fatigue reelle", couche: 'biologique' },
    { label: "qualite du sommeil recent", couche: 'biologique' },
    { label: "etat emotionnel de la journee", couche: 'emotionnelle' },
    { label: "rapport au sport (plaisir ou contrainte)", couche: 'narrative' },
    { label: "contraintes de temps ou sociales", couche: 'environnementale' },
    { label: "memoire recente du sport (derniere seance)", couche: 'narrative' },
    { label: "sensations corporelles actuelles", couche: 'biologique' },
    { label: "contexte relationnel du soir", couche: 'sociale' },
  ],

  // Actions simulees — chacune avec benefices, couts, et effets conditionnels
  actions: [
    {
      id: 'aller-courir',
      label: "Aller courir",
      icon: "↗",
      benefices: [
        { label: "Liberation de dopamine et endorphines", couche: 'biologique', intensite: 3 },
        { label: "Reduction du cortisol apres effort", couche: 'biologique', intensite: 2 },
        { label: "Coherence avec le recit de soi", couche: 'narrative', intensite: 2 },
        { label: "Progression vers l'objectif formule", couche: 'cognitive', intensite: 2 },
        { label: "Amelioration du sommeil la nuit suivante", couche: 'biologique', intensite: 1 },
      ],
      couts: [
        { label: "Effort physique sur ressources deja entamees", couche: 'biologique', intensite: 2 },
        { label: "Cout d'activation a franchir maintenant", couche: 'cognitive', intensite: 2 },
        { label: "Temps et energie non disponibles apres", couche: 'environnementale', intensite: 1 },
      ],
      conditionnels: [
        {
          siInformateurActif: 'sommeil-faible',
          type: 'cout',
          label: "Risque de blessure augmente (recuperation incomplete)",
          couche: 'biologique',
          intensite: 3,
        },
        {
          siInformateurActif: 'sommeil-faible',
          type: 'cout',
          label: "Benefices reduits — corps en deficit de recuperation",
          couche: 'biologique',
          intensite: 2,
        },
        {
          siInformateurActif: 'journee-difficile',
          type: 'cout',
          label: "Fatigue nerveuse s'ajoute a la fatigue physique",
          couche: 'emotionnelle',
          intensite: 2,
        },
        {
          siInformateurActif: 'journee-difficile',
          type: 'benefice',
          label: "L'effort physique peut evacuer le stress accumule",
          couche: 'emotionnelle',
          intensite: 2,
        },
        {
          siInformateurActif: 'alimentation-stable',
          type: 'benefice',
          label: "Glycemie stable — energie disponible pour l'effort",
          couche: 'biologique',
          intensite: 2,
        },
        {
          siInformateurActif: 'alimentation-glucides',
          type: 'cout',
          label: "Pic glycemique en descente — fenetre d'energie reduite",
          couche: 'biologique',
          intensite: 2,
        },
        {
          siInformateurActif: 'ami-qui-attend',
          type: 'benefice',
          label: "Engagement social reduit le cout d'activation a zero",
          couche: 'sociale',
          intensite: 3,
        },
        {
          siInformateurActif: 'soiree-prevue',
          type: 'cout',
          label: "Energie restante insuffisante pour la soiree apres",
          couche: 'environnementale',
          intensite: 2,
        },
        {
          siInformateurActif: 'identite-narrative-controle',
          type: 'benefice',
          label: "Renforce le recit de soi — 'j'ai tenu ma parole'",
          couche: 'narrative',
          intensite: 2,
        },
        {
          siInformateurActif: 'historique-sport-irreg',
          type: 'benefice',
          label: "Chaque seance reduit le cout d'activation futur",
          couche: 'cognitive',
          intensite: 2,
        },
      ],
    },

    {
      id: 'marcher',
      label: "Marcher 30 minutes",
      icon: "→",
      benefices: [
        { label: "Mouvement doux sans dette physiologique", couche: 'biologique', intensite: 2 },
        { label: "Reduction du cortisol et de la rumination", couche: 'emotionnelle', intensite: 2 },
        { label: "Cout d'activation tres faible", couche: 'cognitive', intensite: 3 },
        { label: "Maintien partiel du recit de soi actif", couche: 'narrative', intensite: 1 },
      ],
      couts: [
        { label: "Benefices physiologiques moindres que la course", couche: 'biologique', intensite: 1 },
        { label: "Tension possible avec l'objectif sportif formule", couche: 'cognitive', intensite: 1 },
      ],
      conditionnels: [
        {
          siInformateurActif: 'sommeil-faible',
          type: 'benefice',
          label: "Option adaptee : benefices sans surstimulation du corps fatigue",
          couche: 'biologique',
          intensite: 3,
        },
        {
          siInformateurActif: 'journee-difficile',
          type: 'benefice',
          label: "Transition douce — decompresse sans epuiser davantage",
          couche: 'emotionnelle',
          intensite: 2,
        },
        {
          siInformateurActif: 'soiree-prevue',
          type: 'benefice',
          label: "Laisse de l'energie pour la soiree",
          couche: 'environnementale',
          intensite: 2,
        },
      ],
    },

    {
      id: 'canape-scroller',
      label: "Canape + ecran",
      icon: "↙",
      benefices: [
        { label: "Cout d'activation nul — action immediate", couche: 'cognitive', intensite: 3 },
        { label: "Soulagement immediat du stress ressenti", couche: 'emotionnelle', intensite: 2 },
        { label: "Recuperation passive possible si fatigue reelle", couche: 'biologique', intensite: 1 },
      ],
      couts: [
        { label: "Stimulation dopaminergique sans effort — renforce la boucle passive", couche: 'biologique', intensite: 2 },
        { label: "Tension avec le recit de soi et l'objectif formule", couche: 'narrative', intensite: 2 },
        { label: "Le cout d'activation de demain augmente", couche: 'cognitive', intensite: 2 },
        { label: "Qualite de recuperation inferieure au sommeil ou a la marche", couche: 'biologique', intensite: 1 },
      ],
      conditionnels: [
        {
          siInformateurActif: 'journee-difficile',
          type: 'benefice',
          label: "Recuperation psychique legitime apres journee couteuse",
          couche: 'emotionnelle',
          intensite: 2,
        },
        {
          siInformateurActif: 'sommeil-faible',
          type: 'benefice',
          label: "Si suivi de sommeil tot : recuperation reelle possible",
          couche: 'biologique',
          intensite: 2,
        },
        {
          siInformateurActif: 'identite-narrative-controle',
          type: 'cout',
          label: "Dissonance avec le recit de soi — 'j'ai encore echoue'",
          couche: 'narrative',
          intensite: 3,
        },
        {
          siInformateurActif: 'ami-qui-attend',
          type: 'cout',
          label: "Cout social eleve de l'annulation — impact relationnel",
          couche: 'sociale',
          intensite: 3,
        },
        {
          siInformateurActif: 'historique-sport-irreg',
          type: 'cout',
          label: "Renforce le schema d'irregularite — cout d'activation futur plus eleve",
          couche: 'cognitive',
          intensite: 2,
        },
      ],
    },
  ],

  informateurs: [

    {
      id: 'identite-narrative-controle',
      label: "Identite narrative : reprendre le controle",
      description: "Melanie se definit comme quelqu'un qui 'reprend le controle' de sa sante.",
      couche: 'narrative',
      effet: { vers: 'sport', poids: 2 },
      impact: "Une identite orientee vers l'action cree une pression interne coherente avec le comportement sportif. Ne pas y aller genere une dissonance cognitive — un inconfort que le cerveau cherche a reduire.",
      forces: [
        { label: "recit de soi oriente vers l'action", polarite: 'favorable', couche: 'narrative' },
      ],
      concepts: [
        {
          name: "identite narrative",
          text: "Le recit qu'une personne construit sur elle-meme influence ses decisions autant que ses capacites reelles. 'Reprendre le controle' cree une pression identitaire vers l'action.",
          couche: 'narrative',
        },
      ],
      anglesMortsLeves: ["rapport au sport (plaisir ou contrainte)"],
    },

    {
      id: 'historique-sport-irreg',
      label: "Historique sportif irregulier",
      description: "Melanie a un rapport discontinu au sport — des periodes actives, des arrets.",
      couche: 'narrative',
      effet: { vers: 'repos', poids: 2 },
      impact: "L'irregularite augmente structurellement le cout d'activation. Chaque reprise demande plus d'energie mentale qu'une pratique continue. Le corps n'a pas automatise le comportement — chaque seance est une decision consciente couteuse.",
      forces: [
        { label: "experience sportive presente", polarite: 'favorable', couche: 'narrative' },
        { label: "irregularite — cout d'activation eleve", polarite: 'defavorable', couche: 'cognitive' },
      ],
      concepts: [
        {
          name: "cout d'activation",
          text: "Plus un comportement est irregulier, plus il demande d'energie mentale pour etre initie. L'habitude reduit ce cout en le rendant automatique.",
          couche: 'cognitive',
        },
      ],
      anglesMortsLeves: ["memoire recente du sport (derniere seance)"],
    },

    {
      id: 'sante-sensible',
      label: "Sensibilite corporelle elevee",
      description: "Melanie est tres a l'ecoute de ses signaux corporels.",
      couche: 'biologique',
      effet: { vers: 'neutre', poids: 1 },
      impact: "Une haute sensibilite interoceptive amplifie la perception des signaux de fatigue — ce qui peut autant freiner l'action ('je suis vraiment epuisee') que la faciliter ('je sens que j'en ai besoin'). L'effet est ambigu selon l'etat du moment.",
      forces: [
        { label: "perception fine des signaux internes", polarite: 'favorable', couche: 'biologique' },
        { label: "risque de sur-interpretation des sensations de fatigue", polarite: 'defavorable', couche: 'biologique' },
      ],
      concepts: [
        {
          name: "interception somatique",
          text: "Les personnes a haute sensibilite corporelle percoivent mieux leurs signaux internes — ce qui peut autant motiver que freiner l'action physique selon le contexte.",
          couche: 'biologique',
        },
      ],
      anglesMortsLeves: ["sensations corporelles actuelles"],
    },

    {
      id: 'sommeil-faible',
      label: "Sommeil insuffisant (< 6h)",
      description: "Melanie a moins de 6h de sommeil cette nuit.",
      couche: 'biologique',
      effet: { vers: 'repos', poids: 3 },
      impact: "Moins de 6h de sommeil reduit la synthese de glycogene musculaire, augmente le cortisol basal, diminue la motivation intrinseque et affaiblit la regulation emotionnelle. L'effort physique est objectivement plus couteux et les benefices sont reduits. Le risque de blessure augmente.",
      forces: [
        { label: "dette de sommeil importante", polarite: 'defavorable', couche: 'biologique' },
        { label: "regulation emotionnelle affaiblie", polarite: 'defavorable', couche: 'biologique' },
      ],
      concepts: [
        {
          name: "dette de sommeil",
          text: "Un sommeil insuffisant reduit la capacite d'effort physique, altere la regulation emotionnelle, et augmente la preference pour le soulagement immediat.",
          couche: 'biologique',
        },
      ],
      anglesMortsLeves: ["qualite du sommeil recent", "niveau de fatigue reelle"],
    },

    {
      id: 'sommeil-correct',
      label: "Sommeil correct (7h+)",
      description: "Melanie a bien dormi cette nuit.",
      couche: 'biologique',
      effet: { vers: 'sport', poids: 1 },
      impact: "Un sommeil suffisant maintient le glycogene musculaire, stabilise le cortisol et preserve la regulation emotionnelle. Les ressources biologiques sont disponibles. La fatigue ressentie en fin de journee est reelle mais gerable.",
      forces: [
        { label: "recuperation nocturne satisfaisante", polarite: 'favorable', couche: 'biologique' },
      ],
      anglesMortsLeves: ["qualite du sommeil recent", "niveau de fatigue reelle"],
    },

    {
      id: 'alimentation-stable',
      label: "Alimentation equilibree aujourd'hui",
      description: "Melanie a mange equilibre — proteines, legumes, glucides lents.",
      couche: 'biologique',
      effet: { vers: 'sport', poids: 1 },
      impact: "Une alimentation equilibree maintient une glycemie stable tout au long de la journee. Les reserves de glycogene sont disponibles pour l'effort. Pas de crash energetique attendu dans les prochaines heures.",
      forces: [
        { label: "glycemie stable, energie disponible", polarite: 'favorable', couche: 'biologique' },
      ],
    },

    {
      id: 'alimentation-glucides',
      label: "Alimentation chargee en glucides rapides",
      description: "Melanie a mange principalement des glucides rapides (pain, pates, sucre).",
      couche: 'biologique',
      effet: { vers: 'repos', poids: 1 },
      impact: "Les glucides rapides creent un pic de glycemie suivi d'une chute. A 17h, si le repas date de 2-3h, Melanie est probablement en phase de descente glycemique — ce qui se traduit par une baisse d'energie subjective et une preference accrue pour le repos.",
      forces: [
        { label: "pic glycemique probable en cours de descente", polarite: 'defavorable', couche: 'biologique' },
      ],
      concepts: [
        {
          name: "variabilite glycemique",
          text: "Une alimentation chargee en glucides rapides cree une energie initiale suivie d'une chute — ce qui reduit la fenetre d'action disponible et amplifie la sensation de fatigue.",
          couche: 'biologique',
        },
      ],
    },

    {
      id: 'objectif-long-terme',
      label: "Objectif sante a long terme explicite",
      description: "Melanie a un objectif formule : ameliorer sa condition physique sur 3 mois.",
      couche: 'cognitive',
      effet: { vers: 'sport', poids: 2 },
      impact: "Un objectif explicite active le systeme 2 (deliberatif) et cree une reference contre laquelle la decision est evaluee. Mais il cree aussi une tension : le systeme 1 (automatique) prefere le soulagement immediat. L'objectif ne garantit pas l'action — il la rend visible.",
      forces: [
        { label: "objectif formule et conscient", polarite: 'favorable', couche: 'cognitive' },
        { label: "tension avec le soulagement immediat", polarite: 'defavorable', couche: 'cognitive' },
      ],
      concepts: [
        {
          name: "recompense differee",
          text: "La capacite a anticiper un benefice futur entre en tension avec la preference pour le soulagement immediat. L'objectif explicite renforce le systeme deliberatif mais ne supprime pas l'attrait du repos.",
          couche: 'cognitive',
        },
      ],
    },

    {
      id: 'journee-difficile',
      label: "Journee emotionnellement chargee",
      description: "Melanie a vecu une journee stressante ou emotionnellement couteuse.",
      couche: 'emotionnelle',
      effet: { vers: 'repos', poids: 2 },
      impact: "La regulation emotionnelle consomme les memes ressources cognitives que la volonte. Une journee intense epuise ces ressources partagees. Le cerveau entre en mode conservation : preference pour les comportements a faible cout. Mais le sport peut aussi evacuer le stress — l'effet est double.",
      forces: [
        { label: "charge emotionnelle elevee", polarite: 'defavorable', couche: 'emotionnelle' },
        { label: "besoin de recuperation psychique", polarite: 'defavorable', couche: 'emotionnelle' },
      ],
      concepts: [
        {
          name: "ego depletion",
          text: "L'effort de regulation emotionnelle consomme des ressources cognitives partagees avec la volonte. Une journee chargee reduit la capacite d'action consciente — meme quand l'intention reste presente.",
          couche: 'emotionnelle',
        },
      ],
      anglesMortsLeves: ["etat emotionnel de la journee"],
    },

    {
      id: 'journee-neutre',
      label: "Journee emotionnellement ordinaire",
      description: "Journee de travail sans evenement particulier.",
      couche: 'emotionnelle',
      effet: { vers: 'neutre', poids: 1 },
      impact: "Une journee sans charge emotionnelle particuliere preserve les ressources de regulation. La fatigue ressentie est principalement cognitive (concentration, decisions) et non emotionnelle. Les ressources volitionnelles restent disponibles.",
      forces: [
        { label: "charge emotionnelle neutre", polarite: 'favorable', couche: 'emotionnelle' },
      ],
      anglesMortsLeves: ["etat emotionnel de la journee"],
    },

    {
      id: 'ami-qui-attend',
      label: "Un ami attend pour courir ensemble",
      description: "Quelqu'un compte sur Melanie pour cette seance.",
      couche: 'sociale',
      effet: { vers: 'sport', poids: 3 },
      impact: "La presence d'un tiers qui attend transforme la decision individuelle en engagement social. Le cout d'annulation (deception, image de soi sociale) devient superieur au cout d'activation de l'effort. C'est le facteur externe le plus puissant dans cette situation.",
      forces: [
        { label: "engagement social fort", polarite: 'favorable', couche: 'sociale' },
        { label: "cout social eleve de l'annulation", polarite: 'favorable', couche: 'sociale' },
      ],
      concepts: [
        {
          name: "accountability sociale",
          text: "La presence d'un tiers qui attend reduit massivement le cout d'activation. L'engagement social devient un moteur comportemental plus puissant que la motivation intrinseque dans les moments de faible ressource.",
          couche: 'sociale',
        },
      ],
      anglesMortsLeves: ["contraintes de temps ou sociales", "contexte relationnel du soir"],
    },

    {
      id: 'soiree-prevue',
      label: "Soiree sociale prevue apres",
      description: "Melanie a des obligations sociales ce soir — diner, sortie.",
      couche: 'environnementale',
      effet: { vers: 'repos', poids: 2 },
      impact: "Une obligation sociale impose un arbitrage energie/temps. Si Melanie court, elle arrive a la soiree physiquement entamee et potentiellement en retard. La contrainte environnementale reduit la fenetre d'action disponible independamment de la motivation.",
      forces: [
        { label: "contrainte temporelle reelle", polarite: 'defavorable', couche: 'environnementale' },
        { label: "arbitrage temps/energie necessaire", polarite: 'defavorable', couche: 'environnementale' },
      ],
      anglesMortsLeves: ["contraintes de temps ou sociales", "contexte relationnel du soir"],
    },

    {
      id: 'equipement-pret',
      label: "Tenue et equipement prepares a l'avance",
      description: "Melanie a pose sa tenue de sport visible le matin.",
      couche: 'environnementale',
      effet: { vers: 'sport', poids: 1 },
      impact: "La tenue visible elimine une micro-decision et reduit la friction physique de preparation. Des etudes comportementales montrent qu'une reduction meme minime de la friction augmente significativement la probabilite d'execution — independamment de la motivation du moment.",
      forces: [
        { label: "friction reduite par la preparation", polarite: 'favorable', couche: 'environnementale' },
      ],
      concepts: [
        {
          name: "design de l'environnement",
          text: "Reduire la friction physique (tenue visible, sac pret) diminue le cout d'activation comportemental. L'environnement influence le comportement independamment de la volonte.",
          couche: 'environnementale',
        },
      ],
    },
  ],
};
