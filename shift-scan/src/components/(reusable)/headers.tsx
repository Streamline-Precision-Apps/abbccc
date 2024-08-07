'use client'
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import React, { useState } from "react";
import { Images } from "./images";
import { Modals } from "./modals";
import { Buttons } from "./buttons";


const HeaderVariants = cva(
  "flex items-center justify-center rounded-2xl", //this applies to all variants
  {
    variants: {
      variant: {
        default: "flex-row bg-none",
        relative: "relative bg-none",
      },
      size: {
        default: "p-5 m-5 w-full h-100",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface HeaderProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof HeaderVariants> {
}

const Headers: FC<HeaderProps> = ({className, variant, size, ...props}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={cn(HeaderVariants({variant, size, className}))} {...props}>
      <Images titleImg="/logo.svg" titleImgAlt="logo" variant={"iconLeft"} size={"lg"}/>
      <Buttons variant={"icon"} size={"default"} onClick={() => setIsOpen(true)}>
          <Images titleImg="/hamburger.svg" titleImgAlt="hamburger menu" variant={"iconRight"} size={"lg"}/>
      </Buttons>
      <Modals handleClose={() => setIsOpen(false)} isOpen={isOpen}>
      <Buttons href="/hamburger/settings" variant={"icon"} size={"small"}>
          <Images titleImg={"/Settings.svg"} titleImgAlt={"settings"} variant={"icon"} size={"titlebox"} />
        </Buttons>
        <Buttons href="/hamburger/inbox" variant={"icon"} size={"small"}>
    <Images titleImg={"/Inbox.svg"} titleImgAlt={"inbox"} variant={"icon"} size={"titlebox"} />
        </Buttons>
        <Buttons href="/hamburger/profile" variant={"icon"} size={"small"}>
          <Images titleImg={"/profile.svg"} titleImgAlt={"profile"} variant={"icon"} size={"titlebox"} />
        </Buttons>
      </Modals>
    </div>
  )
}

export {Headers, HeaderVariants}



