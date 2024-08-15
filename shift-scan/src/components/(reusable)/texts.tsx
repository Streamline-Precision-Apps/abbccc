import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Mako } from "next/font/google";

const mako = Mako({ 
  subsets: ["latin"], 
  weight: "400",
})

const TextVariants = cva(
  "p-1 m-2 mt-0 text-center ", //this applies to all variants
  {
    variants: {
      variant: {
        default: "text-black text-body",
        white: "text-white",
        disabled: "text-gray-600",
        name: "pt-5 mt-5",
        bottom: "absolute bottom-0",
      },
      size: {
        default: "text-2xl",
        left: "text-start",
        p1: "text-3xl",
        p2: "text-2xl",
        p3: "text-xl",
        p4: "text-lg",
        sm: "text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface TextProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof TextVariants> {
}

const Texts: FC<TextProps> = ({className, variant, size, ...props}) => {
    return (
      <div className={mako.className}>
        <p className={cn(TextVariants({variant, size, className}))} {...props}/>
      </div>
    )
}

export {Texts, TextVariants}



