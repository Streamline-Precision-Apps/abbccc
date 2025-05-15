"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { TruckingEquipmentHaulLog, TruckingEquipmentHaulLogData } from "@/lib/types";
import { useEffect, useState, useCallback } from "react";
import { NModals } from "@/components/(reusable)/newmodals";
import { JobsiteSelector } from "@/components/(clock)/(General)/jobsiteSelector";
import { EquipmentSelector } from "@/components/(clock)/(General)/equipmentSelector";

type TimeCardTruckingHaulLogsProps = {
  edit: boolean;
  manager: string;
  truckingEquipmentHaulLogs: TruckingEquipmentHaulLogData;
  onDataChange: (data: TruckingEquipmentHaulLog[]) => void;
};

export default function TimeCardTruckingHaulLogs({
  edit,
  manager,
  truckingEquipmentHaulLogs,
  onDataChange,
}: TimeCardTruckingHaulLogsProps) {
  // Extract all TruckingLogs with their EquipmentHauled items
  const allTruckingLogs = truckingEquipmentHaulLogs
    .flatMap((item) => item.TruckingLogs)
    .filter((log) => log?.id && log.EquipmentHauled?.length > 0);

  const [editedTruckingHaulLogs, setEditedTruckingHaulLogs] =
    useState<TruckingEquipmentHaulLog[]>(allTruckingLogs);
  const [pendingChanges, setPendingChanges] = useState<Record<string, TruckingEquipmentHaulLog>>({});
  const [jobsiteModalOpen, setJobsiteModalOpen] = useState(false);
  const [equipmentModalOpen, setEquipmentModalOpen] = useState(false);
  const [currentEditingLog, setCurrentEditingLog] = useState<{logId: string, equipmentIndex: number} | null>(null);

  // Reset when edit mode is turned off or when new data comes in
  useEffect(() => {
    if (!edit) {
      setEditedTruckingHaulLogs(allTruckingLogs);
      setPendingChanges({});
    }
  }, [edit, truckingEquipmentHaulLogs]);

  const handleHaulLogChange = useCallback(
  (logId: string, equipmentIndex: number, field: keyof TruckingEquipmentHaulLog['EquipmentHauled'][0], value: string) => {
    setEditedTruckingHaulLogs(prevLogs => 
      prevLogs.map(log => {
        if (log.id === logId) {
          const updatedEquipment = [...log.EquipmentHauled];
          updatedEquipment[equipmentIndex] = {
            ...updatedEquipment[equipmentIndex],
            [field]: value
          };
          
          return {
            ...log,
            EquipmentHauled: updatedEquipment
          };
        }
        return log;
      })
    );

    // Update pending changes - use a Map to prevent duplicates
    setPendingChanges(prev => {
      const newChanges = new Map(Object.entries(prev));
      const logKey = logId;
      
      if (!newChanges.has(logKey)) {
        newChanges.set(logKey, {
          id: logId,
          Equipment: allTruckingLogs.find(l => l.id === logId)!.Equipment,
          EquipmentHauled: [...allTruckingLogs.find(l => l.id === logId)!.EquipmentHauled]
        });
      }
      
      const logEntry = newChanges.get(logKey)!;
      logEntry.EquipmentHauled[equipmentIndex] = {
        ...logEntry.EquipmentHauled[equipmentIndex],
        [field]: value
      };
      
      return Object.fromEntries(newChanges);
    });
  },
  [allTruckingLogs]
);

  const handleJobsiteChange = useCallback(
    (logId: string, equipmentIndex: number, jobsiteId: string, jobsiteName: string) => {
      handleHaulLogChange(logId, equipmentIndex, 'JobSite', jobsiteId);
      
      // Update the jobsite name in the local state for display
      setEditedTruckingHaulLogs(prevLogs => 
        prevLogs.map(log => {
          if (log.id === logId) {
            const updatedEquipment = [...log.EquipmentHauled];
            updatedEquipment[equipmentIndex] = {
              ...updatedEquipment[equipmentIndex],
              JobSite: {
                ...updatedEquipment[equipmentIndex].JobSite,
                name: jobsiteName
              }
            };
            
            return {
              ...log,
              EquipmentHauled: updatedEquipment
            };
          }
          return log;
        })
      );
    },
    [handleHaulLogChange]
  );

  const handleEquipmentChange = useCallback(
    (logId: string, equipmentIndex: number, equipmentId: string, equipmentName: string) => {
      handleHaulLogChange(logId, equipmentIndex, 'Equipment', equipmentId);
      
      // Update the equipment name in the local state for display
      setEditedTruckingHaulLogs(prevLogs => 
        prevLogs.map(log => {
          if (log.id === logId) {
            const updatedEquipment = [...log.EquipmentHauled];
            updatedEquipment[equipmentIndex] = {
              ...updatedEquipment[equipmentIndex],
              Equipment: {
                ...updatedEquipment[equipmentIndex].Equipment,
                name: equipmentName
              }
            };
            
            return {
              ...log,
              EquipmentHauled: updatedEquipment
            };
          }
          return log;
        })
      );
    },
    [handleHaulLogChange]
  );

  // Notify parent of all changes when pendingChanges updates
useEffect(() => {
  console.log('Pending changes:', pendingChanges);
  if (Object.keys(pendingChanges).length > 0) {
    const changesArray = Object.values(pendingChanges);
    console.log('Sending to parent:', changesArray);
    onDataChange(changesArray);
  }
}, [pendingChanges, onDataChange]);

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

  const handleJobsiteSelect = (jobsite: { code: string; label: string } | null) => {
    if (currentEditingLog && jobsite) {
      handleJobsiteChange(
        currentEditingLog.logId, 
        currentEditingLog.equipmentIndex, 
        jobsite.code, 
        jobsite.label
      );
    }
    setJobsiteModalOpen(false);
  };

  const handleEquipmentSelect = (equipment: { code: string; label: string } | null) => {
    if (currentEditingLog && equipment) {
      handleEquipmentChange(
        currentEditingLog.logId,
        currentEditingLog.equipmentIndex,
        equipment.code,
        equipment.label
      );
    }
    setEquipmentModalOpen(false);
  };

  const isEmptyData = editedTruckingHaulLogs.length === 0;

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

              {editedTruckingHaulLogs.map((log) =>
                log.EquipmentHauled.map((hauledItem, index) => (
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
                            value={log.Equipment?.name || ""}
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
            onJobsiteSelect={handleJobsiteSelect}
            initialValue={
              currentEditingLog
                ? {
                    code: editedTruckingHaulLogs
                      .find(log => log.id === currentEditingLog.logId)
                      ?.EquipmentHauled[currentEditingLog.equipmentIndex]?.JobSite?.id || "",
                    label: editedTruckingHaulLogs
                      .find(log => log.id === currentEditingLog.logId)
                      ?.EquipmentHauled[currentEditingLog.equipmentIndex]?.JobSite?.name || ""
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
                    code: editedTruckingHaulLogs
                      .find(log => log.id === currentEditingLog.logId)
                      ?.EquipmentHauled[currentEditingLog.equipmentIndex]?.Equipment?.id || "",
                    label: editedTruckingHaulLogs
                      .find(log => log.id === currentEditingLog.logId)
                      ?.EquipmentHauled[currentEditingLog.equipmentIndex]?.Equipment?.name || ""
                  }
                : undefined
            }
          />
        </Holds>
      </NModals>
    </Holds>
  );
}