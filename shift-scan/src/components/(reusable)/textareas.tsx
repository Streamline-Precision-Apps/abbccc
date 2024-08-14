import { cva, type VariantProps } from "class-variance-authority";
import { TextareaHTMLAttributes, FC, ChangeEventHandler } from "react";
import { cn } from "@/components/(reusable)/utils";

const TextAreaVariants = cva(
"items-center justify-center text-black text-lg rounded-xl", //this applies to all variants
{
variants: {
    variant: {
    default: "bg-white border border-2 border-black disabled:bg-gray-400 mb-3 last:mb-0 w-full p-3",
    float: "block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer",
    red: "bg-red-500",
    },
},
defaultVariants: {
    variant: "default",
},
}
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, VariantProps<typeof TextAreaVariants> {
state?: string
data?: any
onChange?: ChangeEventHandler<HTMLTextAreaElement>
}

const TextAreas: FC<TextAreaProps> = ({className, variant, state, data, ...props}) => {
if (state === "disabled") {
    return (
        <textarea className={cn(TextAreaVariants({variant, className}))} {...props} disabled value={data} />
    )
} 
else {
    return (
        <>
            <textarea className={cn(TextAreaVariants({variant, className}))} {...props} placeholder="" />
        </>
    )
}
}

export {TextAreas,TextAreaVariants}
