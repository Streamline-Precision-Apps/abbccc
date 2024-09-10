import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Anton } from "next/font/google";

const anton = Anton({ 
  subsets: ["latin"], 
  weight: "400",
})

const TitleVariants = cva(
  "font-bold p-1 m-2 text-center",
  {
    variants: {
      variant: {
        default: "text-black",
        white: "text-white",
        disabled: "text-gray-600",
        green : "text-app-green",
        bannerMessage: "pb-0 mb-0",
        modal: "mb-10",
        left: "text-left text-white font-normal",
        qrText: "mt-10 mb-10 text-center",
      },
      size: {
        default: " text-2xl",
        h1: "text-3xl",
        h2: "text-2xl",
        h3: "text-xl",
        h4: "text-lg",
        titlebox: "text-4xl p-0 pb-3 m-0 ",
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
      <div className={anton.className}>
        <h1 className={cn(TitleVariants({variant, size, className}))}{...props}/>
      </div>
    )
}

export {Titles, TitleVariants}