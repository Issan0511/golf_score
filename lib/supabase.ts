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
export type Round = Database["public"]["Tables"]["rounds"]["Row"];
export type Performance = Database["public"]["Tables"]["performance"]["Row"];

// プレイヤーの統計を更新するためのバックエンド関数を呼び出す
export async function updatePlayerStats(player_id: string) {
  
  try {
    const response = await fetch('https://axxejytflmqnottoambp.supabase.co/functions/v1/Update_stats', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eGVqeXRmbG1xbm90dG9hbWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDI2MjIsImV4cCI6MjA1OTU3ODYyMn0.MfjD_Egv-YqyUNg5n47uruRvgPb2lefhMyIOstHDIG8',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player_id })
    });
    
    if (!response.ok) {
      throw new Error(`統計更新に失敗しました: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

