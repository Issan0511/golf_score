import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { PlayerWithStats } from "@/types/player-stats"

interface DistanceStatsTableProps {
  players: PlayerWithStats[]
}

export function DistanceStatsTable({ players }: DistanceStatsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700">名前</TableHead>
            
            {/* 距離帯別成功率 */}
            <TableHead className="font-semibold text-gray-700 text-right">1-30m</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">31-80m</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">81-120m</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">121-160m</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">161-180m</TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">181m+</TableHead>
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