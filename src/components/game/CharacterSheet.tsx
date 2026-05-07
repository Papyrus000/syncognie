// src/components/game/CharacterSheet.tsx
// Fiche de personnage — 3 colonnes
// Gauche : navigation | Centre : paramètres | Droite : explication + profil vivant

import { useState, useMemo } from 'react';
import './CharacterSheet.css';

// ── Types ─────────────────────────────────────────────────────────────────

type ChoixInput = { type: 'choix'; options: string[] };
type SliderInput = { type: 'slider'; min: number; max: number };
type CalculeInput = { type: 'calcule' };

type Variable = {
  id: string;
  label: string;
  input: ChoixInput | SliderInput | CalculeInput;
  valeur: string | number;
  description: string;
  source: string;
  influence: string[];
  contrainte?: string; // explication si verrouillé par une autre variable
};

type Categorie = {
  id: string;
  label: string;
  icone: string;
  couleur: string;
  description: string;
  variables: Variable[];
};

type Personnage = {
  id: 'johan' | 'melanie';
  nom: string;
  soustitre: string;
  categories: Categorie[];
};

type ComputedProfile = {
  ressources: number;
  regulation: number;
  disponibilite: number;
  etatNerveux: number;
  fenetreTolerance: number;
  attachement: string;
  labels: { ressources: string; regulation: string; disponibilite: string };
  _metab?: {
    glycemieLabel: string;
    glycemieScore: number;
    bhbLabel: string;
    bhbScore: number;
    bdnfScore: number;
  };
};

// ── Données ───────────────────────────────────────────────────────────────

