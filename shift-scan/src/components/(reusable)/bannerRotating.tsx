"use client";

import Slider from "react-slick";
import React, { useEffect, useState } from "react";
import {Titles} from "./titles";
import { Holds } from "./holds";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Texts } from "./texts";

export default function BannerRotating() {
    const [bannerData, setBannerData] = useState({
        jobsite: {
            id: true,
            qrId: true,
            name: true,
        },
        costcode: true,
        employeeEquipmentLogs: {
            id: true,
            startTime: true,
            endTime: true,
            Equipment: {
                id: true,
                name: true,
        }}});
            
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
        pauseOnFocus: true
    };

    useEffect(() => {
        const fetchJobSite = async () => {
            try {
                const response = await fetch("/api/getBannerData");
                const data = await response.json();
                setBannerData(data);
            } catch (error) {
                console.error("Error fetching job site:", error);
            }
        };

        fetchJobSite();
    }, []);

    return (
        <Holds className="w-[80%]">

            <Slider {...settings} className="">
                <Holds position={"row"}>
                    <Titles text={"white"} size={"h2"}>{bannerData.jobsite.name}</Titles>
                    <Texts className="text-white" size={"p5"}>{bannerData.jobsite.qrId}</Texts>
                </Holds>
                <Holds>
                    <Titles text={"white"}>{bannerData.costcode}</Titles>
                    <Texts className="text-white" size={"p5"}>{bannerData.costcode}</Texts>
                </Holds>
                {Array.isArray(bannerData.employeeEquipmentLogs.Equipment) && bannerData.employeeEquipmentLogs.Equipment.map((equipment, index) => (
                <Holds key={index}>
                    <Titles text={"white"}>{equipment.name}</Titles>
                    <Texts className="text-white" size={"p5"}>{equipment.startTime}</Texts>
                </Holds>
))}
                
                {/* <Holds>
                    <Titles text={"white"}>Current Equipment 1</Titles>
                    <Texts className="text-white" size={"p5"}>Current Equipment Time</Texts>
                </Holds> */}
            </Slider>
        </Holds>
    );
}
