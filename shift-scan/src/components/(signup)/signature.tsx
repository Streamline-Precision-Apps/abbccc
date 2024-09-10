import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect } from "react";

interface SignatureProps {
  setBase64String: (base64string: string) => void;
  base64string?: string;
}

const Signature: React.FC<SignatureProps> = ({ setBase64String }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const t = useTranslations("Signature");

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
    <div>
      <canvas
        ref={canvasRef}
        style={{ border: "1px solid black", margin: "0 auto" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="flex flex-row gap-4">
        <Buttons variant={"red"} size={"widgetSm"} onClick={handleClear}>
          Clear
        </Buttons>
        <Buttons variant={"green"} size={"widgetSm"} onClick={handleSave}>
          Save
        </Buttons>
      </div>
    </div>
  );
};

export default Signature;
