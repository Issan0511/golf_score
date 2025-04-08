import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { supabase, type Player, type PlayerStats, type Round } from "@/lib/supabase"
import { ArrowLeft, School, Calendar, MapPin, Trophy, Cloud, Flag, GuitarIcon as Golf } from "lucide-react"

interface PlayerPageProps {
  params: Promise<{
    id: string
  }>
}

async function getPlayer(id: string) {
  const { data, error } = await supabase.from("players").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching player:", error)
    return null
  }

  return data as Player
}

async function getPlayerStats(id: string) {
  const { data, error } = await supabase.from("playerstats").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching player stats:", error)
    return null
  }

  return data as PlayerStats
}

async function getPlayerRounds(id: string) {
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("player_id", id)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching player rounds:", error)
    return []
  }

  return data as Round[]
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  // paramsをawaitして実際の値を取得
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const player = await getPlayer(id);

  if (!player) {
    notFound();
  }

  const stats = await getPlayerStats(id);
  const rounds = await getPlayerRounds(id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/players">
          <Button variant="ghost" size="sm" className="text-golf-600 hover:text-golf-700 hover:bg-golf-50">
            <ArrowLeft className="h-4 w-4 mr-2" />
            プレイヤー一覧に戻る
          </Button>
        </Link>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-8">
        <div className="fade-in">
          <Card className="border-0 shadow-lg overflow-hidden">
            <div className="w-full aspect-square relative bg-gradient-to-br from-golf-100 to-golf-50">
              <Image
                src={player.image_url || "/placeholder.svg?height=300&width=300"}
                alt={player.name}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-4 text-golf-800">{player.name}</h1>
              <div className="space-y-3 text-sm">
                {player.department && (
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-golf-500" />
                    <span className="text-gray-700">{player.department}</span>
                  </div>
                )}
                {player.admission_year && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-golf-500" />
                    <span className="text-gray-700">{player.admission_year}年入学</span>
                  </div>
                )}
                {player.origin && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-golf-500" />
                    <span className="text-gray-700">{player.origin}出身</span>
                  </div>
                )}
                {player.highschool && (
                  <div className="flex items-center">
                    <School className="h-4 w-4 mr-2 text-golf-500" />
                    <span className="text-gray-700">{player.highschool}</span>
                  </div>
                )}
              </div>

              {stats?.handicap && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">ハンディキャップ</span>
                    <Badge className="bg-golf-600 text-white px-2 py-1">{stats.handicap.toFixed(1)}</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Tabs defaultValue="stats" className="fade-in">
            <TabsList className="mb-6 bg-white shadow-sm border border-gray-100 p-1 rounded-lg">
              <TabsTrigger value="stats" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
                統計情報
              </TabsTrigger>
              <TabsTrigger value="rounds" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
                ラウンド履歴
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              {stats ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      title="平均スコア"
                      value={stats.avg_score}
                      decimals={1}
                      icon={<Trophy className="h-5 w-5 text-amber-500" />}
                    />
                    <StatCard
                      title="平均パット数"
                      value={stats.avg_putt}
                      decimals={1}
                      icon={<Golf className="h-5 w-5 text-blue-500" />}
                    />
                    <StatCard
                      title="ピン率"
                      value={stats.pin_rate}
                      decimals={1}
                      suffix="%"
                      icon={<Flag className="h-5 w-5 text-red-500" />}
                      multiplier={100}
                    />
                    <StatCard
                      title="平均OB数"
                      value={stats.avg_ob1w}
                      decimals={2}
                      icon={<Cloud className="h-5 w-5 text-gray-500" />}
                    />
                  </div>

                  <Card className="border-0 shadow-md overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
                      <CardTitle className="text-golf-800">距離帯別成功率</CardTitle>
                      <CardDescription>各距離帯におけるショットの成功率</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        <DistanceStatCard title="1-30m" value={stats.dist_1_30} />
                        <DistanceStatCard title="31-80m" value={stats.dist_31_80} />
                        <DistanceStatCard title="81-120m" value={stats.dist_81_120} />
                        <DistanceStatCard title="121-160m" value={stats.dist_121_160} />
                        <DistanceStatCard title="161-180m" value={stats.dist_161_180} />
                        <DistanceStatCard title="181m+" value={stats.dist_181_plus} />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">統計情報がありません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="rounds">
              {rounds.length > 0 ? (
                <div className="space-y-4">
                  {rounds.map((round) => (
                    <RoundCard key={round.id} round={round} />
                  ))}
                </div>
              ) : (
                <Card className="border-0 shadow-md">
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">ラウンド履歴がありません</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  decimals = 0,
  suffix = "",
  icon,
  multiplier = 1,
}: {
  title: string
  value?: number
  decimals?: number
  suffix?: string
  icon?: React.ReactNode
  multiplier?: number
}) {
  const displayValue = value !== undefined && value !== null ? (value * multiplier).toFixed(decimals) : "-"

  return (
    <Card className="border-0 shadow-md overflow-hidden">
      <CardContent className="p-0">
        <div className="flex items-center p-4 bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
          {icon}
          <CardDescription className="ml-2">{title}</CardDescription>
        </div>
        <div className="p-4 text-center">
          <div className="text-2xl font-bold text-golf-800">
            {displayValue}
            {suffix}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DistanceStatCard({ title, value }: { title: string; value?: number }) {
  const percentage = value !== undefined && value !== null ? value * 100 : 0

  return (
    <div className="text-center">
      <div className="text-sm font-medium mb-2 text-gray-700">{title}</div>
      <div className="relative h-24 w-full flex items-end justify-center mb-2">
        <div className="absolute bottom-0 w-full bg-gray-100 rounded-sm" style={{ height: "100%" }}></div>
        <div
          className="absolute bottom-0 w-full bg-golf-500 rounded-sm transition-all duration-1000"
          style={{ height: `${percentage}%` }}
        ></div>
        <div className="absolute bottom-2 text-white text-xs font-bold">
          {value !== undefined && value !== null ? `${percentage.toFixed(1)}%` : "-"}
        </div>
      </div>
      <div className="text-sm text-gray-600">
        {value !== undefined && value !== null ? `${(value * 100).toFixed(1)}%` : "-"}
      </div>
    </div>
  )
}

function RoundCard({ round }: { round: Round }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-100 bg-gradient-to-r from-golf-50 to-white">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h3 className="font-bold text-lg text-golf-800">{round.course_name || "コース名なし"}</h3>
              <p className="text-sm text-gray-500 flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {round.date ? new Date(round.date).toLocaleDateString("ja-JP") : "日付なし"}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-golf-700">{round.score_total || "-"}</div>
              <div className="text-sm text-gray-600">
                {round.score_out && round.score_in ? `${round.score_out} - ${round.score_in}` : ""}
              </div>
            </div>
          </div>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <Golf className="h-4 w-4 mr-2 text-golf-500" />
              <span className="text-gray-700">パット: {round.putts || "-"}</span>
            </div>
            <div className="flex items-center">
              <Cloud className="h-4 w-4 mr-2 text-golf-500" />
              <span className="text-gray-700">天気: {round.weather || "-"}</span>
            </div>
            <div className="flex items-center">
              <Flag className="h-4 w-4 mr-2 text-golf-500" />
              <span className="text-gray-700">使用ティー: {round.used_tee || "-"}</span>
            </div>
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-golf-500" />
              <span className="text-gray-700">競技: {round.is_competition ? "はい" : "いいえ"}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

