import React from "react"
import { FormField } from "@/components/ui/form-field"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Flag, Target, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ApproachShotInputProps } from "@/types/score"

export function ApproachShotInput({ 
  hole, 
  handleHoleChange, 
  handleShotCountChange,
  handleShotSuccessChange,
  getShortestApproachDistance,
  getSuccessValueForCurrentDistance
}: ApproachShotInputProps) {
  // 増減ボタンを使用するための関数
  const handleIncrement = (field: string) => {
    const currentValue = hole[field as keyof typeof hole] as number;
    handleShotCountChange(field, currentValue + 1);
  };

  const handleDecrement = (field: string) => {
    const currentValue = hole[field as keyof typeof hole] as number;
    // 最小値を0に設定
    if (currentValue > 0) {
      handleShotCountChange(field, currentValue - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
        <Flag className="h-5 w-5 mr-2 text-golf-500" />
        グリーンショット回数
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FormField label="~30m">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("shotCount30")}
              disabled={hole.shotCount30 <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.shotCount30 !== undefined ? hole.shotCount30 : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("shotCount30")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </FormField>

        <FormField label="31~80m">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("shotCount80")}
              disabled={hole.shotCount80 <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.shotCount80 !== undefined ? hole.shotCount80 : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("shotCount80")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </FormField>

        <FormField label="81~120m">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("shotCount120")}
              disabled={hole.shotCount120 <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.shotCount120 !== undefined ? hole.shotCount120 : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("shotCount120")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </FormField>

        <FormField label="121~160m">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("shotCount160")}
              disabled={hole.shotCount160 <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.shotCount160 !== undefined ? hole.shotCount160 : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("shotCount160")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </FormField>

        <FormField label="161~180m">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("shotCount180")}
              disabled={hole.shotCount180 <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.shotCount180 !== undefined ? hole.shotCount180 : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("shotCount180")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </FormField>

        <FormField label="181m+">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("shotCount181plus")}
              disabled={hole.shotCount181plus <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.shotCount181plus !== undefined ? hole.shotCount181plus : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("shotCount181plus")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
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
            <Button 
              type="button"
              className={`h-12 flex-1 rounded-md shadow-sm font-medium transition-colors ${
                hole.pinHit 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
              }`}
              onClick={() => handleHoleChange("pinHit", !hole.pinHit)}
            >
              {hole.pinHit ? "1ピン: 成功" : "1ピン: なし"}
            </Button>
          </div>

          {/* {getShortestApproachDistance() > 0 && (
            <div className="flex items-center space-x-2">
              <Button 
                type="button"
                className={`h-12 flex-1 rounded-md shadow-sm font-medium transition-colors ${
                  getSuccessValueForCurrentDistance(getShortestApproachDistance()) > 0
                    ? "bg-green-500 hover:bg-green-600 text-white" 
                    : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
                }`}
                onClick={() => handleShotSuccessChange(!getSuccessValueForCurrentDistance(getShortestApproachDistance()))}
              >
                {getSuccessValueForCurrentDistance(getShortestApproachDistance()) > 0 
                  ? "ショット成功: ○" 
                  : "ショット成功: ×"}
              </Button>
            </div>
          )} */}
        </div>
      )}
    </div>
  )
}