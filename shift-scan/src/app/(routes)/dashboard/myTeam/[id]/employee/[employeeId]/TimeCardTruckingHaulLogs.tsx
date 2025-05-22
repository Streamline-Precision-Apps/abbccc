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
} from "@/lib/types";
import { useState } from "react";
import { NModals } from "@/components/(reusable)/newmodals";
import { JobsiteSelector } from "@/components/(clock)/(General)/jobsiteSelector";
import { EquipmentSelector } from "@/components/(clock)/(General)/equipmentSelector";

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
  // Use truckingEquipmentHaulLogs prop directly for rendering and updates

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

  const [jobsiteModalOpen, setJobsiteModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [currentEditingLog, setCurrentEditingLog] = useState<{
    logId: string;
    equipmentIndex: number;
  } | null>(null);

  const openJobsiteModal = (logId: string, equipmentIndex: number) => {
    if (!edit) return;
    setCurrentEditingLog({ logId, equipmentIndex });
    setJobsiteModalOpen(true);
  };

  const openEquipmentModal = (logId: string, equipmentIndex: number) => {
    if (!edit) return;
    setCurrentEditingLog({ logId, equipmentIndex });
    setEquipmentModalOpen(true);
  };

  const handleJobsiteSelect = (
    jobsite: { code: string; label: string } | null
  ) => {
    if (currentEditingLog && jobsite) {
      handleHaulLogChange(
        currentEditingLog.equipmentIndex,
        currentEditingLog.logId,
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
      handleHaulLogChange(
        currentEditingLog.equipmentIndex,
        currentEditingLog.logId,
        "Equipment",
        {
          id: equipment.code,
          name: equipment.label,
        }
      );
    }
    setEquipmentModalOpen(false);
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
                    Truck
                  </Titles>
                </Holds>
                <Holds className="col-start-2 col-end-3 w-full h-full pr-1">
                  <Titles position={"center"} size={"h6"}>
                    Hauled EQ
                  </Titles>
                </Holds>
                <Holds className="col-start-3 col-end-4 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Job Site
                  </Titles>
                </Holds>
              </Grids>

              {truckingEquipmentHaulLogs.map((log, truckingLogItemIndex) =>
                log.TruckingLogs.map((hauledItem, index) => (
                  <Holds
                    key={`${log.id}-${index}`}
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
                            value={log.Truck?.name || ""}
                            className="text-xs border-none rounded-md h-full rounded-br-none rounded-tr-none p-3 text-left"
                            disabled={true}
                            readOnly
                          />
                        </Holds>
                        <Holds className="col-start-2 col-end-3 border-x-[3px] border-black h-full">
                          <Inputs
                            type={"text"}
                            value={hauledItem.Equipment?.name || ""}
                            className="text-xs border-none h-full rounded-none justify-center text-center"
                            onClick={() => openEquipmentModal(log.id, index)}
                            disabled={!edit}
                            readOnly
                          />
                        </Holds>
                        <Holds className="col-start-3 col-end-4 h-full">
                          <Inputs
                            type={"text"}
                            value={hauledItem.JobSite?.name || ""}
                            className="text-xs border-none rounded-md h-full rounded-bl-none rounded-t-none justify-center text-right"
                            onClick={() => openJobsiteModal(log.id, index)}
                            disabled={!edit}
                            readOnly
                          />
                        </Holds>
                      </Grids>
                    </Buttons>
                  </Holds>
                ))
              )}
            </>
          ) : (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                No haul logs available
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
                      truckingEquipmentHaulLogs.find(
                        (log) => log.id === currentEditingLog.logId
                      )?.TruckingLogs[currentEditingLog.equipmentIndex]?.JobSite
                        ?.id || "",
                    label:
                      truckingEquipmentHaulLogs.find(
                        (log) => log.id === currentEditingLog.logId
                      )?.TruckingLogs[currentEditingLog.equipmentIndex]?.JobSite
                        ?.name || "",
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
          <EquipmentSelector
            onEquipmentSelect={handleEquipmentSelect}
            initialValue={
              currentEditingLog
                ? {
                    code:
                      truckingEquipmentHaulLogs.find(
                        (log) => log.id === currentEditingLog.logId
                      )?.TruckingLogs[currentEditingLog.equipmentIndex]
                        ?.Equipment?.id || "",
                    label:
                      truckingEquipmentHaulLogs.find(
                        (log) => log.id === currentEditingLog.logId
                      )?.TruckingLogs[currentEditingLog.equipmentIndex]
                        ?.Equipment?.name || "",
                  }
                : undefined
            }
          />
        </Holds>
      </NModals>
    </Holds>
  );
}
