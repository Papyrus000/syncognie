// src/lib/jardin.ts
// Utilitaires pour le jardin numérique

export type Stade = 'graine' | 'pousse' | 'arbre' | 'dormant';

export interface NoteJardin {
  slug: string;
  title: string;
  date?: Date;
  modifie?: Date;
  tags: string[];
  stade: Stade;
  stadeForce: boolean;
  description?: string;
  mossIntensity: number;  // 0 = frais, 1 = très dormant
  ageDays: number;
  body: string;
}

// ── Calcul du stade selon l'âge ──
export function computeStade(date?: Date, forcedStade?: Stade): Stade {
  if (forcedStade) return forcedStade;
  if (!date) return 'graine';

  const days = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (days < 7)  return 'graine';
  if (days < 30) return 'pousse';
  if (days < 90) return 'arbre';
  return 'dormant';
}

// ── Intensité de mousse (0→1) ──
export function computeMoss(date?: Date, stade?: Stade): number {
  if (!date) return 0;
  const days = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (days < 30) return 0;
  if (days < 90) return (days - 30) / 60 * 0.25;  // 0 → 0.25 progressif
  return Math.min(1, 0.25 + (days - 90) / 180);    // 0.25 → 1 sur 6 mois
}

// ── Texte d'âge lisible ──
export function ageText(date?: Date): string {
  if (!date) return "fragment récent";
  const days = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (days === 0) return "aujourd'hui";
  if (days === 1) return "hier";
  if (days < 7)  return `il y a ${days} jours`;
  if (days < 30) return `il y a ${Math.floor(days / 7)} semaine${days >= 14 ? 's' : ''}`;
  if (days < 365) return `il y a ${Math.floor(days / 30)} mois`;
  return `il y a ${Math.floor(days / 365)} an${days >= 730 ? 's' : ''}`;
}

// ── Icône et label par stade ──
export const STADE_META: Record<Stade, { icon: string; label: string; desc: string }> = {
  graine:  { icon: '🌱', label: 'Graine',  desc: 'Intuition fraîche, fragment brut' },
  pousse:  { icon: '🌿', label: 'Pousse',  desc: 'Exploration en cours, liens naissants' },
  arbre:   { icon: '🌳', label: 'Arbre',   desc: 'Pensée dense, enracinée, révisée' },
  dormant: { icon: '💤', label: 'Dormant', desc: 'En veille, couvert de mousse numérique' },
};
