// src/components/profile/ProfileTool.tsx
// Profil personnel Syncognie — visiteur · 2e personne · standalone
// Architecture identique à CharacterSheet v2 — moteur inchangé

import { useState, useMemo } from 'react';

import '../../components/game/CharacterSheet.css';

// ── Avatars PNG (inline base64 — identiques à CharacterSheet) ────────────
const AVATAR_EQUILIBRE = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAEAKADAAQAAAABAAAEAAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgEAAQAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAQP/aAAwDAQACEQMRAD8A/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0P8AP/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9H/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKK++r/gm5+w9efH/wAWf8LK+Jlq8PgnRpBhDkC9nXpGOMso/ibGOwH8K8fMszoYGi6tXr0XV/1+h9tw1wxjs6xiwuEj3cpP4YruX/2O/wBlHxR+0j42GmweZZ+H7EhtRvguRGB0jQ4wXPHpj1Pp/U34Q8HeHPAXhmz8HeFLZbTT9PjEUMa88dzk8lieST1Jr5j/AGU/2UPC/wCzR4RS3tVS81+8UNfahj/WMBwiZ5CA/mep61+gC8cnivxHiHiKeYVOSHw+vV+v6H9u+G/h/TyPDeUqXN7TWXbyv13n/wCk2Eg5OB9KVSAc0gJBz3pVIz7jtX5Gf0wf/9L/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9P/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKAP//Z";
const AVATAR_OUVERT    = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAEAKADAAQAAAABAAAEAAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgEAAQAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAQP/aAAwDAQACEQMRAD8A/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0P8AP/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9H/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z";
const AVATAR_EPUISE    = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAEAKADAAQAAAABAAAEAAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgEAAQAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAQP/aAAwDAQACEQMRAD8A/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0P8AP/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9H/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z";
const AVATAR_TENDU     = "data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAEAKADAAQAAAABAAAEAAAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgEAAQAAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAQP/aAAwDAQACEQMRAD8A/wA/+iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0P8AP/ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//9H/AD/6KKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP//Z";

// ── Types ──────────────────────────────────────────────────────────────────

export type Recommandation = {
  condition: (profile: ComputedProfile) => boolean;
  message: string;
  lien: string;
};

type ChoixInput  = { type: 'choix'; options: string[] };
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
  contrainte?: string;
};

type Categorie = {
  id: string;
  label: string;
  icone: string;
  couleur: string;
  description: string;
  variables: Variable[];
};

