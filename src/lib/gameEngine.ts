// src/lib/gameEngine.ts
// Moteur narratif pondéré — logique pure, zéro UI

export type Stats = {
  amour: number;
  confiance: number;
  tension: number;
  rancœur: number;
  distance: number;
  desirDeParler: number;
  risqueRupture: number;
};

export type GameState = {
  stats: Stats;
  sceneId: string;
  tags: string[];
  conceptsDebloques: string[];
  historique: HistoriqueEntry[];
  termine: boolean;
  finId?: string;
};

export type HistoriqueEntry = {
  sceneId: string;
  sceneTitre: string;
  choixId: string;
  choixLabel: string;
  consequence: string;
  conceptDeclenche?: string;
  deltaStats: Partial<Stats>;
};

// ── Types données JSON ──────────────────────────────────────────────────────

type Condition = {
  si: Record<string, { gte?: number; lte?: number } | string[]>;
  alors: Partial<Stats>;
  narrateur?: string;
};

type ChoixEffets = {
  base: Partial<Stats>;
  conditions?: Condition[];
  tags?: string[];
};

type Choix = {
  id: string;
  label: string;
  texte: string;
  effets: ChoixEffets;
  consequence: string;
  sceneSuivante: string;
};

type ConditionEntree = {
  si: Record<string, unknown>;
  narrateur: string;
  versFinDirecte: string;
};

type Scene = {
  id: string;
  titre: string;
  acte: number;
  narrateur: string;
  signal: string;
  conceptDeclenche?: string;
  conditionsEntree?: ConditionEntree[];
  choix: Choix[];
};

type Fin = {
  id: string;
  titre: string;
  type: 'positive' | 'neutre' | 'negative';
  texte: string;
  conceptFinal?: string;
  messageJoueur: string;
};

type GameData = {
  statsInitiales: Stats;
  scenes: Scene[];
  fins: Record<string, Fin>;
};

// ── Initialisation ──────────────────────────────────────────────────────────

export function initGame(data: GameData): GameState {
  return {
    stats: { ...data.statsInitiales },
    sceneId: data.scenes[0].id,
    tags: [],
    conceptsDebloques: [],
    historique: [],
    termine: false,
  };
}

// ── Résolution d'un choix ───────────────────────────────────────────────────

export type ChoixResult = {
  nouvelEtat: GameState;
  deltaStats: Partial<Stats>;
  narrateurConditionnel?: string;
  finDirecte?: string;
};

