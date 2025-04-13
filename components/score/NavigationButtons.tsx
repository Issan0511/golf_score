import React from "react"
import { Button } from "@/components/ui/button"
import { NavigationButtonsProps } from "@/types/score"

export function NavigationButtons({
  currentHole,
  submitting,
  navigateToPrevTab,
  navigateToPerformanceTab,
  handleCompleteHoleInput,
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between">
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
            次へ
          </Button>
        )}

      </div>
    </div>
  )
}