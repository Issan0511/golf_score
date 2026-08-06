import { MessageCircle } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Round } from "@/lib/supabase"

export type HoleMemo = {
  number: number
  memo: string
}

export function getHoleMemos(round: Round): HoleMemo[] {
  if (!Array.isArray(round.holes)) return []

  return round.holes.flatMap((hole, index) => {
    if (!hole || typeof hole !== "object" || Array.isArray(hole)) return []

    const memo = "memo" in hole && typeof hole.memo === "string" ? hole.memo.trim() : ""
    if (!memo) return []

    const number = "number" in hole && typeof hole.number === "number" ? hole.number : index + 1
    return [{ number, memo }]
  })
}

type HoleMemoListDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  round: Round
}

export function HoleMemoListDialog({ open, onOpenChange, round }: HoleMemoListDialogProps) {
  const memos = getHoleMemos(round)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-golf-800">
            <MessageCircle className="h-5 w-5 text-golf-500" />
            ホールメモ
          </DialogTitle>
          <DialogDescription>
            {round.club_name || "コース名なし"}のラウンドで記録したメモです。
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {memos.map((memo) => (
            <div key={memo.number} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="mb-1 text-sm font-semibold text-golf-700">{memo.number}番ホール</div>
              <p className="whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">{memo.memo}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
