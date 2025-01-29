"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import ReactPortal from "./ReactPortal";
import React, { useEffect } from "react";
import { Bases } from "./bases";

const NModalVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      background: {
        default: "bg-white opacity-90 rounded-2xl p-1",
        takeABreak:
          "bg-gradient-to-b from-app-dark-blue to-app-blue pb-3 pt-7 px-2",
      },
      position: {
        center: "relative",
      },
      size: {
        sm: "fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/4 h-1/4",
        med: "fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/3 h-1/3",
        medW: "fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/2 h-1/3",
        medM: " fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/3 h-1/2",
        medH: " fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/3 h-3/4",
        lg: " fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/2 h-1/2",
        lgH: " fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-1/2 h-3/4",
        xl: "fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-3/4 h-3/4",
        xlWS: "fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-3/4 h-1/3 max-w-lg ",
        page: "fixed rounded-[10px] p-4 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-5/6 h-5/6",
        screen:
          "fixed bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col w-screen h-dvh",
      },
    },
    defaultVariants: {
      background: "default",
      position: "center",
      size: "med",
    },
  }
);

interface NModalProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof NModalVariants> {
  isOpen: boolean;
  handleClose: () => void;
}

const NModals: FC<NModalProps> = ({
  className,
  background,
  position,
  size,
  isOpen,
  ...props
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return (): void => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ReactPortal wrapperId="react-portal-modal-container ">
      <Bases
        background={"modal"}
        position={"start"}
        size={"screen"}
        onClick={props.handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className={cn(
            NModalVariants({ background, position, size, className })
          )}
          {...props}
        >
          <div className="modal-content h-full ">{props.children}</div>
        </div>
      </Bases>
    </ReactPortal>
  );
};

export { NModals, NModalVariants };
