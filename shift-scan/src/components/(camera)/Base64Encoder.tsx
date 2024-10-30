"use client";
import { ChangeEvent, SetStateAction, Dispatch } from "react";
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
    <Holds className="py-5">
      <Contents>
        <Forms onSubmit={handleSubmit}>
          <Contents>
            {/* File enables user to use a file image upload */}
            <ImageCropper
              setBase64String={setBase64String}
              handleFileChange={handleFileChange}
              reloadEmployeeData={reloadEmployeeData}
            />
            <Labels>
              <Texts>or</Texts>
              <CameraComponent
                setBase64String={setBase64String}
                reloadEmployeeData={reloadEmployeeData}
              />
            </Labels>
          </Contents>
          <Inputs type="hidden" name="image" value={base64String} readOnly />
          <Inputs type="hidden" name="id" value={employee.id} readOnly />
        </Forms>
      </Contents>
    </Holds>
  );
}
