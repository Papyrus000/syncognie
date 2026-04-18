// ══════════════════════════════════════════════════════════════
//  PATCH nuancier.astro — intégration tracker
//  Ajouter ces lignes dans le <script> existant du nuancier
//
//  1. En haut du bloc <script> (après les imports existants) :
// ══════════════════════════════════════════════════════════════

import { saveNuancierSession } from '../../lib/syncognie-tracker';

// ══════════════════════════════════════════════════════════════
//  2. Dans la fonction showEnd() (là où le score final est affiché),
//     juste après avoir calculé score et deck.length,
//     ajouter UNE seule ligne :
// ══════════════════════════════════════════════════════════════

//  Chercher dans showEnd() la ligne qui ressemble à :
//    scoreNumber.textContent = String(score);
//  Et ajouter JUSTE APRÈS :

saveNuancierSession(score, deck.length);

// ══════════════════════════════════════════════════════════════
//  C'est tout pour le nuancier.
//  Le widget lit automatiquement les données via readStats().
// ══════════════════════════════════════════════════════════════


// ══════════════════════════════════════════════════════════════
//  PATCH articles du Carnet (optionnel, à faire plus tard)
//  Dans chaque page article .astro ou le layout carnet,
//  ajouter dans un <script> :
// ══════════════════════════════════════════════════════════════

/*
import { markArticleRead } from '../../lib/syncognie-tracker';

// Marquer comme lu quand l'utilisateur a scrollé 60% de l'article
const slug = window.location.pathname; // ex: "/carnet/nom-article"

const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      markArticleRead(slug);
      observer.disconnect();
    }
  });
}, { threshold: 0.1 });

// Observer un élément vers la fin de l'article (footer, dernière section, etc.)
const target = document.querySelector('footer') || document.querySelector('article');
if (target) observer.observe(target);
*/
