"use client";
import { ChangeEvent, SetStateAction, Dispatch } from "react";
import { Holds } from "../(reusable)/holds";
import { uploadImage } from "@/actions/userActions";
import { Forms } from "../(reusable)/forms";
import { Inputs } from "../(reusable)/inputs";
import { Contents } from "../(reusable)/contents";
import { Employee } from "@/lib/types";
import FileImageCropper from "./FileImageCropper";

type Props = {
  employee: Employee | undefined;
  base64String: string;
  setBase64String: Dispatch<SetStateAction<string>>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  reloadEmployeeData: () => void;
};

export default function Base64FileEncoder({
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
    <Holds className="h-full py-5">
      <Contents width={"section"}>
        <Forms onSubmit={handleSubmit}>
          {/* File enables user to use a file image upload */}
          <FileImageCropper
            setBase64String={setBase64String}
            handleFileChange={handleFileChange}
            reloadEmployeeData={reloadEmployeeData}
          />

          <Inputs type="hidden" name="image" value={base64String} readOnly />
          <Inputs type="hidden" name="id" value={employee.id} readOnly />
        </Forms>
      </Contents>
    </Holds>
  );
}
