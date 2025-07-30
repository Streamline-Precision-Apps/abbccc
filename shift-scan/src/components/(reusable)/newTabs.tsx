import "@/app/globals.css";
import React, { FC, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";

// Define CVA-based styles for the Tab component
const tabStyles = cva(
  "h-full rounded-[10px] flex items-center justify-center rounded-b-none font-bold  relative",
  {
    variants: {
      isActive: {
        true: " w-full px-1.5",
        false: " px-3",
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
        default: "border-black border-t-[3px] border-l-[3px] border-r-[3px]",
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
  },
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
  className?: string | undefined;
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
  activeColor = "white",
  inActiveColor = "lightGray",
  activeBorder = "transparent",
  inActiveBorder = "transparent",
  className = undefined,
}) => {
  return (
    <button
      onClick={onClick}
      className={[
        tabStyles({
          isActive,
          animatePulse,
          color: isActive ? activeColor : inActiveColor,
          border: isActive ? activeBorder : inActiveBorder,
        }),
        className ? className : "",
      ]
        .filter(Boolean)
        .join(" ")}
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
            className={isActive ? " w-8 h-8" : "w-10 h-10 "}
          />
        </div>
        {!isComplete && !isLoading && (
          <div className="rounded-full w-4 h-4 bg-app-red absolute top-[-0.3rem] right-[-0.1rem] border-[3px] border-black"></div>
        )}
      </div>
    </button>
  );
};