type Profil = {
  id: 'moi';
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

// ── Données — profil générique 2e personne ────────────────────────────────

const PROFIL: Profil = {
  id: 'moi',
  categories: [
    {
      id: 'environnement',
      label: 'Environnement',
      icone: '◎',
      couleur: '#2E9E6B',
      description: 'Ce qui s\'est passé aujourd\'hui. Le contexte immédiat qui précède ce moment.',
      variables: [
        {
          id: 'journee',
          label: 'Qualité de votre journée',
          input: { type: 'choix', options: ['Très difficile', 'Chargée', 'Neutre', 'Bonne', 'Excellente'] },
          valeur: 'Neutre',
          description: 'La tonalité globale de la journée imprègne chaque interaction du soir. Une journée chargée n\'efface pas ses effets — elle s\'invite dans le premier échange.',
          source: 'Allostatic load · McEwen',
          influence: ['Seuil émotionnel', 'Réserves disponibles'],
        },
        {
          id: 'charge',
          label: 'Charge émotionnelle',
          input: { type: 'slider', min: 0, max: 100 },
          valeur: 50,
          description: 'Ce que vous portez en ce moment. La charge émotionnelle occupe de la bande passante cognitive — moins il en reste, plus les réactions automatiques prennent le dessus.',
          source: 'Resource depletion · Baumeister',
          influence: ['Capacité d\'écoute', 'Réactivité émotionnelle'],
        },
        {
          id: 'solicitations',
          label: 'Sollicitations sociales',
          input: { type: 'choix', options: ['Isolé·e', 'Standard', 'Surcharge', 'Conflit direct'] },
          valeur: 'Standard',
          description: 'Le volume d\'interactions de la journée. Une surcharge sociale épuise les ressources relationnelles même quand les interactions étaient positives.',
          source: 'Social fatigue · Cain',
          influence: ['Énergie résiduelle', 'Besoin de connexion'],
        },
        {
          id: 'etat_nerveux',
          label: 'État nerveux actuel',
          input: { type: 'slider', min: 0, max: 100 },
          valeur: 55,
          description: 'L\'activation de votre système nerveux en ce moment. Au-delà de 70, vous êtes en zone de réactivité élevée — les décisions viennent du bas du cerveau, pas du cortex préfrontal.',
          source: 'Siegel · Porges · Théorie polyvagale',
          influence: ['Seuil de flooding', 'Fenêtre de tolérance'],
        },
      ],
    },
    {
      id: 'biologie',
      label: 'Biologie',
      icone: '⬡',
      couleur: '#E85D26',
      description: 'Votre état physiologique en ce moment. Ce que la biologie rend possible — ou limite.',
      variables: [
        {
          id: 'energie',
          label: 'Niveau d\'énergie',
          input: { type: 'slider', min: 0, max: 100 },
          valeur: 55,
          description: 'L\'énergie disponible conditionne tout le reste. Pas la motivation — la capacité brute à mobiliser des ressources cognitives et émotionnelles.',
          source: 'Théorie polyvagale · Porges',
          influence: ['Patience disponible', 'Options accessibles'],
        },
        {
          id: 'cortisol',
          label: 'Charge cortisolique',
          input: { type: 'slider', min: 0, max: 100 },
          valeur: 50,
          description: 'Le cortisol accumulé depuis le matin rétrécit votre fenêtre de tolérance avant même le premier mot échangé. Il se dissipe lentement — une mauvaise journée en laisse des traces le soir.',
          source: 'Sapolsky · Biologie du stress',
          influence: ['Fenêtre de tolérance', 'Interprétation des signaux'],
        },
        {
          id: 'bhb',
          label: 'Taux de BHB',
          input: { type: 'calcule' },
          valeur: 0,
          description: 'Calculé depuis votre alimentation et le timing du dernier repas. Incompatible avec une glycémie élevée — le corps ne peut pas être en cétose et en hyperglycémie simultanément.',
          source: 'Veech · Newport · Métabolisme cérébral',
          influence: ['Clarté mentale', 'Stabilité émotionnelle'],
          contrainte: 'BHB élevé incompatible avec glycémie haute. Se déduit de l\'orientation alimentaire et du jeûne.',
        },
        {
          id: 'bdnf',
          label: 'BDNF',
          input: { type: 'calcule' },
          valeur: 0,
          description: 'Calculé depuis votre activité physique du jour. La molécule de la plasticité cérébrale — stimulée par l\'exercice aérobique. Elle détermine votre capacité à sortir des patterns automatiques.',
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
      description: 'La fondation invisible. La régulation émotionnelle, la résilience et la capacité d\'écoute reposent toutes dessus.',
      variables: [
        {
          id: 'duree_sommeil',
          label: 'Durée cette nuit',
          input: { type: 'choix', options: ['< 5h', '5–6h', '6–7h', '7–8h', '> 8h'] },
          valeur: '6–7h',
          description: 'Pas suffisant, pas réparateur. Vous fonctionnerez — mais les marges sont étroites. La différence entre 6h et 8h n\'est pas la fatigue : c\'est la réactivité de l\'amygdale.',
          source: 'Walker · Pourquoi nous dormons',
          influence: ['Régulation émotionnelle', 'Réactivité de l\'amygdale'],
        },
        {
          id: 'qualite_sommeil',
          label: 'Qualité du sommeil',
          input: { type: 'choix', options: ['Agitée', 'Fragmentée', 'Correcte', 'Profonde', 'Excellente'] },
          valeur: 'Correcte',
          description: 'La quantité ne dit pas tout. Une nuit fragmentée de 7h laisse moins de ressources qu\'une nuit profonde de 6h. La consolidation en sommeil profond restaure la régulation émotionnelle.',
          source: 'Walker · Dement',
          influence: ['Tolérance à la frustration', 'Empathie disponible'],
        },
        {
          id: 'dette_sommeil',
          label: 'Dette de sommeil',
          input: { type: 'calcule' },
          valeur: 0,
          description: 'Calculée depuis la durée et la qualité. L\'accumulation sur les derniers jours rétrécit durablement votre fenêtre de tolérance — et s\'efface beaucoup plus lentement qu\'elle ne s\'installe.',
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
      description: 'Ce que vous avez mangé aujourd\'hui. Le cerveau est un organe — il réagit à ce qu\'on lui donne.',
      variables: [
        {
          id: 'orientation_alim',
          label: 'Orientation alimentaire',
          input: { type: 'choix', options: ['Jeûne intermittent', 'Pauvre en glucides', 'Équilibrée', 'Riche en glucides', 'Végétalien'] },
          valeur: 'Équilibrée',
          description: 'Votre orientation habituelle compte autant que le repas du jour — un corps adapté au jeûne gère l\'absence de nourriture différemment d\'un métabolisme glucido-dépendant.',
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
          description: 'Une glycémie instable — pics et chutes — produit des variations d\'humeur que vous attribuez souvent à la situation ou aux autres. Stabiliser la glycémie, c\'est stabiliser l\'humeur.',
          source: 'Perlmutter · Grain Brain',
          influence: ['Irritabilité', 'Stabilité émotionnelle'],
          contrainte: 'Glycémie élevée incompatible avec BHB élevé — ajuster l\'un modifie l\'autre.',
        },
        {
          id: 'hydratation',
          label: 'Hydratation',
          input: { type: 'choix', options: ['Très faible', 'Faible', 'Correcte', 'Bonne'] },
          valeur: 'Correcte',
          description: 'Une déshydratation légère — 1 à 2% — dégrade la concentration, amplifie la fatigue perçue et augmente la réactivité émotionnelle. Souvent invisible jusqu\'à ce que le résultat soit là.',
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
          description: 'Votre niveau de base détermine la récupération. Un sportif régulier récupère du stress plus vite — son système nerveux autonome est mieux entraîné.',
          source: 'Ratey · Spark · McEwen',
          influence: ['Résilience au stress', 'Fenêtre de tolérance baseline'],
        },
        {
          id: 'activite_aujourd_hui',
          label: 'Activité aujourd\'hui',
          input: { type: 'choix', options: ['Aucune', 'Marche / léger', 'Modérée', 'Intense'] },
          valeur: 'Marche / léger',
          description: 'Ce que vous avez fait aujourd\'hui. Un effort intense récent élève encore le cortisol — mais passé 3h, l\'effet s\'inverse et devient parasympathique.',
          source: 'Ratey · Sapolsky',
          influence: ['Cortisol actuel', 'BDNF', 'État nerveux'],
        },
        {
          id: 'timing_activite',
          label: 'Il y a combien de temps',
          input: { type: 'choix', options: ['< 2h', '2–4h', '> 4h', 'Non applicable'] },
          valeur: '> 4h',
          description: 'Le timing de l\'activité change tout. Juste après un effort intense, le cortisol est encore haut. Passé quelques heures, c\'est l\'inverse — calme et clarté.',
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
      description: 'L\'histoire longue. Ce qui s\'est construit en années et qui entre dans chaque interaction sans être nommé.',
      variables: [
        {
          id: 'attachement',
          label: 'Style d\'attachement',
          input: { type: 'choix', options: ['Sécure', 'Anxieux', 'Évitant', 'Désorganisé'] },
          valeur: 'Sécure',
          description: 'Votre style d\'attachement oriente la façon dont vous lisez les signaux relationnels et répondez à la tension. Ce n\'est pas une étiquette fixe — il se modifie avec le travail intérieur.',
          source: 'Bowlby · Ainsworth · Johnson · EFT',
          influence: ['Réponse au conflit', 'Choix disponibles', 'Réparation possible'],
        },
        {
          id: 'fenetre_tolerance',
          label: 'Fenêtre de tolérance',
          input: { type: 'calcule' },
          valeur: 0,
          description: 'Calculée depuis l\'état nerveux, le sommeil, la charge et l\'attachement. L\'amplitude de la zone où vous pouvez penser et ressentir en même temps. En dehors : soit vous vous emballez, soit vous vous fermez.',
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
          description: 'Les patterns cognitivo-émotionnels formés tôt. Quand le schéma se déclenche, vous réagissez à une situation passée, pas à ce qui se passe maintenant.',
          source: 'Young · Thérapie des schémas',
          influence: ['Déclencheurs émotionnels', 'Défenses automatiques'],
        },
      ],
    },
  ],
};

// ── Catalogue de recommandations par défaut ───────────────────────────────

const RECOMMANDATIONS_DEFAULT: Recommandation[] = [
  {
    condition: (p) => p.ressources < 40,
    message:
      'Vos ressources sont basses en ce moment. Avant d\'engager une conversation difficile, un temps de récupération — même court — peut changer le registre disponible.',
    lien: '/sous-la-surface/recuperation',
  },
  {
    condition: (p) => p.regulation < 45,
    message:
      'La régulation émotionnelle est fragilisée. C\'est souvent ici que les réactions automatiques prennent le dessus. Quelques pistes pour élargir la fenêtre avant d\'agir.',
    lien: '/sous-la-surface/regulation',
  },
  {
    condition: (p) => p.disponibilite > 65,
    message:
      'Vous êtes en bonne disponibilité relationnelle en ce moment. C\'est une fenêtre pour les conversations qui comptent — ou pour aller vers quelqu\'un.',
    lien: '/sous-la-surface/communication',
  },
];

// ── Avatar & helpers ──────────────────────────────────────────────────────

function selectAvatar(profile: ComputedProfile): string {
  const { ressources, etatNerveux, disponibilite, fenetreTolerance } = profile;
  if (ressources < 30 || etatNerveux > 80) return AVATAR_EPUISE;
  if (etatNerveux > 60 || fenetreTolerance < 40) return AVATAR_TENDU;
  if (disponibilite > 65 && ressources > 55) return AVATAR_OUVERT;
  return AVATAR_EQUILIBRE;
}

function selectAvatarLabel(profile: ComputedProfile): string {
  const { ressources, etatNerveux, disponibilite, fenetreTolerance } = profile;
  if (ressources < 30 || etatNerveux > 80) return 'Épuisé·e';
  if (etatNerveux > 60 || fenetreTolerance < 40) return 'Tendu·e';
  if (disponibilite > 65 && ressources > 55) return 'Ouvert·e';
  return 'Équilibré·e';
}

// ── Moteur de calcul (inchangé vs CharacterSheet) ─────────────────────────

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

type MetabolicState = {
  glycemieLabel: string;
  glycemieScore: number;
  bhbLabel: string;
  bhbScore: number;
  bdnfScore: number;
};

function computeMetabolism(vals: Record<string, string | number>): MetabolicState {
  const orientation = (vals['orientation_alim'] as string) ?? 'Équilibrée';
  const repas       = (vals['dernier_repas'] as string) ?? '1–3h';
  const activite    = (vals['activite_aujourd_hui'] as string) ?? 'Aucune';
  const timing      = (vals['timing_activite'] as string) ?? 'Non applicable';
  const niveau      = (vals['niveau_activite'] as string) ?? 'Actif au quotidien';

  const glycBase: Record<string, number> = {
    'Jeûne intermittent': 30, 'Pauvre en glucides': 35,
    'Équilibrée': 55, 'Riche en glucides': 72, 'Végétalien': 60,
  };
  let glycScore = glycBase[orientation] ?? 55;

  if (repas === '< 1h')             glycScore = Math.min(95, glycScore + 20);
  else if (repas === '1–3h')        glycScore = Math.min(85, glycScore + 8);
  else if (repas === '3–6h')        glycScore = Math.max(20, glycScore - 5);
  else if (repas === '> 6h (jeûne)') glycScore = Math.max(15, glycScore - 25);

  if (activite === 'Intense' && (timing === '< 2h' || timing === '2–4h'))
    glycScore = Math.max(20, glycScore - 18);
  else if (activite === 'Modérée' && timing !== 'Non applicable')
    glycScore = Math.max(25, glycScore - 8);

  glycScore = Math.round(Math.max(10, Math.min(100, glycScore)));

  let glycemieLabel = 'Stable';
  if      (glycScore < 30) glycemieLabel = 'Basse';
  else if (glycScore < 55) glycemieLabel = 'Stable';
  else if (glycScore < 75) glycemieLabel = 'Élevée';
  else                     glycemieLabel = 'Pic post-repas';

  const adapteKeto  = orientation === 'Jeûne intermittent' || orientation === 'Pauvre en glucides';
  const enJeune     = repas === '> 6h (jeûne)';
  const glycemieBasse = glycScore < 40;

  let bhbScore = 0;
  if      (glycemieBasse && adapteKeto)  bhbScore = enJeune ? 75 : 45;
  else if (glycemieBasse && !adapteKeto) bhbScore = enJeune ? 30 : 10;
  else if (glycScore < 55 && adapteKeto) bhbScore = 25;
  else                                   bhbScore = 5;

  bhbScore = Math.round(Math.max(0, Math.min(100, bhbScore)));

  let bhbLabel = 'Nul';
  if      (bhbScore < 10) bhbLabel = 'Nul';
  else if (bhbScore < 35) bhbLabel = 'Trace';
  else if (bhbScore < 65) bhbLabel = 'Modéré';
  else                    bhbLabel = 'Élevé';

  const bdnfBase: Record<string, number> = {
    'Aucune': 25, 'Marche / léger': 45, 'Modérée': 65, 'Intense': 80,
  };
  let bdnfScore = bdnfBase[activite] ?? 30;

  if      (niveau === 'Sportif régulier') bdnfScore = Math.min(100, bdnfScore + 12);
  else if (niveau === 'Sédentaire')       bdnfScore = Math.max(10,  bdnfScore - 8);

  if (activite !== 'Aucune') {
    if      (timing === '< 2h')  bdnfScore = Math.round(bdnfScore * 0.9);
    else if (timing === '2–4h') bdnfScore = Math.min(100, bdnfScore + 5);
    else if (timing === '> 4h') bdnfScore = Math.round(bdnfScore * 0.75);
  }
  if (bhbScore > 40) bdnfScore = Math.min(100, bdnfScore + 8);
  bdnfScore = Math.round(Math.max(10, Math.min(100, bdnfScore)));

  return { glycemieLabel, glycemieScore: glycScore, bhbLabel, bhbScore, bdnfScore };
}

function computeProfile(vals: Record<string, string | number>): ComputedProfile {
  const g = (id: string) => vals[id];
  const metab = computeMetabolism(vals);

  const dureeSommeil  = scoreDuree(g('duree_sommeil') as string);
  const qualiteSommeil = scoreQualite(g('qualite_sommeil') as string);
  const sommeilScore  = dureeSommeil * 0.6 + qualiteSommeil * 0.4;

  const etatNerveux  = Number(g('etat_nerveux') ?? 55);
  const charge       = Number(g('charge') ?? 50);
  const attachement  = (g('attachement') as string) ?? 'Sécure';

  const attachMod: Record<string, number> = { 'Sécure': 15, 'Anxieux': -5, 'Évitant': -10, 'Désorganisé': -20 };
  const attMod = attachMod[attachement] ?? 0;

  const activite = (g('activite_aujourd_hui') as string) ?? 'Aucune';
  const timing   = (g('timing_activite') as string) ?? 'Non applicable';
  let activiteMod = 0;
  if      (activite === 'Intense')      activiteMod = timing === '< 2h' ? 8 : timing === '2–4h' ? -2 : -8;
  else if (activite === 'Modérée')      activiteMod = timing === '< 2h' ? 2 : -5;
  else if (activite === 'Marche / léger') activiteMod = -3;

  const age   = (g('tranche_age') as string) ?? '26–35';
  const ageMod: Record<string, number> = { '18–25': 8, '26–35': 2, '36–45': 0, '46–55': -5, '55+': -8 };
  const aM = ageMod[age] ?? 0;

  const fenetreRaw = sommeilScore * 0.35
    + (100 - etatNerveux) * 0.30
    + (100 - charge) * 0.20
    + attMod + aM - activiteMod * 0.3;
  const fenetreTolerance = Math.max(5, Math.min(100, Math.round(fenetreRaw)));

  const hydratation = (g('hydratation') as string) ?? 'Correcte';
  const hydMod: Record<string, number> = { 'Très faible': -12, 'Faible': -6, 'Correcte': 0, 'Bonne': 4 };
  const hM = hydMod[hydratation] ?? 0;

  const glycMod: Record<string, number> = { 'Basse': -8, 'Stable': 2, 'Élevée': -5, 'Pic post-repas': -10 };
  const gM = glycMod[metab.glycemieLabel] ?? 0;

  const bhbBonus  = metab.bhbScore > 40 ? 6 : metab.bhbScore > 20 ? 2 : 0;
  const bdnfBonus = metab.bdnfScore > 65 ? 5 : metab.bdnfScore > 45 ? 2 : 0;

  const energieSaisie  = Number(g('energie') ?? 0);
  const energieEstimee = (100 - etatNerveux * 0.4 - charge * 0.35 + sommeilScore * 0.25 + aM);
  const energieBase    = energieSaisie > 0 ? energieSaisie : energieEstimee;

  const ressourcesRaw = energieBase + gM + hM + bhbBonus;
  const ressources    = Math.max(5, Math.min(100, Math.round(ressourcesRaw)));

  const mentalisation = Number(g('mentalisation') ?? 65);
  const resilience    = Number(g('resilience') ?? 60);
  const regulationRaw = fenetreTolerance * 0.45 + mentalisation * 0.30 + resilience * 0.25 + bdnfBonus;
  const regulation    = Math.max(5, Math.min(100, Math.round(regulationRaw)));

  const disponibiliteRaw = regulation * 0.45 + ressources * 0.30 + fenetreTolerance * 0.25 + attMod * 0.5;
  const disponibilite    = Math.max(5, Math.min(100, Math.round(disponibiliteRaw)));

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
      ressources:   label(ressources,   [[25,'Épuisées'],[45,'Faibles'],[65,'Limitées'],[80,'Correctes'],[100,'Disponibles']]),
      regulation:   label(regulation,   [[25,'Effondrée'],[45,'Fragile'],[65,'Tenue'],[80,'Stable'],[100,'Solide']]),
      disponibilite:label(disponibilite,[[25,'Fermée'],[45,'Limitée'],[65,'Partielle'],[80,'Présente'],[100,'Ouverte']]),
    },
    _metab: metab,
  } as ComputedProfile & { _metab: MetabolicState };
}

function applyConstraints(
  vals: Record<string, string | number>,
  changedId: string,
  newVal: string | number
): Record<string, string | number> {
  return { ...vals, [changedId]: newVal };
}

function initValues(profil: Profil): Record<string, string | number> {
  return Object.fromEntries(profil.categories.flatMap(c => c.variables.map(v => [v.id, v.valeur])));
}

function getCompletion(cat: Categorie, vals: Record<string, string | number>): number {
  const interactives = cat.variables.filter(v => v.input.type !== 'calcule');
  if (!interactives.length) return 0;
  const filled = interactives.filter(v => vals[v.id] !== undefined && vals[v.id] !== '').length;
  return Math.round((filled / interactives.length) * 100);
}

// ── Sous-composants ───────────────────────────────────────────────────────

function Jauge({ label, value, labelQual, couleur }: { label: string; value: number; labelQual: string; couleur: string }) {
  return (
    <div className="cs-jauge">
      <div className="cs-jauge-hd">
        <span className="cs-jauge-label">{label}</span>
        <span className="cs-jauge-qual" style={{ color: couleur }}>{labelQual}</span>
      </div>
      <div className="cs-jauge-track">
        <div className="cs-jauge-fill" style={{ width: `${Math.round(value)}%`, background: couleur }} />
      </div>
    </div>
  );
}

function ProfileAvatar({ profile }: { profile: ComputedProfile }) {
  const src   = selectAvatar(profile);
  const label = selectAvatarLabel(profile);
  const badgeColor: Record<string, string> = {
    'Épuisé·e': '#8A8478', 'Tendu·e': '#C0394B',
    'Ouvert·e': '#2E9E6B', 'Équilibré·e': '#4a7fa5',
  };
  const color = badgeColor[label] ?? '#4a7fa5';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.4rem' }}>
      <img src={src} alt={label} style={{ width: 80, height: 80, objectFit: 'contain', transition: 'opacity .4s ease', borderRadius: 4 }} />
      <span style={{ fontSize: '.62rem', fontWeight: 600, letterSpacing: '.1em', textTransform: 'uppercase', color, fontFamily: "'DM Mono', monospace" }}>
        {label}
      </span>
    </div>
  );
}

// ── Bloc Recommandations ─────────────────────────────────────────────────

function BlockRecommandations({ profile, catalogue }: { profile: ComputedProfile; catalogue: Recommandation[] }) {
  const actives = catalogue.filter(r => r.condition(profile));
  if (!actives.length) return null;

  return (
    <div style={{
      background: 'white',
      borderRadius: 8,
      border: '1px solid #E8E2D8',
      borderTop: '3px solid #5B6FE0',
      padding: '1rem 1.2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '.7rem',
    }}>
      <div style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#5B6FE0' }}>
        Recommandations
      </div>
      {actives.map((r, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '.3rem' }}>
          <p style={{ fontSize: '.72rem', fontWeight: 300, color: '#4A4438', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
            {r.message}
          </p>
          <a
            href={r.lien}
            style={{ fontSize: '.68rem', color: '#5B6FE0', textDecoration: 'none', fontFamily: "'DM Mono', monospace", fontWeight: 400 }}
          >
            Lire l'article →
          </a>
        </div>
      ))}
    </div>
  );
}

// ── Presets ───────────────────────────────────────────────────────────────

type Preset = {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  overrides: Partial<Record<string, string | number>>;
};

const PRESETS: Preset[] = [
  {
    id: 'charge',
    label: 'Moment chargé',
    emoji: '⬡',
    desc: 'Vous arrivez chargé·e. Fenêtre étroite, risque de réactivité.',
    overrides: {
      journee: 'Très difficile', charge: 82, etat_nerveux: 76,
      duree_sommeil: '5–6h', qualite_sommeil: 'Agitée',
      orientation_alim: 'Riche en glucides', dernier_repas: '< 1h',
      activite_aujourd_hui: 'Aucune', timing_activite: 'Non applicable',
      resilience: 40, mentalisation: 45,
    },
  },
  {
    id: 'ordinaire',
    label: 'Moment ordinaire',
    emoji: '◎',
    desc: 'Journée standard, ressources moyennes. La plupart des soirées.',
    overrides: {
      journee: 'Chargée', charge: 58, etat_nerveux: 55,
      duree_sommeil: '6–7h', qualite_sommeil: 'Correcte',
      orientation_alim: 'Équilibrée', dernier_repas: '1–3h',
      activite_aujourd_hui: 'Marche / léger', timing_activite: '> 4h',
      resilience: 60, mentalisation: 65,
    },
  },
  {
    id: 'favorable',
    label: 'Bon moment',
    emoji: '◉',
    desc: 'Bonnes conditions physiologiques. Le lien est possible.',
    overrides: {
      journee: 'Bonne', charge: 30, etat_nerveux: 32,
      duree_sommeil: '7–8h', qualite_sommeil: 'Profonde',
      orientation_alim: 'Pauvre en glucides', dernier_repas: '3–6h',
      activite_aujourd_hui: 'Modérée', timing_activite: '2–4h',
      resilience: 75, mentalisation: 78,
    },
  },
];

// ── Composant principal ───────────────────────────────────────────────────

type Props = {
  catalogue?: Recommandation[];
};

export default function ProfileTool({ catalogue }: Props) {
  const catalogueActif = catalogue ?? RECOMMANDATIONS_DEFAULT;

  const [catId,       setCatId]       = useState('environnement');
  const [varId,       setVarId]       = useState<string>('journee');
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [values,      setValues]      = useState<Record<string, string | number>>(initValues(PROFIL));

  const cat       = PROFIL.categories.find(c => c.id === catId) ?? PROFIL.categories[0];
  const varActive = cat.variables.find(v => v.id === varId) ?? cat.variables[0];
  const couleur   = cat.couleur;

  const profile = useMemo(() => computeProfile(values), [values]);

  const valsWithCalc = useMemo(() => {
    const v = { ...values };
    const m = profile._metab;
    v['dette_sommeil']     = scoreDetteSommeil(v['duree_sommeil'] as string, v['qualite_sommeil'] as string);
    v['fenetre_tolerance'] = profile.fenetreTolerance;
    if (m) {
      v['glycemie'] = m.glycemieLabel;
      v['bhb']      = m.bhbScore;
      v['bdnf']     = m.bdnfScore;
    }
    return v;
  }, [values, profile]);

  function setVal(vid: string, val: string | number) {
    const constrained = applyConstraints(values, vid, val);
    setValues(constrained);
  }

  function getVal(vid: string): string | number {
    return valsWithCalc[vid] ?? '';
  }

  function switchCat(cid: string) {
    const c = PROFIL.categories.find(x => x.id === cid)!;
    setCatId(cid);
    setVarId(c.variables[0].id);
  }

  function applyPreset(preset: Preset) {
    setActivePreset(preset.id);
    setValues(prev => ({ ...prev, ...preset.overrides }));
  }

  return (
    <div className="cs-root">

      {/* ── Titre ── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: "'Lora', serif", fontSize: '1.15rem', fontWeight: 600, color: '#1C1811', margin: 0, marginBottom: '.25rem' }}>
          Mon profil · en ce moment
        </h1>
        <p style={{ fontSize: '.75rem', fontWeight: 300, color: '#6A6258', fontStyle: 'italic', margin: 0 }}>
          Ajustez les paramètres — le profil se recalcule en temps réel.
        </p>
      </div>

      {/* ── Presets rapides ── */}
      <div style={{ display: 'flex', gap: '.6rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: '#A89880', marginRight: '.25rem' }}>
          Contexte
        </span>
        {PRESETS.map(p => (
          <button
            key={p.id}
            title={p.desc}
            onClick={() => applyPreset(p)}
            style={{
              display: 'flex', alignItems: 'center', gap: '.4rem',
              padding: '.42rem .9rem',
              border: `1.5px solid ${activePreset === p.id ? '#4a7fa5' : '#D8D2C8'}`,
              borderRadius: '20px',
              background: activePreset === p.id ? '#4a7fa5' : 'white',
              color: activePreset === p.id ? '#F7F4EF' : '#4A4438',
              fontSize: '.72rem', fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer', transition: 'all .18s',
              fontWeight: activePreset === p.id ? 500 : 400,
              boxShadow: activePreset === p.id ? '0 2px 8px rgba(74,127,165,.25)' : 'none',
            }}
          >
            <span style={{ fontSize: '.8rem' }}>{p.emoji}</span>
            {p.label}
          </button>
        ))}
        {activePreset && (
          <button
            onClick={() => { setActivePreset(null); setValues(initValues(PROFIL)); }}
            style={{
              padding: '.4rem .75rem',
              border: '1.5px solid #D8D2C8', borderRadius: '20px',
              background: 'transparent', color: '#8A8478',
              fontSize: '.68rem', fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            }}
          >
            ↺ Réinitialiser
          </button>
        )}
      </div>

      {/* ── Layout 3 colonnes ── */}
      <div className="cs-layout">

        {/* ── Gauche : catégories ── */}
        <aside className="cs-nav">
          <div className="cs-nav-label">Catégories</div>
          {PROFIL.categories.map(c => {
            const comp    = getCompletion(c, values);
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
              const estSel    = v.id === varId;
              const estCalcule = v.input.type === 'calcule';
              const val       = getVal(v.id);

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
                      {v.id === 'glycemie'  ? (profile._metab?.glycemieLabel ?? '—')
                        : v.id === 'bhb'   ? `${profile._metab?.bhbLabel ?? '—'} · ${profile._metab?.bhbScore ?? 0}/100`
                        : v.id === 'bdnf'  ? `${profile._metab?.bdnfScore ?? 0}/100`
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
            <div className="cs-detail-cat" style={{ color: couleur }}>{cat.label}</div>
            <div className="cs-detail-titre">{varActive.label}</div>
            <p className="cs-detail-desc">{varActive.description}</p>

            <div className="cs-detail-bloc">
              <div className="cs-detail-bloc-label">Source</div>
              <div className="cs-detail-bloc-val">{varActive.source}</div>
            </div>

            {varActive.influence.length > 0 && (
              <div className="cs-detail-bloc">
                <div className="cs-detail-bloc-label">Ce que ça influence</div>
                <div className="cs-detail-tags">
                  {varActive.influence.map(tag => (
                    <span key={tag} className="cs-tag"
                      style={{ borderColor: `${couleur}55`, color: couleur, background: `${couleur}12` }}>
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
              <span className="cs-profil-titre">Mon profil · en ce moment</span>
              <span className="cs-profil-subtitle">se recalcule en temps réel</span>
            </div>

            <ProfileAvatar profile={profile} />

            <div className="cs-jauges">
              <Jauge label="Ressources"   value={profile.ressources}   labelQual={profile.labels.ressources}   couleur="#E85D26" />
              <Jauge label="Régulation"   value={profile.regulation}   labelQual={profile.labels.regulation}   couleur="#5B6FE0" />
              <Jauge label="Disponibilité" value={profile.disponibilite} labelQual={profile.labels.disponibilite} couleur="#2E9E6B" />
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
          </div>

          {/* Recommandations dynamiques */}
          <BlockRecommandations profile={profile} catalogue={catalogueActif} />

        </aside>
      </div>
    </div>
  );
}
