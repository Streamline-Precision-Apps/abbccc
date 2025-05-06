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

interface TimeSheetRendererProps {
  filter: TimesheetFilter;
  data: any;
  edit: boolean;
  manager: string;
  onDataChange: (data: any) => void;
  date: string;
}

export default function TimeSheetRenderer({
  filter,
  data,
  edit,
  manager,
  onDataChange,
  date,
}: TimeSheetRendererProps) {
  const isEmptyData = !data || (Array.isArray(data) && data.length === 0);

  const renderContent = () => {
    if (isEmptyData) {
      return (
        <Holds className="w-full h-full flex items-center justify-center">
          <Texts size="p6" className="text-gray-500 italic">
            No data available
          </Texts>
        </Holds>
      );
    }

    switch (filter) {
      case "timesheetHighlights":
        return (
          <TimeCardHighlights
          highlightTimesheet={data}
          edit={edit}
          manager={manager}
          onDataChange={onDataChange}
          date={date} // Pass the date prop
        />
        );
      case "truckingMileage":
        return (
          <TimeCardTruckingMileage
            truckingMileage={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "truckingEquipmentHaulLogs":
        return (
          <TimeCardTruckingHaulLogs
            truckingEquipmentHaulLogs={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "truckingMaterialHaulLogs":
        return (
          <TimeCardTruckingMaterialLogs
            truckingMaterialHaulLogs={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "truckingRefuelLogs":
        return (
          <TimeCardTruckingRefuelLogs
            truckingRefuelLogs={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "truckingStateLogs":
        return (
          <TimeCardTruckingStateMileageLogs
            truckingStateLogs={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "tascoHaulLogs":
        return (
          <TimeCardTascoHaulLogs
            tascoHaulLogs={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "tascoRefuelLogs":
        return (
          <TimeCardTascoRefuelLogs
            tascoRefuelLog={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "equipmentLogs":
        return (
          <TimeCardEquipmentLogs
            equipmentLogs={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
        );
      case "equipmentRefuelLogs":
        return (
          <TimeCardEquipmentRefuelLogs
            equipmentRefuelLogs={data}
            edit={edit}
            manager={manager} setEdit={function (edit: boolean): void {
              throw new Error("Function not implemented.");
            } }          />
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