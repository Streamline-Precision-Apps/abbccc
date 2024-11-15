import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Inputs } from "../(reusable)/inputs";
import { Labels } from "../(reusable)/labels";
import { Contents } from "../(reusable)/contents";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  type Crop,
} from "react-image-crop";
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";
import SetCanvasPreview from "./setCanvasPreview";
import React from "react";
import Image from "next/image";
type Props = {
  setBase64String: Dispatch<SetStateAction<string>>;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  reloadEmployeeData: () => void;
};
const aspectRatio = 1 / 1;
const MIN_DIMENSION = 150;

export default function FileImageCropper({
  setBase64String,
  handleFileChange,
}: Props) {
  const [imageSource, setImageSource] = useState<string>("");
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<boolean>(false);

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(true);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageUrl = reader.result?.toString() || "";
      const imageElement = new window.Image();
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", () => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = imageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150px X 150px");
          return setImageSource("");
        }
        // Set base64 image URL as source
        setImageSource(imageUrl);
      });
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      aspectRatio,
      width,
      height
    );
    const CenteredCrop = centerCrop(crop, width, height);
    setCrop(CenteredCrop);
  };

  return (
    <>
      {!selectedFile && (
        <Labels>
          <Inputs
            variant="default"
            type="file"
            accept="image/*"
            onChange={onSelectFile}
          />
        </Labels>
      )}
      {error && <Texts color="red">{error}</Texts>}
      {imageSource && (
        <Contents>
          <ReactCrop
            crop={crop}
            circularCrop
            keepSelection
            aspect={aspectRatio}
            minWidth={MIN_DIMENSION}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
          >
            <Image
              ref={imgRef}
              src={imageSource}
              width={500}
              height={500}
              alt="profile"
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <Buttons
            background={"lightBlue"}
            type="submit"
            onClick={() => {
              if (imgRef.current && canvasRef.current && crop) {
                SetCanvasPreview(
                  imgRef.current,
                  canvasRef.current,

                  convertToPixelCrop(
                    crop,
                    imgRef.current.width,
                    imgRef.current.height
                  )
                );
                const dataUrl = canvasRef.current.toDataURL();
                setBase64String(dataUrl);
                handleFileChange;
              }
            }}
          >
            <Texts>Crop Image</Texts>
          </Buttons>

          {crop && (
            <canvas
              className="mt-5"
              ref={canvasRef}
              style={{
                display: "none",
                objectFit: "contain",
                width: 500,
                height: 500,
              }}
            ></canvas>
          )}
        </Contents>
      )}
    </>
  );
}
