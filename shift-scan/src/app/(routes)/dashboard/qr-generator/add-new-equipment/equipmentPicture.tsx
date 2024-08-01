import React, { useState, useRef } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";

interface CameraComponentProps {
  setBlob: (blob: Blob | null) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ setBlob }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const t = useTranslations("equipmentPicture");

  const startCamera = async () => {
    const constraints = {
      video: { width: 300, height: 300 },
    };

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia(
        constraints
      );
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setCameraActive(true);
    } catch (error) {
      console.error("Error accessing the camera: ", error);
    }
  };

  const hideCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setCameraActive(false);
  };

  const toggleCamera = () => {
    if (cameraActive) {
      hideCamera();
    } else {
      startCamera();
    }
  };

  const takePicture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 300, 300);
        const imageData = canvasRef.current.toDataURL("image/png");
        setImageSrc(imageData);

        canvasRef.current.toBlob((blob) => {
          if (blob) {
            setBlob(blob); // Use the setBlob prop to set the blob state in the parent component
          }
        }, "image/png");
      }
    }
  };

  return (
    <div>
      <div>
        <video
          ref={videoRef}
          autoPlay
          style={{
            display: cameraActive && !imageSrc ? "block" : "none",
            width: "300px",
            height: "300px",
          }}
        ></video>
        <canvas
          ref={canvasRef}
          style={{ display: "none" }}
          width="300"
          height="300"
        ></canvas>
        {imageSrc && (
          <img
            src={imageSrc}
            alt="Captured"
            style={{ width: "300px", height: "300px" }}
          />
        )}
      </div>
      <Buttons
        variant={cameraActive ? "red" : "green"}
        size="default"
        onClick={toggleCamera}
      >
        {cameraActive ? "Hide Camera" : "Show Camera"}
      </Buttons>
      {cameraActive && (
        <Buttons variant="green" size="default" onClick={takePicture}>
          {t("Button")}
        </Buttons>
      )}
    </div>
  );
};

export default CameraComponent;
