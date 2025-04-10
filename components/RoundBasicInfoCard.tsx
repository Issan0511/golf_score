// components/RoundBasicInfoCard.tsx
import React from "react";
import { Calendar, Cloud, Flag, GuitarIcon as Golf, Trophy, User, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField } from "@/components/ui/form-field";
import { type Round } from "@/lib/supabase";

interface RoundBasicInfoCardProps {
  mode: "basic" | "score";
  roundData: Partial<Round>;
  players: { id: string; name: string }[];
  handleRoundChange: (field: keyof Round, value: any) => void;
  nextTab: () => void;
}

export const RoundBasicInfoCard: React.FC<RoundBasicInfoCardProps> = ({
  mode,
  roundData,
  players,
  handleRoundChange,
  nextTab,
}) => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
        <CardTitle className="text-golf-800">ラウンド基本情報</CardTitle>
        <CardDescription>
          {mode === "score"
            ? "ラウンドの日付、コース、スコアなどの基本情報を入力してください"
            : "ラウンドの日付、コース、基本情報を入力してください"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label="プレイヤー" icon={<User className="h-4 w-4 text-golf-500" />}>
            <Select 
              value={roundData.player_id || ""} 
              onValueChange={(value) => handleRoundChange("player_id", value)}
            >
              <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                <SelectValue placeholder="プレイヤーを選択" />
              </SelectTrigger>
              <SelectContent>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="日付" icon={<Calendar className="h-4 w-4 text-golf-500" />}>
            <Input
              id="date"
              type="date"
              value={roundData.date || ""}
              onChange={(e) => handleRoundChange("date", e.target.value)}
              className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
            />
          </FormField>

          <FormField label="クラブ名" icon={<Golf className="h-4 w-4 text-golf-500" />}>
            <Input
              id="club_name"
              value={roundData.club_name || ""}
              onChange={(e) => handleRoundChange("club_name", e.target.value)}
              placeholder="日野ゴルフクラブ"
              className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
            />
          </FormField>

          <FormField label="コース名（オプション）" icon={<Flag className="h-4 w-4 text-golf-500" />}>
            <Input
              id="course_name"
              value={roundData.course_name || ""}
              onChange={(e) => handleRoundChange("course_name", e.target.value)}
              placeholder="例: クイーンIN-OUT"
              className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
            />
          </FormField>

          <FormField label="使用ティー" icon={<Flag className="h-4 w-4 text-golf-500" />}>
            <Input
              id="used_tee"
              value={roundData.used_tee || ""}
              onChange={(e) => handleRoundChange("used_tee", e.target.value)}
              placeholder="例: バックティー"
              className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
            />
          </FormField>

          <FormField label="ラウンド数" icon={<Golf className="h-4 w-4 text-golf-500" />}>
            <Select
              value={roundData.round_count?.toString() || "1"}
              onValueChange={(value) => handleRoundChange("round_count", Number.parseFloat(value))}
            >
              <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                <SelectValue placeholder="ラウンド数を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">0.5（ハーフ）</SelectItem>
                <SelectItem value="1">1.0（1ラウンド）</SelectItem>
                <SelectItem value="1.5">1.5（1.5ラウンド）</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="天気" icon={<Cloud className="h-4 w-4 text-golf-500" />}>
            <Select value={roundData.weather || ""} onValueChange={(value) => handleRoundChange("weather", value)}>
              <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                <SelectValue placeholder="天気を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="晴れ">晴れ</SelectItem>
                <SelectItem value="曇り">曇り</SelectItem>
                <SelectItem value="雨">雨</SelectItem>
                <SelectItem value="雪">雪</SelectItem>
                <SelectItem value="風強い">風強い</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {mode === "score" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <FormField label="トータルスコア" icon={<Trophy className="h-4 w-4 text-golf-500" />}>
                <Input
                  id="score_total"
                  type="number"
                  value={roundData.score_total || ""}
                  onChange={(e) => handleRoundChange("score_total", Number.parseFloat(e.target.value))}
                  placeholder="例: 85"
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              </FormField>
              <FormField label="OUT" icon={<Trophy className="h-4 w-4 text-golf-500" />}>
                <Input
                  id="score_out"
                  type="number"
                  value={roundData.score_out || ""}
                  onChange={(e) => handleRoundChange("score_out", Number.parseFloat(e.target.value))}
                  placeholder="例: 43"
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              </FormField>
              <FormField label="IN" icon={<Trophy className="h-4 w-4 text-golf-500" />}>
                <Input
                  id="score_in"
                  type="number"
                  value={roundData.score_in || ""}
                  onChange={(e) => handleRoundChange("score_in", Number.parseFloat(e.target.value))}
                  placeholder="例: 42"
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="パット数" icon={<Golf className="h-4 w-4 text-golf-500" />}>
                <Input
                  id="putts"
                  type="number"
                  value={roundData.putts || ""}
                  onChange={(e) => handleRoundChange("putts", Number.parseInt(e.target.value))}
                  placeholder="例: 32"
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              </FormField>
              <FormField label="コースレート" icon={<Flag className="h-4 w-4 text-golf-500" />}>
                <Input
                  id="course_rate"
                  type="number"
                  step="0.1"
                  value={roundData.course_rate || ""}
                  onChange={(e) => handleRoundChange("course_rate", Number.parseFloat(e.target.value))}
                  placeholder="例: 72.5"
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              </FormField>
              <FormField label="使用ティー" icon={<Flag className="h-4 w-4 text-golf-500" />}>
                <Select value={roundData.used_tee || ""} onValueChange={(value) => handleRoundChange("used_tee", value)}>
                  <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                    <SelectValue placeholder="使用ティーを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="バック">バック</SelectItem>
                    <SelectItem value="レギュラー">レギュラー</SelectItem>
                    <SelectItem value="フロント">フロント</SelectItem>
                    <SelectItem value="レディース">レディース</SelectItem>
                  </SelectContent>
                </Select>
              </FormField>
            </div>
          </>
        )}

        <div className="space-y-2 pt-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_competition"
              checked={roundData.is_competition || false}
              onCheckedChange={(checked) => handleRoundChange("is_competition", checked)}
              className="text-golf-500 focus:ring-golf-500"
            />
            <Label htmlFor="is_competition" className="text-gray-700">
              競技ラウンド
            </Label>
          </div>
        </div>

        <FormField label="助監督へのコメント" icon={<MessageSquare className="h-4 w-4 text-golf-500" />}>
          <Textarea
            id="comment_to_subcoach"
            value={roundData.comment_to_subcoach || ""}
            onChange={(e) => handleRoundChange("comment_to_subcoach", e.target.value)}
            placeholder="ラウンド中の気づきや改善点などを記入してください"
            rows={4}
            className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </FormField>
      </CardContent>
      <CardFooter className="bg-gray-50 p-6 border-t border-gray-100">
        <Button onClick={nextTab} className="bg-golf-600 hover:bg-golf-700 text-white">
          次へ: {mode === "score" ? "パフォーマンス詳細" : "ホール別入力"}
        </Button>
      </CardFooter>
    </Card>
  );
};