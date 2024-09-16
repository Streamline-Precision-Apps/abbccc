import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const HoldVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      variant: {
        col: "flex flex-col",
        row: "flex flex-row",
      },
      size: {
        full: "w-full h-full",
      }
    },
    defaultVariants: {
      variant: "col",
      size: "full",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface HoldProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof HoldVariants> {
}

const Holds: FC<HoldProps> = ({className, variant, size, ...props}) => {
    return (
      <div className={cn(HoldVariants({variant, size, className}))} {...props}/>
    )
}

export {Holds, HoldVariants}