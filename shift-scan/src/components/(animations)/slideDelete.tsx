import { motion, useAnimation } from "framer-motion";
import React, { useState, useRef, useEffect } from "react";
import { Images } from "../(reusable)/images";
import { Buttons } from "../(reusable)/buttons";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

// Define prop types for flexibility
interface SlidingDivProps extends React.PropsWithChildren {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  confirmationMessage?: string;
}

export default function SlidingDiv({
  children,
  onSwipeLeft,
  onSwipeRight,
  confirmationMessage = "Are you sure you want to delete this item?",
}: SlidingDivProps) {
  // Control animation manually
  const controls = useAnimation();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  // Handle delete confirmation
  const handleDelete = () => {
    setShowConfirmation(false);
    if (onSwipeLeft) {
      onSwipeLeft();
    }
  };

  // Detect swipe direction on drag end
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } },
  ) => {
    const threshold = containerWidth * 0.5; // 50% of the container width

    // Swipe Left Event
    if (info.offset.x < -threshold) {
      console.log("Swiped Left");
      setShowConfirmation(true);
    }

    // Swipe Right Event (Optional)
    if (info.offset.x > 50) {
      console.log("Swiped Right");
      if (onSwipeRight) {
        onSwipeRight();
      }
    }

    // Snap back to original position
    controls.start({ x: 0, transition: { duration: 0.3, ease: "easeOut" } });
  };

  return (
    <>
      <div
        className="w-full h-fit mb-4 bg-app-red rounded-[10px] relative overflow-hidden"
        ref={containerRef}
      >
        {/* Image in Background */}
        <Images
          titleImg={"/trash.svg"}
          titleImgAlt="trash-icon"
          className="absolute top-0 right-2 h-full w-10 p-3 "
        />

        {/* Swipable Motion Div */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -350, right: 0 }} // Drag limits
          dragElastic={0} // No bounce back effect
          animate={controls}
          onDragEnd={handleDragEnd}
          className="relative " // Ensure it stays above the background image
        >
          {children}
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-md rounded-lg w-[90%]">
          <DialogHeader>
            <DialogTitle className="text-center">Confirm Delete</DialogTitle>
            <DialogDescription className="text-center pb-3">
              {confirmationMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center flex flex-row gap-4">
            <Buttons
              shadow={"none"}
              onClick={() => setShowConfirmation(false)}
              className="bg-gray-300 text-black px-6 py-2 rounded-md"
            >
              Cancel
            </Buttons>
            <Buttons
              shadow={"none"}
              onClick={handleDelete}
              className="bg-app-red text-white px-6 py-2 rounded-md"
            >
              Delete
            </Buttons>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
