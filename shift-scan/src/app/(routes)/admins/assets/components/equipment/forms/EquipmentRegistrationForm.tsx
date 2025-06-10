"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import React from "react";
import ValidationMessage from "../../shared/ValidationMessage";
import { NewEquipment } from "../hooks/useEquipmentRegistrationForm";
import SafetyDocumentsAndPolicies from "./SafetyDocumentsAndPolicies";

interface EquipmentRegistrationFormProps {
  formData: NewEquipment;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  triedSubmit: boolean;
  hasVehicleInfo: boolean;
  onInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onVehicleInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEquipmentTagChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  onFormSubmit: () => Promise<void> | void; // Allow sync or async
  onCancel: () => void;
}

export default function EquipmentRegistrationForm({
  formData,
  errors,
  touched,
  triedSubmit,
  hasVehicleInfo,
  onInputChange,
  onVehicleInfoChange,
  onEquipmentTagChange,
  onBlur,
  onFormSubmit,
  onCancel,
}: EquipmentRegistrationFormProps) {
  // Helper function to determine if an error should be shown
  const showError = (fieldName: string) => {
    return (triedSubmit || touched[fieldName]) && errors[fieldName];
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onFormSubmit();
      }}
      className="w-full h-full flex flex-col"
    >
      <Grids className="w-full flex-1 grid-cols-[1fr_1fr] gap-4 overflow-hidden">
        <div className="flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar p-1">
          <label
            htmlFor="name"
            className={`text-sm  ${showError("name") ? "text-red-500" : ""}`}
          >
            Equipment Name <span className="text-red-500">*</span>
          </label>
          <Inputs
            type="text"
            name="name" // Corresponds to formData key
            value={formData.name}
            onChange={onInputChange} // Use passed-in handler
            onBlur={onBlur} // Use passed-in handler
            className="w-full text-xs"
            required
          />

          <label htmlFor="description" className="text-sm font-medium">
            Equipment Description
          </label>
          <TextAreas
            name="description" // Corresponds to formData key
            value={formData.description || ""}
            onChange={onInputChange} // Use passed-in handler
            rows={4}
            className="w-full text-xs min-h-[96px]"
            placeholder="Enter equipment description..."
            style={{ resize: "none" }}
          />

          <label
            htmlFor="currentWeight"
            className={`text-sm ${
              showError("currentWeight") ? "text-red-500" : ""
            }`}
          >
            {`Current Weight (lbs)`}
            <span className="text-red-500">*</span>
          </label>
          <Inputs
            type="number"
            name="currentWeight" // Corresponds to formData key
            value={
              formData.currentWeight === null ? "" : formData.currentWeight
            } // Handle null value for input
            onChange={onInputChange} // Use passed-in handler
            onBlur={onBlur}
            placeholder="0"
            className="text-xs"
            required
          />

          <label
            htmlFor="overWeight"
            className={`text-sm ${
              showError("overWeight") ? "text-red-500" : ""
            }`}
          >
            Overweight Equipment
          </label>
          <Selects
            name="overWeight" // Corresponds to formData key
            value={
              formData.overWeight === true
                ? "true"
                : formData.overWeight === false
                ? "false"
                : ""
            }
            onBlur={onBlur}
            onChange={onInputChange} // Use passed-in handler
            className="text-center text-xs"
            required
          >
            <option value="">Select Weight Status</option>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </Selects>
          <label
            htmlFor="equipmentTag"
            className={`text-sm font-medium ${
              showError("equipmentTag") ? "text-red-500" : ""
            }`}
          >
            Equipment Type <span className="text-red-500">*</span>
          </label>
          <Selects
            name="equipmentTag" // Corresponds to formData key
            value={formData.equipmentTag}
            onChange={onEquipmentTagChange} // Use specific handler from props
            onBlur={onBlur} // Use passed-in handler
            className="text-xs"
            required
          >
            <option value="">Select Equipment Type</option>
            <option value="TRUCK">Truck</option>
            <option value="TRAILER">Trailer</option>
            <option value="VEHICLE">Vehicle</option>
            <option value="EQUIPMENT">Equipment</option>
            <option value="OTHER">Other</option>{" "}
            {/* Added Other based on hook */}
          </Selects>

          {/* Conditional rendering for vehicle specific fields */}
          {hasVehicleInfo && formData.equipmentVehicleInfo && (
            <>
              <label
                htmlFor="make"
                className={`text-sm font-medium ${
                  showError("make") ? "text-red-500" : ""
                }`}
              >
                Vehicle Make <span className="text-red-500">*</span>
              </label>
              <Inputs
                type="text"
                name="make" // Corresponds to equipmentVehicleInfo key
                value={formData.equipmentVehicleInfo?.make || ""}
                onChange={onVehicleInfoChange} // Use specific handler for vehicle info
                onBlur={onBlur}
                placeholder="Make"
                className="text-xs"
                required
              />
              <label
                htmlFor="model"
                className={`text-sm font-medium ${
                  showError("model") ? "text-red-500" : ""
                }`}
              >
                Vehicle Model <span className="text-red-500">*</span>
              </label>
              <Inputs
                type="text"
                name="model" // Corresponds to equipmentVehicleInfo key
                value={formData.equipmentVehicleInfo?.model || ""}
                onChange={onVehicleInfoChange}
                onBlur={onBlur}
                placeholder="Model"
                className="text-xs"
                required
              />

              <label
                htmlFor="year"
                className={`text-sm font-medium ${
                  showError("year") ? "text-red-500" : ""
                }`}
              >
                Vehicle Year <span className="text-red-500">*</span>
              </label>
              <Inputs
                type="text" // Changed to text to allow YYYY, can also be number
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                name="year" // Corresponds to equipmentVehicleInfo key
                value={formData.equipmentVehicleInfo?.year || ""}
                onChange={onVehicleInfoChange}
                onBlur={onBlur}
                placeholder="YYYY"
                className="text-xs"
                required
              />

              <label
                htmlFor="licensePlate"
                className={`text-sm font-medium ${
                  showError("licensePlate") ? "text-red-500" : ""
                }`}
              >
                License Plate <span className="text-red-500">*</span>
              </label>
              <Inputs
                type="text"
                name="licensePlate" // Corresponds to equipmentVehicleInfo key
                value={formData.equipmentVehicleInfo?.licensePlate || ""}
                onChange={onVehicleInfoChange}
                onBlur={onBlur}
                placeholder="License Plate"
                className="text-xs"
                required
              />

              {/* DatePicker for registrationExpiration - Assuming you have a DatePicker component */}
              <label
                htmlFor="registrationExpiration"
                className={`text-sm ${
                  showError("registrationExpiration") ? "text-red-500" : ""
                }`}
              >
                Registration Expiration <span className="text-red-500">*</span>
              </label>
              {/* Replace with your actual DatePicker component */}
              <Inputs // Placeholder for DatePicker
                type="date"
                name="registrationExpiration"
                value={
                  formData.equipmentVehicleInfo?.registrationExpiration
                    ? new Date(
                        formData.equipmentVehicleInfo.registrationExpiration
                      )
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={onVehicleInfoChange}
                onBlur={onBlur}
                className="w-full text-xs"
                required
              />

              <label
                htmlFor="mileage"
                className={`text-sm ${
                  showError("mileage") ? "text-red-500" : ""
                }`}
              >
                Vehicle Mileage <span className="text-red-500">*</span>
              </label>
              <Inputs
                type="number"
                name="mileage" // Corresponds to equipmentVehicleInfo key
                value={
                  formData.equipmentVehicleInfo?.mileage === null
                    ? ""
                    : formData.equipmentVehicleInfo?.mileage
                }
                onChange={onVehicleInfoChange}
                onBlur={onBlur}
                placeholder="Mileage"
                className="text-xs"
                required
              />
            </>
          )}
        </div>
        <div className="flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar p-1">
          <Texts position={"left"} size={"sm"}>
            Safety Documents and Policies
          </Texts>
          <Holds className="w-full h-full p-4 border-[3px] border-black rounded-lg space-y-3">
            {/* <SafetyDocumentsAndPolicies /> */}
            <Texts size={"sm"}>Coming Soon!</Texts>
            <Texts size={"sm"} text={"italic"} className="text-gray-500">
              This section will include checkboxes for safety documents and
              policies to connect SOPs to an equipment QR infrastructure.
            </Texts>
          </Holds>
        </div>
      </Grids>
    </form>
  );
}
