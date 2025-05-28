"use client";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import React, { useEffect, useState } from "react";
import { Selects } from "@/components/(reusable)/selects";
import EquipmentSideBar from "./component/sidebar/EquipmentSideBar";
import EquipmentMainContent from "./component/sidebar/EquipmentMainContent";
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

const Asset = [
  { value: "Equipment", name: "Equipment" },
  { value: "Jobsite", name: "Jobsite" },
  { value: "CostCode", name: "Cost Codes" },
  { value: "Tags", name: "Tags" },
];

export default function Assets() {
  const [assets, setAssets] = useState("Equipment");
  const [isRegistrationFormOpen, setIsRegistrationFormOpen] = useState(false);
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [selectEquipment, setSelectEquipment] = useState<Equipment | null>(
    null
  );

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const equipmentsData = await fetch(
          "/api/getAllEquipment?filter=all" // Corrected path
        ).then((res) => res.json());

        setEquipments(equipmentsData);
      } catch (error) {
        console.error(`Failed to fetch equipment data:`, error);
      }
    };

    fetchEquipments();
  }, []);

  return (
    <Holds background={"white"} className="h-full w-full rounded-[10px]">
      <Holds background={"adminBlue"} className="h-full w-full rounded-[10px]">
        <Grids
          cols={"10"}
          gap={"5"}
          className="w-full h-full p-3 rounded-[10px]"
        >
          <Holds className="w-full h-full col-start-1 col-end-3">
            <Grids className="w-full h-full grid-rows-[40px_40px_40px_1fr] gap-4">
              <Selects
                onChange={(e) => setAssets(e.target.value)}
                value={assets}
                className="w-full h-full text-center text-sm border-none outline outline-[3px] outline-black outline-offset-0"
              >
                {Asset.map((asset) => (
                  <option key={asset.value} value={asset.value}>
                    {asset.name}
                  </option>
                ))}
              </Selects>
              {assets === "Equipment" && (
                <EquipmentSideBar
                  setAssets={setAssets}
                  assets={assets}
                  equipments={equipments}
                  selectEquipment={selectEquipment}
                  setSelectEquipment={setSelectEquipment}
                  isRegistrationFormOpen={isRegistrationFormOpen}
                  setIsRegistrationFormOpen={setIsRegistrationFormOpen}
                />
              )}
            </Grids>
          </Holds>
          {assets === "Equipment" ? (
            <EquipmentMainContent
              assets={assets}
              selectEquipment={selectEquipment}
              isRegistrationFormOpen={isRegistrationFormOpen}
              setIsRegistrationFormOpen={setIsRegistrationFormOpen}
              setSelectEquipment={setSelectEquipment}
            />
          ) : assets === "Jobsite" ? (
            <></>
          ) : assets === "CostCode" ? (
            <></>
          ) : assets === "Tags" ? (
            <></>
          ) : null}
        </Grids>
      </Holds>
    </Holds>
  );
}
