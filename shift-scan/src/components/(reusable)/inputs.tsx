import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const InputVariants = cva(
  "items-center justify-center text-black text-lg rounded-xl", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-white border border-2 border-black disabled:bg-gray-400",
        float: "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
        red: "bg-red-500",
      },
      size: {
        default: "  block w-full p-3 focus:ring-blue-500 focus:border-blue-500",
        sm: "focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
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
interface InputProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof InputVariants> {
    type?: string
    state?: string
}

const Inputs: FC<InputProps> = ({className, variant, size, type, state, ...props}) => {
    if (type === "disabled") {
        return (
            <input className={cn(InputVariants({variant, size, className}))} {...props} disabled/>
        )
    }
    if (type === "float") {
        return (
            <input className={cn(InputVariants({variant, size, className}))} {...props} type="text" name="floating_email" id="floating_email" placeholder="" required/>
        )
    }
    return (
      <input className={cn(InputVariants({variant, size, className}))} {...props} placeholder=""/>
    )
}

export {Inputs, InputVariants}
