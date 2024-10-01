import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const GridVariants = cva(
  "grid", //this applies to all variants
  {
    variants: {
      size: {
        widgets: "grid-cols-2 grid-rows-3 gap-x-3 gap-y-3",
      },
    },
    defaultVariants: {
      size: "widgets",
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