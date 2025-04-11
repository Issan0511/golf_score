import React from "react"
import { Button } from "@/components/ui/button"
import { NavigationButtonsProps } from "@/types/score"

export function NavigationButtons({
  currentHole,
  submitting,
  navigateToPrevTab,
  navigateToPerformanceTab,
  handleCompleteHoleInput,
  handleSubmit
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
    </div>
  )
}