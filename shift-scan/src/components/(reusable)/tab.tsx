import React, { FC, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import "@/app/globals.css";

// Define CVA-based styles for the Tab component
const tabStyles = cva(
  "h-full  rounded-[10px] flex items-center justify-center rounded-b-none font-bold  relative",
  {
    variants: {
      isActive: {
        true: " w-full ",
        false: " min-w-[50px] ",
      },
      animatePulse: {
        true: "animate-pulse",
        false: "",
      },

      color: {
        lightBlue: "bg-app-blue",
        darkBlue: "bg-app-dark-blue",
        green: "bg-app-green",
        red: "bg-app-red",
        orange: "bg-app-orange",
        white: "bg-white",
        lightGray: "bg-app-gray",
        darkGray: "bg-app-dark-gray",
        none: "bg-none border-0 shadow-none",
      },
      border: {
        default:
          "border-black border-t-[3px] border-l-[3px] border-r-[3px] border-b-[2px]",
        transparent: "border-transparent border-b-[3px]",
        border: "border-black border-t-[3px] border-l-[3px] border-r-[3px]",
      },
    },
    compoundVariants: [
      {
        isActive: true,
        color: "white", // Default active color
        className: "bg-white",
      },
      {
        isActive: false,
        border: "default",
        color: "lightGray", // Default inactive color
        className: "bg-app-gray",
      },
    ],
    defaultVariants: {
      isActive: false,
      animatePulse: false,
    },
  }
);

// Extend VariantProps to manage variant options and add children support
interface TabProps extends VariantProps<typeof tabStyles> {
  onClick?: () => void;
  children?: ReactNode; // Accepts any child elements
  titleImage: string;
  titleImageAlt: string;
  isComplete?: boolean;
  isLoading?: boolean;
  animatePulse?: boolean;
  activeColor?:
    | "lightBlue"
    | "darkBlue"
    | "green"
    | "red"
    | "orange"
    | "white"
    | "lightGray"
    | "darkGray"
    | "none"
    | null
    | undefined;
  inActiveColor?:
    | "lightBlue"
    | "darkBlue"
    | "green"
    | "red"
    | "orange"
    | "white"
    | "lightGray"
    | "darkGray"
    | "none"
    | null
    | undefined;
  activeBorder?: "default" | "transparent" | "border" | null | undefined;
  inActiveBorder?: "default" | "transparent" | "border" | null | undefined;
  className?: string;
}

// Functional Tab component with children rendering
export const Tab: FC<TabProps> = ({
  isActive,
  onClick,
  children,
  titleImage,
  titleImageAlt,
  isComplete,
  isLoading,
  animatePulse,
  activeColor = "white",
  inActiveColor = "lightGray",
  activeBorder = "transparent",
  inActiveBorder = "transparent",
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={classNames(
        tabStyles({
          isActive,
          animatePulse,
          color: isActive ? activeColor : inActiveColor,
          border: isActive ? activeBorder : inActiveBorder,
        }),
        className
      )}
    >
      <div className="flex items-center justify-center w-full h-full">
        {children ? (
          <div
            className={`${
              isActive
                ? "w-full flex flex-row justify-between items-center"
                : "w-full"
            } `}
          >
            <div className="w-full h-full flex items-center gap-2 justify-center">
              {isActive && children}

              <img
                src={titleImage}
                alt={titleImageAlt}
                className={isActive ? " w-8 h-8 " : "w-8 h-8"}
              />
            </div>
            {!isComplete && !isLoading && (
              <div className="rounded-full w-4 h-4 bg-app-red absolute top-[-0.3rem] right-[-0.1rem] border-[3px] border-black"></div>
            )}
          </div>
        ) : (
          <div
            className={`${
              isActive
                ? "w-full flex flex-row justify-between items-center"
                : "w-full"
            } `}
          >
            <div className="w-full h-full flex items-center  justify-center">
              <img
                src={titleImage}
                alt={titleImageAlt}
                className={isActive ? " w-8 h-8 " : "w-8 h-8"}
              />
            </div>
            {!isComplete && !isLoading && (
              <div className="rounded-full w-4 h-4 bg-app-red absolute top-[-0.3rem] right-[-0.1rem] border-[3px] border-black"></div>
            )}
          </div>
        )}
      </div>
    </button>
  );
};
