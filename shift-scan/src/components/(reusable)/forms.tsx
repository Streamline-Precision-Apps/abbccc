import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const FormVariants = cva(
  "flex items-center justify-center rounded-full w-50 h-35", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-blue-500",
        green: "bg-green-500",
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

interface FormProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof FormVariants> {
}

const Forms: FC<FormProps> = ({className, variant, size, ...props}) => {
    return (
      <button className={cn(FormVariants({variant, size, className}))} {...props}/>
    )
}

export {Forms, FormVariants}



