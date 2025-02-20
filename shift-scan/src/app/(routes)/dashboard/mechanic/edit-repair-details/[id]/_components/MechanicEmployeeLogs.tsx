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
import EmptyView from "@/components/(reusable)/emptyView";
import { EmptyViews } from "@/components/(reusable)/emptyViews";

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
  totalHours,
}: {
  logs: LogItem[] | undefined;
  loading: boolean;
  totalHours: number;
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

  const hours = Math.floor(totalHours / 60);
  const minutes = totalHours * 60 - hours * 60;

  const formattedTotalHours = `${hours} hrs ${minutes.toFixed(0)} mins`;

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

  // Otherwise, display the logs and add placeholder skeletons
  // to ensure each log has up to 6 boxes (maintenance logs).
  return (
    <Holds className=" h-full py-3 ">
      <Contents width={"section"} className=" h-full">
        <Holds
          position={"row"}
          className="w-full justify-between  py-2 border-y-[3px] border-black"
        >
          <Titles size={"h4"} position={"left"}>
            Total Labor Hours:
          </Titles>
          <Texts size={"p3"}>{formattedTotalHours}</Texts>
        </Holds>
        <Holds className="no-scrollbar overflow-y-auto h-full py-3 ">
          {logs &&
            logs.map((log) => {
              const actualCount = log.maintenanceLogs.length;
              const placeholders = Math.max(5 - actualCount, 0);
              return (
                <Holds key={log.id} className="w-full h-full">
                  {/* Render actual maintenance logs */}
                  {log.maintenanceLogs.map((mLog) => (
                    <Grids
                      key={mLog.id}
                      rows={"3"}
                      className="mb-4 bg-app-gray rounded-[10px] px-3 "
                    >
                      <Holds
                        position={"row"}
                        className="row-start-1 row-end-2 w-full justify-between "
                      >
                        <Titles size={"h4"} position={"left"}>
                          {`${mLog.user.firstName} ${mLog.user.lastName}`}
                        </Titles>

                        <Texts size={"p6"}>
                          {formatTime(mLog.startTime)}
                          {" - "}
                          {mLog.endTime ? formatTime(mLog.endTime) : "Active"}
                        </Texts>
                      </Holds>
                      <Holds className="row-start-2 row-end-4 h-full w-full pb-2 ">
                        <Labels size={"p6"}>Comment</Labels>
                        <TextAreas
                          className={`${mLog.comment} ? 'text-xs' : text-xs font-bold `}
                          disabled
                          defaultValue={
                            mLog.comment === "" ? "No comment" : mLog.comment
                          }
                        ></TextAreas>
                      </Holds>
                    </Grids>
                  ))}

                  {/* If no Logs, render a placeholder */}
                  {actualCount === 0 && (
                    <Holds background="lightGray" className="h-full">
                      <EmptyViews
                        TopChild={
                          <Holds className="h-full justify-center">
                            <Titles size={"h3"}>No Logs Found!</Titles>
                          </Holds>
                        }
                      />
                    </Holds>
                  )}

                  {/* Render placeholders for remaining items */}
                  {actualCount > 0 &&
                    Array.from({ length: placeholders }).map((_, idx) => (
                      <Holds
                        background="lightGray"
                        className="h-1/6 my-2 py-10 flex items-center justify-center"
                        key={idx}
                      >
                        <Texts size={"p5"}></Texts>
                      </Holds>
                    ))}
                </Holds>
              );
            })}
        </Holds>
      </Contents>
    </Holds>
  );
}
