// src/data/recommandations.ts
// Catalogue de recommandations Syncognie — scorées par priorité
//
// Architecture :
//   – chaque Recommandation a un `poids` (1 = contextuel, 2 = important, 3 = urgent)
//   – ProfileTool filtre les conditions vraies, trie par poids desc, affiche les 2 premières
//   – ajouter un article = ajouter une entrée ici, sans toucher à la logique
//
// Types importés depuis ProfileTool (ou re-déclarés en attendant l'extraction)
// ComputedProfile : {
//   ressources:        number   0–100
//   regulation:        number   0–100
//   disponibilite:     number   0–100
//   etatNerveux:       number   0–100
//   fenetreTolerance:  number   0–100
//   attachement:       'Sécure' | 'Anxieux' | 'Évitant' | 'Désorganisé'
// }

import type { Recommandation } from '../components/profile/ProfileTool';

// ── Extension du type pour le scoring interne ─────────────────────────────

export type RecommandationScoree = Recommandation & {
  poids: 1 | 2 | 3;           // 3 = priorité maximale
  categorie: 'biologie' | 'regulation' | 'relation' | 'exploration';
  labelLien?: string;          // texte du lien (défaut : "Lire →")
};

// ── Catalogue complet ─────────────────────────────────────────────────────

export const CATALOGUE: RecommandationScoree[] = [

  // ── URGENCE PHYSIOLOGIQUE (poids 3) ─────────────────────────────────────

  {
    poids: 3,
    categorie: 'biologie',
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
    condition: (p) => p.fenetreTolerance < 30,
    message:
      'Fenêtre de tolérance très étroite. ' +
      'Vous êtes à la limite de la zone où penser et ressentir coexistent. ' +
      'La scène de Mélanie et Johan illustre exactement ce point de bascule.',
    lien: '/sous-la-surface/fenetre-tolerance-couple',
    labelLien: 'La fenêtre de tolérance — Mélanie et Johan →',
  },

  // ── RÉGULATION FRAGILE (poids 2) ────────────────────────────────────────

  {
    poids: 2,
    categorie: 'regulation',
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
    condition: (p) => p.ressources < 45,
    message:
      'Le système de récompense explique pourquoi les ressources s\'épuisent ' +
      'même sans effort visible. Dopamine, anticipation, balance plaisir/douleur ' +
      '— un article court sur ce qui se passe sous la surface.',
    lien: '/articles/syst-recompense-5',
    labelLien: 'Le système de récompense →',
  },

  // ── ATTACHEMENT & RELATION (poids 2) ────────────────────────────────────

  {
    poids: 2,
    categorie: 'relation',
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
    condition: (p) => p.attachement === 'Évitant',
    message:
      'Le style évitant crée une distance qui protège — et qui coûte. ' +
      'La théorie de l\'attachement, de Bowlby à Johnson, ' +
      'pose les bases pour comprendre comment ce pattern se maintient.',
    lien: '/planches/bowlby',
    labelLien: 'Bowlby & Ainsworth — la théorie de l\'attachement →',
  },

  {
    poids: 2,
    categorie: 'relation',
    condition: (p) => p.attachement === 'Désorganisé',
    message:
      'Le style désorganisé oscille entre besoin de proximité et peur du lien. ' +
      'Esther Perel sur les paradoxes du couple — sécurité et désir, ' +
      'intimité et indépendance — peut ouvrir une lecture différente.',
    lien: '/planches/perel',
    labelLien: 'Esther Perel — comprendre le couple moderne →',
  },

  {
    poids: 2,
    categorie: 'relation',
    condition: (p) => p.disponibilite < 40 && p.regulation < 50,
    message:
      'Quand disponibilité et régulation sont toutes deux basses, ' +
      'les malentendus viennent souvent de deux escaliers différents ' +
      'dans la même pièce — Argyris, Bruner, Korzybski.',
    lien: '/articles/deux-escaliers-inference-argyris',
    labelLien: 'Deux escaliers dans la même pièce →',
  },

  // ── DISPONIBILITÉ & OUVERTURE (poids 1) ─────────────────────────────────

  {
    poids: 1,
    categorie: 'relation',
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
    condition: (p) => p.disponibilite > 65 && p.regulation > 60,
    message:
      'Bonnes conditions pour observer les patterns relationnels à froid. ' +
      'John Gottman a prédit le divorce avec 90% de précision — ' +
      'ses 4 cavaliers et le ratio 5:1 sont des repères utiles.',
    lien: '/planches/gottman-1',
    labelLien: 'John Gottman — le scientifique de l\'amour →',
  },

  // ── EXPLORATION & CURIOSITÉ (poids 1) ───────────────────────────────────

  {
    poids: 1,
    categorie: 'exploration',
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
    condition: (p) => p.regulation > 60 && p.fenetreTolerance > 55,
    message:
      'Dans un bon état nerveux, la mentalisation est accessible. ' +
      'Kegan montre que le développement adulte ne s\'arrête pas à l\'adolescence — ' +
      'comprendre comment on comprend change tout.',
    lien: '/atelier/kegan',
    labelLien: 'Le développement adulte — Kegan →',
  },

  {
    poids: 1,
    categorie: 'exploration',
    condition: (p) => p.disponibilite > 60 && p.ressources > 60,
    message:
      'Quand les ressources permettent la curiosité : ' +
      'l\'atelier rassemble les concepts et penseurs qui éclairent les situations ' +
      'difficiles — chacun comme un outil, pas une doctrine.',
    lien: '/atelier',
    labelLien: 'Explorer l\'atelier →',
  },

];

// ── Fonction de ranking ───────────────────────────────────────────────────
//
// Usage dans ProfileTool ou profil.astro :
//   import { rankRecommandations } from '../data/recommandations';
//   const top = rankRecommandations(profile, CATALOGUE, 2);

export function rankRecommandations(
  profile: Parameters<Recommandation['condition']>[0],
  catalogue: RecommandationScoree[],
  limit = 2
): RecommandationScoree[] {
  return catalogue
    .filter((r) => r.condition(profile))
    .sort((a, b) => b.poids - a.poids)
    .slice(0, limit);
}