const DATA: Personnage[] = [
  {
    id: 'johan',
    nom: 'Johan',
    soustitre: 'Vous jouez Johan',
    categories: [
      {
        id: 'environnement',
        label: 'Environnement',
        icone: '◎',
        couleur: '#2E9E6B',
        description: 'Ce qui s\'est passé aujourd\'hui. Le contexte immédiat qui précède la scène.',
        variables: [
          {
            id: 'journee',
            label: 'Qualité de la journée',
            input: { type: 'choix', options: ['Très difficile', 'Chargée', 'Neutre', 'Bonne', 'Excellente'] },
            valeur: 'Chargée',
            description: 'Johan rentre d\'une journée dense. Un client difficile, une réunion qui a déraillé en fin d\'après-midi. Il est là physiquement — mais une partie de lui est encore là-bas.',
            source: 'Allostatic load · McEwen',
            influence: ['Niveau d\'énergie', 'Fenêtre de tolérance', 'Disponibilité relationnelle'],
          },
          {
            id: 'charge',
            label: 'Charge émotionnelle',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 62,
            description: 'La quantité de ressources émotionnelles déjà dépensées aujourd\'hui. Plus elle est haute, moins il en reste pour la soirée.',
            source: 'Resource depletion · Baumeister',
            influence: ['Patience', 'Capacité d\'écoute', 'Risque d\'escalade'],
          },
          {
            id: 'dernier_contact',
            label: 'Dernier contact avec Mélanie',
            input: { type: 'choix', options: ['Ce matin — bonne', 'Ce matin — neutre', 'Hier soir — tendue', 'Il y a plusieurs jours'] },
            valeur: 'Ce matin — neutre',
            description: 'La qualité du dernier vrai contact entre eux. Ce résidu émotionnel entre dans la scène avant même qu\'un mot soit prononcé.',
            source: 'Sentiment override · Gottman',
            influence: ['Interprétation des signaux', 'Seuil de défensive'],
          },
          {
            id: 'espace',
            label: 'Temps seul aujourd\'hui',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 20,
            description: 'Johan a besoin de décompresser seul avant de pouvoir être vraiment présent. S\'il n\'a pas eu cet espace, une partie de lui le cherche encore.',
            source: 'Introversion · Cain · Aron',
            influence: ['Présence', 'Irritabilité de fond'],
          },
          {
            id: 'sollicitations',
            label: 'Sollicitations sociales',
            input: { type: 'choix', options: ['Isolé', 'Standard', 'Surcharge', 'Conflit direct'] },
            valeur: 'Standard',
            description: 'Le nombre d\'interactions sociales today — réunions, appels, tensions de bureau. Pour un profil introverti, la surcharge sociale draine sans qu\'il en soit conscient.',
            source: 'Social fatigue · Cain',
            influence: ['Énergie résiduelle', 'Disponibilité relationnelle'],
          },
        ],
      },
      {
        id: 'biologie',
        label: 'Biologie',
        icone: '⬡',
        couleur: '#E85D26',
        description: 'L\'état physiologique du corps. Ce que la biologie rend possible ou impossible ce soir.',
        variables: [
          {
            id: 'etat_nerveux',
            label: 'État nerveux de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 55,
            description: 'Le niveau d\'activation du système nerveux autonome en ce moment. 0 = calme profond. 100 = à la limite du flooding. Johan arrive à 55 — déjà dans la moitié haute.',
            source: 'Siegel · Neurosciences interpersonnelles',
            influence: ['Seuil de flooding', 'Fenêtre de tolérance', 'Réactivité'],
          },
          {
            id: 'cortisol',
            label: 'Charge cortisolique',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 60,
            description: 'L\'accumulation de cortisol liée au stress chronique. Elle rétrécit la fenêtre de tolérance avant même que la soirée commence — et Johan n\'en est pas conscient.',
            source: 'Sapolsky · Biologie du stress',
            influence: ['Fenêtre de tolérance', 'Flooding', 'Rancœur'],
          },
          {
            id: 'bhb',
            label: 'Taux de BHB',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 20,
            description: 'Le bêta-hydroxybutyrate — principal corps cétonique. À des niveaux élevés, il stabilise l\'humeur, réduit l\'inflammation cérébrale et améliore la clarté mentale. Incompatible avec une glycémie élevée.',
            source: 'Veech · Métabolisme cérébral · Newport',
            influence: ['Clarté mentale', 'Stabilité émotionnelle', 'Résistance au stress'],
            contrainte: 'BHB élevé incompatible avec glycémie haute — le corps ne peut pas être en cétose et en hyperglycémie simultanément.',
          },
          {
            id: 'bdnf',
            label: 'BDNF',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 40,
            description: 'Brain-Derived Neurotrophic Factor. La molécule de la plasticité — elle détermine la capacité du cerveau à apprendre de nouvelles réponses, à sortir des patterns automatiques. Stimulé par l\'activité physique.',
            source: 'Ratey · Spark · Cotman',
            influence: ['Plasticité des réponses', 'Apprentissage émotionnel'],
          },
        ],
      },
      {
        id: 'sommeil',
        label: 'Sommeil',
        icone: '◑',
        couleur: '#7B5EA7',
        description: 'La fondation invisible. Tout repose dessus — régulation émotionnelle, résilience, capacité d\'écoute.',
        variables: [
          {
            id: 'duree_sommeil',
            label: 'Durée cette nuit',
            input: { type: 'choix', options: ['< 5h', '5–6h', '6–7h', '7–8h', '> 8h'] },
            valeur: '6–7h',
            description: 'Johan a dormi six heures et demie. Pas insuffisant, pas réparateur. Il fonctionnera — mais les marges sont étroites.',
            source: 'Walker · Pourquoi nous dormons',
            influence: ['Régulation émotionnelle', 'Réactivité de l\'amygdale'],
          },
          {
            id: 'qualite_sommeil',
            label: 'Qualité du sommeil',
            input: { type: 'choix', options: ['Agitée', 'Fragmentée', 'Correcte', 'Profonde', 'Excellente'] },
            valeur: 'Correcte',
            description: 'La quantité ne dit pas tout. Une nuit fragmentée de 7h laisse moins de ressources qu\'une nuit profonde de 6h.',
            source: 'Walker · Dement',
            influence: ['Tolérance à la frustration', 'Empathie disponible'],
          },
          {
            id: 'dette_sommeil',
            label: 'Dette de sommeil',
            input: { type: 'calcule' },
            valeur: 0,
            description: 'Calculée depuis la durée et la qualité. L\'accumulation sur les derniers jours rétrécit durablement la fenêtre de tolérance — et s\'efface beaucoup plus lentement qu\'elle ne s\'installe.',
            source: 'Walker · Van Dongen',
            influence: ['Résilience de base', 'Fenêtre de tolérance'],
          },
        ],
      },
      {
        id: 'alimentation',
        label: 'Alimentation',
        icone: '◈',
        couleur: '#D4821A',
        description: 'Ce que Johan a mangé aujourd\'hui. Le cerveau est un organe — il réagit à ce qu\'on lui donne.',
        variables: [
          {
            id: 'orientation_alim',
            label: 'Orientation alimentaire',
            input: { type: 'choix', options: ['Jeûne intermittent', 'Pauvre en glucides', 'Équilibrée', 'Riche en glucides', 'Végétalien'] },
            valeur: 'Équilibrée',
            description: 'L\'orientation habituelle compte autant que le repas du jour — le corps adapté au jeûne gère l\'absence de nourriture différemment d\'un métabolisme glucido-dépendant.',
            source: 'Amen · Neuropsychiatrie · Perlmutter',
            influence: ['Stabilité de l\'humeur', 'BHB possible', 'Glycémie de base'],
          },
          {
            id: 'dernier_repas',
            label: 'Dernier repas',
            input: { type: 'choix', options: ['< 1h', '1–3h', '3–6h', '> 6h (jeûne)'] },
            valeur: '1–3h',
            description: 'Le timing compte : un repas lourd récent provoque un pic glycémique suivi d\'une chute. Un jeûne prolongé peut induire la cétose chez les profils adaptés.',
            source: 'Perlmutter · Grain Brain',
            influence: ['Glycémie actuelle', 'BHB possible', 'Somnolence'],
          },
          {
            id: 'glycemie',
            label: 'Glycémie estimée',
            input: { type: 'choix', options: ['Basse', 'Stable', 'Élevée', 'Pic post-repas'] },
            valeur: 'Stable',
            description: 'Une glycémie instable — pics et chutes — produit des variations d\'humeur que la personne attribue souvent à l\'autre ou à la situation.',
            source: 'Perlmutter · Grain Brain',
            influence: ['Irritabilité', 'Stabilité émotionnelle'],
            contrainte: 'Glycémie élevée incompatible avec BHB élevé — ajuster l\'un modifie l\'autre.',
          },
          {
            id: 'hydratation',
            label: 'Hydratation',
            input: { type: 'choix', options: ['Très faible', 'Faible', 'Correcte', 'Bonne'] },
            valeur: 'Correcte',
            description: 'Une déshydratation légère — 1 à 2% — dégrade la concentration, amplifie la fatigue perçue et augmente la réactivité émotionnelle.',
            source: 'Adan · Cognitive performance',
            influence: ['Concentration', 'Réactivité émotionnelle'],
          },
        ],
      },
      {
        id: 'activite',
        label: 'Activité physique',
        icone: '◷',
        couleur: '#3A8FA3',
        description: 'Le mouvement du corps influence directement le système nerveux — cortisol, BDNF, état nerveux de base.',
        variables: [
          {
            id: 'niveau_activite',
            label: 'Niveau habituel',
            input: { type: 'choix', options: ['Sédentaire', 'Actif au quotidien', 'Sportif régulier'] },
            valeur: 'Actif au quotidien',
            description: 'Le niveau de base détermine la récupération. Un sportif régulier récupère du stress plus vite — son système nerveux autonome est mieux entraîné.',
            source: 'Ratey · Spark · McEwen',
            influence: ['Résilience au stress', 'Fenêtre de tolérance baseline'],
          },
          {
            id: 'activite_aujourd_hui',
            label: 'Activité aujourd\'hui',
            input: { type: 'choix', options: ['Aucune', 'Marche / léger', 'Modérée', 'Intense'] },
            valeur: 'Marche / léger',
            description: 'Ce que Johan a fait aujourd\'hui. Un effort intense récent élève encore le cortisol — mais passé 3h, l\'effet s\'inverse et devient parasympathique.',
            source: 'Ratey · Sapolsky',
            influence: ['Cortisol actuel', 'BDNF', 'État nerveux'],
          },
          {
            id: 'timing_activite',
            label: 'Il y a combien de temps',
            input: { type: 'choix', options: ['< 2h', '2–4h', '> 4h', 'Non applicable'] },
            valeur: '> 4h',
            description: 'Le timing de l\'activité change tout. Juste après un effort intense, le cortisol est encore haut. Passé quelques heures, c\'est l\'effet inverse — calme et clarté.',
            source: 'Sapolsky · Biologie du stress',
            influence: ['Cortisol résiduel', 'État nerveux ce soir'],
          },
        ],
      },
      {
        id: 'age',
        label: 'Profil biologique',
        icone: '◌',
        couleur: '#8A6A4A',
        description: 'La tranche d\'âge modifie les capacités hormonales, la récupération et la baseline émotionnelle.',
        variables: [
          {
            id: 'tranche_age',
            label: 'Tranche d\'âge',
            input: { type: 'choix', options: ['18–25', '26–35', '36–45', '46–55', '55+'] },
            valeur: '26–35',
            description: 'Chaque tranche a sa physiologie. Les 26–35 ans sont au pic de charge psychosociale. Les 46–55 vivent des transitions hormonales qui rétrécissent la fenêtre de tolérance.',
            source: 'Carstensen · Sapolsky · Holzel',
            influence: ['Récupération', 'Baseline hormonale', 'Résilience'],
          },
        ],
      },
      {
        id: 'psychologie',
        label: 'Psychologie',
        icone: '◉',
        couleur: '#5B6FE0',
        description: 'L\'histoire longue. Ce qui s\'est construit en années et qui entre dans chaque soirée sans être nommé.',
        variables: [
          {
            id: 'attachement',
            label: 'Style d\'attachement',
            input: { type: 'choix', options: ['Sécure', 'Anxieux', 'Évitant', 'Désorganisé'] },
            valeur: 'Évitant',
            description: 'Johan a tendance au retrait quand la tension monte. Ce n\'est pas de la froideur — c\'est un pattern appris tôt, une façon de gérer ce qui déborde.',
            source: 'Bowlby · Ainsworth · Johnson · EFT',
            influence: ['Réponse au conflit', 'Choix disponibles', 'Réparation possible'],
          },
          {
            id: 'fenetre_tolerance',
            label: 'Fenêtre de tolérance',
            input: { type: 'calcule' },
            valeur: 0,
            description: 'Calculée depuis l\'état nerveux, le sommeil, la charge et l\'attachement. L\'amplitude de la zone où Johan peut penser et ressentir en même temps. En dehors : soit il s\'emballe, soit il se ferme.',
            source: 'Siegel · Trauma et mémoire',
            influence: ['Seuil de flooding', 'Accès à l\'empathie', 'Options narratives'],
          },
          {
            id: 'resilience',
            label: 'Résilience de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 60,
            description: 'La capacité à traverser la rupture relationnelle et à revenir. Pas une caractéristique fixe — elle se construit dans le temps et se dégrade sous stress chronique.',
            source: 'Southwick · Charney · Bonanno',
            influence: ['Capacité de réparation', 'Récupération après conflit'],
          },
          {
            id: 'mentalisation',
            label: 'Capacité de mentalisation',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 65,
            description: 'La capacité à percevoir que soi et les autres ont des états mentaux internes. Sous stress, elle s\'effondre — l\'autre cesse d\'être une personne complexe et devient un rôle ou une menace.',
            source: 'Fonagy · Allen · Bateman',
            influence: ['Empathie sous stress', 'Choix disponibles', 'Réparation'],
          },
          {
            id: 'schemas',
            label: 'Schéma précoce dominant',
            input: { type: 'choix', options: ['Abandon', 'Méfiance', 'Manque affectif', 'Inadéquation', 'Échec', 'Sacrifice'] },
            valeur: 'Inadéquation',
            description: 'Les patterns cognitivo-émotionnels formés tôt. Quand le schéma se déclenche, Johan réagit à une situation passée, pas à Mélanie ce soir.',
            source: 'Young · Thérapie des schémas',
            influence: ['Déclencheurs émotionnels', 'Défenses automatiques'],
          },
        ],
      },
      {
        id: 'historique',
        label: 'Historique',
        icone: '≡',
        couleur: '#C0394B',
        description: 'Ce qui s\'est passé entre eux récemment. La mémoire relationnelle qui entre dans la scène.',
        variables: [
          {
            id: 'derniere_dispute',
            label: 'Dernière dispute',
            input: { type: 'choix', options: ['Cette semaine — non résolue', 'Cette semaine — résolue', 'Il y a 2 semaines', 'Il y a plus d\'un mois'] },
            valeur: 'Il y a 2 semaines',
            description: 'Une dispute non résolue laisse un résidu. Le sujet revient sans être nommé — dans le ton, dans l\'interprétation de ce que l\'autre dit.',
            source: 'Gottman · The Seven Principles',
            influence: ['Interprétation des signaux', 'Seuil de défensive'],
          },
          {
            id: 'dette_emotionnelle',
            label: 'Dette émotionnelle',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 48,
            description: 'L\'accumulation de petits manques non dits — les fois où Johan n\'était pas là, n\'a pas demandé, n\'a pas vu. Mélanie tient un compte que Johan ignore souvent.',
            source: 'Gottman · L\'Équation amoureuse',
            influence: ['Rancœur · Mélanie', 'Interprétation du silence'],
          },
          {
            id: 'derniere_reparation',
            label: 'Dernière réparation réussie',
            input: { type: 'choix', options: ['Cette semaine', 'Ce mois-ci', 'Il y a plusieurs mois', 'Aucun souvenir récent'] },
            valeur: 'Ce mois-ci',
            description: 'La mémoire des retours réussis construit la confiance que le retour est possible. Sans cette mémoire, chaque rupture semble permanente.',
            source: 'Tronick · Still Face · Réparation répétée',
            influence: ['Confiance dans la réparation', 'Résilience du lien'],
          },
          {
            id: 'patterns',
            label: 'Pattern récurrent',
            input: { type: 'choix', options: ['Pursuer / Withdrawer', 'Escalade mutuelle', 'Gel symétrique', 'Aucun pattern dominant'] },
            valeur: 'Pursuer / Withdrawer',
            description: 'La danse que Johan et Mélanie font depuis longtemps. Plus Mélanie s\'approche avec intensité, plus Johan recule — ce qui pousse Mélanie à s\'approcher encore plus fort.',
            source: 'Johnson · EFT · Christensen',
            influence: ['Dynamique de la scène', 'Options disponibles'],
          },
        ],
      },
    ],
  },
  {
    id: 'melanie',
    nom: 'Mélanie',
    soustitre: 'Profil de Mélanie',
    categories: [
      {
        id: 'environnement',
        label: 'Environnement',
        icone: '◎',
        couleur: '#2E9E6B',
        description: 'Ce qui s\'est passé aujourd\'hui pour Mélanie. Le contexte immédiat qui précède la scène.',
        variables: [
          {
            id: 'journee',
            label: 'Qualité de la journée',
            input: { type: 'choix', options: ['Très difficile', 'Chargée', 'Neutre', 'Bonne', 'Excellente'] },
            valeur: 'Très difficile',
            description: 'Mélanie a reçu son rapport ce matin. Elle attendait ce retour depuis trois semaines. Il est décevant — et elle a porté ça seule toute la journée, sans pouvoir en parler.',
            source: 'Allostatic load · McEwen',
            influence: ['Besoin de connexion', 'Seuil émotionnel', 'Attente de Johan'],
          },
          {
            id: 'charge',
            label: 'Charge émotionnelle',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 78,
            description: 'Mélanie arrive avec une charge haute. Elle n\'a pas encore décidé si elle va en parler — mais quelque chose dans sa façon de couper les légumes le dit.',
            source: 'Resource depletion · Baumeister',
            influence: ['Capacité à attendre', 'Besoin de réponse de Johan'],
          },
          {
            id: 'besoin_non_dit',
            label: 'Besoin non dit',
            input: { type: 'choix', options: ['Être vue', 'Être écoutée', 'Être touchée', 'Être rassurée', 'Être laissée tranquille'] },
            valeur: 'Être vue',
            description: 'Ce que Mélanie attend sans l\'avoir formulé. Si Johan le voit — sans qu\'elle ait à demander — quelque chose se déplace profondément.',
            source: 'Théorie de l\'attachement · Besoins primaires',
            influence: ['Réponse émotionnelle aux choix de Johan', 'Qualité du lien possible'],
          },
          {
            id: 'dernier_contact',
            label: 'Dernier contact avec Johan',
            input: { type: 'choix', options: ['Ce matin — bonne', 'Ce matin — neutre', 'Hier soir — tendue', 'Il y a plusieurs jours'] },
            valeur: 'Ce matin — neutre',
            description: 'La tonalité du dernier échange. Pour Mélanie, chaque contact laisse une empreinte — elle arrive déjà avec une interprétation de l\'état du lien.',
            source: 'Sentiment override · Gottman',
            influence: ['Anticipation de la soirée', 'Seuil de défensive'],
          },
          {
            id: 'sollicitations',
            label: 'Sollicitations sociales',
            input: { type: 'choix', options: ['Isolée', 'Standard', 'Surcharge', 'Conflit direct'] },
            valeur: 'Standard',
            description: 'Le volume d\'interactions de la journée. Mélanie, plus extraverte, récupère dans la connexion — mais une surcharge sociale épuise quand même ses ressources.',
            source: 'Social fatigue · Cain',
            influence: ['Énergie résiduelle', 'Besoin de connexion ce soir'],
          },
        ],
      },
      {
        id: 'biologie',
        label: 'Biologie',
        icone: '⬡',
        couleur: '#E85D26',
        description: 'L\'état physiologique de Mélanie ce soir. Ce que la biologie rend possible ou impossible.',
        variables: [
          {
            id: 'etat_nerveux',
            label: 'État nerveux de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 72,
            description: 'Mélanie est déjà à 72 sur 100. Pas encore en flooding — mais sa fenêtre est étroite. Un mot de trop et elle bascule vers la suractivation.',
            source: 'Siegel · Porges',
            influence: ['Seuil de flooding', 'Disponibilité à la connexion'],
          },
          {
            id: 'energie',
            label: 'Niveau d\'énergie',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 35,
            description: 'Elle est épuisée. Pas le genre d\'épuisement qui cherche le silence — le genre qui a besoin que quelqu\'un remarque.',
            source: 'Théorie polyvagale · Porges',
            influence: ['Patience disponible', 'Choix possibles'],
          },
          {
            id: 'cortisol',
            label: 'Charge cortisolique',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 75,
            description: 'Le cortisol accumulé depuis le matin rétrécit la fenêtre de tolérance de Mélanie avant que Johan prononce un seul mot.',
            source: 'Sapolsky · Biologie du stress',
            influence: ['Fenêtre de tolérance', 'Interprétation des signaux'],
          },
          {
            id: 'bhb',
            label: 'Taux de BHB',
            input: { type: 'calcule' },
            valeur: 0,
            description: 'Calculé depuis l\'orientation alimentaire et le timing du dernier repas. Incompatible avec une glycémie élevée — le corps ne peut pas être en cétose et en hyperglycémie en même temps.',
            source: 'Veech · Newport · Métabolisme cérébral',
            influence: ['Clarté mentale', 'Stabilité émotionnelle'],
            contrainte: 'BHB élevé incompatible avec glycémie haute. Se déduit de l\'orientation alimentaire et du jeûne.',
          },
          {
            id: 'bdnf',
            label: 'BDNF',
            input: { type: 'calcule' },
            valeur: 0,
            description: 'Calculé depuis l\'activité physique du jour. La molécule de la plasticité cérébrale — stimulée principalement par l\'exercice aérobique. Détermine la capacité à sortir des patterns automatiques.',
            source: 'Ratey · Spark · Cotman · Newman 2017',
            influence: ['Plasticité des réponses', 'Apprentissage émotionnel'],
          },
        ],
      },
      {
        id: 'sommeil',
        label: 'Sommeil',
        icone: '◑',
        couleur: '#7B5EA7',
        description: 'La fondation invisible. Tout repose dessus — régulation émotionnelle, résilience, capacité d\'écoute.',
        variables: [
          {
            id: 'duree_sommeil',
            label: 'Durée cette nuit',
            input: { type: 'choix', options: ['< 5h', '5–6h', '6–7h', '7–8h', '> 8h'] },
            valeur: '5–6h',
            description: 'Mélanie a mal dormi. L\'anxiété anticipatoire du rapport l\'a maintenue en veille une partie de la nuit.',
            source: 'Walker · Pourquoi nous dormons',
            influence: ['Régulation émotionnelle', 'Réactivité de l\'amygdale'],
          },
          {
            id: 'qualite_sommeil',
            label: 'Qualité du sommeil',
            input: { type: 'choix', options: ['Agitée', 'Fragmentée', 'Correcte', 'Profonde', 'Excellente'] },
            valeur: 'Fragmentée',
            description: 'Le sommeil fragmenté laisse l\'amygdale plus réactive. Mélanie est plus sensible aux micro-signaux de rejet.',
            source: 'Walker · Dement',
            influence: ['Sensibilité au rejet', 'Empathie disponible'],
          },
          {
            id: 'dette_sommeil',
            label: 'Dette de sommeil',
            input: { type: 'calcule' },
            valeur: 0,
            description: 'Calculée depuis la durée et la qualité. Pour Mélanie, la dette s\'accumule depuis plusieurs jours de vigilance nocturne — elle s\'efface lentement.',
            source: 'Walker · Van Dongen',
            influence: ['Résilience émotionnelle', 'Fenêtre de tolérance'],
          },
        ],
      },
      {
        id: 'alimentation',
        label: 'Alimentation',
        icone: '◈',
        couleur: '#D4821A',
        description: 'Ce que Mélanie a mangé aujourd\'hui. Le cerveau est un organe — il réagit à ce qu\'on lui donne.',
        variables: [
          {
            id: 'orientation_alim',
            label: 'Orientation alimentaire',
            input: { type: 'choix', options: ['Jeûne intermittent', 'Pauvre en glucides', 'Équilibrée', 'Riche en glucides', 'Végétalien'] },
            valeur: 'Équilibrée',
            description: 'L\'orientation habituelle de Mélanie. Pas seulement le repas du jour — le corps adapté gère différemment les variations. Une alimentation riche en glucides produit des pics qui amplifient la réactivité émotionnelle.',
            source: 'Amen · Neuropsychiatrie · Perlmutter',
            influence: ['Glycémie calculée', 'BHB possible', 'Stabilité de l\'humeur'],
          },
          {
            id: 'dernier_repas',
            label: 'Dernier repas',
            input: { type: 'choix', options: ['< 1h', '1–3h', '3–6h', '> 6h (jeûne)'] },
            valeur: '1–3h',
            description: 'Le timing modifie l\'état métabolique actuel. Un repas lourd récent provoque un pic glycémique suivi d\'une chute. Un jeûne prolongé peut induire la cétose chez les profils adaptés.',
            source: 'Perlmutter · Grain Brain',
            influence: ['Glycémie calculée', 'BHB possible', 'Somnolence'],
          },
          {
            id: 'glycemie',
            label: 'Glycémie estimée',
            input: { type: 'calcule' },
            valeur: 'Stable',
            description: 'Calculée depuis l\'orientation alimentaire, le timing et l\'activité physique. Une glycémie instable produit des variations d\'humeur que l\'on attribue souvent à l\'autre ou à la situation.',
            source: 'Perlmutter · Grain Brain',
            influence: ['Irritabilité', 'Stabilité émotionnelle'],
            contrainte: 'Glycémie élevée bloque la cétose — BHB reste bas si glycémie haute.',
          },
          {
            id: 'hydratation',
            label: 'Hydratation',
            input: { type: 'choix', options: ['Très faible', 'Faible', 'Correcte', 'Bonne'] },
            valeur: 'Correcte',
            description: 'Une déshydratation légère — 1 à 2% — dégrade la concentration, amplifie la fatigue perçue et augmente la réactivité émotionnelle.',
            source: 'Adan · Cognitive performance',
            influence: ['Concentration', 'Réactivité émotionnelle'],
          },
        ],
      },
      {
        id: 'activite',
        label: 'Activité physique',
        icone: '◷',
        couleur: '#3A8FA3',
        description: 'Le mouvement influence directement le système nerveux — cortisol, BDNF, état nerveux de base.',
        variables: [
          {
            id: 'niveau_activite',
            label: 'Niveau habituel',
            input: { type: 'choix', options: ['Sédentaire', 'Actif au quotidien', 'Sportif régulier'] },
            valeur: 'Actif au quotidien',
            description: 'Le niveau de base détermine la récupération. Un corps actif régulièrement a un système nerveux autonome mieux entraîné — il revient plus vite à l\'équilibre après un stress.',
            source: 'Ratey · Spark · McEwen',
            influence: ['Résilience au stress', 'Fenêtre de tolérance baseline'],
          },
          {
            id: 'activite_aujourd_hui',
            label: 'Activité aujourd\'hui',
            input: { type: 'choix', options: ['Aucune', 'Marche / léger', 'Modérée', 'Intense'] },
            valeur: 'Aucune',
            description: 'Mélanie n\'a pas bougé aujourd\'hui — sa journée ne l\'a pas permis. Sans décharge physique, le stress se somatise.',
            source: 'Ratey · Sapolsky',
            influence: ['Cortisol résiduel', 'BDNF calculé', 'État nerveux'],
          },
          {
            id: 'timing_activite',
            label: 'Il y a combien de temps',
            input: { type: 'choix', options: ['< 2h', '2–4h', '> 4h', 'Non applicable'] },
            valeur: 'Non applicable',
            description: 'Le timing change tout. Un effort intense récent élève encore le cortisol. Passé 3–4h, l\'effet s\'inverse — calme et clarté.',
            source: 'Sapolsky · Biologie du stress',
            influence: ['Cortisol résiduel', 'État nerveux ce soir'],
          },
        ],
      },
      {
        id: 'age',
        label: 'Profil biologique',
        icone: '◌',
        couleur: '#8A6A4A',
        description: 'La tranche d\'âge modifie les capacités hormonales, la récupération et la baseline émotionnelle.',
        variables: [
          {
            id: 'tranche_age',
            label: 'Tranche d\'âge',
            input: { type: 'choix', options: ['18–25', '26–35', '36–45', '46–55', '55+'] },
            valeur: '26–35',
            description: 'Chaque tranche a sa physiologie. Les 26–35 ans sont au pic de charge psychosociale. La récupération hormonale après stress prend plus de temps à mesure qu\'on avance en âge.',
            source: 'Carstensen · Sapolsky · Holzel',
            influence: ['Récupération', 'Baseline hormonale', 'Résilience'],
          },
        ],
      },
      {
        id: 'psychologie',
        label: 'Psychologie',
        icone: '◉',
        couleur: '#5B6FE0',
        description: 'L\'histoire longue de Mélanie. Ce qu\'elle porte dans chaque soirée sans le nommer.',
        variables: [
          {
            id: 'attachement',
            label: 'Style d\'attachement',
            input: { type: 'choix', options: ['Sécure', 'Anxieux', 'Évitant', 'Désorganisé'] },
            valeur: 'Anxieux',
            description: 'Mélanie a besoin de signaux de connexion réguliers pour se sentir en sécurité. Quand ils manquent, elle les cherche avec une intensité que Johan perçoit parfois comme de la pression.',
            source: 'Bowlby · Ainsworth · Johnson',
            influence: ['Lecture des signaux de Johan', 'Protest behavior'],
          },
          {
            id: 'fenetre_tolerance',
            label: 'Fenêtre de tolérance',
            input: { type: 'calcule' },
            valeur: 0,
            description: 'Calculée. La fenêtre de Mélanie est plus étroite que d\'habitude ce soir. C\'est ce qu\'elle veut dire quand elle dit qu\'elle est "près du bord".',
            source: 'Siegel · Neurosciences interpersonnelles',
            influence: ['Seuil de flooding', 'Accès à la nuance'],
          },
          {
            id: 'question_attachement',
            label: 'Question d\'attachement cachée',
            input: { type: 'choix', options: ['Est-ce que je compte pour toi ?', 'Est-ce que tu es là pour moi ?', 'Suis-je trop pour toi ?', 'M\'abandonnes-tu ?'] },
            valeur: 'Est-ce que je compte pour toi ?',
            description: 'Sous la surface de la soirée, c\'est cette question que Mélanie pose sans la poser. Chaque choix de Johan y répond — sans qu\'il le sache.',
            source: 'Johnson · EFT · Hold Me Tight',
            influence: ['Interprétation des actions de Johan', 'Intensité émotionnelle'],
          },
          {
            id: 'resilience',
            label: 'Résilience de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 55,
            description: 'La capacité à traverser et revenir. Pour Mélanie, elle dépend beaucoup de se sentir vue et entendue — sans ça, chaque rupture semble permanente.',
            source: 'Southwick · Charney',
            influence: ['Réparation possible', 'Confiance dans le retour'],
          },
          {
            id: 'mentalisation',
            label: 'Capacité de mentalisation',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 60,
            description: 'Sous stress élevé, Mélanie peut perdre l\'accès à l\'état interne de Johan — il devient l\'absent, le froid, celui qui ne voit pas. Ce n\'est plus une personne complexe, c\'est un rôle.',
            source: 'Fonagy · Allen · Bateman',
            influence: ['Empathie sous stress', 'Lecture de Johan'],
          },
          {
            id: 'schemas',
            label: 'Schéma précoce dominant',
            input: { type: 'choix', options: ['Abandon', 'Méfiance', 'Manque affectif', 'Inadéquation', 'Échec', 'Sacrifice'] },
            valeur: 'Abandon',
            description: 'Le schéma d\'abandon se déclenche quand Johan se retire. Ce n\'est plus un homme fatigué qui a besoin de silence — c\'est quelqu\'un qui part.',
            source: 'Young · Thérapie des schémas',
            influence: ['Déclencheurs émotionnels', 'Protest behavior'],
          },
        ],
      },
      {
        id: 'historique',
        label: 'Historique',
        icone: '≡',
        couleur: '#C0394B',
        description: 'Ce qui s\'est passé entre eux récemment. La mémoire relationnelle qui entre dans la scène.',
        variables: [
          {
            id: 'derniere_dispute',
            label: 'Dernière dispute',
            input: { type: 'choix', options: ['Cette semaine — non résolue', 'Cette semaine — résolue', 'Il y a 2 semaines', 'Il y a plus d\'un mois'] },
            valeur: 'Il y a 2 semaines',
            description: 'La dispute est encore proche. Pour Mélanie, non résolue signifie toujours présente — elle attendait un geste qui n\'est pas venu.',
            source: 'Gottman · The Seven Principles',
            influence: ['Seuil de défensive', 'Interprétation des signaux'],
          },
          {
            id: 'dette_emotionnelle',
            label: 'Dette émotionnelle',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 55,
            description: 'L\'accumulation de petits manques non dits — les fois où Johan n\'était pas là, n\'a pas demandé, n\'a pas vu. Mélanie tient ce compte sans toujours le conscientiser.',
            source: 'Gottman · L\'Équation amoureuse',
            influence: ['Rancœur latente', 'Interprétation du silence de Johan'],
          },
          {
            id: 'derniere_reparation',
            label: 'Dernière réparation réussie',
            input: { type: 'choix', options: ['Cette semaine', 'Ce mois-ci', 'Il y a plusieurs mois', 'Aucun souvenir récent'] },
            valeur: 'Ce mois-ci',
            description: 'La mémoire des retours réussis construit la confiance que le retour est possible. Sans cette mémoire, chaque rupture semble permanente.',
            source: 'Tronick · Still Face · Réparation répétée',
            influence: ['Confiance dans la réparation', 'Résilience du lien'],
          },
          {
            id: 'patterns',
            label: 'Pattern récurrent',
            input: { type: 'choix', options: ['Pursuer / Withdrawer', 'Escalade mutuelle', 'Gel symétrique', 'Aucun pattern dominant'] },
            valeur: 'Pursuer / Withdrawer',
            description: 'Du côté de Mélanie : plus Johan recule, plus quelque chose en elle pousse à s\'approcher — avec une intensité qui finit par confirmer la peur de Johan d\'être envahi.',
            source: 'Johnson · EFT · Christensen',
            influence: ['Dynamique de la scène', 'Protest behavior'],
          },
        ],
      },
    ],
  },
];

