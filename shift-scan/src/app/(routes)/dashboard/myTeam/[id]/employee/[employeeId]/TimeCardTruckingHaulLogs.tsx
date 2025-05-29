"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import {
  TruckingEquipmentHaulLog,
  TruckingEquipmentHaulLogData,
  EquipmentHauledItem,
} from "@/lib/types";
import { useState } from "react";
import { NModals } from "@/components/(reusable)/newmodals";
import { JobsiteSelector } from "@/components/(clock)/(General)/jobsiteSelector";
import { EquipmentSelector } from "@/components/(clock)/(General)/equipmentSelector";
import { useTranslations } from "next-intl";

type TimeCardTruckingHaulLogsProps = {
  edit: boolean;
  manager: string;
  truckingEquipmentHaulLogs: TruckingEquipmentHaulLogData;
  onDataChange: (data: TruckingEquipmentHaulLogData) => void; // FIX: expects nested structure
};

export default function TimeCardTruckingHaulLogs({
  edit,
  manager,
  truckingEquipmentHaulLogs,
  onDataChange,
}: TimeCardTruckingHaulLogsProps) {
  const t = useTranslations("MyTeam.TimeCardTruckingHaulLogs");

  // Handler to update the TruckingEquipmentHaulLogData structure
  const handleHaulLogChange = (
    itemIndex: number,
    logId: string,
    field: keyof TruckingEquipmentHaulLog,
    value: any
  ) => {
    const updated = truckingEquipmentHaulLogs.map((item, idx) => {
      if (idx === itemIndex) {
        return {
          ...item,
          TruckingLogs: item.TruckingLogs.map((log) => {
            if (log && log.id === logId) {
              // Only update fields that exist on TruckingEquipmentHaulLog
              if (field in log) {
                return { ...log, [field]: value };
              }
            }
            return log;
          }),
        };
      }
      return item;
    });
    onDataChange(updated);
  };

  // When updating a job site or equipment, update the correct EquipmentHauled item inside the EquipmentHauled array of the TruckingEquipmentHaulLog.
  // Do not use 'JobSite' as a field for handleHaulLogChange. Instead, write a handler like:
  const handleEquipmentHauledChange = (
    itemIdx: number,
    logIdx: number,
    hauledIdx: number,
    field: keyof EquipmentHauledItem,
    value: any
  ) => {
    const updated = truckingEquipmentHaulLogs.map((item, i) => {
      if (i !== itemIdx) return item;
      return {
        ...item,
        TruckingLogs: item.TruckingLogs.map((log, j) => {
          if (!log || j !== logIdx) return log;
          return {
            ...log,
            EquipmentHauled: log.EquipmentHauled.map((hauled, k) => {
              if (k !== hauledIdx) return hauled;
              return {
                ...hauled,
                [field]: value,
              };
            }),
          };
        }),
      };
    });
    onDataChange(updated);
  };

  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [jobsiteModalOpen, setJobsiteModalOpen] = useState(false);
  const [currentEditingLog, setCurrentEditingLog] = useState<{
    itemIdx: number;
    logIdx: number;
    hauledIdx: number;
  } | null>(null);
  const [tempEquipment, setTempEquipment] = useState<{
    code: string;
    label: string;
  } | null>(null);

  const openJobsiteModal = (
    itemIdx: number,
    logIdx: number,
    hauledIdx: number = 0
  ) => {
    if (!edit) return;
    setCurrentEditingLog({ itemIdx, logIdx, hauledIdx });
    setJobsiteModalOpen(true);
  };

  const openEquipmentModal = (
    itemIdx: number,
    logIdx: number,
    hauledIdx: number = 0
  ) => {
    if (!edit) return;
    setCurrentEditingLog({ itemIdx, logIdx, hauledIdx });
    setEquipmentModalOpen(true);
  };

  const handleJobsiteSelect = (
    jobsite: { code: string; label: string } | null
  ) => {
    if (currentEditingLog && jobsite) {
      handleEquipmentHauledChange(
        currentEditingLog.itemIdx,
        currentEditingLog.logIdx,
        currentEditingLog.hauledIdx,
        "JobSite",
        {
          id: jobsite.code,
          name: jobsite.label,
        }
      );
    }
    setJobsiteModalOpen(false);
  };

  const handleEquipmentSelect = (
    equipment: { code: string; label: string } | null
  ) => {
    if (currentEditingLog && equipment) {
      handleEquipmentHauledChange(
        currentEditingLog.itemIdx,
        currentEditingLog.logIdx,
        currentEditingLog.hauledIdx,
        "Equipment",
        {
          id: equipment.code,
          name: equipment.label,
        }
      );
    }
  };

  const handleConfirmEquipment = () => {
    if (currentEditingLog && tempEquipment) {
      handleEquipmentHauledChange(
        currentEditingLog.itemIdx,
        currentEditingLog.logIdx,
        currentEditingLog.hauledIdx,
        "Equipment",
        {
          id: tempEquipment.code,
          name: tempEquipment.label,
        }
      );
    }
    setEquipmentModalOpen(false);
    setTempEquipment(null);
  };

  const isEmptyData = truckingEquipmentHaulLogs.length === 0;

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {!isEmptyData ? (
            <>
              <Grids cols={"3"} className="w-full h-fit">
                <Holds className="col-start-1 col-end-2 w-full h-full pl-1">
                  <Titles position={"left"} size={"h6"}>
                    {t("Truck")}
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    {t("HauledEQ")}
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    {t("JobSite")}
                  </Titles>
                </Holds>
              </Grids>

              {truckingEquipmentHaulLogs.map((item, itemIdx) =>
                item.TruckingLogs.map((log, logIdx) => {
                  if (!log) return null;

                  return (
                    <Holds
                      key={`${log.id}-${logIdx}`}
                      className="border-black border-[3px] rounded-lg bg-white mb-2"
                    >
                      <Buttons
                        shadow={"none"}
                        background={"none"}
                        className="w-full h-full text-left"
                      >
                        <Grids cols={"3"} className="w-full h-full">
                          <Holds className="col-start-1 col-end-2">
                            <Inputs
                              type={"text"}
                              value={log.Equipment?.name || ""}
                              className="text-xs border-none rounded-md h-full rounded-br-none rounded-tr-none p-3 text-left"
                              disabled={true}
                              readOnly
                            />
                          </Holds>
                          <Holds className="col-start-2 col-end-3 border-x-[3px] border-black h-full">
                            <Inputs
                              type={"text"}
                              value={
                                log.EquipmentHauled?.[0]?.Equipment?.name || ""
                              }
                              className="text-xs border-none h-full rounded-none justify-center text-center"
                              onClick={() =>
                                openEquipmentModal(itemIdx, logIdx, 0)
                              }
                              disabled={!edit}
                              readOnly
                            />
                          </Holds>
                          <Holds className="col-start-3 col-end-4 h-full">
                            <Inputs
                              type={"text"}
                              value={
                                log.EquipmentHauled?.[0]?.JobSite?.name || ""
                              }
                              className="text-xs border-none rounded-md h-full rounded-bl-none rounded-t-none justify-center text-right"
                              onClick={() =>
                                openJobsiteModal(itemIdx, logIdx, 0)
                              }
                              disabled={!edit}
                              readOnly
                            />
                          </Holds>
                        </Grids>
                      </Buttons>
                    </Holds>
                  );
                })
              )}
            </>
          ) : (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                {t("NoHaulLogsAvailable")}
              </Texts>
            </Holds>
          )}
        </Holds>
      </Grids>

      {/* Jobsite Selector Modal */}
      <NModals
        background={"white"}
        size={"xlW"}
        isOpen={jobsiteModalOpen}
        handleClose={() => setJobsiteModalOpen(false)}
      >
        <Holds background={"white"} className="w-full h-full p-2">
          <JobsiteSelector
            useJobSiteId={true}
            onJobsiteSelect={handleJobsiteSelect}
            initialValue={
              currentEditingLog
                ? {
                    code:
                      truckingEquipmentHaulLogs[currentEditingLog.itemIdx]
                        .TruckingLogs[currentEditingLog.logIdx]
                        .EquipmentHauled?.[0]?.JobSite?.id || "",
                    label:
                      truckingEquipmentHaulLogs[currentEditingLog.itemIdx]
                        .TruckingLogs[currentEditingLog.logIdx]
                        .EquipmentHauled?.[0]?.JobSite?.name || "",
                  }
                : undefined
            }
          />
        </Holds>
      </NModals>

      {/* Equipment Selector Modal */}
      <NModals
        background={"white"}
        size={"xlW"}
        isOpen={equipmentModalOpen}
        handleClose={() => setEquipmentModalOpen(false)}
      >
        <Holds background={"white"} className="w-full h-full p-2">
          <Grids rows={"8"} className="w-full h-full">
            <Holds
              position={"row"}
              className={"row-start-1 row-end-8 h-full gap-1"}
            >
              <EquipmentSelector
                onEquipmentSelect={setTempEquipment}
                initialValue={
                  tempEquipment ||
                  (currentEditingLog
                    ? {
                        code:
                          truckingEquipmentHaulLogs[currentEditingLog.itemIdx]
                            .TruckingLogs[currentEditingLog.logIdx].Equipment &&
                          (
                            truckingEquipmentHaulLogs[currentEditingLog.itemIdx]
                              .TruckingLogs[currentEditingLog.logIdx]
                              .Equipment as {
                              id?: string;
                            }
                          ).id
                            ? (
                                truckingEquipmentHaulLogs[
                                  currentEditingLog.itemIdx
                                ].TruckingLogs[currentEditingLog.logIdx]
                                  .Equipment as { id?: string }
                              ).id ?? ""
                            : "",
                        label:
                          truckingEquipmentHaulLogs[currentEditingLog.itemIdx]
                            .TruckingLogs[currentEditingLog.logIdx].Equipment
                            ?.name || "",
                      }
                    : undefined)
                }
              />
            </Holds>
            <Holds
              position={"row"}
              className={"row-start-8 row-end-9 h-full gap-1"}
            >
              <Buttons
                background={"green"}
                className="w-full mt-4"
                onClick={handleConfirmEquipment}
                disabled={!tempEquipment}
              >
                {t("Confirm")}
              </Buttons>
            </Holds>
          </Grids>
        </Holds>
      </NModals>
    </Holds>
  );
}
