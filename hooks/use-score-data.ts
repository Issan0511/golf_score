import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase, updatePlayerStats } from "@/lib/supabase"
import type { Round, Performance } from "@/lib/supabase"

export function useScoreData() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  // Round data
  const [roundData, setRoundData] = useState<Partial<Round>>({
    date: new Date().toISOString().split("T")[0],
    round_count: 1.0,
    is_competition: false,
  })

  // Performance data - 初期値はnullに設定して、入力フィールドが上書きしないようにする
  const [performanceData, setPerformanceData] = useState<Partial<Performance>>({
    one_putts: null,
    three_putts_or_more: null,
    par_on: null,
    bogey_on: null,
    in_pin: null,
    ob_1w: null,
    ob_other: null,
    ob_2nd: null,
    dist_1_30_success: null,
    dist_1_30_total: null,
    dist_31_80_success: null,
    dist_31_80_total: null,
    dist_81_120_success: null,
    dist_81_120_total: null,
    dist_121_160_success: null,
    dist_121_160_total: null,
    dist_161_180_success: null,
    dist_161_180_total: null,
    dist_181_plus_success: null,
    dist_181_plus_total: null,
  })

  // ホールデータの配列を保持するstate
  const [holes, setHoles] = useState<any[]>([])

  const handleRoundChange = (field: keyof Round, value: any) => {
    setRoundData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePerformanceChange = (field: keyof Performance, value: any) => {
    setPerformanceData((prev) => ({ ...prev, [field]: value }))
  }

  // パフォーマンスデータを一括で設定する関数を追加
  const setPerformanceDataBulk = useCallback((data: Partial<Performance>) => {
    // 既存のパフォーマンスデータとマージして更新
    setPerformanceData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  // ホールデータを設定するための関数
  const setHolesData = (holesData: any[]) => {
    setHoles(holesData)
  }

  const handleSubmit = async () => {
    // すでに送信中の場合は処理をスキップ（二重送信防止）
    if (submitting) {
      return
    }

    // 必須項目の検証
    const missingFields = [];
    
    if (!roundData.player_id) {
      missingFields.push("プレイヤー");
    }
    
    if (!roundData.date) {
      missingFields.push("日付");
    }
    
    if (!roundData.course_name) {
      missingFields.push("コース名");
    }

    if (missingFields.length > 0) {
      // toastの代わりにalertを使用
      alert(`入力エラー: 以下の項目を入力してください: ${missingFields.join(", ")}`);
      return
    }

    try {
      setSubmitting(true)

      // Prepare roundData with holes
      const roundDataWithHoles = {
        ...roundData,
        holes: holes,
      }

      // Insert round data
      const { data: roundResult, error: roundError } = await supabase.from("rounds").insert(roundDataWithHoles).select().single()

      if (roundError) {
        throw roundError;
      }

      // Insert performance data with the round ID
      const { error: perfError } = await supabase.from("performance").insert({
        id: roundResult.id,
        ...performanceData,
      })

      if (perfError) {
        throw perfError;
      }

      // プレイヤーの統計を更新
      if (roundData.player_id) {
        try {
          await updatePlayerStats(roundData.player_id);
        } catch (statsError) {
          // 統計更新が失敗してもスコア登録は成功とする
        }
      }

      // toastの代わりにalertを使用
      alert("登録完了: スコアが正常に登録されました");
      
      // プレイヤー詳細ページに遷移する
      router.push(`/player/${roundData.player_id}`)
    } catch (error) {
      // toastの代わりにalertを使用
      alert("エラー: データの送信中にエラーが発生しました");
    } finally {
      setSubmitting(false)
    }
  }

  return {
    roundData,
    performanceData,
    holes,
    submitting,
    handleRoundChange,
    handlePerformanceChange,
    setPerformanceDataBulk,
    setHolesData,
    handleSubmit,
  }
}