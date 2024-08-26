import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const GridVariants = cva(
  "m-0", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-blue-500",
        widgets: " grid grid-cols-2 grid-rows-3 gap-x-5 gap-y-5",
        red: "bg-red-500",
      },
      size: {
        default: "",
        sm: "p-2 w-30 h-30",
        med: "p-10 w-40 h-40",
        lg: "p-10 w-50 h-50"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface GridProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof GridVariants> {
}

const Grids: FC<GridProps> = ({className, variant, size, ...props}) => {
    return (
      <div className={cn(GridVariants({variant, size, className}))} {...props}/>
    )
}

export {Grids, GridVariants}