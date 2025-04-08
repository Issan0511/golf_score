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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-golf-800">プレイヤー一覧</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ゴルフ部の全メンバーを一覧で表示しています。各プレイヤーのプロフィールや基本統計情報を確認できます。
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  )
}

async function PlayerCard({ player }: { player: Player }) {
  const stats = await getPlayerStats(player.id)

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
              <span>{player.admission_year}年入学</span>
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

