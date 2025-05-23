import React from "react"
import { Input } from "@/components/ui/input"
import { FormField } from "@/components/ui/form-field"

interface DistanceInputGroupProps {
  title: string
  successValue?: number | null
  totalValue?: number | null
  onSuccessChange: (value: number | null) => void
  onTotalChange: (value: number | null) => void
}

/**
 * 距離帯別の成功率入力グループコンポーネント
 */
export const DistanceInputGroup = ({
  title,
  successValue,
  totalValue,
  onSuccessChange,
  onTotalChange,
}: DistanceInputGroupProps): React.ReactElement => {

  // 成功率の計算
  const successRate = React.useMemo(() => {
    if (totalValue && totalValue > 0 && successValue !== undefined && successValue !== null) {
      return (successValue / totalValue) * 100;
    }
    return 0;
  }, [successValue, totalValue]);

  // 入力値が変更されたときの処理
  const handleSuccessChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Number.parseInt(e.target.value) || 0;
    onSuccessChange(value);
  }, [onSuccessChange]);

  const handleTotalChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? null : Number.parseInt(e.target.value) || 0;
    onTotalChange(value);
  }, [onTotalChange]);

  // 入力値を適切に処理するヘルパー関数
  const getInputValue = (value: any) => {
    return value === null || value === undefined ? "" : value;
  };

  // 成功率の表示条件
  const showSuccessRate = Boolean(totalValue && totalValue > 0 && successValue !== undefined && successValue !== null);
  
  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center mb-3">
        <h4 className="text-md font-medium text-gray-700">{title}</h4>
        {showSuccessRate ? (
          <div className="ml-auto">
            <span className="text-sm font-medium px-2 py-1 bg-golf-50 text-golf-700 rounded-full">
              {successRate.toFixed(1)}%
            </span>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField label="成功数">
          <Input
            type="number"
            value={getInputValue(successValue)}
            onChange={handleSuccessChange}
            placeholder="例: 3"
            className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </FormField>
        <FormField label="総数">
          <Input
            type="number"
            value={getInputValue(totalValue)}
            onChange={handleTotalChange}
            placeholder="例: 5"
            className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </FormField>
      </div>
      {showSuccessRate && (
        <div className="mt-2 w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-golf-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${successRate}%` }}
          />
        </div>
      )}
    </div>
  );
}