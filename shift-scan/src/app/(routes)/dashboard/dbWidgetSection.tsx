"use client";

import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { Grids } from "@/components/(reusable)/grids";
import { use, useEffect, useState } from "react";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { useRouter } from "next/navigation";
import { getAuthStep, setAuthStep } from "@/app/api/auth";
import Spinner from "@/components/(animations)/spinner";
import React from "react";
import { Session } from "next-auth";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { Modals } from "@/components/(reusable)/modals";
import { Bases } from "@/components/(reusable)/bases";
import { Titles } from "@/components/(reusable)/titles";
import { z } from "zod";
import { useCurrentView } from "@/app/context/CurrentViewContext";

// Zod schema for component state, including logs
const DbWidgetSectionSchema = z.object({
  session: z.object({
    user: z.object({
      permission: z.string(),
    }),
  }),
  logs: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      equipment: z
        .object({
          id: z.string(),
          qrId: z.string(),
          name: z.string(),
        })
        .nullable(),
      submitted: z.boolean(),
    })
  ),
  isModalOpen: z.boolean(),
  loading: z.boolean(),
  additionalButtonsType: z.string().nullable(),
});

type props = {
  session: Session;
};

export default function DbWidgetSection({ session }: props) {
  const permission = session.user.permission;
  const [logs, setLogs] = useState<
    {
      id: string;
      userId: string;
      equipment: {
        id: string;
        qrId: string;
        name: string;
      } | null;
      submitted: boolean;
    }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const t = useTranslations("Widgets");
  const e = useTranslations("Err-Msg");
  const authStep = getAuthStep();
  const [additionalButtonsType, setAdditionalButtonsType] = useState<
    string | null
  >(null);
  const { currentView } = useCurrentView();

  
  useEffect(() => {
    console.log("Current view:", currentView);
  }, []);

  // Validate initial state with Zod schema
  try {
    DbWidgetSectionSchema.parse({
      session,
      logs,
      isModalOpen,
      loading,
      additionalButtonsType,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Initial state validation error:", error.errors);
    }
  }

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
        const logsData = await recentLogsResponse.json();
        setLogs(logsData);
      } catch {
        console.error(e("Logs-Fetch"));
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (authStep !== "success") {
      router.push("/");
    }
  }, [authStep, router]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCOButton2 = async () => {
    try {
      if (logs.length === 0) {
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

  const handleCOButton3 = async () => {
    if (logs.length === 0) {
      router.push("/dashboard/clock-out");
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {loading ? (
        <Holds className="my-auto">
          <Spinner />
        </Holds>
      ) : (
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
            {/* Render buttons based on state */}
            {additionalButtonsType === "equipment" ? (
              <>
                <Holds className="col-span-2 row-span-1 gap-5 h-full">
                  <Buttons
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
                  <Buttons background={"green"} href="/dashboard/log-new">
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
                  <Buttons background={"orange"} href="/dashboard/equipment">
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
                <Holds className="col-span-2 row-span-1 gap-5 h-full">
                  <Buttons
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
                  <Buttons background={"orange"} onClick={handleCOButton2}>
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
                  <Buttons background={"red"} onClick={handleCOButton3}>
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
                <Modals
                  isOpen={isModalOpen}
                  handleClose={handleCloseModal}
                  size={"clock"}
                >
                  <Bases>
                    <Contents>
                      <Holds background={"white"} className="h-full">
                        <Holds className="h-full py-10">
                          <Contents width={"section"}>
                            <Grids rows={"4"} gap={"5"}>
                              <Holds className="h-full span-3 my-auto">
                                <Titles size={"h1"}>{t("Whoops")}</Titles>
                                <br />
                                <Texts size={"p2"}>{t("ReturnToLogOut")}</Texts>
                              </Holds>
                              <Holds className="h-full span-1 my-auto">
                                <Buttons
                                  background={"orange"}
                                  size={"full"}
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
              <>
                {permission !== "USER" &&
                  !additionalButtonsType &&
                  currentView === "" && (
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
                {permission !== "USER" &&
                  !additionalButtonsType &&
                  currentView === "truck" && (
                    <>
                      <Holds
                        position={"row"}
                        className="row-span-1 col-span-1 gap-5"
                      >
                        <Buttons //----------------------This is the trucking assistant
                          background={"lightBlue"}
                          href="/dashboard/truckingAssistant"
                        >
                          <Holds>
                            <Images
                              titleImg="/trucking.svg"
                              titleImgAlt="truck"
                              size={"40"}
                            />
                          </Holds>
                          <Holds>
                            <Texts size={"p3"}>{t("TruckingAssistant")}</Texts>
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
      )}
    </>
  );
}
