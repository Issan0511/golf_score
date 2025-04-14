import { type HoleData } from "@/types/score"
import { type Performance } from "@/lib/supabase"
import { useRef, useCallback } from "react"

type PerformanceCalculatorProps = {
  holes: HoleData[]
  handleRoundChange?: (field: string, value: any) => void
}

/**
 * ホールデータからパフォーマンスデータを計算するフック
 * ラウンド編集と新規作成の両方で使用できる
 */
export function usePerformanceCalculator({ holes, handleRoundChange }: PerformanceCalculatorProps) {
  // 前回のholes参照を保持するref
  const holesRef = useRef<HoleData[]>(holes);
  
  // コンポーネント再レンダリング時にholesRefを更新
  if (holes !== holesRef.current) {
    holesRef.current = holes;
  }

  /**
   * ホールデータからパフォーマンスデータを計算する関数
   * useCallbackでメモ化して不要な再計算を防止
   */
  const calculatePerformanceFromHoles = useCallback((): Partial<Performance> => {
    // 現在のholesRefを使用
    const currentHoles = holesRef.current;
    
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

    let totalScore = 0;
    let totalPutts = 0;
    let frontNineScore = 0;
    let backNineScore = 0;

    // ホールデータを集計
    currentHoles.forEach((hole, index) => {
      // スコアとパット数の合計を計算
      totalScore += hole.score || 0;
      totalPutts += hole.putts || 0;
      
      // フロント9（1-9ホール）とバック9（10-18ホール）のスコアを計算
      if (index < 9) {
        frontNineScore += hole.score || 0;
      } else {
        backNineScore += hole.score || 0;
      }
      
      // パット
      if (hole.putts === 1) {
        performance.one_putts! += 1
      }
      if (hole.putts >= 3) {
        performance.three_putts_or_more! += 1
      }

      // グリーンヒット
      if (hole.score <= hole.par) {
        performance.par_on! += 1
      }
      if (hole.score === hole.par + 1) {
        performance.bogey_on! += 1
      }

      // ピン奪取
      if (hole.pinHit) {
        performance.in_pin! += 1
      }

      // OBカウント
      performance.ob_1w! += hole.ob1w || 0;
      performance.ob_other! += hole.obOther || 0;
      performance.ob_2nd! += hole.ob2nd || 0;

      // 距離ごとの成功率集計
      performance.dist_1_30_total! += hole.shotCount30;
      performance.dist_1_30_success! += hole.shotsuccess30;
      
      performance.dist_31_80_total! += hole.shotCount80;
      performance.dist_31_80_success! += hole.shotsuccess80;
      
      performance.dist_81_120_total! += hole.shotCount120;
      performance.dist_81_120_success! += hole.shotsuccess120;
      
      performance.dist_121_160_total! += hole.shotCount160;
      performance.dist_121_160_success! += hole.shotsuccess160;
      
      performance.dist_161_180_total! += hole.shotCount180;
      performance.dist_161_180_success! += hole.shotsuccess180;
      
      performance.dist_181_plus_total! += hole.shotCount181plus;
      performance.dist_181_plus_success! += hole.shotsuccess181plus;
    });

    // roundDataにスコア合計とパット数を反映（任意）
    if (handleRoundChange) {
      
      // 非同期でhandleRoundChangeを呼び出して再レンダリングの連鎖を防ぐ
      setTimeout(() => {
        handleRoundChange("score_total", totalScore);
        handleRoundChange("putts", totalPutts);
        handleRoundChange("score_out", frontNineScore);
        handleRoundChange("score_in", backNineScore);
      }, 0);
    }

    return performance;
  }, []); // 依存配列を空にして毎回同じ関数インスタンスを返す

  return {
    calculatePerformanceFromHoles,
  };
}