"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function useLoadingNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const navigatingToRef = useRef<string | null>(null);
  
  // 画面遷移が完了したときにローディング状態をリセット
  useEffect(() => {
    if (isNavigating && navigatingToRef.current === pathname) {
      // パス名が一致したら、画面遷移が完了したとみなす
      setIsNavigating(false);
      navigatingToRef.current = null;
    }
  }, [pathname, isNavigating]);
  
  const navigate = useCallback((path: string) => {
    // 現在と同じパスへの遷移はスキップ
    if (path === pathname) return;
    
    setIsNavigating(true);
    navigatingToRef.current = path;
    
    // 画面遷移前にローディング状態を設定
    // setTimeout を使わず、直接遷移させる
    router.push(path);
  }, [router, pathname]);

  return {
    isNavigating,
    navigate,
    setIsNavigating
  };
}