"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { EditableFields } from "@/components/(reusable)/EditableField";
import React, { useEffect, useState } from "react";
import { Jobsite, TagSummary } from "../../../types";
import { COUNTRIES } from "../../../constants/countries";
import { Titles } from "@/components/(reusable)/titles";
import QRCode from "qrcode";
import { Tooltips } from "@/components/(reusable)/tooltip";
import JobsiteCostCodeGroups from "./JobsiteCostCodeGroups";

interface JobsiteBasicFieldsProps {
  formData: Jobsite;
  changedFields: Set<string>;
  onInputChange: (
    fieldName: string,
    value:
      | string
      | boolean
      | Array<{
          id: string;
          name: string;
        }>
  ) => void;
  onRevertField: (fieldName: string) => void;
  tagSummaries: TagSummary[];
}

/**
 * Basic jobsite information fields component
 * Handles name, description, status, and basic details
 */
export default function JobsiteBasicFields({
  formData,
  changedFields,
  onInputChange,
  onRevertField,
  tagSummaries,
}: JobsiteBasicFieldsProps) {
  const isFieldChanged = (fieldName: string) => changedFields.has(fieldName);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  useEffect(() => {
    const generateQrCode = async () => {
      try {
        const url = await QRCode.toDataURL(formData.qrId || "");
        setQrCodeUrl(url);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };
    generateQrCode();
  }, [formData, formData.qrId]);

  const printQRCode = () => {
    if (!qrCodeUrl) return;

    // Open a new window for printing
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the QR code");
      return;
    }

    // Write HTML content to the new window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print QR Code - ${formData?.name || "Jobsite"}</title>
        <style>
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
            font-family: Arial, sans-serif;
          }
          .qr-code-container {
            text-align: center;
          }
          .qr-code {
            width: 300px;
            height: 300px;
            border: 4px solid black;
            border-radius: 10px;
            margin-bottom: 20px;
          }
          .equipment-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .equipment-id {
            font-size: 16px;
            color: #555;
            margin-bottom: 8px;
          }
          .equipment-description {
            font-size: 16px;
            color: #555;
            max-width: 350px;
            padding: 0 20px;
            line-height: 1.4;
            margin-top: 8px;
            white-space: pre-wrap;
            overflow-wrap: break-word;
          }
          @media print {
            body {
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="qr-code-container">
          <div class="equipment-name">${formData?.name || "N/A"}</div>
          <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
          <div class="equipment-id">ID: ${formData.qrId || "N/A"}</div>
          <div class="equipment-description">${
            formData.description
              ? `Brief Description:\n${formData.description}`
              : ""
          }</div>
        </div>
        <script>
          // Print and close window when loaded
          window.onload = function() {
            window.print();
            // Close after printing is done or canceled
            setTimeout(() => window.close(), 500);
          };
        </script>
      </body>
      </html>
    `);

    printWindow.document.close();
  };

  return (
    <Grids className="w-full h-full grid-rows-[50px_1fr] gap-2">
      <Holds position={"row"} className="w-full h-full justify-between">
        <Holds className="w-full">
          <Titles position={"left"} size={"xl"} className="font-bold">
            {formData?.name || "N/A"}
          </Titles>
        </Holds>
        <Holds className="w-full h-full">
          <Holds
            position={"right"}
            className={`w-[50px] h-[50px] border-[3px] border-black rounded-[10px] cursor-pointer hover:opacity-80 hover:border-blue-900 transition-opacity z-20`}
            onClick={printQRCode}
          >
            <Tooltips content="Click to print QR code" delay={0}>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                className="w-full h-full object-cover rounded-[6px]"
              />
            </Tooltips>
          </Holds>
        </Holds>
      </Holds>

      <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
        <Holds className="w-full h-full col-span-1 overflow-y-auto no-scrollbar">
          <label htmlFor="name" className="text-xs font-sm">
            Jobsite Name
          </label>
          <EditableFields
            formDatatype="input"
            type="text"
            name="name"
            value={formData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
            isChanged={isFieldChanged("name")}
            onRevert={() => onRevertField("name")}
            variant={isFieldChanged("name") ? "edited" : "default"}
            size="sm"
          />

          <label htmlFor="clientId" className="text-xs pt-2 ">
            Client
          </label>
          <EditableFields
            formDatatype="input"
            name="clientId"
            type="text"
            value={formData.Client?.name || formData.clientId || ""}
            onChange={(e) => onInputChange("clientId", e.target.value)}
            isChanged={isFieldChanged("clientId")}
            onRevert={() => onRevertField("clientId")}
            variant={isFieldChanged("clientId") ? "edited" : "default"}
            size="sm"
          />

          <label htmlFor="address" className="text-xs pt-2 ">
            Street Address
          </label>
          <EditableFields
            formDatatype="input"
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={(e) => onInputChange("address", e.target.value)}
            placeholder="Enter street address"
            isChanged={isFieldChanged("address")}
            onRevert={() => onRevertField("address")}
            variant={isFieldChanged("address") ? "edited" : "default"}
            size="sm"
          />

          <label htmlFor="city" className="text-xs pt-2 ">
            City
          </label>
          <EditableFields
            formDatatype="input"
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={(e) => onInputChange("city", e.target.value)}
            placeholder="Enter city"
            isChanged={isFieldChanged("city")}
            onRevert={() => onRevertField("city")}
            variant={isFieldChanged("city") ? "edited" : "default"}
            size="sm"
          />

          <label htmlFor="state" className="text-xs pt-2 ">
            State
          </label>
          <EditableFields
            formDatatype="input"
            type="text"
            name="state"
            value={formData.state || ""}
            onChange={(e) => onInputChange("state", e.target.value)}
            placeholder="Enter state"
            isChanged={isFieldChanged("state")}
            onRevert={() => onRevertField("state")}
            variant={isFieldChanged("state") ? "edited" : "default"}
            size="sm"
          />

          <label htmlFor="zipCode" className="text-xs pt-2 ">
            Zip Code
          </label>
          <EditableFields
            formDatatype="input"
            type="text"
            name="zipCode"
            value={formData.zipCode || ""}
            onChange={(e) => onInputChange("zipCode", e.target.value)}
            placeholder="Enter zip code"
            isChanged={isFieldChanged("zipCode")}
            onRevert={() => onRevertField("zipCode")}
            variant={isFieldChanged("zipCode") ? "edited" : "default"}
            size="sm"
          />

          <label htmlFor="country" className="text-xs pt-2 ">
            Country
          </label>
          <EditableFields
            formDatatype="select"
            name="country"
            value={formData.country || "US"}
            onChange={(e) => onInputChange("country", e.target.value)}
            isChanged={isFieldChanged("country")}
            onRevert={() => onRevertField("country")}
            variant={isFieldChanged("country") ? "edited" : "default"}
            size="sm"
            options={COUNTRIES.map((country) => ({
              label: country.name,
              value: country.code,
            }))}
          />

          <label htmlFor="description" className="text-xs pt-2 ">
            Jobsite Description
          </label>
          <EditableFields
            formDatatype="textarea"
            name="description"
            value={formData.description || ""}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="Enter jobsite description"
            isChanged={isFieldChanged("description")}
            onRevert={() => onRevertField("description")}
            variant={isFieldChanged("description") ? "edited" : "default"}
            size="sm"
            rows={3}
          />

          {/* Optionally display approval status (read-only) */}
          <label htmlFor="isActive" className="text-xs pt-2">
            Job Site Status
          </label>
          <EditableFields
            formDatatype="select"
            name="isActive"
            value={formData.isActive ? "Active" : "Inactive"}
            onChange={(e) =>
              onInputChange("isActive", e.target.value === "Active")
            }
            isChanged={isFieldChanged("isActive")}
            onRevert={() => onRevertField("isActive")}
            variant={isFieldChanged("isActive") ? "edited" : "default"}
            size="sm"
            options={[
              { label: "Active", value: "Active" },
              { label: "Inactive", value: "Inactive" },
            ]}
          />
        </Holds>
        {/* Jobsite Name */}
        <Holds className="w-full h-full col-span-1 overflow-y-scroll no-scrollbar pb-5">
          <label htmlFor="costCodeGroups" className="text-xs font-medium">
            Cost Code Groups
          </label>
          <Holds className="w-full h-full p-3 border-black border-[3px] rounded-[10px]">
            <JobsiteCostCodeGroups
              formData={formData}
              tagSummaries={tagSummaries}
              onInputChange={onInputChange}
              changedFields={changedFields}
            />
          </Holds>
        </Holds>
      </Grids>
    </Grids>
  );
}
