import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Cloud, MapPin, Flag, Trophy, Target, MessageCircle, Copy } from "lucide-react";
import { type Round } from "@/lib/supabase";

interface ScoreReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  round: Round;
}

export function ScoreReportModal({ isOpen, onClose, round }: ScoreReportModalProps) {
  console.log("-console by copilot-\n", "ScoreReportModal opened with round:", round);
  
  const [reportText, setReportText] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // スコア報告テキストを生成
  const generateReportText = () => {
    console.log("-console by copilot-\n", "Generating report text for round:", round);
    
    const dateStr = round.date ? new Date(round.date).toLocaleDateString("ja-JP") : "日付不明";
    const weather = round.weather || "";
    const courseName = round.club_name || "コース名不明";
    const tee = round.used_tee || "";
    const isCompetitive = round.is_competition ? "競技" : "非競技";
    const totalScore = round.score_total || "-";
    const outScore = round.score_out || "";
    const inScore = round.score_in || "";
      // スコア表示の形式を決定
    let scoreDisplay = `${totalScore}`;
    if (round.round_count === 1 && outScore && inScore) {
      scoreDisplay = `${outScore}.${inScore}=${totalScore}`;
    }

    const reportText = `ラウンド報告🏌️‍♂️

[プレー日] ${dateStr}
[天候] ${weather}
[ゴルフ場] ${courseName}
[使用ティー] ${tee}
[競技or非競技] ${isCompetitive}
[スコア] ${scoreDisplay}

よろしくお願いします。`;

    console.log("-console by copilot-\n", "Generated report text:", reportText);
    setReportText(reportText);
  };

  // モーダルが開かれた時にテキストを生成
  React.useEffect(() => {
    if (isOpen) {
      console.log("-console by copilot-\n", "Modal opened, generating initial report text");
      generateReportText();
    }
  }, [isOpen, round]);

  // クリップボードにコピー
  const copyToClipboard = async () => {
    try {
      console.log("-console by copilot-\n", "Copying text to clipboard:", reportText);
      await navigator.clipboard.writeText(reportText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("-console by copilot-\n", "Failed to copy to clipboard:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-golf-500" />
            スコア報告テキスト生成
          </DialogTitle>
          <DialogDescription>
            SNSやメッセージで共有できるスコア報告テキストを生成します
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* ラウンド情報の概要 */}
          <div className="bg-golf-50 p-4 rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{round.date ? new Date(round.date).toLocaleDateString("ja-JP") : "日付不明"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Cloud className="h-4 w-4 text-gray-500" />
                <span>{round.weather || "天候不明"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{round.club_name || "コース名不明"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-gray-500" />
                <span>{round.used_tee || "ティー不明"}</span>
              </div>              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-gray-500" />
                <Badge variant={round.is_competition ? "default" : "secondary"}>
                  {round.is_competition ? "競技" : "非競技"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-gray-500" />
                <span className="font-bold text-golf-700">
                  スコア: {round.score_total || "-"}
                  {round.score_out && round.score_in && ` (${round.score_out}.${round.score_in})`}
                </span>
              </div>
            </div>
          </div>

          {/* 生成されたテキスト */}
          <div className="space-y-2">
            <label className="text-sm font-medium">生成されたスコア報告テキスト</label>
            <Textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              className="min-h-[200px] resize-none"
              placeholder="スコア報告テキストが生成されます..."
            />
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={generateReportText}
              className="border-golf-500 text-golf-600 hover:bg-golf-50"
            >
              テキストを再生成
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              キャンセル
            </Button>
            <Button
              onClick={copyToClipboard}
              className="bg-golf-600 hover:bg-golf-700"
            >
              {isCopied ? "コピー完了!" : "クリップボードにコピー"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
