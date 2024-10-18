"use client";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { useEffect, useMemo, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import Spinner from "@/components/(animations)/spinner";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { Modals } from "@/components/(reusable)/modals";
import React from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Titles } from "@/components/(reusable)/titles";
type props = {
  session: Session;
  locale: string;
};
export default function DbWidgetSection({ session, locale }: props) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations("Widgets");
  const f = useTranslations("Home");
  const e = useTranslations("Err-Msg");
  const [toggle, setToggle] = useState(true);
  const handleToggle = () => setToggle(!toggle);
  const authStep = getAuthStep();
  const permission = session.user.permission;
  const accountSetup = session.user.accountSetup;
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalButtonsType, setAdditionalButtonsType] = useState<
    string | null
  >(null);

  const handleShowManagerButtons = () => {
    setAdditionalButtonsType(null);
  };

  const handleShowAdditionalButtons = (type: string) => {
    setAdditionalButtonsType(type);
  };

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const recentLogsResponse = await fetch("/api/getLogs");
        const logs = await recentLogsResponse.json();
        setLogs(logs);
      } catch {
        console.error(e("Logs-Fetch"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  // Redirect to dashboard if authStep is success
  useEffect(() => {
    if (authStep !== "success") {
      router.push("/");
    }
  }, [authStep, router]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Function to handle CO Button 2 action
  const handleCOButton2 = async () => {
    try {
      if (logs.length === 0) {
        // Perform action if there are no logs
        const formData2 = new FormData();
        const localeValue = localStorage.getItem("savedtimeSheetData");
        const t_id = JSON.parse(localeValue || "{}").id;
        formData2.append("id", t_id?.toString() || "");
        formData2.append("endTime", new Date().toISOString());
        formData2.append("TimeSheetComments", "");
        await updateTimeSheetBySwitch(formData2);

        setAuthStep("break");
        router.push("/");
      } else {
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle CO Button 2 action
  const handleCOButton3 = async () => {
    if (logs.length === 0) {
      // Perform action if there are no logs
      router.push("/dashboard/clock-out");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Loading Spinner */}
      {loading ? (
        <>
          <Holds className="my-auto">
            <Spinner />
          </Holds>
        </>
      ) : (
        <>
          {/* Component that will render */}
          <Contents width={"section"} className="py-5">
            <Grids
              cols={"2"}
              rows={
                permission === "ADMIN" ||
                permission === "SUPERADMIN" ||
                permission === "MANAGER"
                  ? "3"
                  : "3"
              }
              gap={"5"}
            >
              {/* This section includes the buttons within equipment */}
              {additionalButtonsType === "equipment" ? (
                <>
                  <Holds className="col-span-2 row-span-1 gap-5 h-full">
                    <Buttons //----------------------This is the Home Widget
                      background={"lightBlue"}
                      onClick={handleShowManagerButtons}
                    >
                      <Holds position={"row"} className="my-auto">
                        <Holds size={"60"}>
                          <Texts size={"p1"}>{t("GoHome")}</Texts>
                        </Holds>
                        <Holds size={"40"}>
                          <Images
                            titleImg="/home.svg"
                            titleImgAlt="Home Icon"
                            size={"50"}
                          />
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Holds className="col-span-2 row-span-1 gap-5 h-full">
                    <Buttons //----------------------This is the Log New Widget
                      background={"green"}
                      href="/dashboard/log-new"
                    >
                      <Holds position={"row"} className="my-auto">
                        <Holds size={"60"}>
                          <Texts size={"p1"}>{t("LogNew")}</Texts>
                        </Holds>
                        <Holds size={"40"}>
                          <Images
                            titleImg="/equipment.svg"
                            titleImgAlt="Equipment Icon"
                            size={"40"}
                          />
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Holds className="col-span-2 row-span-1 gap-5 h-full">
                    <Buttons //----------------------This is the LogOut Widget
                      background={"orange"}
                      href="/dashboard/equipment"
                    >
                      <Holds position={"row"} className="my-auto">
                        <Holds size={"60"}>
                          <Texts size={"p1"}>{t("LogOut")}</Texts>
                        </Holds>
                        <Holds size={"40"}>
                          <Images
                            titleImg="/current-equipment.svg"
                            titleImgAlt="Equipment Icon"
                            size={"50"}
                          />
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                </>
              ) : additionalButtonsType === "clockOut" ? (
                <>
                  {/* this ternary show all the buttons within ClockOut toggle */}
                  <Holds className="col-span-2 row-span-1 gap-5 h-full">
                    <Buttons //----------------------This is the Home Widget
                      background={"lightBlue"}
                      onClick={handleShowManagerButtons}
                    >
                      <Holds position={"row"} className="my-auto">
                        <Holds size={"60"}>
                          <Texts size={"p1"}>{t("GoHome")}</Texts>
                        </Holds>
                        <Holds size={"40"}>
                          <Images
                            titleImg="/home.svg"
                            titleImgAlt="Home Icon"
                            size={"50"}
                          />
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Holds className="col-span-2 row-span-1 gap-5 h-full">
                    <Buttons //----------------------This is the Break Widget
                      background={"orange"}
                      onClick={handleCOButton2}
                    >
                      <Holds position={"row"} className="my-auto">
                        <Holds size={"60"}>
                          <Texts size={"p1"}>{t("Break")}</Texts>
                        </Holds>
                        <Holds size={"40"}>
                          <Images
                            titleImg="/break.svg"
                            titleImgAlt="Break Icon"
                            size={"50"}
                          />
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Holds className="col-span-2 row-span-1 gap-5 h-full">
                    <Buttons //----------------------This is the End Day Widget
                      background={"red"}
                      onClick={handleCOButton3}
                    >
                      <Holds position={"row"} className="my-auto">
                        <Holds size={"70"}>
                          <Texts size={"p1"}>{t("EndDay")}</Texts>
                        </Holds>
                        <Holds size={"30"}>
                          <Images
                            titleImg="/end-day.svg"
                            titleImgAlt="End Icon"
                            size={"50"}
                          />
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Modals //----------before clock out equipment check
                    isOpen={isModalOpen}
                    handleClose={handleCloseModal}
                    size={"clock"}
                  >
                    <Bases>
                      <Contents>
                        <Holds background={"white"} className="h-full">
                          <Holds className="h-full py-10 ">
                            <Contents width={"section"}>
                              <Grids rows={"4"} gap={"5"}>
                                <Holds className="h-full span-3 my-auto">
                                  <Titles size={"h1"}>{t("Whoops")}</Titles>
                                  <br />
                                  <Texts size={"p2"}>
                                    {t("ReturnToLogOut")}
                                  </Texts>
                                </Holds>
                                <Holds className="h-full span-1 my-auto">
                                  <Buttons //----------------------This is the Current Widget
                                    background={"orange"}
                                    size={"full"}
                                    className=""
                                    href={`/dashboard/equipment`}
                                  >
                                    <Texts size={"p3"}>
                                      {t("ClickToLogOut")}
                                    </Texts>
                                  </Buttons>
                                </Holds>
                              </Grids>
                            </Contents>
                          </Holds>
                        </Holds>
                      </Contents>
                    </Bases>
                  </Modals>
                </>
              ) : (
                //all pages get these buttons except for the additional button type sections
                <>
                  {/* Checks if a user has a permission of "USER" it won't render any manager buttons below */}
                  {permission !== "USER" && !additionalButtonsType && (
                    <>
                      <Holds
                        position={"row"}
                        className="row-span-1 col-span-1 gap-5"
                      >
                        <Buttons //----------------------This is the QR Generator Widget
                          background={"lightBlue"}
                          href="/dashboard/qr-generator"
                        >
                          <Holds>
                            <Images
                              titleImg="/qr.svg"
                              titleImgAlt="QR Code"
                              size={"40"}
                            />
                          </Holds>
                          <Holds>
                            <Texts size={"p3"}>{t("QR")}</Texts>
                          </Holds>
                        </Buttons>
                      </Holds>
                    </>
                  )}
                  {permission !== "USER" && !additionalButtonsType && (
                    <>
                      <Holds
                        position={"row"}
                        className="row-span-1 col-span-1 gap-5"
                      >
                        <Buttons //----------------------This is the My Team Widget
                          background={"lightBlue"}
                          href="/dashboard/myTeam"
                        >
                          <Holds>
                            <Images
                              titleImg="/team.svg"
                              titleImgAlt={t("MyTeam")}
                              size={"40"}
                            />
                          </Holds>
                          <Holds>
                            <Texts size={"p3"}>{t("MyTeam")}</Texts>
                          </Holds>
                        </Buttons>
                      </Holds>
                    </>
                  )}
                  <Holds
                    position={"row"}
                    className={
                      permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER"
                        ? "row-span-1 col-span-1 gap-5"
                        : "row-span-1 col-span-1 gap-5"
                    }
                  >
                    <Buttons //----------------------This is the Equipment Widget
                      background={"green"}
                      href="/dashboard/equipment"
                      onClick={() => handleShowAdditionalButtons("equipment")}
                    >
                      <Holds>
                        <Holds>
                          <Images
                            titleImg="/equipment.svg"
                            titleImgAlt="Equipment Icon"
                            size={"40"}
                          />
                        </Holds>
                        <Holds>
                          <Texts size={"p3"}>{t("Equipment")}</Texts>
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Holds
                    position={"row"}
                    className={
                      permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER"
                        ? "row-span-1 col-span-1 gap-5"
                        : "row-start-2 col-span-2 gap-5"
                    }
                  >
                    <Buttons //----------------------This is the Forms Widget
                      background={"green"}
                      href="/dashboard/forms"
                    >
                      <Holds
                        position={
                          permission === "ADMIN" ||
                          permission === "SUPERADMIN" ||
                          permission === "MANAGER"
                            ? undefined
                            : "row"
                        }
                      >
                        <Holds>
                          <Images
                            titleImg="/form.svg"
                            titleImgAlt="Forms Icon"
                            size={"40"}
                            className="ml-2"
                          />
                        </Holds>
                        <Holds>
                          <Texts size={"p3"}>{t("Forms")}</Texts>
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Holds
                    position={"row"}
                    className={
                      permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER"
                        ? "row-span-1 col-span-1 gap-5"
                        : "row-span-1 col-span-1 gap-5"
                    }
                  >
                    <Buttons //----------------------This is the Switch Jobs Widget
                      background={"orange"}
                      href="/dashboard/switch-jobs"
                    >
                      <Holds>
                        <Images
                          titleImg="/jobsite.svg"
                          titleImgAlt="Jobsite Icon"
                          size={"40"}
                        />
                      </Holds>
                      <Holds>
                        <Texts size={"p3"}>{t("Switch")}</Texts>
                      </Holds>
                    </Buttons>
                  </Holds>
                  <Holds
                    position={"row"}
                    className={
                      permission === "ADMIN" ||
                      permission === "SUPERADMIN" ||
                      permission === "MANAGER"
                        ? "row-span-1 col-span-1 gap-5"
                        : "row-span-1 col-span-2 gap-5"
                    }
                  >
                    <Buttons //----------------------This is the Clock Out Widget
                      href="/dashboard/clock-out"
                      background={"red"}
                      onClick={() => handleShowAdditionalButtons("clockOut")}
                    >
                      <Holds
                        position={
                          permission === "ADMIN" ||
                          permission === "SUPERADMIN" ||
                          permission === "MANAGER"
                            ? undefined
                            : "row"
                        }
                      >
                        <Holds>
                          <Images
                            titleImg="/clock-out.svg"
                            titleImgAlt="Clock Out Icon"
                            size={"40"}
                          />
                        </Holds>
                        <Holds>
                          <Texts size={"p3"}>{t("ClockOut")}</Texts>
                        </Holds>
                      </Holds>
                    </Buttons>
                  </Holds>
                </>
              )}
            </Grids>
          </Contents>
        </>
      )}
    </>
  );
}
