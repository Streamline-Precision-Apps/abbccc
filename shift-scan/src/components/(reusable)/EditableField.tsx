"use client";
import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface EditableFieldsProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof EditableFieldsVariants> {
  value: string;
  type?: string;
  checked?: boolean;
  disable?: boolean;
  placeholder?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isChanged: boolean;
  onRevert?: () => void;
  iconSrc?: string;
  iconAlt?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  name?: string;
  readonly?: boolean;
  formDatatype?: "input" | "select";
  options?: { label: string; value: string }[]; // Added options prop for select type
}

const EditableFieldsVariants = cva(
  "flex items-center rounded-[10px] overflow-hidden", // Added overflow-hidden
  {
    variants: {
      variant: {
        default: "border-black  border-[3px]",
        danger: "border-red-500  border-[3px]",
        success: "border-green-500  border-[3px]",
        edited: "border-app-orange  border-[3px]",
        noFrames: "border-none rounded-none",
      },
      size: {
        default: "h-10 text-base",
        sm: "h-8 text-sm",
        lg: "h-12 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const EditableFields: FC<EditableFieldsProps> = ({
  className = "",
  variant,
  size,
  value,
  checked,
  disable = false,
  type = "text",
  onChange,
  isChanged,
  placeholder,
  onRevert,
  minLength,
  maxLength,
  pattern,
  iconSrc = "/arrowBack.svg",
  iconAlt = "revert",
  name,
  readonly = false, // Added readonly prop
  formDatatype = "input", // Added formDatatype prop
  options = [], // Added options prop for select type
}) => {
  if (formDatatype === "input") {
    return (
      <div
        className={cn(
          EditableFieldsVariants({ variant, size, className }),
          "w-full"
        )}
      >
        {/* Input container with flex-1 to take available space */}
        <div className="flex-1 h-full">
          <input
            type={type}
            value={value}
            name={name}
            disabled={disable}
            checked={checked}
            onChange={onChange}
            placeholder={placeholder || ""}
            className="h-full w-full border-none focus:outline-none px-3 bg-transparent disabled:bg-app-gray"
            minLength={minLength}
            maxLength={maxLength}
            pattern={pattern}
            readOnly={readonly}
          />
        </div>

        {/* Revert button - only appears when needed */}
        {isChanged && onRevert && (
          <button
            type="button"
            className="w-10 h-full flex-shrink-0 flex items-center justify-center   transition-colors"
            title="Revert changes"
            onClick={onRevert}
          >
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src={iconSrc} alt={iconAlt} className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
  if (formDatatype === "select") {
    return (
      <div
        className={cn(
          EditableFieldsVariants({ variant, size, className }),
          "w-full"
        )}
      >
        {/* Select container with flex-1 to take available space */}
        <div className="flex-1 h-full">
          <select
            value={value}
            name={name}
            disabled={disable}
            onChange={onChange}
            className="h-full w-full border-none focus:outline-none px-3 bg-transparent disabled:bg-app-gray"
          >
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Revert button - only appears when needed */}
        {isChanged && onRevert && (
          <button
            type="button"
            className="w-10 h-full flex-shrink-0 flex items-center justify-center   transition-colors"
            title="Revert changes"
            onClick={onRevert}
          >
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src={iconSrc} alt={iconAlt} className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
};

export { EditableFields, EditableFieldsVariants };
