//This file is for creating new reusable components, copy this
//code and paste it into your new component for a starting point
//Ctrl F and find "EditableFields" and replace it with your component name

import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const EditableFieldsVariants = cva(
  "flex items-center gap-2 border-[3px] rounded-[10px]", // common styles
  {
    variants: {
      variant: {
        default: "border-black",
        danger: "border-red-500",
        success: "border-green-500",
        noFrames: "border-none rounded-none",
      },
      size: {
        default: "h-10",
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
}

const EditableFields: FC<EditableFieldsProps> = ({
  className = "px-2",
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
  iconSrc = "/turnBack.svg",
  iconAlt = "revert",

  ...props
}) => {
  return (
    <div className={cn(EditableFieldsVariants({ variant, size, className }))}>
      <input
        type={type}
        value={value}
        disabled={disable}
        checked={checked}
        onChange={onChange}
        placeholder={placeholder || ""}
        className="h-full w-5/6 border-none focus:outline-none my-auto text-center"
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        {...props}
      />
      {isChanged && onRevert && (
        <button
          type="button"
          className="w-1/6"
          title="Revert changes"
          onClick={onRevert}
        >
          <div className="flex justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element*/}
            <img src={iconSrc} alt={iconAlt} className="w-5 h-5" />
          </div>
        </button>
      )}
    </div>
  );
};

export { EditableFields, EditableFieldsVariants };
