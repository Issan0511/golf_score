import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase, type Player, type PlayerStats } from "@/lib/supabase"
import { School, Calendar, MapPin, Trophy } from "lucide-react"

async function getPlayers() {
  const { data, error } = await supabase.from("players").select("*").order("name")

  if (error) {
    console.error("Error fetching players:", error)
    return []
  }

  return data as Player[]
}

async function getPlayerStats(playerId: string) {
  const { data, error } = await supabase.from("playerstats").select("*").eq("id", playerId).single()

  if (error) {
    console.error(`Error fetching stats for player ${playerId}:`, error)
    return null
  }

  return data as PlayerStats
}

export default async function PlayersPage() {
  const players = await getPlayers()
  
  // 現在の年度を計算（PlayerCardコンポーネントと同じロジック）
  const now = new Date()
  const currentYear = now.getFullYear()
  // 4月1日より前なら前年度とする
  const currentFiscalYear = now.getMonth() < 3 ? currentYear - 1 : currentYear
  
  // 回生順にプレイヤーをソート
  const sortedPlayers = [...players].sort((a, b) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-golf-800">プレイヤー一覧</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ゴルフ部の全メンバーを一覧で表示しています。各プレイヤーのプロフィールや基本統計情報を確認できます。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {sortedPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

async function PlayerCard({ player }: { player: Player }) {
  const stats = await getPlayerStats(player.id)
  
  // 現在の年度を計算
  const now = new Date()
  const currentYear = now.getFullYear()
  // 4月1日より前なら前年度とする
  const currentFiscalYear = now.getMonth() < 3 ? currentYear - 1 : currentYear
  
  // 回生（学年）を計算
  let grade = 0
  if (player.admission_year) {
    grade = currentFiscalYear - player.admission_year + 1
  }
  
  // 学年表示用の文字列（4回生より上はOB）
  const gradeDisplay = player.admission_year 
    ? (grade > 4 ? 'OB' : `${grade}回生`) 
    : null
    
  // 回生に応じた色クラスを設定
  const getBadgeColorClass = (grade: number): string => {
    if (grade > 4) return 'bg-gray-700 hover:bg-gray-800'; // OB
    switch (grade) {
      case 1: return 'bg-blue-500 hover:bg-blue-600';      // 1回生
      case 2: return 'bg-emerald-500 hover:bg-emerald-600'; // 2回生
      case 3: return 'bg-amber-500 hover:bg-amber-600';    // 3回生
      case 4: return 'bg-red-500 hover:bg-red-600';        // 4回生
      default: return 'bg-golf-500 hover:bg-golf-600';     // デフォルト
    }
  }
  
  const badgeColorClass = player.admission_year ? getBadgeColorClass(grade) : 'bg-golf-500 hover:bg-golf-600';

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <CardHeader className="p-0">
        <div className="h-48 w-full relative bg-gradient-to-br from-golf-100 to-golf-50">
          <Image
            src={player.image_url || "/placeholder.svg?height=192&width=384"}
            alt={player.name}
            fill
            className="object-cover"
          />
          {stats?.handicap && (
            <div className="absolute top-3 right-3">
              <Badge className="bg-golf-600 hover:bg-golf-700 text-white px-2 py-1 text-xs font-semibold rounded-full">
                HC {stats.handicap.toFixed(1)}
              </Badge>
            </div>
          )}
          {gradeDisplay && (
            <div className="absolute top-3 left-3">
              <Badge className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${badgeColorClass}`}>
                {gradeDisplay}
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-3 text-golf-800">{player.name}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          {player.department && (
            <div className="flex items-center">
              <School className="h-4 w-4 mr-2 text-golf-500" />
              <span>{player.department}</span>
            </div>
          )}
          {player.admission_year && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-golf-500" />
              <span>{player.admission_year}年入学 {gradeDisplay && (
                <span className={`ml-1 text-xs font-semibold ${
                  grade > 4 ? 'text-gray-700' : 
                  grade === 1 ? 'text-blue-600' : 
                  grade === 2 ? 'text-emerald-600' :
                  grade === 3 ? 'text-amber-600' : 
                  grade === 4 ? 'text-red-600' : ''
                }`}>({gradeDisplay})</span>
              )}</span>
            </div>
          )}
          {player.origin && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-golf-500" />
              <span>{player.origin}出身</span>
            </div>
          )}
          {stats?.avg_score && (
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-golf-500" />
              <span>平均スコア: {stats.avg_score.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t border-gray-100">
        <Link href={`/player/${player.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full border-golf-500 text-golf-600 hover:bg-golf-50 hover:text-golf-700 transition-colors duration-300"
          >
            詳細を見る
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

