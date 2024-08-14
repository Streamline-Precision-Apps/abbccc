import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC, Children } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Buttons } from "./buttons";
import { Contents } from "./contents";
import React, { useState }from 'react';
import { Texts } from "./texts";
import { Titles } from "./titles";
import { Images } from "./images";

const ExpandVariants = cva(
" rounded-2xl", //this applies to all variants
{
variants: {
    variant: {
    default: "bg-blue-300",
    green: "bg-green-500",
    red: "bg-red-500",
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

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface ExpandProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof ExpandVariants> {
title: string
divID: string
}



const Expands: FC<ExpandProps> = ({className, variant, size, title, divID, ...props}) => {
function expandFunction() {
    const x = document.getElementById(divID);
    if (x !== null) {
        if (x.style.display === "none") {
        x.style.display = "block";
        } else {
        x.style.display = "none";
        }
    }
}
return (
    <div className={cn(ExpandVariants({variant, size, className}))} {...props}>
    <Contents variant={"row"} size={"test"}>
        <Titles>{title}</Titles>
        <Buttons onClick={expandFunction}>
            <Images titleImg="/ongoing.svg" titleImgAlt="expand"/>
        </Buttons>
    </Contents>
    <Contents variant={"hidden"} size={null} id={divID}>
        <Texts>{props.children}</Texts>
    </Contents>

    </div>
)
}

export {Expands, ExpandVariants}