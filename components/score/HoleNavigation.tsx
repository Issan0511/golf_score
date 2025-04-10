import React from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { HoleNavigationProps } from '@/types/score'

export const HoleNavigation: React.FC<HoleNavigationProps> = ({
  currentHole,
  totalHoles,
  goToPrevHole,
  goToNextHole
}) => {
  return (
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
        disabled={currentHole === totalHoles}
        className="border-golf-500 text-golf-600 hover:bg-golf-50 flex items-center"
      >
        次のホール
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}