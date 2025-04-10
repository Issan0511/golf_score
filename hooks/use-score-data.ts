import { useState } from "react"
import { supabase, type Round, type Performance } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

export function useScoreData() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  // Round data
  const [roundData, setRoundData] = useState<Partial<Round>>({
    date: new Date().toISOString().split("T")[0],
    round_count: 1.0,
    is_competition: false,
  })

  // Performance data
  const [performanceData, setPerformanceData] = useState<Partial<Performance>>({
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
  })

  const handleRoundChange = (field: keyof Round, value: any) => {
    setRoundData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePerformanceChange = (field: keyof Performance, value: any) => {
    setPerformanceData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async () => {
    // すでに送信中の場合は処理をスキップ（二重送信防止）
    if (submitting) {
      return
    }

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
      // Insert round data
      const { data: roundResult, error: roundError } = await supabase.from("rounds").insert(roundData).select().single()

      if (roundError) throw roundError

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
      
      // プレイヤー詳細ページに遷移する
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
    performanceData,
    submitting,
    handleRoundChange,
    handlePerformanceChange,
    handleSubmit
  }
}