// ── Moteur de calcul ───────────────────────────────────────────────────────

function scoreDuree(v: string): number {
  const map: Record<string, number> = { '< 5h': 10, '5–6h': 35, '6–7h': 60, '7–8h': 85, '> 8h': 95 };
  return map[v] ?? 60;
}
function scoreQualite(v: string): number {
  const map: Record<string, number> = { 'Agitée': 10, 'Fragmentée': 30, 'Correcte': 60, 'Profonde': 85, 'Excellente': 100 };
  return map[v] ?? 60;
}
function scoreDetteSommeil(duree: string, qualite: string): number {
  const score = scoreDuree(duree) * 0.6 + scoreQualite(qualite) * 0.4;
  return Math.round(100 - score);
}

// ── Moteur métabolique ────────────────────────────────────────────────────
// Glycémie, BHB et BDNF sont calculés — jamais saisis directement.
// La cascade : orientation + timing + activité → glycémie → BHB → BDNF

type MetabolicState = {
  glycemieLabel: string;   // 'Basse' | 'Stable' | 'Élevée' | 'Pic post-repas'
  glycemieScore: number;   // 0-100 (100 = stable idéale)
  bhbLabel: string;        // 'Nul' | 'Trace' | 'Modéré' | 'Élevé'
  bhbScore: number;        // 0-100
  bdnfScore: number;       // 0-100, principalement via activité physique
};

