import { cva, type VariantProps } from "class-variance-authority";
import { LabelHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Titles } from "./titles";
import { Texts } from "./texts";

//this determines styles of all labels
const LabelVariants = cva(
  "pr-3", //this applies to all variants
  {
    variants: {
      text: {//only text color and style
        black: "text-black",
        white: "text-white",
        disabled: "text-gray-600",
        link: "text-black underline underline-offset-2",
      },
      size: {//only text size
        p1: "text-3xl sm:text-3xl md:text-4xl",
        p2: "text-2xl sm:text-2xl md:text-3xl",
        p3: "text-xl",
        p4: "text-lg",
        p5: "text-med",
        p6: "text-sm",
      }
    },
    defaultVariants: {
      text: "black",
      size: "p2",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface LabelProps extends LabelHTMLAttributes<HTMLElement>, VariantProps<typeof LabelVariants> {
    type?: string
    position?: "center" | "left" | "right" | null | undefined
}

const Labels: FC<LabelProps> = ({className, text, position="left", size, type, ...props}) => {
    if (type === "title") {
        return (
          <Titles position={position}>
            <label className={cn(LabelVariants({text, size, className}))} {...props}/>
          </Titles>
        )
    } else return (
        <Texts position={position}>
            <label className={cn(LabelVariants({text, size, className}))} {...props}/>
        </Texts>
    )
}

export {Labels, LabelVariants}