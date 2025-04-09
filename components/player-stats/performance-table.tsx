import Link from "next/link"
import { Cloud, Flag, GuitarIcon as Golf } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlayerWithStats } from "@/types/player-stats"

interface PerformanceTableProps {
  players: PlayerWithStats[]
}

export function PerformanceTable({ players }: PerformanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="font-semibold text-gray-700">名前</TableHead>
            
            {/* パット関連の統計 */}
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Golf className="h-4 w-4 mr-1 text-blue-500" />
                1パット
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Golf className="h-4 w-4 mr-1 text-blue-500" />
                3パット+
              </div>
            </TableHead>

            {/* グリーン関連の統計 */}
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Flag className="h-4 w-4 mr-1 text-green-500" />
                パーオン率
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Flag className="h-4 w-4 mr-1 text-green-500" />
                ボギーオン率
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Flag className="h-4 w-4 mr-1 text-red-500" />
                ピン奪取率
              </div>
            </TableHead>

            {/* OB関連の統計 - 既存フィールドを使用 */}
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Cloud className="h-4 w-4 mr-1 text-gray-500" />
                OB(1W)
              </div>
            </TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player) => (
            <TableRow key={`perf-${player.id}`} className="hover:bg-golf-50">
              <TableCell>
                <Link
                  href={`/player/${player.id}`}
                  className="text-golf-600 hover:text-golf-800 font-medium hover:underline"
                >
                  {player.name}
                </Link>
              </TableCell>
              
              {/* パット関連の統計 */}
              <TableCell className="text-right font-medium">
                {player.stats?.avg_one_putts != null ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {player.stats.avg_one_putts.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.avg_three_putts_or_more != null ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {player.stats.avg_three_putts_or_more.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>

              {/* グリーン関連の統計 - パーセンテージで表示 */}
              <TableCell className="text-right font-medium">
                {player.stats?.avg_par_on != null ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {player.stats.avg_par_on.toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.avg_bogey_on != null ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {player.stats.avg_bogey_on.toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.pin_rate != null ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {(player.stats.pin_rate * 100).toFixed(1)}%
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>

              {/* OB関連の統計 - 既存フィールドを使用 */}
              <TableCell className="text-right font-medium">
                {player.stats?.avg_ob1w != null ? (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {player.stats.avg_ob1w.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.avg_ob_2nd != null ? (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {player.stats.avg_ob_2nd.toFixed(1)}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.stats?.avg_ob_other != null ? (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {player.stats.avg_ob_other.toFixed(1)}
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