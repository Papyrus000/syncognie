import type { CleReservoir } from "../pratiques/_schema"

export interface ModificateurProfil {
  sexe: "M" | "F"
  age: "18-25" | "26-35" | "36-50" | "50+"
  multiplicateur: number
  note: string
}

export interface Reservoir {
  id: CleReservoir
  label: string
  description: string
  base: number
  min: number
  max: number
  seuil_alerte: number
  seuil_cascade: number
  modificateurs: ModificateurProfil[]
}