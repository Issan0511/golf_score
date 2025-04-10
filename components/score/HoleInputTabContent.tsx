import React, { useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Flag, Trophy, Cloud, ChevronLeft, ChevronRight, Target } from "lucide-react"
import { FormField } from "@/components/ui/form-field"

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

interface HoleInputTabContentProps {
  holes: HoleData[]
  currentHole: number
  submitting: boolean
  handleHoleChange: (field: string, value: any) => void
  goToNextHole: () => void
  goToPrevHole: () => void
  handleSubmit: () => void
  navigateToPrevTab: () => void
  calculateAndUpdatePerformance?: () => void // 新しいpropsを追加
  navigateToPerformanceTab?: () => void      // 新しいpropsを追加
}

export function HoleInputTabContent({
  holes,
  currentHole,
  submitting,
  handleHoleChange,
  goToNextHole,
  goToPrevHole,
  handleSubmit,
  navigateToPrevTab,
  calculateAndUpdatePerformance, // 新しいpropsを受け取る
  navigateToPerformanceTab,      // 新しいpropsを受け取る
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

  // 最短距離のショット成功を記録するハンドラー
  const handleShotSuccess = () => {
    const shortestDistance = getShortestApproachDistance()
    if (shortestDistance === 0) return; // 距離が設定されていない場合は何もしない
    
    const successFieldMap = {
      30: "shotsuccess30",
      80: "shotsuccess80",
      120: "shotsuccess120",
      160: "shotsuccess160",
      180: "shotsuccess180",
      181: "shotsuccess181plus"
    };
    
    const field = successFieldMap[shortestDistance as keyof typeof successFieldMap];
    if (field) {
      const currentValue = holes[currentHole - 1][field as keyof typeof holes[0]] as number;
      handleHoleChange(field, (currentValue !== undefined ? currentValue : 0) + 1);
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
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="outline"
              onClick={goToPrevHole}
              disabled={currentHole === 1}
              className="border-golf-500 text-golf-600 hover:bg-golf-50 flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              前のホール
            </Button>
            <div className="text-center bg-golf-50 px-6 py-3 rounded-full">
              <div className="text-sm text-golf-700">ホール</div>
              <div className="text-2xl font-bold text-golf-800">{currentHole}</div>
            </div>
            <Button
              variant="outline"
              onClick={goToNextHole}
              disabled={currentHole === holes.length}
              className="border-golf-500 text-golf-600 hover:bg-golf-50 flex items-center"
            >
              次のホール
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <FormField label="パー" icon={<Flag className="h-4 w-4 text-golf-500" />}>
              <Select
                value={holes[currentHole - 1].par.toString()}
                onValueChange={(value) => handleHoleChange("par", Number.parseInt(value))}
              >
                <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                  <SelectValue placeholder="パーを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="スコア" icon={<Trophy className="h-4 w-4 text-golf-500" />}>
              <Input
                id="score"
                type="number"
                value={holes[currentHole - 1].score}
                onChange={(e) => handleHoleChange("score", Number.parseInt(e.target.value))}
                min={1}
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>

            <FormField label="パット数" icon={<Flag className="h-4 w-4 text-golf-500" />}>
              <Input
                id="putts"
                type="number"
                value={holes[currentHole - 1].putts}
                onChange={(e) => handleHoleChange("putts", Number.parseInt(e.target.value))}
                min={0}
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Checkbox
                id="fairwayHit"
                checked={holes[currentHole - 1].fairwayHit}
                onCheckedChange={(checked) => handleHoleChange("fairwayHit", checked)}
                className="text-golf-500 focus:ring-golf-500"
              />
              <Label htmlFor="fairwayHit" className="text-gray-700 cursor-pointer flex-1">
                フェアウェイキープ
              </Label>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8">
            <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
              <Cloud className="h-5 w-5 mr-2 text-gray-500" />
              OB
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="OB(ドライバー)回数">
                <Input
                  id="ob1w"
                  type="number"
                  value={holes[currentHole - 1].ob1w !== undefined ? holes[currentHole - 1].ob1w : 0}
                  onChange={(e) => handleHoleChange("ob1w", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              </FormField>
              <FormField label="OB(その他)回数">
                <Input
                  id="obOther"
                  type="number"
                  value={holes[currentHole - 1].obOther !== undefined ? holes[currentHole - 1].obOther : 0}
                  onChange={(e) => handleHoleChange("obOther", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              </FormField>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
            <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
              <Flag className="h-5 w-5 mr-2 text-golf-500" />
              グリーンショット回数
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FormField label="~30m">
                <Input
                  id="shotCount30"
                  type="number"
                  value={holes[currentHole - 1].shotCount30 !== undefined ? holes[currentHole - 1].shotCount30 : 0}
                  onChange={(e) => handleShotCountChange("shotCount30", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                  placeholder="0"
                />
              </FormField>

              <FormField label="31~80m">
                <Input
                  id="shotCount80"
                  type="number"
                  value={holes[currentHole - 1].shotCount80 !== undefined ? holes[currentHole - 1].shotCount80 : 0}
                  onChange={(e) => handleShotCountChange("shotCount80", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                  placeholder="0"
                />
              </FormField>

              <FormField label="81~120m">
                <Input
                  id="shotCount120"
                  type="number"
                  value={holes[currentHole - 1].shotCount120 !== undefined ? holes[currentHole - 1].shotCount120 : 0}
                  onChange={(e) => handleShotCountChange("shotCount120", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                  placeholder="0"
                />
              </FormField>

              <FormField label="121~160m">
                <Input
                  id="shotCount160"
                  type="number"
                  value={holes[currentHole - 1].shotCount160 !== undefined ? holes[currentHole - 1].shotCount160 : 0}
                  onChange={(e) => handleShotCountChange("shotCount160", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                  placeholder="0"
                />
              </FormField>

              <FormField label="161~180m">
                <Input
                  id="shotCount180"
                  type="number"
                  value={holes[currentHole - 1].shotCount180 !== undefined ? holes[currentHole - 1].shotCount180 : 0}
                  onChange={(e) => handleShotCountChange("shotCount180", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                  placeholder="0"
                />
              </FormField>

              <FormField label="181m+">
                <Input
                  id="shotCount181plus"
                  type="number"
                  value={holes[currentHole - 1].shotCount181plus !== undefined ? holes[currentHole - 1].shotCount181plus : 0}
                  onChange={(e) => handleShotCountChange("shotCount181plus", Number.parseInt(e.target.value))}
                  min={0}
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                  placeholder="0"
                />
              </FormField>
            </div>

            {getShortestApproachDistance() > 0 && (
              <div className="mt-5 p-4 bg-golf-50 rounded-lg">
                <h4 className="text-md font-medium mb-3 text-golf-800 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-golf-600" />
                  アプローチ情報
                </h4>
                <div className="mb-3">
                  <div className="text-sm text-gray-600 mb-1">
                    最短アプローチ距離: {getShortestApproachDistance()}m
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <Checkbox
                    id="pinHit"
                    checked={holes[currentHole - 1].pinHit}
                    onCheckedChange={(checked) => handleHoleChange("pinHit", checked)}
                    className="text-golf-500 focus:ring-golf-500"
                  />
                  <Label htmlFor="pinHit" className="text-gray-700 cursor-pointer flex-1">
                    ピン奪取（1ピン）
                  </Label>
                </div>

                {getShortestApproachDistance() > 0 && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="shotSuccess"
                      checked={
                        getSuccessValueForCurrentDistance(getShortestApproachDistance()) > 0
                      }
                      onCheckedChange={(checked) => handleShotSuccessChange(checked as boolean)}
                      className="text-golf-500 focus:ring-golf-500"
                    />
                    <Label htmlFor="shotSuccess" className="text-gray-700 cursor-pointer flex-1">
                      ショット成功
                    </Label>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
            <Trophy className="h-5 w-5 mr-2 text-amber-500" />
            ホール別スコア一覧
          </h3>
          <div className="grid grid-cols-9 gap-1 text-center mb-2">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i + 1}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentHole === i + 1
                    ? "bg-golf-500 text-white font-bold"
                    : "bg-white border border-gray-200 hover:bg-golf-50"
                }`}
                onClick={() => handleHoleChange("currentHole", i + 1)}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-9 gap-1 text-center">
            {Array.from({ length: 9 }, (_, i) => (
              <div
                key={i + 10}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
                  currentHole === i + 10
                    ? "bg-golf-500 text-white font-bold"
                    : "bg-white border border-gray-200 hover:bg-golf-50"
                }`}
                onClick={() => handleHoleChange("currentHole", i + 10)}
              >
                {i + 10}
              </div>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="text-sm text-gray-500">OUT</div>
              <div className="text-2xl font-bold text-golf-800">
                {holes.slice(0, 9).reduce((sum, hole) => sum + hole.score, 0)}
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
              <div className="text-sm text-gray-500">IN</div>
              <div className="text-2xl font-bold text-golf-800">
                {holes.slice(9, 18).reduce((sum, hole) => sum + hole.score, 0)}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-golf-50 rounded-lg p-6 text-center">
            <div className="text-sm text-golf-700">TOTAL</div>
            <div className="text-3xl font-bold text-golf-800">
              {holes.reduce((sum, hole) => sum + hole.score, 0)}
            </div>
          </div>
        </div>
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
