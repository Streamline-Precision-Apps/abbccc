import {
  // CreateEquipmentLogs,
  deleteLog,
  deleteTimesheet,
  saveEquipmentLogs,
  saveNewTimesheet,
  saveTimesheet,
} from "@/actions/adminActions";
import EmptyView from "@/app/(routes)/admins/_pages/EmptyView";
import { Buttons } from "@/components/(reusable)/buttons";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { NModals } from "@/components/(reusable)/newmodals";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cache } from "react";
type TimeSheet = {
  submitDate?: string; // Changed to string since API returns string dates
  id: string;
  userId?: string;
  date?: string;
  jobsiteId?: string;
  costcode?: string;
  nu?: string;
  Fp?: string;
  vehicleId?: number | null;
  startTime?: string | null;
  endTime?: string | null;
  duration?: number | null;
  startingMileage?: number | null;
  endingMileage?: number | null;
  leftIdaho?: boolean | null;
  equipmentHauled?: string | null;
  materialsHauled?: string | null;
  hauledLoadsQuantity?: number | null;
  refuelingGallons?: number | null;
  timeSheetComments?: string | null;
  status?: string;
};

type Equipment = {
  name: string; // Assuming only the name field is required
};

type EmployeeEquipmentLog = {
  id?: number | null;
  startTime?: string;
  endTime?: string | null;
  duration?: number | null;
  isRefueled?: boolean | null;
  fuelUsed?: number | null;
  comment?: string | null;
  Equipment?: Equipment;
};

