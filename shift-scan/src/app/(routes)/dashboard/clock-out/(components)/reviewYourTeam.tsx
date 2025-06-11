import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { crewUsers, TimesheetFilter } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import TimeSheetRenderer from "@/app/(routes)/dashboard/myTeam/[id]/employee/[employeeId]/timeSheetRenderer";
import { approvePendingTimesheets } from "@/actions/timeSheetActions";
import { Buttons } from "@/components/(reusable)/buttons";

const FILTER_OPTIONS: {
  value: TimesheetFilter | "trucking" | "tasco";
  label: string;
}[] = [
  { value: "timesheetHighlights", label: "Time Sheet Highlights" },
  { value: "trucking", label: "Trucking" },
  { value: "tasco", label: "TASCO" },
  { value: "equipmentLogs", label: "Equipment Logs" },
];

const TRUCKING_TABS: { value: TimesheetFilter; label: string; icon: string }[] =
  [
    { value: "truckingMileage", label: "Mileage", icon: "/mileage.svg" },
    { value: "truckingRefuelLogs", label: "Refuel Logs", icon: "/refuel.svg" },
    { value: "truckingStateLogs", label: "State Logs", icon: "/state.svg" },
    {
      value: "truckingEquipmentHaulLogs",
      label: "Haul Logs",
      icon: "/hauling.svg",
    },
    {
      value: "truckingMaterialHaulLogs",
      label: "Material Logs",
      icon: "/form.svg",
    },
  ];
const TASCO_TABS: { value: TimesheetFilter; label: string; icon: string }[] = [
  { value: "tascoHaulLogs", label: "Haul Logs", icon: "/hauling.svg" },
  { value: "tascoRefuelLogs", label: "Refuel Logs", icon: "/refuel.svg" },
];

interface ReviewYourTeamProps {
  handleClick: () => void;
  prevStep: () => void;
  loading: boolean;
  manager: string; // should be string, not boolean
  setEditDate: (date: string) => void;
  editFilter: TimesheetFilter | null;
  setEditFilter: (filter: TimesheetFilter | null) => void;
  focusIds: string[];
  setFocusIds: (ids: string[]) => void;
  setEmployeeId: (id: string) => void;
  crewMembers?: crewUsers[];
}

