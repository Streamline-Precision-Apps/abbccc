import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Mako } from "next/font/google";
import { Anton } from "next/font/google";

const anton = Anton({ 
  subsets: ["latin"], 
  weight: "400",
})

const mako = Mako({ 
    subsets: ["latin"], 
    weight: "400",
  })

const LabelVariants = cva(
  "text-xl", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-none",
        float: "peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6", 
        white: "text-white",
        top: "",
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
interface LabelProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof LabelVariants> {
    type?: string
}

const Labels: FC<LabelProps> = ({className, variant, size, type, ...props}) => {
    if (type === "title") {
        return (
            <div className={anton.className}>
                <label className={cn(LabelVariants({variant, size, className}))} {...props}/>
            </div>
        )
    } else return (
        <div className={mako.className}>
            <label className={cn(LabelVariants({variant, size, className}))} {...props}/>
        </div>
    )
}

export {Labels, LabelVariants}