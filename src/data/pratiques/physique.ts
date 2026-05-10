// src/data/pratiques/physique.ts
// ─────────────────────────────────────────────────────────────────────────────
// PRATIQUES PHYSIQUES — modifiable independamment du moteur et de l'UI
//
// Ce fichier contient les 6 pratiques d'activite physique.
// Pour modifier un effet : changer le delta dans effets.
// Pour ajouter une pratique : copier un objet complet, changer l'id.
// Pour ajouter une synergie liee a une pratique : aller dans data/synergies/
//
// NE PAS modifier les ids existants :
//   "force" "hiit" "endurance" "marche" "yoga" "repos-complet"
//   Ces ids sont references dans data/synergies/ et dans le HTML de l'UI.
// ─────────────────────────────────────────────────────────────────────────────

import type { Pratique } from "./_schema"

export const pratiquesPhysique: Pratique[] = [

  {
    id: "force",
    label: "Musculation",
    note_ui: "Micro-lesions. Adaptation si recuperation adequate.",
    categorie: "physique",
    groupe_exclusif: undefined,
    effets: {
      met: { delta: -30, immediat: true,  note: "Depletion glycogene musculaire, demande ATP elevee" },
      nerv: { delta: -20, immediat: true,  note: "Activation SNS prolongee, secretion de cortisol" },
      rec:  { delta: -25, immediat: true,  note: "Microtraumatismes musculaires, inflammation locale" },
    },
    effets_repetes: {
      J4: {
        rec: { delta: -15, note: "Accumulation inflammatoire sans fenetre de recuperation suffisante" },
      },
      adaptation: {
        met: { base_modifier: 8, note: "Augmentation de la capacite oxydative apres 3-4 semaines regulieres" },
        rec: { base_modifier: 5, note: "Meilleure efficacite de reparation musculaire avec la regularite" },
      },
    },
    source: "Schoenfeld 2010 (hypertrophie), Kraemer & Ratamess 2005 (reponse hormonale), Gleeson 2007 (inflammation)",
    incertitude: "faible",
    conditions: [
      "Les benefices d'adaptation sont maximaux avec un apport proteique de 1.6-2.2g/kg/j",
      "La depletion glycogene varie fortement selon l'intensite et le volume",
    ],
  },

  {
    id: "hiit",
    label: "HIIT",
    note_ui: "Stress maximal. Hormese puissante si recupere.",
    categorie: "physique",
    groupe_exclusif: undefined,
    effets: {
      met:  { delta: -40, immediat: true, note: "Depletion glycogene maximale, dette en O2 elevee" },
      nerv: { delta: -35, immediat: true, note: "Pic cortisol et adrenaline, activation SNS intense" },
      rec:  { delta: -30, immediat: true, note: "Dommages musculaires et oxydatifs eleves" },
    },
    effets_repetes: {
      J4: {
        nerv: { delta: -20, note: "Surmenage du SNS sans recuperation, risque de surentrainement" },
        rec:  { delta: -20, note: "Inflammation chronique si pas de repos intercale" },
      },
      adaptation: {
        met: { base_modifier: 12, note: "Amelioration VO2max et efficacite mitochondriale apres 6-8 semaines" },
      },
    },
    source: "Gibala et al. 2012 (adaptations HIIT), Billat 2001 (physiologie), Costill 1988 (glycogene)",
    incertitude: "faible",
    conditions: [
      "Hormese benefique uniquement avec recuperation complete entre sessions (48-72h minimum)",
      "Contre-indique en cas de dette de sommeil severe (voir synergie danger dans synergies/tensions.ts)",
    ],
  },

  {
    id: "endurance",
    label: "Endurance douce",
    note_ui: "Cout modere. Benefices cardiovasculaires stables.",
    categorie: "physique",
    groupe_exclusif: undefined,
    effets: {
      met:  { delta: -20, immediat: true, note: "Oxydation mixte lipides/glucides selon intensite" },
      nerv: { delta: -10, immediat: true, note: "Activation SNS moderee, parasympathique facilite en fin d'effort" },
      rec:  { delta: -10, immediat: true, note: "Dommages musculaires faibles, inflammation legere" },
    },
    effets_repetes: {
      adaptation: {
        met: { base_modifier: 6, note: "Amelioration de l'economie de course et de l'utilisation des lipides" },
      },
    },
    source: "Coyle 1995 (metabolisme endurance), Laursen & Jenkins 2002 (adaptations aerobies)",
    incertitude: "faible",
    conditions: [],
  },

  {
    id: "marche",
    label: "Marche",
    note_ui: "Quasi-gratuite. Rumination reduite. Dopamine legere.",
    categorie: "physique",
    groupe_exclusif: undefined,
    effets: {
      met:  { delta: -5,  immediat: true, note: "Depense calorique minimale, n'entame pas les reserves glycogene" },
      nerv: { delta: 10,  immediat: true, note: "Reduction du cortisol, dopamine et serotonine legerement augmentees" },
      cog:  { delta: 8,   immediat: true, note: "Reduction de la rumination, creativite augmentee en nature" },
    },
    source: "Oppezzo & Schwartz 2014 (creativite et marche), Aspinall et al. 2015 (nature et cortisol)",
    incertitude: "faible",
    conditions: [
      "Benefices nerveux amplifies en environnement naturel vs urbain",
    ],
  },

  {
    id: "yoga",
    label: "Yoga / mobilite",
    note_ui: "Regulation SNP. Recuperation active facilitee.",
    categorie: "physique",
    groupe_exclusif: undefined,
    effets: {
      nerv: { delta: 15, immediat: true,  note: "Activation parasympathique, reduction cortisol documentee" },
      cog:  { delta: 5,  immediat: true,  note: "Attention et pleine conscience renforcees" },
      rec:  { delta: 10, immediat: true,  note: "Reduction inflammation, amelioration flexibilite et recuperation active" },
    },
    source: "Streeter et al. 2012 (yoga et GABA), Gothe & McAuley 2015 (cognition)",
    incertitude: "modere",
    conditions: [
      "Les effets varient fortement selon le style (yin vs vinyasa) et l'intensite",
    ],
  },

  {
    id: "repos-complet",
    label: "Repos complet",
    note_ui: "Pas de gain d'adaptation. Recuperation maximale.",
    categorie: "physique",
    groupe_exclusif: undefined,
    effets: {
      met:  { delta: 10, immediat: true, note: "Reconstitution des stocks de glycogene" },
      nerv: { delta: 20, immediat: true, note: "Recuperation SNS, normalisation cortisol" },
      rec:  { delta: 25, immediat: true, note: "Reparation cellulaire maximale, reduction inflammation" },
    },
    source: "Mecanisme de recuperation — consensus physiologie du sport",
    incertitude: "faible",
    conditions: [
      "Le gain de repos est maximal apres une periode d'entrainement intense",
      "Repos chronique sans stress produit une decondition progressive (non modele ici)",
    ],
  },

]
