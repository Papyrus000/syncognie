import type { CleReservoir } from "../pratiques/_schema"

export type TypeSynergie = "amplification" | "antagoniste" | "danger" | "hormese"

export interface ConditionHormese {
  reservoirs_requis: Partial<Record<CleReservoir, { min: number }>>
  benefice_si_condition: Partial<Record<CleReservoir, {
    base_modifier: number
    delai_jours: number
    note: string
  }>>
  label_ui: string
}

export interface Synergie {
  id: string
  pratiques: string[]
  type: TypeSynergie
  label_ui: string
  detail_ui: string
  effets: Partial<Record<CleReservoir, number>>
  condition_hormese?: ConditionHormese
  source: string
  incertitude: "faible" | "modere" | "speculatif"
  deprecated?: boolean
}