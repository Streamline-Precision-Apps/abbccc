import Spinner from "./spinner";
import React from "react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { Holds } from "../(reusable)/holds";

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  maxPullDistance?: number;
  triggerDistance?: number;
  spinner?: React.ReactNode;
}

export function PullToRefresh({ children, onRefresh }: PullToRefreshProps) {
  const {
    isRefreshing,
    pullToRefreshHandlers,
    refreshIndicatorStyle,
    pullDistance,
  } = usePullToRefresh({ onRefresh });

  return (
    <div className="relative h-full overflow-y-auto no-scrollbar">
      {/* Fixed spinner at the top */}
      {isRefreshing && (
        <div className="space-2 mt-2">
          <Spinner />
        </div>
      )}
      <div
        className={refreshIndicatorStyle}
        style={{
          height: `${Math.min(pullDistance, 50)}px`,
          opacity: pullDistance > 10 ? pullDistance / 100 : 0,
          transform: `translateY(${Math.min(pullDistance - 50, 0)}px)`,
        }}
      ></div>

      {/* Content container with optional pull-down effect */}
      <div
        {...pullToRefreshHandlers}
        className="no-scrollbar h-full"
        style={{
          transform:
            pullDistance > 0
              ? `translateY(${Math.min(pullDistance, 50)}px)`
              : "none",
          transition: "transform 0.2s ease-out",
        }}
      >
        {children}
      </div>
    </div>
  );
}
