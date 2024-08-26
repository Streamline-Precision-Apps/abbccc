'use client';
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ButtonVariants = cva(
  "flex items-center border-4 border-black rounded-2xl shadow-[8px_8px_0px_grey]",
  {
    variants: {
      variant: {
        default: "bg-app-blue",
        darkBlue: "bg-app-dark-blue",
        green: "bg-app-green",
        red: "bg-app-red",
        orange: "bg-app-orange",
        icon: "bg-none border-0 shadow-none",
      },
      position: {
        left: "left-5",
      },
      size: {
        default: "h-[50px] w-[50px] flex-row mx-auto my-3 p-1",
        minBtn: "h-[50px] w-fit flex-row mx-auto my-3 p-1",
        hours: "h-[150px] w-full flex-row mx-auto p-3 col-span-2",
        listLg: "flex-row w-full h-28 mt-5 first:mt-0 overflow-hidden justify-stretch",
        widgetSm: " min-h-[150px] min-w-[180px] shadow-[8px_8px_0px_grey]",
        widgetMed: "grid col-span-2 w-full",
        widgetLg: "grid col-span-2 row-span-2 h-full w-full",
        backButton: "absolute top-2 left-2",
        thin: " flex-col mx-auto my-3 p-1 w-5/6 h-100 ",
        forgotpassword: "flex ml-auto my-3 p-3 w-40 h-100 underline",
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
  id?: string;
}

const Buttons: FC<ButtonProps> = ({className, variant, size, href, id, ...props}) => {
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



