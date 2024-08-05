import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const SectionVariants = cva(
  "flex flex-col items-center max-w-lg mx-auto", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-white rounded-2xl mt-3",
        tab: "bg-white rounded-2xl min-h-[200px] rounded-t-none p-6",
        eq: "bg-white border-2 border-black rounded-2xl ",
      },
      size: {
        default: "w-full h-screen",
        dynamic: "w-full h-full",
        titleBox: "w-full h-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface SectionProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof SectionVariants> {
}

const Sections: FC<SectionProps> = ({className, variant, size, ...props}) => {
    return (
      <div className={cn(SectionVariants({variant, size, className}))} {...props}/>
    )
}

export {Sections, SectionVariants}