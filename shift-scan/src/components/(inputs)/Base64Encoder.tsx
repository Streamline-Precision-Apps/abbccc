"use client";

import { useState, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Buttons } from "../(reusable)/buttons";
import { Sections } from "../(reusable)/sections";
import {uploadImage} from "@/actions/userActions";
import {Forms} from "../(reusable)/forms";
import {Inputs} from "../(reusable)/inputs";
import { Contents } from "../(reusable)/contents";
import ImageCropper from "./imagecropper";

type Employee = {
  id: string;
  image: string | null;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl?: string | null;
};

type Props = {
  employee: Employee;
  base64String: string;
  setBase64String: Dispatch<SetStateAction<string>>;
};

export default function Base64Encoder({ employee, base64String, setBase64String }: Props) {


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
    <Contents variant={"default"} size={"default"} >
      <Forms action={uploadImage} >
      <Contents size={"default"} variant={"default"}> 
      {/* file enables user to use a file image upload */}
      <ImageCropper setBase64String={setBase64String} handleFileChange={handleFileChange}  />
      </Contents>
      <Inputs type="hidden" name="image" value={base64String} readOnly />
      <Inputs type="hidden" name="id" value={employee.id} readOnly />
      </Forms>
    </Contents>
  );
}