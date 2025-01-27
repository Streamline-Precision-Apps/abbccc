"use client";
import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
// import { useTranslations } from "next-intl";
import { Holds } from "../(reusable)/holds";
import { Titles } from "../(reusable)/titles";
import { Grids } from "../(reusable)/grids";
import { Images } from "../(reusable)/images";

interface CameraComponentProps {
  setBase64String: Dispatch<SetStateAction<string>>;
}

const CameraComponent: React.FC<CameraComponentProps> = ({
  setBase64String,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  // const t = useTranslations("Widgets");

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
      setImageSrc(null);
    } else {
      startCamera();
    }
  };

  const takePicture = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 250, 250);
        const imageData = canvasRef.current.toDataURL("image/png");
        setImageSrc(imageData);
        setBase64String(imageData);
      }
    }
  };

  const clearPicture = () => {
    setImageSrc(null);
    setBase64String("");
  };

  return (
    <>
      <Grids rows={"6"} className="my-5">
        <Holds className="  row-span-4 h-full justify-center">
            <Holds>
              {!imageSrc && !cameraActive && <Images className="w-[250px] h-[250px]" titleImg="/person.svg" titleImgAlt="person" />}  
              {imageSrc && (
              <img
                src={imageSrc}
                alt="Captured"
                style={{
                  width: "250px",
                  height: "250px",
                  margin: "0 auto",
                  borderRadius: "50%",
                  border: "10px solid",
                }}
              />
            )}
            </Holds>

            <video
            ref={videoRef}
            autoPlay
            style={{
              display: cameraActive && !imageSrc ? "block" : "none",
              width: "250px",
              height: "250px",
              margin: "0 auto",
              borderRadius: "50%",
              border: "10px solid",
            }}
          ></video>
        
          <canvas
            ref={canvasRef}
            style={{ display: "none" }}
            width="250px"
            height="250px"
          ></canvas>
          
        </Holds>
        <Holds className="row-span-2 h-full justify-around">
          <Holds>
            <Buttons
              background={cameraActive ? "green" : "lightBlue"}
              onClick={imageSrc ? clearPicture : cameraActive ? takePicture : toggleCamera}
              className="p-2"
            >
              <Titles>{imageSrc ? `Retake Picture` : `${cameraActive ? `Take Picture` : `Use Camera` }`}</Titles>
            </Buttons>
          </Holds>
          <Holds>
            <Buttons
              background={cameraActive ? "red" : "lightBlue"}
              onClick={() => {
                clearPicture();
                hideCamera();
              }}
              className="p-2" disabled={!cameraActive}
            >
              <Titles>{cameraActive ? `Cancel` : `Camera Roll`}</Titles>
            </Buttons>
          </Holds>
        </Holds>
      </Grids>
    </>
  );
};

export default CameraComponent;