function computeMetabolism(vals: Record<string, string | number>): MetabolicState {
  const orientation = (vals['orientation_alim'] as string) ?? 'Équilibrée';
  const repas = (vals['dernier_repas'] as string) ?? '1–3h';
  const activite = (vals['activite_aujourd_hui'] as string) ?? 'Aucune';
  const timing = (vals['timing_activite'] as string) ?? 'Non applicable';
  const niveau = (vals['niveau_activite'] as string) ?? 'Actif au quotidien';

  // ── Glycémie estimée ──
  // Base selon orientation habituelle
  const glycBase: Record<string, number> = {
    'Jeûne intermittent': 30,    // habituellement bas
    'Pauvre en glucides': 35,
    'Équilibrée': 55,
    'Riche en glucides': 72,
    'Végétalien': 60,
  };
  let glycScore = glycBase[orientation] ?? 55;

  // Modifié par le timing du dernier repas
  if (repas === '< 1h') glycScore = Math.min(95, glycScore + 20);         // pic en cours
  else if (repas === '1–3h') glycScore = Math.min(85, glycScore + 8);     // encore haut
  else if (repas === '3–6h') glycScore = Math.max(20, glycScore - 5);     // redescend
  else if (repas === '> 6h (jeûne)') glycScore = Math.max(15, glycScore - 25); // jeûne

  // Activité physique intense récente compense les glucides
  if (activite === 'Intense' && (timing === '< 2h' || timing === '2–4h')) {
    glycScore = Math.max(20, glycScore - 18); // muscles consomment le glucose
  } else if (activite === 'Modérée' && timing !== 'Non applicable') {
    glycScore = Math.max(25, glycScore - 8);
  }

  glycScore = Math.round(Math.max(10, Math.min(100, glycScore)));

  // Label glycémie
  let glycemieLabel = 'Stable';
  if (glycScore < 30) glycemieLabel = 'Basse';
  else if (glycScore < 55) glycemieLabel = 'Stable';
  else if (glycScore < 75) glycemieLabel = 'Élevée';
  else glycemieLabel = 'Pic post-repas';

  // ── BHB calculé ──
  // Principe : BHB monte si glycémie basse + jeûne + adaptation keto
  // C'est biochimique : l'insuline haute bloque la cétogenèse
  const adapteKeto = orientation === 'Jeûne intermittent' || orientation === 'Pauvre en glucides';
  const enJeune = repas === '> 6h (jeûne)';
  const glycemieBasse = glycScore < 40;

  let bhbScore = 0;
  if (glycemieBasse && adapteKeto) bhbScore = enJeune ? 75 : 45;
  else if (glycemieBasse && !adapteKeto) bhbScore = enJeune ? 30 : 10; // non adapté, production lente
  else if (glycScore < 55 && adapteKeto) bhbScore = 25;
  else bhbScore = 5; // glycémie normale/haute = BHB quasi nul

  bhbScore = Math.round(Math.max(0, Math.min(100, bhbScore)));

  let bhbLabel = 'Nul';
  if (bhbScore < 10) bhbLabel = 'Nul';
  else if (bhbScore < 35) bhbLabel = 'Trace';
  else if (bhbScore < 65) bhbLabel = 'Modéré';
  else bhbLabel = 'Élevé';

  // ── BDNF calculé ──
  // Principalement via exercice aérobique (Ratey) + secondairement BHB (Newman 2017)
  const bdnfBase: Record<string, number> = {
    'Aucune': 25,
    'Marche / léger': 45,
    'Modérée': 65,
    'Intense': 80,
  };
  let bdnfScore = bdnfBase[activite] ?? 30;

  // Niveau habituel amplifie l'effet
  if (niveau === 'Sportif régulier') bdnfScore = Math.min(100, bdnfScore + 12);
  else if (niveau === 'Sédentaire') bdnfScore = Math.max(10, bdnfScore - 8);

  // Timing : BDNF peak ~2-4h après effort, redescend ensuite mais reste élevé
  if (activite !== 'Aucune') {
    if (timing === '< 2h') bdnfScore = Math.round(bdnfScore * 0.9);      // encore en montée
    else if (timing === '2–4h') bdnfScore = Math.min(100, bdnfScore + 5); // peak
    else if (timing === '> 4h') bdnfScore = Math.round(bdnfScore * 0.75); // redescend
  }

  // BHB modéré/élevé ajoute un petit bonus BDNF (Newman 2017)
  if (bhbScore > 40) bdnfScore = Math.min(100, bdnfScore + 8);

  bdnfScore = Math.round(Math.max(10, Math.min(100, bdnfScore)));

  return { glycemieLabel, glycemieScore: glycScore, bhbLabel, bhbScore, bdnfScore };
}

