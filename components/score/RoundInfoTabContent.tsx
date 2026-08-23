import React, { useState, useEffect } from "react"
import { Calendar, Cloud, Flag, GuitarIcon as Golf, Trophy, User, MessageSquare, Check, ChevronsUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FormField } from "@/components/ui/form-field"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Player, type Round } from "@/lib/supabase"
import { useCourseRates } from "@/hooks/use-course-rates"
import { cn } from "@/lib/utils"

interface RoundInfoTabContentProps {
  roundData: Partial<Round>
  players: Player[]
  handleRoundChange: (field: string, value: any) => void
  nextTab: () => void
}

export function RoundInfoTabContent({
  roundData,
  players,
  handleRoundChange,
  nextTab,
}: RoundInfoTabContentProps) {
  console.log("-console by copilot-\n", "RoundInfoTabContent rendering with data:", roundData);
    const { clubOptions, getCoursesForClub, getTeesForCourse, loading: courseRatesLoading, error: courseRatesError } = useCourseRates();  const [selectedClub, setSelectedClub] = useState<string>(roundData.club_name || "");
  const [selectedCourse, setSelectedCourse] = useState<string>(roundData.course_name || "");
  const [courseOptions, setCourseOptions] = useState<Array<{value: string, label: string}>>([]);
  const [teeOptions, setTeeOptions] = useState<Array<{value: string, label: string}>>([]);
  const [clubSearchOpen, setClubSearchOpen] = useState(false);
  const [clubSearchValue, setClubSearchValue] = useState("");
    // デバッグ用の状態ログ
  console.log("-console by copilot-\n", "Current state:", {
    selectedClub,
    selectedCourse,
    courseOptionsLength: courseOptions.length,
    teeOptionsLength: teeOptions.length,
    courseRatesLoading,
    courseRatesError
  });

  // クラブ検索用のフィルタリング関数
  const filteredClubOptions = React.useMemo(() => {
    if (!clubSearchValue) return clubOptions.slice(0, 50); // 初期表示は50件まで
    return clubOptions
      .filter((club) =>
        club.label.toLowerCase().includes(clubSearchValue.toLowerCase())
      )
      .slice(0, 100); // 検索結果は100件まで
  }, [clubOptions, clubSearchValue]);
  
  // 初期データに基づいてオプションを設定（コースデータが読み込まれた時のみ実行）
  useEffect(() => {
    if (!courseRatesLoading && roundData.club_name && !selectedClub) {
      console.log("-console by copilot-\n", "Setting initial options for existing round data");
      setSelectedClub(roundData.club_name);
      setSelectedCourse(roundData.course_name || "");
    }
  }, [courseRatesLoading, roundData.club_name, roundData.course_name, selectedClub]);
  // 選択されたクラブが変更された時の処理
  useEffect(() => {
    if (selectedClub && !courseRatesLoading) {
      console.log("-console by copilot-\n", "Club selected:", selectedClub);
      const courses = getCoursesForClub(selectedClub);
      console.log("-console by copilot-\n", "Generated course options:", courses);
      setCourseOptions(courses);
      
      // 新しくクラブを選択した場合はティーオプションも更新
      const tees = getTeesForCourse(selectedClub);
      setTeeOptions(tees);
    } else if (!selectedClub) {
      setCourseOptions([]);
      setTeeOptions([]);
    }
  }, [selectedClub, courseRatesLoading]);

  // 選択されたコースが変更された時の処理
  useEffect(() => {
    if (selectedClub && !courseRatesLoading) {
      const tees = getTeesForCourse(selectedClub, selectedCourse || undefined);
      setTeeOptions(tees);
      console.log("-console by copilot-\n", "Course changed, updated tee options:", tees);
    }
  }, [selectedCourse, selectedClub, courseRatesLoading]);

  // クラブが変更された時のハンドラー
  const handleClubChange = (value: string) => {
    console.log("-console by copilot-\n", "Club changed to:", value);
    setSelectedClub(value);
    setSelectedCourse(""); // コースをリセット
    handleRoundChange("club_name", value);
    handleRoundChange("course_name", ""); // course_nameもリセット
    handleRoundChange("used_tee", ""); // ティーもリセット
  };

  // コースが変更された時のハンドラー
  const handleCourseChange = (value: string) => {
    console.log("-console by copilot-\n", "Course changed to:", value);
    setSelectedCourse(value);
    handleRoundChange("course_name", value);
    handleRoundChange("used_tee", ""); // ティーをリセット
  };
  // ティーが変更された時のハンドラー
  const handleTeeChange = (value: string) => {
    console.log("-console by copilot-\n", "Tee changed to:", value);
    handleRoundChange("used_tee", value);
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
        <CardTitle className="text-golf-800">ラウンド基本情報</CardTitle>
        <CardDescription>
          ラウンドの日付、コース、基本情報を入力してください
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

          <FormField label="クラブ名" icon={<Golf className="h-4 w-4 text-golf-500" />}>
            {courseRatesError ? (
              <Input
                value={selectedClub}
                onChange={(e) => {
                  setSelectedClub(e.target.value);
                  handleRoundChange("club_name", e.target.value);
                }}
                placeholder="クラブ名を手動で入力"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            ) : (
              <Popover open={clubSearchOpen} onOpenChange={setClubSearchOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={clubSearchOpen}
                    className="w-full justify-between border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                    disabled={courseRatesLoading}
                  >
                    {selectedClub || (courseRatesLoading ? "読み込み中..." : "クラブを検索...")}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="クラブ名を検索..."
                      value={clubSearchValue}
                      onValueChange={setClubSearchValue}
                    />                    <CommandEmpty>クラブが見つかりません。</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {filteredClubOptions.map((club) => (
                        <CommandItem
                          key={club.value}
                          value={club.value}
                          onSelect={(currentValue) => {
                            console.log("-console by copilot-\n", "Club selected from combobox:", currentValue);
                            handleClubChange(currentValue);
                            setClubSearchOpen(false);
                            setClubSearchValue("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedClub === club.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {club.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
            {courseRatesError && (
              <p className="text-sm text-red-600 mt-1">
                コースデータの読み込みに失敗しました。手動で入力してください。
              </p>
            )}
          </FormField>

          {(roundData.round_count ?? 1) === 1 && (
            <FormField label="コース名（オプション）" icon={<Flag className="h-4 w-4 text-golf-500" />}>
              {courseRatesError ? (
                <Input
                  value={selectedCourse}
                  onChange={(e) => {
                    setSelectedCourse(e.target.value);
                    handleRoundChange("course_name", e.target.value);
                  }}
                  placeholder="コース名を手動で入力"
                  className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
                />
              ) : (
                <Select
                  value={selectedCourse}
                  onValueChange={handleCourseChange}
                  disabled={!selectedClub}
                >
                  <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                    <SelectValue placeholder={!selectedClub ? "先にクラブを選択" : courseOptions.length === 0 ? `コース情報なし (${selectedClub})` : "コースを選択"} />
                  </SelectTrigger>
                  <SelectContent>
                    {courseOptions.map((course) => (
                      <SelectItem key={course.value} value={course.value}>
                        {course.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
          )}

          <FormField label="使用ティー" icon={<Flag className="h-4 w-4 text-golf-500" />}>
            {courseRatesError ? (
              <Input
                value={roundData.used_tee || ""}
                onChange={(e) => handleRoundChange("used_tee", e.target.value)}
                placeholder="ティー名を手動で入力"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            ) : (
              <Select 
                value={roundData.used_tee || ""} 
                onValueChange={handleTeeChange}
                disabled={!selectedClub || teeOptions.length === 0}
              >
                <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
                  <SelectValue placeholder={!selectedClub ? "先にクラブを選択" : teeOptions.length === 0 ? "ティー情報なし" : "ティーを選択"} />
                </SelectTrigger>
                <SelectContent>
                  {teeOptions.map((tee) => (
                    <SelectItem key={tee.value} value={tee.value}>
                      {tee.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}          </FormField>

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
          次へ: ホール別入力
        </Button>
      </CardFooter>
    </Card>
  )
}
