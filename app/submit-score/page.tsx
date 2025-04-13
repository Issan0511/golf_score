"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase, type Player } from "@/lib/supabase"
import { Calendar, Cloud, Flag, GuitarIcon as Golf, Trophy, User } from "lucide-react"

// コンポーネントとフックをインポート
import { useScoreData } from "@/hooks/use-score-data"
import { useHoleData } from "@/hooks/use-hole-data"

// 分割したタブコンテンツをインポート
import { RoundInfoTabContent } from "@/components/score/RoundInfoTabContent"
import { HoleInputTabContent } from "@/components/score/HoleInputTabContent"
import { PerformanceTabContent } from "@/components/score/PerformanceTabContent"

export default function SubmitScorePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("round") // アクティブなタブの状態を管理

  const {
    roundData,
    performanceData,
    submitting,
    handleRoundChange,
    handlePerformanceChange,
    handleSubmit,
    setHolesData, // 追加: ホールデータを設定する関数
  } = useScoreData()

  const {
    holes,
    currentHole,
    handleHoleChange,
    goToNextHole,
    goToPrevHole,
    setCurrentHole,
    getTotalHoles
  } = useHoleData({ externalRoundCount: roundData.round_count })

  // holesデータが変更されるたびにuseScoreDataのホールデータを更新する
  useEffect(() => {
    console.log("-console by colipot-\n", `ホールデータが更新されました: ${holes.length}ホール`);
    setHolesData(holes);
  }, [holes, setHolesData]);

  // ホールデータからパフォーマンスデータを計算する関数
  const calculatePerformanceFromHoles = () => {
    const performance = {
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
    holes.forEach((hole, index) => {
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
        performance.one_putts += 1
      }
      if (hole.putts >= 3) {
        performance.three_putts_or_more += 1
      }

      // グリーンヒット
      if (hole.score <= hole.par) {
        performance.par_on += 1
      }
      if (hole.score === hole.par + 1) {
        performance.bogey_on += 1
      }

      // ピン奪取
      if (hole.pinHit) {
        performance.in_pin += 1
      }

      // OBカウント
      performance.ob_1w += hole.ob1w || 0;
      performance.ob_other += hole.obOther || 0;
      performance.ob_2nd += hole.ob2nd || 0;
    });

    // 距離ごとの成功率集計
    holes.forEach(hole => {
      // 30mの距離帯
      performance.dist_1_30_total += hole.shotCount30;
      performance.dist_1_30_success += hole.shotsuccess30;
      
      // 31-80mの距離帯
      performance.dist_31_80_total += hole.shotCount80;
      performance.dist_31_80_success += hole.shotsuccess80;
      
      // 81-120mの距離帯
      performance.dist_81_120_total += hole.shotCount120;
      performance.dist_81_120_success += hole.shotsuccess120;
      
      // 121-160mの距離帯
      performance.dist_121_160_total += hole.shotCount160;
      performance.dist_121_160_success += hole.shotsuccess160;
      
      // 161-180mの距離帯
      performance.dist_161_180_total += hole.shotCount180;
      performance.dist_161_180_success += hole.shotsuccess180;
      
      // 181m+の距離帯
      performance.dist_181_plus_total += hole.shotCount181plus;
      performance.dist_181_plus_success += hole.shotsuccess181plus;
    });

    // roundDataにスコア合計とパット数を反映
    handleRoundChange("score_total", totalScore);
    handleRoundChange("putts", totalPutts);
    handleRoundChange("score_out", frontNineScore);
    handleRoundChange("score_in", backNineScore);

    return performance;
  };

  // パフォーマンスデータを更新する関数
  const calculateAndUpdatePerformance = () => {
    const calculatedPerformance = calculatePerformanceFromHoles();
    console.log("-console by colipot-\n", "計算されたパフォーマンスデータ:", calculatedPerformance);
    
    // パフォーマンスデータを更新
    Object.keys(calculatedPerformance).forEach(key => {
      handlePerformanceChange(key as keyof typeof calculatedPerformance, calculatedPerformance[key as keyof typeof calculatedPerformance]);
    });
  };

  // パフォーマンスタブに遷移する関数
  const navigateToPerformanceTab = () => {
    
    // まずパフォーマンスデータを計算・更新
    calculateAndUpdatePerformance();
    
    // その後、activeTab状態を変更してタブを切り替え
    setActiveTab("performance");
  };

  // タブが変更されたときのハンドラー
  const handleTabChange = (value: string) => {
    
    // パフォーマンスタブが選択された場合、データを更新
    if (value === "performance") {
      calculateAndUpdatePerformance();
    }
    
    // アクティブタブの状態を更新
    setActiveTab(value);
  };

  // ラウンド情報タブへ移動
  const goToRoundTab = () => setActiveTab("round");
  
  // ホール入力タブへ移動
  const goToHoleTab = () => setActiveTab("holes");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const { data, error } = await supabase.from("players").select("*").order("name")

        if (error) throw error
        setPlayers(data)
      } catch (error) {
        console.error("Error fetching players:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayers()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golf-600"></div>
        <p className="mt-4 text-gray-600">データを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-golf-800">スコア入力</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ラウンド情報とパフォーマンスを入力してください。すべての情報は統計に反映されます。
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="fade-in">
        <TabsList className="mb-6 bg-white shadow-sm border border-gray-100 p-1 rounded-lg">
          <TabsTrigger value="round" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
            ラウンド情報
          </TabsTrigger>
          <TabsTrigger value="holes" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
            ホール別入力
          </TabsTrigger>
          <TabsTrigger 
            value="performance" 
            className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700"
          >
            パフォーマンス
          </TabsTrigger>
        </TabsList>

        <TabsContent value="round">
          <RoundInfoTabContent
            roundData={roundData}
            players={players}
            handleRoundChange={handleRoundChange}
            nextTab={goToHoleTab}
          />
        </TabsContent>

        <TabsContent value="holes">
          <HoleInputTabContent
            holes={holes}
            currentHole={currentHole}
            submitting={submitting}
            handleHoleChange={handleHoleChange}
            goToNextHole={goToNextHole}
            goToPrevHole={goToPrevHole}
            navigateToPrevTab={goToRoundTab}
            calculateAndUpdatePerformance={calculateAndUpdatePerformance}
            navigateToPerformanceTab={navigateToPerformanceTab}
            setCurrentHole={setCurrentHole}
            roundCount={roundData.round_count || 1}
            getTotalHoles={getTotalHoles} 
          />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTabContent
            performanceData={performanceData}
            submitting={submitting}
            handlePerformanceChange={handlePerformanceChange}
            handleSubmit={handleSubmit}
            navigateToPrevTab={goToHoleTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
