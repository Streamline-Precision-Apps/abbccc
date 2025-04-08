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

export default function TascoReviewSection({
  currentTimeSheets,
}: {
  currentTimeSheets: TimeSheet[];
}) {
  return (
    <Holds className="h-full">
      {currentTimeSheets.map((timesheet: TimeSheet) => (
        <Holds key={timesheet.id} className="mb-4">
          {/* Only show if this timesheet has trucking logs */}
          {timesheet.tascoLogs && timesheet.tascoLogs.length > 0 && (
            <>
              <Holds className="p-1 border-b-[2px]">
                <Titles position="left" size="h5">
                  Tasco Details
                </Titles>

                {/* Trucking Logs Header */}
                <Holds className="grid grid-cols-3 pt-4 gap-2">
                  <Titles size="h6">EQ Used</Titles>
                  <Titles size="h6">Material Type</Titles>
                  <Titles size="h6">Load Quantity</Titles>
                </Holds>

                {/* Trucking Logs Data */}
                <Holds background="white">
                  {timesheet.tascoLogs.map((log) => (
                    <Holds
                      key={log.id}
                      className="grid grid-cols-3 gap-2 border-b-[2px] py-2"
                    >
                      <Texts size="p7">{log.Equipment?.[0]?.name || "-"}</Texts>
                      <Texts size="p7">{log.materialType || "-"}</Texts>
                      <Texts size="p7">{log.LoadQuantity || "-"}</Texts>
                    </Holds>
                  ))}
                </Holds>

                {/* Refueling Section */}
                {timesheet.tascoLogs.some((log) => log.refueled?.length) && (
                  <>
                    <Holds className="p-1 border-b-[2px] mt-4">
                      <Titles position="left" size="h5">
                        Refueling Information
                      </Titles>
                      <Holds className="grid grid-cols-2 gap-2">
                        <Titles size="h6">Gallons Refueled</Titles>
                        <Titles size="h6">Miles at Refuel</Titles>
                      </Holds>
                    </Holds>
                    <Holds background="white">
                      {timesheet.tascoLogs.map((log) =>
                        log.refueled?.map((refuel) => (
                          <Holds
                            key={refuel.id}
                            className="grid grid-cols-2 gap-2 border-b-[2px] py-2"
                          >
                            <Texts size="p7">{refuel.gallonsRefueled}</Texts>
                          </Holds>
                        ))
                      )}
                    </Holds>
                  </>
                )}
              </Holds>
            </>
          )}
        </Holds>
      ))}
    </Holds>
  );
}
