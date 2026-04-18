// ══════════════════════════════════════════════════════════════
//  syncognie-tracker.ts
//  Couche données — localStorage persistant entre sessions
//  Placer dans : src/lib/syncognie-tracker.ts
// ══════════════════════════════════════════════════════════════

const KEY = 'syncognie_stats_v1';

export interface NuancierSession {
  date: string;        // ISO
  score: number;
  total: number;
}

export interface SyncognieStats {
  // ── Nuancier ──
  nuancier: {
    sessions: NuancierSession[];
    bestScore: number;     // absolu (ex: 9)
    bestTotal: number;     // total correspondant (ex: 10)
    totalCorrect: number;  // cumulé toutes sessions
    totalAnswered: number; // cumulé
  };

  // ── Temps sur le site ──
  time: {
    totalSeconds: number;
    lastVisit: string | null;   // ISO
    sessionStart: string | null; // ISO (en cours)
  };

  // ── Articles lus ──
  articles: {
    read: string[];  // slugs ou URLs
    lastRead: string | null; // slug du dernier
  };
}

// ── Valeur par défaut ─────────────────────────────────────────
function defaultStats(): SyncognieStats {
  return {
    nuancier: {
      sessions: [],
      bestScore: 0,
      bestTotal: 10,
      totalCorrect: 0,
      totalAnswered: 0,
    },
    time: {
      totalSeconds: 0,
      lastVisit: null,
      sessionStart: null,
    },
    articles: {
      read: [],
      lastRead: null,
    },
  };
}

// ── Lecture / écriture ────────────────────────────────────────
export function readStats(): SyncognieStats {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultStats();
    const parsed = JSON.parse(raw) as SyncognieStats;
    // Merge avec défaut pour compatibilité forward
    return { ...defaultStats(), ...parsed };
  } catch {
    return defaultStats();
  }
}

function writeStats(s: SyncognieStats): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // quota dépassé — on ignore silencieusement
  }
}

// ── API publique ──────────────────────────────────────────────

/** Enregistre une session nuancier terminée */
export function saveNuancierSession(score: number, total: number): void {
  const s = readStats();
  const session: NuancierSession = {
    date: new Date().toISOString(),
    score,
    total,
  };
  s.nuancier.sessions.push(session);
  s.nuancier.totalCorrect  += score;
  s.nuancier.totalAnswered += total;
  if (score > s.nuancier.bestScore) {
    s.nuancier.bestScore = score;
    s.nuancier.bestTotal = total;
  }
  writeStats(s);
}

/** Démarre le chrono de session (appeler au load de page) */
export function startSession(): void {
  const s = readStats();
  s.time.lastVisit    = new Date().toISOString();
  s.time.sessionStart = new Date().toISOString();
  writeStats(s);
}

/** Arrête le chrono et cumule le temps (appeler sur visibilitychange hidden + beforeunload) */
export function endSession(): void {
  const s = readStats();
  if (!s.time.sessionStart) return;
  const elapsed = Math.floor(
    (Date.now() - new Date(s.time.sessionStart).getTime()) / 1000
  );
  // On cap à 30 min pour éviter les onglets oubliés
  s.time.totalSeconds += Math.min(elapsed, 1800);
  s.time.sessionStart  = null;
  writeStats(s);
}

/** Marque un article comme lu (slug ou path) */
export function markArticleRead(slug: string): void {
  const s = readStats();
  if (!s.articles.read.includes(slug)) {
    s.articles.read.push(slug);
  }
  s.articles.lastRead = slug;
  writeStats(s);
}

/** Formate les secondes en "2h 14min" ou "45 min" */
export function formatTime(seconds: number): string {
  if (seconds < 60) return `< 1 min`;
  const h   = Math.floor(seconds / 3600);
  const min = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${min > 0 ? min + ' min' : ''}`.trim();
  return `${min} min`;
}

/** Calcule le score moyen sur toutes les sessions */
export function avgScore(stats: SyncognieStats): number | null {
  const { totalAnswered, totalCorrect } = stats.nuancier;
  if (totalAnswered === 0) return null;
  return Math.round((totalCorrect / totalAnswered) * 10 * 10) / 10;
}
