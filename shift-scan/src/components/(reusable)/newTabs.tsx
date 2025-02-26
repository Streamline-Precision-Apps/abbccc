import React, { FC, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import "@/app/globals.css";

// Define CVA-based styles for the Tab component
const tabStyles = cva(
  "h-full rounded-[10px] flex items-center justify-center rounded-b-none font-bold border-t-transparent border-t-4",
  {
    variants: {
      isActive: {
        true: "bg-white w-full px-1.5",
        false: "bg-app-gray border-transparent border-b-4 px-1.5",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

// Extend VariantProps to manage variant options and add children support
interface TabProps extends VariantProps<typeof tabStyles> {
  onClick?: () => void;
  children: ReactNode; // Accepts any child elements
  titleImage: string;
  titleImageAlt: string;
}

// Functional Tab component with children rendering
export const NewTab: FC<TabProps> = ({
  isActive,
  onClick,
  children,
  titleImage,
  titleImageAlt,
}) => {
  return (
    <button onClick={onClick} className={classNames(tabStyles({ isActive }))}>
      <div className="flex  justify-center items-center">
        {isActive && children}
        <img
          src={titleImage}
          alt={titleImageAlt}
          className={isActive ? " w-1/3 h-full " : "w-full h-full"}
        />
      </div>
    </button>
  );
};
