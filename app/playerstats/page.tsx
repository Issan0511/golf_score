"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpDown } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { PlayerWithStats } from "@/types/player-stats"
import { BasicStatsTable } from "@/components/player-stats/basic-stats-table"
import { DistanceStatsTable } from "@/components/player-stats/distance-stats-table"
import { StatsFilter } from "@/components/player-stats/stats-filter"
import { calculatePlayerStats } from "@/lib/player-stats-calculator"
import type { Player, Round } from "@/lib/supabase"

const PLAYER_STATS_DATE_RANGE_KEY = "golf-score:playerstats-date-range"

function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export default function PlayerStatsPage() {
  const [players, setPlayers] = useState<PlayerWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAllStats, setShowAllStats] = useState(false)
  const [showOldBoys, setShowOldBoys] = useState(false)
  const [rounds, setRounds] = useState<Round[]>([])
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [dateRangeRestored, setDateRangeRestored] = useState(false)

  useEffect(() => {
    try {
      const savedDateRange = window.localStorage.getItem(PLAYER_STATS_DATE_RANGE_KEY)
      if (savedDateRange) {
        const parsedDateRange: unknown = JSON.parse(savedDateRange)
        if (parsedDateRange && typeof parsedDateRange === "object") {
          const { startDate: savedStartDate, endDate: savedEndDate } = parsedDateRange as Record<string, unknown>
          setStartDate(isIsoDate(savedStartDate) ? savedStartDate : "")
          setEndDate(isIsoDate(savedEndDate) ? savedEndDate : "")
        }
      }
    } catch (error) {
      console.warn("保存された統計期間を読み込めませんでした:", error)
    } finally {
      setDateRangeRestored(true)
    }
  }, [])

  useEffect(() => {
    if (!dateRangeRestored) return

    try {
      if (!startDate && !endDate) {
        window.localStorage.removeItem(PLAYER_STATS_DATE_RANGE_KEY)
        return
      }

      window.localStorage.setItem(PLAYER_STATS_DATE_RANGE_KEY, JSON.stringify({ startDate, endDate }))
    } catch (error) {
      console.warn("統計期間を保存できませんでした:", error)
    }
  }, [dateRangeRestored, startDate, endDate])

  useEffect(() => {
    async function fetchPlayersWithStats() {
      setLoading(true)
      try {
        // Fetch players
        const { data: playersData, error: playersError } = await supabase.from("players").select("*").order("name")

        if (playersError) throw playersError

        const { data: roundsData, error: roundsError } = await supabase
          .from("rounds")
          .select("*")

        if (roundsError) throw roundsError

        setRounds(roundsData as Round[])
        setPlayers((playersData as Player[]).map((player) => ({ ...player, stats: null, performance: null })))
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlayersWithStats()
  }, [])

  const playersForPeriod = useMemo(() => players.map((player) => {
    const playerRounds = rounds.filter((round) =>
      round.player_id === player.id &&
      (!startDate || (round.date != null && round.date >= startDate)) &&
      (!endDate || (round.date != null && round.date <= endDate)),
    )
    return { ...player, stats: calculatePlayerStats(playerRounds) }
  }), [players, rounds, startDate, endDate])

  // Filter players based on search term
  const currentAcademicYear = new Date().getMonth() >= 3 ? new Date().getFullYear() : new Date().getFullYear() - 1
  const oldestCurrentStudentAdmissionYear = currentAcademicYear - 3

  const normalizedSearchTerm = searchTerm.toLowerCase()
  const filteredPlayers = playersForPeriod.filter((player) => {
    const isOldBoy = player.admission_year != null && player.admission_year < oldestCurrentStudentAdmissionYear
    const matchesSearch = player.name.toLowerCase().includes(normalizedSearchTerm) ||
      Boolean(player.department?.toLowerCase().includes(normalizedSearchTerm))

    return (showOldBoys || !isOldBoy) && matchesSearch
  })

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
            showOldBoys={showOldBoys}
            setShowOldBoys={setShowOldBoys}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
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
              {(startDate || endDate) && (
                <span className="ml-3 text-sm font-normal text-gray-500">
                  {startDate || "最初"} 〜 {endDate || "現在"}
                </span>
              )}
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
