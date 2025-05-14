"use client";
type TinderSwipeRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
};

type TimeSheet = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  jobsiteId: string;
  workType: string;
  status: string;
  Crews: {
    id: string;
    leadId: string;
  }[];
  CostCode: {
    name: string;
  };
  Jobsite: {
    name: string;
  };
  TascoLogs: {
    id: string;
    shiftType: string;
    laborType: string;
    materialType: string | null;
    LoadQuantity: number;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
  TruckingLogs: {
    id: string;
    laborType: string;
    startingMileage: number;
    endingMileage: number | null;
    Equipment: {
      id: string;
      name: string;
    };
    Materials: {
      id: string;
      name: string;
      quantity: number;
      loadType: string;
      grossWeight: number;
      lightWeight: number;
      materialWeight: number;
    }[];
    EquipmentHauled: {
      id: string;
      Equipment: {
        name: string;
      };
      JobSite: {
        name: string;
      };
    }[];
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
      milesAtFueling?: number;
    }[];
    StateMileages: {
      id: string;
      state: string;
      stateLineMileage: number;
    }[];
  }[];
  EmployeeEquipmentLogs: {
    id: string;
    startTime: string;
    endTime: string;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
};

type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  clockedIn: boolean;
  TimeSheets: TimeSheet[];
  totalTime: string; // Changed from number to string to match your usage
  Crews: { id: string; leadId: string }[]; // Added optional teamId
};

type ViewOption = "highlight" | "Trucking" | "Tasco" | "Equipment";

import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { CardControls } from "./CardControls";
import GeneralReviewSection from "./GeneralReviewSection";
import TascoReviewSection from "./TascoReviewSection";
import TruckingReviewSection from "./TruckingReviewSection";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import TinderSwipe from "@/components/(animations)/tinderSwipe";
import Spinner from "@/components/(animations)/spinner";
import EquipmentLogsSection from "./EquipmentLogsSection";
import { ApproveUsersTimeSheets } from "@/actions/ManagerTimeCardActions";

