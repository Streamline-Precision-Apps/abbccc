import React, { FC, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import classNames from "classnames";
import "@/app/globals.css";

// Define CVA-based styles for the Tab component
const tabStyles = cva(
  "px-4 py-4 min-w-[100px] rounded-[10px] h-full flex items-center justify-center rounded-b-none font-bold border-t-transparent border-t-4 w-full",
  {
    variants: {
      isActive: {
        true: "bg-white border-blue-500",
        false: "bg-app-dark-gray border-transparent",
      },
      size: {
        sm: "text-sm",
        md: "text-md",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      isActive: false,
      size: "sm",
    },
  }
);

// Extend VariantProps to manage variant options and add children support
interface TabProps extends VariantProps<typeof tabStyles> {
  onClick?: () => void;
  children: ReactNode; // Accepts any child elements
}

// Functional Tab component with children rendering
export const Tab: FC<TabProps> = ({ isActive, size, onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className={classNames(tabStyles({ isActive, size }))}
    >
      {children}
    </button>
  );
};
