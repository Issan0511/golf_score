import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy } from "lucide-react"
import { PlayerWithStats } from "@/types/player-stats"

interface DistanceStatsTableProps {
  players: PlayerWithStats[]
  sortField?: string
  sortDirection?: "asc" | "desc"
  onSort?: (field: string) => void
}

export function DistanceStatsTable({ players, sortField, sortDirection, onSort }: DistanceStatsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600" : "font-semibold text-gray-700"}
              onClick={onSort ? () => onSort("name") : undefined}
            >
              名前 {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
            </TableHead>
            
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right" : "font-semibold text-gray-700 text-right"}
              onClick={onSort ? () => onSort("avg_score") : undefined}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                平均スコア {sortField === "avg_score" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            
            {/* 距離帯別成功率 */}
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right" : "font-semibold text-gray-700 text-right"}
              onClick={onSort ? () => onSort("dist_1_30") : undefined}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                1-30m {sortField === "dist_1_30" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right" : "font-semibold text-gray-700 text-right"}
              onClick={onSort ? () => onSort("dist_31_80") : undefined}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                31-80m {sortField === "dist_31_80" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right" : "font-semibold text-gray-700 text-right"}
              onClick={onSort ? () => onSort("dist_81_120") : undefined}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                81-120m {sortField === "dist_81_120" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right" : "font-semibold text-gray-700 text-right"}
              onClick={onSort ? () => onSort("dist_121_160") : undefined}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                121-160m {sortField === "dist_121_160" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right" : "font-semibold text-gray-700 text-right"}
              onClick={onSort ? () => onSort("dist_161_180") : undefined}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                161-180m {sortField === "dist_161_180" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
            <TableHead 
              className={onSort ? "cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right" : "font-semibold text-gray-700 text-right"}
              onClick={onSort ? () => onSort("dist_181_plus") : undefined}
            >
              <div className="flex items-center justify-end">
                <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                181m+ {sortField === "dist_181_plus" && (sortDirection === "asc" ? "↑" : "↓")}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={`dist-${player.id}`} className="hover:bg-golf-50">
              <TableCell>
                <Link
                  href={`/player/${player.id}`}
                  className="text-golf-600 hover:text-golf-800 font-medium hover:underline"
                >
                  {player.name}
                </Link>
              </TableCell>
              
              <TableCell className="text-right font-medium">
                {player.stats?.avg_score !== undefined && player.stats?.avg_score !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {player.stats.avg_score.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              
              {/* 距離帯別成功率 */}
              <TableCell className="text-right font-medium">
                {player.stats?.dist_1_30 !== undefined && player.stats?.dist_1_30 !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {(player.stats.dist_1_30 * 100).toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.dist_31_80 !== undefined && player.stats?.dist_31_80 !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {(player.stats.dist_31_80 * 100).toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.dist_81_120 !== undefined && player.stats?.dist_81_120 !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {(player.stats.dist_81_120 * 100).toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.dist_121_160 !== undefined && player.stats?.dist_121_160 !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {(player.stats.dist_121_160 * 100).toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.dist_161_180 !== undefined && player.stats?.dist_161_180 !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {(player.stats.dist_161_180 * 100).toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.dist_181_plus !== undefined && player.stats?.dist_181_plus !== null ? (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {(player.stats.dist_181_plus * 100).toFixed(1)}%
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