"use client";

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

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

export default function GeneralReviewSection({
  currentTimeSheets,
  isScrolling, // Default to 'verticle' if not provided
  scrollSwipeHandlers,
}: {
  currentTimeSheets: TimeSheet[];
  isScrolling: boolean;
  scrollSwipeHandlers?: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: (e: React.TouchEvent) => void;
  };
}) {
  const t = useTranslations("TimeCardSwiper");

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Holds background={"white"} className="h-full border-[3px] border-black ">
        <Holds
          position={"row"}
          className="border-b-[3px] border-black py-1 px-2"
        >
          <Holds className="max-w-7"></Holds>
          <Grids cols={"3"} gap={"2"} className="w-full">
            <Titles size={"h6"}>{t("StartEnd")}</Titles>
            <Titles size={"h6"}>{t("Jobs")}</Titles>
            <Titles size={"h6"}>{t("CostCode")}</Titles>
          </Grids>
        </Holds>
        <Holds
          className={`h-full no-scrollbar ${
            isScrolling ? "overflow-y-scroll" : "overflow-none"
          }`}
          {...scrollSwipeHandlers}
        >
          {currentTimeSheets.map((timesheet: TimeSheet) => (
            <Holds
              position={"row"}
              className=" border-b-[3px] border-black py-2 pr-1"
              key={timesheet.id}
            >
              <Holds position={"row"}>
                <Holds className="max-w-7 mx-2">
                  {timesheet.workType === "TRUCK_DRIVER" ? (
                    <Images
                      titleImg="/trucking.svg"
                      titleImgAlt="Trucking Icon"
                      className="w-7 h-7 "
                    />
                  ) : timesheet.workType === "MECHANIC" ? (
                    <Images
                      titleImg="/mechanic.svg"
                      titleImgAlt="Mechanic Icon"
                      className="w-7 h-7 "
                    />
                  ) : timesheet.workType === "TASCO" ? (
                    <Images
                      titleImg="/tasco.svg"
                      titleImgAlt="Tasco Icon"
                      className="w-7 h-7 "
                    />
                  ) : (
                    <Images
                      titleImg="/equipment.svg"
                      titleImgAlt="General Icon"
                      className="w-7 h-7 "
                    />
                  )}
                </Holds>
                <Grids cols={"3"} gap={"1"} className="w-full h-full">
                  <Holds className="col-span-1">
                    <Holds>
                      <Texts size={"p7"}>
                        {formatTime(timesheet.startTime)}
                      </Texts>
                    </Holds>
                    <Holds>
                      <Texts size={"p7"}>{formatTime(timesheet.endTime)}</Texts>
                    </Holds>
                  </Holds>

                  <Holds className="col-span-1">
                    <Texts size={"p7"}>
                      {`${timesheet.Jobsite.name.slice(0, 9)}` || "-"}
                    </Texts>
                  </Holds>
                  <Holds className="col-span-1">
                    <Texts size={"p7"}>
                      {`${timesheet.CostCode.name.split(" ")[0]}` || "-"}
                    </Texts>
                  </Holds>
                </Grids>
              </Holds>
            </Holds>
          ))}
        </Holds>
      </Holds>
    </>
  );
}
