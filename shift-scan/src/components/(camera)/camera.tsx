"use client";
import React, { useState, useRef, Dispatch, SetStateAction } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { Titles } from "../(reusable)/titles";
import { Grids } from "../(reusable)/grids";
import { Images } from "../(reusable)/images";
import { Inputs } from "../(reusable)/inputs";

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
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Start the camera
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

  // Stop the camera
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

  // Toggle the camera on/off
  const toggleCamera = () => {
    if (cameraActive) {
      hideCamera();
      setImageSrc(null);
    } else {
      startCamera();
    }
  };

  // Capture the image from the video stream
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

  // Clear the captured image
  const clearPicture = () => {
    setImageSrc(null);
    setBase64String("");
  };

  // Handle file input change (selecting image from Camera Roll)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageSrc(result);
        setBase64String(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Programmatically trigger the file input click
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <>
      <Grids rows={"6"} className="my-5">
        <Holds className="row-span-4 h-full justify-center">
          <Holds>
            {/* Show placeholder if no image captured and camera not active */}
            {!imageSrc && !cameraActive && (
              <Images
                className="w-[250px] h-[250px]"
                titleImg="/profileEmpty.svg"
                titleImgAlt="person"
              />
            )}
            {/* Show captured image */}
            {imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
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

          {/* Show live video if camera is active and no image captured */}
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
            width="250"
            height="250"
          ></canvas>
        </Holds>

        <Holds className="row-span-2 h-full justify-around">
          <Holds>
            <Buttons
              background={cameraActive ? "green" : "lightBlue"}
              onClick={
                imageSrc
                  ? clearPicture
                  : cameraActive
                  ? takePicture
                  : toggleCamera
              }
              className="p-1"
            >
              <Titles>
                {imageSrc
                  ? "Retake Picture"
                  : cameraActive
                  ? "Take Picture"
                  : "Use Camera"}
              </Titles>
            </Buttons>
          </Holds>
          <Holds>
            {/* When the camera is not active, allow selection from camera roll */}
            {/* {!cameraActive && (
              <>
                <Buttons
                  background={"lightBlue"}
                  onClick={openFilePicker}
                  className="p-2"
                >
                  <Titles>Camera Roll</Titles>
                </Buttons>
                <input
                  ref={fileInputRef}
                  hidden
                  name="Camera Roll"
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </>
            )} */}
            {cameraActive && (
              <Buttons
                background={"red"}
                onClick={() => {
                  clearPicture();
                  hideCamera();
                }}
                className="p-1"
                disabled={!cameraActive}
              >
                <Titles>Cancel</Titles>
              </Buttons>
            )}
          </Holds>
        </Holds>
      </Grids>
    </>
  );
};

export default CameraComponent;
