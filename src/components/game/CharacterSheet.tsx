// src/components/game/CharacterSheet.tsx
// Fiche de personnage — 3 colonnes
// Gauche : navigation catégories | Centre : variables | Droite : description

import { useState } from 'react';
import './CharacterSheet.css';

// ── Types ─────────────────────────────────────────────────────────────────

type Statut = 'actif' | 'grise';
type ChoixInput = { type: 'choix'; options: string[] };
type SliderInput = { type: 'slider'; min: number; max: number };

type Variable = {
  id: string;
  label: string;
  input: ChoixInput | SliderInput;
  valeur: string | number;
  description: string;
  source: string;
  influence: string[];
  statut: Statut;
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
            statut: 'actif',
          },
          {
            id: 'charge',
            label: 'Charge émotionnelle',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 62,
            description: 'La quantité de ressources émotionnelles déjà dépensées aujourd\'hui. Plus elle est haute, moins il en reste pour la soirée.',
            source: 'Resource depletion · Baumeister',
            influence: ['Patience', 'Capacité d\'écoute', 'Risque d\'escalade'],
            statut: 'actif',
          },
          {
            id: 'dernier_contact',
            label: 'Dernier contact avec Mélanie',
            input: { type: 'choix', options: ['Ce matin — bonne', 'Ce matin — neutre', 'Hier soir — tendue', 'Il y a plusieurs jours'] },
            valeur: 'Ce matin — neutre',
            description: 'La qualité du dernier vrai contact entre eux. Ce résidu émotionnel entre dans la scène avant même qu\'un mot soit prononcé.',
            source: 'Sentiment override · Gottman',
            influence: ['Interprétation des signaux', 'Seuil de défensive'],
            statut: 'actif',
          },
          {
            id: 'espace',
            label: 'Temps seul aujourd\'hui',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 20,
            description: 'Johan a besoin de décompresser seul avant de pouvoir être vraiment présent. S\'il n\'a pas eu cet espace, une partie de lui le cherche encore.',
            source: 'Introversion · Cain · Aron',
            influence: ['Présence', 'Irritabilité de fond'],
            statut: 'grise',
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
            id: 'energie',
            label: 'Niveau d\'énergie',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 38,
            description: 'L\'énergie disponible dans le corps ce soir. Pas une métaphore — une réalité physiologique. En dessous d\'un certain seuil, le système nerveux bascule en mode conservation.',
            source: 'Théorie polyvagale · Porges',
            influence: ['Choix disponibles', 'Patience', 'Capacité de réparation'],
            statut: 'actif',
          },
          {
            id: 'etat_nerveux',
            label: 'État nerveux de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 55,
            description: 'Le niveau d\'activation du système nerveux autonome en ce moment. 0 = calme profond. 100 = à la limite du flooding. Johan arrive à 55 — déjà dans la moitié haute.',
            source: 'Siegel · Neurosciences interpersonnelles',
            influence: ['Seuil de flooding', 'Fenêtre de tolérance', 'Réactivité'],
            statut: 'actif',
          },
          {
            id: 'bhb',
            label: 'Taux de BHB',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 20,
            description: 'Le bêta-hydroxybutyrate — principal corps cétonique. À des niveaux élevés, il stabilise l\'humeur, réduit l\'inflammation cérébrale et améliore la clarté mentale. Encore peu connu, profondément impactant.',
            source: 'Veech · Métabolisme cérébral · Newport',
            influence: ['Clarté mentale', 'Stabilité émotionnelle', 'Résistance au stress'],
            statut: 'grise',
          },
          {
            id: 'cortisol',
            label: 'Charge cortisolique',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 60,
            description: 'L\'accumulation de cortisol liée au stress chronique. Elle rétrécit la fenêtre de tolérance avant même que la soirée commence — et Johan n\'en est pas conscient.',
            source: 'Sapolsky · Biologie du stress',
            influence: ['Fenêtre de tolérance', 'Flooding', 'Rancœur'],
            statut: 'grise',
          },
          {
            id: 'bdnf',
            label: 'BDNF',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 40,
            description: 'Brain-Derived Neurotrophic Factor. La molécule de la plasticité — elle détermine la capacité du cerveau à apprendre de nouvelles réponses, à sortir des patterns automatiques.',
            source: 'Ratey · Spark · Cotman',
            influence: ['Plasticité des réponses', 'Apprentissage émotionnel'],
            statut: 'grise',
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
            id: 'duree',
            label: 'Durée cette nuit',
            input: { type: 'choix', options: ['< 5h', '5–6h', '6–7h', '7–8h', '> 8h'] },
            valeur: '6–7h',
            description: 'Johan a dormi six heures et demie. Pas insuffisant, pas réparateur. Il fonctionnera — mais les marges sont étroites.',
            source: 'Walker · Pourquoi nous dormons',
            influence: ['Régulation émotionnelle', 'Réactivité de l\'amygdale'],
            statut: 'actif',
          },
          {
            id: 'qualite',
            label: 'Qualité du sommeil',
            input: { type: 'choix', options: ['Agitée', 'Fragmentée', 'Correcte', 'Profonde', 'Excellente'] },
            valeur: 'Correcte',
            description: 'La quantité ne dit pas tout. Une nuit fragmentée de 7h laisse moins de ressources qu\'une nuit profonde de 6h.',
            source: 'Walker · Dement',
            influence: ['Tolérance à la frustration', 'Empathie disponible'],
            statut: 'actif',
          },
          {
            id: 'dette',
            label: 'Dette de sommeil',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 45,
            description: 'L\'accumulation sur les derniers jours. Une dette chronique rétrécit durablement la fenêtre de tolérance — et s\'efface beaucoup plus lentement qu\'elle ne s\'installe.',
            source: 'Walker · Van Dongen',
            influence: ['Résilience de base', 'Fenêtre de tolérance'],
            statut: 'grise',
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
            id: 'type_repas',
            label: 'Type d\'alimentation',
            input: { type: 'choix', options: ['Jeûne intermittent', 'Légère', 'Équilibrée', 'Riche en glucides', 'Cétogène'] },
            valeur: 'Équilibrée',
            description: 'L\'alimentation du jour influence l\'état nerveux de base ce soir. Un repas riche en glucides raffinés provoque une courbe glycémique qui peut amplifier l\'irritabilité.',
            source: 'Amen · Neuropsychiatrie · Perlmutter',
            influence: ['Stabilité de l\'humeur', 'État nerveux de base'],
            statut: 'actif',
          },
          {
            id: 'glycemie',
            label: 'Glycémie',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 50,
            description: 'Le niveau de glucose sanguin et sa stabilité. Une glycémie instable — pics et chutes — produit des variations d\'humeur que la personne attribue souvent à l\'autre ou à la situation.',
            source: 'Perlmutter · Grain Brain',
            influence: ['Irritabilité', 'Stabilité émotionnelle'],
            statut: 'grise',
          },
          {
            id: 'hydratation',
            label: 'Hydratation',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 55,
            description: 'Une déshydratation légère — 1 à 2% — dégrade la concentration, amplifie la fatigue perçue et augmente la réactivité émotionnelle.',
            source: 'Adan · Cognitive performance',
            influence: ['Concentration', 'Réactivité émotionnelle'],
            statut: 'grise',
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
            statut: 'actif',
          },
          {
            id: 'fenetre_tolerance',
            label: 'Fenêtre de tolérance',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 52,
            description: 'L\'amplitude de la zone où Johan peut penser et ressentir en même temps. En dehors : soit il s\'emballe (suractivation), soit il se ferme (sous-activation). Ce soir elle est déjà rétrécie.',
            source: 'Siegel · Trauma et mémoire',
            influence: ['Seuil de flooding', 'Accès à l\'empathie', 'Options narratives'],
            statut: 'actif',
          },
          {
            id: 'resilience',
            label: 'Résilience de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 60,
            description: 'La capacité à traverser la rupture relationnelle et à revenir. Pas une caractéristique fixe — elle se construit dans le temps et se dégrade sous stress chronique.',
            source: 'Southwick · Charney · Bonanno',
            influence: ['Capacité de réparation', 'Récupération après conflit'],
            statut: 'grise',
          },
          {
            id: 'schemas',
            label: 'Schémas précoces',
            input: { type: 'choix', options: ['Abandon', 'Méfiance', 'Manque affectif', 'Inadéquation', 'Échec', 'Sacrifice'] },
            valeur: 'Inadéquation',
            description: 'Les patterns cognitivo-émotionnels formés tôt. Quand le schéma se déclenche, Johan réagit à une situation passée, pas à Mélanie ce soir.',
            source: 'Young · Thérapie des schémas',
            influence: ['Déclencheurs émotionnels', 'Défenses automatiques'],
            statut: 'grise',
          },
          {
            id: 'mentalisation',
            label: 'Capacité de mentalisation',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 65,
            description: 'La capacité à percevoir que soi et les autres ont des états mentaux internes. Sous stress, elle s\'effondre — l\'autre cesse d\'être une personne complexe et devient un rôle ou une menace.',
            source: 'Fonagy · Allen · Bateman',
            influence: ['Empathie sous stress', 'Choix disponibles', 'Réparation'],
            statut: 'grise',
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
            statut: 'actif',
          },
          {
            id: 'dette_emotionnelle',
            label: 'Dette émotionnelle',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 48,
            description: 'L\'accumulation de petits manques non dits — les fois où Johan n\'était pas là, n\'a pas demandé, n\'a pas vu. Mélanie tient un compte que Johan ignore souvent.',
            source: 'Gottman · L\'Équation amoureuse',
            influence: ['Rancœur · Mélanie', 'Interprétation du silence'],
            statut: 'actif',
          },
          {
            id: 'derniere_reparation',
            label: 'Dernière réparation réussie',
            input: { type: 'choix', options: ['Cette semaine', 'Ce mois-ci', 'Il y a plusieurs mois', 'Aucun souvenir récent'] },
            valeur: 'Ce mois-ci',
            description: 'La mémoire des retours réussis construit la confiance que le retour est possible. Sans cette mémoire, chaque rupture semble permanente.',
            source: 'Tronick · Still Face · Réparation répétée',
            influence: ['Confiance dans la réparation', 'Résilience du lien'],
            statut: 'grise',
          },
          {
            id: 'patterns',
            label: 'Patterns récurrents',
            input: { type: 'choix', options: ['Pursuer / Withdrawer', 'Escalade mutuelle', 'Gel symétrique', 'Aucun pattern dominant'] },
            valeur: 'Pursuer / Withdrawer',
            description: 'La danse que Johan et Mélanie font depuis longtemps. Plus Mélanie s\'approche avec intensité, plus Johan recule — ce qui pousse Mélanie à s\'approcher encore plus fort.',
            source: 'Johnson · EFT · Christensen',
            influence: ['Dynamique de la scène', 'Options disponibles'],
            statut: 'grise',
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
        description: 'Ce qui s\'est passé aujourd\'hui pour Mélanie.',
        variables: [
          {
            id: 'journee',
            label: 'Qualité de la journée',
            input: { type: 'choix', options: ['Très difficile', 'Chargée', 'Neutre', 'Bonne', 'Excellente'] },
            valeur: 'Très difficile',
            description: 'Mélanie a reçu son rapport ce matin. Elle attendait ce retour depuis trois semaines. Il est décevant — et elle a porté ça seule toute la journée, sans pouvoir en parler.',
            source: 'Allostatic load · McEwen',
            influence: ['Besoin de connexion', 'Seuil émotionnel', 'Attente de Johan'],
            statut: 'actif',
          },
          {
            id: 'charge',
            label: 'Charge émotionnelle',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 78,
            description: 'Mélanie arrive avec une charge haute. Elle n\'a pas encore décidé si elle va en parler — mais quelque chose dans sa façon de couper les légumes le dit.',
            source: 'Resource depletion · Baumeister',
            influence: ['Capacité à attendre', 'Besoin de réponse de Johan'],
            statut: 'actif',
          },
          {
            id: 'besoin_non_dit',
            label: 'Besoin non dit',
            input: { type: 'choix', options: ['Être vue', 'Être écoutée', 'Être touchée', 'Être rassurée', 'Être laissée tranquille'] },
            valeur: 'Être vue',
            description: 'Ce que Mélanie attend sans l\'avoir formulé. Si Johan le voit — sans qu\'elle ait à demander — quelque chose se déplace.',
            source: 'Théorie de l\'attachement · Besoins primaires',
            influence: ['Réponse émotionnelle aux choix de Johan', 'Qualité du lien possible'],
            statut: 'actif',
          },
        ],
      },
      {
        id: 'biologie',
        label: 'Biologie',
        icone: '⬡',
        couleur: '#E85D26',
        description: 'L\'état physiologique de Mélanie ce soir.',
        variables: [
          {
            id: 'etat_nerveux',
            label: 'État nerveux de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 72,
            description: 'Mélanie est déjà à 72 sur 100. Pas encore en flooding — mais sa fenêtre est étroite. Un mot de trop et elle bascule.',
            source: 'Siegel · Porges',
            influence: ['Seuil de flooding', 'Disponibilité à la connexion'],
            statut: 'actif',
          },
          {
            id: 'energie',
            label: 'Niveau d\'énergie',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 35,
            description: 'Elle est épuisée. Pas le genre d\'épuisement qui cherche le silence — le genre qui a besoin que quelqu\'un remarque.',
            source: 'Théorie polyvagale · Porges',
            influence: ['Patience disponible', 'Choix possibles'],
            statut: 'actif',
          },
          {
            id: 'cortisol',
            label: 'Charge cortisolique',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 75,
            description: 'La fenêtre de tolérance de Mélanie est déjà rétrécie avant que Johan prononce un mot.',
            source: 'Sapolsky · Biologie du stress',
            influence: ['Fenêtre de tolérance', 'Interprétation des signaux'],
            statut: 'grise',
          },
        ],
      },
      {
        id: 'psychologie',
        label: 'Psychologie',
        icone: '◉',
        couleur: '#5B6FE0',
        description: 'L\'histoire longue de Mélanie. Ce qu\'elle porte dans chaque soirée.',
        variables: [
          {
            id: 'attachement',
            label: 'Style d\'attachement',
            input: { type: 'choix', options: ['Sécure', 'Anxieux', 'Évitant', 'Désorganisé'] },
            valeur: 'Anxieux',
            description: 'Mélanie a besoin de signaux de connexion réguliers pour se sentir en sécurité. Quand ils manquent, elle les cherche avec une intensité que Johan perçoit parfois comme de la pression.',
            source: 'Bowlby · Ainsworth · Johnson',
            influence: ['Lecture des signaux de Johan', 'Réponse au retrait', 'Protest behavior'],
            statut: 'actif',
          },
          {
            id: 'fenetre_tolerance',
            label: 'Fenêtre de tolérance',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 45,
            description: 'La fenêtre de Mélanie est plus étroite que d\'habitude ce soir. C\'est ce qu\'elle veut dire quand elle dit qu\'elle est "près du bord".',
            source: 'Siegel · Neurosciences interpersonnelles',
            influence: ['Seuil de flooding', 'Accès à la nuance'],
            statut: 'actif',
          },
          {
            id: 'question_attachement',
            label: 'Question d\'attachement cachée',
            input: { type: 'choix', options: ['Est-ce que je compte pour toi ?', 'Est-ce que tu es là pour moi ?', 'Suis-je trop pour toi ?', 'M\'abandonnes-tu ?'] },
            valeur: 'Est-ce que je compte pour toi ?',
            description: 'Sous la surface de la soirée, c\'est cette question que Mélanie pose sans la poser. Chaque choix de Johan y répond — sans qu\'il le sache.',
            source: 'Johnson · EFT · Hold Me Tight',
            influence: ['Interprétation des actions de Johan', 'Intensité émotionnelle'],
            statut: 'actif',
          },
          {
            id: 'resilience',
            label: 'Résilience de base',
            input: { type: 'slider', min: 0, max: 100 },
            valeur: 55,
            description: 'La capacité à traverser et revenir. Pour Mélanie, elle dépend beaucoup de se sentir vue et entendue.',
            source: 'Southwick · Charney',
            influence: ['Réparation possible', 'Confiance dans le retour'],
            statut: 'grise',
          },
        ],
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function getCompletion(cat: Categorie, vals: Record<string, string | number>): number {
  const actives = cat.variables.filter(v => v.statut === 'actif');
  if (!actives.length) return 0;
  return Math.round((actives.filter(v => vals[v.id] !== undefined).length / actives.length) * 100);
}

function initValues(perso: Personnage): Record<string, string | number> {
  return Object.fromEntries(
    perso.categories.flatMap(c => c.variables.map(v => [v.id, v.valeur]))
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
  const varActive = cat.variables.find(v => v.id === varId) ?? cat.variables.find(v => v.statut === 'actif') ?? cat.variables[0];
  const couleur = cat.couleur;

  function setVal(vid: string, val: string | number) {
    setValues(prev => ({ ...prev, [persoId]: { ...prev[persoId], [vid]: val } }));
  }

  function getVal(vid: string): string | number {
    return values[persoId][vid] ?? '';
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
    setVarId(c.variables.find(v => v.statut === 'actif')?.id ?? c.variables[0].id);
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
        <div className="cs-switch-phase">
          <span className="cs-phase-dot" />
          Phase 0 · Paramètres de base
        </div>
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
              const estSelectionne = v.id === varId;
              const estGrise = v.statut === 'grise';
              const val = getVal(v.id);

              return (
                <div
                  key={v.id}
                  className={`cs-var ${estSelectionne ? 'cs-var--sel' : ''} ${estGrise ? 'cs-var--grise' : ''}`}
                  style={{ '--cc': couleur } as React.CSSProperties}
                  onClick={() => !estGrise && setVarId(v.id)}
                >
                  <div className="cs-var-hd">
                    <span className="cs-var-label">{v.label}</span>
                    {estGrise
                      ? <span className="cs-var-locked">À explorer</span>
                      : estSelectionne && <span className="cs-var-actif-dot" style={{ background: couleur }} />
                    }
                  </div>

                  {!estGrise && (
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

                  {estGrise && (
                    <div className="cs-var-source">{v.source}</div>
                  )}
                </div>
              );
            })}
          </div>
        </main>

        {/* ── Droite : description ── */}
        <aside className="cs-panel" style={{ '--cc': couleur } as React.CSSProperties}>
          <div className="cs-detail">
            <div className="cs-detail-cat" style={{ color: couleur }}>{cat.label} · {perso.nom}</div>
            <div className="cs-detail-titre">{varActive.label}</div>
            <p className="cs-detail-desc">{varActive.description}</p>

            <div className="cs-detail-bloc">
              <div className="cs-detail-bloc-label">Source</div>
              <div className="cs-detail-bloc-val">{varActive.source}</div>
            </div>

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

            {varActive.statut === 'grise' && (
              <div className="cs-detail-locked">
                <span className="cs-detail-locked-ic">◇</span>
                Ce paramètre se débloque à mesure que les expériences explorent ce concept.
              </div>
            )}
          </div>

          {/* Résumé */}
          <div className="cs-resume">
            <div className="cs-resume-titre">Profil · {perso.nom}</div>
            {[
              { label: 'État nerveux', vid: 'etat_nerveux', unit: '/100' },
              { label: 'Fenêtre de tolérance', vid: 'fenetre_tolerance', unit: '/100' },
              { label: 'Attachement', vid: 'attachement', unit: '' },
            ].map(({ label, vid, unit }) => {
              const v = getVal(vid);
              return v !== undefined ? (
                <div key={vid} className="cs-resume-ligne">
                  <span className="cs-resume-label">{label}</span>
                  <span className="cs-resume-val" style={{ color: couleur }}>
                    {v}{unit}
                  </span>
                </div>
              ) : null;
            })}
            <div className="cs-resume-note">
              Ces paramètres déterminent les choix disponibles dans la scène.
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
