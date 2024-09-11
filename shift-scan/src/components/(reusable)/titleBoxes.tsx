import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Buttons } from "../(reusable)/buttons";
import { Titles } from "../(reusable)/titles";
import { Images } from "../(reusable)/images";
import { Contents } from "./contents";

const TitleBoxVariants = cva(
  "relative flex items-center justify-center w-full mx-auto", //this applies to all variants
  {
    variants: {
      variant: {
        default: "flex-col",
        row: "flex-row py-7 items-end",
        red: "bg-red-500",
        orange: "bg-orange-500",
        green: "bg-app-green",
      },
      size: {
        default: "",
        sm: "p-2 w-30 h-30",
        med: "p-10 w-40 h-40",
        lg: "p-10 w-50 h-50"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface TitleBoxProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof TitleBoxVariants> {
    type?: string;
    title: string;
    titleImg: string;
    titleImgAlt: string;
    src ?: string;
}

const TitleBoxes: FC<TitleBoxProps> = ({className, variant, size, type, title, titleImg, titleImgAlt, ...props}) => {
    if (type === "profilePic") {
        return (
            <div className={cn(TitleBoxVariants({variant, size, className}))} {...props}>
                <Buttons href='back' variant={"icon"} size={"backButton"}>
                    <Images titleImg="/backArrow.svg" titleImgAlt={titleImgAlt} variant={"icon"} size={"backButton"}/>
                </Buttons>
                    {props.children}
                <Contents variant={"image"} size={"profilePic"}>
                    <Images titleImg={titleImg} titleImgAlt={titleImgAlt} variant={"icon"} size={"default"}/>
                </Contents>
                <Titles variant={"default"} size={"titlebox"}>{title}</Titles>
            </div>

        )  
    }

    if (type === "titleOnly") {
        return (
            <div className={cn(TitleBoxVariants({variant, size, className}))} {...props}>
                <Titles variant={"default"} size={"h1"}>{title}</Titles>
                {props.children}
            </div>
        )
    }
    if (type === "noIcon") {
        return (
            <div className={cn(TitleBoxVariants({variant, size, className}))} {...props}>
                <Buttons href='back' variant={"icon"} size={"backButton"}>
                    <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" variant={"icon"} size={"backButton"}/>
                </Buttons>
                <Titles variant={"default"} size={"h1"}>{title}</Titles>
            </div>
        )
    }
    if (type === "withDate") {
        return (
            <div className={cn(TitleBoxVariants({variant, size, className}))} {...props}>
                <Buttons href='back' variant={"icon"} size={"backButton"}>
                    <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" variant={"icon"} size={"backButton"}/>
                </Buttons>
                <Titles variant={"default"} size={"h1"}>{title}</Titles>
            </div>
        )
    }
    if (type === "titleForm") {
        return (
            <div className={cn(TitleBoxVariants({variant, size, className}))} {...props}>
                <Buttons href='back' variant={"icon"} size={"backButton"}>
                    <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" variant={"icon"} size={"backButton"}/>
                </Buttons>
                <Titles variant={"default"} size={"h1"}>{title}</Titles>
            </div>
        )
    }
    if (type === "row") {
        return (
            <div className={cn(TitleBoxVariants({variant, size, className}))} {...props}>
                <Buttons href='back' variant={"icon"} size={"backButton"}>
                    <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" variant={"icon"} size={"backButton"}/>
                </Buttons>
                <Titles variant={"default"} size={"h1"}>{title}</Titles>
                <Images titleImg={titleImg} titleImgAlt={titleImgAlt} variant={"icon"} size={"iconMed"}/>
            </div>
        )
    }
    
    else return (
        <div className={cn(TitleBoxVariants({variant, size, className}))} {...props}>
            
            <Buttons href='back' variant={"icon"} size={"backButton"}>
                <Images titleImg="/backArrow.svg" titleImgAlt={titleImgAlt} variant={"icon"} size={"backButton"}/>
            </Buttons>
            <Images titleImg={titleImg} titleImgAlt={titleImgAlt} variant={"icon"} size={"iconMed"}/>
            <Titles variant={"default"} size={"titlebox"}>{title}</Titles>
        </div>
    )
}

export {TitleBoxes, TitleBoxVariants}