'use client';
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ButtonVariants = cva(
  "border-4 border-black rounded-2xl shadow-[8px_8px_0px_grey]",
  {
    variants: {
      variant: {
        lightBlue: "bg-app-blue",
        darkBlue: "bg-app-dark-blue",
        green: "bg-app-green",
        red: "bg-app-red",
        orange: "bg-app-orange",
        white: "bg-white",
        icon: "bg-none border-0 shadow-none",
        link: "bg-none border-0 shadow-none underline"
      },
      position: {
        center: "self-center",
        left: "self-start",
        right: "self-end",
      },
      size: {
        half: "w-[50%] p-2 justify-center align-middle",
        fill: "self-stretch p-2 justify-center align-middle",

        // minBtn: "h-[50px] w-fit flex-row mx-auto my-3 p-1",
        // maxBtn: "h-fit w-full flex-col my-3 p-1",
        // hours: "h-[150px] w-full flex-row items-center col-span-2 justify-space-between p-1",
        // listLg: "flex-row w-full h-28 mt-5 first:mt-0 overflow-hidden justify-stretch",
        // widgetSm: " min-h-[150px] min-w-[170px] shadow-[8px_8px_0px_grey]",
        // widgetMed: "grid col-span-2 w-full",
        // dateBtn: "w-full h-full px-5 py-3 shadow-none ",
        // widgetLg: "grid col-span-2 row-span-2 h-full w-full",
        // backButton: "absolute top-2 left-2 ",
        // editButton: "absolute top-[80%] left-[89%] ",
        // exit: " mx-auto mt-5 mb-5 p-2",
        // returnBtn :"w-12 h-12 p-2 absolute top-[-22%] left-[50%] -translate-x-[50%] shadow-[15px 15px 0px 0px #7B7B7B]  ",
        // arrow : "w-[70px] h-[70px] p-2 mx-3",
        // icon:"w-full absolute top-0 left-0",
        //tapToSign: "w-full h-[200px] justify-center mt-5 ",
      }
    },
    defaultVariants: {
      variant: "lightBlue",
      size: "half",
      position: "center",
    },
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof ButtonVariants> {
  href?: string;
  id?: string;
}

const Buttons: FC<ButtonProps> = ({className, variant, position, size, href, id, ...props}) => {
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
      <button onClick={() => {pageAction()}} className={cn(ButtonVariants({variant, size, position, className}))} {...props}/>
    )
}

export {Buttons, ButtonVariants}



