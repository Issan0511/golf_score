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
  console.log("-console by copilot-\n", `プレイヤーID: ${player_id}の統計を更新開始`);
  
  try {
    // 直接Supabase Functionsを呼び出す代わりに、内部APIルートを使用
    const response = await fetch('/api/update-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player_id })
    });
    
    if (!response.ok) {
      console.error("-console by copilot-\n", `統計更新に失敗: ${response.status}`);
      throw new Error(`統計更新に失敗しました: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("-console by copilot-\n", "統計更新結果:", result);
    return true;
  } catch (error) {
    console.error("-console by copilot-\n", "統計更新中にエラーが発生しました:", error);
    return false;
  }
}

/**
 * プレイヤーの統計をバッチで更新する関数
 * 複数のプレイヤーIDを一度に処理することができる
 */
export async function updateMultiplePlayerStats(player_ids: string[]) {
  console.log("-console by copilot-\n", "複数プレイヤーの統計を更新中:", player_ids);

  try {
    // 各プレイヤーIDに対して順番に処理
    const results = await Promise.all(
      player_ids.map(async (player_id) => {
        try {
          const success = await updatePlayerStats(player_id);
          return { player_id, success };
        } catch (e) {
          console.error("-console by copilot-\n", `プレイヤーID: ${player_id}の統計更新に失敗:`, e);
          return { player_id, success: false };
        }
      })
    );

    // 結果の集計
    const successCount = results.filter(r => r.success).length;
    console.log("-console by copilot-\n", `${successCount}/${player_ids.length}件の統計が更新されました`);
    
    return {
      total: player_ids.length,
      success: successCount,
      details: results
    };
  } catch (error) {
    console.error("-console by copilot-\n", "バッチ統計更新中にエラーが発生しました:", error);
    return {
      total: player_ids.length,
      success: 0,
      details: player_ids.map(id => ({ player_id: id, success: false }))
    };
  }
}

/**
 * 最新の統計情報を取得する
 * CORSの問題を回避するためにサーバーサイドで呼び出すことを推奨
 */
export async function fetchLatestStats(player_id: string) {
  console.log("-console by copilot-\n", "プレイヤーの最新統計を取得中:", player_id);
  
  try {
    const { data, error } = await supabase
      .from("playerstats")
      .select("*")
      .eq("player_id", player_id)
      .single();

    if (error) {
      console.error("-console by copilot-\n", "統計データ取得中にエラーが発生:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("-console by copilot-\n", "統計データ取得中に例外が発生:", error);
    return null;
  }
}

