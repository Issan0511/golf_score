import React from 'react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Flag, Trophy } from 'lucide-react'
import { FormField } from "@/components/ui/form-field"
import { ScoreInputSectionProps } from '@/types/score'

export const ScoreInputSection: React.FC<ScoreInputSectionProps> = ({
  currentHoleData,
  handleHoleChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <FormField label="パー" icon={<Flag className="h-4 w-4 text-golf-500" />}>
        <Select
          value={(currentHoleData.par || 4).toString()}
          onValueChange={(value) => handleHoleChange("par", Number.parseInt(value))}
        >
          <SelectTrigger className="border-gray-200 focus:border-golf-500 focus:ring-golf-500">
            <SelectValue placeholder="パーを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </FormField>

      <FormField label="スコア" icon={<Trophy className="h-4 w-4 text-golf-500" />}>
        <Input
          id="score"
          type="number"
          value={currentHoleData.score || 0}
          onChange={(e) => handleHoleChange("score", Number.parseInt(e.target.value))}
          min={1}
          className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
        />
      </FormField>

      <FormField label="パット数" icon={<Flag className="h-4 w-4 text-golf-500" />}>
        <Input
          id="putts"
          type="number"
          value={currentHoleData.putts || 0}
          onChange={(e) => handleHoleChange("putts", Number.parseInt(e.target.value))}
          min={0}
          className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
        />
      </FormField>

      <div className="md:col-span-3">
        <div className="flex items-center space-x-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Checkbox
            id="fairwayHit"
            checked={Boolean(currentHoleData.fairwayHit)}
            onCheckedChange={(checked) => handleHoleChange("fairwayHit", checked)}
            className="text-golf-500 focus:ring-golf-500"
          />
          <Label htmlFor="fairwayHit" className="text-gray-700 cursor-pointer flex-1">
            フェアウェイキープ
          </Label>
        </div>
      </div>
    </div>
  )
}