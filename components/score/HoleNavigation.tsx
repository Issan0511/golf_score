import React from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface HoleNavigationProps {
  currentHole: number
  goToPrevHole: () => void
  goToNextHole: () => void
}

export function HoleNavigation({ currentHole, goToPrevHole, goToNextHole }: HoleNavigationProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Button
        variant="outline"
        onClick={goToPrevHole}
        disabled={currentHole === 1}
        className="border-golf-500 text-golf-600 hover:bg-golf-50 flex items-center justify-center w-32"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        前のホール
      </Button>
      <div className="text-center bg-golf-50 px-6 py-3 rounded-full">

        <div className="text-2xl font-bold text-golf-800">{currentHole}</div>
      </div>
      <Button
        variant="outline"
        onClick={goToNextHole}
        disabled={currentHole === 18}
        className="border-golf-500 text-golf-600 hover:bg-golf-50 flex items-center justify-center w-32"
      >
        次のホール
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  )
}