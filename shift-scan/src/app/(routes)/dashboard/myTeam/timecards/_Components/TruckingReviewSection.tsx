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
  TascoLogs: {
    id: string;
    shiftType: string;
    laborType: string;
    materialType: string | null;
    LoadQuantity: number;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
  TruckingLogs: {
    id: string;
    laborType: string;
    startingMileage: number;
    endingMileage: number | null;
    Equipment: {
      id: string;
      name: string;
    };
    Materials: {
      id: string;
      name: string;
      quantity: number;
      loadType: string;
      grossWeight: number;
      lightWeight: number;
      materialWeight: number;
    }[];
    EquipmentHauled: {
      id: string;
      Equipment: {
        name: string;
      };
      JobSite: {
        name: string;
      };
    }[];
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
      milesAtFueling?: number;
    }[];
    StateMileages: {
      id: string;
      state: string;
      stateLineMileage: number;
    }[];
  }[];
  EmployeeEquipmentLogs: {
    id: string;
    startTime: string;
    endTime: string;
    Equipment: {
      id: string;
      name: string;
    };
    RefuelLogs: {
      id: string;
      gallonsRefueled: number;
    }[];
  }[];
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
  const formatMileage = (log: any) => {
    const start = log.startingMileage ?? "-";
    const end = log.endingMileage ?? "-";
    return `${start} → ${end}`;
  };

  // Helper to format refuel info
  const formatRefuel = (log: any) => {
    if (!log.RefuelLogs?.length) return "-";
    return log.RefuelLogs.map((r: any) => `${r.gallonsRefueled} gal`).join(
      ", ",
    );
  };

  // Helper to format state mileage
  const formatStateMileage = (log: any) => {
    if (!log.StateMileages?.length) return "-";
    return log.StateMileages.map(
      (s: any) => `${s.state}: ${s.stateLineMileage} mi`,
    ).join(", ");
  };

  // Helper to format materials
  const formatMaterials = (log: any) => {
    if (!log.Materials?.length) return "-";
    return log.Materials.map(
      (m: any) => `${m.name} (${m.materialWeight ?? "-"} lbs)`,
    ).join(", ");
  };

  // Helper to format equipment hauled
  const formatEquipmentHauled = (log: any) => {
    if (!log.EquipmentHauled?.length) return "-";
    return log.EquipmentHauled.map(
      (e: any) => `${e.Equipment?.name ?? "-"} → ${e.JobSite?.name ?? "-"}`,
    ).join(", ");
  };

  return (
    <Accordion type="single" collapsible>
      {allTruckingLogs.map((log: any) => (
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
