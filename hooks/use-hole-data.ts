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
  ob1w: number
  obOther: number
  shotCount30: number
  shotCount80: number
  shotCount120: number
  shotCount160: number
  shotCount180: number
  shotCount181plus: number
  shotsuccess30: number
  shotsuccess80: number
  shotsuccess120: number
  shotsuccess160: number
  shotsuccess180: number
  shotsuccess181plus: number
  pinHit: boolean
}

const defaultHoleData: HoleData = {
  number: 1,
  par: 4,
  score: 4,
  putts: 2,
  fairwayHit: false,
  pinHit: false,
  ob1w: 0,
  obOther: 0,
  shotCount30: 0,
  shotCount80: 0,
  shotCount120: 0,
  shotCount160: 0,
  shotCount180: 0,
  shotCount181plus: 0,
  shotsuccess30: 0,
  shotsuccess80: 0,
  shotsuccess120: 0,
  shotsuccess160: 0,
  shotsuccess180: 0,
  shotsuccess181plus: 0
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

  const handleHoleChange = (field: string, value: any) => {
    setHoles((prev) => {
      const newHoles = [...prev]
      newHoles[currentHole - 1] = {
        ...newHoles[currentHole - 1],
        [field]: value,
      }
      
      // スコアやショットカウントが変更された場合、自動的にショット成功を設定
      const updatedHole = newHoles[currentHole - 1];
      
      // ホールアウトしている（スコアが入力されている）場合は、
      // 最短距離のショットは成功しているとみなす
      if (updatedHole.score > 0) {
        if (updatedHole.shotCount30 > 0) {
          updatedHole.shotsuccess30 = 1;
        } else if (updatedHole.shotCount80 > 0) {
          updatedHole.shotsuccess80 = 1;
        } else if (updatedHole.shotCount120 > 0) {
          updatedHole.shotsuccess120 = 1;
        } else if (updatedHole.shotCount160 > 0) {
          updatedHole.shotsuccess160 = 1;
        } else if (updatedHole.shotCount180 > 0) {
          updatedHole.shotsuccess180 = 1;
        } else if (updatedHole.shotCount181plus > 0) {
          updatedHole.shotsuccess181plus = 1;
        }
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
      if (hole.score <= hole.par) {
        performance.par_on! += 1
      }
      if (hole.score === hole.par + 1) {
        performance.bogey_on! += 1
      }

      // Pin hits
      if (hole.pinHit) {
        performance.in_pin! += 1
      }

      // OB counts
      performance.ob_1w! += hole.ob1w
      performance.ob_other! += hole.obOther

      // Distance-based success rates
      performance.dist_1_30_total! += hole.shotCount30
      performance.dist_1_30_success! += hole.shotsuccess30
      performance.dist_31_80_total! += hole.shotCount80
      performance.dist_31_80_success! += hole.shotsuccess80
      performance.dist_81_120_total! += hole.shotCount120
      performance.dist_81_120_success! += hole.shotsuccess120
      performance.dist_121_160_total! += hole.shotCount160
      performance.dist_121_160_success! += hole.shotsuccess160
      performance.dist_161_180_total! += hole.shotCount180
      performance.dist_161_180_success! += hole.shotsuccess180
      performance.dist_181_plus_total! += hole.shotCount181plus
      performance.dist_181_plus_success! += hole.shotsuccess181plus
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