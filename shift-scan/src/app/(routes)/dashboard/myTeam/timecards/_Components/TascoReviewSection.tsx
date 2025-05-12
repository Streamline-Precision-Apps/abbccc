"use client";
type employeeEquipmentLogs = {
  id: string;
  startTime: string;
  endTime: string;
  equipment: Equipment[];
  refueled: EquipmentRefueled[];
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

type stateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
};

type Materials = {
  id: string;
  name: string;
  quantity: number;
  loadType: string;
  LoadWeight: number;
};

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

import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

export default function TascoReviewSection({
  currentTimeSheets,
}: {
  currentTimeSheets: TimeSheet[];
}) {
  return (
    <Holds
      className="h-full w-full overflow-y-auto no-scrollbar py-5 "
      style={{ touchAction: "pan-y" }}
    >
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

        {currentTimeSheets.map((timesheet: TimeSheet) => (
          <Holds key={timesheet.id} className="mb-4">
            {/* Only show if this timesheet has trucking logs */}
            {timesheet.TascoLogs && timesheet.TascoLogs.length > 0 && (
              <>
                {/* Trucking Logs Data */}
                <Holds background="white">
                  {timesheet.TascoLogs.map((log) => (
                    <Holds
                      key={log.id}
                      className="grid grid-cols-3 gap-2 border-b-[2px] py-2"
                    >
                      <Texts size="p7">{log.Equipment?.name || "-"}</Texts>
                      <Texts size="p7">{log.materialType || "-"}</Texts>
                      <Texts size="p7">{log.LoadQuantity || "-"}</Texts>
                    </Holds>
                  ))}
                </Holds>

                {/* Refueling Section */}
                {timesheet.TascoLogs.some((log) => log.RefuelLogs?.length) && (
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
                      {timesheet.TascoLogs.map((log) =>
                        log.RefuelLogs?.map((refuel) => (
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
              </>
            )}
          </Holds>
        ))}
      </Holds>
    </Holds>
  );
}
