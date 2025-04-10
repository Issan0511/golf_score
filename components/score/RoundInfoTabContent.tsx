import React from "react"
import { Player } from "@/lib/supabase"
import { RoundBasicInfoCard } from "@/components/RoundBasicInfoCard"

interface RoundInfoTabContentProps {
  roundData: any
  players: Player[]
  handleRoundChange: (field: string, value: any) => void
  nextTab: () => void
}

export function RoundInfoTabContent({
  roundData,
  players,
  handleRoundChange,
  nextTab,
}: RoundInfoTabContentProps) {
  return (
    <RoundBasicInfoCard
      mode="basic"
      roundData={roundData}
      players={players}
      handleRoundChange={handleRoundChange}
      nextTab={nextTab}
    />
  )
}