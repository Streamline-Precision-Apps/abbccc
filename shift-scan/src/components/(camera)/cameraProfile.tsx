import React, { useState, useRef, Dispatch, SetStateAction, ChangeEvent } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { Contents } from "../(reusable)/contents";
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop, type Crop } from 'react-image-crop';
import SetCanvasPreview from "./setCanvasPreview"; // Import your canvas preview function
import { Texts } from "../(reusable)/texts";

interface CameraComponentProps {
setBase64String: Dispatch<SetStateAction<string>>;
}
const VIDEO_DIMENSIONS = 300;
const DIMENSIONS = 150;
const ASPECT_RATIO = 1/1;

const CameraComponent: React.FC<CameraComponentProps> = ({ setBase64String }) => {
const [imageSrc, setImageSrc] = useState<string | null>(null);
const [stream, setStream] = useState<MediaStream | null>(null);
const [crop, setCrop] = useState<Crop>();
const videoRef = useRef<HTMLVideoElement | null>(null);
const canvasRef = useRef<HTMLCanvasElement | null>(null);
const imgRef = useRef<HTMLImageElement | null>(null);
const [cameraActive, setCameraActive] = useState(false);
const t = useTranslations("equipmentPicture");

const startCamera = async () => {
const constraints = {
    video: { width: DIMENSIONS, height: DIMENSIONS },
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
}
setCameraActive(false);
};

const toggleCamera = (event: React.MouseEvent<HTMLButtonElement>) => {
event.preventDefault(); // Prevent form submission
if (cameraActive) {
    hideCamera();
} else {
    startCamera();
}
};

const takePicture = (event: React.MouseEvent<HTMLButtonElement>) => {
event.preventDefault(); // Prevent form submission
if (canvasRef.current && videoRef.current) {
    const context = canvasRef.current.getContext("2d");
    if (context && videoRef.current.readyState === 4) {
    context.drawImage(videoRef.current, 0, 0, VIDEO_DIMENSIONS, VIDEO_DIMENSIONS);
    const imageData = canvasRef.current.toDataURL("image/png");
    setImageSrc(imageData);
    setBase64String(imageData); // Pass captured image back to parent
    } else {
    console.error("Camera not ready or context not available");
    }
} else {
    console.error("Canvas or Video references are null");
}
};

const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
const { width, height } = e.currentTarget;
const cropWidthInPercent = (DIMENSIONS / width) * 100;
const crop = makeAspectCrop(
    {
    unit: '%',
    width: cropWidthInPercent,
    }, 
    ASPECT_RATIO, 
    width, 
    height
);
const centeredCrop = centerCrop(crop, width, height);
setCrop(centeredCrop);
};

return (
<>
    <Contents size={null} variant="center">
    <video
        ref={videoRef}
        autoPlay
        style={{
        display: cameraActive && !imageSrc ? "block" : "none",
        width: VIDEO_DIMENSIONS,
        height:VIDEO_DIMENSIONS,
        margin: "0 auto",
        }}
    ></video>
    <canvas
        ref={canvasRef}
        style={{ display: "none", margin: "0 auto" }}
        width={VIDEO_DIMENSIONS}
        height={VIDEO_DIMENSIONS}
    ></canvas>
    </Contents>
    <Contents size={null} variant={"center"}>
    <Buttons
        variant={cameraActive ? "red" : "green"}
        onClick={toggleCamera}
    >
        {cameraActive ? "Hide Camera" : "Show Camera"}
    </Buttons>
    {cameraActive && (
        <Buttons variant="green" onClick={takePicture}>
        {t("Button")}
        </Buttons>
    )}
    </Contents>

    {imageSrc && (
    <Contents size={null} variant={"center"}>
        <ReactCrop
        crop={crop}
        circularCrop
        keepSelection
        aspect={ASPECT_RATIO}
        minWidth={DIMENSIONS}
        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
        >
        <img
            ref={imgRef}
            src={imageSrc}
            alt="Captured"
            onLoad={onImageLoad}
        />
        </ReactCrop>

        <Buttons
        variant={"lightBlue"}
        type="submit" 
        onClick={() => {
            if (imgRef.current && canvasRef.current && crop) {
            SetCanvasPreview(
                imgRef.current,
                canvasRef.current,
                convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height),
            );
            const dataUrl = canvasRef.current.toDataURL();
            setBase64String(dataUrl);
            }
        }}
        >
        <Texts>Crop Image</Texts>
        </Buttons>

        <canvas
        className="mt-5"
        ref={canvasRef}
        style={{
            display: "none",
            objectFit: "contain",
            width: 250,
            height: 250,
        }}
        />
    </Contents>
    )}
</>
);
};

export default CameraComponent;