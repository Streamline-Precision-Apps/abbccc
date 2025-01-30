"use client";

import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import { Titles } from "./titles";
import { Holds } from "./holds";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Texts } from "./texts";

export default function BannerRotating() {
  const [timeSheetId, setTimeSheetId] = useState("");
  const [bannerData, setBannerData] = useState({
    id: "",
    jobsite: {
      id: "",
      qrId: "",
      name: "",
    },
    costcode: {
      id: "",
      name: "",
      description: "",
    },
    employeeEquipmentLog: [
      {
        id: "",
        startTime: "",
        endTime: "",
        Equipment: {
          id: "",
          name: "",
        },
      },
    ],
    tascoLogs: [
      {
        laborType: "",
        equipment: {
          qrId: "",
          name: "",
        },
      },
    ],
    truckingLogs: [
      {
        laborType: "",
        equipment: {
          qrId: "",
          name: "",
        },
      },
    ],
  });

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
  useEffect(() => {
    const fetchTimeSheetId = async () => {
      try {
        const response = await fetch(
          "/api/cookies?method=get&name=timeSheetId"
        );
        const data = await response.json();
        setTimeSheetId(data.id);
      } catch (error) {
        console.error("Error fetching time sheet ID:", error);
      }
      fetchTimeSheetId();
    };
  }, [timeSheetId]);

  useEffect(() => {
    const fetchJobSite = async () => {
      try {
        const response = await fetch("/api/getBannerData?id=" + timeSheetId);
        const data = await response.json();
        setBannerData(data);
      } catch (error) {
        console.error("Error fetching job site:", error);
      }
    };

    fetchJobSite();
  }, [timeSheetId]);

  return (
    <Holds className="w-[80%]">
      <Slider {...settings} className="">
        {bannerData.jobsite.name && bannerData.jobsite.qrId && (
          <Holds position={"row"}>
            <Titles text={"white"} size={"h2"}>
              {bannerData.jobsite.name}
            </Titles>
            <Texts className="text-white" size={"p5"}>
              {bannerData.jobsite.qrId}
            </Texts>
          </Holds>
        )}
        {bannerData.costcode.description && bannerData.costcode.name && (
          <Holds>
            <Titles text={"white"}>{bannerData.costcode.description}</Titles>
            <Texts className="text-white" size={"p5"}>
              {bannerData.costcode.name}
            </Texts>
          </Holds>
        )}
        {bannerData.employeeEquipmentLog.length > 0 &&
          bannerData.employeeEquipmentLog.map((equipment, index) => (
            <Holds key={index}>
              <Titles text={"white"}>{equipment.Equipment.name}</Titles>
              <Texts className="text-white" size={"p5"}>
                {equipment.startTime}
              </Texts>
            </Holds>
          ))}
        {bannerData.tascoLogs.length > 0 &&
          bannerData.tascoLogs.map((equipment, index) => (
            <Holds key={index}>
              <Titles text={"white"}>{equipment.equipment.name}</Titles>
              <Texts className="text-white" size={"p5"}>
                {equipment.laborType === "operator"
                  ? "Equipment Operator"
                  : "Manual Labor"}
              </Texts>
            </Holds>
          ))}
        {bannerData.truckingLogs.length > 0 &&
          bannerData.truckingLogs.map((equipment, index) => (
            <Holds key={index}>
              <Titles text={"white"}>{equipment.equipment.name}</Titles>
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
