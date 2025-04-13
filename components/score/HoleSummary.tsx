import React from "react"
import { Trophy } from "lucide-react"
import { HoleSummaryProps } from "@/types/score"

export function HoleSummary({ 
  holes, 
  currentHole, 
  handleHoleChange, 
  setCurrentHole,
  totalHoles = 18 // デフォルト値を18に設定
}: HoleSummaryProps & { totalHoles?: number }) {
  // パーとの差分を計算して表示する関数
  const renderParDiff = (hole: any) => {
    if (!hole || !hole.score || hole.score === 0 || !hole.par || hole.par === 0) return null;
    
    const diff = hole.score - hole.par;
    if (diff === 0) return <span className="text-gray-600">パー</span>;
    if (diff > 0) return <span className="text-red-600">+{diff}</span>;
    return <span className="text-blue-600">{diff}</span>;
  };

  // ホール一覧を動的に生成する
  const renderHoleButtons = () => {
    return Array.from({ length: totalHoles }, (_, i) => (
      <div
        key={i + 1}
        className={`p-2 rounded-lg cursor-pointer transition-all duration-200 ${
          currentHole === i + 1
            ? "bg-golf-500 text-white font-bold"
            : "bg-white border border-gray-200 hover:bg-golf-50"
        }`}
        onClick={() => setCurrentHole(i + 1)}
      >
        <div>{i + 1}</div>
        <div className={`text-xs mt-1 ${currentHole === i + 1 ? "text-white" : ""}`}>
          {renderParDiff(holes[i])}
        </div>
      </div>
    ));
  };

  // ホールボタンをグリッド表示するための配列を分割する
  const renderHoleGrid = () => {
    const holeButtons = renderHoleButtons();
    // 9ホールごとに区切る（最大で3行まで対応）
    const rows = [];
    
    for (let i = 0; i < totalHoles; i += 9) {
      rows.push(
        <div key={`row-${i}`} className="grid grid-cols-9 gap-1 text-center mb-2">
          {holeButtons.slice(i, Math.min(i + 9, totalHoles))}
        </div>
      );
    }
    
    return rows;
  };
  
  return (
    <div className="border-t border-gray-200 pt-6">
      <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
        <Trophy className="h-5 w-5 mr-2 text-amber-500" />
        ホール別スコア一覧
      </h3>
      
      {renderHoleGrid()}

      <div className="mt-6 bg-golf-50 rounded-lg p-6 text-center">
        <div className="text-sm text-golf-700">TOTAL</div>
        <div className="text-3xl font-bold text-golf-800">
          {holes.slice(0, totalHoles).reduce((sum, hole) => sum + (hole?.score || 0), 0)}
        </div>
      </div>
    </div>
  )
}