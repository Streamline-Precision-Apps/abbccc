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
      if (!crewMembers.length) return;
      const userIds = crewMembers.map((u) => u.id);
      const res = await fetch("/api/getPendingTeamTimesheets/[crewMembers]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      });
      const data = await res.json();
      setPendingTimesheets(data);
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
  };

  // Render correct data for filter/tab
  const getTimesheetData = () => {
    // Show all timesheets for the focus user, including incomplete
    const userTimesheets = pendingTimesheets[focusUser?.id] || [];
    if (filter === "trucking") {
      return { filter: truckingTab, data: userTimesheets };
    }
    if (filter === "tasco") {
      return { filter: tascoTab, data: userTimesheets };
    }
    return { filter, data: userTimesheets };
  };

  if (!focusUser) {
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
                    <div className="font-bold text-lg">
                      {focusUser.firstName} {focusUser.lastName}
                    </div>
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
                  )}
                  {/* Timesheet Data Table/Section */}
                  <div className="flex-1 w-full mt-2 overflow-y-auto">
                    <TimeSheetRenderer
                      filter={renderFilter as TimesheetFilter}
                      data={renderData}
                      edit={false}
                      manager={manager}
                      date={new Date().toISOString().slice(0, 10)}
                      onDataChange={() => {}}
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
