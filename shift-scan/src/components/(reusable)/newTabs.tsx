import React, { FC, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import "@/app/globals.css";

// Define CVA-based styles for the Tab component
const tabStyles = cva(
  "h-full rounded-[10px] flex items-center justify-center rounded-b-none font-bold border-t-transparent border-t-4 relative",
  {
    variants: {
      isActive: {
        true: "bg-white w-full px-1.5",
        false: "bg-app-gray border-transparent border-b-4 px-3",
      },
      animatePulse: {
        true: "animate-pulse",
        false: "",
      },
    },
    defaultVariants: {
      isActive: false,
      animatePulse: false,
    },
  }
);

// Extend VariantProps to manage variant options and add children support
interface TabProps extends VariantProps<typeof tabStyles> {
  onClick?: () => void;
  children: ReactNode; // Accepts any child elements
  titleImage: string;
  titleImageAlt: string;
  isComplete?: boolean;
  isLoading?: boolean;
  animatePulse?: boolean;
}

// Functional Tab component with children rendering
export const NewTab: FC<TabProps> = ({
  isActive,
  onClick,
  children,
  titleImage,
  titleImageAlt,
  isComplete,
  isLoading,
  animatePulse,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(tabStyles({ isActive, animatePulse }))}
    >
      <div
        className={`${
          isActive
            ? "w-full flex flex-row justify-between items-center"
            : "w-full"
        } `}
      >
        <div className="w-3/4 h-full">{isActive && children}</div>
        <div className={`${isActive ? "w-1/4 h-full" : "w-full "} `}>
          <img
            src={titleImage}
            alt={titleImageAlt}
            className={isActive ? " w-8 h-8" : "w-12 h-12 "}
          />
        </div>
        {!isComplete && !isLoading && (
          <div className="rounded-full w-4 h-4 bg-app-red absolute top-[-0.3rem] right-[-0.1rem] border-[3px] border-black"></div>
        )}
      </div>
    </button>
  );
};
