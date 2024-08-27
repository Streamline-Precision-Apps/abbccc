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
        name: "",
        bottom: "absolute bottom-0",
        bannerDate: "pt-0 mt-0",
        totalHours: "text-white pt-0 mt-0",
      },
      size: {
        default: "text-2xl",
        widgetSm: "text-2xl p-0 m-0 w-full",
        widgetMed: "text-4xl mr-8",
        left: "text-start",
        p1: "text-3xl",
        p2: "text-2xl",
        p3: "text-xl",
        p4: "text-lg",
        sm: "text-sm",
        p0: "text-4xl",
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



