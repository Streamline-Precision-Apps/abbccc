"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { Session } from "next-auth";
import { breakOutTimeSheet } from "@/actions/timeSheetActions";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import TascoDashboardView from "./UI/_dashboards/tascoDashboardView";
import TruckDriverDashboardView from "./UI/_dashboards/truckDriverDashboardView";
import MechanicDashboardView from "./UI/_dashboards/mechanicDashboardView";
import GeneralDashboardView from "./UI/_dashboards/generalDashboardView";
import { setCurrentPageView } from "@/actions/cookieActions";
import DashboardLoadingView from "./UI/_dashboards/dashboardLoadingView";
import { LogItem } from "@/lib/types";
import { useModalState } from "@/hooks/(dashboard)/useModalState";

type props = {
  session: Session;
  view: string;
  mechanicProjectID: string;
  laborType: string;
};

// Extracted custom hook for fetching logs
const useFetchLogs = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLogs: React.Dispatch<React.SetStateAction<LogItem[]>>
) => {
  const e = useTranslations("Err-Msg");

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/getLogs");
        const logsData = await response.json();
        setLogs(logsData);
      } catch (error) {
        console.error(e("Logs-Fetch"));
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [e, setLoading, setLogs]);
};

// Reusable fetch for timesheet ID
const fetchRecentTimeSheetId = async (): Promise<string | null> => {
  try {
    const res = await fetch("/api/getRecentTimecard");
    const data = await res.json();
    return data?.id || null;
  } catch (error) {
    console.error("Error fetching recent timesheet ID:", error);
    return null;
  }
};

export default function DbWidgetSection({
  session,
  view,
  mechanicProjectID,
  laborType,
}: props) {
  const permission = session.user.permission;
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [additionalButtonsType, setAdditionalButtonsType] = useState<
    string | null
  >(null);
  const router = useRouter();
  const { currentView } = useCurrentView();

  useFetchLogs(setLoading, setLogs);
  const modalState = useModalState();

  const handleShowManagerButtons = useCallback(
    () => setAdditionalButtonsType(null),
    []
  );
  const handleShowAdditionalButtons = useCallback(
    (type: string) => setAdditionalButtonsType(type),
    []
  );

  const handleCOButton3 = useCallback(() => {
    if (logs.length === 0) {
      router.push("/dashboard/clock-out");
    } else {
      modalState.handleOpenModal();
    }
  }, [logs, router, modalState]);

  if (loading) {
    return <DashboardLoadingView loading={loading} />;
  }

  // Use switch for better readability in rendering views
  switch (view) {
    case "tasco":
      return (
        <TascoDashboardView
          {...modalState}
          comment={comment}
          setComment={setComment}
          handleCOButton3={handleCOButton3}
          handleShowManagerButtons={handleShowManagerButtons}
          additionalButtonsType={additionalButtonsType}
          logs={logs}
          permission={permission}
          currentView={currentView}
          laborType={laborType}
        />
      );
    case "truck":
      return (
        <TruckDriverDashboardView
          {...modalState}
          comment={comment}
          setComment={setComment}
          handleCOButton3={handleCOButton3}
          handleShowManagerButtons={handleShowManagerButtons}
          additionalButtonsType={additionalButtonsType}
          logs={logs}
          permission={permission}
          laborType={laborType}
        />
      );
    case "mechanic":
      return (
        <MechanicDashboardView
          {...modalState}
          comment={comment}
          setComment={setComment}
          handleCOButton3={handleCOButton3}
          handleShowManagerButtons={handleShowManagerButtons}
          additionalButtonsType={additionalButtonsType}
          logs={logs}
          permission={permission}
          mechanicProjectID={mechanicProjectID}
          laborType={laborType}
        />
      );
    case "general":
      return (
        <GeneralDashboardView
          {...modalState}
          comment={comment}
          setComment={setComment}
          handleCOButton3={handleCOButton3}
          handleShowManagerButtons={handleShowManagerButtons}
          handleShowAdditionalButtons={handleShowAdditionalButtons}
          additionalButtonsType={additionalButtonsType}
          logs={logs}
          permission={permission}
        />
      );
    default:
      return null;
  }
}
