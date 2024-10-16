import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Buttons } from "../(reusable)/buttons";
import { Titles } from "../(reusable)/titles";
import { Images } from "../(reusable)/images";
import { Contents } from "./contents";
import { Holds } from "./holds";
import { Button } from "@nextui-org/react";
import { Grids } from "./grids";

const TitleBoxVariants = cva(
  "relative flex items-center justify-center w-full mx-auto", //this applies to all variants
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
  type?: string;
  title: string;
  title2?: string;
  titleImg: string;
  titleImgAlt: string;
  href?: string;
  src?: string;
  modal?: boolean;
  modalTitle?: any;
}

const TitleBoxes: FC<TitleBoxProps> = ({
  className,
  variant,
  size,
  type,
  title,
  title2,
  titleImg,
  titleImgAlt,
  href,
  modal,
  modalTitle,
  ...props
}) => {
  if (type === "profilePic") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Holds position={"absolute"}>
          <Buttons href="back" background={"none"} size={"30"}>
            <Images
              titleImg="/turnBack.svg"
              titleImgAlt={titleImgAlt}
              size={"30"}
            />
          </Buttons>
        </Holds>
        {props.children}
        <Holds size={"full"} position={"center"} className=" cursor-pointer ">
          <Holds
            size={"40"}
            className="rounded-full relative "
            onClick={() => modalTitle(modal)}
          >
            <Images
              titleImg={titleImg}
              titleImgAlt={titleImgAlt}
              className="rounded-full border-[3px] border-black"
              size={"full"}
            />
            <Holds className="absolute rounded-full h-5 w-5 md:h-10 md:w-10 left-[75%] top-[80%] transform -translate-x-1/2 -translate-y-1/2  px-1  md:px-2 md:py-3 border-[3px] border-black bg-white">
              <Images
                titleImg="/camera.svg"
                titleImgAlt="camera"
                size={"full"}
                className="my-auto"
              />
            </Holds>
          </Holds>
        </Holds>
        <Titles size={"h3"}>{title}</Titles>
        <Holds
          size={"30"}
          position={"absolute"}
          className="left-[70%] top-[5%] "
        >
          <Holds size={"90"} position={"center"}>
            <Titles position={"right"} size={"h6"}>
              {title2}
            </Titles>
          </Holds>
        </Holds>
      </div>
    );
  }
  if (type === "profilePics") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Holds position={"absolute"}>
          <Buttons href="back" background={"none"} size={"30"}>
            <Images
              titleImg="/turnBack.svg"
              titleImgAlt={titleImgAlt}
              size={"30"}
            />
          </Buttons>
        </Holds>
        {props.children}
        <Holds size={"full"} position={"center"}>
          <Holds size={"40"} className="rounded-full relative ">
            <Images
              titleImg={titleImg}
              titleImgAlt={titleImgAlt}
              className="rounded-full border-[3px] border-black"
              size={"full"}
            />
          </Holds>
        </Holds>
        <Titles size={"h3"}>{title}</Titles>
        <Holds
          size={"30"}
          position={"absolute"}
          className="left-[70%] top-[5%] "
        >
          <Holds size={"90"} position={"center"}>
            <Titles position={"right"} size={"h6"}>
              {title2}
            </Titles>
          </Holds>
        </Holds>
      </div>
    );
  }

  if (type === "titleOnly") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Titles size={"h1"}>{title}</Titles>
        {props.children}
      </div>
    );
  }
  if (type === "noIcon") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Holds position={"absolute"}>
          <Buttons href="back" background={"none"} size={"30"}>
            <Images
              titleImg="/turnBack.svg"
              titleImgAlt={titleImgAlt}
              size={"30"}
            />
          </Buttons>
        </Holds>
        <Titles size={"h2"}>{title}</Titles>
      </div>
    );
  }
  if (type === "withDate") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Buttons href="back">
          <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" />
        </Buttons>
        <Titles size={"h1"}>{title}</Titles>
      </div>
    );
  }
  if (type === "titleForm") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Buttons href="back">
          <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" />
        </Buttons>
        <Titles size={"h1"}>{title}</Titles>
      </div>
    );
  }
  if (type === "row") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Holds position={"absolute"}>
          <Buttons href="back" background={"none"} size={"30"}>
            <Images
              titleImg="/turnBack.svg"
              titleImgAlt="back arrow"
              size={"30"}
            />
          </Buttons>
        </Holds>
        <Holds position={"row"}>
          <Holds size={"60"}>
            <Titles size={"h1"} position={"right"} className="px-5">
              {title}
            </Titles>
          </Holds>
          <Holds size={"40"}>
            <Images
              titleImg={titleImg}
              titleImgAlt={titleImgAlt}
              position={"left"}
              size={"30"}
            />
          </Holds>
        </Holds>
      </div>
    );
  }
  if (type === "route") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Holds position={"absolute"}>
          <Buttons href={href} background={"none"} size={"30"}>
            <Images
              titleImg="/turnBack.svg"
              titleImgAlt={titleImgAlt}
              size={"30"}
            />
          </Buttons>
        </Holds>
        <Holds>
          <Holds size={"50"} className="my-auto">
            <Images titleImg={titleImg} titleImgAlt={titleImgAlt} size={"30"} />
          </Holds>
          <Titles size={"h2"}>{title}</Titles>
        </Holds>
      </div>
    );
  } else
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Grids cols={"4"} rows={"3"} className="w-full">
          <Holds className="col-span-1 row-span-1">
            <Buttons
              href="back"
              background={"none"}
              position={"left"}
              size={"50"}
            >
              <Images titleImg="/turnBack.svg" titleImgAlt={titleImgAlt} />
            </Buttons>
          </Holds>
          <Holds className="col-span-2 row-span-2 ">
            <Images titleImg={titleImg} titleImgAlt={titleImgAlt} size={"40"} />
          </Holds>
          <Holds className="col-span-4 row-span-1">
            <Titles size={"h1"}>{title}</Titles>
          </Holds>
        </Grids>
      </div>
    );
};

export { TitleBoxes, TitleBoxVariants };
