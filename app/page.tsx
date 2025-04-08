import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GolfIcon } from "@/components/golf-icon"
import { Users, BarChart2, PlusCircle, Trophy, Calendar, Flag } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="flex flex-col items-center justify-center space-y-6 text-center mb-16 fade-in">
        <div className="bg-gradient-to-r from-golf-400 to-golf-600 p-4 rounded-full shadow-lg">
          <GolfIcon className="h-12 w-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-golf-700 to-golf-500">
          ゴルフ部スコア管理アプリ
        </h1>
        <p className="max-w-[700px] text-gray-600 md:text-xl">
          部員のラウンドスコア・パフォーマンスを記録・可視化し、個人の成績管理と比較を容易にします。
        </p>
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          <Link href="/players">
            <Button className="bg-golf-600 hover:bg-golf-700 text-white px-6 py-2 rounded-full shadow-md transition-all duration-300 hover:shadow-lg">
              プレイヤー一覧を見る
            </Button>
          </Link>
          <Link href="/submit-score">
            <Button
              variant="outline"
              className="border-golf-600 text-golf-600 hover:bg-golf-50 px-6 py-2 rounded-full shadow-sm transition-all duration-300"
            >
              スコアを入力する
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Users className="h-10 w-10 text-golf-500" />}
          title="プレイヤー管理"
          description="部員のプロフィールと基本情報を確認できます。写真や学部、入学年度などの情報を一覧で表示します。"
          href="/players"
          buttonText="表示する"
        />

        <FeatureCard
          icon={<BarChart2 className="h-10 w-10 text-golf-500" />}
          title="統計比較"
          description="全部員の統計情報を一覧・比較できます。平均スコア、パット数、OB率などを並び替えて表示します。"
          href="/playerstats"
          buttonText="表示する"
        />

        <FeatureCard
          icon={<PlusCircle className="h-10 w-10 text-golf-500" />}
          title="スコア入力"
          description="ラウンド結果を簡単に記録できます。通常入力とホール別入力の2種類の方法から選べます。"
          href="/submit-score"
          buttonText="入力する"
        />
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <InfoCard
          icon={<Trophy className="h-8 w-8 text-amber-500" />}
          title="パフォーマンス分析"
          description="距離帯別の成功率やパット数などの詳細なパフォーマンス指標を記録・分析できます。"
        />
        <InfoCard
          icon={<Calendar className="h-8 w-8 text-blue-500" />}
          title="ラウンド履歴"
          description="過去のラウンド履歴をすべて保存し、いつでも振り返ることができます。"
        />
        <InfoCard
          icon={<Flag className="h-8 w-8 text-red-500" />}
          title="コース情報"
          description="プレーしたコースの情報や天候、使用ティーなどの詳細情報も記録できます。"
        />
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
  buttonText,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
  buttonText: string
}) {
  return (
    <Card className="overflow-hidden border-0 shadow-lg card-hover">
      <CardHeader className="p-6 bg-gradient-to-br from-golf-50 to-white">
        <div className="flex items-center gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">{icon}</div>
          <div>
            <CardTitle className="text-xl text-golf-800">{title}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardDescription className="text-gray-600 text-base min-h-[80px]">{description}</CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link href={href} className="w-full">
          <Button className="w-full bg-golf-600 hover:bg-golf-700 text-white">{buttonText}</Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function InfoCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start gap-4">
        <div className="bg-gray-50 p-3 rounded-lg">{icon}</div>
        <div>
          <h3 className="font-semibold text-lg mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  )
}

