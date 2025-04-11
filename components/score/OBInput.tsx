import React from "react"
import { FormField } from "@/components/ui/form-field"
import { Cloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import { OBInputProps } from "@/types/score"

export function OBInput({ hole, handleHoleChange }: OBInputProps) {
  // 増減ボタンを使用するための関数
  const handleIncrement = (field: "ob1w" | "obOther") => {
    const currentValue = hole[field];
    handleHoleChange(field, currentValue + 1);
  };

  const handleDecrement = (field: "ob1w" | "obOther") => {
    const currentValue = hole[field];
    // 最小値を0に設定
    if (currentValue > 0) {
      handleHoleChange(field, currentValue - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8">
      <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
        <Cloud className="h-5 w-5 mr-2 text-gray-500" />
        OB
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="OB(ドライバー)回数">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("ob1w")}
              disabled={hole.ob1w <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.ob1w !== undefined ? hole.ob1w : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("ob1w")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </FormField>

        <FormField label="OB(その他)回数">
          <div className="flex items-center justify-start gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-red-50 bg-red-50"
              onClick={() => handleDecrement("obOther")}
              disabled={hole.obOther <= 0}
            >
              <Minus className="h-5 w-5 text-red-600" />
            </Button>

            <div className="text-center">
              <div className="text-3xl font-bold text-golf-700 bg-golf-50 py-2 px-4 rounded-md w-16 text-center">
                {hole.obOther !== undefined ? hole.obOther : 0}
              </div>
            </div>

            <Button 
              variant="outline" 
              size="icon"
              className="h-12 w-12 rounded-md border-gray-300 hover:bg-blue-50 bg-blue-50"
              onClick={() => handleIncrement("obOther")}
            >
              <Plus className="h-5 w-5 text-blue-600" />
            </Button>
          </div>
        </FormField>
      </div>
    </div>
  )
}