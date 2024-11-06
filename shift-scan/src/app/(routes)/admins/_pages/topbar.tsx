"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { Titles } from "@/components/(reusable)/titles";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Modals } from "@/components/(reusable)/modals";
import { AdminClockOut } from "./AdminClockOut";
import AdminSwitch from "./AdminSwitch";
import AdminClock from "./AdminClock";

const Topbar = () => {
  const { data: session } = useSession();
  const firstName = session?.user.firstName;
  const lastName = session?.user.lastName;

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);
  const [isEndofDay, setIsEndofDay] = useState(false);
  const [page, setPage] = useState(0);

  // State for data fetched from `localStorage` and `getAuthStep`
  const [jobSite, setJobSite] = useState("");
  const [costCode, setCostCode] = useState("");
  const [authStep, setAuthStepState] = useState("");

  // Fetch data from `localStorage` and `getAuthStep` on mount
  useEffect(() => {
    const localeValue = localStorage.getItem("savedtimeSheetData");
    const parsedData = JSON.parse(localeValue || "{}");
    setJobSite(parsedData.jobSite || "");
    setCostCode(parsedData.costCode || "");
    setAuthStepState(getAuthStep() || "");
  }, []); // Empty dependency array ensures this only runs on mount

  const toggle = () => setIsOpen(!isOpen);
  const handleClockClick = () => setIsOpen2(!isOpen2);
  const handleClose = () => setIsOpen(false);

  const handleBreakClick = async () => {
    try {
      const formData2 = new FormData();
      const t_id = JSON.parse(
        localStorage.getItem("savedtimeSheetData") || "{}"
      ).id;
      formData2.append("id", t_id?.toString() || "");
      formData2.append("endTime", new Date().toISOString());
      formData2.append("TimeSheetComments", "");
      await updateTimeSheetBySwitch(formData2);
      setAuthStep(""); // Update auth step if needed
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Holds className="w-full h-[10%] absolute ">
      <Modals
        isOpen={isOpen}
        handleClose={handleClose}
        type={"StartDay"}
        size={"lg"}
      >
        <AdminClock handleClose={() => setIsOpen(false)} />
      </Modals>
      <Modals
        isOpen={isSwitch}
        handleClose={() => setIsSwitch(false)}
        type={"StartDay"}
        size={"lg"}
      >
        <AdminSwitch handleClose={() => setIsSwitch(false)} />
      </Modals>
      <Modals
        isOpen={isEndofDay}
        handleClose={() => setIsEndofDay(false)}
        type={"StartDay"}
        size={"lg"}
      >
        <AdminClockOut handleClose={() => setIsEndofDay(false)} />
      </Modals>

      {/* UI Elements */}
      {!isOpen2 ? (
        <Holds className=" h-full pb-4 w-full">
          <Holds position={"row"} className="w-[98%] h-full m-auto">
            {page === 0 ? (
              <Holds
                background={"lightBlue"}
                className="flex flex-row justify-center items-center rounded border-[3px] border-black w-[90%] h-full relative"
              >
                <Titles className="h-full">Banner messages go here</Titles>
              </Holds>
            ) : (
              <Holds
                background={"lightBlue"}
                className="flex flex-row justify-center items-center rounded border-[3px] border-black w-[90%] h-full relative"
              >
                <Holds className="w-[15%] absolute left-5">
                  <Holds position={"row"} className="hidden md:flex">
                    <Images
                      titleImg={
                        page === 1
                          ? "/team.svg"
                          : page === 2
                          ? "/jobsite.svg"
                          : page === 3
                          ? "/form.svg"
                          : page === 4
                          ? "/person.svg"
                          : ""
                      }
                      size={"40"}
                      titleImgAlt="current Icon"
                      className="my-auto cursor-pointer"
                    />
                    <Titles size={"h4"} className="h-full ml-4">
                      {page === 1
                        ? "Personnel"
                        : page === 2
                        ? "Assets"
                        : page === 3
                        ? "Reports"
                        : page === 4
                        ? `${firstName} ${lastName}`
                        : ""}
                    </Titles>
                  </Holds>
                </Holds>
                <Titles size={"h4"} className="h-full">
                  Closed Banner messages go here
                </Titles>
                <Holds className="w-10 absolute right-5">
                  <Images
                    titleImg="/x.svg"
                    titleImgAlt="Home Icon"
                    className="my-auto cursor-pointer"
                    size={"90"}
                    onClick={() => setPage(0)}
                  />
                </Holds>
              </Holds>
            )}

            <Holds
              background={"white"}
              className="col-start-4 col-end-5 w-[10%] h-[80%] flex-row rounded-l-none"
            >
              <Holds position={"row"} className="my-auto">
                <Holds size={"50"}>
                  <Images titleImg={"/clock.svg"} titleImgAlt={"clock"} />
                </Holds>
                <Holds size={"50"}>
                  <Images
                    titleImg="/expandLeft.svg"
                    titleImgAlt="Home Icon"
                    className="my-auto rotate-90 cursor-pointer"
                    size={"50"}
                    onClick={handleClockClick}
                  />
                </Holds>
              </Holds>
            </Holds>
          </Holds>
        </Holds>
      ) : (
        <Holds className="h-full w-full ">
          <Holds className="w-[98%] h-full">
            <Holds
              background={"lightBlue"}
              className="rounded h-full w-full border-[3px] border-black"
            >
              <Titles className="m-auto h-full">
                Open Banner messages go here
              </Titles>
            </Holds>
            <Holds
              background={"white"}
              className="h-full py-2 w-[99%] flex justify-start flex-row rounded"
            >
              <Holds
                position={"row"}
                className="ml-2 my-auto w-[70%] md:w-[70%] lg:w-[60%]"
              >
                <Holds size={"20"}>
                  <Images
                    titleImg={"/clock.svg"}
                    titleImgAlt={"clock"}
                    className="h-16 w-16"
                    position={"left"}
                  />
                </Holds>
                <Holds position={"row"} size={"80"} className="lg:gap-10">
                  <Holds
                    size={"30"}
                    position={"row"}
                    className="mx-2 flex-col lg:flex-row"
                  >
                    <Labels size={"p3"} type="title">
                      J#
                    </Labels>
                    <Inputs
                      name="jobsite"
                      type="text"
                      className="h-8 w-full md:w-[100px] my-auto"
                      value={jobSite}
                      disabled
                    />
                  </Holds>
                  <Holds
                    size={"30"}
                    position={"row"}
                    className="flex-col lg:flex-row"
                  >
                    <Labels size={"p3"} type="title">
                      CC#
                    </Labels>
                    <Inputs
                      name="jobsite"
                      type="text"
                      className="h-8 w-full md:w-[100px] my-auto"
                      value={costCode}
                      disabled
                    />
                  </Holds>
                </Holds>
              </Holds>
              {authStep === "success" ? (
                <Holds position={"row"} className="my-auto w-[40%]">
                  <Buttons
                    background={"orange"}
                    onClick={() => setIsSwitch(true)}
                  >
                    <Texts size={"p6"}>Switch</Texts>
                  </Buttons>
                  <Buttons background={"lightBlue"} onClick={handleBreakClick}>
                    <Texts size={"p6"}>Break</Texts>
                  </Buttons>
                  <Buttons
                    background={"red"}
                    onClick={() => setIsEndofDay(true)}
                  >
                    <Texts size={"p6"}>End Day</Texts>
                  </Buttons>
                  <Images
                    titleImg="/expandLeft.svg"
                    titleImgAlt="Home Icon"
                    className="m-auto rotate-[270deg] cursor-pointer h-16 w-16"
                    onClick={handleClockClick}
                  />
                </Holds>
              ) : (
                <Holds
                  position={"row"}
                  className="my-auto mx-2 space-x-4 w-[40%]"
                >
                  <Buttons background={"green"} onClick={() => setIsOpen(true)}>
                    <Texts size={"p6"}>start day</Texts>
                  </Buttons>
                  <Images
                    titleImg="/expandLeft.svg"
                    titleImgAlt="Home Icon"
                    className="m-auto rotate-[270deg] cursor-pointer h-16 w-16"
                    onClick={handleClockClick}
                  />
                </Holds>
              )}
            </Holds>
          </Holds>
        </Holds>
      )}
    </Holds>
  );
};

export default Topbar;
