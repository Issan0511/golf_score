import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, Trophy, GuitarIcon as Golf, Flag, Cloud } from "lucide-react"
import { PlayerWithStats } from "@/types/player-stats"

interface BasicStatsTableProps {
  players: PlayerWithStats[]
  sortField: string
  sortDirection: "asc" | "desc"
  onSort: (field: string) => void
}

export function BasicStatsTable({ players, sortField, sortDirection, onSort }: BasicStatsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600"
              onClick={() => onSort("name")}
            >
              名前 {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600"
              onClick={() => onSort("department")}
            >
              学部 {sortField === "department" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
              onClick={() => onSort("avg_score")}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                平均スコア {sortField === "avg_score" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
              onClick={() => onSort("handicap")}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-golf-500" />
                HC {sortField === "handicap" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
              onClick={() => onSort("avg_putt")}
            >
              <div className="flex items-center justify-end">
                <Golf className="h-4 w-4 mr-1 text-blue-500" />
                平均パット {sortField === "avg_putt" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
              onClick={() => onSort("pin_rate")}
            >
              <div className="flex items-center justify-end">
                <Flag className="h-4 w-4 mr-1 text-red-500" />
                ピン率 {sortField === "pin_rate" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
              onClick={() => onSort("avg_ob1w")}
            >
              <div className="flex items-center justify-end">
                <Cloud className="h-4 w-4 mr-1 text-gray-500" />
                OB(1W) {sortField === "avg_ob1w" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={player.id} className="hover:bg-golf-50">
              <TableCell>
                <Link
                  href={`/player/${player.id}`}
                  className="text-golf-600 hover:text-golf-800 font-medium hover:underline"
                >
                  {player.name}
                </Link>
              </TableCell>
              <TableCell className="text-gray-600">{player.department || "-"}</TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.avg_score !== undefined && player.stats?.avg_score !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {player.stats.avg_score.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.handicap !== undefined && player.stats?.handicap !== null ? (
                  <Badge variant="outline" className="bg-golf-50 text-golf-700 border-golf-200">
                    {player.stats.handicap.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.avg_putt !== undefined && player.stats?.avg_putt !== null ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {player.stats.avg_putt.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.pin_rate !== undefined && player.stats?.pin_rate !== null ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {(player.stats.pin_rate * 100).toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.avg_ob1w !== undefined && player.stats?.avg_ob1w !== null ? (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {player.stats.avg_ob1w.toFixed(2)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}