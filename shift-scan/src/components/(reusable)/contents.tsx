import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";

//this component determines the size aloted to the content of the page.
const ContentVariants = cva(
  "mx-auto", //this applies to all variants
  {
    variants: {
      position: {
        //only position attributes
        col: "flex flex-col",
        row: "flex flex-row items-center",
      },
      width: {
        //only width
        responsive:
          "w-[90%] sm:w-[85%] md:w-[85%] lg:w-[75%] xl:w-[60%] 2xl:w-[40%]", //before 95%
        section: "w-[90%]",
        "95": "w-[95%]",
        "60": "w-[50%]",
        "100": "w-[100%]",
      },
      height: {
        //only height
        none: "",
        page: "h-full",
      },
    },
    defaultVariants: {
      position: "col",
      width: "responsive",
      height: "page",
    },
  }
);

// this extends the capability of HTMLAttributes or the VariantProps that it can hold, specify your props here
interface ContentProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof ContentVariants> {}

const Contents: FC<ContentProps> = ({
  className,
  position,
  width,
  height,
  ...props
}) => {
  return (
    <div
      className={cn(ContentVariants({ position, width, height, className }))}
      {...props}
    />
  );
};

export { Contents, ContentVariants };
