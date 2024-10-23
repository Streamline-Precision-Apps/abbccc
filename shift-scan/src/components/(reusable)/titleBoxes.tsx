"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC, SetStateAction, Dispatch } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Buttons } from "../(reusable)/buttons";
import { Titles } from "../(reusable)/titles";
import { Images } from "../(reusable)/images";

import { Holds } from "./holds";

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
  modalTitle?: Dispatch<SetStateAction<boolean>> | undefined;
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
  href = "back",
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
        <Grids cols={"4"} rows={"3"} className="w-full">
          <Holds className="col-span-1 row-span-1">
            <Buttons
              href={href}
              background={"none"}
              position={"left"}
              size={"50"}
            >
              <Images titleImg="/turnBack.svg" titleImgAlt={titleImgAlt} />
            </Buttons>
          </Holds>
          {props.children}
          <Holds className="col-span-2 row-span-2 cursor-pointer">
            <Holds
              size={"60"}
              className="rounded-full relative "
              onClick={() => {
                if (modalTitle) {
                  modalTitle(modal ? true : false);
                }
              }}
            >
              <Images
                titleImg={titleImg}
                titleImgAlt={titleImgAlt}
                className="rounded-full border-[3px] border-black"
                size={"full"}
              />
              <Holds className="absolute rounded-full h-7 w-7 md:h-10 md:w-10 left-[75%] top-[85%] transform -translate-x-1/2 -translate-y-1/2  px-1  md:px-2 md:py-3 border-[3px] border-black bg-white">
                <Images
                  titleImg="/camera.svg"
                  titleImgAlt="camera"
                  size={"full"}
                  className="my-auto"
                />
              </Holds>
            </Holds>
          </Holds>
          <Holds className="col-span-4 row-span-1">
            <Titles size={"h2"}>{title}</Titles>
          </Holds>
          <Holds
            size={"30"}
            position={"absolute"}
            className="left-[70%] top-[5%] "
          >
            <Holds className="col-span-4 row-span-1">
              <Titles position={"right"} size={"h6"}>
                {title2}
              </Titles>
            </Holds>
          </Holds>
        </Grids>
      </div>
    );
  }
  if (type === "myTeamProfile") {
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Grids cols={"4"} rows={"3"} className="w-full">
          <Holds className="col-span-1 row-span-1">
            <Buttons
              href={href}
              background={"none"}
              position={"left"}
              size={"50"}
            >
              <Images titleImg="/turnBack.svg" titleImgAlt={titleImgAlt} />
            </Buttons>
          </Holds>
          <Holds className="col-span-2 row-span-2 ">
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
          </Holds>

          <Holds className="col-span-4 row-span-1">
            <Titles size={"h1"}>{title}</Titles>
          </Holds>
          <Holds className="col-start-4 col-span-1 row-start-1 row-span-1">
            <Holds size={"90"} position={"center"}>
              <Titles position={"right"} size={"h6"}>
                {title2}
              </Titles>
            </Holds>
          </Holds>
        </Grids>
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
          <Buttons href={href} background={"none"} size={"30"}>
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
        <Buttons href={href}>
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
        <Buttons href={href}>
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
          <Buttons href={href} background={"none"} size={"30"}>
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
  } else
    return (
      <div
        className={cn(TitleBoxVariants({ variant, size, className }))}
        {...props}
      >
        <Grids cols={"4"} rows={"3"} className="w-full">
          <Holds className="col-span-1 row-span-1">
            <Buttons
              href={href}
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
            <Titles size={"h3"}>{title}</Titles>
          </Holds>
        </Grids>
      </div>
    );
};

export { TitleBoxes, TitleBoxVariants };
