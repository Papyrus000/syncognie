// src/components/game/GameShell.tsx
// Composant racine du mode jeu — état central + UI complète

import { useState, useReducer, useEffect, useRef } from 'react';
import './GameShell.css';
import {
  initGame,
  appliquerChoix,
  getSceneActuelle,
  getFinActuelle,
  getStatLabel,
  getStatIsNegative,
  type GameState,
  type Stats,
} from '../../lib/gameEngine';

// ── Types ────────────────────────────────────────────────────────────────────

type GameData = {
  titre: string;
  accroche: string;
  scenes: any[];
  fins: Record<string, any>;
  statsInitiales: Stats;
  conceptsJeu: Record<string, { nom: string; court: string; icone: string }>;
};

type Props = {
  data: GameData;
};

type Phase = 'intro' | 'jeu' | 'fin';

// ── Reducer ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'CHOISIR'; choixId: string; data: GameData }
  | { type: 'RESET'; data: GameData };

type FullState = {
  game: GameState;
  lastDelta: Partial<Stats>;
  lastConsequence: string;
  lastConcept: string | undefined;
  lastNarrateur: string | undefined;
  animatingStats: Set<string>;
};

function reducer(state: FullState, action: Action): FullState {
  if (action.type === 'RESET') {
    return {
      game: initGame(action.data),
      lastDelta: {},
      lastConsequence: '',
      lastConcept: undefined,
      lastNarrateur: undefined,
      animatingStats: new Set(),
    };
  }

  if (action.type === 'CHOISIR') {
    const scene = action.data.scenes.find(
      (s: any) => s.id === state.game.sceneId
    );
    if (!scene) return state;

    const choix = scene.choix.find((c: any) => c.id === action.choixId);
    if (!choix) return state;

    const result = appliquerChoix(state.game, scene, choix, action.data);

    return {
      game: result.nouvelEtat,
      lastDelta: result.deltaStats,
      lastConsequence: choix.consequence,
      lastConcept: scene.conceptDeclenche,
      lastNarrateur: result.narrateurConditionnel,
      animatingStats: new Set(Object.keys(result.deltaStats)),
    };
  }

  return state;
}

// ── Composant principal ──────────────────────────────────────────────────────

