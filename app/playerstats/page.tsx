"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown, Trophy } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PlayerWithStats } from "@/types/player-stats"
import { BasicStatsTable } from "@/components/player-stats/basic-stats-table"
import { DistanceStatsTable } from "@/components/player-stats/distance-stats-table"
import { StatsFilter } from "@/components/player-stats/stats-filter"

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<PlayerWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAllStats, setShowAllStats] = useState(false)

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
          // Get player stats
          const { data: statsData, error: statsError } = await supabase
            .from("playerstats")
            .select("*")
            .eq("id", player.id)
            .single()

          // Get performance data
          const { data: perfData, error: perfError } = await supabase
            .from("performance")
            .select("*")
            .eq("id", player.id)
            .single()

          playersWithStats.push({
            ...player,
            stats: statsError ? null : statsData,
            performance: perfError ? null : perfData
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

    // Sort by stats fields - 型安全な処理に修正
    if (a.stats && b.stats && sortField in a.stats && sortField in b.stats) {
      const statsA = (a.stats[sortField as keyof typeof a.stats] as number | null) ?? 0
      const statsB = (b.stats[sortField as keyof typeof b.stats] as number | null) ?? 0
      return sortDirection === "asc" ? statsA - statsB : statsB - statsA
    }
    
    // どちらかのstatsがない場合は、statsがあるプレイヤーを優先
    if (a.stats && !b.stats) return sortDirection === "asc" ? -1 : 1
    if (!a.stats && b.stats) return sortDirection === "asc" ? 1 : -1
    
    // どちらもstatsがない場合は、名前でソート
    return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
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
          <StatsFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortField={sortField}
            setSortField={setSortField}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            showAllStats={showAllStats}
            setShowAllStats={setShowAllStats}
          />
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
              {showAllStats ? "距離帯別成功率" : "統計一覧"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {showAllStats ? (
              <DistanceStatsTable
                players={sortedPlayers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            ) : (
              <BasicStatsTable
                players={sortedPlayers}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

