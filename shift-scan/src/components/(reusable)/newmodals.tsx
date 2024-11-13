"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import ReactPortal from "./ReactPortal";
import React, { useEffect } from "react";
import { Titles } from "./titles";
import { Bases } from "./bases";

const NModalVariants = cva(
  "", //this applies to all variants
  {
    variants: {
      background: {
        default: "bg-white opacity-90 rounded-2xl p-1",
      },
      position: {
        center: "relative",
      },
      size: {
        default:
          "fixed rounded p-1 bg-white top-1/4 left-3/4 -translate-x-1/4 -translate-y-1/2 flex flex-col",
        sm: "absolute left-[50%] top-[50%]",
        med: "",
        lg: " fixed rounded-3xl p-1 bg-white opacity-none h-fit w-2/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-normal mt-16",
        clock:
          "fixed rounded top-1/3 -translate-y-1/3 flex flex-col w-full h-[100%] ",
        fullPage:
          "fixed left-0 top-0 mt-10 rounded-2xl rounded-b-none w-full h-full",
      },
    },
    defaultVariants: {
      background: "default",
      position: "center",
      size: "default",
    },
  }
);

interface NModalProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof NModalVariants> {
  type?: string;
  isOpen: boolean;
  step?: number;
  handleClose: () => void;
  handleSubmit?: () => void;
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
      <Bases background={"modal"} position={"start"} size={"screen"}>
        <div
          className={cn(
            NModalVariants({ background, position, size, className })
          )}
          {...props}
        >
          <Titles>{props.title}</Titles>
          <div className="modal-content">{props.children}</div>
        </div>
      </Bases>
    </ReactPortal>
  );
};

export { NModals, NModalVariants };