export function appliquerChoix(
  state: GameState,
  scene: Scene,
  choix: Choix,
  data: GameData
): ChoixResult {
  let delta: Partial<Stats> = { ...choix.effets.base };
  let narrateurConditionnel: string | undefined;

  // Évaluer les conditions
  if (choix.effets.conditions) {
    for (const condition of choix.effets.conditions) {
      if (evaluerCondition(condition.si, state)) {
        // Fusionner les effets conditionnels (ils s'additionnent à la base)
        for (const [key, val] of Object.entries(condition.alors)) {
          const k = key as keyof Stats;
          delta[k] = (delta[k] ?? 0) + (val as number);
        }
        if (condition.narrateur) {
          narrateurConditionnel = condition.narrateur;
        }
      }
    }
  }

  // Appliquer le delta aux stats
  const nouvellesStats = appliquerDelta(state.stats, delta);

  // Calculer le risque de rupture (stat dérivée)
  nouvellesStats.risqueRupture = calculerRisqueRupture(nouvellesStats);

  // Mettre à jour les tags
  const nouveauxTags = [...state.tags];
  if (choix.effets.tags) {
    for (const tag of choix.effets.tags) {
      if (!nouveauxTags.includes(tag)) nouveauxTags.push(tag);
    }
  }

  // Débloquer le concept de la scène
  const nouveauxConcepts = [...state.conceptsDebloques];
  if (scene.conceptDeclenche && !nouveauxConcepts.includes(scene.conceptDeclenche)) {
    nouveauxConcepts.push(scene.conceptDeclenche);
  }

  // Entrée dans l'historique
  const entreeHistorique: HistoriqueEntry = {
    sceneId: scene.id,
    sceneTitre: scene.titre,
    choixId: choix.id,
    choixLabel: choix.label,
    consequence: choix.consequence,
    conceptDeclenche: scene.conceptDeclenche,
    deltaStats: delta,
  };

  // Déterminer la scène suivante et vérifier les fins
  const sceneIdSuivante = choix.sceneSuivante;
  let termine = false;
  let finId: string | undefined;
  let finDirecte: string | undefined;

  // Vérifier si la scène suivante est une fin
  if (data.fins[sceneIdSuivante]) {
    termine = true;
    finId = sceneIdSuivante;
  } else {
    // Vérifier les conditions d'entrée de la scène suivante
    const sceneSuivante = data.scenes.find(s => s.id === sceneIdSuivante);
    if (sceneSuivante?.conditionsEntree) {
      for (const ce of sceneSuivante.conditionsEntree) {
        if (evaluerConditionEntree(ce.si, { ...state, tags: nouveauxTags })) {
          finDirecte = ce.versFinDirecte;
          termine = true;
          finId = ce.versFinDirecte;
          break;
        }
      }
    }
  }

  const nouvelEtat: GameState = {
    stats: nouvellesStats,
    sceneId: termine ? (finId ?? sceneIdSuivante) : sceneIdSuivante,
    tags: nouveauxTags,
    conceptsDebloques: nouveauxConcepts,
    historique: [...state.historique, entreeHistorique],
    termine,
    finId,
  };

  return { nouvelEtat, deltaStats: delta, narrateurConditionnel, finDirecte };
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function evaluerCondition(
  si: Record<string, { gte?: number; lte?: number } | string[]>,
  state: GameState
): boolean {
  for (const [key, rule] of Object.entries(si)) {
    if (key === 'tags' && Array.isArray(rule)) {
      // Vérifie qu'au moins un tag de la liste est présent
      if (!rule.some(t => state.tags.includes(t))) return false;
    } else {
      const statVal = state.stats[key as keyof Stats];
      if (statVal === undefined) continue;
      const r = rule as { gte?: number; lte?: number };
      if (r.gte !== undefined && statVal < r.gte) return false;
      if (r.lte !== undefined && statVal > r.lte) return false;
    }
  }
  return true;
}

function evaluerConditionEntree(
  si: Record<string, unknown>,
  state: GameState
): boolean {
  for (const [key, val] of Object.entries(si)) {
    if (key === 'tags' && Array.isArray(val)) {
      if (!val.some(t => state.tags.includes(t))) return false;
    }
  }
  return true;
}

function appliquerDelta(stats: Stats, delta: Partial<Stats>): Stats {
  const result = { ...stats };
  for (const [key, val] of Object.entries(delta)) {
    const k = key as keyof Stats;
    result[k] = Math.max(0, Math.min(100, (result[k] ?? 0) + (val as number)));
  }
  return result;
}

function calculerRisqueRupture(stats: Stats): number {
  // Formule dérivée : la tension et la rancœur poussent vers la rupture,
  // l'amour et la confiance en éloignent
  const pression = (stats.tension * 0.3) + (stats.rancœur * 0.3) + (stats.distance * 0.2);
  const protection = (stats.amour * 0.25) + (stats.confiance * 0.25);
  return Math.max(0, Math.min(100, Math.round(pression - protection + 30)));
}

// ── Accesseurs ───────────────────────────────────────────────────────────────

export function getSceneActuelle(state: GameState, data: GameData): Scene | undefined {
  return data.scenes.find(s => s.id === state.sceneId);
}

export function getFinActuelle(state: GameState, data: GameData): Fin | undefined {
  if (!state.finId) return undefined;
  return data.fins[state.finId];
}

export function getStatLabel(key: keyof Stats): string {
  const labels: Record<keyof Stats, string> = {
    amour: 'Amour',
    confiance: 'Confiance',
    tension: 'Tension',
    rancœur: 'Rancœur',
    distance: 'Distance',
    desirDeParler: 'Désir de parler',
    risqueRupture: 'Risque rupture',
  };
  return labels[key];
}

export function getStatIsNegative(key: keyof Stats): boolean {
  return ['tension', 'rancœur', 'distance', 'risqueRupture'].includes(key);
}
