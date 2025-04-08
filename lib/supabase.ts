import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://axxejytflmqnottoambp.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eGVqeXRmbG1xbm90dG9hbWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDI2MjIsImV4cCI6MjA1OTU3ODYyMn0.MfjD_Egv-YqyUNg5n47uruRvgPb2lefhMyIOstHDIG8"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Player = {
  id: string
  name: string
  department?: string
  admission_year?: number
  origin?: string
  highschool?: string
  image_url?: string
  created_at?: string
}

export type PlayerStats = {
  id: string
  handicap?: number
  total_score?: number
  avg_score?: number
  avg_putt?: number
  avg_ob1w?: number
  avg_ob_other?: number
  avg_ob_2nd?: number
  pin_rate?: number
  dist_1_30?: number
  dist_31_80?: number
  dist_81_120?: number
  dist_121_160?: number
  dist_161_180?: number
  dist_181_plus?: number
  created_at?: string
}

export type Round = {
  id: string
  player_id?: string
  date?: string
  course_name?: string
  round_count?: number
  score_total?: number
  score_out?: number
  score_in?: number
  putts?: number
  weather?: string
  course_rate?: number
  used_tee?: string
  is_competition?: boolean
  comment_to_subcoach?: string
  club_name?: string
  created_at?: string
}

export type Performance = {
  id: string
  one_putts?: number
  three_putts_or_more?: number
  par_on?: number
  bogey_on?: number
  in_pin?: number
  ob_1w?: number
  ob_other?: number
  ob_2nd?: number
  dist_1_30_success?: number
  dist_1_30_total?: number
  dist_31_80_success?: number
  dist_31_80_total?: number
  dist_81_120_success?: number
  dist_81_120_total?: number
  dist_121_160_success?: number
  dist_121_160_total?: number
  dist_161_180_success?: number
  dist_161_180_total?: number
  dist_181_plus_success?: number
  dist_181_plus_total?: number
  created_at?: string
}

