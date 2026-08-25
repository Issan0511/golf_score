import type { Json } from "@/lib/database.types"
import type { HoleData } from "@/types/score"

type RoundForShortGame = {
  holes: Json[] | null
  round_count: number | null
}

export type ShortGameTotals = {
  shortGameShots: number
  missedGreenHoles: number
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

/** Totals shots and eligible missed-GIR holes used to calculate short game performance. */
export function calculateShortGameTotals(holes: Json[] | null): ShortGameTotals | null {
  if (!holes || holes.length === 0 || !holes.every(isHoleData)) return null

  return holes.reduce<ShortGameTotals>(
    (totals, hole) => {
      if (isGreenInRegulation(hole)) return totals

      const approachShots = (hole.shotCount30 ?? 0) + (hole.shotCount80 ?? 0)
      if (approachShots === 0) return totals

      totals.shortGameShots += approachShots + hole.putts
      totals.missedGreenHoles += 1
      return totals
    },
    { shortGameShots: 0, missedGreenHoles: 0 },
  )
}

/** Calculates average short game shots per missed-GIR hole for a round. */
export function calculateRoundShortGame(holes: Json[] | null): number | null {
  const totals = calculateShortGameTotals(holes)
  if (!totals || totals.missedGreenHoles === 0) return null

  return totals.shortGameShots / totals.missedGreenHoles
}

/** Calculates the missed-GIR-hole-weighted average across rounds. */
export function calculateAverageShortGame(rounds: RoundForShortGame[]): number | null {
  let totalShots = 0
  let totalMissedGreenHoles = 0

  rounds.forEach((round) => {
    const totals = calculateShortGameTotals(round.holes)
    if (!totals) return
    totalShots += totals.shortGameShots
    totalMissedGreenHoles += totals.missedGreenHoles
  })

  return totalMissedGreenHoles > 0 ? totalShots / totalMissedGreenHoles : null
}
