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
  // Set course name, tee used, competition status, IN score, and OUT score fields to NULL
  React.useEffect(() => {
    handleRoundChange("course_name", null)
    handleRoundChange("used_tee", null)
    handleRoundChange("is_competition", null)
    handleRoundChange("score_in", null)
    handleRoundChange("score_out", null)
  }, [])

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
