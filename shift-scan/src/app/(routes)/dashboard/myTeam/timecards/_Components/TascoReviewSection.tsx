"use client";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
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

type RefuelLog = {
  id: string;
  gallonsRefueled: number;
  milesAtFueling?: number;
};

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

interface TascoReviewSectionProps {
  currentTimeSheets: TimeSheet[];
}

export default function TascoReviewSection({
  currentTimeSheets,
}: TascoReviewSectionProps) {
  const t = useTranslations("TimeCardSwiper");
  const allTascoLogs = currentTimeSheets.flatMap(
    (timesheet) => timesheet.TascoLogs || [],
  );

  if (allTascoLogs.length === 0) {
    return (
      <Holds className="h-full w-full flex items-center justify-center">
        <Texts size="p6">{t("NoTascoDataAvailable")}</Texts>
      </Holds>
    );
  }

  // Helper to format hauling info
  const formatHauling = (log: TascoLog) => {
    return `${log.shiftType?.split(" ")[0] || "-"} | ${log.laborType || "-"} | ${log.Equipment?.name || "-"} | ${log.materialType || "N/A"} | Loads: ${log.LoadQuantity || "0"}`;
  };

  // Helper to format refuel info
  const formatRefuel = (log: TascoLog) => {
    if (!log.RefuelLogs?.length) return "-";
    return log.RefuelLogs.map(
      (r: RefuelLog) => `${r.gallonsRefueled} gal`,
    ).join(", ");
  };

  return (
    <Accordion type="single" collapsible>
      {allTascoLogs.map((log: TascoLog) => (
        <AccordionItem
          value={log.id}
          key={log.id}
          className="bg-white rounded-lg mb-2"
        >
          <AccordionTrigger className="p-2 focus:outline-none hover:no-underline focus:underline-none focus:border-none flex flex-col items-start gap-1">
            <p className="text-xs font-semibold">
              Hauling: {formatHauling(log)}
            </p>
            <p className="text-xs">Refuel: {formatRefuel(log)}</p>
          </AccordionTrigger>
          <AccordionContent>
            <Holds className="p-2 bg-white flex flex-col items-start relative border-t border-gray-200">
              <Texts size="sm" className="text-xs">
                <strong>Shift:</strong> {log.shiftType?.split(" ")[0] || "-"}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Labor:</strong> {log.laborType || "-"}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Equipment:</strong> {log.Equipment?.name || "-"}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Material:</strong> {log.materialType || "N/A"}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Loads:</strong> {log.LoadQuantity || "0"}
              </Texts>
              <Texts size="sm" className="text-xs">
                <strong>Refuel:</strong> {formatRefuel(log)}
              </Texts>
            </Holds>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
