import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

//this component determines the size aloted to the content of the page.
const ContentVariants = cva(
  "mx-auto", //this applies to all variants
  {
    variants: {
      position: {//only position attributes
        col: "flex flex-col",
        row: "flex flex-row items-center",
      },
      width: {//only width
        responsive: "w-[90%] sm:w-[85%] md:w-[75%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]",
        section: "w-[95%]",
      },
      height: {//only height
        none: "",
        page: "",
      },
    },
    defaultVariants: {
      position: "col",
      width: "responsive",
      height: "none",
    },
  }
)

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface ContentProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof ContentVariants> {
}

const Contents: FC<ContentProps> = ({className, position, width, height, ...props}) => {
    return (
      <div className={cn(ContentVariants({position, width, height, className}))} {...props}/>
    )
}

export {Contents, ContentVariants}