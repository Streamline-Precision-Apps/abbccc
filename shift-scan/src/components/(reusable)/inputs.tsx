"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { InputHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import React from "react";

//this determines styles of all inputs
const InputVariants = cva(
  "items-center justify-center text-black text-lg rounded-xl", //this applies to all variants
  {
    variants: {
      variant: {
        default:
          "bg-white border border-[3px] border-black disabled:bg-gray-400 mb-3 last:mb-0 w-full p-3",
        white:
          "bg-white border border-2 border-black mb-3 last:mb-0 w-full p-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface InputProps
  extends InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof InputVariants> {
  state?: string;
  data?: string | null | undefined;
}

const Inputs: FC<InputProps> = ({
  className,
  variant,
  size,
  state,
  data,
  ...props
}) => {
  if (state === "disabled") {
    return (
      <input
        className={cn(InputVariants({ variant, className }))}
        {...props}
        disabled
        value={data}
      />
    );
  } else {
    return (
      <>
        <input
          className={cn(InputVariants({ variant, className }))}
          {...props}
        />
      </>
    );
  }
};

export { Inputs, InputVariants };
