// ----- LongPressable Component -----
// This component will trigger the onLongPress callback if the user

import { useRef } from "react";

// presses and holds for the specified duration (holdTime).
export function LongPressable({
  onLongPress,
  holdTime = 1000,
  children,
  ...rest
}: {
  onLongPress: () => void;
  holdTime?: number;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startPress = () => {
    timerRef.current = setTimeout(() => {
      onLongPress();
    }, holdTime);
  };

  const endPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  return (
    <div
      {...rest}
      onMouseDown={startPress}
      onMouseUp={endPress}
      onMouseLeave={endPress}
      onTouchStart={startPress}
      onTouchEnd={endPress}
    >
      {children}
    </div>
  );
}
