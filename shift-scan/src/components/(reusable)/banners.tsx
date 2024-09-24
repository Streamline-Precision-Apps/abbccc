import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
// add mt-24 to banner to bring it down lower
const BannerVariants = cva(
  "rounded-xl p-3", //this applies to all variants
  {
    variants: {
      background: {
        default: "bg-app-blue shadow-[0px_8px_0px_grey]",
        green: "bg-green-500",
        red: "bg-red-500",
      },
      position: {//only position attributes
        flex: "flex flex-col",
        absolute: "absolute left-0 right-0",
      },
      size: {
        full: "w-full",
      }

    },
    defaultVariants: {
      background: "default",
      position: "flex",
      size: "full",
    },
  }
)

interface BannerProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof BannerVariants> {
}

const Banners: FC<BannerProps> = ({className, background, position, size, ...props}) => {
    return (
      <div className={cn(BannerVariants({background, position, size, className}))} {...props}/>
    )
}

export {Banners, BannerVariants}