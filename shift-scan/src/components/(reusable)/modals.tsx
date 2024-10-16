"use client";
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import ReactPortal from "./ReactPortal";
import React, { useEffect } from "react";
import { Buttons } from "./buttons";
import { Images } from "./images";
import { Titles } from "./titles";
import { Contents } from "./contents";
import { Bases } from "./bases";
import { Holds } from "./holds";
import { signOut } from "next-auth/react";

const ModalVariants = cva(
  "flex flex-col", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-white rounded-2xl",
        gradient: "bg-gradient-to-b from-white to-app-blue",
        test: "bg-red-300",
      },
      size: {
        default:
          "fixed rounded p-1 bg-white top-1/4 left-3/4 -translate-x-1/4 -translate-y-1/2 flex flex-col",
        sm: "fixed rounded p-1 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col",
        med: "p-10 w-40 h-40",
        lg: " fixed rounded-3xl p-1 bg-white h-fit w-2/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-normal mt-16",
        clock:
          "fixed rounded top-1/3 -translate-y-1/3 flex flex-col w-full h-[100%] ",
        fullPage:
          "fixed left-0 top-0 mt-10 rounded-2xl rounded-b-none w-full h-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ModalProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof ModalVariants> {
  type?: string;
  isOpen: boolean;
  step?: number;
  handleClose: () => void;
}

const Modals: FC<ModalProps> = ({
  className,
  variant,
  size,
  type,
  isOpen,
  step,
  handleClose,
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

  if (type === "signOut") {
    return (
      <ReactPortal wrapperId="react-portal-modal-container">
        <div className="modal ">
          <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50" />
          <div
            className={cn(ModalVariants({ variant, size, className }))}
            {...props}
          >
            <div className="modal-content">{props.children}</div>
            <div className=" flex flex-row gap-10">
              <Buttons
                onClick={() => {
                  handleClose();
                  signOut();
                }}
                className="close-btn"
                background={"green"}
                size={"full"}
              >
                <Titles size={"h3"}>Yes</Titles>
              </Buttons>
              <Buttons
                onClick={handleClose}
                className="close-btn"
                background={"red"}
                size={"full"}
              >
                <Titles size={"h3"}>Cancel</Titles>
              </Buttons>
            </div>
          </div>
        </div>
      </ReactPortal>
    );
  } else if (type === "clock")
    return (
      <ReactPortal wrapperId="react-portal-modal-container">
        <div
          className={cn(ModalVariants({ variant, size, className }))}
          {...props}
        >
          <Buttons
            onClick={handleClose}
            className="close-btn"
            background={"red"}
            size={"full"}
          >
            {step === 5 ? <></> : <Images titleImg="/x.svg" titleImgAlt="x" />}
          </Buttons>
          <Contents className="modal-content">{props.children}</Contents>
        </div>
      </ReactPortal>
    );
  else if (type === "expand")
    return (
      <>
        <Buttons
          onClick={handleClose}
          className="close-btn"
          background={"red"}
          size={"full"}
        >
          <Images titleImg="/x.svg" titleImgAlt="x" />
        </Buttons>
        <Contents>{props.children}</Contents>
      </>
    );
  else if (type === "base64")
    return (
      <ReactPortal wrapperId="react-portal-modal-container">
        <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50" />
        <div
          className={cn(ModalVariants({ variant, size, className }))}
          {...props}
        >
          <Buttons
            onClick={handleClose}
            background={"red"}
            className="close-btn"
            size={"10"}
          >
            <Images
              titleImg="/camera.svg"
              titleImgAlt="x"
              className="mx-auto"
            />
          </Buttons>
          <div className="modal-content-wrapper max-h-[80vh] overflow-y-auto scrollbar-hide">
            {props.children}
          </div>
        </div>
      </ReactPortal>
    );
  else if (type === "signature")
    return (
      <ReactPortal wrapperId="react-portal-modal-container">
        <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50" />
        <div
          className={cn(ModalVariants({ variant, size, className }))}
          {...props}
        >
          <Buttons
            onClick={handleClose}
            background={"red"}
            className="close-btn"
            size={"10"}
          >
            <Images
              titleImg="/backArrow.svg"
              titleImgAlt="x"
              className="mx-auto"
            />
          </Buttons>
          <div className="modal-content-wrapper max-h-[80vh] overflow-y-auto scrollbar-hide">
            {props.children}
          </div>
        </div>
      </ReactPortal>
    );
  else
    return (
      <ReactPortal wrapperId="react-portal-modal-container">
        <div className="modal ">
          <div className="fixed top-0  w-screen h-screen bg-neutral-800 opacity-50" />
          <div
            className={cn(ModalVariants({ variant, size, className }))}
            {...props}
          >
            <Buttons onClick={handleClose} className="close-btn" size={"full"}>
              <Images titleImg="/x.svg" titleImgAlt="x" />
            </Buttons>
            <div className="modal-content">{props.children}</div>
          </div>
        </div>
      </ReactPortal>
    );
};

export { Modals, ModalVariants };
