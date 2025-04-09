import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

// 環境変数から Supabase の認証情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// デバッグ用に環境変数の状態を確認（URLのみ表示し、キーは表示しない）
if (typeof window !== "undefined") {
  console.log("Supabase URL is set:", !!supabaseUrl);
  console.log("Supabase Key is set:", !!supabaseAnonKey);
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type Player = Database["public"]["Tables"]["players"]["Row"];
export type PlayerStats = Database["public"]["Tables"]["playerstats"]["Row"];
export type Rounds = Database["public"]["Tables"]["rounds"]["Row"];
export type Performance = Database["public"]["Tables"]["performance"]["Row"]; // 正しいテーブル参照に修正

