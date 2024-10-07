"use client";

import { useState, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Buttons } from "../(reusable)/buttons";
import { Holds } from "../(reusable)/holds";
import { uploadImage } from "@/actions/userActions";
import { Forms } from "../(reusable)/forms";
import { Inputs } from "../(reusable)/inputs";
import { Contents } from "../(reusable)/contents";
import ImageCropper from "./imagecropper";
import CameraComponent from "./cameraProfile";
import { Labels } from "../(reusable)/labels";
import { Texts } from "../(reusable)/texts";
import { Employee } from "@/lib/types";

type Props = {
  employee: Employee | undefined;
  base64String: string;
  setBase64String: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Base64Encoder({
  employee,
  base64String,
  setBase64String,
  setIsOpen,
}: Props) {
  if (employee === undefined) {
    return;
  }
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64String(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Holds className="py-5">
      <Contents>
        <Forms action={uploadImage} onSubmit={() => setIsOpen(false)}>
          <Contents>
            {/* file enables user to use a file image upload */}
            <ImageCropper
              setBase64String={setBase64String}
              handleFileChange={handleFileChange}
            />
            <Labels>
              <Texts>or</Texts>
              <CameraComponent setBase64String={setBase64String} />
            </Labels>
          </Contents>
          <Inputs type="hidden" name="image" value={base64String} readOnly />
          <Inputs type="hidden" name="id" value={employee.id} readOnly />
        </Forms>
      </Contents>
    </Holds>
  );
}
