"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC, SetStateAction, Dispatch } from "react";
import { cn } from "@/components/(reusable)/utils";
import { Buttons } from "../(reusable)/buttons";
import { Images } from "../(reusable)/images";

import { Holds } from "./holds";

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
  position?:
    | "row"
    | "center"
    | "left"
    | "right"
    | "absolute"
    | "test"
    | null
    | undefined;
  children?: React.ReactNode;
  gap?: number;
}

const TitleBoxes: FC<TitleBoxProps> = ({
  className,
  variant,
  children,
  position,
  gap = 3,
  onClick = () => {},
  ...props
}) => {
  return (
    <div className={cn(TitleBoxVariants({ variant, className }))} {...props}>
      <Holds className="h-fit mx-auto w-[90%] flex items-center justify-center">
        <Buttons
          onClick={onClick}
          background={"none"}
          position={"left"}
          shadow={"none"}
          className="w-12 h-12"
        >
          <Images
            titleImg="/turnBack.svg"
            titleImgAlt={"Turn Back"}
            className="max-w-8 h-auto object-contain"
          />
        </Buttons>
      </Holds>
      <Holds
        position={position}
        className={`h-fit w-full flex items-center justify-center gap-${gap}`}
      >
        {children}
      </Holds>
    </div>
  );

  // if (type === "profilePic") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Grids cols={"4"} rows={"3"} className="w-full">
  //         <Holds className="col-span-1 row-span-1">
  //           <Buttons
  //             href={href}
  //             background={"none"}
  //             position={"left"}
  //             size={"50"}
  //             shadow={"none"}
  //           >
  //             <Images titleImg="/turnBack.svg" titleImgAlt={titleImgAlt} />
  //           </Buttons>
  //         </Holds>

  //         <Holds className="col-span-2 row-span-2 cursor-pointer">
  //           <Holds
  //             size={"60"}
  //             className="rounded-full relative "
  //             onClick={() => {
  //               if (modalTitle) {
  //                 modalTitle(modal ? true : false);
  //               }
  //             }}
  //           >
  //             <Images
  //               titleImg={titleImg}
  //               titleImgAlt={titleImgAlt}
  //               className="rounded-full border-[3px] border-black"
  //               size={"full"}
  //             />
  //             <Holds className="absolute rounded-full h-7 w-7 md:h-10 md:w-10 left-[75%] top-[85%] transform -translate-x-1/2 -translate-y-1/2  px-1  md:px-2 md:py-3 border-[3px] border-black bg-white">
  //               <Images
  //                 titleImg="/camera.svg"
  //                 titleImgAlt="camera"
  //                 size={"full"}
  //                 className="my-auto"
  //               />
  //             </Holds>
  //           </Holds>
  //         </Holds>
  //         <Holds className="col-span-4 row-span-1">
  //           <Titles size={"h2"}>{title}</Titles>
  //         </Holds>
  //         <Holds
  //           size={"30"}
  //           position={"absolute"}
  //           className="left-[70%] top-[5%] "
  //         >
  //           <Holds className="col-span-4 row-span-1">
  //             <Titles position={"right"} size={"h6"}>
  //               {title2}
  //             </Titles>
  //           </Holds>
  //         </Holds>
  //       </Grids>
  //     </div>
  //   );
  // }
  // if (type === "myTeamProfile") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Grids cols={"6"} rows={"2"} className="w-full h-full">
  //         <Holds className="col-start-1 col-end-2 row-span-1">
  //           <Buttons
  //             href={href}
  //             background={"none"}
  //             position={"left"}
  //             shadow={"none"}
  //           >
  //             <Images titleImg="/turnBack.svg" titleImgAlt={titleImgAlt} />
  //           </Buttons>
  //         </Holds>
  //         <Holds className="col-start-3 col-end-5 row-start-1 row-end-2 ">
  //           <Holds size={"full"} position={"center"}>
  //             <Holds className="rounded-full relative ">
  //               <Images
  //                 titleImg={titleImg}
  //                 titleImgAlt={titleImgAlt}
  //                 className="rounded-full border-[3px] border-black"
  //                 size={"50"}
  //               />
  //             </Holds>
  //           </Holds>
  //         </Holds>

  //         <Holds className="col-start-1 col-end-7 row-start-2 row-end-3">
  //           <Titles size={"h2"}>{title}</Titles>
  //         </Holds>
  //         <Holds className="col-start-4 col-end-7 row-start-1 row-end-2">
  //           <Holds size={"90"} position={"center"}>
  //             <Titles position={"right"} size={"h6"}>
  //               {title2}
  //             </Titles>
  //           </Holds>
  //         </Holds>
  //       </Grids>
  //     </div>
  //   );
  // }

  // if (type === "titleOnly") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Titles size={"h1"}>{title}</Titles>
  //     </div>
  //   );
  // }

  // if (type === "titleAndSubtitleAndHeader") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Grids cols={"4"} rows={"3"} gap={"2"}>
  //         {/* Back Button */}
  //         <Holds className="col-span-1 row-span-3 flex items-center">
  //           <Buttons
  //             href={href}
  //             background={"none"}
  //             position={"left"}
  //             size={"50"}
  //             shadow={"none"}
  //           >
  //             <Images titleImg="/turnBack.svg" titleImgAlt={titleImgAlt} />
  //           </Buttons>
  //         </Holds>

  //         {/* Main Title and Subtitle */}
  //         <Holds className="col-span-2 row-span-3 flex flex-col justify-center">
  //           <Titles size={"h1"}>{title}</Titles>
  //           <Titles size={"h4"}>{subtitle}</Titles>
  //         </Holds>

  //         {/* Header (Top Right) */}
  //         <Holds className="col-span-1 row-span-1 flex justify-end items-end">
  //           <Titles size={"h4"}>{header}</Titles>
  //         </Holds>
  //       </Grids>
  //     </div>
  //   );
  // }
  // if (type === "noIcon") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Holds position={"absolute"}>
  //         <Buttons href={href} background={"none"} size={"30"} shadow={"none"}>
  //           <Images
  //             titleImg="/turnBack.svg"
  //             titleImgAlt={titleImgAlt}
  //             size={"30"}
  //           />
  //         </Buttons>
  //       </Holds>
  //       <Titles size={"h2"}>{title}</Titles>
  //     </div>
  //   );
  // }
  // if (type === "withDate") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Buttons href={href}>
  //         <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" />
  //       </Buttons>
  //       <Titles size={"h1"}>{title}</Titles>
  //     </div>
  //   );
  // }
  // if (type === "titleForm") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Buttons href={href}>
  //         <Images titleImg="/backArrow.svg" titleImgAlt="back arrow" />
  //       </Buttons>
  //       <Titles size={"h1"}>{title}</Titles>
  //     </div>
  //   );
  // }

  // if (type === "noIcon") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Grids cols={"3"} rows={"2"} className="w-full h-full p-3">
  //         <Holds className="col-span-1 row-span-1 flex items-center justify-center">
  //           <Buttons
  //             href={href}
  //             background={"none"}
  //             position={"left"}
  //             size={"50"}
  //             shadow={"none"}
  //           >
  //             <Images
  //               titleImg="/turnBack.svg"
  //               titleImgAlt={titleImgAlt}
  //               className="max-w-8 h-auto object-contain"
  //             />
  //           </Buttons>
  //         </Holds>

  //         <Holds className="col-start-1 col-end-5 row-start-2 row-end-3 flex items-center justify-center">
  //           <Titles size={"h1"}>{title}</Titles>
  //         </Holds>
  //       </Grids>
  //     </div>
  //   );
  // }
  // if (type === "noIcon-NoHref") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Grids cols={"3"} rows={"2"} className="w-full h-full p-3">
  //         <Holds className="col-span-1 row-span-1 flex items-center justify-center">
  //           <Buttons
  //             onClick={onClick}
  //             background={"none"}
  //             position={"left"}
  //             size={"50"}
  //             shadow={"none"}
  //           >
  //             <Images
  //               titleImg="/turnBack.svg"
  //               titleImgAlt={titleImgAlt}
  //               className="max-w-8 h-auto object-contain"
  //             />
  //           </Buttons>
  //         </Holds>

  //         <Holds className="col-start-1 col-end-5 row-start-2 row-end-3 flex items-center justify-center">
  //           <Titles size={"h2"}>{title}</Titles>
  //         </Holds>
  //       </Grids>
  //     </div>
  //   );
  // }
  // if (type === "row") {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Grids cols={"4"} rows={"1"} className="w-full h-full p-3 ">
  //         <Buttons
  //           href={href}
  //           background={"none"}
  //           position={"left"}
  //           shadow={"none"}
  //           className="justify-center col-start-1 col-end-2 row-start-1 row-end-2"
  //         >
  //           <Images
  //             titleImg="/turnBack.svg"
  //             titleImgAlt={titleImgAlt}
  //             className="max-w-8 h-auto object-contain"
  //           />
  //         </Buttons>

  //         <Holds className="col-start-2 col-end-4 row-start-1 row-end-2 flex items-center justify-center">
  //           <Titles size={"h3"}>{title}</Titles>
  //         </Holds>
  //       </Grids>
  //     </div>
  //   );
  // } else {
  //   return (
  //     <div
  //       className={cn(TitleBoxVariants({ variant, size, className }))}
  //       {...props}
  //     >
  //       <Grids cols={"4"} rows={"3"} className="w-full h-full p-3">
  //         <Holds className="col-span-1 row-span-1 flex items-center justify-center">
  //           <Buttons
  //             href={href}
  //             background={"none"}
  //             position={"left"}
  //             size={"50"}
  //             shadow={"none"}
  //           >
  //             <Images
  //               titleImg="/turnBack.svg"
  //               titleImgAlt={titleImgAlt}
  //               className="max-w-8 h-auto object-contain"
  //             />
  //           </Buttons>
  //         </Holds>
  //         <Holds className="col-start-2 col-end-4 row-span-2 flex items-center justify-center">
  //           <Images
  //             titleImg={titleImg}
  //             titleImgAlt={titleImgAlt}
  //             className="max-w-[33%] h-auto object-contain"
  //           />
  //         </Holds>
  //         <Holds className="col-start-1 col-end-5 row-span-1 flex items-center justify-center ">
  //           <Titles size={"h3"}>{title}</Titles>
  //         </Holds>
  //       </Grids>
  //     </div>
  //   );
  // }
};

export { TitleBoxes, TitleBoxVariants };