function computeProfile(persoId: 'johan' | 'melanie', vals: Record<string, string | number>): ComputedProfile {
  const g = (id: string) => vals[id];

  // Métabolisme calculé
  const metab = computeMetabolism(vals);

  // Sommeil
  const dureeSommeil = scoreDuree(g('duree_sommeil') as string);
  const qualiteSommeil = scoreQualite(g('qualite_sommeil') as string);
  const sommeilScore = dureeSommeil * 0.6 + qualiteSommeil * 0.4;

  // État nerveux
  const etatNerveux = Number(g('etat_nerveux') ?? 55);

  // Charge
  const charge = Number(g('charge') ?? 50);

  // Attachement
  const attachement = (g('attachement') as string) ?? 'Sécure';
  const attachMod: Record<string, number> = { 'Sécure': 15, 'Anxieux': -5, 'Évitant': -10, 'Désorganisé': -20 };
  const attMod = attachMod[attachement] ?? 0;

  // Activité → modifie état nerveux perçu
  const activite = (g('activite_aujourd_hui') as string) ?? 'Aucune';
  const timing = (g('timing_activite') as string) ?? 'Non applicable';
  let activiteMod = 0;
  if (activite === 'Intense') activiteMod = timing === '< 2h' ? 8 : timing === '2–4h' ? -2 : -8;
  else if (activite === 'Modérée') activiteMod = timing === '< 2h' ? 2 : -5;
  else if (activite === 'Marche / léger') activiteMod = -3;

  // Âge
  const age = (g('tranche_age') as string) ?? '26–35';
  const ageMod: Record<string, number> = { '18–25': 8, '26–35': 2, '36–45': 0, '46–55': -5, '55+': -8 };
  const aM = ageMod[age] ?? 0;

  // Fenêtre de tolérance
  const fenetreRaw = sommeilScore * 0.35
    + (100 - etatNerveux) * 0.30
    + (100 - charge) * 0.20
    + attMod
    + aM
    - activiteMod * 0.3;
  const fenetreTolerance = Math.max(5, Math.min(100, Math.round(fenetreRaw)));

  // Hydratation
  const hydratation = (g('hydratation') as string) ?? 'Correcte';
  const hydMod: Record<string, number> = { 'Très faible': -12, 'Faible': -6, 'Correcte': 0, 'Bonne': 4 };
  const hM = hydMod[hydratation] ?? 0;

  // Glycémie → impact sur ressources
  const glycMod: Record<string, number> = { 'Basse': -8, 'Stable': 2, 'Élevée': -5, 'Pic post-repas': -10 };
  const gM = glycMod[metab.glycemieLabel] ?? 0;

  // BHB → bonus clarté/stabilité si modéré/élevé
  const bhbBonus = metab.bhbScore > 40 ? 6 : metab.bhbScore > 20 ? 2 : 0;

  // BDNF → bonus plasticité (affecte régulation)
  const bdnfBonus = metab.bdnfScore > 65 ? 5 : metab.bdnfScore > 45 ? 2 : 0;

  // Energie (saisie directement si disponible, sinon estimée)
  const energieSaisie = Number(g('energie') ?? 0);
  const energieEstimee = (100 - etatNerveux * 0.4 - charge * 0.35 + sommeilScore * 0.25 + aM);
  const energieBase = energieSaisie > 0 ? energieSaisie : energieEstimee;

  // Ressources disponibles
  const ressourcesRaw = energieBase + gM + hM + bhbBonus;
  const ressources = Math.max(5, Math.min(100, Math.round(ressourcesRaw)));

  // Régulation émotionnelle
  const mentalisation = Number(g('mentalisation') ?? 65);
  const resilience = Number(g('resilience') ?? 60);
  const regulationRaw = fenetreTolerance * 0.45 + mentalisation * 0.30 + resilience * 0.25 + bdnfBonus;
  const regulation = Math.max(5, Math.min(100, Math.round(regulationRaw)));

  // Disponibilité relationnelle
  const dernierContact = (g('dernier_contact') as string) ?? 'Ce matin — neutre';
  const contactMod: Record<string, number> = {
    'Ce matin — bonne': 12, 'Ce matin — neutre': 0,
    'Hier soir — tendue': -15, 'Il y a plusieurs jours': -10,
  };
  const cM = contactMod[dernierContact] ?? 0;

  const disponibiliteRaw = regulation * 0.45 + ressources * 0.30 + fenetreTolerance * 0.25 + cM + attMod * 0.5;
  const disponibilite = Math.max(5, Math.min(100, Math.round(disponibiliteRaw)));

  function label(v: number, seuils: [number, string][]): string {
    for (const [s, l] of seuils) if (v <= s) return l;
    return seuils[seuils.length - 1][1];
  }

  return {
    ressources,
    regulation,
    disponibilite,
    etatNerveux: Math.max(0, Math.min(100, etatNerveux + activiteMod)),
    fenetreTolerance,
    attachement,
    labels: {
      ressources: label(ressources, [[25, 'Épuisées'], [45, 'Faibles'], [65, 'Limitées'], [80, 'Correctes'], [100, 'Disponibles']]),
      regulation: label(regulation, [[25, 'Effondrée'], [45, 'Fragile'], [65, 'Tenue'], [80, 'Stable'], [100, 'Solide']]),
      disponibilite: label(disponibilite, [[25, 'Fermée'], [45, 'Limitée'], [65, 'Partielle'], [80, 'Présente'], [100, 'Ouverte']]),
    },
    _metab: metab, // exposé pour valsWithCalc
  } as ComputedProfile & { _metab: MetabolicState };
}

