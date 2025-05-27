//This file is for creating new reusable components, copy this
//code and paste it into your new component for a starting point
//Ctrl F and find "xxxxx" and replace it with your component name

import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const scrollingAreaVariants = cva("overflow-auto", {
  variants: {
    scrollbar: {
      custom: "scrollbar-custom",
      thin: "scrollbar-thin",
      none: "no-scrollbar",
    },
    size: {
      sm: "h-40",
      md: "h-60",
      lg: "h-80",
    },
  },
  defaultVariants: {
    scrollbar: "custom",
    size: "md",
  },
});

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface ScrollingAreaProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scrollingAreaVariants> {}

const ScrollingArea: FC<ScrollingAreaProps> = ({
  className,
  scrollbar,
  size,
  ...props
}) => {
  return (
    <div
      className={cn(scrollingAreaVariants({ scrollbar, size }), className)}
      {...props}
    />
  );
};

export { ScrollingArea, scrollingAreaVariants };
