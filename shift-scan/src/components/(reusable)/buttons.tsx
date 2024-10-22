"use client";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

//This determines styles of all buttons
const ButtonVariants = cva(
  "border-[3px] border-black rounded-[10px] shadow-[8px_8px_0px_grey] ", //this applies to all variants
  {
    variants: {
      background: {
        //only background attributes
        lightBlue: "bg-app-blue",
        darkBlue: "bg-app-dark-blue",
        green: "bg-app-green",
        red: "bg-app-red",
        orange: "bg-app-orange",
        white: "bg-white",
        none: "bg-none border-0 shadow-none",
      },
      position: {
        //only position attributes
        center: "self-center",
        left: "self-start",
        right: "self-end",
      },
      size: {
        //only width and height
        full: "w-[100%] h-[100%]",
        "90": "w-[90%]",
        "80": "w-[80%]",
        "70": "w-[70%]",
        "60": "w-[60%]",
        "50": "w-[50%]",
        "40": "w-[40%]",
        "30": "w-[30%]",
        "20": "w-[20%]",
        "10": "w-[10%]",
      },
    },
    defaultVariants: {
      background: "lightBlue",
      position: "center",
      size: "full",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  href?: string;
}

const Buttons: FC<ButtonProps> = ({
  className,
  background,
  position,
  size,
  href,
  ...props
}) => {
  const router = useRouter();
  const pageAction = () => {
    if (href) {
      if (href === "back") {
        router.back();
      } else router.push(href);
    }
  };
  return (
    <button
      onClick={() => {
        pageAction();
      }}
      className={cn(ButtonVariants({ background, size, position, className }))}
      {...props}
    />
  );
};

export { Buttons, ButtonVariants };
