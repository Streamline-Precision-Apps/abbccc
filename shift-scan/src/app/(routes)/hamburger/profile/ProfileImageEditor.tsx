"use client";

import { useState, useRef, useEffect } from "react";
import { NModals } from "@/components/(reusable)/newmodals";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Titles } from "@/components/(reusable)/titles";
import { uploadImage } from "@/actions/userActions";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { set } from "date-fns";
import { useTranslations } from "next-intl";
import Spinner from "@/components/(animations)/spinner";
import { usePermissions } from "@/app/context/PermissionsContext";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  signature?: string | null;
  image: string | null;
  imageUrl?: string | null;
};

export default function ProfileImageEditor({
  employee,
  reloadEmployee,
  loading,
  employeeName,
}: {
  employeeName: string;
  employee?: Employee;
  reloadEmployee: () => Promise<void>;
  loading: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"select" | "camera" | "preview" | "crop">(
    "select",
  );
  const t = useTranslations("Hamburger-Profile");
  const [imageSrc, setImageSrc] = useState<string>("");
  const [cropImageSrc, setCropImageSrc] = useState<string>("");
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { requestCameraPermission } = usePermissions();

  // Camera management
  useEffect(() => {
    if (mode === "camera") {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  // Handle crop completion
  useEffect(() => {
    if (completedCrop && imageRef.current && canvasRef.current) {
      const image = imageRef.current;
      const canvas = canvasRef.current;
      const crop = completedCrop;

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext("2d");
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;

      if (ctx) {
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height,
        );
      }
      setCropImageSrc(canvas.toDataURL("image/png"));
    }
  }, [completedCrop]);

  const startCamera = async () => {
    try {
      // First request camera permission using the centralized permissions context
      const permissionGranted = await requestCameraPermission();

      if (!permissionGranted) {
        console.error("Camera permission denied");
        setMode("select");
        return;
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 300, height: 300 },
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (error) {
      console.error("Camera error:", error);
      setMode("select");
    }
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  const takePicture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      setImageSrc(canvas.toDataURL("image/png"));
      setMode("crop");
    }
  };

  const saveImage = async () => {
    setIsSaving(true);
    if (!imageSrc) return;
    try {
      // Submit to server
      const formData = new FormData();
      formData.append("id", employee?.id || "");
      formData.append("image", cropImageSrc);
      await uploadImage(formData);
      localStorage.removeItem("userProfileImage");
      // Close and refresh
      setIsOpen(false);
      await reloadEmployee();
      resetState();
    } catch (error) {
      console.error("Error saving image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetState = () => {
    setMode("select");
    setImageSrc("");
    setCrop(undefined);
    setCompletedCrop(null);
    stopCamera();
  };

  return (
    <>
      {/* Profile Image with Camera Button */}
      <Holds className="w-full  relative">
        <Holds className="w-[90px] h-[90px] relative">
          <Images
            titleImg={
              loading
                ? "/profileEmpty.svg"
                : employee?.image || "/profileEmpty.svg"
            }
            titleImgAlt="profile"
            onClick={() => setIsOpen(true)}
            className={`w-full h-full rounded-full object-cover ${
              employee?.image && !loading ? "border-[3px] border-black" : ""
            }`}
          />
          <Holds className="absolute bottom-2 right-0 translate-x-1/4 translate-y-1/4 rounded-full h-9 w-9 border-[3px] p-1 justify-center items-center border-black bg-app-gray">
            <Images
              titleImg="/camera.svg"
              titleImgAlt="camera"
              onClick={() => setIsOpen(true)}
            />
          </Holds>
        </Holds>
      </Holds>

      {/* Main Modal */}
      <NModals
        size={"screen"}
        background={"takeABreak"}
        isOpen={isOpen}
        handleClose={() => {
          setIsOpen(false);
          resetState();
        }}
      >
        <Holds background={"white"} className={`p-5 h-full `}>
          {isSaving && (
            <Holds
              background={"white"}
              className="h-full w-full fixed top-0 left-0 z-50 bg-opacity-50 flex flex-col justify-center items-center"
            >
              <Spinner size={60} color={"border-app-dark-blue"} />
            </Holds>
          )}
          {/* Back Button */}
          <Holds>
            <Images
              position={"left"}
              onClick={() =>
                mode === "select" ? setIsOpen(false) : setMode("select")
              }
              titleImg="/arrowBack.svg"
              titleImgAlt="backArrow"
              className="w-10 h-10"
            />
          </Holds>

          <Contents width={"section"} className="h-full w-full">
            <Grids rows={"10"} className="h-full w-full">
              <Holds className="row-start-1 row-end-2">
                <Titles size={"h4"}>
                  {mode === "crop"
                    ? t("CropPhoto")
                    : mode === "camera"
                      ? t("ChangeProfilePhoto")
                      : t("MyProfilePhoto")}
                </Titles>
              </Holds>

              {/* Content Area */}
              <Holds className="row-start-2 row-end-6 h-full w-full justify-center items-center">
                {mode === "camera" ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-[250px] h-[250px] object-cover rounded-full border-[3px] border-black"
                  />
                ) : mode === "preview" ? (
                  <img
                    src={canvasRef.current?.toDataURL() || imageSrc}
                    alt="Preview"
                    className="w-[250px] h-[250px] object-cover rounded-full border-[3px] border-black"
                  />
                ) : mode === "crop" ? (
                  <div className="flex flex-col items-center">
                    {imageSrc && (
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        circularCrop
                        aspect={1}
                        minWidth={100}
                        minHeight={100}
                      >
                        <img
                          ref={imageRef}
                          src={imageSrc}
                          alt="Crop preview"
                          className="max-w-full max-h-[300px]"
                          onLoad={(e) => {
                            const img = e.currentTarget;
                            const minDimension = Math.min(
                              img.width,
                              img.height,
                            );
                            setCrop({
                              unit: "px",
                              width: minDimension * 0.8,
                              height: minDimension * 0.8,
                              x: (img.width - minDimension * 0.8) / 2,
                              y: (img.height - minDimension * 0.8) / 2,
                            });
                          }}
                        />
                      </ReactCrop>
                    )}
                    <canvas
                      ref={canvasRef}
                      style={{
                        display: "none",
                        borderRadius: "50%",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                ) : (
                  <img
                    src={employee?.image || "/person.svg"}
                    alt="Current Profile"
                    className="w-[250px] h-[250px] object-cover rounded-full border-[3px] border-black"
                  />
                )}
              </Holds>

              {/* Action Buttons */}

              {mode === "select" ? (
                <Holds className="row-start-10 row-end-11 w-full space-y-3">
                  <Buttons
                    background="lightBlue"
                    className="w-full py-2"
                    onClick={() => setMode("camera")}
                  >
                    <Titles size={"h4"}>{t("ChangeProfilePhoto")}</Titles>
                  </Buttons>
                </Holds>
              ) : mode === "camera" ? (
                <Holds className="row-start-9 row-end-11 w-full space-y-5">
                  <Buttons
                    background="green"
                    className="w-full py-2"
                    onClick={takePicture}
                  >
                    <Titles size={"h4"}>{t("CaptureImage")}</Titles>
                  </Buttons>
                  <Buttons
                    background="red"
                    className="w-full py-2"
                    onClick={() => setMode("select")}
                  >
                    <Titles size={"h4"}>{t("Cancel")}</Titles>
                  </Buttons>
                </Holds>
              ) : mode === "crop" ? (
                <Holds className="row-start-9 row-end-10 w-full space-y-5">
                  <Buttons
                    background="green"
                    className="w-full py-2"
                    onClick={saveImage}
                    disabled={isSaving}
                  >
                    <Titles size={"h4"}>{t("Save")}</Titles>
                  </Buttons>
                  <Buttons
                    background="red"
                    className="w-full py-2"
                    onClick={() => setMode("camera")}
                  >
                    <Titles size={"h4"}>{t("Retake")}</Titles>
                  </Buttons>
                </Holds>
              ) : null}
            </Grids>
          </Contents>
        </Holds>
      </NModals>
    </>
  );
}
