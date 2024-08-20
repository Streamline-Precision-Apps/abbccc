import { cva, type VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const InputVariants = cva(
  "items-center justify-center text-black text-lg rounded-xl", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-white border border-2 border-black disabled:bg-gray-400 mb-3 last:mb-0 w-full p-3",
        float: "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
        red: "bg-red-500",
        password:"ml-3 w-10 items-center justify-center text-black text-lg rounded-xl"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof InputVariants> {
    state?: string
    data?: any
}

const Inputs: FC<InputProps> = ({className, variant, size, state, data, ...props}) => {
  if (state === "disabled") {
      return (
          <input className={cn(InputVariants({variant, className}))} {...props} disabled value={data} />
      )
  } 
  else {
      return (
          <>
              <input className={cn(InputVariants({variant, className}))} {...props} placeholder="" />
          </>
      )
  }
}

export {Inputs, InputVariants}
