"use client";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { Session } from "next-auth";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import { useOfflineAwareData } from "@/hooks/useOfflineAwareData";
import TascoDashboardView from "./UI/_dashboards/tascoDashboardView";
import TruckDriverDashboardView from "./UI/_dashboards/truckDriverDashboardView";
import MechanicDashboardView from "./UI/_dashboards/mechanicDashboardView";
import GeneralDashboardView from "./UI/_dashboards/generalDashboardView";
import DashboardLoadingView from "./UI/_dashboards/dashboardLoadingView";
import { LogItem } from "@/lib/types";
import { useModalState } from "@/hooks/(dashboard)/useModalState";

type props = {
  session: Session;
  view: string;
  mechanicProjectID: string;
  laborType: string;
};

// Offline-aware logs fetching
const useFetchLogs = (
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setLogs: React.Dispatch<React.SetStateAction<LogItem[]>>,
  userId: string,
) => {
  const e = useTranslations("Err-Msg");
  const { fetchLogs, isOnline } = useOfflineAwareData();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    // Only fetch once per user
    if (hasFetched) return;

    const loadLogs = async () => {
      setLoading(true);
      try {
        const logsData = await fetchLogs();
        setLogs(logsData || []);
        setHasFetched(true);

        if (!isOnline) {
          console.log("[OFFLINE] Using offline/mock logs data");
        }
      } catch (error) {
        console.error(e("Logs-Fetch"), error);
        // In offline mode or on error, use empty logs
        setLogs([]);
        setHasFetched(true);
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, [userId]); // Only depend on userId to prevent infinite loops
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

  useFetchLogs(setLoading, setLogs, session.user.id);
  const modalState = useModalState();

  const verifyLogsCompletion = useCallback(() => {
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
          verifyLogsCompletion={verifyLogsCompletion}
          additionalButtonsType={additionalButtonsType}
          logs={logs}
          permission={permission}
          currentView={currentView}
          mechanicProjectID={mechanicProjectID}
          laborType={laborType}
        />
      );
    case "truck":
      return (
        <TruckDriverDashboardView
          {...modalState}
          comment={comment}
          setComment={setComment}
          verifyLogsCompletion={verifyLogsCompletion}
          additionalButtonsType={additionalButtonsType}
          logs={logs}
          permission={permission}
          mechanicProjectID={mechanicProjectID}
          laborType={laborType}
        />
      );
    case "mechanic":
      return (
        <MechanicDashboardView
          {...modalState}
          comment={comment}
          setComment={setComment}
          verifyLogsCompletion={verifyLogsCompletion}
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
          verifyLogsCompletion={verifyLogsCompletion}
          additionalButtonsType={additionalButtonsType}
          logs={logs}
          mechanicProjectID={mechanicProjectID}
          permission={permission}
        />
      );
    default:
      return null;
  }
}
