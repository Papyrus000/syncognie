// src/engine/engine.ts
// Moteur etendu — Prior + Informateurs + Orientation calculee

import type {
  Informateur,
  Prior,
  Force,
  Concept,
  AngleMort,
  Couche,
  AnalyseCouches,
  ResultatMoteur,
  OrientationScore,
  OrientationLabel,
} from './types';
import { TOUTES_LES_COUCHES } from './types';

// ─── Deduplication ───────────────────────────────────────────────────────────

function dedupe<T extends { label?: string; name?: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.label ?? item.name ?? '';
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ─── Analyse couches ─────────────────────────────────────────────────────────

function analyseCouches(
  forces: Force[],
  concepts: Concept[],
  anglesMorts: AngleMort[]
): AnalyseCouches {
  const couvertes = new Set<Couche>();
  const faibles = new Set<Couche>();

  for (const f of forces) couvertes.add(f.couche);
  for (const c of concepts) couvertes.add(c.couche);

  for (const a of anglesMorts) {
    if (!couvertes.has(a.couche)) faibles.add(a.couche);
  }

  const absentes = TOUTES_LES_COUCHES.filter(
    (c) => !couvertes.has(c) && !faibles.has(c)
  );

  return { couvertes: [...couvertes], faibles: [...faibles], absentes };
}

// ─── Lisibilite ──────────────────────────────────────────────────────────────
// couverte = 1pt, faible = 0.4pt, absente = 0pt

function calculLisibilite(couches: AnalyseCouches): number {
  const total = TOUTES_LES_COUCHES.length;
  const score = couches.couvertes.length * 1 + couches.faibles.length * 0.4;
  return Math.round((score / total) * 100);
}

// ─── Orientation ─────────────────────────────────────────────────────────────
// Score final = prior.score + somme des effets ponderes des informateurs actifs
// Plafonne a [-2, +2]

function calculOrientation(
  prior: Prior,
  informateursActifs: Informateur[]
): { score: number; label: OrientationLabel; confiance: Prior['confiance'] } {
  let score: number = prior.score;

  for (const inf of informateursActifs) {
    const delta = inf.effet.vers === 'sport'
      ? inf.effet.poids
      : inf.effet.vers === 'repos'
      ? -inf.effet.poids
      : 0;
    score += delta;
  }

  // Plafonner
  score = Math.max(-6, Math.min(6, score));

  // Label qualitatif
  let label: OrientationLabel;
  if (score <= -3) label = 'repos probable';
  else if (score < 0) label = 'legere tendance repos';
  else if (score === 0) label = 'incertain';
  else if (score <= 3) label = 'legere tendance sport';
  else label = 'sport probable';

  // Confiance = fonction du nombre d'informateurs actifs
  const n = informateursActifs.length;
  let confiance: Prior['confiance'];
  if (n === 0) confiance = 'tres faible';
  else if (n <= 2) confiance = 'faible';
  else if (n <= 4) confiance = 'moderee';
  else confiance = 'elevee';

  return { score, label, confiance };
}

// ─── Hypothese textuelle ─────────────────────────────────────────────────────

function formulerHypothese(
  orientation: OrientationLabel,
  confiance: Prior['confiance'],
  lisibilite: number,
  n: number
): string {
  if (n === 0) {
    return "Impossible a estimer. Le modele ne dispose d'aucune information sur cette personne.";
  }

  const prefixe: Record<Prior['confiance'], string> = {
    'tres faible': "Trop peu d'elements pour conclure.",
    'faible': "Le modele entrevoit une direction, mais reste tres fragile.",
    'moderee': "Une orientation se dessine, avec des zones d'ombre importantes.",
    'elevee': "Le modele dispose d'un contexte riche, mais reste incomplet.",
  };

  const corps: Record<OrientationLabel, string> = {
    'repos probable': "La balance penche nettement vers le repos.",
    'legere tendance repos': "Legere inclinaison vers le repos — rien de certain.",
    'incertain': "Les forces se neutralisent. Les deux options restent ouvertes.",
    'legere tendance sport': "Legere inclinaison vers le sport — rien de certain.",
    'sport probable': "La balance penche vers le sport, mais des angles morts importants subsistent.",
  };

  return `${prefixe[confiance]} ${corps[orientation]}`;
}

// ─── Moteur principal ────────────────────────────────────────────────────────

export function evaluerAvecInformateurs(
  prior: Prior,
  anglesMortsInitiaux: AngleMort[],
  tousLesInformateurs: Informateur[],
  idsActifs: string[]
): ResultatMoteur {
  const informateursActifs = tousLesInformateurs.filter(i => idsActifs.includes(i.id));

  // Collecter forces, concepts, angles morts depuis les informateurs actifs
  const forcesRaw: Force[] = [];
  const conceptsRaw: Concept[] = [];
  const anglesMortsLeves = new Set<string>();

  for (const inf of informateursActifs) {
    if (inf.forces) {
      for (const f of inf.forces) {
        forcesRaw.push({ ...f, source: inf.id });
      }
    }
    if (inf.concepts) conceptsRaw.push(...inf.concepts);
    if (inf.anglesMortsLeves) {
      for (const label of inf.anglesMortsLeves) anglesMortsLeves.add(label);
    }
  }

  // Angles morts = initiaux - leves + ajoutes par les informateurs actifs
  const anglesMortsBase = anglesMortsInitiaux.filter(a => !anglesMortsLeves.has(a.label));
  const anglesMortsAjoutes: AngleMort[] = informateursActifs.flatMap(i => i.anglesMortsAjoutes ?? []);

  const forces = dedupe(forcesRaw);
  const concepts = dedupe(conceptsRaw);
  const anglesMorts = dedupe([...anglesMortsBase, ...anglesMortsAjoutes]);

  const couches = analyseCouches(forces, concepts, anglesMorts);
  const lisibilite = calculLisibilite(couches);
  const { label: orientation, confiance: confianceOrientation } = calculOrientation(prior, informateursActifs);
  const hypothese = formulerHypothese(orientation, confianceOrientation, lisibilite, informateursActifs.length);

  return { forces, concepts, anglesMorts, couches, lisibilite, orientation, confianceOrientation, hypothese };
}
