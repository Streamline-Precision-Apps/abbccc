"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC, SetStateAction, Dispatch } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Buttons } from "../(reusable)/buttons";
import { Images } from "../(reusable)/images";

import { Holds } from "./holds";
import { useRouter } from "next/navigation";

const TitleBoxVariants = cva(
  "relative flex items-center justify-center w-full h-full mx-auto relative ", //this applies to all variants
  {
    variants: {
      variant: {
        default: "flex-col",
        row: "flex-row py-7 items-end",
        red: "bg-red-500",
        orange: "bg-orange-500",
        green: "bg-app-green",
      },
      size: {
        default: "",
        sm: "p-2 w-30 h-30",
        med: "p-10 w-40 h-40",
        lg: "p-10 w-50 h-50",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface TitleBoxProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof TitleBoxVariants> {
  position?:
    | "row"
    | "center"
    | "left"
    | "right"
    | "absolute"
    | "test"
    | null
    | undefined;
  children?: React.ReactNode;
  gap?: number;
  href?: string;
}

const TitleBoxes: FC<TitleBoxProps> = ({
  className,
  variant,
  children,
  position,
  gap = 3,
  onClick = null,
  ...props
}) => {
  const router = useRouter();
  return (
    <div className={cn(TitleBoxVariants({ variant, className }))} {...props}>
      <Buttons
        onClick={onClick ? onClick : () => router.back()}
        background={"none"}
        position={"left"}
        shadow={"none"}
        className="w-12 h-12 absolute top-0 left-3 z-50"
      >
        <Images
          titleImg="/turnBack.svg"
          titleImgAlt={"Turn Back"}
          className="max-w-8 h-auto object-contain"
        />
      </Buttons>

      <Holds
        position={position}
        className={`h-full w-[90%] flex items-center justify-center gap-${gap}`}
      >
        {children}
      </Holds>
    </div>
  );
};

export { TitleBoxes, TitleBoxVariants };
