"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useRef, useState, useEffect } from "react";
import { Holds } from "../(reusable)/holds";
import { useTranslations } from "next-intl";
import { Titles } from "../(reusable)/titles";
import { Grids } from "../(reusable)/grids";
import { Texts } from "../(reusable)/texts";

type SignatureProps = {
  setBase64String: (base64string: string) => void;
};

export default function Signature({ setBase64String }: SignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  const t = useTranslations("SignUpVirtualSignature");

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "black";
      }
    }
  }, []);

  // Touch event handlers for mobile/tablet support
  const getTouchPos = (touch: React.Touch) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setIsSigned(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx && event.touches.length > 0) {
        const { x, y } = getTouchPos(event.touches[0]);
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (isDrawing && canvasRef.current && event.touches.length > 0) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        const { x, y } = getTouchPos(event.touches[0]);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
    event.preventDefault(); // Prevent scrolling while drawing
  };

  const handleTouchEnd = (_event: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setIsSigned(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      }
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setIsSigned(false);
    setIsSaved(false);
    setBase64String("");
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (isSigned && canvas) {
      const base64string = canvas.toDataURL("image/png");
      setBase64String(base64string); // Set base64 string using the prop
      setIsSaved(true);
    }
  };

  return (
    <>
      <Grids rows={"6"} className="my-5 ">
        <Holds className="row-span-5 h-full justify-center">
          <Texts size={"p4"}>{isSaved ? "Saved" : `${t("SignHere")}`}</Texts>
          <canvas
            ref={canvasRef}
            width={250}
            height={200}
            className="mx-auto border-[3px] border-black rounded-[10px] shadow-[8px_8px_0px_grey]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </Holds>
        <Holds position={"row"} className="row-span-1 h-full">
          <Holds className="h-full mx-3">
            <Buttons background={"red"} onClick={handleClear}>
              <Titles>{t("Clear")}</Titles>
            </Buttons>
          </Holds>
          <Holds className="h-full mx-3">
            <Buttons background={"green"} onClick={handleSave}>
              <Titles>{t("Save")}</Titles>
            </Buttons>
          </Holds>
        </Holds>
      </Grids>
    </>
  );
}
