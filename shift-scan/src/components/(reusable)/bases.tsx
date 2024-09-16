import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

//this component determines the background color and overall layout of the page. not for use other than whole page.
const BaseVariants = cva(
    "bg-gradient-to-b from-app-dark-blue to-app-blue",
    {
        variants: {
            variant: {
                default: "flex content-center justify-center item", //will let data fill screen vertically
                center: "flex content-center justify-center items-center", //will push items to center of screen

                // modal: "fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50",
                // pinkCard : "bg-app-pink rounded-t-2xl py-8 px-4 absolute z-10 border-4 border-b-8 border-black",
                // blueboxTop:" bg-app-dark-blue skew-x-[-20deg] absolute top-[-10%] left-[2%] z-5 border-t-8 border-l-8 border-b-8 border-black rounded-2xl ", 
                // blueboxTop2:" bg-app-dark-blue skew-x-[20deg] absolute top-[-10%] right-[2%] z-6 border-t-8 border-r-8 border-b-8 border-black rounded-tr-2xl rounded-br-2xl", 
                // blueBox : "bg-app-dark-blue py-16 px-10 absolute border-t-8 border-b-8 border-r-8 border-l-8 border-black rounded-b-2xl top-[4%] left-[10%] left-1/2 -translate-x-1/2 rounded-t-md z-9",
            },
            size: {
                default: "h-dvh", //use if data fits on screen
                scroll: "h-full", //use if data exceeds screen size

                // scan: "h-full max-w-lg mx-auto mt-10",
                // pinkCard: "h-fit w-2/3 mx-auto",
                // blueboxTop:"w-2/3 h-[60px]",
                // blueBox : "w-full h-full",
                // box: "w-full h-[280px] ",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface BaseProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof BaseVariants> {
}

const Bases: FC<BaseProps> = ({className, variant, size, ...props}) => {
    
    return (
      <div className={cn(BaseVariants({variant, size, className}))} {...props}/>
    )
};

export {Bases, BaseVariants}