"use client";

import { uploadSignature } from "@/actions/userActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { useSession } from "next-auth/react";
import { useRef, useState, useEffect, Dispatch, SetStateAction } from "react";

type SignatureProps = {
  setBase64String: Dispatch<SetStateAction<string>>;
  closeModal?: () => void;
};

export default function Signature({
  setBase64String,
  closeModal,
}: SignatureProps) {
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

    // Resize canvas on mount and window resize
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 🔹 Prevent touch scrolling
    const preventTouchScroll = (event: TouchEvent) => event.preventDefault();
    document.addEventListener("touchmove", preventTouchScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("touchmove", preventTouchScroll);
    };
  }, []);

  const { data: session } = useSession();
  if (!session) {
    return null;
  }

  const employee = session?.user?.id;

  const saveSignature = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureBase64String = canvas.toDataURL("image/png");
    await uploadSignature(employee.toString(), signatureBase64String);
  };

  // 🔹 Convert touch coordinates to match mouse event behavior
  const getTouchPos = (canvas: HTMLCanvasElement, touchEvent: TouchEvent) => {
    const rect = canvas.getBoundingClientRect();
    const touch = touchEvent.touches[0]; // First touch only
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  };

  // 🔹 Mouse Handlers
  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      ctx.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // 🔹 Touch Handlers
  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const pos = getTouchPos(canvas, event.nativeEvent);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
      }
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (ctx) {
      const pos = getTouchPos(canvasRef.current, event.nativeEvent);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  // 🔹 Clear Signature
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

  // 🔹 Save Signature as Base64 Image
  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const base64string = canvas.toDataURL("image/png");
      setBase64String(base64string);
    }
    if (closeModal) {
      saveSignature();
      closeModal();
    }
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows={"5"} gap={"5"} className="h-full w-full">
        {/* Signature Pad */}
        <Holds className="row-span-4 h-full w-full items-center justify-center">
          <canvas
            ref={canvasRef}
            className="m-auto border border-black rounded-xl w-full h-48"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
        </Holds>

        {/* Buttons */}
        <Holds
          position={"row"}
          className="row-span-1 gap-4 h-full justify-center flex"
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
