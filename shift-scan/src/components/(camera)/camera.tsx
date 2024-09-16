import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Contents } from "../(reusable)/contents";

interface CameraComponentProps {
  setBase64String: Dispatch<SetStateAction<string>>;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ setBase64String }) => {
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
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
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
      setImageSrc(null);
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
        setBase64String(imageData);
      }
    }
  };

  return (
    <>
      <Contents>
        <video
          ref={videoRef}
          autoPlay
          style={{
            display: cameraActive && !imageSrc ? "block" : "none",
            width: "300px",
            height: "300px",
            margin: "0 auto",
            borderRadius: "10px",
            border: "5px solid #ccc",
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
            style={{ 
              width: "300px", 
              height: "300px",  
              margin: "0 auto",
              borderRadius: "10px",
              border: "5px solid #ccc" 
            }}
          />
        )}
      </Contents>
      <Contents variant={"rowCenter"}>
      <Buttons
        variant={cameraActive ? "red" : "green"}
        size={"minBtn"}
        onClick={toggleCamera}
      >
        {cameraActive ? "Restart Camera" : "Start Camera"}
      </Buttons>
      {cameraActive && (
        <Buttons variant="green"  size={"minBtn"} onClick={takePicture}>
          {t("Button")}
        </Buttons>
      )}
      </Contents>
    </>
  );
};

export default CameraComponent;
