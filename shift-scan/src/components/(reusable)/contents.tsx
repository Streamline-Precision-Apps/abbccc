import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ContentVariants = cva(
  "bg-none", //this applies to all variants
  {
    variants: {
      variant: {
        default: "flex flex-col",
        row: "flex flex-row",
        image: "bg-white",
      },
      size: {
        default: "h-full max-w-lg mx-auto pt-10",
        notTop: "h-full max-w-lg mx-auto pt-0",
        listImage: "w-52 h-40 rounded-r-full border-black border-4 overflow-hidden -ml-3 justify-self-start",
        listTitle: "w-full justify-center",
        profilePic: "w-36 h-36 rounded-full border-black border-4 overflow-hidden justify-self-center",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface ContentProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof ContentVariants> {
}

const Contents: FC<ContentProps> = ({className, variant, size, ...props}) => {
    return (
      <div className={cn(ContentVariants({variant, size, className}))} {...props}/>
    )
}

export {Contents, ContentVariants}