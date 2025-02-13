"use client";
import { useState, useEffect } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Texts } from "@/components/(reusable)/texts";
import { Contents } from "@/components/(reusable)/contents";
import { formatTime } from "@/utils/formatDateAmPm";
import { Titles } from "@/components/(reusable)/titles";
import { Labels } from "@/components/(reusable)/labels";
import { TextAreas } from "@/components/(reusable)/textareas";

type User = {
  firstName: string;
  lastName: string;
};

type MaintenanceLog = {
  id: string;
  startTime: string;
  endTime: string;
  comment: string;
  user: User;
};

type LogItem = {
  id: string;
  maintenanceLogs: MaintenanceLog[];
};

export default function MechanicEmployeeLogs({
  logs: initialLogs,
  loading,
}: {
  logs: LogItem[] | undefined;
  loading: boolean;
}) {
  const [logs, setLogs] = useState<LogItem[] | undefined>(initialLogs);

  // Update local logs state when initialLogs changes.
  // If initialLogs is null or undefined, set logs to an empty array.
  useEffect(() => {
    if (initialLogs) {
      setLogs(initialLogs);
    } else {
      setLogs([]);
    }
  }, [initialLogs]);

  // If still loading, show the loading skeleton UI.
  if (loading) {
    return (
      <Holds className="no-scrollbar overflow-y-auto">
        <Contents width={"section"} className="py-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <Holds
              key={index}
              background="lightGray"
              className="h-1/6 my-2 py-7 animate-pulse"
            />
          ))}
        </Contents>
      </Holds>
    );
  }

  // If logs are null/empty, display a UI shell or a message.
  if (!logs || logs.length === 0) {
    return (
      <Holds className="no-scrollbar overflow-y-auto">
        <Contents width={"section"} className="py-5">
          <Holds
            background="lightGray"
            className="h-1/6 my-2 py-7 flex items-center justify-center"
          >
            <Texts size={"p5"}>No logs available</Texts>
          </Holds>
        </Contents>
      </Holds>
    );
  }

  // Otherwise, display the logs and add placeholder skeletons
  // to ensure each log has up to 6 boxes (maintenance logs).
  return (
    <Holds className="no-scrollbar overflow-y-auto">
      <Contents width={"section"} className="py-5">
        {logs.map((log) => {
          const actualCount = log.maintenanceLogs.length;
          const placeholders = Math.max(5 - actualCount, 0);
          return (
            <Holds key={log.id}>
              {/* Render actual maintenance logs */}
              {log.maintenanceLogs.map((mLog) => (
                <Grids
                  key={mLog.id}
                  rows={"4"}
                  cols={"2"}
                  className="mb-4 bg-slate-200 rounded-[10px] p-2"
                >
                  <Holds className="row-start-1 row-end-2 col-start-1 col-end-3 w-full ">
                    <Titles size={"h3"}>
                      {`${mLog.user.firstName} ${mLog.user.lastName}`}
                    </Titles>
                  </Holds>
                  <Holds className="row-start-2 row-end-4 col-start-1 col-end-3 h-full w-full ">
                    <Labels size={"p3"}>Comment</Labels>
                    <TextAreas className="text-xs">{mLog.comment}</TextAreas>
                  </Holds>
                  <Holds className="row-start-4 row-end-5 col-start-1 col-end-3  w-full justify-center">
                    <Texts size={"p3"}>
                      {formatTime(mLog.startTime)}
                      {" - "}
                      {mLog.endTime ? formatTime(mLog.endTime) : "Active"}
                    </Texts>
                  </Holds>
                </Grids>
              ))}
              {/* Render placeholders for remaining items */}
              {Array.from({ length: placeholders }).map((_, idx) => (
                <Holds
                  background="lightGray"
                  className="h-1/6 my-2 py-10 flex items-center justify-center"
                >
                  <Texts size={"p5"}></Texts>
                </Holds>
              ))}
            </Holds>
          );
        })}
      </Contents>
    </Holds>
  );
}
