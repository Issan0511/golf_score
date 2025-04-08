"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function useLoadingNavigation() {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const navigate = (path: string) => {
    setIsNavigating(true);
    // 画面遷移前にローディング状態を設定
    setTimeout(() => {
      router.push(path);
    }, 10); // わずかな遅延を設けて状態変更を確実に反映させる
  };

  return {
    isNavigating,
    navigate,
    setIsNavigating
  };
}