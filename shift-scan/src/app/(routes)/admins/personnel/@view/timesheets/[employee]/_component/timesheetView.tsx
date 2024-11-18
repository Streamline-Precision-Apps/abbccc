import EmptyView from "@/app/(routes)/admins/_pages/EmptyView";
import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Texts } from "@/components/(reusable)/texts";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  startTime?: string;
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
  qrId: string;
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
  const [originalEquipmentLogs, setOriginalEquipmentLogs] =
    useState<EmployeeEquipmentLog[]>();
  const [error, setError] = useState<string | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()); // Track expanded timesheet IDs

  useEffect(() => {
    const fetchTimesheets = async () => {
      if (!params.employee) {
        setError("Invalid employee ID.");
        return;
      }
      if (dateByFilter === "" || dateByFilter === null) {
        return;
      }
      try {
        const response = await fetch(
          `/api/getAllTimesheetsByDate/${params.employee}?date=${dateByFilter}`
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
    };
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

  const handleDateClick = (newDate: string) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("date", newDate);
    router.push(`?${updatedSearchParams.toString()}`);
  };

  const handleInputChange = (id: string, field: string, value: unknown) => {
    setUserTimeSheets((prev) =>
      prev.map((sheet) =>
        sheet.id === id ? { ...sheet, [field]: value } : sheet
      )
    );
  };
  const handleEquipmentLogChange = (
    id: string,
    field: string,
    value: unknown
  ) => {
    setEquipmentLogs((prev) =>
      prev.map((sheet) =>
        sheet.id?.toString() === id ? { ...sheet, [field]: value } : sheet
      )
    );
  };

  const revertTimesheet = (id: string, field: keyof TimeSheet) => {
    setUserTimeSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.id === id) {
          const originalSheet = originalTimeSheets.find(
            (original) => original.id === id
          );
          return originalSheet
            ? { ...sheet, [field]: originalSheet[field] } // Reset only the specified field
            : sheet; // If no original found, return the current sheet
        }
        return sheet; // For other sheets, return as-is
      })
    );
  };
  const isFieldChanged = (id: string, field: keyof TimeSheet) => {
    const userSheet = userTimeSheets.find((sheet) => sheet.id === id);
    const originalSheet = originalTimeSheets.find((sheet) => sheet.id === id);
    return userSheet?.[field] !== originalSheet?.[field];
  };

  const revertEquipmentLog = (id: string) => {
    setOriginalEquipmentLogs((prev) =>
      prev?.map((sheet) =>
        sheet.id?.toString() === id
          ? equipmentLogs.find((original) => original.id?.toString() === id) ||
            sheet
          : sheet
      )
    );
  };

  const isEquipmentFieldChanged = (
    id: string,
    field: keyof EmployeeEquipmentLog
  ) => {
    const equipmentSheet = equipmentLogs.find(
      (sheet) => sheet.id?.toString() === id
    );
    const originalEquipmentLogs = equipmentLogs.find(
      (sheet) => sheet.id?.toString() === id
    );
    return equipmentSheet?.[field] !== originalEquipmentLogs?.[field];
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
              {userTimeSheets.length > 0 ? (
                userTimeSheets.map((timesheet) => {
                  const isExpanded = expandedIds.has(timesheet.id);

                  // Filter equipment logs based on timesheet startTime and endTime
                  const filteredLogs = equipmentLogs.filter((log) => {
                    return (
                      log.startTime &&
                      log.endTime &&
                      timesheet.startTime &&
                      timesheet.endTime &&
                      new Date(log.startTime) >=
                        new Date(timesheet.startTime) &&
                      new Date(log.endTime) <= new Date(timesheet.endTime)
                    );
                  });
                  return (
                    <Holds
                      key={timesheet.id}
                      className="w-full even:bg-gray-200 odd:bg-gray-100 rounded-[10px] px-2 py-3 mb-4 cursor-pointer"
                    >
                      {/* Always show the header */}
                      <Holds
                        position={"row"}
                        className="h-full w-full mb-2 relative"
                      >
                        <Inputs type="hidden" value={timesheet.id} />
                        <Inputs type="hidden" value={timesheet.userId} />
                        {/* ----------------------------------------------------------------------------*/}
                        {/* ----------------------------------------------------------------------------*/}
                        <Holds
                          position={"row"}
                          className="h-full w-full mr-2 gap-4"
                        >
                          <Holds className="w-2/5 my-auto h-full">
                            <Labels size="p4">Start Time</Labels>
                            <Holds
                              position="row"
                              className="gap-2 items-center"
                            >
                              {/* Editable Input */}
                              <Inputs
                                type="time"
                                value={
                                  timesheet.startTime &&
                                  !isNaN(
                                    new Date(timesheet.startTime).getTime()
                                  )
                                    ? new Date(timesheet.startTime)
                                        .toISOString()
                                        .substring(11, 16) // HH:mm format
                                    : ""
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    timesheet.id,
                                    "startTime",
                                    `1970-01-01T${e.target.value}:00Z` // Convert HH:mm to ISO format
                                  )
                                }
                                className={
                                  isFieldChanged(timesheet.id, "startTime")
                                    ? "border-app-orange" // Highlight when changed
                                    : ""
                                }
                              />

                              {/* Revert Button */}
                              {isFieldChanged(timesheet.id, "startTime") && (
                                <Buttons
                                  background={"none"}
                                  type="button"
                                  className="w-1/6"
                                  title="Revert changes"
                                  onClick={() =>
                                    revertTimesheet(timesheet.id, "startTime")
                                  }
                                >
                                  <Holds>
                                    <Images
                                      titleImg={"/turnBack.svg"}
                                      titleImgAlt={"revert"}
                                      size={"70"}
                                    />
                                  </Holds>
                                </Buttons>
                              )}
                            </Holds>
                          </Holds>
                          {/* ----------------------------------------------------------------------------*/}
                          {/* ----------------------------------------------------------------------------*/}
                          <Holds className="w-2/5">
                            <Labels size={"p4"}>End Time</Labels>
                            <Inputs
                              type="time"
                              value={
                                timesheet.endTime &&
                                !isNaN(new Date(timesheet.endTime).getTime())
                                  ? new Date(timesheet.endTime)
                                      .toISOString()
                                      .substring(11, 16) // Convert to HH:mm
                                  : ""
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  timesheet.id,
                                  "endTime",
                                  `1970-01-01T${e.target.value}:00Z` // Convert HH:mm back to ISO format
                                )
                              }
                              className={
                                isFieldChanged(timesheet.id, "endTime")
                                  ? "border-app-orange" // Highlight when changed
                                  : ""
                              }
                            />

                            {/* Revert Button */}
                            {isFieldChanged(timesheet.id, "endTime") && (
                              <Buttons
                                background={"none"}
                                type="button"
                                className="w-1/6"
                                title="Revert changes"
                                onClick={() =>
                                  revertTimesheet(timesheet.id, "endTime")
                                }
                              >
                                <Holds>
                                  <Images
                                    titleImg={"/turnBack.svg"}
                                    titleImgAlt={"revert"}
                                    size={"70"}
                                  />
                                </Holds>
                              </Buttons>
                            )}
                          </Holds>
                        </Holds>
                        {/* ----------------------------------------------------------------------------*/}
                        {/* ----------------------------------------------------------------------------*/}
                        {isExpanded ? (
                          <Holds className="w-1/5">
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="clock in"
                              className="rotate-[270deg]"
                              size={"30"}
                              onClick={() => toggleExpanded(timesheet.id)} // Toggle on click
                            />
                          </Holds>
                        ) : (
                          <Holds className="w-1/5">
                            <Images
                              titleImg="/expandLeft.svg"
                              titleImgAlt="clock in"
                              className="rotate-90"
                              size={"30"}
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
                            className="h-full w-full mb-2 gap-4"
                          >
                            <Holds className="w-1/2">
                              <Labels size={"p4"}>Date of Shift</Labels>
                              <Inputs
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
                                className={
                                  isFieldChanged(timesheet.id, "date")
                                    ? "border-app-orange" // Highlight when changed
                                    : ""
                                }
                              />
                            </Holds>

                            {/* Revert Button */}
                            {isFieldChanged(timesheet.id, "date") && (
                              <Buttons
                                background={"none"}
                                type="button"
                                className="w-1/6"
                                title="Revert changes"
                                onClick={() =>
                                  revertTimesheet(timesheet.id, "date")
                                }
                              >
                                <Holds>
                                  <Images
                                    titleImg={"/turnBack.svg"}
                                    titleImgAlt={"revert"}
                                    size={"70"}
                                  />
                                </Holds>
                              </Buttons>
                            )}
                          </Holds>

                          <Holds
                            position={"row"}
                            className="h-full w-full mb-2 gap-4"
                          >
                            <Holds>
                              <Labels size={"p4"}>Timesheet comment</Labels>
                              <TextAreas
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
                            </Holds>
                          </Holds>
                          <Holds
                            position={"row"}
                            className="h-full w-full mb-2 gap-4"
                          >
                            <Holds>
                              <Labels size={"p4"}>Jobsite</Labels>
                              <Holds position={"row"}>
                                <Inputs
                                  type="text"
                                  value={timesheet.jobsiteId}
                                  onChange={(e) =>
                                    handleInputChange(
                                      timesheet.id,
                                      "jobsiteId",
                                      e.target.value
                                    )
                                  }
                                  className={
                                    isFieldChanged(timesheet.id, "jobsiteId")
                                      ? "border-app-orange" // Highlight when changed
                                      : ""
                                  }
                                />

                                {/* Revert Button */}
                                {isFieldChanged(timesheet.id, "jobsiteId") && (
                                  <Buttons
                                    background={"none"}
                                    type="button"
                                    className="w-1/6"
                                    title="Revert changes"
                                    onClick={() =>
                                      revertTimesheet(timesheet.id, "jobsiteId")
                                    }
                                  >
                                    <Holds>
                                      <Images
                                        titleImg={"/turnBack.svg"}
                                        titleImgAlt={"revert"}
                                        size={"70"}
                                      />
                                    </Holds>
                                  </Buttons>
                                )}
                              </Holds>
                            </Holds>
                            <Holds>
                              <Labels size={"p4"}>Cost Code</Labels>
                              <Holds position={"row"}>
                                <Inputs
                                  type="text"
                                  value={timesheet.costcode}
                                  onChange={(e) =>
                                    handleInputChange(
                                      timesheet.id,
                                      "costcode",
                                      e.target.value
                                    )
                                  }
                                  className={
                                    isFieldChanged(timesheet.id, "costcode")
                                      ? "border-app-orange" // Highlight when changed
                                      : ""
                                  }
                                />

                                {/* Revert Button */}
                                {isFieldChanged(timesheet.id, "costcode") && (
                                  <Buttons
                                    background={"none"}
                                    type="button"
                                    className="w-1/6"
                                    title="Revert changes"
                                    onClick={() =>
                                      revertTimesheet(timesheet.id, "costcode")
                                    }
                                  >
                                    <Holds>
                                      <Images
                                        titleImg={"/turnBack.svg"}
                                        titleImgAlt={"revert"}
                                        size={"70"}
                                      />
                                    </Holds>
                                  </Buttons>
                                )}
                              </Holds>
                            </Holds>
                          </Holds>

                          {/* If the time sheet has a vehicle ID, show Vehicle ID, Starting Mileage, and Ending Mileage and all truck details */}
                          {timesheet.vehicleId && (
                            <>
                              <Holds
                                position={"row"}
                                className="h-full w-full mb-2 gap-4"
                              >
                                <Holds>
                                  <Labels size={"p4"}>Vehicle ID</Labels>
                                  <Inputs
                                    type="text"
                                    value={timesheet.vehicleId?.toString()}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "vehicleId",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(timesheet.id, "vehicleId")
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "vehicleId"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "vehicleId"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>

                                <Holds>
                                  <Labels size={"p4"}>Starting Mileage</Labels>
                                  <Inputs
                                    type="text"
                                    value={timesheet.startingMileage?.toString()}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "startingMileage",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(
                                        timesheet.id,
                                        "startingMileage"
                                      )
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "startingMileage"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "startingMileage"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>
                              </Holds>
                              <Holds
                                position={"row"}
                                className="h-full w-full mb-2 gap-4"
                              >
                                <Holds>
                                  <Labels size={"p4"}>Ending Mileage</Labels>
                                  <Inputs
                                    type="text"
                                    value={timesheet.endingMileage?.toString()}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "endingMileage",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(
                                        timesheet.id,
                                        "endingMileage"
                                      )
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "endingMileage"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "endingMileage"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>
                                <Holds>
                                  <Labels size={"p4"}>Left Idaho?</Labels>
                                  <Inputs
                                    type="text"
                                    value={timesheet.leftIdaho ? "Yes" : "No"}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "leftIdaho",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(timesheet.id, "leftIdaho")
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "leftIdaho"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "leftIdaho"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>
                              </Holds>
                              <Holds
                                position={"row"}
                                className="h-full w-full mb-2 gap-4"
                              >
                                <Holds>
                                  <Labels size={"p4"}>Refueling Gallons</Labels>
                                  <Inputs
                                    type="number"
                                    value={timesheet.refuelingGallons?.toString()}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "refuelingGallons",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(
                                        timesheet.id,
                                        "refuelingGallons"
                                      )
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "refuelingGallons"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "refuelingGallons"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>
                                <Holds>
                                  <Labels size={"p4"}>
                                    # of Hauled Loads{" "}
                                  </Labels>
                                  <Inputs
                                    type="text"
                                    value={timesheet.hauledLoadsQuantity?.toString()}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "hauledLoadsQuantity",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(
                                        timesheet.id,
                                        "hauledLoadsQuantity"
                                      )
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "hauledLoadsQuantity"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "hauledLoadsQuantity"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>
                              </Holds>
                              <Holds
                                position={"row"}
                                className="h-full w-full mb-2 gap-4"
                              >
                                <Holds>
                                  <Labels size={"p4"}>Equipment Hauled</Labels>
                                  <Inputs
                                    type="text"
                                    value={timesheet.equipmentHauled?.toString()}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "equipmentHauled",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(
                                        timesheet.id,
                                        "equipmentHauled"
                                      )
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "equipmentHauled"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "equipmentHauled"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>
                                <Holds>
                                  <Labels size={"p4"}>Materials Hauled</Labels>
                                  <Inputs
                                    type="text"
                                    value={timesheet.materialsHauled?.toString()}
                                    onChange={(e) =>
                                      handleInputChange(
                                        timesheet.id,
                                        "materialsHauled",
                                        e.target.value
                                      )
                                    }
                                    className={
                                      isFieldChanged(
                                        timesheet.id,
                                        "materialsHauled"
                                      )
                                        ? "border-app-orange" // Highlight when changed
                                        : ""
                                    }
                                  />

                                  {/* Revert Button */}
                                  {isFieldChanged(
                                    timesheet.id,
                                    "materialsHauled"
                                  ) && (
                                    <Buttons
                                      background={"none"}
                                      type="button"
                                      className="w-1/6"
                                      title="Revert changes"
                                      onClick={() =>
                                        revertTimesheet(
                                          timesheet.id,
                                          "materialsHauled"
                                        )
                                      }
                                    >
                                      <Holds>
                                        <Images
                                          titleImg={"/turnBack.svg"}
                                          titleImgAlt={"revert"}
                                          size={"70"}
                                        />
                                      </Holds>
                                    </Buttons>
                                  )}
                                </Holds>
                              </Holds>
                            </>
                          )}
                          {/* Equipment Logs */}

                          {isExpanded && (
                            <Holds className="h-full w-full mb-4">
                              <Labels size="p4">Equipment Logs</Labels>
                              {filteredLogs.length > 0 ? (
                                filteredLogs.map((log, index) => (
                                  <Holds
                                    key={log.id || index}
                                    className="border-[1px] border-gray-300 rounded-[8px] p-3 mb-2"
                                  >
                                    {/* Equipment Name */}
                                    <Holds>
                                      <Labels size="p4">Equipment Name</Labels>
                                      <Holds
                                        position="row"
                                        className="gap-2 items-center"
                                      >
                                        <Inputs
                                          type="text"
                                          value={log.Equipment?.name || ""}
                                          onChange={(e) =>
                                            handleEquipmentLogChange(
                                              log.id?.toString() || "",
                                              "Equipment",
                                              {
                                                ...log.Equipment,
                                                name: e.target.value,
                                              }
                                            )
                                          }
                                          className={
                                            isEquipmentFieldChanged(
                                              log.id?.toString() || "",
                                              "Equipment"
                                            )
                                              ? "border-app-orange"
                                              : ""
                                          }
                                        />
                                        {isEquipmentFieldChanged(
                                          log.id?.toString() || "",
                                          "Equipment"
                                        ) && (
                                          <Buttons
                                            background="none"
                                            type="button"
                                            className="w-1/6"
                                            title="Revert changes"
                                            onClick={() =>
                                              revertEquipmentLog(
                                                log.id?.toString() || ""
                                              )
                                            }
                                          >
                                            <Holds>
                                              <Images
                                                titleImg={"/turnBack.svg"}
                                                titleImgAlt={"revert"}
                                                size="70"
                                              />
                                            </Holds>
                                          </Buttons>
                                        )}
                                      </Holds>
                                    </Holds>

                                    {/* Start Time */}
                                    <Holds
                                      position="row"
                                      className="my-2 gap-4"
                                    >
                                      <Holds>
                                        <Labels size="p4">Start Time</Labels>
                                        <Holds
                                          position="row"
                                          className="gap-2 items-center"
                                        >
                                          <Inputs
                                            type="time"
                                            value={
                                              log.startTime &&
                                              !isNaN(
                                                new Date(
                                                  log.startTime
                                                ).getTime()
                                              )
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
                                            className={
                                              isEquipmentFieldChanged(
                                                log.id?.toString() || "",
                                                "startTime"
                                              )
                                                ? "border-app-orange"
                                                : ""
                                            }
                                          />
                                          {isEquipmentFieldChanged(
                                            log.id?.toString() || "",
                                            "startTime"
                                          ) && (
                                            <Buttons
                                              background="none"
                                              type="button"
                                              className="w-1/6"
                                              title="Revert changes"
                                              onClick={() =>
                                                revertEquipmentLog(
                                                  log.id?.toString() || ""
                                                )
                                              }
                                            >
                                              <Holds>
                                                <Images
                                                  titleImg={"/turnBack.svg"}
                                                  titleImgAlt={"revert"}
                                                  size="70"
                                                />
                                              </Holds>
                                            </Buttons>
                                          )}
                                        </Holds>
                                      </Holds>

                                      {/* End Time */}
                                      <Holds>
                                        <Labels size="p4">End Time</Labels>
                                        <Holds
                                          position="row"
                                          className="gap-2 items-center"
                                        >
                                          <Inputs
                                            type="time"
                                            value={
                                              log.endTime &&
                                              !isNaN(
                                                new Date(log.endTime).getTime()
                                              )
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
                                            className={
                                              isEquipmentFieldChanged(
                                                log.id?.toString() || "",
                                                "endTime"
                                              )
                                                ? "border-app-orange"
                                                : ""
                                            }
                                          />
                                          {isEquipmentFieldChanged(
                                            log.id?.toString() || "",
                                            "endTime"
                                          ) && (
                                            <Buttons
                                              background="none"
                                              type="button"
                                              className="w-1/6"
                                              title="Revert changes"
                                              onClick={() =>
                                                revertEquipmentLog(
                                                  log.id?.toString() || ""
                                                )
                                              }
                                            >
                                              <Holds>
                                                <Images
                                                  titleImg={"/turnBack.svg"}
                                                  titleImgAlt={"revert"}
                                                  size="70"
                                                />
                                              </Holds>
                                            </Buttons>
                                          )}
                                        </Holds>
                                      </Holds>
                                    </Holds>

                                    {/* Duration */}
                                    <Holds>
                                      <Labels size="p4">
                                        Duration (updates manually)
                                      </Labels>
                                      <Inputs
                                        type="text"
                                        value={log.duration?.toFixed(2) || ""}
                                        onChange={(e) =>
                                          handleEquipmentLogChange(
                                            log.id?.toString() || "",
                                            "duration",
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        className={
                                          isEquipmentFieldChanged(
                                            log.id?.toString() || "",
                                            "duration"
                                          )
                                            ? "border-app-orange"
                                            : ""
                                        }
                                      />
                                    </Holds>
                                  </Holds>
                                ))
                              ) : (
                                <Texts size={"p4"}>
                                  No Equipment Logs Available
                                </Texts>
                              )}
                            </Holds>
                          )}
                        </>
                      )}
                    </Holds>
                  );
                })
              ) : (
                <EmptyView Children={undefined} />
              )}
            </Holds>
          </Holds>
          <Holds
            position={"row"}
            className="row-start-12 row-end-13 col-start-1 col-end-3 h-full"
          >
            <Buttons background={"green"} className="w-full h-full">
              <Texts size={"p4"}>Submit Timesheet</Texts>
            </Buttons>
          </Holds>

          <Holds
            position={"row"}
            className="row-start-12 row-end-13 col-start-5 col-end-6 h-full"
          >
            <Buttons background={"green"} className="w-full h-full">
              <Texts size={"p4"}>+</Texts>
            </Buttons>
          </Holds>
        </>
      )}
    </Grids>
  );
};
