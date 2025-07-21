"use client";
import {
  deleteEquipmentHauled,
  updateEquipmentLogsEquipment,
  updateEquipmentLogsLocation,
} from "@/actions/truckingActions";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { Texts } from "@/components/(reusable)/texts";
import { NModals } from "@/components/(reusable)/newmodals";
import { EquipmentSelector } from "@/components/(clock)/(General)/equipmentSelector";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Titles } from "@/components/(reusable)/titles";
import { JobsiteSelector } from "@/components/(clock)/(General)/jobsiteSelector";
import Spinner from "@/components/(animations)/spinner";

type EquipmentHauled = {
  id: string;
  truckingLogId: string;
  equipmentId: string | null;
  createdAt: Date;
  jobSiteId: string | null;
  Equipment: {
    id: string;
    name: string;
  } | null;
  JobSite: {
    id: string;
    name: string;
  } | null;
  startingMileage: number | null;
  endMileage: number | null;
};

type Option = {
  id: string;
  label: string;
  code: string;
};

export default function EquipmentList({
  equipmentHauled,
  setEquipmentHauled,
  truckingLog,
}: {
  equipmentHauled: EquipmentHauled[];
  setEquipmentHauled: Dispatch<SetStateAction<EquipmentHauled[] | undefined>>;
  truckingLog: string;
}) {
  const t = useTranslations("TruckingAssistant");
  const [isEquipmentOpen, setIsEquipmentOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Option>({
    id: "",
    label: "",
    code: "",
  });

  const [locationLoading, setLocationLoading] = useState(false);

  // Equipment update

  //--------------------------------------------------------------------------
  const handleUpdateEquipment = async (equipment: Option | null) => {
    if (!selectedIndex || !equipment) return;
    setEquipmentLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", selectedIndex);
      formData.append("truckingLogId", truckingLog);
      formData.append("equipmentId", equipment.code); // This is actually the equipment QR ID, not the internal ID
      formData.append("equipmentName", equipment.label); // equipment Name

      await updateEquipmentLogsEquipment(formData);

      // Update local state
      setEquipmentHauled((prev) =>
        prev
          ? prev.map((item) =>
              item.id === selectedIndex
                ? {
                    ...item,
                    equipmentId: equipment.code,
                    Equipment: {
                      ...item.Equipment,
                      id: equipment.code,
                      name: equipment.label,
                    },
                  }
                : item
            )
          : []
      );

      setIsEquipmentOpen(false);
      setSelectedIndex(null);
      setSelectedEquipment({ id: "", label: "", code: "" });
    } catch (error) {
      console.error(t("ErrorSubmittingData"), error);
    } finally {
      setEquipmentLoading(false);
    }
  };

  //--------------------------------------------------------------------------
  // Location update
  const handleUpdateLocation = async (location: Option | null) => {
    if (!selectedIndex || !location) return;

    setLocationLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", selectedIndex);
      formData.append("truckingLogId", truckingLog);
      formData.append("jobSiteId", location.code); // equipment Id
      formData.append("jobSiteName", location.label); // equipment Name

      await updateEquipmentLogsLocation(formData);

      // Update local state
      setEquipmentHauled((prev) =>
        prev
          ? prev.map((item) =>
              item.id === selectedIndex
                ? {
                    ...item,
                    jobSiteId: location.code,
                    JobSite: {
                      ...item.JobSite,
                      id: location.code,
                      name: location.label,
                    },
                  }
                : item
            )
          : []
      );

      setIsEquipmentOpen(false);
      setSelectedIndex(null);
      setSelectedEquipment({ id: "", label: "", code: "" });
    } catch (error) {
      console.error(t("ErrorSubmittingData"), error);
    } finally {
      setLocationLoading(false);
    }
  };
  //--------------------------------------------------------------------------

  const handleDelete = async (id: string) => {
    try {
      await deleteEquipmentHauled(id);
      setEquipmentHauled(
        (prevLogs) => prevLogs?.filter((log) => log.id !== id) ?? []
      );
    } catch (error) {
      console.error("Error deleting equipment log:", error);
    }
  };

  return (
    <>
      <Contents className="overflow-y-auto no-scrollbar">
        {equipmentHauled.length === 0 && (
          <Holds className="px-10 mt-4">
            <Texts size={"p5"} text={"gray"} className="italic">
              No Equipment Hauled Recorded
            </Texts>
            <Texts size={"p7"} text={"gray"}>
              {`(Tap the plus icon to add a log.)`}
            </Texts>
          </Holds>
        )}
        {equipmentHauled.map((mat: EquipmentHauled) => (
          <Holds key={mat.id}>
            <SlidingDiv key={mat.id} onSwipeLeft={() => handleDelete(mat.id)}>
              <Holds
                key={mat.id}
                background={"white"}
                className={`w-full h-full gap-4`}
              >
                <Holds
                  background={"white"}
                  className="w-full h-full justify-center"
                >
                  {equipmentLoading && selectedIndex === mat.id ? (
                    <Spinner size={20} />
                  ) : (
                    <Inputs
                      type="text"
                      placeholder="Equipment"
                      value={mat.Equipment?.name || ""}
                      onClick={() => {
                        setSelectedEquipment({
                          id: mat.Equipment?.id || "",
                          label: mat.Equipment?.name || "",
                          code: mat.Equipment?.id || "",
                        });

                        setIsEquipmentOpen(true);
                        setSelectedIndex(mat.id);
                      }}
                      className={`text-xs cursor-pointer py-2 ${
                        mat.equipmentId === null && "placeholder:text-app-red"
                      }`}
                      readOnly
                    />
                  )}
                </Holds>

                <Holds
                  background={"white"}
                  className={`w-full h-full justify-center `}
                >
                  {locationLoading && selectedIndex === mat.id ? (
                    <Spinner size={20} />
                  ) : (
                    <Inputs
                      type="text"
                      placeholder="Location"
                      value={mat.JobSite?.name || ""}
                      onClick={() => {
                        setSelectedLocation({
                          id: mat.JobSite?.id || "",
                          label: mat.JobSite?.name || "",
                          code: mat.JobSite?.id || "",
                        });
                        setIsLocationOpen(true);
                        setSelectedIndex(mat.id);
                      }}
                      className={`text-xs  cursor-pointer py-2 ${
                        mat.jobSiteId === null && "placeholder:text-app-red"
                      }`}
                      readOnly
                    />
                  )}
                </Holds>

                {/* Starting Mileage and Ending Mileage Inputs */}
                <Holds>
                  <Inputs
                    type="number"
                    placeholder="Starting Mileage"
                    value={mat.startingMileage ?? ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? null : Number(e.target.value);
                      setEquipmentHauled((prev) =>
                        prev
                          ? prev.map((item) =>
                              item.id === mat.id
                                ? { ...item, startingMileage: value }
                                : item
                            )
                          : []
                      );
                    }}
                    className="text-xs py-2"
                  />
                </Holds>
                <Holds>
                  <Inputs
                    type="number"
                    placeholder="Ending Mileage"
                    value={mat.endMileage ?? ""}
                    onChange={(e) => {
                      const value =
                        e.target.value === "" ? null : Number(e.target.value);
                      setEquipmentHauled((prev) =>
                        prev
                          ? prev.map((item) =>
                              item.id === mat.id
                                ? { ...item, endMileage: value }
                                : item
                            )
                          : []
                      );
                    }}
                    className="text-xs py-2"
                  />
                </Holds>
              </Holds>
            </SlidingDiv>
          </Holds>
        ))}

        <NModals
          size={"xlW"}
          background={"noOpacity"}
          isOpen={isEquipmentOpen}
          handleClose={() => setIsEquipmentOpen(false)}
        >
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-7">
              <EquipmentSelector
                onEquipmentSelect={(equipment) => {
                  if (equipment) {
                    setSelectedEquipment(equipment); // Update the equipment state with the full Option object
                  } else {
                    setSelectedEquipment({ id: "", code: "", label: "" }); // Reset if null
                  }
                }}
                initialValue={selectedEquipment}
              />
            </Holds>
            <Holds
              position={"row"}
              className="h-full w-full row-start-7 row-end-8 gap-x-3"
            >
              <Holds>
                <Buttons
                  background={"green"}
                  shadow={"none"}
                  onClick={() => {
                    handleUpdateEquipment(selectedEquipment);
                    setIsEquipmentOpen(false);
                  }}
                  className="py-3"
                >
                  <Titles size={"h3"}>Select </Titles>
                </Buttons>
              </Holds>
              <Holds>
                <Buttons
                  background={"red"}
                  shadow={"none"}
                  onClick={() => {
                    setSelectedEquipment({ id: "", code: "", label: "" });
                    setIsEquipmentOpen(false);
                  }}
                  className="py-3"
                >
                  <Titles size={"h3"}>Cancel</Titles>
                </Buttons>
              </Holds>
            </Holds>
          </Grids>
        </NModals>

        <NModals
          size={"xlW"}
          background={"noOpacity"}
          isOpen={isLocationOpen}
          handleClose={() => setIsLocationOpen(false)}
        >
          <Grids rows={"7"} gap={"5"} className="h-full w-full">
            <Holds className="h-full w-full row-start-1 row-end-7">
              <JobsiteSelector
                onJobsiteSelect={(jobSite) => {
                  if (jobSite) {
                    setSelectedLocation(jobSite); // Update the equipment state with the full Option object
                  } else {
                    setSelectedLocation({ id: "", code: "", label: "" }); // Reset if null
                  }
                }}
                initialValue={selectedLocation}
              />
            </Holds>
            <Holds
              position={"row"}
              className="h-full w-full row-start-7 row-end-8 gap-x-3"
            >
              <Holds>
                <Buttons
                  background={"green"}
                  shadow={"none"}
                  onClick={() => {
                    handleUpdateLocation(selectedLocation);
                    setIsLocationOpen(false);
                  }}
                  className="py-3"
                >
                  <Titles size={"h3"}>Select</Titles>
                </Buttons>
              </Holds>
              <Holds>
                <Buttons
                  background={"red"}
                  shadow={"none"}
                  onClick={() => {
                    setSelectedLocation({ id: "", code: "", label: "" });
                    setIsLocationOpen(false);
                  }}
                  className="py-3"
                >
                  <Titles size={"h3"}>Cancel</Titles>
                </Buttons>
              </Holds>
            </Holds>
          </Grids>
        </NModals>
      </Contents>
    </>
  );
}
