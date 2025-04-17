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

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";

export default function TruckingReviewSection({
  currentTimeSheets,
}: {
  currentTimeSheets: TimeSheet[];
}) {
  // Combine all trucking logs from all timesheets
  const allTruckingLogs = currentTimeSheets.flatMap(
    (timesheet) => timesheet.truckingLogs || []
  );

  // Check if we have any trucking data at all
  const hasAnyTruckingData = allTruckingLogs.length > 0;

  // Check for specific data sections
  const hasMileageData = allTruckingLogs.some(
    (log) => log.startingMileage || log.endingMileage
  );

  const hasRefuelData = allTruckingLogs.some((log) => log.Refueled?.length);

  const hasStateMileage = allTruckingLogs.some(
    (log) => log.stateMileage?.length
  );

  const hasMaterials = allTruckingLogs.some(
    (log) => log.Material?.length // Changed from Materials to Material
  );
  const hasEquipmentHauled = allTruckingLogs.some(
    (log) => log.EquipmentHauled?.length
  );

  console.log("All Trucking Logs:", allTruckingLogs);
  console.log("Has Any Trucking Data:", hasAnyTruckingData);
  console.log("Has Mileage Data:", hasMileageData);
  console.log("Has Refuel Data:", hasRefuelData);
  console.log("Has State Mileage Data:", hasStateMileage);
  console.log("Has Materials Data:", hasMaterials);
  console.log("Has Equipment Hauled Data:", hasEquipmentHauled);

  if (!hasAnyTruckingData) {
    return (
      <Holds className="h-full w-full flex items-center justify-center">
        <Texts size="p6">No trucking data available</Texts>
      </Holds>
    );
  }

  return (
    <Holds
      className="h-full w-full overflow-y-auto no-scrollbar"
      style={{ touchAction: "pan-y" }}
    >
      {/* Main Trucking Logs */}
      <Holds className="mb-2">
        <Titles position="left" size="h6" className="mb-2">
          Mileage Reports
        </Titles>
        {hasMileageData && (
          <Holds
            background="white"
            className="border-2 border-black rounded-md"
          >
            <Grids
              cols={"3"}
              gap={"2"}
              className="p-1 bg-gray-100 border-b border-black"
            >
              <Texts size={"p7"}>EQ#</Texts>
              <Texts size={"p7"}>Start </Texts>
              <Texts size={"p7"}>End Mileage</Texts>
            </Grids>
            {allTruckingLogs.map((log) => (
              <Grids
                key={log.id}
                cols={"3"}
                gap={"2"}
                className="p-2 border-b border-gray-200 last:border-0"
              >
                <Texts size={"p7"}>
                  {`${(log.equipment as Equipment | null)?.name.slice(0, 9)}${
                    ((log.equipment as Equipment | null)?.name?.length ?? 0) > 9
                      ? "..."
                      : ""
                  }` || "-"}
                </Texts>
                {log.laborType === "truckEquipmentOperator" ? (
                  <Texts size={"p7"}>EQ Operator</Texts>
                ) : (
                  <>
                    <Texts size={"p7"}>{log.startingMileage || "-"}</Texts>
                    <Texts size={"p7"}>{log.endingMileage || "-"}</Texts>
                  </>
                )}
              </Grids>
            ))}
          </Holds>
        )}
      </Holds>
      <Holds position={"row"} className="h-full w-full gap-4 my-2">
        {/* Refueling Section */}
        {hasRefuelData && (
          <Holds className="h-full w-full ">
            <Titles position="left" size="h6">
              Fuel Reports
            </Titles>
            <Holds
              background="white"
              className="border-2 border-black rounded-md h-full"
            >
              <Grids
                cols={"2"}
                gap={"2"}
                className="p-2 bg-gray-100 border-b border-black"
              >
                <Texts size={"p7"}>Gallons</Texts>
                <Texts size={"p7"}>Mileage</Texts>
              </Grids>
              {allTruckingLogs.flatMap(
                (log) =>
                  log.Refueled?.map((refuel) => (
                    <Grids
                      key={refuel.id}
                      cols={"2"}
                      gap={"2"}
                      className="p-2 border-b border-gray-200 last:border-0"
                    >
                      <Texts
                        size={"p7"}
                      >{`${refuel.gallonsRefueled} Gal`}</Texts>
                      <Texts size={"p7"}>{`${refuel.milesAtfueling} mi`}</Texts>
                    </Grids>
                  )) || []
              )}
            </Holds>
          </Holds>
        )}

        {/* State Mileage Section */}
        {hasStateMileage && (
          <Holds className="h-full w-full my-2">
            <Titles position="left" size="h6">
              State Mileage
            </Titles>
            <Holds
              background="white"
              className="border-2 border-black rounded-md h-fit"
            >
              <Grids
                cols={"2"}
                gap={"2"}
                className="p-2 bg-gray-100 border-b border-black"
              >
                <Texts size={"p7"}>State</Texts>
                <Texts size={"p7"}>Mileage</Texts>
              </Grids>
              {allTruckingLogs.flatMap(
                (log) =>
                  log.stateMileage?.map((state) => (
                    <Grids
                      key={state.id}
                      cols={"2"}
                      gap={"2"}
                      className="p-2 border-b border-gray-200 last:border-0"
                    >
                      <Texts size={"p7"}>{state.state || "-"}</Texts>
                      <Texts size={"p7"}>{state.stateLineMileage || "-"}</Texts>
                    </Grids>
                  )) || []
              )}
            </Holds>
          </Holds>
        )}
      </Holds>
      {/* Materials Section */}
      {hasMaterials && (
        <Holds className="mb-6">
          <Titles position="left" size="h6" className="mb-2">
            Materials Hauled
          </Titles>
          <Holds
            background="white"
            className="border-2 border-black rounded-md"
          >
            <Grids
              cols={"4"}
              gap={"2"}
              className="p-2 bg-gray-100 border-b border-black"
            >
              <Texts size={"p7"}>Material</Texts>
              <Texts size={"p7"}>Quantity</Texts>
              <Texts size={"p7"}>Load Type</Texts>
              <Texts size={"p7"}>Weight</Texts>
            </Grids>
            {allTruckingLogs.flatMap(
              (log) =>
                log.Material?.map((material) => (
                  <Grids
                    key={material.id}
                    cols={"4"}
                    gap={"2"}
                    className="p-2 border-b border-gray-200 last:border-0"
                  >
                    <Texts size={"p7"}>{material.name || "-"}</Texts>
                    <Texts size={"p7"}>{material.quantity || "-"}</Texts>

                    <Texts size={"p7"}>{material.loadType || "-"}</Texts>
                    <Texts size={"p7"}>{material.LoadWeight || "-"}</Texts>
                  </Grids>
                )) || []
            )}
          </Holds>
        </Holds>
      )}

      {/* Equipment Hauled Section */}
      {hasEquipmentHauled && (
        <Holds className="mb-6">
          <Titles position="left" size="h6" className="mb-2">
            Equipment Hauled
          </Titles>
          <Holds
            background="white"
            className="border-2 border-black rounded-md"
          >
            <Grids
              cols={"2"}
              gap={"2"}
              className="p-2 bg-gray-100 border-b border-black"
            >
              <Texts size={"p7"}>Equipment</Texts>
              <Texts size={"p7"}>Job Site</Texts>
            </Grids>
            {allTruckingLogs.flatMap(
              (log) =>
                log.EquipmentHauled?.map((hauled) => (
                  <Grids
                    key={hauled.id}
                    cols={"2"}
                    gap={"2"}
                    className="p-2 border-b border-gray-200 last:border-0"
                  >
                    <Texts size={"p7"}>
                      {(hauled.equipment as unknown as Equipment | null)?.name}
                    </Texts>
                    <Texts size={"p7"}>
                      {(hauled.jobSite as unknown as JobSite | null)?.name}
                    </Texts>
                  </Grids>
                )) || []
            )}
          </Holds>
        </Holds>
      )}
    </Holds>
  );
}
