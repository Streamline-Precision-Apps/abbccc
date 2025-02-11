"use client";

import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import { Titles } from "./titles";
import { Holds } from "./holds";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Texts } from "./texts";
import Spinner from "../(animations)/spinner";
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
  equipment: Equipment;
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
  jobsite: Jobsite;
  costCode: CostCode;
  employeeEquipmentLog: EmployeeEquipmentLog[];
  tascoLogs: TascoLog[];
  truckingLogs: TruckingLog[];
}

export default function BannerRotating() {
  const [timeSheetId, setTimeSheetId] = useState("");
  const [bannerData, setBannerData] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(null); // Track error state

  const settings = {
    dots: true,
    draggable: true,
    speed: 500,
    arrows: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  // Fetch timeSheetId and banner data together
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Step 1: Fetch the most recent timeSheetId
        const timeSheetResponse = await fetch("/api/getRecentTimecard");
        const timeSheetData = await timeSheetResponse.json();

        if (!timeSheetData?.id) {
          throw new Error("No valid timesheet ID found.");
        }

        setTimeSheetId(timeSheetData.id);

        // Step 2: Fetch banner data using the obtained timeSheetId
        const bannerResponse = await fetch(
          `/api/getBannerData?id=${timeSheetData.id}`
        );
        const bannerData = await bannerResponse.json();

        if (!bannerResponse.ok) {
          throw new Error(bannerData.error || "Failed to fetch job site data.");
        }

        setBannerData(bannerData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
        <Titles text={"white"}>No available timesheet data.</Titles>
      </Holds>
    );
  }

  return (
    <Holds className="w-[80%]">
      <Slider {...settings} className="">
        {/* Jobsite Information */}
        {bannerData.jobsite && (
          <Holds position={"row"}>
            <Titles text={"white"} size={"h2"}>
              {bannerData.jobsite.name}
            </Titles>
            <Texts className="text-white" size={"p5"}>
              {bannerData.jobsite.qrId}
            </Texts>
          </Holds>
        )}

        {/* Cost Code Information */}
        {bannerData.costCode && (
          <Holds>
            <Titles text={"white"}>{bannerData.costCode.description}</Titles>
            <Texts className="text-white" size={"p5"}>
              {bannerData.costCode.name}
            </Texts>
          </Holds>
        )}

        {/* Employee Equipment Logs */}
        {bannerData.employeeEquipmentLog &&
          bannerData.employeeEquipmentLog.map((equipment, index) => (
            <Holds key={index}>
              <Titles text={"white"}>
                {equipment.equipment?.name || "Unknown Equipment"}
              </Titles>
              <Texts className="text-white" size={"p5"}>
                {equipment.startTime
                  ? `Start Time: ${equipment.startTime}`
                  : "No Start Time"}
              </Texts>
            </Holds>
          ))}

        {/* Tasco Logs */}
        {bannerData.tascoLogs &&
          bannerData.tascoLogs.map((equipment, index) => (
            <Holds key={index}>
              <Titles text={"white"}>
                {equipment.equipment?.name || "Unknown Equipment"}
              </Titles>
              <Texts className="text-white" size={"p5"}>
                {equipment.laborType === "operator"
                  ? "Operator"
                  : equipment.laborType === "equipmentOperator"
                  ? "Equipment Operator"
                  : "Manual Labor"}
              </Texts>
            </Holds>
          ))}

        {/* Trucking Logs */}
        {bannerData.truckingLogs &&
          bannerData.truckingLogs.map((equipment, index) => (
            <Holds key={index}>
              <Titles text={"white"}>
                {equipment.equipment?.name || "Unknown Equipment"}
              </Titles>
              <Texts className="text-white" size={"p5"}>
                {equipment.laborType === "operator"
                  ? "Operator"
                  : equipment.laborType === "truckDriver"
                  ? "Truck Driver"
                  : "Manual Labor"}
              </Texts>
            </Holds>
          ))}
      </Slider>
    </Holds>
  );
}
