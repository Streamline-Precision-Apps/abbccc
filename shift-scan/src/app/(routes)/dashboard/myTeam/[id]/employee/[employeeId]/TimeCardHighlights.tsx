"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Images } from "@/components/(reusable)/images";
import { Grids } from "@/components/(reusable)/grids";
import { TimesheetHighlights } from "@/lib/types";
import { useState, useEffect, useCallback } from "react";
import { Texts } from "@/components/(reusable)/texts";
import { Buttons } from "@/components/(reusable)/buttons";
import { format } from "date-fns";
import { Titles } from "@/components/(reusable)/titles";
import { NModals } from "@/components/(reusable)/newmodals";
import { useTranslations } from "next-intl";
import { JobsiteSelector } from "@/components/(clock)/(General)/jobsiteSelector";
import { CostCodeSelector } from "@/components/(clock)/(General)/costCodeSelector";


interface TimeCardHighlightsProps {
  highlightTimesheet: TimesheetHighlights[];
  edit: boolean;
  manager: string;
  onDataChange: (data: TimesheetHighlights[]) => void;
  date: string;
}

export default function TimeCardHighlights({
  highlightTimesheet,
  edit,
  manager,
  onDataChange,
  date,
}: TimeCardHighlightsProps) {
  const [editedHighlightTimesheet, setEditedHighlightTimesheet] =
    useState<TimesheetHighlights[]>(highlightTimesheet);
  const [jobsiteModalOpen, setJobsiteModalOpen] = useState(false);
  const [costCodeModalOpen, setCostCodeModalOpen] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const t = useTranslations("Clock");

  // Reset local state when props change
  useEffect(() => {
    setEditedHighlightTimesheet(highlightTimesheet);
  }, [highlightTimesheet]);

  const isEmptyData = !highlightTimesheet || highlightTimesheet.length === 0;

  const handleTimeChange = useCallback(
    (id: string, field: 'startTime' | 'endTime', timeString: string) => {
      const updated = editedHighlightTimesheet.map(item => {
        if (item.id === id) {
          // Use the component's date prop
          const newValue = timeString ? new Date(`${date}T${timeString}:00`) : null;
          return { ...item, [field]: newValue };
        }
        return item;
      });
      
      setEditedHighlightTimesheet(updated);
      onDataChange(updated);
    },
    [date, editedHighlightTimesheet, onDataChange]
  );

  const handleJobsiteChange = useCallback(
    (id: string, jobsiteId: string) => {
      const updatedData = editedHighlightTimesheet.map(item => {
        if (item.id === id) {
          return {
            ...item,
            jobsiteId,
          };
        }
        return item;
      });
      setEditedHighlightTimesheet(updatedData);
      onDataChange(updatedData);
    },
    [editedHighlightTimesheet, onDataChange]
  );

  const handleCostCodeChange = useCallback(
    (id: string, costcode: string) => {
      const updatedData = editedHighlightTimesheet.map(item => {
        if (item.id === id) {
          return {
            ...item,
            costcode,
          };
        }
        return item;
      });
      setEditedHighlightTimesheet(updatedData);
      onDataChange(updatedData);
    },
    [editedHighlightTimesheet, onDataChange]
  );

  const formatTimeForInput = useCallback(
    (date: Date | string | null | undefined): string => {
      if (!date) return "";

      try {
        const dateObj = date instanceof Date ? date : new Date(date);
        if (isNaN(dateObj.getTime())) return "";

        const hours = dateObj.getHours().toString().padStart(2, "0");
        const minutes = dateObj.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      } catch (error) {
        console.error("Error formatting time:", error);
        return "";
      }
    },
    []
  );

  const openJobsiteModal = (id: string) => {
    if (!edit) return;
    setCurrentEditingId(id);
    setJobsiteModalOpen(true);
  };

  const openCostCodeModal = (id: string) => {
    if (!edit) return;
    setCurrentEditingId(id);
    setCostCodeModalOpen(true);
  };

  const handleJobsiteSelect = (jobsite: { code: string; label: string } | null) => {
    if (currentEditingId && jobsite) {
      handleJobsiteChange(currentEditingId, jobsite.code);
    }
    setJobsiteModalOpen(false);
  };

  const handleCostCodeSelect = (costcode: { code: string; label: string } | null) => {
    if (currentEditingId && costcode) {
      handleCostCodeChange(currentEditingId, costcode.code);
    }
    setCostCodeModalOpen(false);
  };

  return (
    <Holds className="w-full h-full">
      <Grids rows={"7"}>
        <Holds className="row-start-1 row-end-7 overflow-y-scroll no-scrollbar h-full w-full">
          {isEmptyData ? (
            <Holds className="w-full h-full flex items-center justify-center">
              <Texts size="p6" className="text-gray-500 italic">
                No timesheet data available
              </Texts>
            </Holds>
          ) : (
            <>
              <Grids cols={"6"} className="w-full h-fit">
                <Holds className="col-start-2 col-end-4 w-full h-full pl-1">
                  <Titles position={"left"} size={"h6"}>
                    Start & End
                  </Titles>
                </Holds>
                <Holds className="col-start-4 col-end-7 w-full h-full pr-1">
                  <Titles position={"right"} size={"h6"}>
                    Jobsite & Cost Code
                  </Titles>
                </Holds>
              </Grids>

              {editedHighlightTimesheet.map((sheet) => (
                <Holds
                  key={sheet.id}
                  background={"white"}
                  className="border-black border-[3px] rounded-[10px] mb-3"
                >
                  <Buttons
                    shadow={"none"}
                    background={"none"}
                    className="w-full h-full text-left"
                  >
                    {sheet.startTime && sheet.endTime ? (
                      <Grids cols={"6"} className="w-full h-full">
                        <Holds className="col-start-1 col-end-2 p-2">
                          <Images
                            titleImg={
                              sheet.workType === "TASCO"
                                ? "/tasco.svg"
                                : sheet.workType === "TRUCK_DRIVER"
                                ? "/trucking.svg"
                                : sheet.workType === "MECHANIC"
                                ? "/mechanic.svg"
                                : sheet.workType === "LABOR"
                                ? "/equipment.svg"
                                : "null"
                            }
                            titleImgAlt={`${sheet.workType} Icon`}
                            className="m-auto w-8 h-8"
                          />
                        </Holds>
                        <Holds className="col-start-2 col-end-4 border-x-[3px] border-black h-full">
                          <Holds className="h-full justify-center border-b-[1.5px] border-black">
                            <Inputs
                              type="time"
                              value={formatTimeForInput(sheet.startTime)}
                              onChange={(e) =>
                                handleTimeChange(
                                  sheet.id,
                                  "startTime",
                                  e.target.value
                                )
                              }
                              className="text-xs border-none h-full rounded-none justify-center"
                              disabled={!edit}
                            />
                          </Holds>
                          <Holds className="h-full w-full justify-center border-t-[1.5px] border-black">
                            <Inputs
                              type="time"
                              value={formatTimeForInput(sheet.endTime)}
                              onChange={(e) =>
                                handleTimeChange(
                                  sheet.id,
                                  "endTime",
                                  e.target.value
                                )
                              }
                              className="text-xs border-none h-full rounded-none justify-center"
                              disabled={!edit}
                            />
                          </Holds>
                        </Holds>
                        <Holds className="col-start-4 col-end-7 h-full">
                          <Holds className="border-b-[1.5px] border-black h-full justify-center">
                            <Inputs
                              type={"text"}
                              value={sheet.Jobsite?.name || "N/A"}
                              className="text-xs border-none h-full rounded-b-none rounded-l-none rounded-br-none justify-center text-right"
                              onClick={() => openJobsiteModal(sheet.id)}
                              disabled={!edit}
                              readOnly
                            />
                          </Holds>
                          <Holds className="h-full justify-center text-right border-t-[1.5px] border-black">
                            <Inputs
                              type={"text"}
                              value={sheet.costcode || "N/A"}
                              className="text-xs border-none h-full rounded-t-none rounded-bl-none justify-center text-right"
                              onClick={() => openCostCodeModal(sheet.id)}
                              disabled={!edit}
                              readOnly
                            />
                          </Holds>
                        </Holds>
                      </Grids>
                    ) : (
                      <Texts size="p6" className="text-gray-500 italic">
                        Incomplete timesheet data
                      </Texts>
                    )}
                  </Buttons>
                </Holds>
              ))}
            </>
          )}
        </Holds>
      </Grids>

      {/* Jobsite Modal */}
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
              currentEditingId
                ? {
                    code: editedHighlightTimesheet.find(
                      (item) => item.id === currentEditingId
                    )?.jobsiteId || "",
                    label:
                      editedHighlightTimesheet.find(
                        (item) => item.id === currentEditingId
                      )?.Jobsite?.name || "",
                  }
                : undefined
            }
          />
        </Holds>
      </NModals>

      {/* Cost Code Modal */}
      <NModals
        background={"white"}
        size={"xlW"}
        isOpen={costCodeModalOpen}
        handleClose={() => setCostCodeModalOpen(false)}
      >
        <Holds background={"white"} className="w-full h-full p-2">
          <CostCodeSelector
            onCostCodeSelect={handleCostCodeSelect}
            initialValue={
              currentEditingId
                ? {
                    code:
                      editedHighlightTimesheet.find(
                        (item) => item.id === currentEditingId
                      )?.costcode || "",
                    label:
                      editedHighlightTimesheet.find(
                        (item) => item.id === currentEditingId
                      )?.costcode || "",
                  }
                : undefined
            }
          />
        </Holds>
      </NModals>
    </Holds>
  );
}