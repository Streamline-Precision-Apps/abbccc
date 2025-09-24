"use client";

import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import { Titles } from "./titles";
import { Holds } from "./holds";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Texts } from "./texts";
import Spinner from "../(animations)/spinner";
import { useTranslations } from "next-intl";
import { formatDuration } from "@/utils/formatDuration";
import { Images } from "./images";
// Type for Equipment
interface Equipment {
  id: string;
  name: string;
  qrId?: string;
}

// Type for Employee Equipment Log
interface EmployeeEquipmentLog {
  id: string;
  startTime: string;
  endTime?: string | null;
  equipment: Equipment;
}

// Type for Tasco Logs
interface TascoLog {
  laborType: string;
  equipment?: Equipment;
}

// Type for Trucking Logs
interface TruckingLog {
  laborType: string;
  equipment: Equipment;
}

// Type for Job Site
interface Jobsite {
  id: string;
  qrId: string;
  name: string;
}

// Type for Cost Code
interface CostCode {
  id: string;
  name: string;
  description: string;
}

// Type for API Response
interface BannerData {
  id: string;
  startTime: string;
  jobsite: Jobsite;
  costCode: CostCode;
  employeeEquipmentLog: EmployeeEquipmentLog[];
  tascoLogs: TascoLog[];
  truckingLogs: TruckingLog[];
}

