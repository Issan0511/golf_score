import React, { useState, useEffect } from "react"
import { FormField } from "@/components/ui/form-field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Flag, Trophy, Target, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoleScoreInputProps } from "@/types/score"

export function HoleScoreInput({ hole, handleHoleChange }: HoleScoreInputProps) {
  // 増減ボタンを使用するための関数
  const handleIncrement = (field: "score" | "putts") => {
    const currentValue = hole[field];
    handleHoleChange(field, currentValue + 1);
  };

  const handleDecrement = (field: "score" | "putts") => {
    const currentValue = hole[field];
    // 最小値を設定（スコアは1以上、パットは0以上）
    const minValue = field === "score" ? 1 : 0;
    if (currentValue > minValue) {
      handleHoleChange(field, currentValue - 1);
    }
  };
  
  return (
    <>
      <div className="grid grid-cols-1 gap-6 mb-8">
        <FormField label="パー" icon={<Flag className="h-4 w-4 text-golf-500" />}>
          <div className="flex items-center justify-start gap-2">
            {[3, 4, 5].map((parValue) => (
              <Button
                key={`par-${parValue}`}
                type="button"
                variant={hole.par === parValue ? "default" : "outline"}
                className={`h-12 w-12 rounded-md ${hole.par === parValue ? "bg-golf-500 hover:bg-golf-600 text-white" : "border-gray-300 hover:bg-golf-50"}`}
                onClick={() => handleHoleChange("par", parValue)}
              >
                {parValue}
              </Button>
            ))}
          </div>
        </FormField>

        <FormField label="スコア" icon={<Trophy className="h-4 w-4 text-golf-500" />}>
          <div className="flex items-center justify-start gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
                onClick={() => handleDecrement("score")}
              >
                <Minus className="h-5 w-5 text-red-600" />
              </Button>

              <div className="text-center">
                <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                  {hole.score}
                </div>
              </div>

              <Button 
                variant="outline" 
                size="icon"
                className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
                onClick={() => handleIncrement("score")}
              >
                <Plus className="h-5 w-5 text-blue-600" />
              </Button>
            </div>
          </div>
        </FormField>

        <FormField label="パット数" icon={<Target className="h-4 w-4 text-golf-500" />}>
          <div className="flex items-center justify-start gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
                onClick={() => handleDecrement("putts")}
                disabled={hole.putts <= 0}
              >
                <Minus className="h-5 w-5 text-red-600" />
              </Button>

              <div className="text-center">
                <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                  {hole.putts}
                </div>
              </div>

              <Button 
                variant="outline" 
                size="icon"
                className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
                onClick={() => handleIncrement("putts")}
              >
                <Plus className="h-5 w-5 text-blue-600" />
              </Button>
            </div>
          </div>
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-8">
        <FormField label="フェアウェイキープ" icon={<Flag className="h-4 w-4 text-golf-500" />}>
          <div className="flex gap-4">
            <Button 
              type="button"
              className={`h-14 flex-1 rounded-md shadow-sm font-medium transition-colors ${
                hole.fairwayHit 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-white hover:bg-gray-50 text-gray-700 border border-gray-200"
              }`}
              onClick={() => handleHoleChange("fairwayHit", !hole.fairwayHit)}
            >
              {hole.fairwayHit ? "成功" : "失敗"}
            </Button>
          </div>
        </FormField>
      </div>
    </>
  )
}