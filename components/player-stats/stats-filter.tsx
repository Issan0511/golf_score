import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
          placeholder="プレイヤー名または学部で検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-gray-200 focus:border-golf-500 focus:ring-golf-500"
        />
      </div>
      <div className="w-full md:w-64">
        <Select value={sortField} onValueChange={setSortField}>
          <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
            <SelectValue placeholder="並び替え項目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">名前</SelectItem>
            <SelectItem value="department">学部</SelectItem>
            <SelectItem value="avg_score">平均スコア</SelectItem>
            <SelectItem value="handicap">ハンディキャップ</SelectItem>
            <SelectItem value="avg_putt">平均パット数</SelectItem>
            <SelectItem value="pin_rate">ピン率</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-64">
        <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as "asc" | "desc")}>
          <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
            <SelectValue placeholder="並び順" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">昇順</SelectItem>
            <SelectItem value="desc">降順</SelectItem>
          </SelectContent>
        </Select>
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
          {showAllStats ? "基本項目のみ表示" : "全ての項目を表示"}
        </button>
      </div>
    </div>
  )
}