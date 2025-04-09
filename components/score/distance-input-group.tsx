import React from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

interface DistanceInputGroupProps {
  title: string
  successValue?: number
  totalValue?: number
  onSuccessChange: (value: number) => void
  onTotalChange: (value: number) => void
}

export function DistanceInputGroup({
  title,
  successValue,
  totalValue,
  onSuccessChange,
  onTotalChange,
}: DistanceInputGroupProps) {
  const successRate = totalValue && totalValue > 0 && successValue !== undefined ? (successValue / totalValue) * 100 : 0

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center mb-3">
        <h4 className="text-md font-medium text-gray-700">{title}</h4>
        {totalValue && totalValue > 0 && successValue !== undefined && (
          <div className="ml-auto">
            <span className="text-sm font-medium px-2 py-1 bg-golf-50 text-golf-700 rounded-full">
              {successRate.toFixed(1)}%
            </span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="成功数">
          <Input
            type="number"
            value={successValue || ""}
            onChange={(e) => onSuccessChange(Number.parseInt(e.target.value))}
            placeholder="例: 3"
            className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </FormField>
        <FormField label="総数">
          <Input
            type="number"
            value={totalValue || ""}
            onChange={(e) => onTotalChange(Number.parseInt(e.target.value))}
            placeholder="例: 5"
            className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </FormField>
      </div>
      {totalValue && totalValue > 0 && (
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-golf-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${successRate}%` }}
          ></div>
        </div>
      )}
    </div>
  )
}