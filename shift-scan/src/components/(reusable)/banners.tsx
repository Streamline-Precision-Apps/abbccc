import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const BannerVariants = cva(
  "flex flex-col items-center justify-center", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-blue-300 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]",
        green: "bg-green-500",
        red: "bg-red-500",
        clear: "bg-none",
      },
      size: {
        default: "p-1 w-screen",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface BannerProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof BannerVariants> {
}

const Banners: FC<BannerProps> = ({className, variant, size, ...props}) => {
    return (
      <div className={cn(BannerVariants({variant, size, className}))} {...props}/>
    )
}

export {Banners, BannerVariants}