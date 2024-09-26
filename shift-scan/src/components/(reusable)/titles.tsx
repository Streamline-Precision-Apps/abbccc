import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Anton } from "next/font/google";

const anton = Anton({ 
  subsets: ["latin"], 
  weight: "400",
})

//this determines styles of all title text
const TitleVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      text: {//only text color and style
        black: "text-black",
        bold: "text-black font-bold",
        white: "text-white",
        disabled: "text-gray-600",
        link: "text-black underline underline-offset-2",
      },
      position: {//only position attributes
        center: "text-center",
        left: "text-start",
        right: "text-end",
      },
      size: {//only text size
        h1: "text-3xl sm:text-3xl md:text-4xl lg:text-5xl",
        h2: "text-2xl sm:text-2xl md:text-3xl lg:text-4xl",
        h3: "text-xl",
        h4: "text-lg",
        h5: "text-med",
        h6: "text-sm",
      }
    },
    defaultVariants: {
      text: "black",
      position: "center",
      size: "h2",
    },
  }
)

interface TitleProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof TitleVariants> {
}

const Titles: FC<TitleProps> = ({className, text, position, size, ...props}) => {
    
    return (
      <div className={anton.className}>
        <h1 className={cn(TitleVariants({text, position, size, className}))}{...props}/>
      </div>
    )
}

export {Titles, TitleVariants}