// Pas de contraintes manuelles sur BHB/glycémie — tout est calculé
function applyConstraints(vals: Record<string, string | number>, changedId: string, newVal: string | number): Record<string, string | number> {
  return { ...vals, [changedId]: newVal };
}

// ── Helpers ───────────────────────────────────────────────────────────────

function initValues(perso: Personnage): Record<string, string | number> {
  return Object.fromEntries(perso.categories.flatMap(c => c.variables.map(v => [v.id, v.valeur])));
}

function getCompletion(cat: Categorie, vals: Record<string, string | number>): number {
  const interactives = cat.variables.filter(v => v.input.type !== 'calcule');
  if (!interactives.length) return 0;
  const filled = interactives.filter(v => vals[v.id] !== undefined && vals[v.id] !== '').length;
  return Math.round((filled / interactives.length) * 100);
}

// ── Jauge vivante ─────────────────────────────────────────────────────────

function Jauge({ label, value, labelQual, couleur }: { label: string; value: number; labelQual: string; couleur: string }) {
  const pct = Math.round(value);
  return (
    <div className="cs-jauge">
      <div className="cs-jauge-hd">
        <span className="cs-jauge-label">{label}</span>
        <span className="cs-jauge-qual" style={{ color: couleur }}>{labelQual}</span>
      </div>
      <div className="cs-jauge-track">
        <div className="cs-jauge-fill" style={{ width: `${pct}%`, background: couleur }} />
      </div>
    </div>
  );
}

