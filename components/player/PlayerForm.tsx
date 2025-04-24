"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { School, Calendar, MapPin, Image as ImageIcon } from "lucide-react";
import { supabase, type Player } from "@/lib/supabase";

interface PlayerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  player?: Player | null; // 編集の場合はプレイヤーデータが渡される
  mode: 'create' | 'edit';
}

// プレイヤーテーブルに存在するカラムのみを指定
type PlayerFormData = {
  id?: string;
  name?: string;
  department?: string | null;
  admission_year?: number | null;
  origin?: string | null;
  highschool?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

export function PlayerForm({ isOpen, onClose, onSuccess, player, mode }: PlayerFormProps) {
  const [playerData, setPlayerData] = useState<PlayerFormData>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 編集モードの場合は初期値をセット（statsなど不要なプロパティを除外）
  useEffect(() => {
    if (mode === 'edit' && player) {
      // 必要なプロパティのみを抽出
      const { id, name, department, admission_year, origin, highschool, image_url, created_at } = player;
      const playerFormData: PlayerFormData = { id, name, department, admission_year, origin, highschool, image_url, created_at };
      
      setPlayerData(playerFormData);
      console.log("-console by copilot-\n", "Editing player (filtered):", playerFormData);
    } else {
      setPlayerData({});
    }
  }, [player, mode, isOpen]);

  // フォームの入力値を更新する関数
  const handleInputChange = (field: keyof PlayerFormData, value: string | number | null) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
    
    // 入力があればエラーを消去
    if (error) setError(null);
  }

  // 数値の入力フィールド用のハンドラー
  const handleNumberInputChange = (field: keyof PlayerFormData, value: string) => {
    // 空文字列の場合はnull、それ以外は数値に変換
    const numValue = value === "" ? null : parseInt(value, 10);
    handleInputChange(field, numValue);
  }

  // フォームをリセットする関数
  const resetForm = () => {
    setPlayerData({});
    setError(null);
  }

  // フォームを閉じる時の処理
  const handleClose = () => {
    resetForm();
    onClose();
  }

  // フォームの送信処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("-console by copilot-\n", "Submitting player data:", playerData);
    
    // 必須フィールドのバリデーション
    if (!playerData.name) {
      setError("名前は必須です");
      return;
    }
    
    if (!playerData.admission_year) {
      setError("入学年は必須です");
      return;
    }
    
    if (!playerData.department) {
      setError("学部・学科は必須です");
      return;
    }
    
    try {
      setSubmitting(true);
      
      let result;
      
      if (mode === 'create') {
        // 新規追加の場合
        result = await supabase
          .from("players")
          .insert([playerData])
          .select();
          
        console.log("-console by copilot-\n", "Player created:", result);
      } else {
        // 編集の場合
        result = await supabase
          .from("players")
          .update(playerData)
          .eq("id", playerData.id)
          .select();
          
        console.log("-console by copilot-\n", "Player updated:", result);
      }
      
      if (result.error) {
        console.error(`Error ${mode === 'create' ? 'adding' : 'updating'} player:`, result.error);
        setError(`プレイヤーの${mode === 'create' ? '追加' : '更新'}に失敗しました: ${result.error.message}`);
        return;
      }
      
      // 成功したらフォームをリセットして閉じる
      resetForm();
      onClose();
      
      // 親コンポーネントに成功を通知
      onSuccess();
      
    } catch (err) {
      console.error(`Exception ${mode === 'create' ? 'adding' : 'updating'} player:`, err);
      setError(`プレイヤーの${mode === 'create' ? '追加' : '更新'}中にエラーが発生しました`);
    } finally {
      setSubmitting(false);
    }
  }

  // タイトルなどの表示テキストを設定
  const formTitle = mode === 'create' ? '新規プレイヤー追加' : 'プレイヤー情報編集';
  const submitButtonText = mode === 'create' ? 'プレイヤーを追加' : '変更を保存';
  const description = mode === 'create' 
    ? '新しいプレイヤーの情報を入力してください。*は必須項目です。'
    : 'プレイヤーの情報を編集してください。*は必須項目です。';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {error && (
              <div className="text-red-500 text-sm font-medium mb-2">{error}</div>
            )}
            
            <FormField label="名前*" icon={<School className="h-4 w-4 text-golf-500" />}>
              <Input
                value={playerData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="例: 山田太郎"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            
            <FormField label="入学年*" icon={<Calendar className="h-4 w-4 text-golf-500" />}>
              <Input
                type="number"
                value={playerData.admission_year || ""}
                onChange={(e) => handleNumberInputChange("admission_year", e.target.value)}
                placeholder="例: 2023"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            
            <FormField label="学部・学科*" icon={<School className="h-4 w-4 text-golf-500" />}>
              <Input
                value={playerData.department || ""}
                onChange={(e) => handleInputChange("department", e.target.value)}
                placeholder="例: 経済学部"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            
            <FormField label="出身県" icon={<MapPin className="h-4 w-4 text-golf-500" />}>
              <Input
                value={playerData.origin || ""}
                onChange={(e) => handleInputChange("origin", e.target.value)}
                placeholder="例: 東京都"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            
            <FormField label="出身高校" icon={<School className="h-4 w-4 text-golf-500" />}>
              <Input
                value={playerData.highschool || ""}
                onChange={(e) => handleInputChange("highschool", e.target.value)}
                placeholder="例: ○○高校"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
            
            <FormField label="プロフィール画像URL" icon={<ImageIcon className="h-4 w-4 text-golf-500" />}>
              <Input
                value={playerData.image_url || ""}
                onChange={(e) => handleInputChange("image_url", e.target.value)}
                placeholder="例: https://example.com/image.jpg"
                className="border-gray-200 focus:border-golf-500 focus:ring-golf-500"
              />
            </FormField>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={submitting}>
              キャンセル
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  送信中...
                </>
              ) : (
                submitButtonText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}