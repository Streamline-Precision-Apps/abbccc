"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { TimesheetFilter } from "@/lib/types";
import TimeCardEquipmentLogs from "./TimeCardEquipmentLogs";
import TimeCardEquipmentRefuelLogs from "./TimeCardEquipmentRefuelLogs";
import TimeCardHighlights from "./TimeCardHighlights";
import TimeCardTascoHaulLogs from "./TimeCardTascoHaulLogs";
import TimeCardTascoRefuelLogs from "./TimeCardTascoRefuelLogs";
import TimeCardTruckingHaulLogs from "./TimeCardTruckingHaulLogs";
import TimeCardTruckingMaterialLogs from "./TimeCardTruckingMaterialLogs";
import TimeCardTruckingMileage from "./TimeCardTruckingMileage";
import TimeCardTruckingRefuelLogs from "./TimeCardTruckingRefuelLogs";
import TimeCardTruckingStateMileageLogs from "./TimeCardTruckingStateMileage";
import {
  TimesheetHighlights,
  TruckingMileageData,
  TruckingEquipmentHaulLogData,
  TruckingMaterialHaulLogData,
  TruckingRefuelLogData,
  TruckingStateLogData,
  TascoHaulLogData,
  TascoRefuelLogData,
  EquipmentLogsData,
  EmployeeEquipmentLogWithRefuel,
} from "@/lib/types";
import { useTranslations } from "next-intl";

type ProcessedMaterialLog = {
  id: string;
  name: string;
  LocationOfMaterial: string;
  materialWeight: number | null;
  lightWeight: number | null;
  grossWeight: number | null;
  logId: string;
};

type ExtendedTruckingRefuel = import("@/lib/types").TruckingRefuel & {
  truckName: string;
  truckingLogId: string;
};

type ProcessedTascoHaulLog = {
  id: string;
  shiftType: string;
  equipmentId: string | null;
  materialType: string;
  LoadQuantity: number | null;
};

type FlattenedTascoRefuelLog = {
  id: string;
  gallonsRefueled: number | null;
  truckName: string;
  tascoLogId: string;
};

type ProcessedStateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
  truckName: string;
  equipmentId: string;
  truckingLogId: string;
};

type EquipmentRefuelLog = {
  id: string;
  equipmentId: string;
  equipmentName: string;
  gallonsRefueled: number | null;
  employeeEquipmentLogId: string;
};

type EquipmentLogUpdate = {
  id: string;
  startTime?: Date;
  endTime?: Date;
};

interface TimeSheetRendererProps {
  filter: TimesheetFilter;
  data:
    | TimesheetHighlights[]
    | TruckingMileageData
    | TruckingEquipmentHaulLogData
    | TruckingMaterialHaulLogData
    | TruckingRefuelLogData
    | TruckingStateLogData
    | TascoHaulLogData
    | TascoRefuelLogData
    | EquipmentLogsData
    | EmployeeEquipmentLogWithRefuel[]
    | null;
  setData?: (
    data:
      | TimesheetHighlights[]
      | TruckingMileageData
      | TruckingEquipmentHaulLogData
      | TruckingMaterialHaulLogData
      | TruckingRefuelLogData
      | TruckingStateLogData
      | TascoHaulLogData
      | TascoRefuelLogData
      | EquipmentLogsData
      | EmployeeEquipmentLogWithRefuel[]
  ) => void;
  edit: boolean;
  manager: string;
  onDataChange:
    | ((data: TimesheetHighlights[]) => void)
    | ((data: import("@/lib/types").TruckingMileageUpdate[]) => void)
    | ((data: import("@/lib/types").TruckingEquipmentHaulLogData) => void)
    | ((data: TruckingMaterialHaulLogData) => void)
    | ((data: TruckingRefuelLogData) => void)
    | ((data: TruckingStateLogData) => void)
    | ((data: ProcessedTascoHaulLog[]) => void)
    | ((data: FlattenedTascoRefuelLog[]) => void)
    | ((data: EquipmentLogUpdate[]) => void)
    | ((data: EquipmentRefuelLog[]) => void);
  date: string;
}

const getTypedOnDataChange = <T,>(
  handler: unknown
): ((data: T) => void) | undefined => {
  return typeof handler === "function"
    ? (handler as (data: T) => void)
    : undefined;
};

export default function TimeSheetRenderer({
  filter,
  data,
  setData,
  edit,
  manager,
  onDataChange,
  date,
}: TimeSheetRendererProps) {
  const t = useTranslations("MyTeam");
  const isEmptyData = !data || (Array.isArray(data) && data.length === 0);

  const renderContent = () => {
    if (isEmptyData) {
      return (
        <Holds className="w-full h-full flex items-center justify-center">
          <Texts size="p6" className="text-gray-500 italic">
            {`${t("NoDataFoundForCurrentDate")} `}
          </Texts>
        </Holds>
      );
    }

    switch (filter) {
      case "timesheetHighlights":
        return (
          <TimeCardHighlights
            highlightTimesheet={data as TimesheetHighlights[]}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TimesheetHighlights[]>(onDataChange)!
            }
            date={date}
          />
        );
      case "truckingMileage":
        return (
          <TimeCardTruckingMileage
            truckingMileage={data as TruckingMileageData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingMileageData>(onDataChange)!
            }
          />
        );
      case "truckingEquipmentHaulLogs":
        return (
          <TimeCardTruckingHaulLogs
            truckingEquipmentHaulLogs={data as TruckingEquipmentHaulLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingEquipmentHaulLogData>(onDataChange)!
            }
          />
        );
      case "truckingMaterialHaulLogs":
        return (
          <TimeCardTruckingMaterialLogs
            truckingMaterialHaulLogs={data as TruckingMaterialHaulLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingMaterialHaulLogData>(onDataChange)!
            }
          />
        );
      case "truckingRefuelLogs":
        return (
          <TimeCardTruckingRefuelLogs
            truckingRefuelLogs={data as TruckingRefuelLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingRefuelLogData>(onDataChange)!
            }
          />
        );
      case "truckingStateLogs":
        return (
          <TimeCardTruckingStateMileageLogs
            truckingStateLogs={data as TruckingStateLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TruckingStateLogData>(onDataChange)!
            }
          />
        );
      case "tascoHaulLogs": {
        return (
          <TimeCardTascoHaulLogs
            edit={edit}
            manager={manager}
            tascoHaulLogs={data as TascoHaulLogData}
            onDataChange={getTypedOnDataChange<TascoHaulLogData>(onDataChange)!}
          />
        );
      }
      case "tascoRefuelLogs":
        return (
          <TimeCardTascoRefuelLogs
            tascoRefuelLog={data as TascoRefuelLogData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<TascoRefuelLogData>(onDataChange)!
            }
          />
        );
      case "equipmentLogs":
        return (
          <TimeCardEquipmentLogs
            equipmentLogs={data as EquipmentLogsData}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<EquipmentLogUpdate[]>(onDataChange)!
            }
          />
        );
      case "equipmentRefuelLogs":
        return (
          <TimeCardEquipmentRefuelLogs
            equipmentRefuelLogs={data as EmployeeEquipmentLogWithRefuel[]}
            edit={edit}
            manager={manager}
            onDataChange={
              getTypedOnDataChange<EquipmentRefuelLog[]>(onDataChange)!
            }
          />
        );
      default:
        return null;
    }
  };

  return (
    <Holds className="row-start-2 row-end-7 h-full w-full overflow-y-scroll no-scrollbar">
      {renderContent()}
    </Holds>
  );
}
