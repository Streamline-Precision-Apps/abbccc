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
        submitCard:"absolute right-2 top-3",
        picture: "w-full h-full mt-3",
        editIcon: "absolute z-2 top-24 right-0 bg-app-orange justify-center px-3 py-1 items-center rounded-full",  
      },
      position: {
        center: "self-center",
        left: "self-start",
        right: "self-end",
      },
      size: {
        half: "w-[15%]",
        fill: "w-[50%]",

        default: "self-center w-[40%] max-w-[300px] m-10",
        widgetSm: "h-[80px] w-[80px]",
        widgetMed: "h-[130px] w-[130px]",
        widgetLg: "p-10 w-50 h-50",
        titlebox: "w-36",
        backButton: "w-15 w-15 pt-0",
        downArrow: "w-[50px] h-[50px]",
        icon: "w-[60px] h-[60px] ",
        iconMed: "w-[80px] h-[80px] ",
        logo: "h-20",
        editIcon : "w-10 h-10 pt-0 ",
        thin: "w-20 h-10",
        password: "w-10 h-10",
      }
    },
    defaultVariants: {
      variant: "default",
      position: "center",
      size: "default",
    },
  }
)

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement>, VariantProps<typeof ImageVariants> {
    titleImg: string;
    titleImgAlt: string;
}

const Images: FC<ImageProps> = ({className, variant,position, size, titleImg, titleImgAlt, ...props}) => {
    return (
      <img src={titleImg} alt={titleImgAlt} className={cn(ImageVariants({variant,position, size, className}))} {...props}/>
    )
}

export {Images, ImageVariants}