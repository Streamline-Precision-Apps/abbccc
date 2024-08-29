"use client";

import { useState, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Buttons } from "../(reusable)/buttons";
import { Sections } from "../(reusable)/sections";
import {uploadImage} from "@/actions/userActions";
import {Forms} from "../(reusable)/forms";
import {Inputs} from "../(reusable)/inputs";
import { Contents } from "../(reusable)/contents";

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
    <Sections size="titleBox">
      <Forms action={uploadImage} >
      <Contents size={null} variant={"row"}> 
      {/* file enables user to use a file image upload */}
      <Inputs type="file" accept="image/*" onChange={handleFileChange} variant={"files"} />
      <Buttons variant="default" size={"minBtn"} type="submit">Upload Image</Buttons>
      </Contents>
      <Inputs type="hidden" name="image" value={base64String} readOnly />
      <Inputs type="hidden" name="id" value={employee.id} readOnly />
      </Forms>
    </Sections>
  );
}