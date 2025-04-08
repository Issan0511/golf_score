"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase, type Player, type PlayerStats } from "@/lib/supabase"
import { Search, ArrowUpDown, Trophy, GuitarIcon as Golf, Flag, Cloud } from "lucide-react"

type PlayerWithStats = Player & {
  stats: PlayerStats | null
}

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<PlayerWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    async function fetchPlayersWithStats() {
      setLoading(true)
      try {
        // Fetch players
        const { data: playersData, error: playersError } = await supabase.from("players").select("*").order("name")

        if (playersError) throw playersError

        const playersWithStats: PlayerWithStats[] = []

        // Fetch stats for each player
        for (const player of playersData) {
          const { data: statsData, error: statsError } = await supabase
            .from("playerstats")
            .select("*")
            .eq("id", player.id)
            .single()

          playersWithStats.push({
            ...player,
            stats: statsError ? null : statsData,
          })
        }

        setPlayers(playersWithStats)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayersWithStats()
  }, [])

  // Filter players based on search term
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (player.department && player.department.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Sort players based on selected field and direction
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortField === "name") {
      return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    }

    if (sortField === "department") {
      const deptA = a.department || ""
      const deptB = b.department || ""
      return sortDirection === "asc" ? deptA.localeCompare(deptB) : deptB.localeCompare(deptA)
    }

    // Sort by stats fields
    const statsA = (a.stats?.[sortField as keyof PlayerStats] as number | undefined) || 0
    const statsB = (b.stats?.[sortField as keyof PlayerStats] as number | undefined) || 0

    return sortDirection === "asc" ? statsA - statsB : statsB - statsA
  })

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-golf-800">プレイヤー統計比較</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          全プレイヤーの統計情報を一覧で比較できます。項目をクリックすると並び替えができます。
        </p>
      </div>

      <Card className="mb-8 border-0 shadow-md overflow-hidden">
        <CardContent className="p-6">
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
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golf-600"></div>
          <p className="mt-4 text-gray-600">データを読み込み中...</p>
        </div>
      ) : (
        <Card className="border-0 shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
            <CardTitle className="text-golf-800 flex items-center">
              <ArrowUpDown className="h-5 w-5 mr-2 text-golf-500" />
              統計一覧
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead
                      className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600"
                      onClick={() => handleSort("name")}
                    >
                      名前 {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600"
                      onClick={() => handleSort("department")}
                    >
                      学部 {sortField === "department" && (sortDirection === "asc" ? "↑" : "↓")}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
                      onClick={() => handleSort("avg_score")}
                    >
                      <div className="flex items-center justify-end">
                        <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                        平均スコア {sortField === "avg_score" && (sortDirection === "asc" ? "↑" : "↓")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
                      onClick={() => handleSort("handicap")}
                    >
                      <div className="flex items-center justify-end">
                        <Trophy className="h-4 w-4 mr-1 text-golf-500" />
                        HC {sortField === "handicap" && (sortDirection === "asc" ? "↑" : "↓")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
                      onClick={() => handleSort("avg_putt")}
                    >
                      <div className="flex items-center justify-end">
                        <Golf className="h-4 w-4 mr-1 text-blue-500" />
                        平均パット {sortField === "avg_putt" && (sortDirection === "asc" ? "↑" : "↓")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
                      onClick={() => handleSort("pin_rate")}
                    >
                      <div className="flex items-center justify-end">
                        <Flag className="h-4 w-4 mr-1 text-red-500" />
                        ピン率 {sortField === "pin_rate" && (sortDirection === "asc" ? "↑" : "↓")}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer font-semibold text-gray-700 hover:text-golf-600 text-right"
                      onClick={() => handleSort("avg_ob1w")}
                    >
                      <div className="flex items-center justify-end">
                        <Cloud className="h-4 w-4 mr-1 text-gray-500" />
                        OB(1W) {sortField === "avg_ob1w" && (sortDirection === "asc" ? "↑" : "↓")}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPlayers.map((player) => (
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}

