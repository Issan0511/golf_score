import { Player, PlayerStats, Performance } from "@/lib/supabase"

export interface PlayerWithStats extends Player {
  stats: PlayerStats | null
  performance: Performance | null
}