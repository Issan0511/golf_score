import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HoleInputTabContentProps, HoleData } from "@/types/score"
import { HoleScoreInput } from "./HoleScoreInput"
import { OBInput } from "./OBInput"
import { ApproachShotInput } from "./ApproachShotInput"
import { HoleSummary } from "./HoleSummary"
import { NavigationButtons } from "./NavigationButtons"
import { HoleNavigation } from "./HoleNavigation"

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
  setCurrentHole,
}: HoleInputTabContentProps) {
  const getShortestApproachDistance = () => {
    const hole = holes[currentHole - 1]

    if (hole.shotCount30 > 0) return 30;
    if (hole.shotCount80 > 0) return 80;
    if (hole.shotCount120 > 0) return 120;
    if (hole.shotCount160 > 0) return 160;
    if (hole.shotCount180 > 0) return 180;
    if (hole.shotCount181plus > 0) return 181;
    
    return 0;
  }

  const handleShotCountChange = (field: string, value: number) => {
    handleHoleChange(field, value)
  }

  const getSuccessValueForCurrentDistance = (distance: number): number => {
    if (!distance) return 0;
    const hole = holes[currentHole - 1];
    
    switch (distance) {
      case 30: return hole.shotsuccess30 !== undefined ? hole.shotsuccess30 : 0;
      case 80: return hole.shotsuccess80 !== undefined ? hole.shotsuccess80 : 0;
      case 120: return hole.shotsuccess120 !== undefined ? hole.shotsuccess120 : 0;
      case 160: return hole.shotsuccess160 !== undefined ? hole.shotsuccess160 : 0;
      case 180: return hole.shotsuccess180 !== undefined ? hole.shotsuccess180 : 0;
      case 181: return hole.shotsuccess181plus !== undefined ? hole.shotsuccess181plus : 0;
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

  const currentHoleData = holes[currentHole - 1];

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-golf-800">ホール {currentHole} の入力</CardTitle>
          </div>
          <Badge className="bg-golf-600 text-white px-3 py-1 text-lg min-w-[60px]">{currentHole} / 18</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <HoleNavigation 
            currentHole={currentHole} 
            goToPrevHole={goToPrevHole} 
            goToNextHole={goToNextHole} 
          />

          <HoleScoreInput 
            hole={currentHoleData}
            handleHoleChange={(field, value) => handleHoleChange(field, value)}
          />

          <OBInput 
            hole={currentHoleData}
            handleHoleChange={(field, value) => handleHoleChange(field, value)}
          />

          <ApproachShotInput 
            hole={currentHoleData}
            handleHoleChange={(field, value) => handleHoleChange(field, value)}
            handleShotCountChange={handleShotCountChange}
            handleShotSuccessChange={handleShotSuccessChange}
            getShortestApproachDistance={getShortestApproachDistance}
            getSuccessValueForCurrentDistance={getSuccessValueForCurrentDistance}
          />
        </div>

        <HoleSummary 
          holes={holes} 
          currentHole={currentHole} 
          handleHoleChange={handleHoleChange}
          setCurrentHole={(holeNumber) => setCurrentHole(holeNumber)}
        />
      </CardContent>
      <CardFooter className="bg-gray-50 p-6 border-t border-gray-100">
        <NavigationButtons 
          currentHole={currentHole}
          submitting={submitting}
          navigateToPrevTab={navigateToPrevTab}
          navigateToPerformanceTab={navigateToPerformanceTab}
          handleCompleteHoleInput={handleCompleteHoleInput}
          handleSubmit={handleSubmit}
        />
      </CardFooter>
    </Card>
  )
}