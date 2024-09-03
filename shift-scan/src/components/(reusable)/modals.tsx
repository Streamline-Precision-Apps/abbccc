'use client'
import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, FC } from "react";
import { cn } from "@/components/(reusable)/utils";
import ReactPortal from "./ReactPortal";
import React, { useEffect }from 'react';
import { Buttons } from "./buttons";
import { Images } from './images';
import { Titles } from './titles';
import { Contents } from "./contents";
import { Bases } from "./bases";
import { Sections } from "./sections";

const ModalVariants = cva(
  "flex flex-col", //this applies to all variants
  {
    variants: {
      variant: {
        default: "bg-white rounded-2xl",
        gradient: "bg-gradient-to-b from-white to-app-blue",
        test: "bg-red-300"
      },
      size: {
        default: "fixed rounded p-1 bg-white top-1/4 left-3/4 -translate-x-1/4 -translate-y-1/2",
        sm: "fixed rounded p-1 bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
        fullPage: "fixed left-0 top-0 mt-10 rounded-2xl rounded-b-none w-full h-full",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ModalProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof ModalVariants> {
    type?: string;
    isOpen: boolean;
    step?: number;
    handleClose: () => void;
}

const Modals: FC<ModalProps> = ({className, variant, size, type, isOpen, step, handleClose, ...props}) => {
    useEffect(() => {
        if (isOpen) {
        document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }

        return (): void => {
            document.body.style.overflow = 'unset';
        };

    }, [isOpen]);

    if (!isOpen) return null;
    
    if (type === "signOut") {
      return (
        <ReactPortal wrapperId="react-portal-modal-container">
        <div className="modal ">
            <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50"/>
            <div className={cn(ModalVariants({variant, size, className}))} {...props}>
              <div className="modal-content">{props.children}</div>
              <div className=" flex flex-row gap-10">
                <Buttons onClick={handleClose} className="close-btn" variant={"green"} size={"default"}>
                    <Titles variant={"default"} size={"h3"}>Yes</Titles>
                </Buttons>
                <Buttons onClick={handleClose} className="close-btn" variant={"red"} size={"default"}>
                    <Titles variant={"default"} size={"h3"}>Cancel</Titles>
                </Buttons>
              </div>
            </div>
        </div>      
        </ReactPortal>
      )
    }

    else if (type === "clock") 
      return (
      <ReactPortal wrapperId="react-portal-modal-container">
        <div className={cn(ModalVariants({variant, size, className}))} {...props}>
          <Buttons onClick={handleClose} className="close-btn" variant={"red"} size={"exit"}>
          {step === 5 ? <></> : <Images titleImg="/x.svg" titleImgAlt="x" variant={"icon"} size={"thin"}/>
            }
          </Buttons>
          <Contents variant={"test"} size={"test"} className="modal-content">
            {props.children}
          </Contents>
        </div>
      </ReactPortal>
  )

  else if (type === "expand") 
    return (
  <>
        <Buttons onClick={handleClose} className="close-btn" variant={"red"} size={"default"}>
                <Images titleImg="/x.svg" titleImgAlt="x" variant={"icon"} size={"default"}/>
        </Buttons>
        <Contents variant={"test"} size={"test"}>
          {props.children}
        </Contents>
  </>

)
    
      else return (
        <ReactPortal wrapperId="react-portal-modal-container">
          <div className="modal ">
              <div className="fixed top-0 left-0 w-screen h-screen bg-neutral-800 opacity-50"/>
              <div className={cn(ModalVariants({variant, size, className}))} {...props}>
                <Buttons onClick={handleClose} className="close-btn" variant={"icon"} size={"default"}>
                    <Images titleImg="/x.svg" titleImgAlt="x" variant={"icon"} size={"default"}/>
                </Buttons>
                <div className="modal-content">{props.children}</div>
              </div>
          </div>      
        </ReactPortal>
    )
    
}

export {Modals, ModalVariants}