import { useState } from "react"
import { supabase, type Round, type Performance } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type HoleData = {
  number: number
  par: number
  score: number
  putts: number
  fairwayHit: boolean
  greenHit: boolean
  pinHit: boolean
  ob: boolean
  obType: string
  approachDistance: number
  approachSuccess: boolean
}

const defaultHoleData: HoleData = {
  number: 1,
  par: 4,
  score: 4,
  putts: 2,
  fairwayHit: true,
  greenHit: true,
  pinHit: false,
  ob: false,
  obType: "",
  approachDistance: 0,
  approachSuccess: false,
}

export function useHoleData() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  // Round data
  const [roundData, setRoundData] = useState<Partial<Round>>({
    date: new Date().toISOString().split("T")[0],
    round_count: 1.0,
    is_competition: false,
  })

  // Hole data
  const [holes, setHoles] = useState<HoleData[]>(
    Array.from({ length: 18 }, (_, i) => ({ ...defaultHoleData, number: i + 1 })),
  )
  const [currentHole, setCurrentHole] = useState(1)

  const handleRoundChange = (field: keyof Round, value: any) => {
    setRoundData((prev) => ({ ...prev, [field]: value }))
  }

  const handleHoleChange = (field: keyof HoleData, value: any) => {
    setHoles((prev) => {
      const newHoles = [...prev]
      newHoles[currentHole - 1] = {
        ...newHoles[currentHole - 1],
        [field]: value,
      }
      return newHoles
    })
  }

  const goToNextHole = () => {
    if (currentHole < 18) {
      setCurrentHole(currentHole + 1)
    }
  }

  const goToPrevHole = () => {
    if (currentHole > 1) {
      setCurrentHole(currentHole - 1)
    }
  }

  const calculatePerformanceData = (): Partial<Performance> => {
    // Initialize performance data
    const performance: Partial<Performance> = {
      one_putts: 0,
      three_putts_or_more: 0,
      par_on: 0,
      bogey_on: 0,
      in_pin: 0,
      ob_1w: 0,
      ob_other: 0,
      ob_2nd: 0,
      dist_1_30_success: 0,
      dist_1_30_total: 0,
      dist_31_80_success: 0,
      dist_31_80_total: 0,
      dist_81_120_success: 0,
      dist_81_120_total: 0,
      dist_121_160_success: 0,
      dist_121_160_total: 0,
      dist_161_180_success: 0,
      dist_161_180_total: 0,
      dist_181_plus_success: 0,
      dist_181_plus_total: 0,
    }

    // Calculate performance metrics from hole data
    holes.forEach((hole) => {
      // Putts
      if (hole.putts === 1) {
        performance.one_putts! += 1
      }
      if (hole.putts >= 3) {
        performance.three_putts_or_more! += 1
      }

      // Green hits
      if (hole.greenHit && hole.score <= hole.par) {
        performance.par_on! += 1
      }
      if (hole.greenHit && hole.score === hole.par + 1) {
        performance.bogey_on! += 1
      }

      // Pin hits
      if (hole.pinHit) {
        performance.in_pin! += 1
      }

      // OB counts
      if (hole.ob) {
        if (hole.obType === "1w") {
          performance.ob_1w! += 1
        } else if (hole.obType === "2nd") {
          performance.ob_2nd! += 1
        } else {
          performance.ob_other! += 1
        }
      }

      // Distance-based success rates
      if (hole.approachDistance > 0) {
        if (hole.approachDistance <= 30) {
          performance.dist_1_30_total! += 1
          if (hole.approachSuccess) {
            performance.dist_1_30_success! += 1
          }
        } else if (hole.approachDistance <= 80) {
          performance.dist_31_80_total! += 1
          if (hole.approachSuccess) {
            performance.dist_31_80_success! += 1
          }
        } else if (hole.approachDistance <= 120) {
          performance.dist_81_120_total! += 1
          if (hole.approachSuccess) {
            performance.dist_81_120_success! += 1
          }
        } else if (hole.approachDistance <= 160) {
          performance.dist_121_160_total! += 1
          if (hole.approachSuccess) {
            performance.dist_121_160_success! += 1
          }
        } else if (hole.approachDistance <= 180) {
          performance.dist_161_180_total! += 1
          if (hole.approachSuccess) {
            performance.dist_161_180_success! += 1
          }
        } else {
          performance.dist_181_plus_total! += 1
          if (hole.approachSuccess) {
            performance.dist_181_plus_success! += 1
          }
        }
      }
    })

    return performance
  }

  const calculateRoundData = (): Partial<Round> => {
    // Calculate total score
    const totalScore = holes.reduce((sum, hole) => sum + hole.score, 0)
    const outScore = holes.slice(0, 9).reduce((sum, hole) => sum + hole.score, 0)
    const inScore = holes.slice(9, 18).reduce((sum, hole) => sum + hole.score, 0)
    const totalPutts = holes.reduce((sum, hole) => sum + hole.putts, 0)

    return {
      ...roundData,
      score_total: totalScore,
      score_out: outScore,
      score_in: inScore,
      putts: totalPutts,
    }
  }

  const handleSubmit = async () => {
    if (!roundData.player_id || !roundData.date || !roundData.course_name) {
      toast({
        title: "入力エラー",
        description: "プレイヤー、日付、コース名は必須です",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // Calculate final round data
      const finalRoundData = calculateRoundData()

      // Insert round data
      const { data: roundResult, error: roundError } = await supabase
        .from("rounds")
        .insert(finalRoundData)
        .select()
        .single()

      if (roundError) throw roundError

      // Calculate performance data
      const performanceData = calculatePerformanceData()

      // Insert performance data with the round ID
      const { error: perfError } = await supabase.from("performance").insert({
        id: roundResult.id,
        ...performanceData,
      })

      if (perfError) throw perfError

      toast({
        title: "登録完了",
        description: "スコアが正常に登録されました",
        variant: "default",
      })
      router.push(`/player/${roundData.player_id}`)
    } catch (error) {
      console.error("Error submitting score:", error)
      toast({
        title: "エラー",
        description: "スコア登録中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return {
    roundData,
    holes,
    currentHole,
    submitting,
    handleRoundChange,
    handleHoleChange,
    goToNextHole,
    goToPrevHole,
    handleSubmit
  }
}