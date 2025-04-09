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
}

export function StatsFilter({
  searchTerm,
  setSearchTerm,
  sortField,
  setSortField,
  sortDirection,
  setSortDirection,
  showAllStats,
  setShowAllStats
}: StatsFilterProps) {
  return (
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
  )
}