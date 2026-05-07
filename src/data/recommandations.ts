// src/data/recommandations.ts
// Catalogue de recommandations Syncognie — scorées par priorité
//
// Architecture :
//   – chaque entrée a un `poids` (1 = contextuel, 2 = important, 3 = urgent)
//   – chaque entrée a un `format` qui détermine la charge cognitive requise
//   – rankRecommandations filtre les conditions vraies, applique le filtre cognitif,
//     trie par poids desc, retourne les N premières
//   – ajouter une ressource = ajouter une entrée ici, sans toucher à la logique
//
// Règle de filtrage cognitif :
//   Si fenetreTolerance < 35 OU ressources < 25 → seuls 'outil-immediat' et 'recit' sont éligibles
//   Les lectures longues et outils d'exploration sont silencieusement écartés
//
// Format des ressources :
//   'outil-immediat'    → usage immédiat, 2–5 min, pas de lecture (granularité, baromètre, cortisol)
//   'outil-exploration' → demande concentration et disponibilité (nuancier, constellation, strates)
//   'recit'             → scène narrative, engagement émotionnel, 10–15 min
//   'lecture-courte'    → article < 1500 mots, engagement modéré
//   'lecture-longue'    → article > 2500 mots ou penseur, engagement soutenu

import type { Recommandation } from '../components/profile/ProfileTool';

// ── Extension du type ─────────────────────────────────────────────────────

export type FormatRessource =
  | 'outil-immediat'
  | 'outil-exploration'
  | 'recit'
  | 'lecture-courte'
  | 'lecture-longue';

export type RecommandationScoree = Recommandation & {
  poids:     1 | 2 | 3;
  categorie: 'biologie' | 'regulation' | 'relation' | 'exploration';
  format:    FormatRessource;
  labelLien?: string;
};

// ── Seuils du filtre cognitif ─────────────────────────────────────────────

const SEUIL_FENETRE_CRITIQUE  = 35;
const SEUIL_RESSOURCES_CRITIQUE = 25;

const FORMATS_EN_ETAT_CRITIQUE: FormatRessource[] = ['outil-immediat', 'recit'];

// ── Catalogue complet ─────────────────────────────────────────────────────