const ReviewYourTeam: React.FC<ReviewYourTeamProps> = ({
  handleClick,
  prevStep,
  loading,
  manager,
  setEditDate,
  editFilter,
  setEditFilter,
  focusIds,
  setFocusIds,
  setEmployeeId,
  crewMembers = [],
}) => {
  const t = useTranslations("Clock");
  const [pendingTimesheets, setPendingTimesheets] = useState<
    Record<string, any[]>
  >({});
  const [dataLoaded, setDataLoaded] = useState(false); // Track when data is loaded
  const [focusIndex, setFocusIndex] = useState(0);
  const [filter, setFilter] = useState<
    "timesheetHighlights" | "trucking" | "tasco" | "equipmentLogs"
  >("timesheetHighlights");
  const [truckingTab, setTruckingTab] =
    useState<TimesheetFilter>("truckingMileage");
  const [tascoTab, setTascoTab] = useState<TimesheetFilter>("tascoHaulLogs");

  // Filter out crew members with no unapproved timesheets (but allow incomplete)
  const filteredCrewMembers = crewMembers.filter((member) => {
    const timesheets = pendingTimesheets[member.id] || [];
    return timesheets.length > 0;
  });
  // Adjust focusIndex if needed
  useEffect(() => {
    if (focusIndex >= filteredCrewMembers.length) {
      setFocusIndex(0);
    }
  }, [filteredCrewMembers.length]);
  const focusUser = filteredCrewMembers[focusIndex];
  // Fetch all pending timesheets for all users on mount
  useEffect(() => {
    const fetchPending = async () => {
      if (!crewMembers.length) {
        console.log("No crew members provided, marking as loaded");
        setHasNoMembers(true);
        return;
      }

      try {
        const userIds = crewMembers.map((u) => u.id);
        const res = await fetch("/api/getPendingTeamTimesheets/[crewMembers]", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userIds }),
        });
        const data = await res.json();
        console.log(
          "Fetched pending timesheets:",
          Object.keys(data).length > 0
            ? `${Object.keys(data).length} users with data`
            : "No pending timesheets"
        );
        setPendingTimesheets(data);
        setDataLoaded(true); // Mark data as loaded after successful fetch
      } catch (error) {
        console.error("Error fetching pending timesheets:", error);
        // Mark as loaded even on error to avoid infinite loading
        setDataLoaded(true);
        setHasNoMembers(true);
      }
    };
    fetchPending();
  }, [crewMembers]);

  // Approve all pending timesheets for the focus user
  const handleApprove = async () => {
    if (!focusUser) return;
    const userTimesheets = pendingTimesheets[focusUser.id] || [];
    if (userTimesheets.length === 0) {
      // Move to next user
      if (focusIndex < filteredCrewMembers.length - 1) {
        setFocusIndex(focusIndex + 1);
        setEmployeeId(filteredCrewMembers[focusIndex + 1].id);
      } else {
        setEditFilter(null);
        handleClick();
      }
      return;
    }
    await approvePendingTimesheets(focusUser.id, manager);
    // Remove user from list and move to next
    const newCrew = filteredCrewMembers.filter((u, i) => i !== focusIndex);
    setFocusIds(newCrew.map((u) => u.id));
    if (focusIndex < newCrew.length) {
      setFocusIndex(focusIndex);
      setEmployeeId(newCrew[focusIndex]?.id || "");
    } else {
      setEditFilter(null);
      handleClick();
    }
  };

  // Edit button handler
  const handleEdit = () => {
    setEditDate(new Date().toISOString().slice(0, 10));
    setEditFilter(
      filter === "trucking"
        ? truckingTab
        : filter === "tasco"
        ? tascoTab
        : filter
    );
    setEmployeeId(focusUser.id);
    handleClick();
  }; // Debug data flow - moved up with other hooks to avoid conditional hooks
  useEffect(() => {
    if (dataLoaded && !loading) {
      const userTimesheets = pendingTimesheets[focusUser?.id] || [];

      // Only log when we have data to show
      if (userTimesheets.length > 0) {
        console.log("ReviewYourTeam debug data:", {
          // Input data structure
          timesheetData: userTimesheets.map((ts) => ({
            id: ts.id,
            hasEquipmentLogs: !!ts.EmployeeEquipmentLogs?.length,
            hasTascoLogs: !!ts.TascoLogs?.length,
            hasTruckingLogs: !!ts.TruckingLogs?.length,
            equipmentLogsCount: ts.EmployeeEquipmentLogs?.length || 0,
            tascoLogsCount: ts.TascoLogs?.length || 0,
            truckingLogsCount: ts.TruckingLogs?.length || 0,
            tascoLogs: ts.TascoLogs?.map(
              (tl: {
                id: string;
                RefuelLogs?: { length: number }[];
                shiftType?: string;
                materialType?: string;
                LoadQuantity?: number;
                Equipment?: { id: string; name: string } | null;
              }) => ({
                id: tl.id,
                hasRefuelLogs: !!tl.RefuelLogs?.length,
                refuelLogsCount: tl.RefuelLogs?.length || 0,
                shiftType: tl.shiftType,
                materialType: tl.materialType,
                LoadQuantity: tl.LoadQuantity,
                Equipment: tl.Equipment,
              })
            ),
          })),
        });
      }
    }
  }, [dataLoaded, loading, pendingTimesheets, focusUser?.id]);

  // Render correct data for filter/tab
  const getTimesheetData = () => {
    // Show all timesheets for the focus user, including incomplete
    const userTimesheets = pendingTimesheets[focusUser?.id] || [];
    //       TruckingLogs: ts.TruckingLogs?.map(tl => ({
    //         id: tl.id,
    //         Equipment: tl.Equipment,
    //         startingMileage: tl.startingMileage,
    //         endingMileage: tl.endingMileage
    //       }))
    //     }))
    //   });
    // }

    if (filter === "trucking") {
      return { filter: truckingTab, data: userTimesheets };
    }
    if (filter === "tasco") {
      return { filter: tascoTab, data: userTimesheets };
    }
    return { filter, data: userTimesheets };
  };

  // Helper to toggle selection for entity IDs (not employee IDs)
  const handleSelectEntity = (id: string) => {
    if (focusIds.includes(id)) {
      setFocusIds(focusIds.filter((fid) => fid !== id));
    } else {
      setFocusIds([...focusIds, id]);
    }
  };
  // Clear focusIds when returning from edit (when focusIds changes from non-empty to empty)
  useEffect(() => {
    if (focusIds.length === 0) {
      // No-op, but this ensures the UI resets
    }
  }, [focusIds]);
  // Use a separate state to track if we've loaded data and determined there are no members
  const [hasNoMembers, setHasNoMembers] = useState(false);
  // Handle case when no users are found - use a separate effect and state
  useEffect(() => {
    // Only run this check after we've loaded data
    if (dataLoaded && !loading) {
      console.log(
        `Data loaded. Filtered crew members: ${filteredCrewMembers.length}`
      );
      if (filteredCrewMembers.length === 0) {
        // Set flag that we've determined there are no members
        console.log(
          "No crew members with pending timesheets, will navigate away"
        );
        setHasNoMembers(true);
      }
    }
  }, [filteredCrewMembers.length, loading, dataLoaded]);

  // Separate effect for navigation to avoid render-during-render issues
  useEffect(() => {
    if (hasNoMembers) {
      console.log(
        "No team members with pending timesheets found, navigating to next step"
      );
      // Use setTimeout to defer state updates to next tick to avoid React warnings
      setTimeout(() => {
        setEditFilter(null);
        handleClick();
      }, 0);
    }
  }, [hasNoMembers, setEditFilter, handleClick]);

  if (loading) {
    return (
      <Bases>
        <Contents>
          <Holds className="h-full flex items-center justify-center">
            <Titles size="h2">{t("Loading")}</Titles>
          </Holds>
        </Contents>
      </Bases>
    );
  }

  if (!focusUser && !hasNoMembers) {
    return (
      <Bases>
        <Contents>
          <Holds className="h-full flex items-center justify-center">
            <Titles size="h2">{t("NoTeamMembers")}</Titles>
          </Holds>
        </Contents>
      </Bases>
    );
  }

  // If hasNoMembers is true, we're about to navigate away,
  // so render a temporary loading state
  if (hasNoMembers) {
    return (
      <Bases>
        <Contents>
          <Holds className="h-full flex items-center justify-center">
            <Titles size="h2">{t("Proceeding")}</Titles>
          </Holds>
        </Contents>
      </Bases>
    );
  }

  // Get data for rendering after all hooks have been called
  const { filter: renderFilter, data: renderData } = getTimesheetData();

  return (
    <Bases>
      <Contents>
        <Holds background={"white"} className="row-span-1 h-full">
          <Holds className="h-full w-full">
            <Grids rows={"8"} gap={"5"}>
              <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
                <TitleBoxes onClick={prevStep}>
                  <Holds className="h-full justify-end">
                    <Titles size={"h2"}>{t("ReviewYourTeam")}</Titles>
                  </Holds>
                </TitleBoxes>
              </Holds>
              <Holds className="row-start-2 row-end-9 h-full w-full ">
                <div className="flex flex-col items-center w-full h-full">
                  <div className="flex flex-row items-center justify-between w-full px-2 py-1">
                    <select
                      className="border rounded px-2 py-1"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value as any)}
                    >
                      {FILTER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Tabs for Trucking/TASCO */}
                  {(filter === "trucking" || filter === "tasco") && (
                    <div className="flex flex-row w-full justify-center gap-2 mt-2">
                      {(filter === "trucking" ? TRUCKING_TABS : TASCO_TABS).map(
                        (tab) => (
                          <Buttons
                            key={tab.value}
                            className={`flex flex-col items-center px-2 py-1 rounded ${
                              (filter === "trucking" &&
                                truckingTab === tab.value) ||
                              (filter === "tasco" && tascoTab === tab.value)
                                ? "bg-blue-200"
                                : "bg-gray-100"
                            }`}
                            onClick={() =>
                              filter === "trucking"
                                ? setTruckingTab(tab.value)
                                : setTascoTab(tab.value)
                            }
                          >
                            <img
                              src={tab.icon}
                              alt={tab.label}
                              className="w-5 h-5 mb-1"
                            />
                            <span className="text-xs">{tab.label}</span>
                          </Buttons>
                        )
                      )}
                    </div>
                  )}{" "}
                  {/* Timesheet Data Table/Section */}
                  <div className="flex-1 w-full mt-2 overflow-y-auto">
                    <TimeSheetRenderer
                      filter={renderFilter}
                      data={renderData}
                      edit={false}
                      manager={manager}
                      onDataChange={() => {}}
                      date={new Date().toISOString().slice(0, 10)}
                      focusIds={focusIds}
                      setFocusIds={setFocusIds}
                      handleSelectEntity={handleSelectEntity}
                      isReviewYourTeam={true} // Explicitly set to true in ReviewYourTeam context
                    />
                  </div>
                  {/* Action Buttons */}
                  <div className="flex flex-row w-full justify-between mt-2 px-2">
                    <Buttons
                      className=" px-4 py-2 rounded font-bold"
                      background={"orange"}
                      onClick={handleEdit}
                    >
                      {t("Edit")}
                    </Buttons>
                    <Buttons
                      className=" px-4 py-2 rounded font-bold"
                      background={"green"}
                      onClick={handleApprove}
                      disabled={focusIds.length > 0}
                    >
                      {t("Approve")}
                    </Buttons>
                  </div>
                </div>
              </Holds>
            </Grids>
          </Holds>
        </Holds>
      </Contents>
    </Bases>
  );
};

export default ReviewYourTeam;
