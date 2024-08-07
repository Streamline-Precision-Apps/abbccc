import React from 'react';
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const BaseVariants = cva(
    "bg-gradient-to-b from-app-dark-blue to-app-blue",
    {
        variants: {
            variant: {
                default: "h-dvh",
                scroll: "h-screen",
            }
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

interface BaseProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof BaseVariants> {
}

const Bases: FC<BaseProps> = ({className, variant, ...props}) => {
    
    return (
      <div className={cn(BaseVariants({variant, className}))} {...props}/>
    )
};

export {Bases, BaseVariants}