"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";

// Define the types for props
type EquipmentRightProps = {
  equipmentTag: string | null;
  vehicleMake: string | null;
  setVehicleMake: React.Dispatch<React.SetStateAction<string | null>>;
  vehicleModel: string | null;
  setVehicleModel: React.Dispatch<React.SetStateAction<string | null>>;
  vehicleYear: string | null;
  setVehicleYear: React.Dispatch<React.SetStateAction<string | null>>;
  vehicleLicensePlate: string | null;
  setVehicleLicensePlate: React.Dispatch<React.SetStateAction<string | null>>;
  registrationExpiration: string | null;
  setRegistrationExpiration: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  vehicleMileage: string | null;
  setVehicleMileage: React.Dispatch<React.SetStateAction<string | null>>;
  isFieldChanged: (
    field:
      | "equipmentName"
      | "equipmentTag"
      | "make"
      | "model"
      | "year"
      | "licensePlate"
      | "registrationExpiration"
      | "mileage"
      | "equipmentStatus"
      | "equipmentDescription"
      | "equipmentCode"
  ) => boolean;
  revertField: (
    field:
      | "equipmentName"
      | "equipmentTag"
      | "make"
      | "model"
      | "year"
      | "licensePlate"
      | "registrationExpiration"
      | "mileage"
      | "equipmentStatus"
      | "equipmentDescription"
      | "equipmentCode"
  ) => void;
};

export function EquipmentRight({
  equipmentTag,
  vehicleMake,
  setVehicleMake,
  vehicleModel,
  setVehicleModel,
  vehicleYear,
  setVehicleYear,
  vehicleLicensePlate,
  setVehicleLicensePlate,
  registrationExpiration,
  setRegistrationExpiration,
  vehicleMileage,
  setVehicleMileage,
  isFieldChanged,
  revertField,
}: EquipmentRightProps) {
  // Return early if equipmentTag is not VEHICLE or TRUCK
  if (equipmentTag !== "VEHICLE" && equipmentTag !== "TRUCK") {
    return (
      <Holds background={"white"} className="w-full h-full p-4">
        <Holds
          background={"offWhite"}
          className="w-full h-full overflow-y-scroll no-scrollbar"
        ></Holds>
      </Holds>
    );
  }

  // Render the form for VEHICLE or TRUCK
  return (
    <Holds background={"white"} className="w-full h-full">
      <Grids cols={"2"} rows={"6"} className="w-full h-full gap-4 p-4">
        {/* Input Components */}
        {[{
          label: "Vehicle Make",
          value: vehicleMake,
          setValue: setVehicleMake,
          field: "make" as const,
          placeholder: "Make",
          type: "text",
        }, {
          label: "Vehicle Model",
          value: vehicleModel,
          setValue: setVehicleModel,
          field: "model" as const,
          placeholder: "Model",
          type: "text",
        }, {
          label: "Vehicle Year",
          value: vehicleYear,
          setValue: setVehicleYear,
          field: "year" as const,
          placeholder: "Year",
          type: "number",
        }, {
          label: "Vehicle License Plate",
          value: vehicleLicensePlate,
          setValue: setVehicleLicensePlate,
          field: "licensePlate" as const,
          placeholder: "License Plate",
          type: "text",
        }, {
          label: "Registration Expiration",
          value: registrationExpiration,
          setValue: setRegistrationExpiration,
          field: "registrationExpiration" as const,
          placeholder: "Expiration",
          type: "date",
        }, {
          label: "Vehicle Mileage",
          value: vehicleMileage,
          setValue: setVehicleMileage,
          field: "mileage" as const,
          placeholder: "Mileage",
          type: "number",
        }].map(({ label, value, setValue, field, placeholder, type }) => (
          <Holds className="w-full px-2" key={field}>
            <Labels size={"p4"}>{label}<span className="text-red-500">*</span></Labels>
            <Holds
              position={"row"}
              className="gap-2 h-10 border-[3px] rounded-[10px] border-black"
            >
              <Inputs
                type={type}
                value={value || ""}
                onChange={(e) => setValue(e.target.value)}
                placeholder={placeholder}
                className="h-full w-5/6 border-2 border-none focus:outline-none my-auto"
              />
              {isFieldChanged(field) && (
                <Buttons
                  background={"none"}
                  type="button"
                  className="w-1/6"
                  title="Revert changes"
                  onClick={() => revertField(field)}
                >
                  <Holds>
                    <Images
                      titleImg={"/turnBack.svg"}
                      titleImgAlt={"revert"}
                      size={"70"}
                    />
                  </Holds>
                </Buttons>
              )}
            </Holds>
          </Holds>
        ))}
      </Grids>
    </Holds>
  );
}
