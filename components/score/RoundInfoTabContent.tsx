import React, { useEffect } from "react"
import { Player } from "@/lib/supabase"
import { RoundBasicInfoCard } from "@/components/RoundBasicInfoCard"

interface RoundInfoTabContentProps {
  roundData: any
  players: Player[]
  handleRoundChange: (field: string, value: any) => void
  nextTab: () => void
}

export function RoundInfoTabContent({
  roundData,
  players,
  handleRoundChange,
  nextTab,
}: RoundInfoTabContentProps) {
  // コンポーネントのマウント時または更新時に実行
  useEffect(() => {
    console.log("RoundInfoTabContent マウント時のroundData:", roundData);
    
    // ラウンド数が設定されていない場合のみ、デフォルト値を設定
    if (roundData.round_count === undefined || roundData.round_count === null) {
      console.log("ラウンド数を1.0に初期化します");
      handleRoundChange("round_count", 1.0);
    }
    
    // その他のフィールドの初期化
    if (roundData.course_name === undefined) handleRoundChange("course_name", null);
    if (roundData.used_tee === undefined) handleRoundChange("used_tee", null);
    if (roundData.is_competition === undefined) handleRoundChange("is_competition", false);
    if (roundData.score_in === undefined) handleRoundChange("score_in", null);
    if (roundData.score_out === undefined) handleRoundChange("score_out", null);
  }, []);

  // ラウンド数が変更されたときのハンドラー
  const handleRoundCountChange = (value: string) => {
    console.log(`ラウンド数を ${value} に変更します`);
    handleRoundChange("round_count", Number.parseFloat(value));
  };

  return (
    <RoundBasicInfoCard
      mode="basic"
      roundData={roundData}
      players={players}
      handleRoundChange={handleRoundChange}
      onRoundCountChange={handleRoundCountChange}
      nextTab={nextTab}
    />
  );
}