export const CATALOGUE: RecommandationScoree[] = [

  // ════════════════════════════════════════════════════════════════
  // OUTILS IMMÉDIATS — priorité maximale en état critique
  // ════════════════════════════════════════════════════════════════

  {
    poids: 3,
    categorie: 'regulation',
    format: 'outil-immediat',
    condition: (p) => p.etatNerveux > 65 || p.fenetreTolerance < 40,
    message:
      'Avant d\'analyser ce qui se passe, nommer ce que vous ressentez. ' +
      'L\'outil de granularité émotionnelle guide en 3 étapes vers le mot juste ' +
      '— ce qui suffit parfois à reprendre pied.',
    lien: '/atelier/granularite-emotionnelle',
    labelLien: 'Nommer ce que je ressens →',
  },

  {
    poids: 3,
    categorie: 'biologie',
    format: 'outil-immediat',
    condition: (p) => p.ressources < 35 && p.etatNerveux > 60,
    message:
      'Ressources basses et système activé. ' +
      'Le baromètre de charge fait une photo de ce que vous portez — ' +
      'physique, mental, émotionnel — sans jugement ni culpabilité. ' +
      'Deux minutes pour voir clair.',
    lien: '/outils/barometre',
    labelLien: 'Faire le point maintenant →',
  },

  {
    poids: 2,
    categorie: 'biologie',
    format: 'outil-immediat',
    condition: (p) => p.ressources < 45 || p.etatNerveux > 60,
    message:
      'Vingt questions sur cinq dimensions physiologiques — stress perçu, ' +
      'rythme circadien, régulation émotionnelle. ' +
      'En sortie : votre courbe cortisol estimée sur 24h. ' +
      'Utile pour comprendre d\'où vient la fatigue.',
    lien: '/outils/cortisol',
    labelLien: 'Estimer ma courbe cortisol →',
  },

  // ════════════════════════════════════════════════════════════════
  // URGENCE PHYSIOLOGIQUE — poids 3, lectures
  // ════════════════════════════════════════════════════════════════

  {
    poids: 3,
    categorie: 'biologie',
    format: 'lecture-longue',
    condition: (p) => p.ressources < 30 && p.etatNerveux > 70,
    message:
      'Ressources très basses et système nerveux en surchauffe. ' +
      'Dans cet état, le cortex préfrontal cède la place à l\'amygdale — ' +
      'les décisions prises ici laissent des traces. ' +
      'Comprendre ce que le cortisol fait concrètement peut changer le regard.',
    lien: '/journal/Le cortisol comprendre le stress et retrouver l\'équilibre',
    labelLien: 'Le cortisol — ce qui se passe vraiment →',
  },

  {
    poids: 3,
    categorie: 'regulation',
    format: 'recit',
    condition: (p) => p.fenetreTolerance < 30,
    message:
      'Fenêtre de tolérance très étroite. ' +
      'Vous êtes à la limite de la zone où penser et ressentir coexistent. ' +
      'La scène de Mélanie et Johan illustre exactement ce point de bascule.',
    lien: '/sous-la-surface/fenetre-tolerance-couple',
    labelLien: 'La fenêtre de tolérance — Mélanie et Johan →',
  },

  // ════════════════════════════════════════════════════════════════
  // RÉGULATION FRAGILE — poids 2
  // ════════════════════════════════════════════════════════════════

  {
    poids: 2,
    categorie: 'regulation',
    format: 'lecture-courte',
    condition: (p) => p.regulation < 45,
    message:
      'La régulation émotionnelle est fragilisée. ' +
      'C\'est souvent ici que les automatismes prennent le dessus — ' +
      'on réagit à une situation passée, pas à ce qui se passe maintenant.',
    lien: '/articles/ce-qu-on-sait-et-ce-qu-on-fait',
    labelLien: 'Ce qu\'on sait et ce qu\'on fait →',
  },

  {
    poids: 2,
    categorie: 'regulation',
    format: 'recit',
    condition: (p) => p.etatNerveux > 65 && p.fenetreTolerance < 50,
    message:
      'État nerveux élevé et fenêtre étroite : le travail émotionnel silencieux ' +
      'est souvent invisible — mais il coûte. ' +
      'La scène de Mélanie seule au travail le montre de l\'intérieur.',
    lien: '/sous-la-surface/melanie-au-travail',
    labelLien: 'Le travail émotionnel — Mélanie seule →',
  },

  {
    poids: 2,
    categorie: 'biologie',
    format: 'lecture-courte',
    condition: (p) => p.ressources < 45,
    message:
      'Ressources basses. Avant d\'engager une conversation qui compte, ' +
      'comprendre ce que le cortisol accumule — et comment il se dissipe ' +
      'vraiment — peut changer la façon d\'aborder la suite.',
    lien: '/journal/Le cortisol comprendre le stress et retrouver l\'équilibre',
    labelLien: 'Le cortisol — comprendre et agir →',
  },

  {
    poids: 2,
    categorie: 'biologie',
    format: 'lecture-courte',
    condition: (p) => p.ressources < 45,
    message:
      'Le système de récompense explique pourquoi les ressources s\'épuisent ' +
      'même sans effort visible. Dopamine, anticipation, balance plaisir/douleur ' +
      '— un article court sur ce qui se passe sous la surface.',
    lien: '/articles/syst-recompense-5',
    labelLien: 'Le système de récompense →',
  },

  // ════════════════════════════════════════════════════════════════
  // TRACKER — outil de suivi, poids 2
  // ════════════════════════════════════════════════════════════════

  {
    poids: 2,
    categorie: 'biologie',
    format: 'outil-immediat',
    condition: (p) => p.ressources < 55 && p.regulation < 55,
    message:
      'Trois ancres quotidiennes. Intensité 1 à 3. Mémoire 7 jours. ' +
      'Pas des objectifs — des signaux pour repérer ce qui restaure ' +
      'vraiment vos ressources au fil des jours.',
    lien: '/outils/tracker',
    labelLien: 'Suivre mes ancres →',
  },

  // ════════════════════════════════════════════════════════════════
  // BOUSSOLE DOPAMINERGIQUE — poids 2
  // ════════════════════════════════════════════════════════════════

  {
    poids: 2,
    categorie: 'biologie',
    format: 'outil-immediat',
    condition: (p) => p.etatNerveux > 55 && p.ressources < 60,
    message:
      'Quelques questions pour estimer votre charge dopaminergique ' +
      'et votre fatigue nerveuse. ' +
      'En sortie : des pistes d\'équilibre adaptées à votre état du moment.',
    lien: '/outils/boussole',
    labelLien: 'Estimer ma charge nerveuse →',
  },

  // ════════════════════════════════════════════════════════════════
  // ATTACHEMENT & RELATION — poids 2
  // ════════════════════════════════════════════════════════════════

  {
    poids: 2,
    categorie: 'relation',
    format: 'recit',
    condition: (p) => p.attachement === 'Anxieux',
    message:
      'Le style anxieux amplifie les signaux d\'abandon, ' +
      'même quand ils n\'existent pas. ' +
      'La scène du message non répondu illustre exactement ce mécanisme.',
    lien: '/sous-la-surface/message-non-repondu',
    labelLien: 'Le message non répondu — Mélanie et l\'écran →',
  },

  {
    poids: 2,
    categorie: 'relation',
    format: 'lecture-longue',
    condition: (p) => p.attachement === 'Évitant',
    message:
      'Le style évitant crée une distance qui protège — et qui coûte. ' +
      'La théorie de l\'attachement, de Bowlby à Johnson, ' +
      'pose les bases pour comprendre comment ce pattern se maintient.',
    lien: '/planches',
    labelLien: 'Bowlby & Ainsworth — la théorie de l\'attachement →',
  },

  {
    poids: 2,
    categorie: 'relation',
    format: 'lecture-longue',
    condition: (p) => p.attachement === 'Désorganisé',
    message:
      'Le style désorganisé oscille entre besoin de proximité et peur du lien. ' +
      'Esther Perel sur les paradoxes du couple — sécurité et désir, ' +
      'intimité et indépendance — peut ouvrir une lecture différente.',
    lien: '/planches',
    labelLien: 'Esther Perel — planches →',
  },

  {
    poids: 2,
    categorie: 'relation',
    format: 'lecture-courte',
    condition: (p) => p.disponibilite < 40 && p.regulation < 50,
    message:
      'Quand disponibilité et régulation sont toutes deux basses, ' +
      'les malentendus viennent souvent de deux escaliers différents ' +
      'dans la même pièce — Argyris, Bruner, Korzybski.',
    lien: '/articles/deux-escaliers-inference-argyris',
    labelLien: 'Deux escaliers dans la même pièce →',
  },

  // ════════════════════════════════════════════════════════════════
  // DISPONIBILITÉ & OUVERTURE — poids 1
  // ════════════════════════════════════════════════════════════════

  {
    poids: 1,
    categorie: 'relation',
    format: 'lecture-longue',
    condition: (p) => p.disponibilite > 65 && p.ressources > 55,
    message:
      'Vous êtes en bonne disponibilité relationnelle. ' +
      'C\'est une fenêtre pour les conversations qui comptent. ' +
      'La CNV de Rosenberg donne des outils concrets pour en tirer le meilleur.',
    lien: '/atelier/rosenberg',
    labelLien: 'Communication Non Violente — Rosenberg →',
  },

  {
    poids: 1,
    categorie: 'relation',
    format: 'lecture-longue',
    condition: (p) => p.disponibilite > 65 && p.regulation > 60,
    message:
      'Bonnes conditions pour observer les patterns relationnels à froid. ' +
      'John Gottman a prédit le divorce avec 90% de précision — ' +
      'ses 4 cavaliers et le ratio 5:1 sont des repères utiles.',
    lien: '/planches',
    labelLien: 'John Gottman — le scientifique de l\'amour →',
  },

  // ════════════════════════════════════════════════════════════════
  // EXPLORATION & CURIOSITÉ — poids 1, lectures
  // ════════════════════════════════════════════════════════════════

  {
    poids: 1,
    categorie: 'exploration',
    format: 'lecture-longue',
    condition: (p) => p.regulation > 55 && p.ressources > 50,
    message:
      'Vous avez les ressources pour aller plus loin. ' +
      'Comprendre pourquoi on ne change pas — même quand on sait — ' +
      'est une des questions les plus utiles. Watzlawick, Frankl, Gollwitzer.',
    lien: '/articles/ce-qu-on-sait-et-ce-qu-on-fait',
    labelLien: 'Ce qu\'on sait et ce qu\'on fait →',
  },

  {
    poids: 1,
    categorie: 'exploration',
    format: 'lecture-longue',
    condition: (p) => p.regulation > 60 && p.fenetreTolerance > 55,
    message:
      'Dans un bon état nerveux, la mentalisation est accessible. ' +
      'Kegan montre que le développement adulte ne s\'arrête pas à l\'adolescence — ' +
      'comprendre comment on comprend change tout.',
    lien: '/atelier/kegan',
    labelLien: 'Le développement adulte — Kegan →',
  },

  // ════════════════════════════════════════════════════════════════
  // OUTILS D'EXPLORATION — poids 1, disponibilité requise
  // ════════════════════════════════════════════════════════════════

  {
    poids: 1,
    categorie: 'exploration',
    format: 'outil-exploration',
    condition: (p) => p.regulation > 55 && p.ressources > 55,
    message:
      'Dix scénarios pour entraîner votre cerveau à différencier ' +
      'des émotions très proches. ' +
      'Un exercice de précision pour les moments où la curiosité est disponible.',
    lien: '/atelier/nuancier',
    labelLien: 'S\'entraîner au nuancier émotionnel →',
  },

  {
    poids: 1,
    categorie: 'exploration',
    format: 'outil-exploration',
    condition: (p) => p.disponibilite > 60 && p.ressources > 60,
    message:
      '28 penseurs, leurs concepts, leurs tensions et filiations. ' +
      'Naviguer dans le réseau des idées par domaine ou par contexte — ' +
      'plutôt que mémoriser.',
    lien: '/outils/constellation',
    labelLien: 'Explorer la constellation →',
  },

  {
    poids: 1,
    categorie: 'exploration',
    format: 'outil-exploration',
    condition: (p) => p.disponibilite > 60 && p.regulation > 60,
    message:
      'Les penseurs de Syncognie organisés par la question qu\'ils éclairent — ' +
      'du mécanisme neurochimique à la structure des systèmes. ' +
      'Naviguer par couche plutôt que par auteur.',
    lien: '/outils/strates',
    labelLien: 'Explorer les strates →',
  },

  {
    poids: 1,
    categorie: 'exploration',
    format: 'outil-exploration',
    condition: (p) => p.disponibilite > 65 && p.ressources > 65,
    message:
      '46 modèles de pensée, 14 domaines — leurs territoires, ' +
      'leurs limites, leurs angles morts. ' +
      'Pour naviguer entre les cadres selon la question qu\'on se pose.',
    lien: '/outils/boussole-epistemique',
    labelLien: 'Naviguer les modèles de pensée →',
  },

  {
    poids: 1,
    categorie: 'exploration',
    format: 'outil-exploration',
    condition: (p) => p.disponibilite > 60 && p.ressources > 50,
    message:
      'Quand les ressources permettent la curiosité : ' +
      'l\'atelier rassemble les concepts et penseurs qui éclairent les situations ' +
      'difficiles — chacun comme un outil, pas une doctrine.',
    lien: '/atelier',
    labelLien: 'Explorer l\'atelier →',
  },

];

// ── Fonction de ranking avec filtre cognitif ──────────────────────────────
//
// Usage dans ProfileTool ou profil.astro :
//   import { rankRecommandations } from '../data/recommandations';
//   const top = rankRecommandations(profile, CATALOGUE, 3);

export function rankRecommandations(
  profile: Parameters<Recommandation['condition']>[0],
  catalogue: RecommandationScoree[],
  limit = 3
): RecommandationScoree[] {

  // Déterminer si le profil est en état cognitif critique
  const etatCritique =
    profile.fenetreTolerance < SEUIL_FENETRE_CRITIQUE ||
    profile.ressources < SEUIL_RESSOURCES_CRITIQUE;

  return catalogue
    .filter((r) => {
      // 1. La condition thématique doit être vraie
      if (!r.condition(profile)) return false;
      // 2. En état critique : seuls les formats légers passent
      if (etatCritique && !FORMATS_EN_ETAT_CRITIQUE.includes(r.format)) return false;
      return true;
    })
    .sort((a, b) => b.poids - a.poids)
    .slice(0, limit);
}