export default function GameShell({ data }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [conceptOuvert, setConceptOuvert] = useState<string | undefined>();
  const [choixFait, setChoixFait] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  const [state, dispatch] = useReducer(reducer, {
    game: initGame(data),
    lastDelta: {},
    lastConsequence: '',
    lastConcept: undefined,
    lastNarrateur: undefined,
    animatingStats: new Set(),
  });

  const scene = !state.game.termine
    ? data.scenes.find((s: any) => s.id === state.game.sceneId)
    : undefined;

  const fin = state.game.termine
    ? data.fins[state.game.finId ?? '']
    : undefined;

  // Ouvrir automatiquement le concept débloqué
  useEffect(() => {
    if (state.lastConcept && choixFait) {
      setConceptOuvert(state.lastConcept);
    }
  }, [state.lastConcept, choixFait]);

  // Scroll vers le haut après un choix
  useEffect(() => {
    if (choixFait && sceneRef.current) {
      sceneRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [state.game.sceneId]);

  function handleChoix(choixId: string) {
    setChoixFait(true);
    setConceptOuvert(undefined);
    dispatch({ type: 'CHOISIR', choixId, data });
  }

  function handleReset() {
    dispatch({ type: 'RESET', data });
    setPhase('jeu');
    setChoixFait(false);
    setConceptOuvert(undefined);
  }

  // ── Intro ────────────────────────────────────────────────────────────────

  if (phase === 'intro') {
    return (
      <div className="gs-intro">
        <div className="gs-intro-inner">
          <div className="gs-intro-eyebrow">Mode expérience</div>
          <h1 className="gs-intro-titre">{data.titre}</h1>
          <p className="gs-intro-accroche">{data.accroche}</p>
          <div className="gs-intro-stats-preview">
            <div className="gs-intro-stat-item">
              <span className="gs-stat-dot gs-stat-dot--amour" />
              Amour · 68
            </div>
            <div className="gs-intro-stat-item">
              <span className="gs-stat-dot gs-stat-dot--tension" />
              Tension · 45
            </div>
            <div className="gs-intro-stat-item">
              <span className="gs-stat-dot gs-stat-dot--distance" />
              Distance · 40
            </div>
          </div>
          <button className="gs-btn-primary" onClick={() => setPhase('jeu')}>
            Commencer
          </button>
          <p className="gs-intro-note">
            Vos choix influencent la relation en temps réel.<br />
            Les concepts psychologiques se débloquent au fil des scènes.
          </p>
        </div>
      </div>
    );
  }

  // ── Fin ──────────────────────────────────────────────────────────────────

  if (state.game.termine && fin) {
    const finType = fin.type as 'positive' | 'neutre' | 'negative';
    return (
      <div className={`gs-fin gs-fin--${finType}`}>
        <div className="gs-fin-inner">
          <div className="gs-fin-label">
            {finType === 'positive' ? '◎ Réparation' : finType === 'neutre' ? '— Cette nuit-là' : '▪ Distance'}
          </div>
          <h2 className="gs-fin-titre">{fin.titre}</h2>
          <p className="gs-fin-texte">{fin.texte}</p>
          <div className="gs-fin-message">{fin.messageJoueur}</div>

          <div className="gs-fin-stats">
            <div className="gs-fin-stats-titre">État final de la relation</div>
            <StatsPanel stats={state.game.stats} delta={{}} compact />
          </div>

          <div className="gs-fin-concepts">
            <div className="gs-fin-concepts-titre">Concepts découverts</div>
            <div className="gs-fin-concepts-liste">
              {state.game.conceptsDebloques.map(c => {
                const concept = data.conceptsJeu[c];
                if (!concept) return null;
                return (
                  <div key={c} className="gs-fin-concept-badge">
                    <span className="gs-fin-concept-icone">{concept.icone}</span>
                    <span className="gs-fin-concept-nom">{concept.nom}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="gs-fin-actions">
            <button className="gs-btn-primary" onClick={handleReset}>
              Rejouer
            </button>
            <a className="gs-btn-secondary" href={`/sous-la-surface/fenetre-tolerance-couple`}>
              Lire l'article ↗
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── Jeu ──────────────────────────────────────────────────────────────────

  if (!scene) return null;

  const conceptActuel = scene.conceptDeclenche
    ? data.conceptsJeu[scene.conceptDeclenche]
    : undefined;

  const acteLabel = ['', 'Acte I', 'Acte II', 'Acte III'][scene.acte] ?? '';

  return (
    <div className="gs-wrap">

      {/* ── Colonne gauche : timeline ── */}
      <aside className="gs-timeline">
        <div className="gs-timeline-label">Progression</div>
        {data.scenes.map((s: any, i: number) => {
          const estPasse = state.game.historique.some(h => h.sceneId === s.id);
          const estActuel = s.id === state.game.sceneId;
          return (
            <div
              key={s.id}
              className={`gs-timeline-item ${estPasse ? 'gs-timeline-item--passe' : ''} ${estActuel ? 'gs-timeline-item--actuel' : ''}`}
            >
              <div className="gs-timeline-dot" />
              <div className="gs-timeline-texte">
                <span className="gs-timeline-acte">Acte {s.acte}</span>
                <span className="gs-timeline-titre">{s.titre}</span>
              </div>
            </div>
          );
        })}
      </aside>

      {/* ── Centre : scène + choix ── */}
      <main className="gs-centre" ref={sceneRef}>
        <div className="gs-acte-label">{acteLabel} · {scene.titre}</div>

        <div className="gs-scene-narrateur">{scene.narrateur}</div>

        <div className="gs-scene-signal">{scene.signal}</div>

        {/* Conséquence du choix précédent */}
        {choixFait && state.game.historique.length > 0 && (
          <div className="gs-consequence">
            <div className="gs-consequence-texte">
              {state.game.historique[state.game.historique.length - 1]?.consequence}
            </div>
            {state.lastNarrateur && (
              <div className="gs-consequence-narrateur">{state.lastNarrateur}</div>
            )}
          </div>
        )}

        {/* Séparateur */}
        <div className="gs-sep" />

        {/* Choix */}
        <div className="gs-choix-liste">
          {scene.choix.map((choix: any) => (
            <button
              key={choix.id}
              className="gs-choix-btn"
              onClick={() => handleChoix(choix.id)}
            >
              <span className="gs-choix-label">{choix.label}</span>
              <span className="gs-choix-texte">{choix.texte}</span>
            </button>
          ))}
        </div>
      </main>

      {/* ── Colonne droite : stats + concept ── */}
      <aside className="gs-panel">
        <StatsPanel stats={state.game.stats} delta={state.lastDelta} />

        {conceptActuel && (
          <div className="gs-concept-wrap">
            <button
              className={`gs-concept-trigger ${conceptOuvert === scene.conceptDeclenche ? 'gs-concept-trigger--ouvert' : ''}`}
              onClick={() => setConceptOuvert(
                conceptOuvert === scene.conceptDeclenche ? undefined : scene.conceptDeclenche
              )}
            >
              <span className="gs-concept-icone">{conceptActuel.icone}</span>
              <span className="gs-concept-nom">{conceptActuel.nom}</span>
              <span className="gs-concept-chevron">
                {conceptOuvert === scene.conceptDeclenche ? '▲' : '▼'}
              </span>
            </button>
            {conceptOuvert === scene.conceptDeclenche && (
              <div className="gs-concept-body">
                {conceptActuel.court}
              </div>
            )}
          </div>
        )}

        {state.game.conceptsDebloques.length > 0 && (
          <div className="gs-concepts-debloques">
            <div className="gs-concepts-debloques-label">Concepts découverts</div>
            {state.game.conceptsDebloques.map(c => {
              const concept = data.conceptsJeu[c];
              if (!concept) return null;
              return (
                <div key={c} className="gs-concept-badge">
                  <span>{concept.icone}</span>
                  <span>{concept.nom}</span>
                </div>
              );
            })}
          </div>
        )}
      </aside>

    </div>
  );
}

// ── StatsPanel ───────────────────────────────────────────────────────────────

function StatsPanel({
  stats,
  delta,
  compact = false,
}: {
  stats: Stats;
  delta: Partial<Stats>;
  compact?: boolean;
}) {
  const statKeys: (keyof Stats)[] = compact
    ? ['amour', 'confiance', 'tension', 'rancœur', 'distance']
    : ['amour', 'confiance', 'tension', 'rancœur', 'distance', 'desirDeParler', 'risqueRupture'];

  return (
    <div className={`gs-stats ${compact ? 'gs-stats--compact' : ''}`}>
      {!compact && <div className="gs-stats-label">État de la relation</div>}
      {statKeys.map(key => {
        const val = stats[key];
        const d = delta[key];
        const isNeg = getStatIsNegative(key);
        const isGood = d !== undefined ? (isNeg ? d < 0 : d > 0) : null;

        return (
          <div key={key} className="gs-stat-row">
            <div className="gs-stat-info">
              <span className="gs-stat-name">{getStatLabel(key)}</span>
              {d !== undefined && d !== 0 && (
                <span className={`gs-stat-delta ${isGood ? 'gs-stat-delta--bon' : 'gs-stat-delta--mauvais'}`}>
                  {d > 0 ? `+${d}` : d}
                </span>
              )}
            </div>
            <div className="gs-stat-track">
              <div
                className={`gs-stat-fill gs-stat-fill--${key}`}
                style={{ width: `${val}%` }}
              />
            </div>
            <span className="gs-stat-val">{val}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────
