import React from 'react'
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Flag, Target } from 'lucide-react'
import { FormField } from "@/components/ui/form-field"
import { ApproachInputSectionProps } from '@/types/score'

export const ApproachInputSection: React.FC<ApproachInputSectionProps> = ({
  currentHoleData,
  handleHoleChange,
  handleShotCountChange,
  getShortestApproachDistance,
  getSuccessValueForCurrentDistance,
  handleShotSuccessChange
}) => {
  return (
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
            value={currentHoleData.shotCount30 !== undefined ? currentHoleData.shotCount30 : 0}
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
            value={currentHoleData.shotCount80 !== undefined ? currentHoleData.shotCount80 : 0}
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
            value={currentHoleData.shotCount120 !== undefined ? currentHoleData.shotCount120 : 0}
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
            value={currentHoleData.shotCount160 !== undefined ? currentHoleData.shotCount160 : 0}
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
            value={currentHoleData.shotCount180 !== undefined ? currentHoleData.shotCount180 : 0}
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
            value={currentHoleData.shotCount181plus !== undefined ? currentHoleData.shotCount181plus : 0}
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
              checked={currentHoleData.pinHit}
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
  )
}