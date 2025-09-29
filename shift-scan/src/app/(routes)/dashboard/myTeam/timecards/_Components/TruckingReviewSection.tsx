"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type TascoLog = {
  id: string;
  shiftType: string;
  laborType: string;
  materialType: string | null;
  LoadQuantity: number;
  Equipment: {
    id: string;
    name: string;
  };
  RefuelLogs: RefuelLog[];
};

type TimeSheet = {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  jobsiteId: string;
  workType: string;
  status: string;
  CostCode: {
    name: string;
  };
  Jobsite: {
    name: string;
  };
  TascoLogs: TascoLog[];
  TruckingLogs: TruckingLog[];
  EmployeeEquipmentLogs: {
    id: string;
    startTime: string;
    endTime: string;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: RefuelLog[];
  }[];
};

type RefuelLog = {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number;
};

type StateMileage = {
  id: string;
  state: string;
  stateLineMileage: number;
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

type EquipmentHauled = {
  id: string;
  Equipment: {
    name: string;
  };
  JobSite: {
    name: string;
  };
};

type TruckingLog = {
  id: string;
  laborType: string;
  startingMileage: number;
  endingMileage: number | null;
  Equipment: {
    id: string;
    name: string;
  };
  Materials: Material[];
  EquipmentHauled: EquipmentHauled[];
  RefuelLogs: RefuelLog[];
  StateMileages: StateMileage[];
};

export default function TruckingReviewSection({
  currentTimeSheets,
}: {
  currentTimeSheets: TimeSheet[];
}) {
  const t = useTranslations("TimeCardSwiper");
  const [tabs, setTabs] = useState(1);
  // Combine all trucking logs from all timesheets
  const allTruckingLogs = currentTimeSheets.flatMap(
    (timesheet) => timesheet.TruckingLogs || [],
  );

  if (allTruckingLogs.length === 0) {
    return (
      <Holds className="h-full w-full flex items-center justify-center">
        <Texts size="p6">{t("NoTruckingDataAvailable")}</Texts>
      </Holds>
    );
  }

  // Helper to format mileage range
  const formatMileage = (log: TruckingLog) => {
    const start = log.startingMileage ?? "-";
    const end = log.endingMileage ?? "-";
    return `${start} → ${end}`;
  };

  // Helper to format refuel info
  const formatRefuel = (log: TruckingLog) => {
    if (!log.RefuelLogs?.length) return "-";
    return log.RefuelLogs.map(
      (r: RefuelLog) => `${r.gallonsRefueled} gal`,
    ).join(", ");
  };

  // Helper to format state mileage
  const formatStateMileage = (log: TruckingLog) => {
    if (!log.StateMileages?.length) return "-";
    return log.StateMileages.map(
      (s: StateMileage) => `${s.state}: ${s.stateLineMileage} mi`,
    ).join(", ");
  };

  // Helper to format materials
  const formatMaterials = (log: TruckingLog) => {
    if (!log.Materials?.length) return "-";
    return log.Materials.map(
      (m: Material) => `${m.name} (${m.materialWeight ?? "-"} lbs)`,
    ).join(", ");
  };

  // Helper to format equipment hauled
  const formatEquipmentHauled = (log: TruckingLog) => {
    if (!log.EquipmentHauled?.length) return "-";
    return log.EquipmentHauled.map(
      (e: EquipmentHauled) =>
        `${e.Equipment?.name ?? "-"} → ${e.JobSite?.name ?? "-"}`,
    ).join(", ");
  };

  return (
    <Accordion type="single" collapsible>
      {allTruckingLogs.map((log: TruckingLog) => (
        <AccordionItem
          value={log.id}
          key={log.id}
          className="bg-white rounded-lg mb-2"
        >
          <AccordionTrigger className="p-2 focus:outline-none hover:no-underline focus:underline-none focus:border-none flex flex-col items-start gap-1">
            <p className="text-xs font-semibold">
              Truck: {log.Equipment?.name ?? "-"}
            </p>
            <p className="text-xs">Mileage: {formatMileage(log)}</p>
            <p className="text-xs">Refuel: {formatRefuel(log)}</p>
            <p className="text-xs">State Mileage: {formatStateMileage(log)}</p>
            <p className="text-xs">Materials: {formatMaterials(log)}</p>
            <p className="text-xs">
              Equipment Hauled: {formatEquipmentHauled(log)}
            </p>
          </AccordionTrigger>
          <AccordionContent>
            <Holds className="p-2 bg-white flex flex-col items-start relative border-t border-gray-200">
              <Texts size="sm" className="text-xs">
                <strong>Truck:</strong> {log.Equipment?.name ?? "-"}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Mileage:</strong> {formatMileage(log)}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Refuel:</strong> {formatRefuel(log)}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>State Mileage:</strong> {formatStateMileage(log)}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Materials:</strong> {formatMaterials(log)}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Equipment Hauled:</strong> {formatEquipmentHauled(log)}
              </Texts>
            </Holds>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
