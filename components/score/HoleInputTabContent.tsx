import React, { useEffect } from "react"
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
  navigateToPrevTab,
  calculateAndUpdatePerformance,
  navigateToPerformanceTab,
  setCurrentHole,
  roundCount = 1, // デフォルト値を1に設定
  getTotalHoles, // getTotalHoles関数を受け取る
}: HoleInputTabContentProps) {
  // ラウンド数に基づいた総ホール数を計算
  // getTotalHolesが提供されていればそれを使用、なければラウンド数から計算
  const totalHoles = getTotalHoles ? getTotalHoles() : 18 * roundCount;

  // マウント時と更新時に実行されるロジック
  useEffect(() => {
    // コンポーネントのマウント/更新ロジック
  }, [holes, currentHole]);

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
    
    // 変更後のホールデータを取得
    const updatedHoleData = holes[currentHole - 1];
    
    // -console by copilot-
    console.log("-console by copilot-\n", `Shot count changed: ${field} to ${value}`);
    console.log("-console by copilot-\n", "Current hole data:", updatedHoleData);
    
    // フィールド名から距離を抽出 (例: shotCount30 -> 30)
    const distanceChanged = field.replace('shotCount', '');
    const successField = `shotsuccess${distanceChanged}`;
    
    // 距離のショット回数が0になった場合、その距離の成功値も0にリセット
    if (value === 0) {
      // -console by copilot-
      console.log("-console by copilot-\n", `Resetting success value for ${distanceChanged} yards because count is 0`);
      handleHoleChange(successField, 0);
      
      // リセット後のホールデータを取得
      const afterResetHoleData = holes[currentHole - 1];
      console.log("-console by copilot-\n", "Hole data after resetting success value:", afterResetHoleData);
    }
    // 距離のショット回数が0より大きい場合、他の距離の成功値をリセット
    else if (value > 0) {
      // すべての距離の成功値をリセット対象として準備
      const resetFields = [
        'shotsuccess30', 
        'shotsuccess80', 
        'shotsuccess120', 
        'shotsuccess160', 
        'shotsuccess180', 
        'shotsuccess181plus'
      ];
      
      // 現在の距離に対応する成功フィールド以外をすべて0にリセット
      resetFields.forEach(field => {
        // 現在変更された距離に対応するフィールド以外をリセット
        if (field !== successField) {
          handleHoleChange(field, 0);
        }
      });
      
      // リセット後のホールデータを取得
      const afterResetHoleData = holes[currentHole - 1];
      
      // -console by copilot-
      console.log("-console by copilot-\n", `Reset success values except for ${distanceChanged} yards`);
      console.log("-console by copilot-\n", "Hole data after reset:", afterResetHoleData);
    }
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
    // パフォーマンスデータを更新する関数が提供されていれば実行
    if (calculateAndUpdatePerformance) {
      calculateAndUpdatePerformance();
    }
    
    // パフォーマンスタブに遷移する関数が提供されていれば実行
    if (navigateToPerformanceTab) {
      navigateToPerformanceTab();
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
          <Badge className="bg-golf-600 text-white px-3 py-1 text-lg min-w-[60px]">{currentHole} / {totalHoles}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-8">
          <HoleNavigation 
            currentHole={currentHole} 
            goToPrevHole={goToPrevHole} 
            goToNextHole={goToNextHole}
            totalHoles={totalHoles}
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
          totalHoles={totalHoles}
        />
      </CardContent>
      <CardFooter className="bg-gray-50 p-6 border-t border-gray-100">
        <NavigationButtons 
          currentHole={currentHole}
          submitting={submitting}
          navigateToPrevTab={navigateToPrevTab}
          navigateToPerformanceTab={navigateToPerformanceTab}
          handleCompleteHoleInput={handleCompleteHoleInput}
        />
      </CardFooter>
    </Card>
  )
}