"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useLoadingNavigation } from "@/hooks/use-loading-navigation"
import { LoadingModal } from "@/components/ui/loading-modal"

// フックとサービスのインポート
import { useScoreData } from "@/hooks/use-score-data"
import { useHoleData } from "@/hooks/use-hole-data"
import { usePerformanceCalculator } from "@/hooks/use-performance-calculator"
import { useRoundUpdater } from "@/hooks/use-round-updater"
import { getRound, getPerformance, getPlayers } from "@/lib/round-service"

// コンポーネントのインポート
import { RoundInfoTabContent } from "@/components/score/RoundInfoTabContent"
import { HoleInputTabContent } from "@/components/score/HoleInputTabContent"
import { PerformanceTabContent } from "@/components/score/PerformanceTabContent"

export default function EditRoundPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  
  const [players, setPlayers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("round") // アクティブなタブの状態
  const [hasHoles, setHasHoles] = useState(false) // ホールデータがあるかどうか
  const { isNavigating, navigate } = useLoadingNavigation()
  // 初期レンダリングフラグ
  const isFirstRender = useRef(true);
  // holesデータのセット状態を追跡するフラグ
  const holesDataSet = useRef(false);

  // useScoreDataフックを使用して、ラウンドとパフォーマンスデータを管理
  const {
    roundData,
    performanceData,
    submitting: scoreSubmitting,
    handleRoundChange,
    handlePerformanceChange,
    setHolesData,
  } = useScoreData()

  // useHoleDataフックを使用して、ホールデータを管理
  const {
    holes,
    currentHole,
    handleHoleChange,
    goToNextHole,
    goToPrevHole,
    setCurrentHole,
    getTotalHoles
  } = useHoleData({ externalRoundCount: roundData.round_count })

  // ラウンド更新用フックを使用
  const { updateRoundData, submitting: updaterSubmitting } = useRoundUpdater({ id })

  // パフォーマンス計算用フックを使用
  const { calculatePerformanceFromHoles } = usePerformanceCalculator({ 
    holes,
    handleRoundChange,
  })

  // ラウンドデータを取得
  useEffect(() => {
    async function loadRoundData() {
      if (!id) return;
      
      setLoading(true);
      
      try {
        console.log("-console by colipot-\n", `ラウンドデータを取得開始: ID=${id}`);
        
        // ラウンド、パフォーマンス、プレイヤーデータを並列で取得
        const [roundData, performanceData, playersData] = await Promise.all([
          getRound(id),
          getPerformance(id),
          getPlayers()
        ]);

        if (!roundData) {
          toast({
            title: "エラー",
            description: "ラウンドデータが見つかりませんでした",
            variant: "destructive",
          })
          
          router.push("/players")
          return
        }

        console.log("-console by colipot-\n", "取得したラウンドデータ:", roundData);
        
        // ホールデータがあるか確認
        const hasHolesData = Array.isArray(roundData.holes) && roundData.holes.length > 0;
        setHasHoles(hasHolesData);

        // useScoreDataフックにデータをセット
        Object.keys(roundData).forEach(key => {
          if (key !== 'holes') {
            handleRoundChange(key as any, roundData[key as keyof typeof roundData]);
          }
        });

        // パフォーマンスデータをセット
        if (performanceData) {
          console.log("-console by colipot-\n", "取得したパフォーマンスデータ:", performanceData);
          Object.keys(performanceData).forEach(key => {
            if (key !== 'id' && key !== 'created_at') {
              handlePerformanceChange(key as any, performanceData[key as keyof typeof performanceData]);
            }
          });
        }

        // ホールデータがあればセット - 一度だけ実行
        if (hasHolesData && !holesDataSet.current) {
          console.log("-console by colipot-\n", `ホールデータをセット: ${roundData.holes.length}個`);
          holesDataSet.current = true;
          setHolesData(roundData.holes);
        }

        // プレイヤーデータをセット
        setPlayers(playersData);
        
      } catch (error) {
        console.error("Error loading round data:", error);
        toast({
          title: "エラー",
          description: "データの読み込み中にエラーが発生しました",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadRoundData();
    
    // クリーンアップ関数
    return () => {
      holesDataSet.current = false;
    };
  }, [id, router]); // handleRoundChange, handlePerformanceChange, setHolesDataを依存配列から削除

  // パフォーマンスデータを更新する関数
  const calculateAndUpdatePerformance = () => {
    if (hasHoles === false) {
      console.warn("-console by colipot-\n", "ホールデータがありません。パフォーマンス計算をスキップします。");
      return;
    }
    console.log("-console by colipot-\n", `パフォーマンス計算実行開始: holes=${holes.length}個`);
    const calculatedPerformance = calculatePerformanceFromHoles();
    
    console.log("-console by colipot-\n", "計算されたパフォーマンスデータ:", calculatedPerformance);
    
    // パフォーマンスデータを同期的に更新 - タイミングの問題を解決
    console.log("-console by colipot-\n", "パフォーマンスデータの更新処理を開始");
    Object.keys(calculatedPerformance).forEach(key => {
      const typedKey = key as keyof typeof calculatedPerformance;
      const value = calculatedPerformance[typedKey];
      console.log("-console by colipot-\n", `パフォーマンス更新: ${key} = ${value}`);
      handlePerformanceChange(typedKey, value);
    });
    console.log("-console by colipot-\n", "パフォーマンスデータの更新処理が完了");
    
    // 更新後のパフォーマンスデータを確認
    console.log("-console by colipot-\n", "更新後のパフォーマンスデータ:", performanceData);
  };

  // カスタム更新関数 - 既存のIDを使用して更新
  const handleUpdate = async () => {
    if (hasHoles === false) {
        
        await updateRoundData(roundData, performanceData, []);
    }else{
        await updateRoundData(roundData, performanceData, holes);
    }
  };

  // パフォーマンスタブに遷移する関数
  const navigateToPerformanceTab = () => {
    // まずパフォーマンスデータを計算・更新
    calculateAndUpdatePerformance();
    
    // その後、activeTab状態を変更してタブを切り替え
    setActiveTab("performance");
  };

  // タブが変更されたときのハンドラー
  const handleTabChange = (value: string) => {
    console.log("-console by colipot-\n", `タブ変更: ${activeTab} -> ${value}`);
    
    // パフォーマンスタブが選択された場合、データを更新
    if (value === "performance") {
      console.log("-console by colipot-\n", "パフォーマンスタブ選択: パフォーマンス計算を実行します");
      calculateAndUpdatePerformance();
    }
    
    // アクティブタブの状態を更新
    setActiveTab(value);
  };

  // ラウンド情報タブへ移動
  const goToRoundTab = () => setActiveTab("round");
  
  // ホール入力タブへ移動
  const goToHoleTab = () => setActiveTab("holes");

  // タブ変更時のデバッグログ
  useEffect(() => {
    console.log("-console by colipot-\n", `activeTab変更: ${activeTab}`);
  }, [activeTab]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-golf-600"></div>
        <p className="mt-4 text-gray-600">データを読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LoadingModal isLoading={isNavigating} message="移動中..." />
      
      <div className="mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-golf-600 hover:text-golf-700 hover:bg-golf-50"
          onClick={() => navigate(`/player/${roundData.player_id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          プレイヤーページに戻る
        </Button>
      </div>
    
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold mb-2 text-golf-800">ラウンド編集</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ラウンド情報とパフォーマンスを編集できます。すべての情報は統計に反映されます。
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="fade-in">
        <TabsList className="mb-6 bg-white shadow-sm border border-gray-100 p-1 rounded-lg">
          <TabsTrigger value="round" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
            ラウンド情報
          </TabsTrigger>
          {hasHoles && (
            <TabsTrigger value="holes" className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700">
              ホール別入力
            </TabsTrigger>
          )}
          <TabsTrigger 
            value="performance" 
            className="data-[state=active]:bg-golf-50 data-[state=active]:text-golf-700"
          >
            パフォーマンス
          </TabsTrigger>
        </TabsList>

        <TabsContent value="round">
          <RoundInfoTabContent
            roundData={roundData}
            players={players}
            handleRoundChange={handleRoundChange}
            nextTab={hasHoles ? goToHoleTab : goToRoundTab} // ホールデータがなければラウンドタブのまま
          />
        </TabsContent>

        {hasHoles && (
          <TabsContent value="holes">
            <HoleInputTabContent
              holes={holes}
              currentHole={currentHole}
              submitting={updaterSubmitting || scoreSubmitting}
              handleHoleChange={handleHoleChange}
              goToNextHole={goToNextHole}
              goToPrevHole={goToPrevHole}
              navigateToPrevTab={goToRoundTab}
              calculateAndUpdatePerformance={calculateAndUpdatePerformance}
              navigateToPerformanceTab={navigateToPerformanceTab}
              setCurrentHole={setCurrentHole}
              roundCount={roundData.round_count || 1}
              getTotalHoles={getTotalHoles}
              handleSubmit={handleUpdate}
            />
          </TabsContent>
        )}

        <TabsContent value="performance">
          <PerformanceTabContent
            performanceData={performanceData}
            submitting={updaterSubmitting || scoreSubmitting}
            handlePerformanceChange={handlePerformanceChange}
            handleSubmit={handleUpdate}
            hasNoHoles={!hasHoles}
            navigateToPrevTab={hasHoles ? goToHoleTab : goToRoundTab}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}