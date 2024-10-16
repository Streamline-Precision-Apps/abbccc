import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

//this component determines the background color and overall layout of the page. not for use other than whole page.
const BaseVariants = cva(
    "",
    {
        variants: {
            background: {//only background attributes
                default: "bg-gradient-to-b from-app-dark-blue to-app-blue",
                modal: "bg-neutral-800 opacity-50", //will create the gray background for modals
            },
            position: {//only position attributes
                center: "",
                start: "fixed top-0 left-0",//use for modals
            },
            size: {//only width and height
                default: "pb-3 pt-7 h-dvh", //use if data fits on screen
                scroll: "pb-3 pt-7 h-full no-scrollbar overflow-y-auto", //use if data exceeds screen size
                screen: "h-screen w-screen", //use for modals
            }
        },
        defaultVariants: {
            background: "default",
            position: "center",
            size: "default",
        },
    }
)

interface BaseProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof BaseVariants> {
}

const Bases: FC<BaseProps> = ({className, background, position, size, ...props}) => {
    
    return (
      <div className={cn(BaseVariants({background, position, size, className}))} {...props}/>
    )
};

export {Bases, BaseVariants}