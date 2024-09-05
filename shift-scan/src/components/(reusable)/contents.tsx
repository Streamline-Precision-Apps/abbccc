import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

const ContentVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      variant: {
        default: "flex flex-col",
        row: "flex flex-row",
        rowCenter: "flex flex-row justify-center",
        colCenter: "flex flex-col",
        rowSpaceBetween: "flex flex-row items-center w-full bg-app-dark-blue rounded-2xl relative pt-10 shadow-[8px_8px_0px_grey]",
        image: "bg-white",
        header: "w-full h-24",
        name: "w-full h-24 mt-[150px]",
        hours: "w-2/3 h-24",
        hoursDisplay: "w-full h-fit ",
        widgetButton: "w-full h-full m-1 flex flex-col justify-center items-center",
        widgetButtonRow: "m-1 flex flex-row justify-center items-center",
        hidden: "hidden flex-col",
        center: "flex flex-col justify-center items-center",
        test: " h-full flex flex-col w-full",
        white: "bg-white",
        navy: "bg-app-dark-blue",
        red: "bg-app-red",
        hoursDisplayWrapper: "flex flex-row justify-center rounded-2xl shadow-[8px_8px_0px_grey] p-4 border-4 border-black w-full h-fit bg-white mt-4",
      },
      size: {
        default: "h-fit max-w-lg mx-auto pt-10",
        notTop: "h-full max-w-lg mx-auto pt-0",
        listImage: "w-52 h-40 rounded-r-full border-black border-4 overflow-hidden -ml-3 justify-self-start",
        listTitle: "w-full justify-center",
        logo: "w-full h-36 justify-center items-center",
        devun1: "w-1/2 h-36 justify-center items-center",
        profilePic: "w-36 h-36 rounded-full border-black border-4 overflow-hidden justify-self-center",
        hoursBtn: "mx-12 h-20 rounded-2xl border-2 border-black shadow-none flex flex-grow justify-center items-center",
        nameContainer: "w-full h-fit py-5",
        test: "",
        editBtn: "absolute top-0 h-36 w-36 rounded-full",
        defaultHours: "w-[70px] h-[300px] mx-auto rounded-2xl pt-3 pb-3 px-2 flex flex-col justify-end",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface ContentProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof ContentVariants> {
}

const Contents: FC<ContentProps> = ({className, variant, size, ...props}) => {
    return (
      <div className={cn(ContentVariants({variant, size, className}))} {...props}/>
    )
}

export {Contents, ContentVariants}