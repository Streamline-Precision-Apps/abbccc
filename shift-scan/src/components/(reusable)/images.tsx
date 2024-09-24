import { cva, type VariantProps } from "class-variance-authority";
import { ImgHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

//this determines styles of all images
const ImageVariants = cva(
  "flex items-center justify-center ", //this applies to all variants
  {
    variants: {
      background: {//only background attributes
        white: "bg-white rounded-2xl",
        none: "bg-none",  
      },
      position: {//only position attributes
        center: "self-center",
        left: "self-start",
        right: "self-end",
      },
      size: {//only width and height
        // small: "w-[9%] sm:w-[7%] md:w-[5%] 2xl:w-[3%]", REMOVE AFTER FLUID IS IMPLEMENTED
        // medium: "w-[35%] sm:w-[30%] md:w-[28%] lg:w-[25%] xl:w-[22%] 2xl:w-[18%]",
        // large: "w-[40%] sm:w-[30%] md:w-[30%]",
        // default: "w-[80%] sm:w-[75%] md:w-[70%] lg:w-[55%] xl:w-[50%] 2xl:w-[45%]",
        full: "w-full",
        "90": "w-[90%]",
        "80": "w-[80%]",
        "70": "w-[70%]",
        "60": "w-[60%]",
        "50": "w-[50%]",
        "40": "w-[40%]",
        "30": "w-[30%]",
        "20": "w-[20%]",
        "10": "w-[10%]",
      }
    },
    defaultVariants: {
      background: "none",
      position: "center",
      size: "80",
    },
  }
)

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, VariantProps<typeof ImageVariants> {
    titleImg: string;
    titleImgAlt: string;
}

const Images: FC<ImageProps> = ({className, background, position, size, titleImg, titleImgAlt, ...props}) => {
    return (
      <img src={titleImg} alt={titleImgAlt} className={cn(ImageVariants({background, position, size, className}))} {...props}/>
    )
}

export {Images, ImageVariants}