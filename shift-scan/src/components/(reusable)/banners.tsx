import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
// add mt-24 to banner to bring it down lower
const BannerVariants = cva(
  "flex flex-col items-center justify-center mt-2 p-1 ", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-app-blue shadow-[0px_8px_0px_grey]",
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