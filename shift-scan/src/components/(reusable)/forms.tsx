'use client'
import { cva, type VariantProps } from "class-variance-authority";
import { FormHTMLAttributes, FC, useRef } from "react";
import { cn } from "@/components/(reusable)/utils";

const FormVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      variant: {
        default: "",
      },
      size: {
        default: "w-full pb-2 px-2",
        fit: "w-full h-fit pb-2 px-2",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface FormProps extends FormHTMLAttributes<HTMLFormElement>, VariantProps<typeof FormVariants> {
  state?: string
  ref?: React.RefObject<HTMLFormElement>
}

const Forms: FC<FormProps> = ({className, variant, size, state, ...props}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const handleFormChange = () => {
      formRef.current?.requestSubmit();
    };
    return (
      <form ref={formRef} className={cn(FormVariants({variant, size, className}))} {...props}/>
    )
}

export {Forms, FormVariants}



