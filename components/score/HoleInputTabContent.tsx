import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HoleData, HoleInputProps } from "@/types/score"
import { ScoreInputSection } from "./ScoreInputSection"
import { OBInputSection } from "./OBInputSection"
import { ApproachInputSection } from "./ApproachInputSection"
import { HoleNavigation } from "./HoleNavigation"
import { HoleSummary } from "./HoleSummary"

export function HoleInputTabContent({
  holes,
  currentHole,
  submitting,
  handleHoleChange,
  goToNextHole,
  goToPrevHole,
  handleSubmit,
  navigateToPrevTab,
  calculateAndUpdatePerformance,
  navigateToPerformanceTab,
}: HoleInputProps) {
  // ホールデータが空の場合や不正な場合にエラーを防ぐ
  const safeCurrentHole = Math.max(1, Math.min(currentHole, holes.length || 1));
  const currentHoleData = holes[safeCurrentHole - 1] || {
    number: safeCurrentHole,
    par: 4,
    score: 4,
    putts: 2,
    fairwayHit: false,
    pinHit: false,
    ob1w: 0,
    obOther: 0,
    ob_2nd: 0,
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
  };

  const getShortestApproachDistance = () => {
    // ホールデータが無効な場合は0を返す
    if (!holes.length || !currentHoleData) return 0;

    if (currentHoleData.shotCount30 > 0) return 30;
    if (currentHoleData.shotCount80 > 0) return 80;
    if (currentHoleData.shotCount120 > 0) return 120;
    if (currentHoleData.shotCount160 > 0) return 160;
    if (currentHoleData.shotCount180 > 0) return 180;
    if (currentHoleData.shotCount181plus > 0) return 181;
    
    return 0;
  }

  const handleShotCountChange = (field: string, value: number) => {
    handleHoleChange(field, value)
  }

  const getSuccessValueForCurrentDistance = (distance: number): number => {
    if (!distance) return 0;
    
    switch (distance) {
      case 30: return currentHoleData.shotsuccess30 !== undefined ? currentHoleData.shotsuccess30 : 0;
      case 80: return currentHoleData.shotsuccess80 !== undefined ? currentHoleData.shotsuccess80 : 0;
      case 120: return currentHoleData.shotsuccess120 !== undefined ? currentHoleData.shotsuccess120 : 0;
      case 160: return currentHoleData.shotsuccess160 !== undefined ? currentHoleData.shotsuccess160 : 0;
      case 180: return currentHoleData.shotsuccess180 !== undefined ? currentHoleData.shotsuccess180 : 0;
      case 181: return currentHoleData.shotsuccess181plus !== undefined ? currentHoleData.shotsuccess181plus : 0;
      default: return 0;
    }
  }

  const handleShotSuccessChange = (checked: boolean) => {
    const distance = getShortestApproachDistance();
    if (!distance) return;
    
    let field = '';
    switch (distance) {
      case 30: field = 'shotsuccess30'; break;
      case 80: field = 'shotsuccess80'; break;
      case 120: field = 'shotsuccess120'; break;
      case 160: field = 'shotsuccess160'; break;
      case 180: field = 'shotsuccess180'; break;
      case 181: field = 'shotsuccess181plus'; break;
    }
    
    if (field) {
      // チェックされた場合は1、そうでなければ0を設定
      handleHoleChange(field, checked ? 1 : 0);
    }
  }

  // ホール入力完了時のハンドラー
  const handleCompleteHoleInput = () => {
    console.log("===== 「次へ：パフォーマンス入力」ボタンがクリックされました =====");
    console.log("現在のホールデータ:", JSON.stringify(holes, null, 2));
    
    // パフォーマンスデータを更新する関数が提供されていれば実行
    if (calculateAndUpdatePerformance) {
      console.log("calculateAndUpdatePerformance関数を実行します");
      calculateAndUpdatePerformance();
    } else {
      console.log("calculateAndUpdatePerformance関数がありません");
    }
    
    // パフォーマンスタブに遷移する関数が提供されていれば実行
    if (navigateToPerformanceTab) {
      console.log("navigateToPerformanceTab関数を実行します");
      navigateToPerformanceTab();
    } else {
      console.log("navigateToPerformanceTab関数がありません。通常のsubmit処理を実行します");
      handleSubmit();
    }
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-golf-800">ホール {currentHole} の入力</CardTitle>
            <CardDescription>各ホールのスコアとパフォーマンスを入力してください</CardDescription>
          </div>
          <Badge className="bg-golf-600 text-white px-3 py-1 text-lg">{currentHole} / {holes.length}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <HoleNavigation
            currentHole={currentHole}
            totalHoles={holes.length}
            goToPrevHole={goToPrevHole}
            goToNextHole={goToNextHole}
          />

          <ScoreInputSection
            currentHoleData={currentHoleData}
            handleHoleChange={handleHoleChange}
          />

          <OBInputSection
            currentHoleData={currentHoleData}
            handleHoleChange={handleHoleChange}
          />

          <ApproachInputSection
            currentHoleData={currentHoleData}
            handleHoleChange={handleHoleChange}
            handleShotCountChange={handleShotCountChange}
            getShortestApproachDistance={getShortestApproachDistance}
            getSuccessValueForCurrentDistance={getSuccessValueForCurrentDistance}
            handleShotSuccessChange={handleShotSuccessChange}
          />
        </div>

        <HoleSummary
          holes={holes}
          currentHole={currentHole}
          handleHoleChange={handleHoleChange}
        />
      </CardContent>
      <CardFooter className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between">
        <Button
          variant="outline"
          onClick={navigateToPrevTab}
          className="border-golf-500 text-golf-600 hover:bg-golf-50"
        >
          戻る: ラウンド情報
        </Button>
        <div className="flex gap-2">
          {navigateToPerformanceTab && (
            <Button 
              onClick={handleCompleteHoleInput} 
              disabled={submitting} 
              className="bg-golf-600 hover:bg-golf-700 text-white"
            >
              次へ: パフォーマンス入力
            </Button>
          )}
          {!navigateToPerformanceTab && (
            <Button 
              onClick={handleSubmit} 
              disabled={submitting} 
              className="bg-golf-600 hover:bg-golf-700 text-white"
            >
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  送信中...
                </>
              ) : (
                "スコアを登録する"
              )}
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
