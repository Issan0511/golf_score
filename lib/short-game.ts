import type { Json } from "@/lib/database.types"
import type { HoleData } from "@/types/score"

type RoundForShortGame = {
  holes: Json[] | null
  round_count: number | null
}

function isHoleData(value: Json): value is Json & HoleData {
  if (!value || Array.isArray(value) || typeof value !== "object") return false

  const hole = value as Record<string, Json | undefined>
  return typeof hole.par === "number" && typeof hole.score === "number" && typeof hole.putts === "number"
}

/** A GIR is reached when strokes before putting are no more than par minus two. */
export function isGreenInRegulation(hole: Pick<HoleData, "par" | "score" | "putts">): boolean {
  if (hole.par <= 0 || hole.score <= 0 || hole.putts < 0 || hole.putts > hole.score) return false
  return hole.score - hole.putts <= hole.par - 2
}

/** Counts shots from 100m and in, including putts, on holes where GIR was missed. */
export function calculateRoundShortGame(holes: Json[] | null): number | null {
  if (!holes || holes.length === 0 || !holes.every(isHoleData)) return null

  return holes.reduce((total, hole) => {
    if (isGreenInRegulation(hole)) return total
    return total + (hole.shotCount30 ?? 0) + (hole.shotCount80 ?? 0) + hole.putts
  }, 0)
}

/** Calculates the per-round average, including multi-round score entries. */
export function calculateAverageShortGame(rounds: RoundForShortGame[]): number | null {
  let totalShots = 0
  let totalRounds = 0

  rounds.forEach((round) => {
    const shortGame = calculateRoundShortGame(round.holes)
    if (shortGame === null) return
    totalShots += shortGame
    totalRounds += round.round_count && round.round_count > 0 ? round.round_count : 1
  })

  return totalRounds > 0 ? totalShots / totalRounds : null
}
