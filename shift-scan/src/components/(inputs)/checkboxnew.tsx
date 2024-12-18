"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { ChangeEvent } from "react";

const CheckboxVariants = cva(
  "", //this applies to all variants
{
    variants: {
        background: {
            default: "bg-blue-500",
            },
            size: {
            default: 4,
        }
    },
    defaultVariants: {
        background: "default",
        size: "default",
    },
}
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
export interface CheckboxProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof CheckboxVariants> {
    disabled?: boolean;
    defaultChecked?: boolean;
    id: string;
    name: string;
    label?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: FC<CheckboxProps> = ({className, background, size, disabled, defaultChecked, id, name, label, onChange, ...props}) => {
    return (
    // <div className={cn(CheckboxVariants({variant, size, className}))} {...props}/>
    <div className={cn(CheckboxVariants({background, size, className}))} {...props}>
    <input
        className={``}
        type="checkbox"
        id={id}
        name={name}
        defaultChecked={defaultChecked}
        checked={defaultChecked}
        disabled={disabled}
        onChange={onChange}
      style={{ width: `${size}em`, height: `${size}em` }} // Dynamically setting size with inline styles
    />
    <svg
        className="absolute pointer-events-none hidden peer-checked:block stroke-black mt-1 outline-none animate-wave"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      style={{ width: `${size}em`, height: `${size}em` }} // Dynamically setting size for SVG
    >
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
    {label && <label htmlFor={id}>{label}</label>}
    </div>
    )
}

export {Checkbox, CheckboxVariants}



