import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const TitleVariants = cva(
  "font-bold p-1 m-2 text-center",
  {
    variants: {
      variant: {
        default: "text-black",
        white: "text-white",
        disabled: "text-gray-600",
        green : "text-app-green",
      },
      size: {
        default: " text-2xl",
        h1: "text-3xl",
        h2: "text-2xl",
        h3: "text-xl",
        h4: "text-lg",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface TitleProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof TitleVariants> {
}

const Titles: FC<TitleProps> = ({className, variant, size, ...props}) => {
    
    return (
      <h1 className={cn(TitleVariants({variant, size, className}))} {...props}/>
    )
}

export {Titles, TitleVariants}