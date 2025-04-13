import { supabase } from "@/lib/supabase"

/**
 * ラウンドデータを取得する
 */
export async function getRound(id: string) {
  console.log("-console by colipot-\n", `ラウンドID ${id} のデータを取得します`);
  
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching round:", error)
    return null
  }

  return data
}

/**
 * パフォーマンスデータを取得する
 */
export async function getPerformance(id: string) {
  console.log("-console by colipot-\n", `パフォーマンスID ${id} のデータを取得します`);
  
  const { data, error } = await supabase
    .from("performance")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching performance:", error)
    return null
  }

  return data
}

/**
 * プレイヤーのリストを取得する
 */
export async function getPlayers() {
  const { data, error } = await supabase.from("players").select("*").order("name")

  if (error) {
    console.error("Error fetching players:", error)
    return []
  }

  return data
}