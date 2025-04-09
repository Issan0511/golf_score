"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { supabase, type Player } from "@/lib/supabase"
import { Calendar, Cloud, Flag, GuitarIcon as Golf, Trophy, User, MessageSquare } from "lucide-react"

// 抽出したコンポーネントとフックをインポート
import { FormField } from "@/components/ui/form-field"
import { SectionCard } from "@/components/ui/section-card"
import { DistanceInputGroup } from "@/components/score/distance-input-group"
import { useScoreData } from "@/hooks/use-score-data"
import { RoundBasicInfoCard } from "@/components/RoundBasicInfoCard"
import { useHoleData } from "@/hooks/use-hole-data"

export default function SubmitScorePage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  const {
    roundData,
    performanceData,
    submitting,
    handleRoundChange,
    handlePerformanceChange,
    handleSubmit,
  } = useScoreData()

  const {
    holes,
    currentHole,
    handleHoleChange,
    goToNextHole,
    goToPrevHole,
    handleSubmit: handleHoleSubmit,
  } = useHoleData()

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

      <Tabs defaultValue="round" className="fade-in">
        <TabsList className="mb-6 bg-white shadow-sm border border-gray-100 p-1 rounded-lg">
          <TabsTrigger value="round" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
            ラウンド情報
          </TabsTrigger>
          <TabsTrigger value="holes" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
            ホール別入力
          </TabsTrigger>
          <TabsTrigger value="performance" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
            パフォーマンス
          </TabsTrigger>
        </TabsList>

        <TabsContent value="round">
          <RoundBasicInfoCard
            mode="basic"
            roundData={roundData}
            players={players}
            handleRoundChange={handleRoundChange}
            nextTab={() => document.querySelector('[data-value="holes"]')?.click()}
          />
        </TabsContent>

        <TabsContent value="holes">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-golf-800">ホール {currentHole} の入力</CardTitle>
                  <CardDescription>各ホールのスコアとパフォーマンスを入力してください</CardDescription>
                </div>
                <Badge className="bg-golf-600 text-white px-3 py-1 text-lg">{currentHole} / 18</Badge>
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
                    disabled={currentHole === 18}
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

                  <FormField label="パット数" icon={<Golf className="h-4 w-4 text-golf-500" />}>
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

                  <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Checkbox
                      id="greenHit"
                      checked={holes[currentHole - 1].greenHit}
                      onCheckedChange={(checked) => handleHoleChange("greenHit", checked)}
                      className="text-golf-500 focus:ring-golf-500"
                    />
                    <Label htmlFor="greenHit" className="text-gray-700 cursor-pointer flex-1">
                      グリーンオン
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Checkbox
                      id="pinHit"
                      checked={holes[currentHole - 1].pinHit}
                      onCheckedChange={(checked) => handleHoleChange("pinHit", checked)}
                      className="text-golf-500 focus:ring-golf-500"
                    />
                    <Label htmlFor="pinHit" className="text-gray-700 cursor-pointer flex-1">
                      ピン奪取
                    </Label>
                  </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <Checkbox
                      id="ob"
                      checked={holes[currentHole - 1].ob}
                      onCheckedChange={(checked) => handleHoleChange("ob", checked)}
                      className="text-golf-500 focus:ring-golf-500"
                    />
                    <Label htmlFor="ob" className="text-gray-700 font-medium cursor-pointer">
                      OB
                    </Label>
                  </div>

                  {holes[currentHole - 1].ob && (
                    <div className="space-y-2 pl-6">
                      <Label htmlFor="obType" className="text-gray-700">
                        OBタイプ
                      </Label>
                      <Select
                        value={holes[currentHole - 1].obType}
                        onValueChange={(value) => handleHoleChange("obType", value)}
                      >
                        <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                          <SelectValue placeholder="OBタイプを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1w">1W</SelectItem>
                          <SelectItem value="2nd">セカンド</SelectItem>
                          <SelectItem value="other">その他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
                    <Flag className="h-5 w-5 mr-2 text-golf-500" />
                    アプローチ
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="アプローチ距離 (m)">
                      <Input
                        id="approachDistance"
                        type="number"
                        value={holes[currentHole - 1].approachDistance}
                        onChange={(e) => handleHoleChange("approachDistance", Number.parseInt(e.target.value))}
                        min={0}
                        className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                      />
                    </FormField>

                    {holes[currentHole - 1].approachDistance > 0 && (
                      <div className="flex items-center space-x-2 p-3 bg-golf-50 rounded-lg">
                        <Checkbox
                          id="approachSuccess"
                          checked={holes[currentHole - 1].approachSuccess}
                          onCheckedChange={(checked) => handleHoleChange("approachSuccess", checked)}
                          className="text-golf-500 focus:ring-golf-500"
                        />
                        <Label htmlFor="approachSuccess" className="text-gray-700 cursor-pointer flex-1">
                          アプローチ成功
                        </Label>
                      </div>
                    )}
                  </div>
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
                      onClick={() => setCurrentHole(i + 1)}
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
                      onClick={() => setCurrentHole(i + 10)}
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
                onClick={() => document.querySelector('[data-value="round"]')?.click()}
                className="border-golf-500 text-golf-600 hover:bg-golf-50"
              >
                戻る: ラウンド情報
              </Button>
              <Button onClick={handleHoleSubmit} disabled={submitting} className="bg-golf-600 hover:bg-golf-700 text-white">
                {submitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    送信中...
                  </>
                ) : (
                  "スコアを登録する"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
              <CardTitle className="text-golf-800">パフォーマンス</CardTitle>
              <CardDescription>ラウンド中のパフォーマンスを入力してください</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <SectionCard title="スコアとパット数" icon={<Trophy className="h-5 w-5 text-amber-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="トータルスコア">
                    <Input
                      id="score"
                      type="number"
                      value={performanceData.score || ""}
                      onChange={(e) => handlePerformanceChange("score", Number.parseInt(e.target.value))}
                      placeholder="例: 85"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                  <FormField label="パット数">
                    <Input
                      id="putts"
                      type="number"
                      value={performanceData.putts || ""}
                      onChange={(e) => handlePerformanceChange("putts", Number.parseInt(e.target.value))}
                      placeholder="例: 32"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                </div>
              </SectionCard>

              <SectionCard title="パット" icon={<Golf className="h-5 w-5 text-blue-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="1パット数">
                    <Input
                      id="one_putts"
                      type="number"
                      value={performanceData.one_putts || ""}
                      onChange={(e) => handlePerformanceChange("one_putts", Number.parseInt(e.target.value))}
                      placeholder="例: 5"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                  <FormField label="3パット以上の数">
                    <Input
                      id="three_putts_or_more"
                      type="number"
                      value={performanceData.three_putts_or_more || ""}
                      onChange={(e) => handlePerformanceChange("three_putts_or_more", Number.parseInt(e.target.value))}
                      placeholder="例: 2"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                </div>
              </SectionCard>

              <SectionCard title="グリーン" icon={<Flag className="h-5 w-5 text-red-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="パーオン数">
                    <Input
                      id="par_on"
                      type="number"
                      value={performanceData.par_on || ""}
                      onChange={(e) => handlePerformanceChange("par_on", Number.parseInt(e.target.value))}
                      placeholder="例: 8"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                  <FormField label="ボギーオン数">
                    <Input
                      id="bogey_on"
                      type="number"
                      value={performanceData.bogey_on || ""}
                      onChange={(e) => handlePerformanceChange("bogey_on", Number.parseInt(e.target.value))}
                      placeholder="例: 6"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                  <FormField label="ピン奪取数">
                    <Input
                      id="in_pin"
                      type="number"
                      value={performanceData.in_pin || ""}
                      onChange={(e) => handlePerformanceChange("in_pin", Number.parseInt(e.target.value))}
                      placeholder="例: 4"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                </div>
              </SectionCard>

              <SectionCard title="OB" icon={<Cloud className="h-5 w-5 text-gray-500" />}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField label="OB（1W）">
                    <Input
                      id="ob_1w"
                      type="number"
                      value={performanceData.ob_1w || ""}
                      onChange={(e) => handlePerformanceChange("ob_1w", Number.parseInt(e.target.value))}
                      placeholder="例: 1"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                  <FormField label="OB（その他）">
                    <Input
                      id="ob_other"
                      type="number"
                      value={performanceData.ob_other || ""}
                      onChange={(e) => handlePerformanceChange("ob_other", Number.parseInt(e.target.value))}
                      placeholder="例: 0"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                  <FormField label="OB（セカンド）">
                    <Input
                      id="ob_2nd"
                      type="number"
                      value={performanceData.ob_2nd || ""}
                      onChange={(e) => handlePerformanceChange("ob_2nd", Number.parseInt(e.target.value))}
                      placeholder="例: 0"
                      className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    />
                  </FormField>
                </div>
              </SectionCard>

              <SectionCard title="距離帯別成功率" icon={<Trophy className="h-5 w-5 text-amber-500" />}>
                <DistanceInputGroup
                  title="1-30m"
                  successValue={performanceData.dist_1_30_success}
                  totalValue={performanceData.dist_1_30_total}
                  onSuccessChange={(value) => handlePerformanceChange("dist_1_30_success", value)}
                  onTotalChange={(value) => handlePerformanceChange("dist_1_30_total", value)}
                />

                <DistanceInputGroup
                  title="31-80m"
                  successValue={performanceData.dist_31_80_success}
                  totalValue={performanceData.dist_31_80_total}
                  onSuccessChange={(value) => handlePerformanceChange("dist_31_80_success", value)}
                  onTotalChange={(value) => handlePerformanceChange("dist_31_80_total", value)}
                />

                <DistanceInputGroup
                  title="81-120m"
                  successValue={performanceData.dist_81_120_success}
                  totalValue={performanceData.dist_81_120_total}
                  onSuccessChange={(value) => handlePerformanceChange("dist_81_120_success", value)}
                  onTotalChange={(value) => handlePerformanceChange("dist_81_120_total", value)}
                />

                <DistanceInputGroup
                  title="121-160m"
                  successValue={performanceData.dist_121_160_success}
                  totalValue={performanceData.dist_121_160_total}
                  onSuccessChange={(value) => handlePerformanceChange("dist_121_160_success", value)}
                  onTotalChange={(value) => handlePerformanceChange("dist_121_160_total", value)}
                />

                <DistanceInputGroup
                  title="161-180m"
                  successValue={performanceData.dist_161_180_success}
                  totalValue={performanceData.dist_161_180_total}
                  onSuccessChange={(value) => handlePerformanceChange("dist_161_180_success", value)}
                  onTotalChange={(value) => handlePerformanceChange("dist_161_180_total", value)}
                />

                <DistanceInputGroup
                  title="181m+"
                  successValue={performanceData.dist_181_plus_success}
                  totalValue={performanceData.dist_181_plus_total}
                  onSuccessChange={(value) => handlePerformanceChange("dist_181_plus_success", value)}
                  onTotalChange={(value) => handlePerformanceChange("dist_181_plus_total", value)}
                />
              </SectionCard>
            </CardContent>
            <CardFooter className="bg-gray-50 p-6 border-t border-gray-100 flex justify-between">
              <Button
                variant="outline"
                onClick={() => document.querySelector('[data-value="holes"]')?.click()}
                className="border-golf-500 text-golf-600 hover:bg-golf-50"
              >
                戻る: ホール別入力
              </Button>
              <Button onClick={handleSubmit} disabled={submitting} className="bg-golf-600 hover:bg-golf-700 text-white">
                {submitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    送信中...
                  </>
                ) : (
                  "スコアを登録する"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
