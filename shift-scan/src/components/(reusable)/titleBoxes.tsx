import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Buttons } from "../(reusable)/buttons";
import { Titles } from "../(reusable)/titles";
import { Images } from "../(reusable)/images";
import { Contents } from "./contents";
import { Holds } from "./holds";
import { Button } from "@nextui-org/react";

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
  titleImg: string;
  titleImgAlt: string;
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
  titleImg,
  titleImgAlt,
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
        <Holds
          size={"full"}
          position={"center"}
          onClick={() => modalTitle(modal)}
        >
          <Holds size={"50"} className="rounded-full relative">
            <Images
              titleImg={titleImg}
              titleImgAlt={titleImgAlt}
              className="rounded-full border-[3px] border-black"
              size={"full"}
            />
            <Holds>
              <Holds
                position={"absolute"}
                size={"40"}
                className="absolute  border-[3px] border-black rounded-full h-[40%] top-[60%] left-[65%] my-auto "
                background={"lightBlue"}
              >
                <Holds className="h-full ">
                  <Images
                    titleImg="/camera.svg"
                    titleImgAlt="camera"
                    size={"50"}
                    className="my-auto"
                  />
                </Holds>
              </Holds>
            </Holds>
          </Holds>
        </Holds>
        <Titles>{title}</Titles>
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
  } else
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
        <Images titleImg={titleImg} titleImgAlt={titleImgAlt} size={"20"} />
        <Titles size={"h1"}>{title}</Titles>
      </div>
    );
};

export { TitleBoxes, TitleBoxVariants };
