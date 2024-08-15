import { cva, type VariantProps } from "class-variance-authority";
import { SelectHTMLAttributes, FC, ChangeEventHandler } from "react";
import { cn } from "@/components/(reusable)/utils";

const SelectsVariants = cva(
"items-center justify-center text-black text-lg rounded-xl",
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
interface SelectsProps extends SelectHTMLAttributes<HTMLSelectElement>, VariantProps<typeof SelectsVariants> {
    onChange?: ChangeEventHandler<HTMLSelectElement>;
    data?: any;
}

const Selects: FC<SelectsProps> = ({className, variant, onChange, data, ...props}) => {
if (data) {
    return (
        <select className={cn(SelectsVariants({variant, className}))} onChange={onChange} {...props}>
            {data.map((item: any) => (
                <option key={item} value={item}>{item}</option>
            ))}
        </select>
    )
}
return (
    <select className={cn(SelectsVariants({variant, className}))} onChange={onChange} {...props}>
        {props.children}
    </select>
)
}

export {Selects, SelectsVariants}