export default function TimeCardApprover({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations("TimeCardSwiper");
  const router = useRouter();
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMember = teamMembers[currentIndex];
  const [completed, setCompleted] = useState(false);
  const { data: session } = useSession();
  const manager = session?.user?.firstName + " " + session?.user?.lastName;
  const managerId = session?.user?.id;
  const currentTimeSheets = currentMember?.TimeSheets || [];
  const [viewOption, setViewOption] = useState<ViewOption>("highlight");
  const swipeRef = useRef<TinderSwipeRef>(null);

  const getAvailableViewOptions = (timeSheets: TimeSheet[]) => {
    const options = new Set<ViewOption>(["highlight"]);

    timeSheets.forEach((timesheet) => {
      if (
        timesheet.workType === "TRUCK_DRIVER" &&
        timesheet.TruckingLogs?.length
      ) {
        options.add("Trucking");
      } else if (
        timesheet.workType === "TASCO" &&
        timesheet.TascoLogs?.length
      ) {
        options.add("Tasco");
      } else if (timesheet.EmployeeEquipmentLogs?.length) {
        options.add("Equipment");
      }
    });

    return Array.from(options);
  };

  // Updated fetch function with proper typing
  useEffect(() => {
    const fetchCrewTimeCards = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/getPendingTeamTimeSheets?managerId=${managerId}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: TeamMember[] = await response.json();

        // Process the API response with proper typing
        const membersWithTotals = data
          .map((member) => ({
            id: member.id,
            firstName: member.firstName,
            lastName: member.lastName,
            clockedIn: member.clockedIn,
            TimeSheets: member.TimeSheets.map((timesheet) => ({
              ...timesheet,
              id: timesheet.id, // Ensure each timesheet has an id
            })),
            totalTime: calculateTotalTime(member.TimeSheets),
            Crews: member.Crews,
          }))
          .filter((member) => member.TimeSheets.length > 0);

        setTeamMembers(membersWithTotals);
      } catch (error) {
        console.error("Error fetching crew time cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrewTimeCards();
  }, []);

  const handleEditClick = () => {
    if (swipeRef.current) {
      swipeRef.current.swipeLeft();
    }
  };

  const handleApproveClick = () => {
    if (swipeRef.current) {
      swipeRef.current.swipeRight();
    }
  };

  const swiped = (direction: string, memberId: string) => {
    // Apply decision to all timesheets for this member
    const newDecisions = currentTimeSheets.reduce((acc, timesheet) => {
      acc[timesheet.id] = direction === "right" ? "APPROVED" : "EDIT";
      return acc;
    }, {} as Record<string, string>);

    const myTeamId = currentMember.Crews.find(
      (crew) => crew.leadId === managerId
    )?.id;

    if (direction === "left") {
      router.push(
        `/dashboard/myTeam/${myTeamId}/employee/${memberId}?timecard=/dashboard/myTeam/timecards`
      );
    } else {
      setDecisions((prev) => ({
        ...prev,
        ...newDecisions,
      }));

      // Move to next member with pending timesheets
      if (currentIndex < teamMembers.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCompleted(true);
      }
    }
  };

  //todo : make this a server action
  const ApproveTimeSheets = async (id: string) => {
    try {
      const ApproveTimesheet = teamMembers.find((member) => member.id === id);
      const timesheets = ApproveTimesheet?.TimeSheets || [];
      const timeSheetIds = timesheets.map((timesheet) => timesheet.id);
      console.log("id", id);
      console.log("timesheets", timesheets);
      console.log("timeSheetIds", timeSheetIds);

      const formData = new FormData();
      formData.append("id", id);
      formData.append("timesheetIds", JSON.stringify(timeSheetIds));

      formData.append("statusComment", `Approved by ${manager}`);

      const response = await ApproveUsersTimeSheets(formData);

      if (response.success) {
        console.log("Timecards approved successfully");
      } else {
        console.error("Failed to approve timecards");
      }
    } catch (error) {
      console.error("Error submitting timecards:", error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateTotalTime = (timeSheets: TimeSheet[]) => {
    let totalMs = 0;
    timeSheets.forEach((timesheet) => {
      try {
        const start = new Date(timesheet.startTime).getTime();
        const end = new Date(timesheet.endTime).getTime();
        if (!isNaN(start) && !isNaN(end)) {
          totalMs += end - start;
        }
      } catch (e) {
        console.error("Invalid date in timesheet", timesheet.id);
      }
    });

    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hrs ${minutes} mins`;
  };

  return (
    <Holds className="h-full w-full">
      <Grids rows={"8"} className="h-full w-full pb-5">
        <Holds className="row-start-1 row-end-8  h-full w-full">
          <Contents>
            <Holds
              className={`w-full h-full rounded-[10px] border-[3px] border-black bg-[#EBC68E] ${
                loading && "animate-pulse"
              }`}
            >
              <Contents width={"section"}>
                {!completed ? (
                  <>
                    {currentMember ? (
                      <TinderSwipe
                        ref={swipeRef}
                        key={currentMember.id}
                        onSwipeLeft={() => {
                          swiped("left", currentMember.id);
                        }}
                        onSwipeRight={() => {
                          swiped("right", currentMember.id);
                          ApproveTimeSheets(currentMember.id);
                        }}
                      >
                        <Grids
                          rows={"6"}
                          gap={"5"}
                          className="h-full w-full pb-4"
                        >
                          <Holds className="row-start-1 row-end-2 w-full h-full rounded-none">
                            <Holds position={"row"} className="h-full">
                              <Holds>
                                <Titles position={"left"} size={"h5"}>
                                  {`${currentMember.firstName} 
                                  
                                  ${currentMember.lastName}`}
                                </Titles>
                              </Holds>

                              <Holds
                                position={"right"}
                                className="w-full h-full justify-center items-center"
                              >
                                <Texts position={"right"} size={"p5"}>
                                  {currentMember.totalTime}
                                </Texts>
                              </Holds>
                            </Holds>
                            <Selects
                              value={viewOption}
                              onChange={(e) => {
                                setViewOption(e.target.value as ViewOption);
                              }}
                              className="text-center text-sm"
                            >
                              {getAvailableViewOptions(currentTimeSheets).map(
                                (option) => (
                                  <option key={option} value={option}>
                                    {t(option)}
                                  </option>
                                )
                              )}
                            </Selects>
                          </Holds>

                          {/* 
                          Start of Review Section 
                          pages are managed in the TopOfCardSection 
                          */}
                          <Holds className="h-full row-start-2 row-end-7 rounded-none">
                            <>
                              {viewOption === "highlight" && (
                                <GeneralReviewSection
                                  currentTimeSheets={currentTimeSheets}
                                  formatTime={formatTime}
                                />
                              )}

                              {viewOption === "Trucking" && (
                                <TruckingReviewSection
                                  currentTimeSheets={currentTimeSheets}
                                />
                              )}
                              {viewOption === "Tasco" && (
                                <TascoReviewSection
                                  currentTimeSheets={currentTimeSheets}
                                />
                              )}
                              {viewOption === "Equipment" && (
                                <EquipmentLogsSection
                                  currentTimeSheets={currentTimeSheets}
                                />
                              )}
                            </>
                          </Holds>
                          {/* End of Review Section */}
                        </Grids>
                      </TinderSwipe>
                    ) : (
                      <Holds className="h-full flex items-center justify-center">
                        {loading ? (
                          <Spinner size={70} />
                        ) : (
                          <Titles size={"h5"}>
                            {t("NoTimesheetsToApprove")}
                          </Titles>
                        )}
                      </Holds>
                    )}
                  </>
                ) : (
                  <Holds className="h-full flex items-center justify-center">
                    <Titles size={"h5"}>{t("Complete")}</Titles>
                    <Images
                      titleImg="/statusApprovedFilled.svg"
                      titleImgAlt="approved"
                      className="w-16 h-16 border-[3px] border-black rounded-full"
                    />
                    <Texts size={"p6"} className="mt-4">
                      {t("YouHaveApprovedAllTimesheets")}
                    </Texts>
                  </Holds>
                )}
              </Contents>
            </Holds>
          </Contents>
        </Holds>

        <CardControls
          completed={completed}
          handleEditClick={handleEditClick}
          handleApproveClick={handleApproveClick}
        />
      </Grids>
    </Holds>
  );
}
