import { useState, useCallback } from "react";

interface UsePullToRefreshProps {
  onRefresh: () => Promise<void>;
}

interface PullToRefreshHandlers {
  onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  onTouchEnd: () => void;
}
interface UsePullToRefreshReturn {
  isRefreshing: boolean;
  pullToRefreshHandlers: PullToRefreshHandlers;
  refreshIndicatorStyle: string;
  pullDistance: number;
}

export function usePullToRefresh({
  onRefresh,
}: UsePullToRefreshProps): UsePullToRefreshReturn {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [release, setRelease] = useState(false);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      setStartY(e.touches[0].clientY);
      setRelease(false);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      const currentY = e.touches[0].clientY;
      const distance = currentY - startY;

      // Only trigger if pulling down (distance > 0)
      if (distance > 50) {
        const normalizedDistance = Math.min(distance, 100); // Cap at 100px
        setPullDistance(normalizedDistance);

        if (normalizedDistance > 50 && !isRefreshing) {
          setRelease(true);
        }
      }
    },
    [isRefreshing, startY]
  );

  const handleTouchEnd = useCallback(async () => {
    if (release) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
    setPullDistance(0);
    setStartY(0);
    setRelease(false);
  }, [onRefresh, release]);

  // Tailwind classes for the refresh indicator
  const refreshIndicatorStyle = [
    "fixed top-0 left-0 right-0",
    "flex items-center justify-center",
    "transition-all duration-200 ease-out",
    `h-[${Math.min(pullDistance, 50)}px]`, // Max height of 50px for spinner
    `opacity-${pullDistance > 10 ? pullDistance / 100 : 0}`,
    "pointer-events-none",
  ].join(" ");

  return {
    isRefreshing,
    pullToRefreshHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    pullDistance,
    refreshIndicatorStyle,
  };
}
