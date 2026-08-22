import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface StatsFilterProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  sortField: string
  setSortField: (value: string) => void
  sortDirection: "asc" | "desc"
  setSortDirection: (value: "asc" | "desc") => void
  showAllStats: boolean
  setShowAllStats: (value: boolean) => void
  showOldBoys: boolean
  setShowOldBoys: (value: boolean) => void
  startDate: string
  endDate: string
  setStartDate: (value: string) => void
  setEndDate: (value: string) => void
}

export function StatsFilter({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  showAllStats,
  setShowAllStats,
  showOldBoys,
  setShowOldBoys,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: StatsFilterProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="プレイヤー名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </div>
        <div className="w-full md:w-64">
          <button
            onClick={() => setShowAllStats(!showAllStats)}
            className={`w-full px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
              showAllStats
                ? "bg-golf-600 text-white border-golf-600 hover:bg-golf-700"
                : "bg-white text-golf-600 border-golf-600 hover:bg-golf-50"
            }`}
          >
            {showAllStats ? "基本項目を表示" : "距離帯別成功率を表示"}
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-end gap-3 border-t border-gray-100 pt-4">
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          開始日
          <Input type="date" value={startDate} max={endDate || undefined} onChange={(e) => setStartDate(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1 text-sm text-gray-600">
          終了日
          <Input type="date" value={endDate} min={startDate || undefined} onChange={(e) => setEndDate(e.target.value)} />
        </label>
        <button
          type="button"
          onClick={() => {
            setStartDate("")
            setEndDate("")
          }}
          disabled={!startDate && !endDate}
          className="h-10 px-4 text-sm rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          全期間に戻す
        </button>
        <p className="text-sm text-gray-500 sm:pb-2">未指定の側には期間の制限をかけません</p>
      </div>
      <label className="flex w-fit items-center gap-2 text-sm text-gray-600">
        <input
          type="checkbox"
          checked={showOldBoys}
          onChange={(event) => setShowOldBoys(event.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-golf-600 focus:ring-golf-500"
        />
        OB（4回生より上）も表示
      </label>
    </div>
  )
}