// ── Avatar SVG abstrait ───────────────────────────────────────────────────

function ProfileAvatar({ profile }: { profile: ComputedProfile }) {
  const { ressources, regulation, disponibilite, etatNerveux } = profile;
  const tension = etatNerveux / 100;
  const ouverture = disponibilite / 100;
  const energie = ressources / 100;

  // Couleur selon état
  const hue = tension > 0.7 ? 10 : tension > 0.5 ? 30 : ouverture > 0.7 ? 200 : 160;
  const sat = 40 + tension * 30;
  const couleurCorps = `hsl(${hue}, ${sat}%, 55%)`;
  const couleurContour = `hsl(${hue}, ${sat + 10}%, 40%)`;

  // Posture : tension haute = corps contracté, ouverture haute = épaules larges
  const largeurCorps = 28 + ouverture * 12;
  const hauteurCorps = 32 + energie * 8;
  const yTete = 18 - energie * 4; // tête basse si épuisé
  const rayonTete = 10 + ouverture * 2;
  const contracture = tension > 0.65 ? 1.5 : 0; // épaules montées

  return (
    <svg viewBox="0 0 80 90" className="cs-avatar-svg" aria-hidden="true">
      {/* Corps */}
      <ellipse
        cx="40" cy={55 - contracture}
        rx={largeurCorps / 2} ry={hauteurCorps / 2}
        fill={couleurCorps}
        opacity={0.85}
        style={{ transition: 'all .4s ease' }}
      />
      {/* Tête */}
      <circle
        cx="40" cy={yTete + 18}
        r={rayonTete}
        fill={couleurCorps}
        stroke={couleurContour}
        strokeWidth="1.5"
        style={{ transition: 'all .4s ease' }}
      />
      {/* Aura de tension */}
      {tension > 0.6 && (
        <circle
          cx="40" cy="40"
          r={38 - (1 - tension) * 10}
          fill="none"
          stroke={couleurContour}
          strokeWidth="0.5"
          opacity={tension * 0.4}
          strokeDasharray="3 4"
          style={{ transition: 'all .4s ease' }}
        />
      )}
      {/* Halo d'ouverture */}
      {ouverture > 0.65 && (
        <circle
          cx="40" cy="40"
          r={42}
          fill="none"
          stroke={couleurCorps}
          strokeWidth="0.4"
          opacity={ouverture * 0.25}
          style={{ transition: 'all .4s ease' }}
        />
      )}
    </svg>
  );
}

// ── Composant principal ───────────────────────────────────────────────────

