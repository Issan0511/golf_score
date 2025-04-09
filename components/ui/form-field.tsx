import React from "react"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function FormField({ label, children, icon }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="flex items-center text-gray-700">
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </Label>
      {children}
    </div>
  )
}