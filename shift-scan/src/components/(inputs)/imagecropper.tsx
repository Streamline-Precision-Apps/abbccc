import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { Inputs } from "../(reusable)/inputs";
import { Labels } from "../(reusable)/labels";
import { Contents } from "../(reusable)/contents";
import 'react-image-crop/dist/ReactCrop.css';
import ReactCrop, { centerCrop, convertToPixelCrop, makeAspectCrop, type Crop } from 'react-image-crop';
import { Texts } from "../(reusable)/texts";
import { Buttons } from "../(reusable)/buttons";
import SetCanvasPreview from "../(inputs)/setCanvasPreview";
import React from "react";
type Props = {
setBase64String: Dispatch<SetStateAction<string>>,
handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void
}
const aspectRatio = 1 / 1;
const MIN_DIMENSION = 150;

export default function ImageCropper({ setBase64String, handleFileChange }: Props) {
    const [imageSource, setImageSource] = useState<string>("");
    const imgRef = useRef<HTMLImageElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [error, setError] = useState<string | null>(null);

    const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const imageElement = new Image();
            const imageUrl = reader.result?.toString() || '';
            imageElement.src = imageUrl;

            imageElement.addEventListener('load', (e) => {
                if (error) setError("");
                const { naturalWidth, naturalHeight } = e.currentTarget as HTMLImageElement;
                if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                    setError('Image must be at least 150px X 150px');
                    return setImageSource('');
                }
            });
            setImageSource(imageUrl);
        });
        reader.readAsDataURL(file);
    };

    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;
        const crop = makeAspectCrop(
            {
                unit: '%',
                width: cropWidthInPercent,
            }, aspectRatio,
            width, height
        );
        const CenteredCrop = centerCrop(crop, width, height);
        setCrop(CenteredCrop);
    };
    
    return (
        <>
            <Labels variant="default">
                <span>Choose Profile Picture</span>
                <Inputs
                    variant="default"
                    type="file"
                    accept="image/*"
                    onChange={onSelectFile}
                />
            </Labels>
            {error && <Texts variant={"error"}>{error}</Texts>}
            {imageSource &&
                <Contents size={null} variant={null}>
                    <ReactCrop
                        crop={crop}
                        circularCrop
                        keepSelection
                        aspect={aspectRatio}
                        minWidth={MIN_DIMENSION}
                        onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}  >
                        <img
                            ref={imgRef}
                            src={imageSource}
                            alt="profile"
                            onLoad={onImageLoad}
                        />
                    </ReactCrop>
                    <Buttons 
                    variant={"default"} 
                    size={"minBtn"}
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
                                    ),
                                );
                                const dataUrl = canvasRef.current.toDataURL();
                                setBase64String(dataUrl);
                                handleFileChange
                            }
                        }}>
                        <Texts>Crop Image</Texts>
                    </Buttons>
                    <br />
                    <br />
                    {crop &&
                        <canvas
                            className="mt-5"
                            ref={canvasRef}
                            style={{
                                display: "none",
                                objectFit: "contain",
                                width: 250,
                                height: 250,
                            }}
                        >
                        </canvas>
                    }
                </Contents>
            }
        </>
    );
};