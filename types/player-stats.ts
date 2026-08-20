import { Player, PlayerStats, Performance } from "@/lib/supabase"

export interface PlayerWithStats extends Player {
  stats: (PlayerStats & { avg_short_game?: number | null }) | null
  performance: Performance | null
}
