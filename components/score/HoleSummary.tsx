import React from "react"
import { Trophy } from "lucide-react"
import { HoleSummaryProps } from "@/types/score"

export function HoleSummary({ holes, currentHole, handleHoleChange }: HoleSummaryProps) {
  return (
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
  )
}