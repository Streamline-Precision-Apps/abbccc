import { Forms } from "@/components/(reusable)/forms";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Select } from "@nextui-org/react";
import { set } from "date-fns";
import { useState } from "react";
type Equipment = {
  id: string;
  qrId: string;
  name: string;
  description?: string;
  equipmentTag: string;
  status?: string;
  isActive: boolean;
  inUse: boolean;
  overWeight: boolean;
  currentWeight: number;
  equipmentVehicleInfo?: {
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: Date | null;
    mileage: number | null;
  };
};
export default function EquipmentMainContent({
  assets,
  selectEquipment,
  isRegistrationFormOpen,
  setIsRegistrationFormOpen,
  setSelectEquipment,
}: {
  assets: string;
  selectEquipment: Equipment | null;
  isRegistrationFormOpen: boolean;
  setIsRegistrationFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectEquipment: React.Dispatch<React.SetStateAction<Equipment | null>>;
}) {
  return (
    <>
      {!selectEquipment && isRegistrationFormOpen === false ? (
        <Holds className="w-full h-full col-span-8">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <Holds
              background={"white"}
              position={"row"}
              className="w-full h-full rounded-[10px] justify-between px-4 "
            >
              <Texts
                position={"left"}
                size={"sm"}
                text={"link"}
                className="cursor-pointer"
                onClick={() => setIsRegistrationFormOpen(true)}
              >
                Register New Equipment
              </Texts>
            </Holds>
          </Grids>
        </Holds>
      ) : selectEquipment && isRegistrationFormOpen === false ? (
        <Holds className="w-full h-full col-span-4">
          <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
            <Holds
              background={"white"}
              position={"row"}
              className="w-full h-full rounded-[10px] justify-between px-4 "
            >
              <Holds className="w-full h-full flex justify-center">
                <Texts
                  position={"left"}
                  size={"sm"}
                  text={"link"}
                  className="cursor-pointer"
                  onClick={() => {
                    setIsRegistrationFormOpen(true);
                    setSelectEquipment(null);
                  }}
                >
                  Register New Equipment
                </Texts>
              </Holds>
              <Holds
                position={"row"}
                className="h-full flex items-center justify-between"
              >
                <Texts size={"sm"} text={"link"} className="cursor-pointer">
                  Discard All Changes
                </Texts>
                <Texts size={"sm"} text={"link"} className="cursor-pointer">
                  Save changes
                </Texts>
              </Holds>
            </Holds>

            <Holds
              background={"white"}
              className="w-full h-full rounded-[10px] p-3 px-5"
            >
              <Grids className="w-full h-full grid-rows-[50px_1fr]">
                <Holds position={"row"} className="w-full h-full ">
                  <Titles position={"left"} size={"xl"} className="font-bold">
                    {selectEquipment.name}
                  </Titles>
                  {/*Todo: add qr code here */}
                </Holds>
                <Holds className="w-full h-full">
                  <Grids className="w-full h-full grid-cols-[1fr_1fr] gap-4">
                    <Holds className="w-full h-full">
                      <label htmlFor="EquipmentName" className="text-sm">
                        Equipment Name
                      </label>
                      <Inputs
                        type="text"
                        name="EquipmentName"
                        value={selectEquipment.name}
                      />
                      <label htmlFor="EquipmentCode" className="text-sm">
                        Equipment Code
                      </label>
                      <Inputs
                        type="text"
                        name="EquipmentCode"
                        value={selectEquipment.qrId}
                        disabled
                      />
                      <label htmlFor="EquipmentStatus" className="text-sm">
                        Equipment Status
                      </label>
                      <Selects
                        name="EquipmentCode"
                        value={selectEquipment.status}
                      >
                        <option value="OPERATIONAL">Operational</option>
                        <option value="NEEDS_REPAIR">Needs Repair</option>
                        <option value=" NEEDS_MAINTENANCE">
                          Needs Maintenance
                        </option>
                      </Selects>
                      <label htmlFor="CurrentWeight" className="text-sm">
                        Current Weight
                      </label>
                      <Inputs
                        type="text"
                        name="EquipmentCode"
                        value={selectEquipment.currentWeight}
                        disabled
                      />
                      <label htmlFor="CurrentWeight" className="text-sm">
                        Overweight Equipment
                      </label>
                      <Selects
                        name="OverweightEquipment"
                        value={selectEquipment.overWeight ? "true" : "false"}
                        className="text-center"
                      >
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </Selects>
                      {selectEquipment.equipmentVehicleInfo && (
                        <>
                          <label htmlFor="VehicleMake" className="text-sm">
                            Vehicle Make
                          </label>
                          <Inputs
                            type="text"
                            name="VehicleMake"
                            value={
                              selectEquipment.equipmentVehicleInfo.make || ""
                            }
                          />
                          <label htmlFor="VehicleModel" className="text-sm">
                            Vehicle Model
                          </label>
                          <Inputs
                            type="text"
                            name="VehicleModel"
                            value={
                              selectEquipment.equipmentVehicleInfo.model || ""
                            }
                          />
                          <label htmlFor="VehicleYear" className="text-sm">
                            Vehicle Year
                          </label>
                          <Inputs
                            type="text" // Better than number for years
                            inputMode="numeric" // Shows numeric keyboard on mobile
                            pattern="[0-9]{4}" // HTML5 validation for exactly 4 digits
                            maxLength={4}
                            name="VehicleYear"
                            value={
                              selectEquipment.equipmentVehicleInfo?.year || ""
                            }
                            placeholder="YYYY"
                            onBlur={(e) => {
                              // Validate year range (example: 1900-currentYear+1)
                              const currentYear = new Date().getFullYear();
                              const yearNum = parseInt(e.target.value);

                              if (
                                e.target.value.length === 4 &&
                                (yearNum < 1900 || yearNum > currentYear + 1)
                              ) {
                                // Handle invalid year (show error, reset value, etc.)
                                console.warn(
                                  `Please enter a year between 1900-${
                                    currentYear + 1
                                  }`
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor="VehicleRegistration"
                            className="text-sm"
                          >
                            Registration Expiration
                          </label>
                          <Inputs
                            type="date"
                            name="VehicleModel"
                            value={
                              selectEquipment.equipmentVehicleInfo
                                .registrationExpiration
                                ? new Date(
                                    selectEquipment.equipmentVehicleInfo.registrationExpiration
                                  )
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                          />
                          <label htmlFor="VehicleMileage" className="text-sm">
                            Vehicle Mileage
                          </label>
                          <Inputs
                            type="text"
                            name="VehicleModel"
                            value={
                              selectEquipment.equipmentVehicleInfo.mileage || ""
                            }
                          />
                        </>
                      )}
                    </Holds>
                    <Holds className="w-full h-full">
                      <Grids className="w-full h-full grid-rows-[135px_1fr] gap-4">
                        <Holds className="w-full h-full">
                          <label htmlFor="VehicleMileage" className="text-base">
                            Equipment Description
                          </label>
                          <TextAreas
                            name="EquipmentDescription"
                            value={selectEquipment.description || ""}
                            className="w-full h-full text-sm"
                          />
                        </Holds>
                        <Holds className="w-full h-full">
                          <label htmlFor="EquipmentTag" className="text-base">
                            Safety Documents & Policies
                          </label>
                          <Holds className="w-full h-full border-[3px] border-black rounded-[10px]"></Holds>
                        </Holds>
                      </Grids>
                    </Holds>
                  </Grids>
                </Holds>
              </Grids>
            </Holds>
          </Grids>
        </Holds>
      ) : (
        !selectEquipment &&
        isRegistrationFormOpen === true && (
          <Holds className="w-full h-full col-span-4">
            <Grids className="w-full h-full grid-rows-[40px_1fr] gap-4">
              <Holds
                background={"white"}
                position={"row"}
                className="w-full h-full rounded-[10px] justify-between px-4 "
              >
                <Holds className="w-full h-full flex justify-center">
                  <Texts
                    position={"left"}
                    size={"sm"}
                    text={"link"}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsRegistrationFormOpen(false);
                    }}
                  >
                    Submit New Equipment
                  </Texts>
                </Holds>
                <Holds className="h-full flex justify-center ">
                  <Texts
                    position={"right"}
                    size={"sm"}
                    text={"link"}
                    className="cursor-pointer"
                    onClick={() => {
                      setIsRegistrationFormOpen(false);
                    }}
                  >
                    Cancel Registration
                  </Texts>
                </Holds>
              </Holds>

              <Holds
                background={"white"}
                className="w-full h-full rounded-[10px] p-3"
              >
                registration form goes here
              </Holds>
            </Grids>
          </Holds>
        )
      )}
    </>
  );
}