export default function BannerRotating() {
  const t = useTranslations("BannerRotating");
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [newDate, setNewDate] = useState(new Date());
  const online = useOnlineStatus();

  const settings = {
    dots: true,
    draggable: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setNewDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const calculateDuration = () => {
    if (!bannerData?.startTime) return "";
    return formatDuration(bannerData?.startTime, newDate);
  };

  // Fetch timeSheetId and banner data together
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch the most recent timeSheetId
        const timeSheetData = await fetchWithOfflineCache(
          "recentTimecard",
          () => fetch("/api/getRecentTimecard").then((res) => res.json()),
          { forceRefresh: true } // Force fresh data for timesheet check
        );

        // If no timesheet exists (new user or no recent timesheet), skip banner data fetch
        if (!timeSheetData?.id) {
          setBannerData(null);
          return;
        }

        // Step 2: Fetch banner data using the obtained timeSheetId
        const bannerData = await fetchWithOfflineCache(
          `bannerData-${timeSheetData.id}`,
          () =>
            fetch(`/api/getBannerData?id=${timeSheetData.id}`).then((res) =>
              res.json()
            )
        );
        // console.log(bannerData); // Uncomment for debugging

        if (!bannerData) {
          throw new Error("Failed to fetch banner data.");
        }

        setBannerData(bannerData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [online]); // Re-fetch when online status changes

  // Show loading message
  if (loading) {
    return (
      <Holds className="w-[80%] h-full animate-pulse justify-center items-center ">
        <Spinner size={50} color="white" />
      </Holds>
    );
  }

  // Ensure we have valid data before rendering
  if (!bannerData || !bannerData.jobsite) {
    return (
      <Holds className="w-[80%] ">
        <Titles text={"white"}>{t("WelcomeToDashboard")}</Titles>
      </Holds>
    );
  }

  return (
    <Holds className="w-[80%]">
      <Slider {...settings} className="h-full">
        {/* Jobsite Information */}
        {bannerData.jobsite && (
          <Holds className="h-full justify-center items-center space-y-1">
            <Titles text={"white"}>{t("CurrentSite")}</Titles>
            <Texts text={"white"} size={"p5"}>
              {bannerData.jobsite.name}
            </Texts>
          </Holds>
        )}

        {/* Cost Code Information */}
        {bannerData.costCode && (
          <Holds className="h-full justify-center items-center space-y-1">
            <Titles text={"white"}>{t("CurrentCostCode")}</Titles>
            <Texts text={"white"} size={"p5"}>
              {bannerData.costCode.name || ""}
            </Texts>
          </Holds>
        )}

        {/* Tasco Logs */}
        {bannerData.tascoLogs &&
          bannerData.tascoLogs.map((equipment, index) => (
            <Holds key={index} className="h-full justify-center items-center">
              {equipment.laborType === "tascoAbcdEquipment" ? (
                <>
                  <Holds className="h-full justify-center items-center space-y-1">
                    <Titles text={"white"}>{t("AbcdShift")}</Titles>
                    <Texts text={"white"} size={"p5"}>
                      {t("EquipmentOperator")}
                    </Texts>
                  </Holds>
                </>
              ) : equipment.laborType === "tascoEEquipment" ? (
                <>
                  <Titles text={"white"}>{t("EShift")}</Titles>

                  <Texts className="text-white" size={"p5"}>
                    {t("MudConditioning")}
                  </Texts>
                </>
              ) : equipment.laborType === "tascoAbcdLabor" ? (
                <>
                  <Holds className="h-full justify-center items-center space-y-1">
                    <Titles text={"white"}>{t("AbcdShift")}</Titles>
                    <Texts className="text-white" size={"p5"}>
                      {t("ManualLabor")}
                    </Texts>
                  </Holds>
                </>
              ) : null}
            </Holds>
          ))}

        {bannerData.tascoLogs
          .filter((log) => log.laborType !== "tascoAbcdLabor")
          .map((log, index) => {
            if (log.laborType === "tascoAbcdEquipment") {
              return (
                <Holds
                  key={index}
                  className="h-full justify-center items-center"
                >
                  <Holds className="h-full justify-center items-center space-y-1">
                    <Titles text={"white"}>{t("CurrentlyOperating")}</Titles>
                    <Texts className="text-white" size={"p5"}>
                      {log.equipment?.name}
                    </Texts>
                  </Holds>
                </Holds>
              );
            } else if (log.laborType === "tascoEEquipment") {
              return (
                <Holds
                  key={index}
                  className="h-full justify-center items-center space-y-1"
                >
                  <Titles text={"white"}>{t("CurrentlyOperating")}</Titles>

                  <Texts className="text-white" size={"p5"}>
                    {log.equipment?.name}
                  </Texts>
                </Holds>
              );
            }
            return null;
          })}

        {/* Trucking Logs */}
        {bannerData.truckingLogs &&
          bannerData.truckingLogs.map((equipment, index) => (
            <Holds
              key={index}
              className="h-full justify-center items-center space-y-1"
            >
              <Titles text={"white"}>{t("CurrentlyOperating")}</Titles>
              <Texts className="text-white" size={"p5"}>
                {equipment.equipment?.name}
              </Texts>
            </Holds>
          ))}

        {/* Employee Equipment Logs */}
        {bannerData.employeeEquipmentLog &&
          bannerData.employeeEquipmentLog.map((equipment, index) => (
            <Holds key={index}>
              <Titles text={"white"}>
                {equipment.equipment?.name || t("UnknownEquipment")}
              </Titles>
              <Texts className="text-white" size={"p5"}>
                {equipment.startTime
                  ? `${t("StartTime")} ${equipment.startTime}`
                  : t("NoStartTime")}
              </Texts>
            </Holds>
          ))}

        <Holds className="w-full flex items-center space-y-1">
          <Titles text={"white"}>{t("ActiveTime")}</Titles>
          <Holds position={"row"} className="w-full justify-center gap-x-2 ">
            <Holds
              background={"white"}
              position={"left"}
              className="max-w-6 h-auto rounded-full  "
            >
              <Images
                titleImg="/clock.svg"
                titleImgAlt="Clock Icon"
                className="size-full object-contain mx-auto "
              />
            </Holds>
            <Texts size={"p5"} text={"white"}>
              {calculateDuration()}
            </Texts>
          </Holds>
        </Holds>
      </Slider>
    </Holds>
  );
}
