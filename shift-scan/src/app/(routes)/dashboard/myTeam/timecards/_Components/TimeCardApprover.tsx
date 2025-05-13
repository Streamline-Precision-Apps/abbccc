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
  CostCode: {
    name: string;
    description?: string; // Made optional since it's not in your JSON
  };
  Jobsite: {
    name: string;
  };
  TascoLogs: TascoLog[] | null;
  TruckingLogs: TruckingLog[] | null;
  EmployeeEquipmentLogs: EmployeeEquipmentLog[] | null;
  status: string;
};

type EmployeeEquipmentLog = {
  id: string;
  startTime: string;
  endTime: string;
  Equipment: Equipment;
  RefuelLogs: EquipmentRefueled[];
};

type EquipmentRefueled = {
  id: string;
  gallonsRefueled: number;
};

type TruckingLog = {
  id: string;
  laborType: string;
  startingMileage: number;
  endingMileage: number | null;
  Materials: Material[] | null;
  Equipment: Equipment | null;
  EquipmentHauled: EquipmentHauled[] | null;
  RefuelLogs: TruckingRefueled[] | null;
  StateMileages: StateMileage[] | null;
};

type EquipmentHauled = {
  id: string;
  Equipment: Equipment;
  JobSite: JobSite;
};

type JobSite = {
  name: string;
};

type StateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
};

type TruckingRefueled = {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number; // Made optional to match your JSON
};

type Material = {
  id: string;
  name: string;
  quantity: number;
  loadType: string;
  grossWeight: number;
  lightWeight: number;
  materialWeight: number;
};

type TascoLog = {
  id: string;
  shiftType: string;
  materialType: string | null;
  LoadQuantity: number;
  Equipment: Equipment | null;
  RefuelLogs: TascoRefueled[];
};

type TascoRefueled = {
  id: string;
  gallonsRefueled: number;
};

type Equipment = {
  id: string;
  name: string;
};

type TeamMember = {
  id: string;
  firstName: string;
  lastName: string;
  clockedIn: boolean;
  TimeSheets: TimeSheet[]; // Changed to match JSON
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

export default function TimeCardApprover({
  loading,
  setLoading,
}: {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const t = useTranslations("TimeCardSwiper");
  const router = useRouter();
  const { id: myTeamId } = useParams();
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMember = teamMembers[currentIndex];
  const [completed, setCompleted] = useState(false);
  const { data: session } = useSession();
  const manager = session?.user?.firstName + " " + session?.user?.lastName;
  const currentTimeSheets = currentMember?.TimeSheets || [];
  const [viewOption, setViewOption] = useState<ViewOption>("highlight");
  const swipeRef = useRef<TinderSwipeRef>(null);

  const getAvailableViewOptions = (timeSheets: TimeSheet[]) => {
    const options = new Set<string>(["highlight"]); // Always include highlights

    timeSheets.forEach((timesheet) => {
      if (timesheet.workType === "TRUCK_DRIVER") {
        options.add("Trucking");
      } else if (timesheet.workType === "TASCO") {
        options.add("Tasco");
      } else if (
        timesheet.EmployeeEquipmentLogs &&
        timesheet.EmployeeEquipmentLogs.length > 0
      ) {
        options.add("Equipment");
      }
    });

    return Array.from(options);
  };

  useEffect(() => {
    const fetchCrewTimeCards = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/getPendingTeamTimeSheets`);
        const data = await response.json();
        // Filter members who actually have pending timesheets
        setTeamMembers(
          data.filter((member: TeamMember) => member.TimeSheets.length > 0)
        );
      } catch (error) {
        console.error("Error fetching crew time cards:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCrewTimeCards();
  }, [myTeamId]);

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

    if (direction === "left") {
      router.push(
        `/dashboard/myTeam/${myTeamId}/employee/${memberId}?timeCard=/dashboard/myTeam/${myTeamId}/timecards`
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
  const handleSubmitAll = async () => {
    try {
      console.log("Submitting all decisions:", decisions);
      const formData = new FormData();
      formData.append("decisions", JSON.stringify(decisions));
      formData.append("comment", `Approved by ${manager}`);
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

  const calculateTotalHours = (timeSheets: TimeSheet[]) => {
    let totalMs = 0;
    timeSheets.forEach((timesheet) => {
      const start = new Date(timesheet.startTime).getTime();
      const end = new Date(timesheet.endTime).getTime();
      totalMs += end - start;
    });
    const hours = Math.floor(totalMs / (1000 * 60 * 60));
    const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} hrs ${minutes} mins`;
  };

  return (
    <>
      <Holds className="row-span-5 h-full w-full">
        <Contents width={"section"} className="h-full">
          <Holds
            className={`w-full h-full rounded-[10px] border-[3px] border-black bg-[#EBC68E] ${
              loading && "animate-pulse"
            }`}
          >
            {!completed ? (
              <>
                {currentMember ? (
                  <TinderSwipe
                    ref={swipeRef}
                    key={currentMember.id}
                    onSwipeLeft={() => swiped("left", currentMember.id)}
                    onSwipeRight={() => swiped("right", currentMember.id)}
                  >
                    <Grids
                      rows={"5"}
                      gap={"4"}
                      className="h-full w-full px-3 pt-1 pb-5 bg-[#EBC68E]"
                    >
                      <Holds className="row-start-1 row-end-2 w-full h-full rounded-none">
                        <Holds position={"row"} className="h-full">
                          <Holds>
                            <Titles position={"left"} size={"h5"}>
                              {currentMember.firstName} {currentMember.lastName}
                            </Titles>
                          </Holds>

                          <Holds
                            position={"right"}
                            className="w-full h-full justify-center items-center"
                          >
                            <Texts
                              position={"right"}
                              size={"p5"}
                            >{`${calculateTotalHours(
                              currentTimeSheets
                            )}`}</Texts>
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
                      <Holds className="h-full row-start-2 row-end-6 rounded-none">
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
                          {viewOption === "Equipment" && <></>}
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
                      <Titles size={"h5"}>{t("NoTimesheetsToApprove")}</Titles>
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
          </Holds>
        </Contents>
      </Holds>
      <CardControls
        completed={completed}
        handleEditClick={handleEditClick}
        handleApproveClick={handleApproveClick}
      />
    </>
  );
}
