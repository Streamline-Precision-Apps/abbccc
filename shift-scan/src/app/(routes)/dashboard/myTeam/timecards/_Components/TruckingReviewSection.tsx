"use client";

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
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export default function TruckingReviewSection({
  currentTimeSheets,
}: {
  currentTimeSheets: TimeSheet[];
}) {
  const t = useTranslations("TimeCardSwiper");
  // Combine all trucking logs from all timesheets
  const allTruckingLogs = currentTimeSheets.flatMap(
    (timesheet) => timesheet.TruckingLogs || []
  );

  // Check if we have any trucking data at all
  const hasAnyTruckingData = allTruckingLogs.length > 0;

  // Check for specific data sections
  const hasMileageData = allTruckingLogs.some(
    (log) => log.startingMileage || log.endingMileage
  );

  const hasRefuelData = allTruckingLogs.some((log) => log.RefuelLogs?.length);

  const hasStateMileage = allTruckingLogs.some(
    (log) => log.StateMileages?.length
  );

  const hasMaterials = allTruckingLogs.some(
    (log) => log.Materials?.length // Changed from Materials to Material
  );
  const hasEquipmentHauled = allTruckingLogs.some(
    (log) => log.EquipmentHauled?.length
  );

  if (!hasAnyTruckingData) {
    return (
      <Holds className="h-full w-full flex items-center justify-center">
        <Texts size="p6">{t("NoTruckingDataAvailable")}</Texts>
      </Holds>
    );
  }

  return (
    <Holds
      className="h-full w-full overflow-y-auto no-scrollbar py-5 "
      style={{ touchAction: "pan-y" }}
    >
      {/* Main Trucking Logs */}
      <Titles position="left" size="h6" className="">
        {t("MileageReports")}
      </Titles>
      <Holds background={"white"} className="border-[3px] border-black">
        {hasMileageData && (
          <>
            <Grids cols={"2"} gap={"2"}>
              <Holds className="w-full pl-3 ">
                <Texts position={"left"} size={"p7"}>
                  {t("EQ")}
                </Texts>
              </Holds>

              <Texts size={"p7"}>{t("StartEndMileage")}</Texts>
            </Grids>
            {allTruckingLogs.map((log) => (
              <Grids
                key={log.id}
                cols={"2"}
                gap={"2"}
                className={`p-2 border-b border-gray-200 last:border-0 ${
                  log.endingMileage &&
                  log.startingMileage > log.endingMileage &&
                  "bg-red-500"
                }`}
              >
                <Texts position={"left"} size={"p7"}>
                  {`${(log.Equipment as Equipment | null)?.name.slice(0, 15)}${
                    ((log.Equipment as Equipment | null)?.name?.length ?? 0) >
                    15
                      ? "..."
                      : ""
                  }` || "-"}
                </Texts>

                <Holds position={"row"} className={`w-full gap-2 `}>
                  <Texts size={"p7"}>{log.startingMileage || "-"}</Texts>
                  <Images
                    titleImg={"/arrowRightThin.svg"}
                    titleImgAlt="Arrow"
                    className="max-w-4 h-auto object-contain"
                  />
                  <Texts size={"p7"}>{log.endingMileage || "-"}</Texts>
                </Holds>
              </Grids>
            ))}
          </>
        )}
      </Holds>
      <Holds position={"row"} className="h-full w-full gap-4 my-2">
        {/* Refueling Section */}
        {hasRefuelData && (
          <Holds className="h-full w-full ">
            <Titles position="left" size="h6">
              {t("FuelReport")}
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
                <Texts size={"p7"}>{t("Gallons")}</Texts>
                <Texts size={"p7"}>{t("Mileage")}</Texts>
              </Grids>
              {allTruckingLogs.flatMap(
                (log) =>
                  log.RefuelLogs?.map((refuel) => (
                    <Grids
                      key={refuel.id}
                      cols={"2"}
                      gap={"2"}
                      className="p-2 border-b border-gray-200 last:border-0"
                    >
                      <Texts
                        size={"p7"}
                      >{`${refuel.gallonsRefueled} Gal`}</Texts>
                      <Texts size={"p7"}>{`${refuel.milesAtFueling} mi`}</Texts>
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
              {t("StateMileage")}
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
                <Texts size={"p7"}>{t("State")}</Texts>
                <Texts size={"p7"}>{t("Mileage")}</Texts>
              </Grids>
              {allTruckingLogs.flatMap(
                (log) =>
                  log.StateMileages?.map((state) => (
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
            {t("MaterialHauled")}
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
              <Texts size={"p7"}>{t("Material")}</Texts>

              <Texts size={"p7"}>{t("LoadType")}</Texts>
              <Texts size={"p7"}>{t("Weight")}</Texts>
            </Grids>
            {allTruckingLogs.flatMap(
              (log) =>
                log.Materials?.map((material) => (
                  <Grids
                    key={material.id}
                    cols={"4"}
                    gap={"2"}
                    className="p-2 border-b border-gray-200 last:border-0"
                  >
                    <Texts size={"p7"}>{material.name || "-"}</Texts>
                    <Texts size={"p7"}>{material.loadType || "-"}</Texts>
                    <Texts size={"p7"}>{material.lightWeight || "-"}</Texts>
                    <Texts size={"p7"}>{material.grossWeight || "-"}</Texts>
                    <Texts size={"p7"}>{material.grossWeight || "-"}</Texts>
                  </Grids>
                )) || []
            )}
          </Holds>
        </Holds>
      )}

      {/* Equipment Hauled Section */}
      {hasEquipmentHauled && (
        <Holds className="mb-6">
          <Titles position="left" size="h6">
            {t("EquipmentHauled")}
          </Titles>
          <Holds
            background="white"
            className="border-2 border-black rounded-md"
          >
            <Grids
              cols={"2"}
              gap={"2"}
              className="py-1 bg-gray-200 border-b border-black"
            >
              <Texts size={"p7"}>{t("Equipment")}</Texts>
              <Texts size={"p7"}>{t("Job")}</Texts>
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
                      {(hauled.Equipment as unknown as Equipment | null)?.name}
                    </Texts>
                    <Texts size={"p7"}>
                      {(hauled.JobSite as unknown as JobSite | null)?.name}
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
