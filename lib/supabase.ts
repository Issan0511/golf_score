import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// 環境変数から Supabase の認証情報を取得
const supabaseUrl = "https://axxejytflmqnottoambp.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eGVqeXRmbG1xbm90dG9hbWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTMzNjY0MTIsImV4cCI6MjAwODk0MjQxMn0.ojwleeXXoK9bcyB7d2OTJp5lerzbLtCaSfv5fQasJTw"

// Supabase クライアントを作成
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

export type Player = Database["public"]["Tables"]["players"]["Row"]
export type PlayerStats = Database["public"]["Tables"]["playerstats"]["Row"]
export type Rounds = Database["public"]["Tables"]["rounds"]["Row"]
export type Performance = Database["public"]["Tables"]["playerstats"]["Row"] // performance データを playerstats から取得するように変更

