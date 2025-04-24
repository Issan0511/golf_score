"use client";

import { useEffect, useState } from "react"
import { supabase, type Player, type PlayerStats } from "@/lib/supabase"
import { PlusCircle } from "lucide-react"
import { useLoadingNavigation } from "@/hooks/use-loading-navigation"
import { LoadingModal } from "@/components/ui/loading-modal"
import { Button } from "@/components/ui/button"
import { PlayerForm } from "@/components/player/PlayerForm"
import { PlayerCard } from "@/components/player/PlayerCard"

async function getPlayers() {
  try {
    const { data, error } = await supabase.from("players").select("*").order("name")

    if (error) {
      console.error("Error fetching players:", error)
      console.error("Error details:", JSON.stringify(error))
      return []
    }

    return data as Player[]
  } catch (e) {
    console.error("Exception fetching players:", e)
    return []
  }
}

async function getPlayerStats(playerId: string) {
  try {
    const { data, error } = await supabase.from("playerstats").select("*").eq("id", playerId).single();

    // 新規追加したプレイヤーは統計情報がないのでエラーは正常
    if (error) {
      // データが見つからない場合は警告レベルのログにし、nullを返す
      if (error.code === 'PGRST116') {
        console.log("-console by copilot-\n", `No stats found for player ${playerId} - This is normal for new players`);
      } else {
        // その他のエラーの場合はエラーログを出力
        console.error(`Error fetching stats for player ${playerId}:`, error);
      }
      return null;
    }

    return data as PlayerStats;
  } catch (e) {
    console.error(`Exception fetching stats for player ${playerId}:`, e);
    return null;
  }
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [playersWithStats, setPlayersWithStats] = useState<(Player & { stats: PlayerStats | null })[]>([])
  const [loading, setLoading] = useState(true)
  const { isNavigating, navigate } = useLoadingNavigation()
  
  // モーダル関連の状態
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false)
  const [isEditPlayerModalOpen, setIsEditPlayerModalOpen] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null)

  // データの取得
  const fetchPlayers = async () => {
    setLoading(true)
    try {
      const playersData = await getPlayers()
      setPlayers(playersData)
      
      console.log("-console by copilot-\n", "Fetched players:", playersData.length)
      
      // 全プレイヤーの統計情報を並行で取得
      const playersWithStatsData = await Promise.all(
        playersData.map(async (player) => {
          const stats = await getPlayerStats(player.id)
          return { ...player, stats }
        })
      )
      setPlayersWithStats(playersWithStatsData)
    } catch (error) {
      console.error("Error loading players:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [])
  
  // 現在の年度を計算
  const now = new Date()
  const currentYear = now.getFullYear()
  // 4月1日より前なら前年度とする
  const currentFiscalYear = now.getMonth() < 3 ? currentYear - 1 : currentYear
  
  // 回生順にプレイヤーをソート
  const sortedPlayers = [...playersWithStats].sort((a, b) => {
    // admission_yearがない場合は最後に
    if (!a.admission_year) return 1;
    if (!b.admission_year) return -1;
    
    // 回生を計算
    const gradeA = currentFiscalYear - a.admission_year + 1;
    const gradeB = currentFiscalYear - b.admission_year + 1;
    
    // OB（5回生以上）は最後に
    const isOBA = gradeA > 4;
    const isOBB = gradeB > 4;
    
    if (isOBA && !isOBB) return 1;  // Aだけがインフルエンサーの場合、後ろに
    if (!isOBA && isOBB) return -1; // Bだけがインフルエンサーの場合、前に
    
    // 両方OBか両方現役の場合は回生順（小さい順）
    if (isOBA && isOBB) {
      // 両方OBの場合は入学年度の新しい順（回生の小さい順）
      return b.admission_year - a.admission_year;
    } else {
      // 両方現役の場合は回生の小さい順
      return gradeA - gradeB;
    }
  });

  // プレイヤー追加または更新後のコールバック
  const handlePlayerChanged = () => {
    fetchPlayers() // プレイヤーリストを再取得
  }
  
  // 編集ボタンがクリックされたときの処理
  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player)
    setIsEditPlayerModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isLoading={loading || isNavigating} message={loading ? "プレイヤーデータを読み込み中..." : "詳細ページに移動中..."} />
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-golf-800">プレイヤー一覧</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ゴルフ部の全メンバーを一覧で表示しています。各プレイヤーのプロフィールや基本統計情報を確認できます。
        </p>
      </div>
      
      <div className="mb-6 flex justify-center">
        <Button 
          onClick={() => setIsAddPlayerModalOpen(true)}
          className="bg-golf-600 hover:bg-golf-700 text-white"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          プレイヤーを追加
        </Button>
      </div>

      {/* 新規追加モーダル */}
      <PlayerForm 
        isOpen={isAddPlayerModalOpen}
        onClose={() => setIsAddPlayerModalOpen(false)}
        onSuccess={handlePlayerChanged}
        mode="create"
      />
      
      {/* 編集モーダル */}
      <PlayerForm 
        isOpen={isEditPlayerModalOpen}
        onClose={() => setIsEditPlayerModalOpen(false)}
        onSuccess={handlePlayerChanged}
        player={selectedPlayer}
        mode="edit"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedPlayers.map((player) => (
          <PlayerCard 
            key={player.id} 
            player={player} 
            stats={player.stats} 
            currentFiscalYear={currentFiscalYear}
            onViewDetails={() => navigate(`/player/${player.id}`)}
            onEdit={handleEditPlayer}
          />
        ))}
      </div>
    </div>
  )
}

