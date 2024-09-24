import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

//This component determines the size aloted to a certain item. Focusing on width.
//Counterpart to Holds.
const HoldVariants = cva(
  "flex", //this applies to all variants
  {
    variants: {
      background: {//only variant attributes
        none: "bg-none",
        white: "bg-white rounded-2xl border border-white border-8",
        red: "bg-red-500",
        green: "bg-green-500",
        orange: "bg-orange-500",
      },
      position: {//only position attributes
        row: "flex-row items-center",
        center: "flex-col self-center",
        left: "flex-col self-start",
        right: "flex-col self-end ",
      },
      size: {//only width and height
        full: "w-full",
        first: "w-[90%]",//use on first use holding all content in Holds
        "80": "w-[80%]",
        "70": "w-[70%]",
        "60": "w-[60%]",
        "50": "w-[50%]",
        "40": "w-[40%]",
        "30": "w-[30%]",
        "20": "w-[20%]",
        "10": "w-[10%]",
      }
    },
    defaultVariants: {
      background: "none",
      position: "center",
      size: "full",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface HoldProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof HoldVariants> {
}

const Holds: FC<HoldProps> = ({className, background, position, size, ...props}) => {
    return (
      <div className={cn(HoldVariants({background, position, size, className}))} {...props}/>
    )
}

export {Holds, HoldVariants}