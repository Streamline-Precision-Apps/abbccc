import { cva, type VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ImageVariants = cva(
  "flex items-center justify-center rounded-sm w-50 h-35 pt-4", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-blue-500",
        icon: "bg-none",
      },
      size: {
        default: "p-10 w-100 h-100",
        sm: "p-2 w-30 h-30",
        med: "p-10 w-40 h-40",
        lg: "p-10 w-50 h-50",
        titlebox: "w-20 h-20",
        backButton: "w-15 w-15 pt-0"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, VariantProps<typeof ImageVariants> {
    titleImg: string;
    titleImgAlt: string;
}

const Images: FC<ImageProps> = ({className, variant, size, titleImg, titleImgAlt, ...props}) => {
    return (
      <img src={titleImg} alt={titleImgAlt} className={cn(ImageVariants({variant, size, className}))} {...props}/>
    )
}

export {Images, ImageVariants}