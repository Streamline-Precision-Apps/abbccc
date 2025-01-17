"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { useRef, useState, useEffect } from "react";

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

    // Set canvas size based on container width
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    // Resize canvas on initial load and window resize
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
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
    handleSave();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      setBase64String("");
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const base64string = canvas.toDataURL("image/png");
      setBase64String(base64string);
    }
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows={"5"} gap={"5"} className="h-full w-full">
        <Holds className="row-span-4 h-full w-full items-center justify-center">
          <canvas
            ref={canvasRef}
            className="m-auto border border-black rounded-xl w-full h-48" // Responsive width, fixed height for this example
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          />
        </Holds>
        <Holds
          position={"row"}
          className="row-span-1 gap-4 h-full justify-center"
        >
          <Buttons onClick={handleSave}>Save</Buttons>
          <Buttons background={"red"} onClick={handleClear}>
            Clear
          </Buttons>
        </Holds>
      </Grids>
    </Holds>
  );
}
