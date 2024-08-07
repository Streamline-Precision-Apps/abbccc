"use client";

import { useState, ChangeEvent, SetStateAction, Dispatch } from "react";
import { Buttons } from "../(reusable)/buttons";
import { Sections } from "../(reusable)/sections";
import {uploadImage} from "@/actions/userActions";

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
      <form action={uploadImage} >
      <Buttons variant="default" size="default" type="submit">Upload Image</Buttons>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <input type="text" name="image" value={base64String} readOnly />
      <input type="text" name="id" value={employee.id} readOnly />
      </form>
    </Sections>
  );
}