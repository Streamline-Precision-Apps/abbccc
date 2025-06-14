import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { crewUsers, TimesheetFilter } from "@/lib/types";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef } from "react";
import TimeSheetRenderer from "@/app/(routes)/dashboard/myTeam/[id]/employee/[employeeId]/timeSheetRenderer";
import { approvePendingTimesheets } from "@/actions/timeSheetActions";
import { Buttons } from "@/components/(reusable)/buttons";
import { Texts } from "@/components/(reusable)/texts";
import TinderSwipe, {
  TinderSwipeRef,
} from "@/components/(animations)/tinderSwipe";

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
    {
      value: "truckingEquipmentHaulLogs",
      label: "Equipment Hauls",
      icon: "/hauling.svg",
    },
    {
      value: "truckingMaterialHaulLogs",
      label: "Material Hauls",
      icon: "/form.svg",
    },
    { value: "truckingRefuelLogs", label: "Refuel Logs", icon: "/refuel.svg" },
    { value: "truckingStateLogs", label: "State Logs", icon: "/state.svg" },
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
  const tinderSwipeRef = useRef<TinderSwipeRef>(null);
  const [pendingTimesheets, setPendingTimesheets] = useState<
    Record<string, any[]>
  >({});
  const [dataLoaded, setDataLoaded] = useState(false); // Track when data is loaded
  const [focusIndex, setFocusIndex] = useState(0);
  const [filter, setFilter] = useState<
    "timesheetHighlights" | "trucking" | "tasco" | "equipmentLogs"
  >("timesheetHighlights");
  const [truckingTab, setTruckingTab] = useState<TimesheetFilter>(
    "truckingEquipmentHaulLogs"
  );
  const [tascoTab, setTascoTab] = useState<TimesheetFilter>("tascoHaulLogs");
  const tinderRef = useRef<TinderSwipeRef>(null);

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
  }, [dataLoaded, loading, pendingTimesheets, focusUser?.id]); // Calculate total hours from all timesheets with endTime
  const calculateTotalHours = (timesheets: any[]): number => {
    let totalMinutes = 0;

    timesheets.forEach((timesheet) => {
      if (timesheet.startTime && timesheet.endTime) {
        const startTime = new Date(timesheet.startTime);
        const endTime = new Date(timesheet.endTime);

        if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
          // Calculate time difference in minutes
          const diffMinutes =
            (endTime.getTime() - startTime.getTime()) / (1000 * 60);
          totalMinutes += diffMinutes;
        }
      }
    });

    // Convert total minutes to hours (rounded to 1 decimal place)
    return Math.round((totalMinutes / 60) * 10) / 10;
  };

  // Render correct data for filter/tab
  const getTimesheetData = () => {
    // Show only timesheets for the focus user that have an endTime
    const allUserTimesheets = pendingTimesheets[focusUser?.id] || [];

    // Filter out timesheets without an endTime
    const userTimesheets = allUserTimesheets.filter(
      (ts) => ts.endTime !== null && ts.endTime !== undefined
    );

    console.log(
      `Filtered timesheets: ${userTimesheets.length} of ${allUserTimesheets.length} have endTime`
    );

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
  // Calculate total hours for the focus user from ALL completed timesheets regardless of filter
  const totalHours = calculateTotalHours(
    pendingTimesheets[focusUser?.id]?.filter(
      (ts) => ts.endTime !== null && ts.endTime !== undefined
    ) || []
  );
  return (
    <Bases>
      <Contents>
        <Holds
          background={"white"}
          className="row-span-1 h-full p-4 flex flex-col"
        >
          <Holds className="h-full w-full flex-1 flex flex-col">
            <Grids rows={"8"} gap={"5"} className="h-full">
              <Holds className="row-start-1 row-end-2 h-full w-full justify-center">
                <TitleBoxes onClick={prevStep}>
                  <Holds className="h-full justify-end">
                    <Titles size={"h2"}>{t("ReviewYourTeam")}</Titles>
                  </Holds>
                </TitleBoxes>
              </Holds>
              {/* Main content area with TinderSwipe - Fixed height container */}
              <Holds
                className="row-start-2 row-end-8 w-full"
                style={{ height: "calc(100% - 10px)" }}
              >
                <TinderSwipe
                  ref={tinderSwipeRef}
                  onSwipeLeft={handleEdit}
                  onSwipeRight={handleApprove}
                  swipeThreshold={100}
                >
                  <Holds className="h-full w-full">
                    {" "}
                    <div className="flex flex-col h-full bg-orange-200 rounded-lg overflow-hidden border-2 border-black">
                      {/* User info header with name and hours */}
                      <div className="flex justify-between items-center w-full px-3 py-2 bg-orange-200">
                        <Titles
                          size="h4"
                          className="text-left font-medium text-gray-800"
                        >
                          {focusUser
                            ? `${focusUser.firstName} ${focusUser.lastName}`
                            : "Unknown User"}
                        </Titles>
                        <Texts size="p5" className="font-bold text-gray-800">
                          {totalHours} {t("Hrs")}
                        </Texts>
                      </div>{" "}
                      {/* Filter dropdown in its own row */}
                      <div className="w-full px-4 pt-2 pb-3 bg-orange-200">
                        <div className="flex flex-row items-center">
                          <select
                            className="w-full border border-black rounded-md px-2 py-1 text-sm bg-white text-gray-800"
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
                      </div>{" "}
                      {/* Tabs for Trucking/TASCO in a separate row with horizontal layout */}{" "}
                      {(filter === "trucking" || filter === "tasco") && (
                        <div className="w-full px-4 pt-2 pb-3 bg-orange-200">
                          <div className="flex flex-row justify-between items-stretch gap-1 overflow-x-auto no-scrollbar">
                            {(filter === "trucking"
                              ? TRUCKING_TABS
                              : TASCO_TABS
                            ).map((tab) => (
                              <Buttons
                                key={tab.value}
                                className={`flex items-center ${
                                  (filter === "trucking" &&
                                    truckingTab === tab.value) ||
                                  (filter === "tasco" && tascoTab === tab.value)
                                    ? "gap-1.5 px-3 py-1.5 bg-white border-2 border-black rounded-t-md flex-1 justify-center"
                                    : "px-1.5 py-1.5 bg-gray-300 border border-gray-400 rounded-t-md w-auto"
                                } text-xs`}
                                onClick={() =>
                                  filter === "trucking"
                                    ? setTruckingTab(tab.value)
                                    : setTascoTab(tab.value)
                                }
                              >
                                <img
                                  src={tab.icon}
                                  alt={tab.label}
                                  className="w-5 h-5 flex-shrink-0"
                                />
                                {((filter === "trucking" &&
                                  truckingTab === tab.value) ||
                                  (filter === "tasco" &&
                                    tascoTab === tab.value)) && (
                                  <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                                    {tab.label}
                                  </span>
                                )}
                              </Buttons>
                            ))}
                          </div>
                        </div>
                      )}{" "}
                      <div
                        className="flex-1 w-full px-4 py-3"
                        style={{
                          maxHeight: "calc(100% - 100px)",
                          minHeight: "60%",
                        }}
                      >
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
                          isReviewYourTeam={true}
                        />
                      </div>
                    </div>
                  </Holds>
                </TinderSwipe>
              </Holds>

              {/* Action Buttons */}
              <Holds className="row-start-8 row-end-9 w-full px-2 py-1">
                <div className="flex flex-row w-full justify-between">
                  <Buttons
                    className="w-5/12 px-4 py-3 rounded-lg font-bold"
                    background={"orange"}
                    onClick={() => {
                      if (tinderSwipeRef.current) {
                        tinderSwipeRef.current.swipeLeft();
                      } else {
                        handleEdit();
                      }
                    }}
                  >
                    {t("Edit")}
                  </Buttons>
                  <Buttons
                    className="w-5/12 px-4 py-3 rounded-lg font-bold"
                    background={"green"}
                    onClick={() => {
                      if (tinderSwipeRef.current) {
                        tinderSwipeRef.current.swipeRight();
                      } else {
                        handleApprove();
                      }
                    }}
                    disabled={focusIds.length > 0}
                  >
                    {t("Approve")}
                  </Buttons>
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