export const TimesheetView = ({ params }: { params: { employee: string } }) => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const filter = searchParams.get("filter");
  const router = useRouter();
  const [dateByFilter, setDateByFilter] = useState<string>("");
  const [userTimeSheets, setUserTimeSheets] = useState<TimeSheet[]>([]);
  const [originalTimeSheets, setOriginalTimeSheets] = useState<TimeSheet[]>([]);
  const [equipmentLogs, setEquipmentLogs] = useState<EmployeeEquipmentLog[]>(
    []
  );
  const [isOpened, setIsOpened] = useState(false);
  const [originalEquipmentLogs, setOriginalEquipmentLogs] = useState<
    EmployeeEquipmentLog[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()); // Track expanded timesheet IDs

  const calculateDuration = (
    startTime?: string,
    endTime?: string
  ): number | null => {
    if (!startTime || !endTime) return null;

    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    if (isNaN(start) || isNaN(end)) return null;

    const durationInMs = end - start;
    return durationInMs > 0 ? durationInMs / (1000 * 60 * 60) : null; // Convert ms to hours
  };

  useEffect(() => {
    const fetchTimesheets = cache(async () => {
      if (!params.employee) {
        setError("Invalid employee ID.");
        return;
      }
      if (dateByFilter === "" || dateByFilter === null) {
        return;
      }
      try {
        const response = await fetch(
          `/api/getAllTimesheetsByDate/${params.employee}?date=${dateByFilter}`,
          {
            next: { tags: ["timesheets"] },
          }
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setUserTimeSheets(data.timesheets || []);
        setOriginalTimeSheets(data.timesheets || []);
        setEquipmentLogs(data.equipmentLogs || []);
        setOriginalEquipmentLogs(data.equipmentLogs || []);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch employee info:", error);
        setError("Unable to load timesheets. Please try again later.");
      }
    });
    fetchTimesheets();
  }, [dateByFilter, params.employee]);

  useEffect(() => {
    setDateByFilter(date || "");
  }, [date]);

  useEffect(() => {
    if (filter) {
      console.log(`Filter changed: ${filter}`);
      setDateByFilter("");
    }
  }, [filter]);

  const createNewTimesheet = async () => {
    const newTimesheet = await saveNewTimesheet(params.employee, dateByFilter);

    setUserTimeSheets((prev) => [...prev, newTimesheet] as TimeSheet[]);
  };

  const createNewLog = async () => {
    // const newTimesheet = await CreateEquipmentLogs(params.employee, dateByFilter);
    // setUserTimeSheets((prev) => [...prev, newTimesheet] as TimeSheet[]);
  };

  const handleDateClick = (newDate: string) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("date", newDate);
    router.push(`?${updatedSearchParams.toString()}`);
  };

  const handleInputChange = (id: string, field: string, value: unknown) => {
    setUserTimeSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id === id) {
          const updatedSheet = { ...sheet, [field]: value };

          // Calculate duration if startTime or endTime is updated
          if (field === "startTime" || field === "endTime") {
            updatedSheet.duration = calculateDuration(
              updatedSheet.startTime?.toString(),
              updatedSheet.endTime?.toString()
            );
          }

          return updatedSheet;
        }
        return sheet;
      })
    );
  };
  const handleEquipmentLogChange = (
    id: string,
    field: string,
    value: unknown
  ) => {
    setEquipmentLogs((prev) =>
      prev.map((sheet) => {
        if (sheet.id?.toString() === id) {
          const updatedSheet = { ...sheet, [field]: value };

          // Calculate duration if startTime or endTime is updated
          if (field === "startTime" || field === "endTime") {
            updatedSheet.duration = calculateDuration(
              updatedSheet.startTime,
              updatedSheet.endTime?.toString()
            );
          }

          return updatedSheet;
        }
        return sheet;
      })
    );
  };

  const revertTimesheet = (id: string, field: keyof TimeSheet) => {
    setUserTimeSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id === id) {
          // Find the original sheet
          const originalSheet = originalTimeSheets.find(
            (original) => original.id === id
          );

          if (!originalSheet) {
            console.warn(`Original timesheet not found for id: ${id}`);
            return sheet; // Return the sheet unchanged if no original is found
          }

          // Revert the specific field to its original value
          const updatedSheet = { ...sheet, [field]: originalSheet[field] };

          // Recalculate duration if startTime or endTime is reverted
          if (field === "startTime" || field === "endTime") {
            updatedSheet.duration = calculateDuration(
              updatedSheet.startTime?.toString(),
              updatedSheet.endTime?.toString()
            );
          }

          return updatedSheet;
        }
        return sheet; // Return unchanged sheets
      })
    );
  };

  const isFieldChanged = (id: string, field: keyof TimeSheet) => {
    const userSheet = userTimeSheets.find((sheet) => sheet.id === id);
    const originalSheet = originalTimeSheets.find((sheet) => sheet.id === id);
    return userSheet?.[field] !== originalSheet?.[field];
  };

  const revertEquipmentLog = (
    id: string,
    field: keyof EmployeeEquipmentLog
  ) => {
    setEquipmentLogs((prev) =>
      prev.map((sheet) => {
        if (sheet.id?.toString() === id) {
          const originalSheet = originalEquipmentLogs.find(
            (original) => original.id?.toString() === id
          );
          if (!originalSheet) {
            console.warn(`Original timesheet not found for id: ${id}`);
            return sheet; // Return the sheet unchanged if no original is found
          }

          const updatedSheet = { ...sheet, [field]: originalSheet[field] };
          if (field === "startTime" || field === "endTime") {
            updatedSheet.duration = calculateDuration(
              updatedSheet.startTime,
              updatedSheet.endTime?.toString()
            );
          }

          return updatedSheet;
        }
        return sheet; // Return unchanged sheets
      })
    );
  };

  const isEquipmentFieldChanged = (
    id: string,
    field: keyof EmployeeEquipmentLog
  ) => {
    const equipmentSheet = equipmentLogs.find(
      (sheet) => sheet.id?.toString() === id
    );
    const originalEquipmentSheet = originalEquipmentLogs.find(
      (sheet) => sheet.id?.toString() === id
    );
    return equipmentSheet?.[field] !== originalEquipmentSheet?.[field];
  };

  const refreshOriginalData = () => {
    setOriginalTimeSheets([...userTimeSheets]);
    setOriginalEquipmentLogs([...equipmentLogs]);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
  function isTimesheetChanged(
    timesheet: TimeSheet,
    originalTimesheet: TimeSheet
  ) {
    return JSON.stringify(timesheet) !== JSON.stringify(originalTimesheet);
  }

  function isLogChanged(
    log: EmployeeEquipmentLog,
    originalLog: EmployeeEquipmentLog
  ) {
    return JSON.stringify(log) !== JSON.stringify(originalLog);
  }

  const handleSubmitTimesheets = async () => {
    try {
      // Filter out only modified timesheets
      const changedTimesheets = userTimeSheets.filter((timesheet) => {
        const original = originalTimeSheets.find(
          (original) => original.id === timesheet.id
        );
        return original && isTimesheetChanged(timesheet, original);
      });
      for (const timesheet of changedTimesheets) {
        const formData = new FormData();
        formData.append("id", timesheet.id);
        formData.append("userId", timesheet.userId || "");
        formData.append("startTime", timesheet.startTime || "");
        formData.append("endTime", timesheet.endTime || "");
        formData.append("duration", timesheet.duration?.toString() || "");
        formData.append("date", timesheet.date || "");
        formData.append("costcode", timesheet.costcode || "");
        formData.append("jobsiteId", timesheet.jobsiteId || "");
        formData.append("timeSheetComments", timesheet.timeSheetComments || "");
        formData.append("vehicleId", timesheet.vehicleId?.toString() || "");
        formData.append(
          "startingMileage",
          timesheet.startingMileage?.toString() || ""
        );
        formData.append(
          "endingMileage",
          timesheet.endingMileage?.toString() || ""
        );
        formData.append("leftIdaho", timesheet.leftIdaho ? "true" : "false");
        formData.append(
          "refuelingGallons",
          timesheet.refuelingGallons?.toString() || ""
        );
        formData.append(
          "hauledLoadsQuantity",
          timesheet.hauledLoadsQuantity?.toString() || ""
        );
        formData.append("equipmentHauled", timesheet.equipmentHauled || "");
        formData.append("materialsHauled", timesheet.materialsHauled || "");
        const result = await saveTimesheet(formData);
        if (!result)
          throw new Error(`Failed to save timesheet ${timesheet.id}`);
      }

      // Filter out only modified equipment logs
      const changedLogs = equipmentLogs.filter((log) => {
        const original = originalEquipmentLogs.find(
          (original) => original.id === log.id
        );
        return original && isLogChanged(log, original);
      });

      for (const log of changedLogs) {
        const logFormData = new FormData();
        logFormData.append("id", log.id?.toString() || "");
        logFormData.append("startTime", log.startTime || "");
        logFormData.append("endTime", log.endTime || "");
        logFormData.append("duration", log.duration?.toString() || "");
        logFormData.append("isRefueled", log.isRefueled ? "true" : "false");
        logFormData.append("fuelUsed", log.fuelUsed?.toString() || "");
        logFormData.append("comment", log.comment || "");
        const result = await saveEquipmentLogs(logFormData);
        if (!result) throw new Error(`Failed to save equipment log ${log.id}`);
        refreshOriginalData();
        console.log("All changes saved successfully.");
      }
    } catch (error) {
      console.error("Error saving timesheet:", error);
    }
  };

  const handleDeleteTimesheet = async (id: string) => {
    try {
      const timesheetId = parseInt(id, 10);
      await deleteTimesheet(timesheetId);
      setUserTimeSheets((prev) => prev.filter((sheet) => sheet.id !== id));
      setOriginalTimeSheets((prev) => prev.filter((sheet) => sheet.id !== id));
      console.log("Timesheet deleted successfully.");
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };

  const handleDeleteLog = async (id: string) => {
    try {
      const logId = parseInt(id, 10);
      await deleteLog(logId);
      setEquipmentLogs((prev) =>
        prev.filter((log) => log.id?.toString() !== id)
      );
      setOriginalEquipmentLogs((prev) =>
        prev.filter((log) => log.id?.toString() !== id)
      );
      console.log("Timesheet deleted successfully.");
    } catch (error) {
      console.error("Error deleting timesheet:", error);
    }
  };

  return (
    <Grids rows={"12"} cols={"5"} gap={"2"} className="h-full w-full">
      {error ? (
        <Texts className="text-red-500">{error}</Texts>
      ) : (
        <>
          <Holds className="row-start-1 row-end-2 col-span-2 w-full h-full">
            <Holds className="my-auto w-full">
              <Inputs
                type="date"
                value={dateByFilter}
                onChange={(e) => handleDateClick(e.target.value)}
              />
            </Holds>
          </Holds>
          <Holds className="row-start-1 row-end-2 col-start-4 col-end-6  h-full">
            <Holds background={"red"} className=" my-auto"></Holds>
          </Holds>
          <Holds className="row-start-2 row-end-3 col-start-4 col-end-6  h-full">
            <Holds background={"green"} className=" my-auto"></Holds>
          </Holds>
          <Holds className="row-span-9 col-span-5 h-full">
            <Holds className="h-full w-full row-span-5 overflow-y-auto no-scrollbar border-[3px] border-black rounded-[10px]">
              {userTimeSheets.length > 0
                ? userTimeSheets.map((timesheet) => {
                    const isExpanded = expandedIds.has(timesheet.id);

                    // Filter equipment logs based on timesheet startTime and endTime

                    return (
                      <Holds
                        key={timesheet.id}
                        className="w-full even:bg-gray-200 odd:bg-gray-100 rounded-[10px] px-2 py-3 mb-4 cursor-pointer"
                      >
                        {/* Always show the header */}
                        <Holds
                          position={"row"}
                          className="h-full w-full my-auto relative"
                        >
                          <Inputs type="hidden" value={timesheet.id} />
                          <Inputs type="hidden" value={timesheet.userId} />
                          {/* ----------------------------------------------------------------------------*/}
                          {/* ----------------------------------------------------------------------------*/}
                          <Holds
                            position={"row"}
                            className="h-full w-full gap-4"
                          >
                            <Holds className="w-[45%] h-full">
                              <Labels size={"p4"}>Start Time</Labels>
                              <EditableFields
                                type="time"
                                value={
                                  timesheet.startTime &&
                                  !isNaN(
                                    new Date(timesheet.startTime).getTime()
                                  )
                                    ? new Date(timesheet.startTime)
                                        .toISOString()
                                        .substring(11, 16) // Convert to HH:mm
                                    : ""
                                }
                                onChange={(e) => {
                                  const currentDate = timesheet.startTime
                                    ? new Date(timesheet.startTime)
                                        .toISOString()
                                        .substring(0, 10) // Extract the date portion
                                    : new Date().toISOString().substring(0, 10); // Use today's date as default
                                  handleInputChange(
                                    timesheet.id,
                                    "startTime",
                                    `${currentDate}T${e.target.value}:00Z` // Combine current date with new time
                                  );
                                }}
                                isChanged={isFieldChanged(
                                  timesheet.id,
                                  "startTime"
                                )}
                                onRevert={() =>
                                  revertTimesheet(timesheet.id, "startTime")
                                }
                                variant="default"
                                size="default"
                              />
                            </Holds>

                            {/* ----------------------------------------------------------------------------*/}
                            {/* ----------------------------------------------------------------------------*/}
                            <Holds className="w-[45%] h-full">
                              <Labels size={"p4"}>End Time</Labels>
                              <EditableFields
                                type="time"
                                value={
                                  timesheet.endTime &&
                                  !isNaN(new Date(timesheet.endTime).getTime())
                                    ? new Date(timesheet.endTime)
                                        .toISOString()
                                        .substring(11, 16) // Convert to HH:mm
                                    : ""
                                }
                                onChange={(e) => {
                                  const currentDate = timesheet.endTime
                                    ? new Date(timesheet.endTime)
                                        .toISOString()
                                        .substring(0, 10) // Extract the date portion
                                    : new Date().toISOString().substring(0, 10); // Use today's date as default
                                  handleInputChange(
                                    timesheet.id,
                                    "endTime",
                                    `${currentDate}T${e.target.value}:00Z` // Combine current date with new time
                                  );
                                }}
                                isChanged={isFieldChanged(
                                  timesheet.id,
                                  "endTime"
                                )}
                                onRevert={() =>
                                  revertTimesheet(timesheet.id, "endTime")
                                }
                                variant="default"
                                size="default"
                              />
                            </Holds>
                          </Holds>

                          {isExpanded ? (
                            <Holds className="w-[10%] h-full">
                              <Images
                                titleImg="/expandLeft.svg"
                                titleImgAlt="clock in"
                                className="rotate-[270deg] my-auto"
                                size={"50"}
                                onClick={() => toggleExpanded(timesheet.id)} // Toggle on click
                              />
                            </Holds>
                          ) : (
                            <Holds className="w-[10%] h-full ">
                              <Images
                                titleImg="/expandLeft.svg"
                                titleImgAlt="clock in"
                                className="rotate-90 my-auto"
                                size={"50"}
                                onClick={() => toggleExpanded(timesheet.id)} // Toggle on click
                              />
                            </Holds>
                          )}
                        </Holds>

                        {/* Collapsible details */}

                        {isExpanded && (
                          <>
                            <Holds
                              position={"row"}
                              className="h-full w-full mb-2 gap-4"
                            >
                              <Holds
                                position={"row"}
                                className="h-full w-full gap-4"
                              >
                                <Holds>
                                  <Labels size={"p4"}>Date of Shift</Labels>
                                  <EditableFields
                                    type="date"
                                    value={
                                      timesheet.date &&
                                      !isNaN(new Date(timesheet.date).getTime())
                                        ? new Date(timesheet.date)
                                            .toISOString()
                                            .substring(0, 10) // Convert to HH:mm
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "date",
                                        `${e.target.value}T00:00:00Z`
                                        // Convert HH:mm back to ISO format
                                      )
                                    }
                                    isChanged={isFieldChanged(
                                      timesheet.id,
                                      "date"
                                    )}
                                    onRevert={() =>
                                      revertTimesheet(timesheet.id, "date")
                                    }
                                    variant="default"
                                    size="default"
                                  />
                                </Holds>
                              </Holds>
                              <Holds>
                                <Labels size={"p4"}>
                                  Duration (updates manually)
                                </Labels>

                                <Inputs
                                  type="text"
                                  value={timesheet.duration?.toFixed(2)}
                                  disabled
                                />
                              </Holds>
                            </Holds>

                            <Holds
                              position={"row"}
                              className="h-full w-full gap-4"
                            >
                              <Holds className="h-full w-full relative">
                                <Labels size={"p4"}>Timesheet comment</Labels>
                                <TextAreas
                                  maxLength={40}
                                  value={timesheet.timeSheetComments?.toString()}
                                  style={{ resize: "none" }}
                                  onChange={(e) =>
                                    handleInputChange(
                                      timesheet.id,
                                      "timeSheetComments",
                                      e.target.value
                                    )
                                  }
                                />
                                <Texts
                                  size={"p6"}
                                  className={`text-app-gray absolute bottom-3 right-2 ${
                                    timesheet.timeSheetComments?.length === 40
                                      ? "text-app-red"
                                      : ""
                                  }`}
                                >
                                  {`${
                                    timesheet.timeSheetComments?.length ?? 0
                                  }/40`}
                                </Texts>
                              </Holds>
                            </Holds>

                            <Holds
                              position={"row"}
                              className="h-full w-full gap-4"
                            >
                              <Holds>
                                <Labels size={"p4"}>Jobsite</Labels>

                                <EditableFields
                                  type="text"
                                  value={timesheet.jobsiteId || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      timesheet.id,
                                      "jobsiteId",
                                      e.target.value
                                    )
                                  }
                                  isChanged={isFieldChanged(
                                    timesheet.id,
                                    "jobsiteId"
                                  )}
                                  onRevert={() =>
                                    revertTimesheet(timesheet.id, "jobsiteId")
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>
                              <Holds>
                                <Labels size={"p4"}>Cost Code</Labels>
                                <EditableFields
                                  type="text"
                                  value={timesheet.costcode || ""}
                                  onChange={(e) =>
                                    handleInputChange(
                                      timesheet.id,
                                      "costcode",
                                      e.target.value
                                    )
                                  }
                                  isChanged={isFieldChanged(
                                    timesheet.id,
                                    "costcode"
                                  )}
                                  onRevert={() =>
                                    revertTimesheet(timesheet.id, "costcode")
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>
                            </Holds>

                            {/* If the time sheet has a vehicle ID, show Vehicle ID, Starting Mileage, and Ending Mileage and all truck details */}
                            {!timesheet.vehicleId && (
                              <>
                                <Holds
                                  position={"row"}
                                  className="h-full w-full mb-2 gap-4"
                                >
                                  <Holds>
                                    <Labels size={"p4"}>Vehicle ID</Labels>
                                    <EditableFields
                                      type="text"
                                      value={
                                        timesheet.vehicleId?.toString() || ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "vehicleId",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "vehicleId"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "vehicleId"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>

                                  <Holds>
                                    <Labels size={"p4"}>
                                      Starting Mileage
                                    </Labels>
                                    <EditableFields
                                      type="text"
                                      value={
                                        timesheet.startingMileage?.toString() ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "startingMileage",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "startingMileage"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "startingMileage"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>
                                </Holds>
                                <Holds
                                  position={"row"}
                                  className="h-full w-full mb-2 gap-4"
                                >
                                  <Holds>
                                    <Labels size={"p4"}>Ending Mileage</Labels>
                                    <EditableFields
                                      type="text"
                                      value={
                                        timesheet.endingMileage?.toString() ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "endingMileage",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "endingMileage"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "endingMileage"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>

                                  <Holds>
                                    <Labels size={"p4"}>Left Idaho?</Labels>
                                    <EditableFields
                                      type="text"
                                      value={timesheet.leftIdaho ? "Yes" : "No"}
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "leftIdaho",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "leftIdaho"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "leftIdaho"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>
                                </Holds>
                                <Holds
                                  position={"row"}
                                  className="h-full w-full mb-2 gap-4"
                                >
                                  <Holds>
                                    <Labels size={"p4"}>
                                      Refueling Gallons
                                    </Labels>
                                    <EditableFields
                                      type="text"
                                      value={
                                        timesheet.refuelingGallons?.toString() ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "refuelingGallons",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "refuelingGallons"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "refuelingGallons"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>
                                  <Holds>
                                    <Labels size={"p4"}>
                                      # of Hauled Loads{" "}
                                    </Labels>
                                    <EditableFields
                                      type="text"
                                      value={
                                        timesheet.hauledLoadsQuantity?.toString() ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "hauledLoadsQuantity",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "hauledLoadsQuantity"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "hauledLoadsQuantity"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>
                                </Holds>
                                <Holds
                                  position={"row"}
                                  className="h-full w-full mb-2 gap-4"
                                >
                                  <Holds>
                                    <Labels size={"p4"}>
                                      Equipment Hauled
                                    </Labels>
                                    <EditableFields
                                      type="text"
                                      value={
                                        timesheet.equipmentHauled?.toString() ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "equipmentHauled",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "equipmentHauled"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "equipmentHauled"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>
                                  <Holds>
                                    <Labels size={"p4"}>
                                      Materials Hauled
                                    </Labels>
                                    <EditableFields
                                      type="text"
                                      value={
                                        timesheet.materialsHauled?.toString() ||
                                        ""
                                      }
                                      onChange={(e) =>
                                        handleInputChange(
                                          timesheet.id,
                                          "materialsHauled",
                                          e.target.value
                                        )
                                      }
                                      isChanged={isFieldChanged(
                                        timesheet.id,
                                        "materialsHauled"
                                      )}
                                      onRevert={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "materialsHauled"
                                        )
                                      }
                                      variant="default"
                                      size="default"
                                    />
                                  </Holds>
                                </Holds>
                              </>
                            )}
                            <Holds className="mt-4 ">
                              <Buttons
                                background={"red"}
                                position={"left"}
                                className="w-1/4 py-2"
                                onClick={() =>
                                  handleDeleteTimesheet(timesheet.id)
                                }
                              >
                                <Texts size={"p5"}>Delete</Texts>
                              </Buttons>
                            </Holds>
                          </>
                        )}
                      </Holds>
                    );
                  })
                : null}
              {equipmentLogs.length > 0 &&
                equipmentLogs.map((log, index) => {
                  const isExpanded = expandedIds.has(
                    `equipmentLog-${log.id || index}`
                  );

                  return (
                    <Holds
                      key={log.id || index}
                      className="w-full even:bg-gray-200 odd:bg-gray-100 rounded-[10px] px-1 py-3 mb-4 cursor-pointer"
                    >
                      <Holds position="row" className="w-full h-full gap-4">
                        <Holds className="w-[45%] h-full">
                          <Labels size="p4">Equipment Name</Labels>
                          <EditableFields
                            type="text"
                            value={log?.Equipment?.name?.toString() || ""}
                            onChange={(e) =>
                              handleEquipmentLogChange(
                                log.id?.toString() || "",
                                "Equipment", // Ensure this matches `keyof EmployeeEquipmentLog`
                                {
                                  ...log.Equipment,
                                  name: e.target.value,
                                }
                              )
                            }
                            isChanged={isEquipmentFieldChanged(
                              log.id?.toString() || "",
                              "Equipment"
                            )}
                            onRevert={() =>
                              revertEquipmentLog(
                                log.id?.toString() || "",
                                "Equipment"
                              )
                            }
                            variant="default"
                            size="default"
                          />
                        </Holds>
                        {/* Duration */}
                        <Holds className="w-[45%] h-full">
                          <Labels size="p4">Duration (updates manually)</Labels>
                          <Inputs
                            type="text"
                            disabled
                            value={log.duration?.toFixed(2) || ""}
                            onChange={(e) =>
                              handleEquipmentLogChange(
                                log.id?.toString() || "",
                                "duration",
                                e.target.value
                              )
                            }
                          />
                        </Holds>
                        {isExpanded ? (
                          <Holds className="w-[10%] h-full">
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="clock in"
                              className="rotate-[270deg] my-auto"
                              size={"50"}
                              onClick={() =>
                                toggleExpanded(
                                  `equipmentLog-${log.id || index}`
                                )
                              }
                            />
                          </Holds>
                        ) : (
                          <Holds className="w-[10%] h-full ">
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="clock in"
                              className="rotate-90 my-auto"
                              size={"50"}
                              onClick={() =>
                                toggleExpanded(
                                  `equipmentLog-${log.id || index}`
                                )
                              }
                            />
                          </Holds>
                        )}
                      </Holds>
                      {isExpanded && (
                        <>
                          {/* Start Time */}
                          <Holds className="my-auto w-full">
                            <Holds
                              position="row"
                              className="my-auto w-full gap-4"
                            >
                              <Holds>
                                <Labels size="p4">Start Time</Labels>
                                <EditableFields
                                  type="time"
                                  value={
                                    log.startTime &&
                                    !isNaN(new Date(log.startTime).getTime())
                                      ? new Date(log.startTime)
                                          .toISOString()
                                          .substring(11, 16)
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const currentDate = log.startTime
                                      ? new Date(log.startTime)
                                          .toISOString()
                                          .substring(0, 10) // Extract the date portion
                                      : new Date()
                                          .toISOString()
                                          .substring(0, 10); // Use today's date as default
                                    handleEquipmentLogChange(
                                      log.id?.toString() || "",
                                      "startTime",
                                      `${currentDate}T${e.target.value}:00Z` // Combine current date with new time
                                    );
                                  }}
                                  isChanged={isEquipmentFieldChanged(
                                    log.id?.toString() || "",
                                    "startTime"
                                  )}
                                  onRevert={() =>
                                    revertEquipmentLog(
                                      log.id?.toString() || "",
                                      "startTime"
                                    )
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>

                              {/* End Time */}
                              <Holds>
                                <Labels size="p4">End Time</Labels>
                                <EditableFields
                                  type="time"
                                  value={
                                    log.endTime &&
                                    !isNaN(new Date(log.endTime).getTime())
                                      ? new Date(log.endTime)
                                          .toISOString()
                                          .substring(11, 16)
                                      : ""
                                  }
                                  onChange={(e) => {
                                    const currentDate = log.endTime
                                      ? new Date(log.endTime)
                                          .toISOString()
                                          .substring(0, 10) // Extract the date portion
                                      : new Date()
                                          .toISOString()
                                          .substring(0, 10); // Use today's date as default
                                    handleEquipmentLogChange(
                                      log.id?.toString() || "",
                                      "endTime",
                                      `${currentDate}T${e.target.value}:00Z` // Combine current date with new time
                                    );
                                  }}
                                  isChanged={isEquipmentFieldChanged(
                                    log.id?.toString() || "",
                                    "endTime"
                                  )}
                                  onRevert={() =>
                                    revertEquipmentLog(
                                      log.id?.toString() || "",
                                      "endTime"
                                    )
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>
                            </Holds>
                            <Holds
                              position="row"
                              className="my-auto w-full gap-4"
                            >
                              <Holds>
                                <Labels size="p4">Fuel used</Labels>
                                <EditableFields
                                  type="checkbox"
                                  variant={"noFrames"}
                                  checked={log.isRefueled || false}
                                  value={log.isRefueled ? "true" : "false"}
                                  onChange={(e) => {
                                    handleEquipmentLogChange(
                                      log.id?.toString() || "",
                                      "isRefueled",
                                      e.target.checked // Use `e.target.checked` to get the updated boolean value
                                    );
                                  }}
                                  isChanged={isEquipmentFieldChanged(
                                    log.id?.toString() || "",
                                    "isRefueled"
                                  )}
                                  onRevert={() =>
                                    revertEquipmentLog(
                                      log.id?.toString() || "",
                                      "isRefueled"
                                    )
                                  }
                                  size="default"
                                />
                              </Holds>
                              <Holds>
                                <Labels size="p4">Fuel used</Labels>
                                <EditableFields
                                  type="text"
                                  value={log.fuelUsed?.toString() || ""}
                                  onChange={(e) => {
                                    handleEquipmentLogChange(
                                      log.id?.toString() || "",
                                      "fuelUsed",
                                      e.target.value
                                    );
                                  }}
                                  isChanged={isEquipmentFieldChanged(
                                    log.id?.toString() || "",
                                    "fuelUsed"
                                  )}
                                  onRevert={() =>
                                    revertEquipmentLog(
                                      log.id?.toString() || "",
                                      "fuelUsed"
                                    )
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>
                            </Holds>
                            <Holds>
                              <Labels size="p4">Comment</Labels>
                              <TextAreas
                                value={log.comment || ""}
                                style={{ resize: "none" }}
                                maxLength={40}
                                onChange={(e) => {
                                  handleEquipmentLogChange(
                                    log.id?.toString() || "",
                                    "comment",
                                    e.target.value
                                  );
                                }}
                              />
                            </Holds>
                          </Holds>
                          <Holds className="mt-4 ">
                            <Buttons
                              background={"red"}
                              position={"left"}
                              className="w-1/4 py-2"
                              onClick={() =>
                                handleDeleteLog(log.id?.toString() || "")
                              }
                            >
                              <Texts size={"p5"}>Delete</Texts>
                            </Buttons>
                          </Holds>
                        </>
                      )}
                    </Holds>
                  );
                })}

              {userTimeSheets.length > 0 && (
                <>
                  {userTimeSheets.length === 0 && (
                    <Holds className="row-span-12 col-span-5 w-full h-full">
                      <EmptyView
                        Children={
                          <Texts size={"p4"}>No Timesheet or Logs Found</Texts>
                        }
                      />
                    </Holds>
                  )}
                </>
              )}
            </Holds>
          </Holds>
          <Holds
            position={"row"}
            className="row-start-12 row-end-13 col-start-1 col-end-3 h-full"
          >
            <Buttons
              background={"green"}
              onClick={handleSubmitTimesheets}
              className="w-full h-full"
            >
              <Texts size={"p4"}>Submit Timesheet</Texts>
            </Buttons>
          </Holds>

          <Holds
            position={"row"}
            className="row-start-12 row-end-13 col-start-5 col-end-6 h-full"
          >
            <Buttons
              background={"green"}
              className="w-full h-full"
              onClick={() => setIsOpened(true)}
            >
              <Texts size={"p4"}>+</Texts>
            </Buttons>
            <NModals
              size={"sm"}
              isOpen={isOpened}
              handleClose={() => setIsOpened(false)}
            >
              <Holds className="w-full h-full">
                <Texts size={"p2"}>Select one of the following:</Texts>
                <Holds position={"row"} className="w-full h-full gap-4">
                  <Holds>
                    <Buttons
                      background={"green"}
                      className="w-full h-full py-2"
                      onClick={createNewTimesheet}
                    >
                      <Texts size={"p5"}>New Timesheet</Texts>
                    </Buttons>
                  </Holds>
                  <Holds>
                    <Buttons
                      background={"green"}
                      className="w-full h-full py-2"
                      onClick={createNewLog}
                    >
                      <Texts size={"p5"}> New Equipment Log</Texts>
                    </Buttons>
                  </Holds>
                </Holds>
              </Holds>
            </NModals>
          </Holds>
        </>
      )}
    </Grids>
  );
};
