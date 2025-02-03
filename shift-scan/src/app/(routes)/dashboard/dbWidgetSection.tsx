"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { Session } from "next-auth";
import { updateTimeSheetBySwitch } from "@/actions/timeSheetActions";
import { z } from "zod";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import TascoDashboardView from "./UI/_dashboards/tascoDashboardView";
import TruckDriverDashboardView from "./UI/_dashboards/truckDriverDashboardView";
import MechanicDashboardView from "./UI/_dashboards/mechanicDashboardView";
import GeneralDashboardView from "./UI/_dashboards/generalDashboardView";
import { setCurrentPageView } from "@/actions/cookieActions";

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
  view: string;
};

export default function DbWidgetSection({ session, view }: props) {
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
  const e = useTranslations("Err-Msg");
  const [additionalButtonsType, setAdditionalButtonsType] = useState<
    string | null
  >(null);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [comment, setComment] = useState("");
  const { currentView } = useCurrentView();

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
  }, [e]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // handleCOButton2 is used for taking a break
  const handleCOButton2 = async () => {
    try {
      if (logs.length === 0) {
        const formData2 = new FormData();

        let timeSheetId = null;
        // retrieving cookie to get timeSheetId or use recent one from api call

        const response = await fetch("/api/getRecentTimecard");
        const tsId = await response.json();
        timeSheetId = tsId.id;

        formData2.append("id", timeSheetId?.toString() || "");
        formData2.append("endTime", new Date().toISOString());
        formData2.append("timesheetComments", comment);

        await updateTimeSheetBySwitch(formData2);
        setCurrentPageView("break");
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
  {
    /* ------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
   General View for tasco
  --------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
*/
  }
  if (view === "tasco") {
    return (
      <TascoDashboardView
        loading={loading}
        isModalOpen={isModalOpen}
        setIsModal2Open={setIsModal2Open}
        isModal2Open={isModal2Open}
        comment={comment}
        setComment={setComment}
        handleCOButton2={handleCOButton2}
        handleCOButton3={handleCOButton3}
        handleCloseModal={handleCloseModal}
        handleShowManagerButtons={handleShowManagerButtons}
        permission={permission}
        currentView={currentView}
        handleShowAdditionalButtons={handleShowAdditionalButtons}
        additionalButtonsType={additionalButtonsType}
      />
    );
  }
  {
    /* ------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
   General View for truck drivers
  --------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
*/
  }
  if (view === "truck") {
    return (
      <TruckDriverDashboardView
        loading={loading}
        isModalOpen={isModalOpen}
        setIsModal2Open={setIsModal2Open}
        isModal2Open={isModal2Open}
        comment={comment}
        setComment={setComment}
        handleCOButton2={handleCOButton2}
        handleCOButton3={handleCOButton3}
        handleCloseModal={handleCloseModal}
        handleShowManagerButtons={handleShowManagerButtons}
        permission={permission}
        handleShowAdditionalButtons={handleShowAdditionalButtons}
        additionalButtonsType={additionalButtonsType}
      />
    );
  }

  {
    /* ------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
   Mechanic View - View for mechanics
  --------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
*/
  }
  if (view === "mechanic") {
    return (
      <MechanicDashboardView
        loading={loading}
        isModalOpen={isModalOpen}
        setIsModal2Open={setIsModal2Open}
        isModal2Open={isModal2Open}
        comment={comment}
        setComment={setComment}
        handleCOButton2={handleCOButton2}
        handleCOButton3={handleCOButton3}
        handleCloseModal={handleCloseModal}
        handleShowManagerButtons={handleShowManagerButtons}
        permission={permission}
        handleShowAdditionalButtons={handleShowAdditionalButtons}
        additionalButtonsType={additionalButtonsType}
      />
    );
  }
  {
    /* ------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
   General View for all users 
  --------------------------------------------------------------------------------------------------------------------------
  --------------------------------------------------------------------------------------------------------------------------
*/
  }
  if (view === "general") {
    return (
      <GeneralDashboardView
        loading={loading}
        isModalOpen={isModalOpen}
        setIsModal2Open={setIsModal2Open}
        isModal2Open={isModal2Open}
        comment={comment}
        setComment={setComment}
        handleCOButton2={handleCOButton2}
        handleCOButton3={handleCOButton3}
        handleCloseModal={handleCloseModal}
        handleShowManagerButtons={handleShowManagerButtons}
        permission={permission}
        handleShowAdditionalButtons={handleShowAdditionalButtons}
        additionalButtonsType={additionalButtonsType}
      />
    );
  } else {
    return null;
  }
}
