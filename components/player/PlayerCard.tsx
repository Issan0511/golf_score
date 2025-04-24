"use client";

import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School, Calendar, MapPin, Trophy, Edit } from "lucide-react";
import { type Player, type PlayerStats } from "@/lib/supabase";
import { useState } from "react";

interface PlayerCardProps {
  player: Player;
  stats: PlayerStats | null;
  currentFiscalYear: number;
  onViewDetails: () => void;
  onEdit: (player: Player) => void;
}

export function PlayerCard({ 
  player, 
  stats, 
  currentFiscalYear,
  onViewDetails,
  onEdit
}: PlayerCardProps) {
  // 回生（学年）を計算
  let grade = 0;
  if (player.admission_year) {
    grade = currentFiscalYear - player.admission_year + 1;
  }
  
  // 学年表示用の文字列（4回生より上はOB）
  const gradeDisplay = player.admission_year 
    ? (grade > 4 ? 'OB' : `${grade}回生`) 
    : null;
    
  // 回生に応じた色クラスを設定
  const getBadgeColorClass = (grade: number): string => {
    if (grade > 4) return 'bg-gray-700 hover:bg-gray-800'; // OB
    switch (grade) {
      case 1: return 'bg-blue-500 hover:bg-blue-600';      // 1回生
      case 2: return 'bg-emerald-500 hover:bg-emerald-600'; // 2回生
      case 3: return 'bg-amber-500 hover:bg-amber-600';    // 3回生
      case 4: return 'bg-red-500 hover:bg-red-600';        // 4回生
      default: return 'bg-golf-500 hover:bg-golf-600';     // デフォルト
    }
  };
  
  const badgeColorClass = player.admission_year ? getBadgeColorClass(grade) : 'bg-golf-500 hover:bg-golf-600';

  const handleEdit = () => {
    console.log("-console by copilot-\n", "Edit player:", player);
    onEdit(player);
  };

  return (
    <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">
      <CardHeader className="p-0">
        <div className="h-48 w-full relative bg-gradient-to-br from-golf-100 to-golf-50">
          <Image
            src={player.image_url || "/placeholder.svg?height=192&width=384"}
            alt={player.name}
            fill
            className="object-cover"
          />
          {gradeDisplay && (
            <div className="absolute top-3 left-3">
              <Badge className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${badgeColorClass}`}>
                {gradeDisplay}
              </Badge>
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Button
              size="icon"
              variant="secondary"
              className="bg-white/80 hover:bg-white text-golf-600 rounded-full"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-3 text-golf-800">{player.name}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          {player.department && (
            <div className="flex items-center">
              <School className="h-4 w-4 mr-2 text-golf-500" />
              <span>{player.department}</span>
            </div>
          )}
          {player.admission_year && (
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-golf-500" />
              <span>{player.admission_year}年入学 {gradeDisplay && (
                <span className={`ml-1 text-xs font-semibold ${
                  grade > 4 ? 'text-gray-700' : 
                  grade === 1 ? 'text-blue-600' : 
                  grade === 2 ? 'text-emerald-600' :
                  grade === 3 ? 'text-amber-600' : 
                  grade === 4 ? 'text-red-600' : ''
                }`}>({gradeDisplay})</span>
              )}</span>
            </div>
          )}
          {player.origin && (
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-golf-500" />
              <span>{player.origin}出身</span>
            </div>
          )}
          {stats?.avg_score && (
            <div className="flex items-center">
              <Trophy className="h-4 w-4 mr-2 text-golf-500" />
              <span>平均スコア: {stats.avg_score.toFixed(1)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-4 border-t border-gray-100">
        <Button
          variant="outline"
          className="w-full border-golf-500 text-golf-600 hover:bg-golf-50 hover:text-golf-700 transition-colors duration-300"
          onClick={onViewDetails}
        >
          詳細を見る
        </Button>
      </CardFooter>
    </Card>
  );
}