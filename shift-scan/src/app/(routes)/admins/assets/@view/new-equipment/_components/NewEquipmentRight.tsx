"use client";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { useTranslations } from "next-intl";

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
};

export function NewEquipmentRight({
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
}: EquipmentRightProps) {
  const t = useTranslations("Admins");
  // Only display the input fields if equipmentTag is "VEHICLE" or "TRUCK"
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

  return (
    <Holds background={"white"} className="w-full h-full">
      <Grids cols={"2"} rows={"6"} className="w-full h-full gap-4 p-4">
        {/* Vehicle Make */}
        <Holds className="w-full row-span-4 col-span-2">
          <Holds
            position={"row"}
            className="w-full row-span-1 col-span-2 gap-2"
          >
            <Holds className="w-full">
              <Labels size={"p4"}>
                {t("VehicleMake")}
                <span className="text-red-500">*</span>
              </Labels>
              <Inputs
                type="text"
                value={vehicleMake || ""}
                onChange={(e) => setVehicleMake(e.target.value)}
                placeholder={t("Make")}
                pattern="[A-Za-z0-9\s]+"
                minLength={2}
              />
            </Holds>

            {/* Vehicle Model */}
            <Holds className="w-full">
              <Labels size={"p4"}>
                {t("VehicleModel")}
                <span className="text-red-500">*</span>
              </Labels>
              <Inputs
                type="text"
                value={vehicleModel || ""}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder={t("Model")}
                pattern="[A-Za-z0-9\s]+"
                minLength={3}
              />
            </Holds>
          </Holds>

          <Holds
            position={"row"}
            className="w-full row-span-1 col-span-2 gap-2"
          >
            {/* Vehicle Year */}
            <Holds className="w-full">
              <Labels size={"p4"}>
                {t("VehicleYear")}
                <span className="text-red-500">*</span>
              </Labels>
              <Inputs
                type="number"
                value={vehicleYear || ""}
                onChange={(e) => setVehicleYear(e.target.value)}
                placeholder={t("Year")}
                maxLength={4}
                minLength={4}
              />
            </Holds>

            {/* Vehicle License Plate */}
            <Holds className="w-full">
              <Labels size={"p4"}>
                {t("VehicleLicensePlate")}
                <span className="text-red-500">*</span>
              </Labels>
              <Inputs
                type="text"
                value={vehicleLicensePlate || ""}
                onChange={(e) => setVehicleLicensePlate(e.target.value)}
                placeholder={t("LicensePlate")}
                pattern="[A-Za-z0-9\s]+"
                minLength={3}
              />
            </Holds>
          </Holds>

          <Holds
            position={"row"}
            className="w-full row-span-1 col-span-2 gap-2"
          >
            {/* Registration Expiration */}
            <Holds className="w-full">
              <Labels size={"p4"}>
                {t("RegistrationExpiration")}
                <span className="text-red-500">*</span>
              </Labels>
              <Inputs
                type="date"
                value={registrationExpiration || ""}
                onChange={(e) => setRegistrationExpiration(e.target.value)}
                placeholder={"Expiration"}
              />
            </Holds>

            {/* Vehicle Mileage */}
            <Holds className="w-full">
              <Labels size={"p4"}>
                {t("VehicleMileage")}
                <span className="text-red-500">*</span>
              </Labels>
              <Inputs
                type="number"
                value={vehicleMileage || ""}
                onChange={(e) => setVehicleMileage(e.target.value)}
                placeholder={t("Mileage")}
              />
            </Holds>
          </Holds>
        </Holds>
      </Grids>
    </Holds>
  );
}
