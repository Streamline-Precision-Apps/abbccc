import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const GridVariants = cva(
  "grid h-full", //this applies to all variants
  {
    variants: {
      size: {
        widgets: "grid-cols-2 grid-rows-3 gap-5",
        dashboard: "grid-rows-7",
        settings: "grid-rows-6",

      },
    },
    defaultVariants: {
      size: "dashboard",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface GridProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof GridVariants> {
}

const Grids: FC<GridProps> = ({className, size, ...props}) => {
    return (
      <div className={cn(GridVariants({size, className}))} {...props}/>
    )
}

export {Grids, GridVariants}