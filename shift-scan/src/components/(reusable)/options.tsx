//This file is for creating new reusable components, copy this
//code and paste it into your new component for a starting point
//Ctrl F and find "Options" and replace it with your component name

import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const OptionsVariants = cva(
  "flex items-center justify-center rounded-full w-50 h-35", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-white border border-2 border-black disabled:bg-gray-400 mb-3 last:mb-0 w-full p-3",
        float: "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
        red: "bg-red-500",
      },
      size: {
        default: "p-10 w-100 h-100",
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
interface OptionsProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof OptionsVariants> {
value?: string
}

const Options: FC<OptionsProps> = ({className, variant, size, value, ...props}) => {
    return (
        <option className={cn(OptionsVariants({variant, size, className}))} value={value} {...props}/>
    )
}

export {Options, OptionsVariants}



