import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ContentVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      variant: {
        default: "flex flex-col",
        row: "flex flex-row",
        rowCenter: "flex flex-row justify-center",
        image: "bg-white",
        header: "w-full h-24 bg-orange-300",
        name: "w-full h-24 mt-[150px]",
        widgetSection: "w-full -ml-1 bg-pink-300",
        widgetButton: "bg-white w-full h-full m-1 flex flex-col justify-center items-center",
        hidden: "hidden flex-col",
        center: "flex flex-col justify-center items-center",
        test: ""
      },
      size: {
        default: "h-full max-w-lg mx-auto pt-10",
        notTop: "h-full max-w-lg mx-auto pt-0",
        listImage: "w-52 h-40 rounded-r-full border-black border-4 overflow-hidden -ml-3 justify-self-start",
        listTitle: "w-full justify-center",
        logo: "w-full h-36 justify-center items-center",
        devun1: "w-1/2 h-36 justify-center items-center",
        profilePic: "w-36 h-36 rounded-full border-black border-4 overflow-hidden justify-self-center",
        devun2: "h-full max-w-lg mx-auto mt-64",
        test: ""
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