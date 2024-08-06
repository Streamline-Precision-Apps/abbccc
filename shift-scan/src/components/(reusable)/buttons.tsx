'use client';
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ButtonVariants = cva(
  "flex flex-col items-center justify-center border-4 border-black rounded-xl",
  {
    variants: {
      variant: {
        default: "bg-app-blue",
        darkBlue: "bg-app-dark-blue",
        green: "bg-app-green",
        red: "bg-app-red",
        orange: "bg-app-orange",
        icon: "bg-none border-0",
        listItem: "bg-yellow-500",
      },
      size: {
        default: "mx-auto my-3 p-1 w-5/6 h-100 ",
        small: "p-2 w-30 h-30",
        widgetSm: "w-full shadow-[8px_8px_0px_grey]",
        widgetMed: "p-10 w-40 h-40",
        widgetLg: "p-20 w-50 h-50",
        backButton: "absolute top-5 left-5",
        thin: " h-10 w-[520px] rounded-t-full z-10",
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



