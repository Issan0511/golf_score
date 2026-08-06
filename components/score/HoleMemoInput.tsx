import { MessageCircle } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import type { HoleData } from "@/types/score"

const MAX_MEMO_LENGTH = 500

type HoleMemoInputProps = {
  hole: HoleData
  handleHoleChange: (field: string, value: string) => void
}

export function HoleMemoInput({ hole, handleHoleChange }: HoleMemoInputProps) {
  return (
    <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <label htmlFor={`hole-${hole.number}-memo`} className="flex items-center text-sm font-medium text-golf-800">
          <MessageCircle className="mr-2 h-4 w-4 text-golf-500" />
          このホールのメモ
        </label>
        <span className="text-xs text-gray-500">
          {hole.memo.length} / {MAX_MEMO_LENGTH}
        </span>
      </div>
      <Textarea
        id={`hole-${hole.number}-memo`}
        value={hole.memo}
        maxLength={MAX_MEMO_LENGTH}
        rows={3}
        placeholder="例：ティーショットが右へ。次回は左を狙う"
        className="resize-y bg-white"
        onChange={(event) => handleHoleChange("memo", event.target.value)}
      />
      <p className="mt-2 text-xs text-gray-500">ラウンドを登録すると、スコアと一緒に保存されます。</p>
    </div>
  )
}
