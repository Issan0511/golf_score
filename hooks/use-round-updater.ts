import { useState } from "react"
import { supabase, type Round, type Performance, updatePlayerStats } from "@/lib/supabase"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { type HoleData } from "@/types/score"

type RoundUpdaterProps = {
  id: string
}

/**
 * ラウンドデータ更新用のフック
 * 編集ページで使用する
 */
export function useRoundUpdater({ id }: RoundUpdaterProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  
  /**
   * ラウンドデータを更新する関数
   */
  const updateRoundData = async (
    roundData: Partial<Round>, 
    performanceData: Partial<Performance>,
    holes: HoleData[]
  ) => {
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
    
    if (!roundData.club_name) {
      missingFields.push("クラブ名");
    }
    
    // 不足している項目がある場合はエラーを表示
    if (missingFields.length > 0) {
      toast({
        title: "入力エラー",
        description: `以下の必須項目が入力されていません: \n【${missingFields.join("、")}】`,
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    try {
      // ラウンドデータにホールデータを追加
      const roundDataWithHoles = {
        ...roundData,
        holes: holes // ホールデータを追加
      }

      // Update round data
      const { error: roundError } = await supabase
        .from("rounds")
        .update(roundDataWithHoles)
        .eq("id", id);

      if (roundError) {
        throw roundError;
      }

      // Update performance data
      const { error: perfError } = await supabase
        .from("performance")
        .update(performanceData)
        .eq("id", id);

      if (perfError) {
        throw perfError;
      }
      
      // プレイヤーの統計を更新
      if (roundData.player_id) {
        console.log("-console by copilot-\n", "統計更新を開始します", { player_id: roundData.player_id });
        await updatePlayerStats(roundData.player_id);
      }

      toast({
        title: "更新完了",
        description: "ラウンドデータが正常に更新されました",
        variant: "default",
      })
      
      // プレイヤー詳細ページに遷移する
      router.push(`/player/${roundData.player_id}`)
    } catch (error) {
      console.error("-console by copilot-\n", "Update error:", error);
      toast({
        title: "エラー",
        description: "ラウンド更新中にエラーが発生しました",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return {
    updateRoundData,
    submitting
  }
}