export default function CharacterSheet() {
  const [persoId, setPersoId] = useState<'johan' | 'melanie'>('johan');
  const [catId, setCatId] = useState('environnement');
  const [varId, setVarId] = useState<string>('journee');
  const [values, setValues] = useState<Record<string, Record<string, string | number>>>({
    johan: initValues(DATA[0]),
    melanie: initValues(DATA[1]),
  });

  const perso = DATA.find(p => p.id === persoId)!;
  const cat = perso.categories.find(c => c.id === catId) ?? perso.categories[0];
  const varActive = cat.variables.find(v => v.id === varId) ?? cat.variables[0];
  const couleur = cat.couleur;

  const profile = useMemo(
    () => computeProfile(persoId, values[persoId]),
    [persoId, values]
  );

  // Variables calculées injectées dans l'affichage
  const valsWithCalc = useMemo(() => {
    const v = { ...values[persoId] };
    const m = profile._metab;
    v['dette_sommeil'] = scoreDetteSommeil(v['duree_sommeil'] as string, v['qualite_sommeil'] as string);
    v['fenetre_tolerance'] = profile.fenetreTolerance;
    if (m) {
      v['glycemie'] = m.glycemieLabel;
      v['bhb'] = m.bhbScore;
      v['bdnf'] = m.bdnfScore;
    }
    return v;
  }, [values, persoId, profile]);

  function setVal(vid: string, val: string | number) {
    const constrained = applyConstraints(values[persoId], vid, val);
    setValues(prev => ({ ...prev, [persoId]: constrained }));
  }

  function getVal(vid: string): string | number {
    return valsWithCalc[vid] ?? '';
  }

  function switchPerso(id: 'johan' | 'melanie') {
    const p = DATA.find(x => x.id === id)!;
    setPersoId(id);
    setCatId(p.categories[0].id);
    setVarId(p.categories[0].variables[0].id);
  }

  function switchCat(cid: string) {
    const c = perso.categories.find(x => x.id === cid)!;
    setCatId(cid);
    setVarId(c.variables[0].id);
  }

  return (
    <div className="cs-root">

      {/* ── Switcher personnage ── */}
      <div className="cs-switcher">
        {DATA.map(p => (
          <button
            key={p.id}
            className={`cs-switch-btn ${persoId === p.id ? 'cs-switch-btn--actif' : ''}`}
            onClick={() => switchPerso(p.id)}
          >
            <span className="cs-switch-nom">{p.nom}</span>
            <span className="cs-switch-role">{p.soustitre}</span>
          </button>
        ))}
      </div>

      {/* ── Layout 3 colonnes ── */}
      <div className="cs-layout">

        {/* ── Gauche : catégories ── */}
        <aside className="cs-nav">
          <div className="cs-nav-label">Catégories</div>
          {perso.categories.map(c => {
            const comp = getCompletion(c, values[persoId]);
            const estActif = c.id === catId;
            return (
              <button
                key={c.id}
                className={`cs-nav-item ${estActif ? 'cs-nav-item--actif' : ''}`}
                style={{ '--cc': c.couleur } as React.CSSProperties}
                onClick={() => switchCat(c.id)}
              >
                <span className="cs-nav-icone">{c.icone}</span>
                <span className="cs-nav-nom">{c.label}</span>
                <span className="cs-nav-comp">
                  <span className="cs-nav-comp-fill" style={{ width: `${comp}%`, background: c.couleur }} />
                </span>
              </button>
            );
          })}
        </aside>

        {/* ── Centre : variables ── */}
        <main className="cs-centre">
          <div className="cs-cat-header" style={{ '--cc': couleur } as React.CSSProperties}>
            <span className="cs-cat-icone" style={{ color: couleur }}>{cat.icone}</span>
            <div>
              <div className="cs-cat-titre">{cat.label}</div>
              <div className="cs-cat-desc">{cat.description}</div>
            </div>
          </div>

          <div className="cs-vars">
            {cat.variables.map(v => {
              const estSel = v.id === varId;
              const estCalcule = v.input.type === 'calcule';
              const val = getVal(v.id);

              return (
                <div
                  key={v.id}
                  className={`cs-var ${estSel ? 'cs-var--sel' : ''} ${estCalcule ? 'cs-var--calcule' : ''}`}
                  style={{ '--cc': couleur } as React.CSSProperties}
                  onClick={() => setVarId(v.id)}
                >
                  <div className="cs-var-hd">
                    <span className="cs-var-label">{v.label}</span>
                    {estCalcule
                      ? <span className="cs-var-badge-calc">Calculé</span>
                      : estSel && <span className="cs-var-actif-dot" style={{ background: couleur }} />
                    }
                  </div>

                  {estCalcule ? (
                    <div className="cs-var-calc-val" style={{ color: couleur }}>
                      {v.id === 'glycemie' ? (profile._metab?.glycemieLabel ?? '—')
                        : v.id === 'bhb' ? `${profile._metab?.bhbLabel ?? '—'} · ${profile._metab?.bhbScore ?? 0}/100`
                        : v.id === 'bdnf' ? `${profile._metab?.bdnfScore ?? 0}/100`
                        : typeof val === 'number' ? `${val}/100`
                        : val || '—'}
                    </div>
                  ) : (
                    <div className="cs-var-body" onClick={e => e.stopPropagation()}>
                      {v.input.type === 'slider' ? (
                        <div className="cs-slider-row">
                          <input
                            type="range"
                            className="cs-slider"
                            min={(v.input as SliderInput).min}
                            max={(v.input as SliderInput).max}
                            value={val as number}
                            style={{ '--cc': couleur, '--pct': `${val}%` } as React.CSSProperties}
                            onChange={e => setVal(v.id, Number(e.target.value))}
                          />
                          <span className="cs-slider-val" style={{ color: couleur }}>{val}</span>
                        </div>
                      ) : (
                        <div className="cs-choix-row">
                          {(v.input as ChoixInput).options.map(opt => (
                            <button
                              key={opt}
                              className={`cs-opt ${val === opt ? 'cs-opt--sel' : ''}`}
                              style={{ '--cc': couleur } as React.CSSProperties}
                              onClick={() => setVal(v.id, opt)}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* ── Droite : explication + profil vivant ── */}
        <aside className="cs-panel" style={{ '--cc': couleur } as React.CSSProperties}>

          {/* Explication variable active */}
          <div className="cs-detail">
            <div className="cs-detail-cat" style={{ color: couleur }}>{cat.label} · {perso.nom}</div>
            <div className="cs-detail-titre">{varActive.label}</div>
            <p className="cs-detail-desc">{varActive.description}</p>

            <div className="cs-detail-bloc">
              <div className="cs-detail-bloc-label">Source</div>
              <div className="cs-detail-bloc-val">{varActive.source}</div>
            </div>

            {varActive.influence.length > 0 && (
              <div className="cs-detail-bloc">
                <div className="cs-detail-bloc-label">Influence dans la scène</div>
                <div className="cs-detail-tags">
                  {varActive.influence.map(tag => (
                    <span key={tag} className="cs-tag" style={{ borderColor: `${couleur}55`, color: couleur, background: `${couleur}12` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {varActive.contrainte && (
              <div className="cs-detail-contrainte">
                <span className="cs-detail-contrainte-ic">⚡</span>
                {varActive.contrainte}
              </div>
            )}
          </div>

          {/* Profil vivant */}
          <div className="cs-profil-vivant">
            <div className="cs-profil-hd">
              <span className="cs-profil-titre">Profil · {perso.nom}</span>
              <span className="cs-profil-subtitle">se recalcule en temps réel</span>
            </div>

            <ProfileAvatar profile={profile} />

            <div className="cs-jauges">
              <Jauge
                label="Ressources"
                value={profile.ressources}
                labelQual={profile.labels.ressources}
                couleur="#E85D26"
              />
              <Jauge
                label="Régulation"
                value={profile.regulation}
                labelQual={profile.labels.regulation}
                couleur="#5B6FE0"
              />
              <Jauge
                label="Disponibilité"
                value={profile.disponibilite}
                labelQual={profile.labels.disponibilite}
                couleur="#2E9E6B"
              />
            </div>

            <div className="cs-profil-stats">
              <div className="cs-profil-stat">
                <span className="cs-profil-stat-label">État nerveux</span>
                <span className="cs-profil-stat-val" style={{ color: profile.etatNerveux > 70 ? '#C0394B' : profile.etatNerveux > 50 ? '#D4821A' : '#2E9E6B' }}>
                  {profile.etatNerveux}/100
                </span>
              </div>
              <div className="cs-profil-stat">
                <span className="cs-profil-stat-label">Fenêtre de tolérance</span>
                <span className="cs-profil-stat-val" style={{ color: profile.fenetreTolerance < 40 ? '#C0394B' : profile.fenetreTolerance < 60 ? '#D4821A' : '#2E9E6B' }}>
                  {profile.fenetreTolerance}/100
                </span>
              </div>
              <div className="cs-profil-stat">
                <span className="cs-profil-stat-label">Attachement</span>
                <span className="cs-profil-stat-val" style={{ color: '#5B6FE0' }}>{profile.attachement}</span>
              </div>
            </div>

            <div className="cs-profil-note">
              Ces paramètres déterminent les choix disponibles dans la scène.
            </div>
          </div>

        </aside>
      </div>
    </div>
  );
}
