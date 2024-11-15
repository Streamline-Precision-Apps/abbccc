import EmptyView from "@/app/(routes)/admins/_pages/EmptyView";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TimeSheet = {
  submitDate?: string; // Changed to string since API returns string dates
  id: string;
  userId?: string;
  date?: string;
  jobsiteId?: string;
  costcode?: string;
  nu?: string;
  Fp?: string;
  vehicleId?: number | null;
  startTime?: string;
  endTime?: string | null;
  duration?: number | null;
  startingMileage?: number | null;
  endingMileage?: number | null;
  leftIdaho?: boolean | null;
  equipmentHauled?: string | null;
  materialsHauled?: string | null;
  hauledLoadsQuantity?: number | null;
  refuelingGallons?: number | null;
  timeSheetComments?: string | null;
  status?: string;
};

export const TimesheetView = ({ params }: { params: { employee: string } }) => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const filter = searchParams.get("filter");
  const router = useRouter();
  const [dateByFilter, setDateByFilter] = useState<string>("");
  const [userTimeSheets, setUserTimeSheets] = useState<TimeSheet[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set()); // Track expanded timesheet IDs

  useEffect(() => {
    const fetchTimesheets = async () => {
      if (!params.employee) {
        setError("Invalid employee ID.");
        return;
      }
      if (dateByFilter === "" || dateByFilter === null) {
        return;
      }
      try {
        const response = await fetch(
          `/api/getAllTimesheetsByDate/${params.employee}?date=${dateByFilter}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setUserTimeSheets(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch employee info:", error);
        setError("Unable to load timesheets. Please try again later.");
      }
    };
    fetchTimesheets();
  }, [dateByFilter, params.employee]);

  useEffect(() => {
    setDateByFilter(date || "");
  }, [date]);

  useEffect(() => {
    if (filter) {
      console.log(`Filter changed: ${filter}`);
      setDateByFilter("");
    }
  }, [filter]);

  const handleDateClick = (newDate: string) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("date", newDate);
    router.push(`?${updatedSearchParams.toString()}`);
  };

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <Grids rows={"12"} gap={"5"} className="h-full w-full">
      {error ? (
        <Texts className="text-red-500">{error}</Texts>
      ) : (
        <>
          <Holds className="row-span-2 h-full">
            <Holds className="my-auto">
              <Inputs
                type="date"
                value={dateByFilter}
                onChange={(e) => handleDateClick(e.target.value)}
                className="w-[30%]"
              />
            </Holds>
          </Holds>
          <Holds className="row-span-10 h-full">
            <Holds className="h-full w-full row-span-5 overflow-y-auto no-scrollbar border-[3px] border-black rounded-[10px]">
              {userTimeSheets.length > 0 ? (
                userTimeSheets.map((timesheet) => {
                  const isExpanded = expandedIds.has(timesheet.id);
                  return (
                    <Holds
                      key={timesheet.id}
                      className="w-full even:bg-gray-200 odd:bg-gray-100 rounded-[10px] px-2 py-3 mb-4 cursor-pointer"
                      onClick={() => toggleExpanded(timesheet.id)} // Toggle on click
                    >
                      {/* Always show the header */}
                      <Holds position={"row"} className="h-full w-full mb-2">
                        <Holds className="w-1/2">
                          <Texts>
                            <strong>Jobsite:</strong>{" "}
                            {timesheet.jobsiteId || "N/A"}
                          </Texts>
                        </Holds>
                        <Holds className="w-1/2">
                          <Texts>
                            <strong>Status:</strong> {timesheet.status || "N/A"}
                          </Texts>
                        </Holds>
                      </Holds>

                      {/* Collapsible details */}
                      {isExpanded && (
                        <>
                          <Holds
                            position={"row"}
                            className="h-full w-full mb-2"
                          >
                            <Holds className="w-1/2">
                              <Texts>
                                <strong>Start Time:</strong>{" "}
                                {timesheet.startTime
                                  ? new Date(
                                      timesheet.startTime
                                    ).toLocaleTimeString()
                                  : "N/A"}
                              </Texts>
                            </Holds>
                            <Holds className="w-1/2">
                              <Texts>
                                <strong>End Time:</strong>{" "}
                                {timesheet.endTime
                                  ? new Date(
                                      timesheet.endTime
                                    ).toLocaleTimeString()
                                  : "N/A"}
                              </Texts>
                            </Holds>
                          </Holds>
                          <Holds
                            position={"row"}
                            className="h-full w-full mb-2"
                          >
                            <Holds className="w-1/2">
                              <Texts>
                                <strong>Duration:</strong>{" "}
                                {timesheet.duration
                                  ? `${timesheet.duration.toFixed(2)} hours`
                                  : "N/A"}
                              </Texts>
                            </Holds>
                            <Holds className="w-1/2">
                              <Texts>
                                <strong>Comments:</strong>{" "}
                                {timesheet.timeSheetComments || "None"}
                              </Texts>
                            </Holds>
                          </Holds>
                        </>
                      )}
                    </Holds>
                  );
                })
              ) : (
                <EmptyView Children={undefined} />
              )}
            </Holds>
          </Holds>
        </>
      )}
    </Grids>
  );
};
