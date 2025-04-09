import React from "react"

interface SectionCardProps {
  title: string
  children: React.ReactNode
  icon?: React.ReactNode
}

export function SectionCard({ title, children, icon }: SectionCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex items-center p-4 bg-gradient-to-r from-golf-50 to-white border-b border-gray-100">
        {icon}
        <h3 className="text-lg font-medium ml-2 text-golf-800">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}