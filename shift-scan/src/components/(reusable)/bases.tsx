import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const BaseVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-b from-app-dark-blue to-app-blue",
                modal: "fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50",
            },
            size: {
                default: "h-dvh",
                scroll: "h-full",
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