import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const BannerVariants = cva(
  "flex flex-col items-center justify-center p-1 absolute left-0 right-0", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-blue-300",
        green: "bg-green-500",
        red: "bg-red-500",
      }
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface BannerProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof BannerVariants> {
}

const Banners: FC<BannerProps> = ({className, variant, ...props}) => {
    return (
      <div className={cn(BannerVariants({variant, className}))} {...props}/>
    )
}

export {Banners, BannerVariants}