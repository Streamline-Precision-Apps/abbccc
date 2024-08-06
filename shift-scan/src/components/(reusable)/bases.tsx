import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const BaseVariants = cva(
    "p-3 pt-10",
    {
        variants: {
            variant: {
                default: "bg-gradient-to-b from-app-dark-blue to-app-blue",
            },
            size: {
                default: "w-full h-full",
                scroll: "w-full h-screen",
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
}

export {Bases, BaseVariants}