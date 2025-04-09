"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useLoadingNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  
  // 画面遷移が完了したときにローディング状態をリセット
  useEffect(() => {
    if (isNavigating && navigatingTo === pathname) {
      // パス名が一致したら、画面遷移が完了したとみなす
      setIsNavigating(false);
      setNavigatingTo(null);
    }
  }, [pathname, isNavigating, navigatingTo]);
  
  const navigate = (path: string) => {
    setIsNavigating(true);
    setNavigatingTo(path);
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