import { NextResponse } from 'next/server';

/**
 * 単一プレイヤーの統計を更新するAPI
 * CORSの問題を回避するためのサーバーサイドエンドポイント
 */
export async function POST(request: Request) {

  try {
    // リクエストボディからプレイヤーIDを取得
    const { player_id } = await request.json();

    if (!player_id) {
      return NextResponse.json(
        { success: false, error: "プレイヤーIDが必要です" },
        { status: 400 }
      );
    }


    // Supabase Edgeファンクションを呼び出す
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

    // レスポンスをパース
    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `統計更新に失敗しました: ${response.statusText}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: "統計更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}