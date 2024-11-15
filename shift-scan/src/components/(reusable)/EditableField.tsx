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
  isChanged: boolean;
  onRevert?: () => void;
  iconSrc?: string;
  iconAlt?: string;
}

const EditableFields: FC<EditableFieldsProps> = ({
  className,
  variant,
  size,
  isChanged,
  onRevert,
  iconSrc = "/turnBack.svg",
  iconAlt = "revert",
  ...props
}) => {
  return (
    <div className={cn(EditableFieldsVariants({ variant, size, className }))}>
      <input
        className="h-full w-5/6 border-none focus:outline-none my-auto"
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
