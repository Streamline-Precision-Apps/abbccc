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
  maintenanceLogs: maintenanceLogs[] | null;
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

type maintenanceLogs = {
  id: string;
  startTime: string;
  endTime: string;
};

type TruckingLogs = {
  id: string;
  laborType: string;
  equipmentId: string;
  startingMileage: number;
  endingMileage: number | null;
  Materials: Materials[] | null;
  EquipmentHauled: EquipmentHauled[] | null;
  TruckingRefueled: TruckingRefueled[] | null;
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
  image: string;
  clockedIn: boolean;
  timeSheets: TimeSheet[];
};

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TinderSwipe from "@/components/(animations)/tinderSwipe";
import { Buttons } from "@/components/(reusable)/buttons";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Labels } from "@/components/(reusable)/labels";
import { Images } from "@/components/(reusable)/images";
import Spinner from "@/components/(animations)/spinner";
import { useSession } from "next-auth/react";

export default function TimeCards() {
  const { id: myTeamId } = useParams();
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const { data: session } = useSession();
  const manager = session?.user?.firstName + " " + session?.user?.lastName;

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
        `/dashboard/myTeam/${myTeamId}/employee/${memberId}?rPath=/dashboard/myTeam/${myTeamId}/timecards`
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
    <Bases>
      <Contents className="h-full">
        <Grids
          rows={"8"}
          gap={"5"}
          className={`h-full pb-5 bg-white rounded-[10px] ${
            loading && "animate-pulse"
          }`}
        >
          <Holds className="row-span-1 h-full">
            <TitleBoxes
              title="Review Your Team"
              titleImg="/team.svg"
              titleImgAlt="team"
              onClick={() => router.push("/dashboard")}
              type="noIcon-NoHref"
            />
          </Holds>

          <Holds className="row-span-6 h-full w-full ">
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
                        key={currentMember.id}
                        onSwipeLeft={() => swiped("left", currentMember.id)}
                        onSwipeRight={() => swiped("right", currentMember.id)}
                      >
                        <Grids
                          rows={"10"}
                          gap={"3"}
                          className="h-full w-full p-4"
                        >
                          <Holds
                            position={"row"}
                            className="row-start-1 row-end-2 w-full h-full"
                          >
                            <Holds>
                              <Titles position={"left"} size={"h3"}>
                                {currentMember.firstName}{" "}
                                {currentMember.lastName}
                              </Titles>
                            </Holds>

                            <Holds position={"right"} className="w-1/2">
                              <Labels size={"p6"}>Total Hours</Labels>
                              <Holds
                                background={"white"}
                                position={"right"}
                                className="border-[3px] border-black "
                              >
                                <Texts size={"p5"}>
                                  {calculateTotalHours(currentTimeSheets)}
                                </Texts>
                              </Holds>
                            </Holds>
                          </Holds>

                          <Holds
                            background={"white"}
                            position={"row"}
                            className="border-[3px] border-black px-2 gap-5 row-start-2 row-end-3 h-full"
                          >
                            <Images
                              titleImg="/trucking.svg"
                              titleImgAlt="truck"
                              className={`w-8 h-8 ${
                                currentTimeSheets.find(
                                  (timesheet: TimeSheet) =>
                                    timesheet.truckingLogs !== null
                                )
                                  ? "opacity-100"
                                  : "opacity-55"
                              }`}
                            />

                            <Images
                              titleImg="/tasco.svg"
                              titleImgAlt="tasco"
                              className={`w-8 h-8 ${
                                currentTimeSheets.find(
                                  (timesheet: TimeSheet) =>
                                    timesheet.tascoLogs !== null
                                )
                                  ? "opacity-100"
                                  : "opacity-55"
                              }`}
                            />

                            <Images
                              titleImg="/mechanic-icon.svg"
                              titleImgAlt="mechanic-icon"
                              className={`w-8 h-8 ${
                                currentTimeSheets.find(
                                  (timesheet: TimeSheet) =>
                                    timesheet.maintenanceLogs !== null
                                )
                                  ? "opacity-100"
                                  : "opacity-55"
                              }`}
                            />
                            <Images
                              titleImg="/equipment.svg"
                              titleImgAlt="equipment"
                              className={`w-8 h-8 ${
                                currentTimeSheets.find(
                                  (timesheet: TimeSheet) =>
                                    timesheet.employeeEquipmentLogs !== null
                                )
                                  ? "opacity-100"
                                  : "opacity-55"
                              }`}
                            />
                          </Holds>

                          <Holds className="h-full row-start-3 row-end-11 ">
                            <Holds className="p-1">
                              <Holds className="grid grid-cols-4 gap-2">
                                <Titles size={"h6"}>Start Time</Titles>
                                <Titles size={"h6"}>End Time</Titles>
                                <Titles size={"h6"}>Jobsite #</Titles>
                                <Titles size={"h6"}>Cost Code</Titles>
                              </Holds>
                            </Holds>
                            <Holds
                              background={"white"}
                              className="h-full border-[3px] border-black "
                            >
                              {currentTimeSheets.map((timesheet: TimeSheet) => (
                                <Holds
                                  key={timesheet.id}
                                  className="h-fit grid grid-cols-4 gap-2 border-b-[2px] py-2 border-black"
                                >
                                  <Holds>
                                    <Texts size={"p7"}>
                                      {formatTime(timesheet.startTime)}
                                    </Texts>
                                  </Holds>
                                  <Holds>
                                    <Texts size={"p7"}>
                                      {formatTime(timesheet.endTime)}
                                    </Texts>
                                  </Holds>
                                  <Holds>
                                    <Texts size={"p7"}>
                                      {`${timesheet.jobsiteId.slice(0, 9)}${
                                        timesheet.jobsiteId.length > 9
                                          ? "..."
                                          : ""
                                      }` || "-"}
                                    </Texts>
                                  </Holds>
                                  <Holds>
                                    <Texts size={"p7"}>
                                      {`${timesheet.costCode.name.slice(0, 9)}${
                                        timesheet.costCode.name.length > 9
                                          ? "..."
                                          : ""
                                      }` || "-"}
                                    </Texts>
                                  </Holds>
                                </Holds>
                              ))}
                            </Holds>
                          </Holds>
                        </Grids>
                      </TinderSwipe>
                    ) : (
                      <Holds className="h-full flex items-center justify-center">
                        <Spinner />
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
          <Holds
            background="white"
            className="row-span-1 h-full flex items-center justify-center "
          >
            <Contents width={"section"} className="py-2">
              <Buttons
                background={"orange"}
                onClick={handleSubmitAll}
                disabled={Object.keys(decisions).length === 0}
                className=" w-full"
              >
                <Titles size={"h4"}>Submit All Decisions</Titles>
              </Buttons>
            </Contents>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
