import type { Json } from "@/lib/database.types"
import type { Round } from "@/lib/supabase"
import type { HoleData } from "@/types/score"
import { calculateRoundShortGame, isGreenInRegulation } from "@/lib/short-game"

export type RoundDetailMetrics = {
  putts: number
  threePuttsOrMore: number
  fairwayKeeps: number
  ob: number
  parOns: number
  bogeyOns: number
  shortGame: number | null
}

function isDetailHole(value: Json): value is Json & HoleData & { ob2nd?: number } {
  if (!value || Array.isArray(value) || typeof value !== "object") return false
  const hole = value as Record<string, Json | undefined>
  return typeof hole.par === "number" && typeof hole.score === "number" && typeof hole.putts === "number"
}

export function calculateRoundDetails(round: Pick<Round, "holes" | "putts">): RoundDetailMetrics | null {
  if (!round.holes || round.holes.length === 0 || !round.holes.every(isDetailHole)) return null

  const metrics = round.holes.reduce<RoundDetailMetrics>(
    (result, hole) => {
      const strokesBeforePutting = hole.score - hole.putts
      result.putts += hole.putts
      result.threePuttsOrMore += hole.putts >= 3 ? 1 : 0
      result.fairwayKeeps += hole.fairwayHit ? 1 : 0
      result.ob += (hole.ob1w ?? 0) + (hole.obOther ?? 0) + (hole.ob2nd ?? 0)
      result.parOns += isGreenInRegulation(hole) ? 1 : 0
      result.bogeyOns += strokesBeforePutting === hole.par - 1 ? 1 : 0
      return result
    },
    { putts: 0, threePuttsOrMore: 0, fairwayKeeps: 0, ob: 0, parOns: 0, bogeyOns: 0, shortGame: 0 },
  )

  metrics.putts = round.putts ?? metrics.putts
  metrics.shortGame = calculateRoundShortGame(round.holes)
  return metrics
}
