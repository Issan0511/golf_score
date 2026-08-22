import type { Round } from "@/lib/supabase"
import { calculateRoundDetails } from "@/lib/round-details"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type RoundDetailsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  round: Round
}

const detailItems = [
  { key: "putts", label: "パット" },
  { key: "threePuttsOrMore", label: "3パット以上" },
  { key: "fairwayKeeps", label: "FWキープ" },
  { key: "ob", label: "OB" },
  { key: "parOns", label: "パーオン" },
  { key: "bogeyOns", label: "ボギーオン" },
  { key: "shortGame", label: "SG" },
] as const

export function RoundDetailsDialog({ open, onOpenChange, round }: RoundDetailsDialogProps) {
  const details = calculateRoundDetails(round)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>ラウンド詳細</DialogTitle>
          <DialogDescription>
            {round.club_name || "コース名なし"}・{round.date ? new Date(round.date).toLocaleDateString("ja-JP") : "日付なし"}
          </DialogDescription>
        </DialogHeader>

        {details ? (
          <div className="grid grid-cols-2 overflow-hidden rounded-lg border border-gray-200 sm:grid-cols-4 lg:grid-cols-7">
            {detailItems.map((item) => (
              <div key={item.key} className="border-b border-r border-gray-200 bg-white p-3 text-center last:border-r-0">
                <div className="min-h-10 text-sm font-medium text-gray-600">{item.label}</div>
                <div className="mt-2 text-2xl font-bold text-golf-800">
                  {item.key === "shortGame"
                    ? details.shortGame === null
                      ? "—"
                      : details.shortGame.toFixed(1)
                    : details[item.key]}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
            このラウンドには詳細なホール情報がありません。
          </div>
        )}
        <p className="text-xs text-gray-500">
          SGはパーオンしていない1ホールあたりの、100m以内のショットとパットの平均打数です。
        </p>
      </DialogContent>
    </Dialog>
  )
}
