"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import React, { useRef, useState, useEffect } from "react";
import { Holds } from "../(reusable)/holds";

type SignatureProps = {
  setBase64String: (base64string: string) => void;
};

export default function Signature({ setBase64String }: SignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
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
    if (canvas) {
      const base64string = canvas.toDataURL("image/png");
      setBase64String(base64string); // Set base64 string using the prop
    }
  };

  return (
    <Holds>
      <canvas
        ref={canvasRef}
        width={250}
        height={200}
        className="m-auto border border-black rounded-xl "
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <Holds className="mt-4 flex flex-row gap-4">
        <Buttons background={"red"} onClick={handleClear}>
          Clear
        </Buttons>
        <Buttons background={"green"} onClick={handleSave}>
          Save
        </Buttons>
      </Holds>
    </Holds>
  );
}
