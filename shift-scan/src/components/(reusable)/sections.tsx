import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const SectionVariants = cva(
  "sections m-4 p-2 mt-0 border border-white border-8 justify-center", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-white rounded-2xl",
        tab: "bg-white rounded-2xl min-h-[200px] rounded-t-none p-6",
        eq: "bg-white border-2 border-black rounded-2xl ",

      },
      size: {
        default: "h-screen min-w-screen",
        half: "h-1/2 min-w-screen overflow-y-auto no-scrollbar",
        dynamic: "h-full min-w-screen  overflow-y-auto no-scrollbar",
        titleBox: "pb-0",
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