"use client";
import "@/app/globals.css";
import { fetchTimesheets } from "./serverAction";
import { Form } from "./form";
import { SetStateAction, useState } from "react";
import EditButton from "@/components/editButton";
import Checkbox from "../checkBox";
import Signature from "../injury-verification/Signature";

export const InjuryForm = () => {
  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };
  
  const [checked, setChecked] = useState(false);
  const [textarea, setTextarea] = useState("");
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);

  const handleSignatureEnd = (blob: Blob) => {
    setSignatureBlob(blob);
    const url = URL.createObjectURL(blob);
    setSignatureUrl(url);
  };

  const handleChange = (event: { target: { value: SetStateAction<string> }; }) => {
    setTextarea(event.target.value);
  };

  return (
    <div className="mx-auto h-auto w-11/12 lg:w-11/12 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black">
      <div className="flex flex-col justify-center items-center py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-black text-xl">
        <div className="flex flex-row text-center items-center bg-app-blue p-4 rounded-2xl space-x-4">
          <label htmlFor="duration">I contacted my supervisor</label>
          <div id="duration">
            <input
              id="duration"
              className="w-10 h-6 p-4 flex col text-center border-2 border-black rounded-2xl bg-gray-200"
              type="checkbox"
              value="true"
            />
          </div>
        </div>
        <div className="w-11/12 mx-auto h-40 flex flex-col text-center items-center bg-app-blue p-4 rounded-2xl space-x-4 mt-4 mb-4">
          <label htmlFor="comment">Describe what happened:</label>
          <textarea
            id="comment"
            className="w-full h-full flex col text-center border-2 border-black rounded-2xl bg-gray-200"
            value={textarea}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col text-center">
          <label htmlFor="signature">Signature:</label>
          <Signature onEnd={handleSignatureEnd} />
          {signatureUrl && (
            <img
              id="signature"
              className="w-36 h-auto mt-4 border-2 border-black rounded-2xl bg-gray-200"
              src={signatureUrl}
              alt="Signature"
            />
          )}
        </div>
      </div>
    </div>
  );
};
