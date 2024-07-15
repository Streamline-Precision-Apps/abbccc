import React, { useRef, useState, useEffect } from "react";

interface SignatureProps {
  onEnd: (blob: Blob) => void;
}

const Signature: React.FC<SignatureProps> = ({ onEnd }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [savedSignature, setSavedSignature] = useState<Blob | null>(null);

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
      canvas.toBlob((blob) => {
        if (blob) {
          setSavedSignature(blob);
          onEnd(blob); // Pass blob to parent component
        }
      }, "image/png");
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={500}
        height={200}
        style={{ border: "1px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div className="flex space-x-4 mt-4">
        <button
          className="bg-app-red text-gray-800 font-semibold py-2 px-4 border border-gray-400 font-bold rounded"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          className="bg-app-green text-gray-800 font-semibold py-2 px-4 border border-gray-400 font-bold rounded"
          onClick={handleSave}
        >
          Save
        </button>
      </div>
      {savedSignature && (
        <div className="mt-4">
          <h3 className="text-2xl font-bold">Saved Signature:</h3>
          <a
            href={URL.createObjectURL(savedSignature)}
            download="signature.png"
          >
            Download Signature
          </a>
        </div>
      )}
    </div>
  );
};

export default Signature;
