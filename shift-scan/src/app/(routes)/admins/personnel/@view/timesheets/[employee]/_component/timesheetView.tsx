import {
  CreateEquipmentLogs,
  CreateTimesheet,
  deleteLog,
  deleteTimesheet,
  saveEquipmentLogs,
  saveTimesheet,
} from "@/actions/adminActions";
import EmptyView from "@/app/(routes)/admins/_pages/EmptyView";
import {
  useDBCostcode,
  useDBEquipment,
  useDBJobsite,
} from "@/app/context/dbCodeContext";
import { Buttons } from "@/components/(reusable)/buttons";
import { EditableFields } from "@/components/(reusable)/EditableField";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
// import { NModals } from "@/components/(reusable)/newmodals";
import { Selects } from "@/components/(reusable)/selects";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cache } from "react";
import { SearchModal } from "./searchModal";
import { TimeSheetView, EmployeeEquipmentLog } from "@/lib/types";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";

type Equipment = {
  id: number;
  qrId: string;
  name: string; // Assuming only the name field is required
};

export const TimesheetView = ({ params }: { params: { employee: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  // date is read from the url and passed to the component
  const date = searchParams.get("date");
  const filter = searchParams.get("filter");
  const [dateByFilter, setDateByFilter] = useState<string>("");
  //---------------------------------------------------------------------------------------
  // timesheets hold each individual timesheet in the database under an array of timesheets
  const [userTimeSheets, setUserTimeSheets] = useState<TimeSheetView[]>([]);
  // holds the original timesheets to revert back to if needed
  const [originalTimeSheets, setOriginalTimeSheets] = useState<TimeSheetView[]>(
    []
  );
  //---------------------------------------------------------------------------------------
  // equipmentLogs holds each individual equipment log in the database under an array of equipmentLogs
  const [equipmentLogs, setEquipmentLogs] = useState<EmployeeEquipmentLog[]>(
    []
  );
  const [originalEquipmentLogs, setOriginalEquipmentLogs] = useState<
    EmployeeEquipmentLog[]
  >([]);
  //---------------------------------------------------------------------------------------
  // for state management for search modals
  const [term] = useState("");
  const [equipmentSearchList, setEquipmentSearchList] = useState<Equipment[]>(
    []
  );
  const [equipmentSearchOpen, setEquipmentSearchOpen] = useState(false);
  const [jobsiteSearchOpen, setJobsiteSearchOpen] = useState(false);
  const [costcodeSearchOpen, setCostcodeSearchOpen] = useState(false);
  const [vehiclesSearchOpen, setVehiclesSearchOpen] = useState(false);
  const [totalHours, setTotalHours] = useState("");
  const [showCommentSection, setShowCommentSection] = useState(false);

  //---------------------------------------------------------------------------------------
  // hold the context data for the search modals
  const { jobsiteResults } = useDBJobsite();
  const { costcodeResults } = useDBCostcode();
  const { equipmentResults } = useDBEquipment();
  const [equipmentList] = useState(equipmentResults);

  // display the error message that occurs when an error occurs
  const [error, setError] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState("timesheets");
  //---------------------------------------------------------------------------------------
  // make the timesheet expandable and collapsible
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()); // Track expanded timesheet IDs
  // helps models know which Id is currently open and what to edit based on that
  const [currentLogId, setCurrentLogId] = useState<string | null>(null);
  const [currentSheetId, setCurrentSheetId] = useState<string | null>(null);
  const { setNotification } = useNotification();
  const t = useTranslations("Admins");

  //---------------------------------------------------------------------------------------
  // functions to open and close the search modals
  const openEquipmentSearch = (logId: string) => {
    setCurrentLogId(logId);
    setEquipmentSearchOpen(true);
  };

  const closeEquipmentSearch = () => {
    setCurrentLogId(null);
    setEquipmentSearchOpen(false);
  };

  const openTimesheetSearch = (sheetId: string) => {
    setCurrentSheetId(sheetId);
    setJobsiteSearchOpen(true);
  };

  const closeTimesheetSearch = () => {
    setCurrentSheetId(null);
    setJobsiteSearchOpen(false);
  };

  const openCostcodeSearch = (sheetId: string) => {
    setCurrentSheetId(sheetId);
    setCostcodeSearchOpen(true);
  };

  const closeCostcodeSearch = () => {
    setCurrentSheetId(null);
    setCostcodeSearchOpen(false);
  };

  const openVehicleSearch = (sheetId: string) => {
    setCurrentSheetId(sheetId);
    setVehiclesSearchOpen(true);
  };

  const closeVehiclesSearch = () => {
    setCurrentSheetId(null);
    setVehiclesSearchOpen(false);
  };
  //  ---------------------------------------------------------------------------------------
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
  //  ---------------------------------------------------------------------------------------
  // fetch all timesheets and equipment logs by date
  useEffect(() => {
    const fetchTimesheets = cache(async () => {
      if (!params.employee) {
        setError(t("InvalidEmployeeID"));
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
          throw new Error(`${t("FailedToFetch")} ${response.statusText}`);
        }
        const data = await response.json();
        setUserTimeSheets(data.timesheets || []);
        setOriginalTimeSheets(data.timesheets || []);
        setEquipmentLogs(data.equipmentLogs || []);
        setOriginalEquipmentLogs(data.equipmentLogs || []);
        setError(null);
        setTotalHours(
          data.timesheets
            .reduce(
              (acc: number, timesheet: TimeSheetView) =>
                acc + (timesheet.duration ?? 0),
              0
            )
            .toFixed(2)
        );
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("EmployeeData")}`, error);
        setError(`${t("UnableToLoadTimeSheets")} ${t("PleaseTryAgainlater")}`);
      }
    });
    fetchTimesheets();
  }, [dateByFilter, params.employee]);
  //  ---------------------------------------------------------------------------------------
  // fetch all equipment names
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const response = await fetch("/api/getAllEquipment");
        if (!response.ok) {
          throw new Error(`${t("FailedToFetch")} ${response.statusText}`);
        }
        const data = await response.json();

        // Trim the data to only include the necessary fields
        const trimmedData = (data as Equipment[]).map((equipment) => ({
          id: equipment.id,
          qrId: equipment.qrId,
          name: equipment.name,
        }));

        setEquipmentSearchList(trimmedData);
      } catch (error) {
        console.error(`${t("FailedToFetch")} ${t("equipmentInfo")}:`, error);
        setError(`${t("UnableToLoadTimeSheets")} ${t("PleaseTryAgainlater")}`);
      }
    };

    fetchEquipment();
  }, []); // Keep the dependencies array empty to run the effect only once

  //  ---------------------------------------------------------------------------------------
  // useeffect are listening to the date and filter changes and then update based on that
  useEffect(() => {
    setDateByFilter(date || "");
  }, [date]);

  useEffect(() => {
    if (filter) {
      setDateByFilter("");
    }
  }, [filter]);

  //  ---------------------------------------------------------------------------------------
  // this takes the toal hours and updates the state of total day hours
  useEffect(() => {
    setTotalHours(
      userTimeSheets
        .reduce(
          (acc: number, timesheet: TimeSheetView) =>
            acc + (timesheet.duration ?? 0),
          0
        )
        .toFixed(2)
    );
  }, [userTimeSheets]);

  //  ---------------------------------------------------------------------------------------

  const createNewTimesheet = async () => {
    const CreateTimesheetResponse = await CreateTimesheet(
      params.employee,
      dateByFilter
    );
    if (!CreateTimesheetResponse) {
      return;
    }

    setOriginalTimeSheets(
      (prev) => [...prev, CreateTimesheetResponse] as TimeSheetView[]
    );
    setUserTimeSheets(
      (prev) => [...prev, CreateTimesheetResponse] as TimeSheetView[]
    );
    refreshOriginalData();
  };

  const createNewLog = async () => {
    try {
      const createdLog = await CreateEquipmentLogs(
        params.employee,
        dateByFilter
      );

      if (!createdLog) return;

      setEquipmentLogs(
        (prev) => [...prev, createdLog] as EmployeeEquipmentLog[]
      );
      setOriginalEquipmentLogs(
        (prev) => [...prev, createdLog] as EmployeeEquipmentLog[]
      );
      refreshOriginalData();
    } catch (error) {
      console.error(t("ErrorCreatingNewEquipmentLog"), error);
    }
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
      prev.map((log) => {
        if (log.id?.toString() === id) {
          const updatedLog = { ...log, [field]: value };

          // Update duration if startTime or endTime changes
          if (field === "startTime" || field === "endTime") {
            updatedLog.duration = calculateDuration(
              updatedLog.startTime?.toString(),
              updatedLog.endTime?.toString()
            );
          }

          return updatedLog;
        }
        return log;
      })
    );
  };

  const revertTimesheet = (id: string, field: keyof TimeSheetView) => {
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

  const isFieldChanged = (id: string, field: keyof TimeSheetView) => {
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
            return sheet;
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
  function isChanged<T>(current: T, original: T): boolean {
    return JSON.stringify(current) !== JSON.stringify(original);
  }

  const handleSubmitTimesheets = async () => {
    try {
      // Separate new and changed timesheets
      const changedTimesheets = userTimeSheets.filter((timesheet) => {
        const original = originalTimeSheets.find(
          (original) => original.id === timesheet.id
        );
        return (
          original &&
          isChanged(timesheet as TimeSheetView, original as TimeSheetView)
        );
      });

      // Process changed timesheets
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
        formData.append("status", timesheet.status || "");
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
        console.log("formData:", formData);

        const result = await saveTimesheet(formData); // Handle updating existing timesheet
        if (!result)
          throw new Error(`Failed to save timesheet ${timesheet.id}`);
        console.log(`Updated timesheet with ID: ${timesheet.id}`);
      }

      const changedLogs = equipmentLogs.filter((log) => {
        const original = originalEquipmentLogs.find(
          (original) => original.id?.toString() === log.id?.toString()
        );
        return (
          original &&
          isChanged(
            log as EmployeeEquipmentLog,
            original as EmployeeEquipmentLog
          )
        );
      });

      // Process changed logs
      for (const log of changedLogs) {
        const logFormData = new FormData();
        logFormData.append("id", log.id?.toString() || "");
        logFormData.append("equipmentId", log?.equipmentId?.toString() || "");
        logFormData.append("startTime", log.startTime || "");
        logFormData.append("endTime", log.endTime || "");
        logFormData.append("duration", log.duration?.toString() || "");
        logFormData.append("isRefueled", log.isRefueled ? "true" : "false");
        logFormData.append("fuelUsed", log.fuelUsed?.toString() || "");
        logFormData.append("comment", log.comment || "");
        console.log("formData:", logFormData);
        const result = await saveEquipmentLogs(logFormData); // Handle updating existing log

        if (!result) throw new Error(`Failed to save equipment log ${log.id}`);
        console.log(`Updated equipment log with ID: ${log.id}`);
      }

      refreshOriginalData();
      setNotification("Changes saved successfully!", "success");
    } catch (error) {
      console.error("Error saving changes:", error);
      setNotification("Error: Failed to save changes.", "error");
    }
  };

  const handleDelete = async (id: string, type: string) => {
    try {
      if (type === "timesheet") {
        const timesheetId = parseInt(id, 10);
        await deleteTimesheet(timesheetId);
        setUserTimeSheets((prev) => prev.filter((sheet) => sheet.id !== id));
        setOriginalTimeSheets((prev) =>
          prev.filter((sheet) => sheet.id !== id)
        );
        setNotification("Timesheet deleted successfully!", "success");
      }
      if (type === "log") {
        const logId = parseInt(id, 10);
        await deleteLog(logId);
        setEquipmentLogs((prev) =>
          prev.filter((log) => log.id?.toString() !== id)
        );
        setOriginalEquipmentLogs((prev) =>
          prev.filter((log) => log.id?.toString() !== id)
        );
        setNotification("Equipment log deleted successfully.", "success");
      }
    } catch (error) {
      console.error("Error deleting timesheet:", error);
      setNotification("Error: Failed to delete timesheet.", "error");
    }
  };
  const handleCommentSection = () => {
    setShowCommentSection(!showCommentSection);
  };

  const vehicleFilteredList = useMemo(() => {
    if (!term.trim()) return equipmentList;

    const filtered = equipmentList.filter((vehicle) => {
      const name = `${vehicle.qrId} ${vehicle.name}`.toLowerCase();
      return name.includes(term.toLowerCase());
    });
    return filtered;
  }, [term, equipmentList]);

  const jobFilteredList = useMemo(() => {
    if (!term.trim()) return jobsiteResults;

    const filtered = jobsiteResults.filter((jobsite) => {
      const name = `${jobsite.qrId} ${jobsite.name}`.toLowerCase();
      return name.includes(term.toLowerCase());
    });

    return filtered;
  }, [term, jobsiteResults]);

  const ccFilteredList = useMemo(() => {
    if (!term.trim()) return costcodeResults;

    const filtered = costcodeResults.filter((cc) => {
      const name = `${cc.name} ${cc.description}`.toLowerCase();
      return name.includes(term.toLowerCase());
    });

    return filtered;
  }, [term, costcodeResults]);

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
          <Holds
            position={"row"}
            className=" row-start-2 row-end-3 col-start-1 col-end-3 h-full"
          >
            <Grids rows={"1"} cols={"8"} className=" h-full w-full my-auto">
              <Holds className="col-span-5 my-auto">
                <Texts size={"p6"} className="">
                  {t("Comments")}
                </Texts>
              </Holds>
              <Holds>
                <Images
                  titleImg={"/comment.svg"}
                  titleImgAlt={"comment icon"}
                  className=" my-auto col-span-2"
                  onClick={handleCommentSection}
                />
              </Holds>
              <div className="w-2 h-2 mt-2 rounded-full bg-app-orange flex col-span-1"></div>
            </Grids>
          </Holds>

          <Holds className="row-start-2 row-end-3 col-start-4 col-end-6  h-full">
            <Holds className=" my-auto">
              <Texts position={"right"} size={"p6"}>
                {t("Total Hours")}: {totalHours}
              </Texts>
            </Holds>
          </Holds>
          {showCommentSection && (
            <Holds className="row-start-3 row-end-12 col-start-1 col-end-6 h-full w-full">
              <TextAreas
                maxLength={40}
                className="w-full"
                style={{ resize: "none" }}
              ></TextAreas>
            </Holds>
          )}
          <Holds
            className={`${
              showCommentSection
                ? "row-start-5 row-end-12 col-start-1 col-end-6  "
                : "row-start-3 row-end-12 col-start-1 col-end-6 "
            }  h-full w-full`}
          >
            <Holds className="h-full w-full row-span-5 overflow-y-auto no-scrollbar border-[3px] border-black rounded-[10px]">
              {userTimeSheets.length > 0
                ? userTimeSheets.map((timesheet) => {
                    const isExpanded = expandedIds.has(timesheet.id);

                    // Filter equipment logs based on timesheet startTime and endTime

                    return (
                      <Holds
                        key={timesheet.id}
                        className="w-full even:bg-gray-200 odd:bg-gray-100 rounded-[10px] p-4 mb-4 cursor-pointer"
                      >
                        {/* Always show the header */}
                        {isExpanded ? (
                          <Holds
                            position={"row"}
                            className="w-full h-full gap-4 "
                          >
                            <Holds
                              position={"row"}
                              className="mt-4 justify-between "
                            >
                              <Buttons
                                background={"red"}
                                position={"left"}
                                className="w-1/3 py-2"
                                onClick={() =>
                                  handleDelete(timesheet.id, "timesheet")
                                }
                              >
                                <Texts size={"p5"}>{t("Delete")}</Texts>
                              </Buttons>
                              <Holds className=" w-1/3 h-full">
                                <Selects
                                  value={timesheet.status}
                                  onChange={(e) =>
                                    handleInputChange(
                                      timesheet.id,
                                      "status",
                                      e.target.value
                                    )
                                  }
                                >
                                  <option value="PENDING">
                                    {t("Pending")}
                                  </option>
                                  <option value="APPROVED">
                                    {t("Approved")}
                                  </option>
                                  <option value="DENIED">{t("Denied")}</option>
                                </Selects>
                              </Holds>
                            </Holds>

                            <Holds className="w-[10%] h-full">
                              <Images
                                titleImg="/expandLeft.svg"
                                titleImgAlt="clock in"
                                className="rotate-[270deg] my-auto"
                                size={"50"}
                                onClick={() => toggleExpanded(timesheet.id)} // Toggle on click
                              />
                            </Holds>
                          </Holds>
                        ) : null}
                        <Inputs type="hidden" value={timesheet.id} />
                        <Inputs type="hidden" value={timesheet.userId} />
                        {/* ----------------------------------------------------------------------------*/}
                        {/* ----------------------------------------------------------------------------*/}
                        <Holds
                          position={"row"}
                          className="h-full w-full my-auto relative"
                        >
                          <Holds
                            position={"row"}
                            className="w-full h-full gap-4"
                          >
                            <Holds className=" h-full">
                              <Labels size={"p6"}>{t("StartTime")}</Labels>
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
                            <Holds className=" h-full">
                              <Labels size={"p6"}>{t("EndTime")}</Labels>
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

                          {isExpanded ? null : (
                            <Holds className="w-[10%] h-full  ml-4">
                              <div
                                className={
                                  timesheet.status === "APPROVED"
                                    ? "min-w-fit w-7 h-fit rounded-full bg-app-green mx-auto"
                                    : timesheet.status === "PENDING"
                                    ? "min-w-fit w-7 h-fit rounded-full bg-app-orange mx-auto"
                                    : "min-w-fit w-7 h-fit rounded-full bg-app-red mx-auto"
                                }
                              >
                                <Texts size={"p6"} className="text-center">
                                  {timesheet.status === "APPROVED"
                                    ? "A"
                                    : timesheet.status === "PENDING"
                                    ? "P"
                                    : "D"}
                                </Texts>
                              </div>

                              {/* <Images 
                                titleImg={timesheet.status === "APPROVED" ? "/approved.svg" : timesheet.status === "PENDING" ? "/pending.svg" : "/denied.svg"}
                                titleImgAlt="status"
                                className="rotate-[270deg] my-auto"
                                size={"50"}
                                /> */}
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
                                  <Labels size={"p6"}>
                                    {t("DateOfShift")}
                                  </Labels>
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
                                <Labels size={"p6"}>
                                  {t("DurationUpdatesAuto")}
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
                                <Labels size={"p6"}>
                                  {t("TimesheetComment")}
                                </Labels>
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
                                <Labels size={"p6"}>{t("Jobsite")}</Labels>

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
                                  onClick={() =>
                                    openTimesheetSearch(
                                      timesheet.id?.toString() || ""
                                    )
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>

                              <Holds>
                                <Labels size={"p6"}>{t("CostCode")}</Labels>
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
                                  onClick={() =>
                                    openCostcodeSearch(
                                      timesheet.id?.toString() || ""
                                    )
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>
                            </Holds>
                            {/* Start of jobsite search Modal*/}
                            <SearchModal
                              isOpen={
                                jobsiteSearchOpen &&
                                currentSheetId === timesheet.id?.toString()
                              }
                              renderItem={(item): React.ReactNode =>
                                `${item.name} - ${item.qrId}`
                              }
                              handleClose={closeTimesheetSearch}
                              list={jobFilteredList}
                              filterFunction={(jobsite, searchTerm) =>
                                jobsite.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              }
                              onItemClick={(jobsite) => {
                                handleInputChange(
                                  timesheet.id,
                                  "jobsiteId",
                                  jobsite.qrId
                                );
                              }}
                              placeholder="Search jobsite by name"
                            />
                            {/* Start of costcode search Modal*/}

                            <SearchModal
                              isOpen={
                                costcodeSearchOpen &&
                                currentSheetId === timesheet.id?.toString()
                              }
                              handleClose={closeCostcodeSearch}
                              list={ccFilteredList.map((costcode) => ({
                                id: costcode.id.toString(),
                                name: costcode.name,
                                description: costcode.description,
                              }))}
                              renderItem={(item): React.ReactNode =>
                                `${item.name} - ${item.description}`
                              }
                              filterFunction={(costcode, searchTerm) =>
                                costcode.name
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              }
                              onItemClick={(costcode) => {
                                handleInputChange(
                                  timesheet.id,
                                  "costcode",
                                  costcode.name
                                );
                              }}
                              placeholder="Search costcode by name"
                            />
                            {/* End of costcode search Modal*/}
                            <Holds
                              position={"row"}
                              className="h-full w-full mb-2 gap-4"
                            >
                              <Holds>
                                <Labels size={"p6"}>{t("VehicleID")}</Labels>
                                <EditableFields
                                  type="text"
                                  value={timesheet.vehicleId?.toString() || ""}
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
                                    revertTimesheet(timesheet.id, "vehicleId")
                                  }
                                  onClick={() =>
                                    openVehicleSearch(
                                      timesheet.id?.toString() || ""
                                    )
                                  }
                                  variant="default"
                                  size="default"
                                />
                              </Holds>
                              <Holds
                                position={"row"}
                                className="h-full w-full mb-2 gap-4"
                              >
                                {timesheet.vehicleId && (
                                  <Holds>
                                    <Labels size={"p6"}>
                                      {t("StartingMileage")}
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
                                )}
                              </Holds>
                            </Holds>
                            {/* Start of jobsite search Modal*/}
                            <SearchModal
                              isOpen={
                                vehiclesSearchOpen &&
                                currentSheetId === timesheet.id?.toString()
                              }
                              renderItem={(item): React.ReactNode =>
                                `${item.qrId} - ${item.name}`
                              }
                              handleClose={closeVehiclesSearch}
                              list={vehicleFilteredList
                                .filter(
                                  (vehicle) =>
                                    vehicle.name &&
                                    !vehicle.qrId.startsWith("EQ-") // Exclude names starting with "EQ-"
                                )
                                .map((vehicle) => ({
                                  id: vehicle.id.toString(),
                                  name: vehicle.name,
                                  qrId: vehicle.qrId,
                                  equipmentTag: vehicle.equipmentTag,
                                }))} // Prepare the list structure
                              filterFunction={
                                (jobsite, searchTerm) =>
                                  jobsite.name
                                    .toLowerCase()
                                    .includes(searchTerm.toLowerCase()) // Match searchTerm dynamically
                              }
                              onItemClick={(vehicle) => {
                                handleInputChange(
                                  timesheet.id,
                                  "vehicleId",
                                  vehicle.name
                                );
                              }}
                              placeholder="Search Vehicle by name"
                            />
                            {/* If the time sheet has a vehicle ID, show Vehicle ID, Starting Mileage, and Ending Mileage and all truck details */}
                            {timesheet.vehicleId && (
                              <>
                                <Holds
                                  position={"row"}
                                  className="h-full w-full mb-2 gap-4"
                                >
                                  <Holds>
                                    <Labels size={"p6"}>
                                      {t("EndingMileage")}
                                    </Labels>
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
                                    <Labels size={"p6"}>
                                      {t("LeftIdaho")}
                                    </Labels>
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
                                    <Labels size={"p6"}>
                                      {t("RefuelingGallons")}
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
                                    <Labels size={"p6"}>
                                      {t("NumberOfHauledLoads")}
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
                                    <Labels size={"p6"}>
                                      {t("EquipmentHauled")}
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
                                    <Labels size={"p6"}>
                                      {t("MaterialsHauled")}
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
                          </>
                        )}
                      </Holds>
                    );
                  })
                : null}

              {equipmentLogs.length > 0 &&
                equipmentLogs.map((log) => {
                  const isExpanded = expandedIds.has(log.id?.toString() || "");

                  return (
                    <Holds
                      key={log.id?.toString() || ""}
                      className="w-full even:bg-gray-200 odd:bg-gray-100 rounded-[10px] p-4 mb-4 cursor-pointer"
                    >
                      {isExpanded && (
                        <Holds position="row">
                          <Holds className="mt-4 ">
                            <Buttons
                              background={"red"}
                              position={"left"}
                              className="w-1/3 py-2"
                              onClick={() =>
                                handleDelete(log.id?.toString() || "", "log")
                              }
                            >
                              <Texts size={"p5"}>{t("Delete")}</Texts>
                            </Buttons>
                          </Holds>
                          <Holds className=" w-[10%] h-full">
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="clock in"
                              className="rotate-[270deg] my-auto"
                              size={"50"}
                              onClick={() =>
                                toggleExpanded(log.id?.toString() || "")
                              }
                            />
                          </Holds>
                        </Holds>
                      )}

                      <Holds position="row" className="w-full h-full gap-4 ">
                        <Holds className="w-[50%] h-full">
                          <Labels size={"p6"}>{t("EquipmentName")}</Labels>
                          <EditableFields
                            type="text"
                            value={
                              equipmentSearchList.find(
                                (eq) => eq.id === log.equipmentId
                              )?.name || ""
                            }
                            onChange={(e) => {
                              const selectedEquipment =
                                equipmentSearchList.find(
                                  (eq) => eq.name === e.target.value
                                );
                              if (selectedEquipment) {
                                handleEquipmentLogChange(
                                  log.id?.toString() || "",
                                  "equipmentId",
                                  selectedEquipment.id
                                );
                              }
                            }}
                            isChanged={isEquipmentFieldChanged(
                              log.id?.toString() || "",
                              "equipmentId"
                            )}
                            onRevert={() =>
                              revertEquipmentLog(
                                log.id?.toString() || "",
                                "equipmentId"
                              )
                            }
                            onClick={() =>
                              openEquipmentSearch(log.id?.toString() || "")
                            }
                            variant="default"
                            size="default"
                          />
                        </Holds>
                        {/* Duration */}
                        <Holds className="w-[50%] h-full">
                          <Labels size={"p6"}>
                            {t("DurationUpdatesAuto")}
                          </Labels>
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
                        {isExpanded ? null : (
                          <Holds className="w-[10%] h-full ">
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="clock in"
                              className="rotate-90 my-auto"
                              size={"50"}
                              onClick={() =>
                                toggleExpanded(log.id?.toString() || "")
                              }
                            />
                          </Holds>
                        )}
                      </Holds>
                      {/* Equipment Search modal */}
                      <SearchModal
                        isOpen={
                          equipmentSearchOpen &&
                          currentLogId === log.id?.toString()
                        }
                        handleClose={closeEquipmentSearch}
                        list={equipmentSearchList.map((equipment) => ({
                          id: equipment.id.toString(),
                          name: equipment.name,
                        }))}
                        filterFunction={(equipment, searchTerm) =>
                          equipment.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        }
                        onItemClick={(equipment) => {
                          handleEquipmentLogChange(
                            currentLogId || "",
                            "equipmentId",
                            equipment.id
                          );
                        }}
                        placeholder="Search equipment by name"
                      />
                      {isExpanded && (
                        <>
                          {/* Start Time */}
                          <Holds className="my-auto w-full">
                            <Holds
                              position="row"
                              className="my-auto w-full gap-4"
                            >
                              <Holds>
                                <Labels size={"p6"}>{t("StartTime")}</Labels>
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
                                <Labels size={"p6"}>{t("EndTime")}</Labels>
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
                              <Holds className="">
                                <Labels size={"p6"}>{t("IsRefueled")}</Labels>
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
                                {log.isRefueled && (
                                  <>
                                    <Labels size={"p6"}>{t("FuelUsed")}</Labels>
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
                                  </>
                                )}
                              </Holds>
                            </Holds>

                            <Holds>
                              <Labels size={"p6"}>{t("Comment")}</Labels>
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
                          <Texts size={"p6"}>
                            {t("NoTimesheetOrLogsFound")}
                          </Texts>
                        }
                      />
                    </Holds>
                  )}
                </>
              )}
              {userTimeSheets.length === 0 && equipmentLogs.length === 0 && (
                <Holds className="row-span-12 col-span-5 w-full h-full">
                  <EmptyView
                    Children={
                      <Texts size={"p6"}>{t("NoTimesheetOrLogsFound")}</Texts>
                    }
                  />
                </Holds>
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
              <Texts size={"p6"}>{t("SubmitTimesheet")}</Texts>
            </Buttons>
          </Holds>

          <Holds className="row-start-12 row-end-13 col-start-4 col-end-6 h-full">
            <Holds position={"row"} className="w-full h-full gap-4">
              <Selects
                className="my-auto text-sm"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
              >
                <option value="timesheets">{t("Timesheets")}</option>
                <option value="logs">{t("Logs")}</option>
              </Selects>
              <Buttons
                background={"green"}
                className="w-1/3 h-full"
                onClick={
                  selectedOption === "timesheets"
                    ? createNewTimesheet
                    : createNewLog
                }
              >
                <Texts size={"p6"}>+</Texts>
              </Buttons>
            </Holds>
          </Holds>
        </>
      )}
    </Grids>
  );
};
