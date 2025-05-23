import { NextResponse } from 'next/server';

/**
 * 複数プレイヤーの統計を一括更新するAPI
 * CORSの問題を回避するためのサーバーサイドエンドポイント
 */
export async function POST(request: Request) {

  try {
    // リクエストボディからプレイヤーIDの配列を取得
    const { player_ids } = await request.json();

    if (!player_ids || !Array.isArray(player_ids) || player_ids.length === 0) {
      return NextResponse.json(
        { success: false, error: "少なくとも1つのプレイヤーIDが必要です" },
        { status: 400 }
      );
    }


    // 各プレイヤーに対して順次処理
    const results = await Promise.allSettled(
      player_ids.map(async (player_id) => {
        try {
          const response = await fetch(
            'https://axxejytflmqnottoambp.supabase.co/functions/v1/Update_stats',
            {
              method: 'POST',
              headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4eGVqeXRmbG1xbm90dG9hbWJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMDI2MjIsImV4cCI6MjA1OTU3ODYyMn0.MfjD_Egv-YqyUNg5n47uruRvgPb2lefhMyIOstHDIG8',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ player_id })
            }
          );

          if (!response.ok) {
            return { player_id, success: false, status: response.status };
          }

          const data = await response.json();
          return { player_id, success: true, data };
        } catch (error) {
          return { player_id, success: false, error: "処理中にエラーが発生しました" };
        }
      })
    );

    // 結果を分析
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
    const failureCount = player_ids.length - successCount;


    // 整形された結果を返す
    const formattedResults = results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return { success: false, error: "処理に失敗しました" };
      }
    });

    return NextResponse.json({
      success: true,
      summary: {
        total: player_ids.length,
        success: successCount,
        failure: failureCount
      },
      results: formattedResults
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "バッチ処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}