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

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import TinderSwipe from "@/components/(animations)/tinderSwipe";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Images } from "@/components/(reusable)/images";
import Spinner from "@/components/(animations)/spinner";
import { useSession } from "next-auth/react";
import TascoReviewSection from "./_Components/TascoReviewSection";
import TruckingReviewSection from "./_Components/TruckingReviewSection";
import GeneralReviewSection from "./_Components/GeneralReviewSection";
import { CardControls } from "./_Components/CardControls";
import { useTranslations } from "next-intl";
import { Selects } from "@/components/(reusable)/selects";

export default function TimeCards() {
  const t = useTranslations("TimeCardSwiper");
  const { id: myTeamId } = useParams();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { data: session } = useSession();
  const manager = session?.user?.firstName + " " + session?.user?.lastName;
  const [page, setPage] = useState(1);
  const swipeRef = useRef<TinderSwipeRef>(null);

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

  const currentMember = teamMembers[currentIndex];
  const currentTimeSheets = currentMember?.TimeSheets || [];

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
    <Bases className="fixed w-full h-full">
      <Contents>
        <Grids
          rows={"7"}
          gap={"5"}
          className={`h-full pb-5 bg-white rounded-[10px] ${
            loading && "animate-pulse"
          }`}
        >
          <Holds className="row-span-1 h-full">
            <TitleBoxes onClick={() => router.push("/dashboard")}>
              <Titles size={"h2"}>{t("ReviewYourTeam")}</Titles>
            </TitleBoxes>
          </Holds>

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
                          rows={"7"}
                          gap={"5"}
                          className="h-full w-full p-3 bg-[#EBC68E]"
                        >
                          <Holds className="row-start-1 row-end-2 w-full h-full">
                            <Holds position={"row"} className="pb-2">
                              <Holds>
                                <Titles position={"left"} size={"h3"}>
                                  {currentMember.firstName}{" "}
                                  {currentMember.lastName}
                                </Titles>
                              </Holds>

                              <Holds
                                position={"right"}
                                className="w-1/2 h-full justify-center items-center"
                              >
                                <Texts size={"p5"}>{`${calculateTotalHours(
                                  currentTimeSheets
                                )}`}</Texts>
                              </Holds>
                            </Holds>
                            <Selects>
                              <option>{t("selectOption")}</option>
                            </Selects>
                          </Holds>

                          {/* 
                          Start of Review Section 
                          pages are managed in the TopOfCardSection 
                          */}
                          <Holds className="h-full row-start-3 row-end-8 border-t-4 border-opacity-10 border-black rounded-none">
                            <>
                              {page === 1 && (
                                <GeneralReviewSection
                                  currentTimeSheets={currentTimeSheets}
                                  formatTime={formatTime}
                                />
                              )}

                              {page === 2 && (
                                <TruckingReviewSection
                                  currentTimeSheets={currentTimeSheets}
                                />
                              )}
                              {page === 3 && (
                                <TascoReviewSection
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
              </Holds>
            </Contents>
          </Holds>
          <CardControls
            completed={completed}
            handleEditClick={handleEditClick}
            handleApproveClick={handleApproveClick}
          />
        </Grids>
      </Contents>
    </Bases>
  );
}
