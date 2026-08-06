import type { Performance, Round } from "@/lib/supabase"
import type { HoleData } from "@/types/score"

export const SCORE_DRAFT_STORAGE_KEY = "golf-score:score-draft"

const SCORE_DRAFT_VERSION = 1

export type ScoreDraft = {
  version: number
  savedAt: string
  roundData: Partial<Round>
  performanceData: Partial<Performance>
  holes: HoleData[]
  currentHole: number
  activeTab: string
}

type DraftContents = Omit<ScoreDraft, "version" | "savedAt">

export function loadScoreDraft(): ScoreDraft | null {
  if (typeof window === "undefined") return null

  try {
    const storedDraft = window.localStorage.getItem(SCORE_DRAFT_STORAGE_KEY)
    if (!storedDraft) return null

    const draft = JSON.parse(storedDraft) as ScoreDraft
    if (
      draft.version !== SCORE_DRAFT_VERSION ||
      !draft.savedAt ||
      !draft.roundData ||
      !draft.performanceData ||
      !Array.isArray(draft.holes) ||
      typeof draft.currentHole !== "number" ||
      typeof draft.activeTab !== "string"
    ) {
      clearScoreDraft()
      return null
    }

    return draft
  } catch {
    clearScoreDraft()
    return null
  }
}

export function saveScoreDraft(contents: DraftContents): boolean {
  if (typeof window === "undefined") return false

  const draft: ScoreDraft = {
    ...contents,
    version: SCORE_DRAFT_VERSION,
    savedAt: new Date().toISOString(),
  }

  try {
    window.localStorage.setItem(SCORE_DRAFT_STORAGE_KEY, JSON.stringify(draft))
    return true
  } catch {
    return false
  }
}

export function clearScoreDraft() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(SCORE_DRAFT_STORAGE_KEY)
}
