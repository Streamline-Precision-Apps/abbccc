//This file is for creating new reusable components, copy this
//code and paste it into your new component for a starting point
//Ctrl F and find "EditableFields" and replace it with your component name

import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { read } from "fs";

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface EditableFieldsProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof EditableFieldsVariants> {
  value: string;
  type?: string;
  checked?: boolean;
  disable?: boolean;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isChanged: boolean;
  onRevert?: () => void;
  iconSrc?: string;
  iconAlt?: string;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  name?: string;
  readonly?: boolean;
}

const EditableFieldsVariants = cva(
  "flex items-center border-[3px] rounded-[10px] overflow-hidden", // Added overflow-hidden
  {
    variants: {
      variant: {
        default: "border-black",
        danger: "border-red-500",
        success: "border-green-500",
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
}) => {
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
};

export { EditableFields, EditableFieldsVariants };
