import { cva, type VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ImageVariants = cva(
  "flex items-center justify-center", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-blue-500",
        icon: "bg-none",
        iconLeft: "absolute left-1 top-1",
        iconRight: "absolute right-5 top-8",
        picture: "w-full h-full mt-3",
      },
      size: {
        default: "w-15 h-15",
        widgetSm: "pt-5 h-20",
        widgetMed: "p-10 w-40 h-40",
        widgetLg: "p-10 w-50 h-50",
        titlebox: "w-36",
        backButton: "w-15 w-15 pt-0",
        logo: "w-50 h-50",
        thin: "w-20 h-10",
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