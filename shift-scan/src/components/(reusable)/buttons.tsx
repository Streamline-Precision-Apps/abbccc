'use client';
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ButtonVariants = cva(
  "flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-blue-500 rounded-xl",
        green: "bg-green-500 rounded-xl",
        red: "bg-red-500 rounded-xl",
        orange: "bg-orange-500 rounded-xl",
        icon: "bg-none",
        widgetSm: "bg-blue-500",
        widgetMed: "bg-green-500",
        widgetLg: "bg-orange-500",
        listItem: "bg-yellow-500",
      },
      size: {
        default: "mx-auto my-3 p-1 w-5/6 h-100 ",
        small: "p-2 w-30 h-30",
        widgetSm: "p-5 w-30 h-30",
        widgetMed: "p-10 w-40 h-40",
        widgetLg: "p-20 w-50 h-50",
        backButton: "absolute top-5 left-5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
  href?: string;
}

const Buttons: FC<ButtonProps> = ({className, variant, size, href, ...props}) => {
    const router = useRouter();
    const pageAction = () => {
        if (href) {
          if (href === "back") {
            router.back();
          }
          else router.push(href);
        }
    };
    return (
      <button onClick={() => {pageAction()}} className={cn(ButtonVariants({variant, size, className}))} {...props}/>
    )
}

export {Buttons, ButtonVariants}



