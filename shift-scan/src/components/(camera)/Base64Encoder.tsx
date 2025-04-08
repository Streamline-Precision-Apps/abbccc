"use client";
import { ChangeEvent, SetStateAction, Dispatch } from "react";
import { uploadImage } from "@/actions/userActions";
import { Forms } from "../(reusable)/forms";
import { Inputs } from "../(reusable)/inputs";
import ImageCropper from "./imagecropper";
import CameraComponent from "./cameraProfile";
import { Employee } from "@/lib/types";

type Props = {
  employee: Employee | undefined;
  base64String: string;
  setBase64String: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  reloadEmployeeData: () => void;
};

export default function Base64Encoder({
  employee,
  base64String,
  setBase64String,
  setIsOpen,
  reloadEmployeeData,
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Prevent default form submission
    event.preventDefault();

    try {
      // Perform the upload action first
      const result = await uploadImage(new FormData(event.currentTarget));
      console.log(result);

      // After the action completes, proceed with closing the modal and reloading the data
      setIsOpen(false);
      reloadEmployeeData();
    } catch (error) {
      console.error("Failed to upload image", error);
    }
  };

  return (
    <Forms onSubmit={handleSubmit} className="h-full w-full">
      {/* File enables user to use a file image upload */}
      <ImageCropper
        setBase64String={setBase64String}
        handleFileChange={handleFileChange}
        reloadEmployeeData={reloadEmployeeData}
      />

      <CameraComponent
        setBase64String={setBase64String}
        reloadEmployeeData={reloadEmployeeData}
      />

      <Inputs type="hidden" name="image" value={base64String} readOnly />
      <Inputs type="hidden" name="id" value={employee.id} readOnly />
    </Forms>
  );
}
