import React from 'react'
import { Input } from "@/components/ui/input"
import { Cloud } from 'lucide-react'
import { FormField } from "@/components/ui/form-field"
import { OBInputSectionProps } from '@/types/score'

export const OBInputSection: React.FC<OBInputSectionProps> = ({
  currentHoleData,
  handleHoleChange
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-8">
      <h3 className="text-lg font-medium mb-4 text-golf-800 flex items-center">
        <Cloud className="h-5 w-5 mr-2 text-gray-500" />
        OB
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="OB(ドライバー)回数">
          <Input
            id="ob1w"
            type="number"
            value={currentHoleData.ob1w !== undefined ? currentHoleData.ob1w : 0}
            onChange={(e) => handleHoleChange("ob1w", Number.parseInt(e.target.value))}
            min={0}
            className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </FormField>
        <FormField label="OB(その他)回数">
          <Input
            id="obOther"
            type="number"
            value={currentHoleData.obOther !== undefined ? currentHoleData.obOther : 0}
            onChange={(e) => handleHoleChange("obOther", Number.parseInt(e.target.value))}
            min={0}
            className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
          />
        </FormField>
      </div>
    </div>
  )
}