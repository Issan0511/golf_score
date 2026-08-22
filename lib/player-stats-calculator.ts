import type { Database, Json } from "@/lib/database.types"
import { calculateAverageShortGame, isGreenInRegulation } from "@/lib/short-game"
import type { HoleData } from "@/types/score"

type Round = Database["public"]["Tables"]["rounds"]["Row"]
type PlayerStats = Database["public"]["Tables"]["playerstats"]["Row"]

type StatsHole = HoleData & { ob2nd?: number }

function isStatsHole(value: Json): value is Json & StatsHole {
  if (!value || Array.isArray(value) || typeof value !== "object") return false
  const hole = value as Record<string, Json | undefined>
  return typeof hole.par === "number" && typeof hole.score === "number" && typeof hole.putts === "number"
}

const ratio = (success: number, total: number) => (total > 0 ? success / total : null)

/** Calculates the values displayed by playerstats from only the supplied rounds. */
export function calculatePlayerStats(rounds: Round[]): (PlayerStats & { avg_short_game: number | null }) | null {
  if (rounds.length === 0) return null

  let roundCount = 0
  let score = 0
  let putts = 0
  let onePutts = 0
  let threePutts = 0
  let parOns = 0
  let bogeyOns = 0
  let pinHits = 0
  let holeCount = 0
  let ob1w = 0
  let obOther = 0
  let ob2nd = 0
  const distances = [
    { success: 0, total: 0 }, { success: 0, total: 0 }, { success: 0, total: 0 },
    { success: 0, total: 0 }, { success: 0, total: 0 }, { success: 0, total: 0 },
  ]

  rounds.forEach((round) => {
    const count = round.round_count && round.round_count > 0 ? round.round_count : 1
    roundCount += count
    score += round.score_total ?? 0
    putts += round.putts ?? 0

    const holes = round.holes?.filter(isStatsHole) ?? []
    holeCount += holes.length
    holes.forEach((hole) => {
      onePutts += hole.putts === 1 ? 1 : 0
      threePutts += hole.putts >= 3 ? 1 : 0
      parOns += isGreenInRegulation(hole) ? 1 : 0
      bogeyOns += hole.score - hole.putts === hole.par - 1 ? 1 : 0
      pinHits += hole.pinHit ? 1 : 0
      ob1w += hole.ob1w ?? 0
      obOther += hole.obOther ?? 0
      ob2nd += hole.ob2nd ?? 0
      const totals = [hole.shotCount30, hole.shotCount80, hole.shotCount120, hole.shotCount160, hole.shotCount180, hole.shotCount181plus]
      const successes = [hole.shotsuccess30, hole.shotsuccess80, hole.shotsuccess120, hole.shotsuccess160, hole.shotsuccess180, hole.shotsuccess181plus]
      distances.forEach((distance, index) => {
        distance.total += totals[index] ?? 0
        distance.success += successes[index] ?? 0
      })
    })
  })

  return {
    id: rounds[0].player_id ?? "",
    created_at: null,
    avg_score: roundCount ? score / roundCount : null,
    avg_putt: roundCount ? putts / roundCount : null,
    avg_short_game: calculateAverageShortGame(rounds),
    avg_one_putts: roundCount ? onePutts / roundCount : null,
    avg_three_putts_or_more: roundCount ? threePutts / roundCount : null,
    avg_par_on: holeCount ? (parOns / holeCount) * 100 : null,
    avg_bogey_on: holeCount ? (bogeyOns / holeCount) * 100 : null,
    pin_rate: ratio(pinHits, holeCount),
    dist_1_30: ratio(distances[0].success, distances[0].total),
    dist_31_80: ratio(distances[1].success, distances[1].total),
    dist_81_120: ratio(distances[2].success, distances[2].total),
    dist_121_160: ratio(distances[3].success, distances[3].total),
    dist_161_180: ratio(distances[4].success, distances[4].total),
    dist_181_plus: ratio(distances[5].success, distances[5].total),
    avg_ob1w: roundCount ? ob1w / roundCount : null,
    avg_ob_other: roundCount ? obOther / roundCount : null,
    avg_ob_2nd: roundCount ? ob2nd / roundCount : null,
  }
}
