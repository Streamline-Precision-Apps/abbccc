'use client'
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import React, { useState } from "react";
import { Images } from "./images";
import { Modals } from "./modals";
import { Buttons } from "./buttons";
import { Contents } from "./contents";
import { AnimatedHamburgerButton } from "../(animations)/hamburgerMenu";
const HeaderVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      variant: {
        default: "flex-row bg-none",
        relative: "relative bg-none",
      },
      size: {
        default: "w-full h-[80px]",
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
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className={cn(HeaderVariants({variant, size, className}))} {...props}>
      <Images titleImg="/logo.svg" titleImgAlt="logo" variant={"iconLeft"} size={"logo"}/>
      <AnimatedHamburgerButton/>
    </div>
  )
}

export {Headers, HeaderVariants}
