"use client";
type TimeSheet = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  jobsiteId: string;
  costCode: {
    name: string;
    description: string;
  };
  tascoLogs: TascoLogs[] | null;
  truckingLogs: TruckingLogs[] | null;
  employeeEquipmentLogs: employeeEquipmentLogs[] | null;

  status: string;
};

type employeeEquipmentLogs = {
  id: string;
  startTime: string;
  endTime: string;
  equipment: Equipment[];
  refueled: EquipmentRefueled[];
};

type EquipmentRefueled = {
  id: string;
  gallonsRefueled: number;
};

type TruckingLogs = {
  id: string;
  laborType: string;
  startingMileage: number;
  endingMileage: number | null;
  Material: Materials[] | null; // Changed from Materials to Material
  equipment: Equipment[] | null;
  EquipmentHauled: EquipmentHauled[] | null;
  Refueled: TruckingRefueled[] | null; // Changed from TruckingRefueled to Refueled
  stateMileage: stateMileage[] | null;
};

type EquipmentHauled = {
  id: string;
  equipment: Equipment[];
  jobSite: JobSite[];
};

type JobSite = {
  name: string;
};

type stateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
};

type TruckingRefueled = {
  id: string;
  gallonsRefueled: number;
  milesAtfueling: number;
};

type Materials = {
  id: string;
  name: string;
  quantity: number;
  loadType: string;
  LoadWeight: number;
};

type TascoLogs = {
  id: string;
  shiftType: string;
  materialType: string;
  LoadQuantity: number;
  comment: string;
  Equipment: Equipment[];
  refueled: TascoRefueled[];
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
  timeSheets: TimeSheet[];
};

type TinderSwipeRef = {
  swipeLeft: () => void;
  swipeRight: () => void;
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
import { Buttons } from "@/components/(reusable)/buttons";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Labels } from "@/components/(reusable)/labels";
import { Images } from "@/components/(reusable)/images";
import Spinner from "@/components/(animations)/spinner";
import { useSession } from "next-auth/react";
import TascoReviewSection from "./_Components/TascoReviewSection";
import TruckingReviewSection from "./_Components/TruckingReviewSection";
import GeneralReviewSection from "./_Components/GeneralReviewSection";
import TopOfCardSection from "./_Components/TopOfCardSection";
import { CardControls } from "./_Components/CardControls";

export default function TimeCards() {
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
        const response = await fetch(
          `/api/getPendingTeamTimeSheets/${myTeamId}`
        );
        const data = await response.json();
        // Filter members who actually have pending timesheets
        setTeamMembers(
          data.filter((member: TeamMember) => member.timeSheets.length > 0)
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
  const currentTimeSheets = currentMember?.timeSheets || [];

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
    return `${hours}h ${minutes}m`;
  };

  return (
    <Bases className="fixed w-full h-full">
      <Contents className="h-full">
        <Grids
          rows={"9"}
          gap={"5"}
          className={`h-full pb-5 bg-white rounded-[10px] ${
            loading && "animate-pulse"
          }`}
        >
          <Holds className="row-span-1 h-full">
            <TitleBoxes onClick={() => router.push("/dashboard")}>
              <Titles size={"h2"}>Review Your Team</Titles>
            </TitleBoxes>
          </Holds>

          <Holds className="row-span-7 h-full w-full">
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
                          rows={"10"}
                          gap={"3"}
                          className="h-full w-full p-4 bg-[#EBC68E]"
                        >
                          <TopOfCardSection
                            page={page}
                            setPage={setPage}
                            currentTimeSheets={currentTimeSheets}
                            currentMember={currentMember}
                            calculateTotalHours={calculateTotalHours}
                          />

                          {/* 
                          Start of Review Section 
                          pages are managed in the TopOfCardSection 
                          */}
                          <Holds
                            className="h-full row-start-3 row-end-11 "
                            style={{ touchAction: "pan-y" }}
                          >
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
                          <Titles size={"h5"}>No Time Sheets to Approve</Titles>
                        )}
                      </Holds>
                    )}
                  </>
                ) : (
                  <Holds className="h-full flex items-center justify-center">
                    <Titles size={"h5"}>Complete!</Titles>
                    <Images
                      titleImg="/complete.svg"
                      titleImgAlt="approved"
                      className="w-16 h-16 border-[3px] border-black rounded-full"
                    />
                    <Texts size={"p6"} className="mt-4">
                      You have Approved All Time Sheets.
                    </Texts>
                  </Holds>
                )}
              </Holds>
            </Contents>
          </Holds>
          <CardControls
            handleEditClick={handleEditClick}
            handleApproveClick={handleApproveClick}
          />
        </Grids>
      </Contents>
    </Bases>
  );
}
