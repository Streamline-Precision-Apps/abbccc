import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import React, { useRef, useState, useEffect } from "react";

type SignatureProps = {
  setBase64String: (base64string: string) => void;
  base64string?: string | null;
  handleSubmitImage: () => void;
};

export const Signature = ({
  setBase64String,
  base64string,
  handleSubmitImage,
}: SignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null); // Ref for context optimization
  const [isDrawing, setIsDrawing] = useState(false);
  const t = useTranslations("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.parentElement!.offsetWidth - 30; // Set canvas width dynamically
      canvas.height = 150;
      ctxRef.current = canvas.getContext("2d");
      if (ctxRef.current) {
        ctxRef.current.lineWidth = 2;
        ctxRef.current.lineCap = "round";
        ctxRef.current.strokeStyle = "black";
      }

      if (base64string) {
        const img = new Image();
        img.src = base64string;
        img.onload = () => {
          ctxRef.current!.clearRect(0, 0, canvas.width, canvas.height);
          ctxRef.current!.drawImage(img, 0, 0);
        };
      }
    }
  }, [base64string]);

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && ctxRef.current) {
      ctxRef.current.lineTo(
        event.nativeEvent.offsetX,
        event.nativeEvent.offsetY
      );
      ctxRef.current.stroke();
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (canvas && ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const newBase64string = canvas.toDataURL("image/png");
      setBase64String(newBase64string); // Set parent base64 string
      handleSubmitImage();
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
        <Buttons size={null} onClick={(event) => {
                    event.preventDefault();
                    handleClear();
                  }}>
          {t("Clear")}
        </Buttons>
        <Buttons size={null} onClick={(event) => {
            event.preventDefault();
            handleSave();
          }}>
          {t("Save")}
        </Buttons>
      </div>
    </div>
  );
};
