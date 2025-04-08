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

import { Buttons } from "@/components/(reusable)/buttons";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { Dispatch, SetStateAction } from "react";

export default function TopOfCardSection({
  currentTimeSheets,
  currentMember,
  calculateTotalHours,
  page,
  setPage,
}: {
  currentTimeSheets: TimeSheet[];
  currentMember: TeamMember;
  calculateTotalHours: (timeSheets: TimeSheet[]) => string;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <>
      <Holds position={"row"} className="row-start-1 row-end-2 w-full h-full">
        <Holds>
          <Titles position={"left"} size={"h3"}>
            {currentMember.firstName} {currentMember.lastName}
          </Titles>
        </Holds>

        <Holds position={"right"} className="w-1/2">
          <Labels size={"p6"}>Total Hours</Labels>
          <Holds
            background={"white"}
            position={"right"}
            className="border-[3px] border-black "
          >
            <Texts size={"p5"}>{calculateTotalHours(currentTimeSheets)}</Texts>
          </Holds>
        </Holds>
      </Holds>

      <Holds
        position={"row"}
        className=" px-2 gap-5 row-start-2 row-end-3 h-full"
      >
        <Grids cols={"3"} gap={"5"} className="h-full w-full">
          <Buttons
            shadow="none"
            background={
              currentTimeSheets.every(
                (timesheet: TimeSheet) =>
                  !timesheet.truckingLogs || timesheet.truckingLogs.length === 0
              )
                ? "darkGray"
                : "lightBlue"
            }
            disabled={currentTimeSheets.every(
              (timesheet: TimeSheet) =>
                !timesheet.truckingLogs || timesheet.truckingLogs.length === 0
            )}
            className={`${page === 2 && "border-[3px] border-app-yellow"}`}
          >
            <Images
              titleImg="/trucking.svg"
              titleImgAlt="truck"
              className={`w-8 h-8 mx-auto ${
                currentTimeSheets.every(
                  (timesheet: TimeSheet) =>
                    !timesheet.truckingLogs ||
                    timesheet.truckingLogs.length === 0
                )
                  ? "opacity-55 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              } `}
              onClick={() => {
                if (
                  !currentTimeSheets.every(
                    (timesheet: TimeSheet) =>
                      !timesheet.truckingLogs ||
                      timesheet.truckingLogs.length === 0
                  )
                ) {
                  setPage(page === 2 ? 1 : 2);
                }
              }}
            />
          </Buttons>

          <Buttons
            shadow="none"
            background={
              currentTimeSheets.every(
                (timesheet: TimeSheet) =>
                  !timesheet.tascoLogs || timesheet.tascoLogs.length === 0
              )
                ? "darkGray"
                : "lightBlue"
            }
            disabled={currentTimeSheets.every(
              (timesheet: TimeSheet) =>
                !timesheet.tascoLogs || timesheet.tascoLogs.length === 0
            )}
            className={`${page === 3 && "border-[3px] border-app-yellow"}`}
          >
            <Images
              titleImg="/tasco.svg"
              titleImgAlt="tasco"
              className={`w-8 h-8 mx-auto ${
                currentTimeSheets.every(
                  (timesheet: TimeSheet) =>
                    !timesheet.tascoLogs || timesheet.tascoLogs.length === 0
                )
                  ? "opacity-55 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              }`}
              onClick={() => {
                if (
                  !currentTimeSheets.every(
                    (timesheet: TimeSheet) =>
                      !timesheet.tascoLogs || timesheet.tascoLogs.length === 0
                  )
                ) {
                  setPage(page === 3 ? 1 : 3);
                }
              }}
            />
          </Buttons>

          <Buttons
            shadow="none"
            background={
              currentTimeSheets.every(
                (timesheet: TimeSheet) =>
                  !timesheet.employeeEquipmentLogs ||
                  timesheet.employeeEquipmentLogs.length === 0
              )
                ? "darkGray"
                : "lightBlue"
            }
            disabled={currentTimeSheets.every(
              (timesheet: TimeSheet) =>
                !timesheet.employeeEquipmentLogs ||
                timesheet.employeeEquipmentLogs.length === 0
            )}
            className={`${page === 3 && "border-[3px] border-app-yellow"}`}
          >
            <Images
              titleImg="/equipment.svg"
              titleImgAlt="equipment"
              className={`w-8 h-8 mx-auto ${
                currentTimeSheets.every(
                  (timesheet: TimeSheet) =>
                    !timesheet.employeeEquipmentLogs ||
                    timesheet.employeeEquipmentLogs.length === 0
                )
                  ? "opacity-55 cursor-not-allowed"
                  : "opacity-100 cursor-pointer"
              } `}
              onClick={() => {
                if (
                  !currentTimeSheets.every(
                    (timesheet: TimeSheet) =>
                      !timesheet.employeeEquipmentLogs ||
                      timesheet.employeeEquipmentLogs.length === 0
                  )
                ) {
                  setPage(page === 4 ? 1 : 4);
                }
              }}
            />
          </Buttons>
        </Grids>
      </Holds>
    </>
  );
}
