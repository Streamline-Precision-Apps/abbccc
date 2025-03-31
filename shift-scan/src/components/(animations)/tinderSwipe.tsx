import { motion, useAnimation, PanInfo } from "framer-motion";
import React, { useState } from "react";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";
import { set } from "date-fns";

interface SlidingDivProps extends React.PropsWithChildren {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export default function TinderSwipe({
  children,
  onSwipeLeft,
  onSwipeRight,
}: SlidingDivProps) {
  const controls = useAnimation();
  const [bgColor, setBgColor] = useState("bg-transparent");
  const [Message, setMessage] = useState("");

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset } = info;

    // Change color dynamically while dragging
    if (offset.x < -50) {
      setBgColor("bg-app-orange");
      setMessage("Editing Time Sheets");
    } else if (offset.x > 50) {
      setBgColor("bg-app-green");
      setMessage("Approving Time Sheets");
    } else {
      setBgColor("bg-transparent");
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset } = info;

    // Final swipe actions
    if (offset.x < -300) {
      console.log("Swiped Left");
      onSwipeLeft?.();
    } else if (offset.x > 300) {
      console.log("Swiped Right");
      onSwipeRight?.();
    }

    // Reset position and color
    controls.start({
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    });
    setBgColor("bg-transparent");
  };

  return (
    <Holds
      className={`w-full h-full rounded-[10px] relative overflow-hidden transition-colors duration-200 ${bgColor}`}
    >
      <Images
        titleImg={
          bgColor === "bg-app-orange" ? "/edit-form.svg" : "/complete.svg"
        }
        titleImgAlt="verification icon"
        className="absolute top-0 h-full w-32 p-3 "
      />
      <Texts className="absolute w-full bottom-1/4 transform translate-y-1/4 text-center ">
        {Message}
      </Texts>
      <motion.div
        drag="x"
        dragConstraints={{ left: -350, right: 350 }}
        dragElastic={0}
        animate={controls}
        onDrag={handleDrag} // Update color while dragging
        onDragEnd={handleDragEnd}
        className="relative h-full"
      >
        {children}
      </motion.div>
    </Holds>
  );
}
