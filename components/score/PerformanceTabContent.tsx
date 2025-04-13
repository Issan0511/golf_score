import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, GuitarIcon as Golf, Flag, Cloud } from "lucide-react"
import { FormField } from "@/components/ui/form-field"
import { SectionCard } from "@/components/ui/section-card"
import { DistanceInputGroup } from "@/components/score/distance-input-group"

interface PerformanceTabContentProps {
  performanceData: any
  submitting: boolean
  handlePerformanceChange: (field: string, value: any) => void
  handleSubmit: () => void
  navigateToPrevTab: () => void
}

export function PerformanceTabContent({
  performanceData,
  submitting,
  handlePerformanceChange,
  handleSubmit,
  navigateToPrevTab,
}: PerformanceTabContentProps) {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
        <CardTitle className="text-golf-800">パフォーマンス</CardTitle>
        <CardDescription>ラウンド中のパフォーマンスデータを確認して登録してください</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <SectionCard title="パット" icon={<Golf className="h-5 w-5 text-blue-500" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="1パット数">
              <Input
                id="one_putts"
                type="number"
                value={performanceData.one_putts !== undefined ? performanceData.one_putts : ""}
                onChange={(e) => handlePerformanceChange("one_putts", Number.parseInt(e.target.value))}
                placeholder="例: 5"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            <FormField label="3パット以上の数">
              <Input
                id="three_putts_or_more"
                type="number"
                value={performanceData.three_putts_or_more !== undefined ? performanceData.three_putts_or_more : ""}
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
                value={performanceData.par_on !== undefined ? performanceData.par_on : ""}
                onChange={(e) => handlePerformanceChange("par_on", Number.parseInt(e.target.value))}
                placeholder="例: 8"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            <FormField label="ボギーオン数">
              <Input
                id="bogey_on"
                type="number"
                value={performanceData.bogey_on !== undefined ? performanceData.bogey_on : ""}
                onChange={(e) => handlePerformanceChange("bogey_on", Number.parseInt(e.target.value))}
                placeholder="例: 6"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            <FormField label="ピン奪取数">
              <Input
                id="in_pin"
                type="number"
                value={performanceData.in_pin !== undefined ? performanceData.in_pin : ""}
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
                value={performanceData.ob_1w !== undefined ? performanceData.ob_1w : ""}
                onChange={(e) => handlePerformanceChange("ob_1w", Number.parseInt(e.target.value))}
                placeholder="例: 1"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            <FormField label="OB（その他）">
              <Input
                id="ob_other"
                type="number"
                value={performanceData.ob_other !== undefined ? performanceData.ob_other : ""}
                onChange={(e) => handlePerformanceChange("ob_other", Number.parseInt(e.target.value))}
                placeholder="例: 0"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            <FormField label="OB（セカンド）">
              <Input
                id="ob_2nd"
                type="number"
                value={performanceData.ob_2nd !== undefined ? performanceData.ob_2nd : ""}
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
          onClick={navigateToPrevTab}
          className="border-golf-500 text-golf-600 hover:bg-golf-50"
        >
          戻る: ホール別入力
        </Button>
        <Button 
          onClick={() => {
            console.log("スコア登録ボタンがクリックされました");
            handleSubmit();
          }} 
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
      </CardFooter>
    </Card>
  )
}