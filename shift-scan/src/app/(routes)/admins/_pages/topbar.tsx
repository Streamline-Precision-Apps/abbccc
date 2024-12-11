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
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Topbar = () => {
  const t = useTranslations("Admins");
  const { data: session } = useSession();
  const firstName = session?.user.firstName;
  const lastName = session?.user.lastName;
  const pathname = usePathname();
  const Router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isSwitch, setIsSwitch] = useState(false);
  const [isEndofDay, setIsEndofDay] = useState(false);

  // State for data fetched from `localStorage` and `getAuthStep`
  const [jobSite, setJobSite] = useState("");
  const [costCode, setCostCode] = useState("");
  const [authStep, setAuthStepState] = useState("");

  // We want to fetch data more offten to avoid unnecessary API calls
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const localeValue = localStorage.getItem("savedtimeSheetData");
    const cc = localStorage.getItem("costCode");
    const j = localStorage.getItem("jobSite");
    const parsedData = JSON.parse(localeValue || "{}");
    setJobSite(parsedData.jobSite || j || "");
    setCostCode(parsedData.costCode || cc || "");
    setAuthStepState(getAuthStep() || "");
  });

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
  // these statments allow the page to dynamically have icons for every router that have the correct prefix
  const isPersonnelPage = pathname.includes("/admins/personnel");
  const isAssetsPage = pathname.includes("/admins/assets");
  const isReportsPage = pathname.includes("/admins/reports");
  const settingsPage = pathname.includes("/admins/settings");

  return (
    <Holds className="w-full h-full pb-8">
      {/* UI Elements */}
      {!isOpen2 ? (
        <Holds className=" h-full w-full">
          <Holds position={"row"} className="w-[98%] h-full mx-auto ">
            {pathname === "/admins" ? (
              <Holds
                background={"lightBlue"}
                className="flex flex-row justify-center items-center rounded border-[3px] border-black w-[90%] h-full relative"
              ></Holds>
            ) : (
              <Holds
                background={"lightBlue"}
                className="flex flex-row z-1 justify-center items-center rounded border-[3px] border-black w-[90%] h-full relative"
              >
                <Holds className="w-[15%] absolute left-5">
                  <Holds position={"row"} className="hidden md:flex">
                    <Images
                      titleImg={
                        isPersonnelPage
                          ? "/team.svg"
                          : isAssetsPage
                          ? "/jobsite.svg"
                          : isReportsPage
                          ? "/form.svg"
                          : settingsPage
                          ? "/person.svg"
                          : ""
                      }
                      size={"30"}
                      titleImgAlt="current Icon"
                      className="my-auto cursor-pointer"
                    />
                    <Titles size={"h4"} className="h-full ml-4">
                      {isPersonnelPage
                        ? "Personnel"
                        : isAssetsPage
                        ? "Assets"
                        : isReportsPage
                        ? "Reports"
                        : settingsPage
                        ? `${firstName} ${lastName}`
                        : ""}
                    </Titles>
                  </Holds>
                </Holds>

                <Holds className="w-10 absolute right-5">
                  <Images
                    titleImg="/x.svg"
                    titleImgAlt="Home Icon"
                    className="my-auto cursor-pointer"
                    size={"90"}
                    onClick={() => Router.push("/admins")}
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
                  <Images
                    titleImg={"/clock.svg"}
                    titleImgAlt={"clock"}
                    size={"50"}
                  />
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
              className="rounded h-2/5 w-full border-[3px] border-black"
            ></Holds>
            <Holds
              background={"white"}
              className="h-3/5 w-[99%] flex justify-start flex-row rounded"
            >
              <Holds
                position={"row"}
                className="ml-2 my-auto w-[70%] md:w-[70%] lg:w-[60%]"
              >
                <Holds size={"20"}>
                  <Images
                    titleImg={"/clock.svg"}
                    titleImgAlt={"clock"}
                    className="h-8 w-8 my-auto"
                    position={"left"}
                  />
                </Holds>
                <Holds
                  position={"row"}
                  size={"80"}
                  className="lg:gap-10 h-full"
                >
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
                      className="h-8 w-full md:w-[100px] my-auto p-0"
                      value={jobSite}
                      disabled
                    />
                  </Holds>
                  <Holds
                    size={"30"}
                    position={"row"}
                    className="flex-col lg:flex-row my-auto"
                  >
                    <Labels size={"p3"} type="title" className="pt-0">
                      CC#
                    </Labels>
                    <Inputs
                      name="jobsite"
                      type="text"
                      className="h-8 w-full md:w-[100px] my-auto p-0"
                      value={costCode}
                      disabled
                    />
                  </Holds>
                </Holds>
              </Holds>
              {authStep === "success" ? (
                <Holds
                  position={"row"}
                  className="my-auto w-[40%] gap-4 h-full"
                >
                  <Buttons
                    background={"orange"}
                    onClick={() => setIsSwitch(true)}
                    className="h-8 "
                  >
                    <Texts size={"p6"}>{t("Switch")}</Texts>
                  </Buttons>
                  <Buttons
                    className="h-8 "
                    background={"lightBlue"}
                    onClick={handleBreakClick}
                  >
                    <Texts size={"p6"}>{t("Break")}</Texts>
                  </Buttons>
                  <Buttons
                    className="h-8 "
                    background={"red"}
                    onClick={() => {
                      setIsEndofDay(true);
                    }}
                  >
                    <Texts size={"p6"}>{t("EndDay")}</Texts>
                  </Buttons>
                  <Holds>
                    <Images
                      titleImg="/expandLeft.svg"
                      titleImgAlt="Home Icon"
                      className="m-auto rotate-[270deg] cursor-pointer h-16 w-16"
                      onClick={handleClockClick}
                    />
                  </Holds>
                </Holds>
              ) : (
                <Holds
                  position={"row"}
                  className=" h-full mx-2 py-1 space-x-4 w-[40%]"
                >
                  <Holds>
                    <Buttons
                      className="my-auto h-8 "
                      background={"green"}
                      onClick={() => setIsOpen(true)}
                      size={"60"}
                    >
                      <Texts size={"p6"}>{t("StartDay")}</Texts>
                    </Buttons>
                  </Holds>
                  <Holds>
                    <Images
                      titleImg="/expandLeft.svg"
                      titleImgAlt="Home Icon"
                      className="my-auto rotate-[270deg] cursor-pointer h-16 w-16"
                      onClick={handleClockClick}
                    />
                  </Holds>
                </Holds>
              )}
            </Holds>
          </Holds>
        </Holds>
      )}
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
    </Holds>
  );
};

export default Topbar;
