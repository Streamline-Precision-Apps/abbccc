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

import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

export default function GeneralReviewSection({
  currentTimeSheets,
  formatTime,
}: {
  currentTimeSheets: TimeSheet[];
  formatTime: (dateString: string) => string;
}) {
  return (
    <>
      <Holds className="p-1">
        <Holds className="grid grid-cols-4 gap-2">
          <Titles size={"h6"}>Start Time</Titles>
          <Titles size={"h6"}>End Time</Titles>
          <Titles size={"h6"}>Jobsite #</Titles>
          <Titles size={"h6"}>Cost Code</Titles>
        </Holds>
      </Holds>
      <Holds background={"white"} className="h-full border-[3px] border-black ">
        {currentTimeSheets.map((timesheet: TimeSheet) => (
          <Holds
            key={timesheet.id}
            className="h-fit grid grid-cols-4 gap-2 border-b-[2px] py-2 border-black"
          >
            <Holds>
              <Texts size={"p7"}>{formatTime(timesheet.startTime)}</Texts>
            </Holds>
            <Holds>
              <Texts size={"p7"}>{formatTime(timesheet.endTime)}</Texts>
            </Holds>
            <Holds>
              <Texts size={"p7"}>
                {`${timesheet.jobsiteId.slice(0, 9)}${
                  timesheet.jobsiteId.length > 9 ? "..." : ""
                }` || "-"}
              </Texts>
            </Holds>
            <Holds>
              <Texts size={"p7"}>
                {`${timesheet.costCode.name.slice(0, 9)}${
                  timesheet.costCode.name.length > 9 ? "..." : ""
                }` || "-"}
              </Texts>
            </Holds>
          </Holds>
        ))}
      </Holds>
    </>
  );
}
