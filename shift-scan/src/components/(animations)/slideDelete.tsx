import { motion, useAnimation } from "framer-motion";
import React from "react";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";

// Define prop types for flexibility
interface SlidingDivProps extends React.PropsWithChildren {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function SlidingDiv({
  children,
  onSwipeLeft,
  onSwipeRight,
}: SlidingDivProps) {
  // Control animation manually
  const controls = useAnimation();

  // Detect swipe direction on drag end
  const handleDragEnd = (event: DragEvent, info: { offset: { x: number } }) => {
    // Swipe Left Event
    if (info.offset.x < -50) {
      console.log("Swiped Left");
      onSwipeLeft && onSwipeLeft(); // Trigger custom event if provided
    }

    // Swipe Right Event (Optional)
    if (info.offset.x > 50) {
      console.log("Swiped Right");
      onSwipeRight && onSwipeRight(); // Trigger custom event if provided
    }

    // Snap back to original position
    controls.start({ x: 0, transition: { duration: 0.3, ease: "easeOut" } });
  };

  return (
    <Holds className="w-full h-fit bg-app-red rounded-[10px] relative overflow-hidden">
      {/* Image in Background */}
      <Images
        titleImg={"/trash.svg"}
        titleImgAlt="trash-icon"
        className="absolute top-0 right-2 h-full w-10 p-3 "
      />

      {/* Swipable Motion Div */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }} // Drag limits
        dragElastic={0} // No bounce back effect
        animate={controls}
        onDragEnd={handleDragEnd}
        className="relative " // Ensure it stays above the background image
      >
        {children}
      </motion.div>
    </Holds>
  );
}
