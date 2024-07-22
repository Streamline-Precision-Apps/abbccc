"use client";
import "@/app/globals.css";
import { useState, ChangeEvent, useEffect } from "react";
import Checkbox from "../checkBox";
import Signature from "../injury-verification/Signature";
import { useSavedInjuryReportData } from "@/app/context/InjuryReportDataContext";
import { CreateInjuryForm } from "@/actions/injuryReportActions";  // Import the server action

export const InjuryReportContent = () => {
  const [checked, setChecked] = useState<boolean>(false);
  const [textarea, setTextarea] = useState<string>("");
  const [signatureBlob, setSignatureBlob] = useState<Blob | null>(null);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { savedInjuryReportData, setSavedInjuryReportData } =
    useSavedInjuryReportData();

  useEffect(() => {
    if (savedInjuryReportData) {
      setChecked(savedInjuryReportData.contactedSupervisor);
      setTextarea(savedInjuryReportData.incidentDescription);
      if (savedInjuryReportData.signatureBlob) {
        const url = URL.createObjectURL(
          new Blob([savedInjuryReportData.signatureBlob])
        );
        setSignatureUrl(url);
      }
    }
  }, [savedInjuryReportData]);

  const handleCheckboxChange = (newChecked: boolean) => {
    setChecked(newChecked);
  };

  const handleSignatureEnd = (blob: Blob) => {
    try {
      if (blob) {
        setSignatureBlob(blob);
        const url = URL.createObjectURL(blob);
        setSignatureUrl(url);
      } else {
        throw new Error("Failed to capture signature. Please try again.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextarea(event.target.value);
  };

  const handleSubmit = async () => {
    if (!textarea) {
      setError("Please describe what happened.");
      return;
    }
    const formData = new FormData();
    formData.append("contactedSupervisor", checked.toString());
    formData.append("incidentDescription", textarea);
    if (signatureBlob) {
      formData.append("signature", signatureBlob);
    }
    try {
      await CreateInjuryForm(formData);  // Use the server action to create the form
      setSavedInjuryReportData({
        contactedSupervisor: checked,
        incidentDescription: textarea,
        signatureBlob: signatureBlob ? await signatureBlob.text() : "",
      });
      setError(null);
      // Add success feedback, e.g., redirect or show a message
    } catch (error) {
      setError("Failed to submit the form. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      if (signatureUrl) {
        URL.revokeObjectURL(signatureUrl);
      }
    };
  }, [signatureUrl]);

  return (
    <div className="mx-auto h-auto w-11/12 lg:w-11/12 flex flex-col justify-center bg-gradient-to-b from-app-dark-blue via-app-dark-blue to-app-blue py-20 border-l-2 border-r-2 border-black">
      <div className="flex flex-col justify-center items-center py-5 px-2 w-11/12 mx-auto h-1/4 border-2 border-black rounded-2xl text-black text-xl">
        <div className="flex flex-row text-center items-center bg-app-blue p-4 rounded-2xl space-x-4">
          <label htmlFor="duration">I contacted my supervisor</label>
          <div id="duration">
            <Checkbox checked={checked} onChange={handleCheckboxChange} />
          </div>
        </div>
        <div className="w-11/12 mx-auto h-40 flex flex-col text-center items-center bg-app-blue p-4 rounded-2xl space-x-4 mt-4 mb-4">
          <label htmlFor="comment">Describe what happened:</label>
          <textarea
            id="comment"
            className="w-full h-full flex col text-center border-2 border-black rounded-2xl bg-gray-200"
            value={textarea}
            onChange={handleChange}
            required
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
          {error && <p className="text-red-500">{error}</p>}
        </div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white p-2 rounded"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
