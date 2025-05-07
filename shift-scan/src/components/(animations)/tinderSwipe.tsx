import { motion, useAnimation, PanInfo } from "framer-motion";
import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Holds } from "../(reusable)/holds";
import { Images } from "../(reusable)/images";
import { Texts } from "../(reusable)/texts";

interface SlidingDivProps extends React.PropsWithChildren {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export type TinderSwipeRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

const TinderSwipe = forwardRef<TinderSwipeRef, SlidingDivProps>(
  function TinderSwipe({ children, onSwipeLeft, onSwipeRight }, ref) {
    const controls = useAnimation();
    const [bgColor, setBgColor] = useState("bg-transparent");
    const [Message, setMessage] = useState("");
    const [isScrolling, setIsScrolling] = useState(false);

    // Expose swipe functions to parent component
    useImperativeHandle(ref, () => ({
      swipeLeft: () => triggerSwipe("left"),
      swipeRight: () => triggerSwipe("right"),
    }));

    const triggerSwipe = (direction: "left" | "right") => {
      const x = direction === "left" ? -350 : 350;
      const bg = direction === "left" ? "bg-app-orange" : "bg-app-green";
      const msg =
        direction === "left" ? "Editing Time Sheets" : "Approving Time Sheets";

      setBgColor(bg);
      setMessage(msg);

      controls
        .start({
          x,
          transition: { duration: 0.45, ease: "easeOut" },
        })
        .then(() => {
          if (direction === "left") {
            onSwipeLeft?.();
          } else {
            onSwipeRight?.();
          }
          // Reset after completion
          controls.start({
            x: 0,
            transition: { duration: 0 },
          });
          setBgColor("bg-transparent");
          setMessage("");
        });
    };

    const handleDrag = (
      event: MouseEvent | TouchEvent | PointerEvent,
      info: PanInfo
    ) => {
      if (Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
        setIsScrolling(true);
        return;
      }
      setIsScrolling(false);

      const { offset } = info;

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
      if (isScrolling) return;
      const { offset } = info;

      if (offset.x < -300) {
        triggerSwipe("left");
      } else if (offset.x > 300) {
        triggerSwipe("right");
      } else {
        controls.start({
          x: 0,
          transition: { duration: 0.3, ease: "easeOut" },
        });
        setBgColor("bg-transparent");
      }
    };

    return (
      <Holds
        className={`w-full h-full rounded-[10px] relative overflow-hidden transition-colors duration-200 ${bgColor}`}
      >
        <Images
          titleImg={
            bgColor === "bg-app-orange" ? "/formEdit.svg" : "/statusApprovedFilled.svg"
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
          dragElastic={0.2}
          animate={controls}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          className="relative h-full overflow-y-auto"
          style={{ touchAction: "pan-y" }}
        >
          {children}
        </motion.div>
      </Holds>
    );
  }
);

export default TinderSwipe;
