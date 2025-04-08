import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { GuitarIcon as Golf, Flag, Cloud } from "lucide-react"
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
                パーオン
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Flag className="h-4 w-4 mr-1 text-green-500" />
                ボギーオン
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Flag className="h-4 w-4 mr-1 text-red-500" />
                ピン奪取
              </div>
            </TableHead>

            {/* OB関連の統計 */}
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Cloud className="h-4 w-4 mr-1 text-gray-500" />
                OB(1W)
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Cloud className="h-4 w-4 mr-1 text-gray-500" />
                OB(2打目)
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700 text-right">
              <div className="flex items-center justify-end">
                <Cloud className="h-4 w-4 mr-1 text-gray-500" />
                OB(その他)
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
                {player.performance?.one_putts !== undefined ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {player.performance.one_putts}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.performance?.three_putts_or_more !== undefined ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {player.performance.three_putts_or_more}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>

              {/* グリーン関連の統計 */}
              <TableCell className="text-right font-medium">
                {player.performance?.par_on !== undefined ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {player.performance.par_on}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.performance?.bogey_on !== undefined ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {player.performance.bogey_on}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.performance?.in_pin !== undefined ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                    {player.performance.in_pin}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>

              {/* OB関連の統計 */}
              <TableCell className="text-right font-medium">
                {player.performance?.ob_1w !== undefined ? (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {player.performance.ob_1w}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.performance?.ob_2nd !== undefined ? (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {player.performance.ob_2nd}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {player.performance?.ob_other !== undefined ? (
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                    {player.performance.ob_other}
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