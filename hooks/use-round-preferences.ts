import type { Round } from "@/lib/supabase"

export const ROUND_PREFERENCES_STORAGE_KEY = "golf-score:round-preferences"

const ROUND_PREFERENCES_VERSION = 1

export type RoundPreferences = Pick<Partial<Round>, "player_id" | "club_name">

type StoredRoundPreferences = RoundPreferences & {
  version: number
}

export function loadRoundPreferences(): RoundPreferences {
  if (typeof window === "undefined") return {}

  try {
    const storedPreferences = window.localStorage.getItem(ROUND_PREFERENCES_STORAGE_KEY)
    if (!storedPreferences) return {}

    const preferences = JSON.parse(storedPreferences) as StoredRoundPreferences
    if (preferences.version !== ROUND_PREFERENCES_VERSION) return {}

    return {
      player_id: typeof preferences.player_id === "string" ? preferences.player_id : undefined,
      club_name: typeof preferences.club_name === "string" ? preferences.club_name : undefined,
    }
  } catch {
    return {}
  }
}

export function saveRoundPreferences({ player_id, club_name }: RoundPreferences): boolean {
  if (typeof window === "undefined") return false

  const preferences: StoredRoundPreferences = {
    version: ROUND_PREFERENCES_VERSION,
    ...(player_id ? { player_id } : {}),
    ...(club_name ? { club_name } : {}),
  }

  try {
    window.localStorage.setItem(ROUND_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
    return true
  } catch {
    return false
  }
}
