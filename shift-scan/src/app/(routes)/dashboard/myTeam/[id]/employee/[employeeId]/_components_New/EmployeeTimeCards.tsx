"use client";
import { Inputs } from "@/components/(reusable)/inputs";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useTimesheetDataSimple } from "@/hooks/(ManagerHooks)/useTimesheetDataSimple";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import AppManagerEditTimesheetModal from "./TimesheetEditModal";
import { Button } from "@/components/ui/button";

export default function EmployeeTimeCards() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const t = useTranslations("MyTeam");
  const today = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
  const [date, setDate] = useState<string>(today);
  const params = useParams();
  const employeeId = Array.isArray(params.employeeId)
    ? params.employeeId[0]
    : params.employeeId;

  const { data, loading, error, updateDate, reset } = useTimesheetDataSimple(
    employeeId,
    date
  );

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    updateDate(newDate);
  };

  // Use the new API response structure
  const timesheets =
    data && Array.isArray(data.timesheetData) ? data.timesheetData : [];

  return (
    <div className="h-full w-full bg-white rounded-b-2xl">
      <div className="grid grid-rows-7 gap-2">
        <div className="row-span-1 rounded-b-lg bg-app-dark-blue h-full w-full p-2">
          <label htmlFor="date" className="text-xs text-white">
            {t("SelectDate")}
          </label>
          <Inputs
            type="date"
            name="date"
            id="date"
            value={date}
            className="text-xs text-center border-[3px] py-2 border-black"
            onChange={handleDateChange}
          />
        </div>
        <div className="row-span-6 overflow-y-auto p-2">
          {loading && <div className="text-center text-xs">Loading...</div>}
          {error && (
            <div className="text-center text-xs text-red-500">{error}</div>
          )}
          {!loading && !error && timesheets.length === 0 && (
            <div className="text-center text-xs text-gray-400">
              No timesheets found for this date.
            </div>
          )}
          {!loading && !error && timesheets.length > 0 && (
            <>
              {timesheets.map((ts, idx) => (
                <div
                  className="border-black border-[3px] rounded-[10px] mb-2 cursor-pointer relative hover:bg-gray-50 transition"
                  key={ts.id}
                >
                  <Button
                    onClick={() => {
                      setEditingId(ts.id);
                      setShowEditModal(true);
                    }}
                    className="w-full h-full absolute bg-transparent"
                  ></Button>
                  <Grids cols={"8"} className="w-full h-full">
                    <Holds className="col-start-1 col-end-2 p-2">
                      <Images
                        titleImg={
                          ts.workType === "TASCO"
                            ? "/tasco.svg"
                            : ts.workType === "TRUCK_DRIVER"
                            ? "/trucking.svg"
                            : ts.workType === "MECHANIC"
                            ? "/mechanic.svg"
                            : ts.workType === "LABOR"
                            ? "/equipment.svg"
                            : "null"
                        }
                        titleImgAlt={`${ts.workType} Icon`}
                        className="m-auto w-8 h-8"
                      />
                    </Holds>
                    <Holds className="col-start-2 col-end-5 border-x-[3px] border-black h-full">
                      {" "}
                      <Holds className="h-full justify-center border-b-[1.5px] border-black">
                        {" "}
                        <Inputs
                          type="time"
                          value={format(new Date(ts.startTime), "HH:mm")}
                          className="text-xs border-none h-full rounded-none justify-center text-center px-1 w-full"
                          disabled={true}
                        />
                      </Holds>{" "}
                      <Holds className="h-full w-full justify-center border-t-[1.5px] border-black">
                        {" "}
                        <Inputs
                          type="time"
                          value={format(new Date(ts.endTime), "HH:mm")}
                          className="text-xs border-none h-full rounded-none justify-center text-center px-1 w-full"
                          disabled={true}
                        />
                      </Holds>
                    </Holds>
                    <Holds className="col-start-5 col-end-9 h-full">
                      <Holds className="border-b-[1.5px] border-black h-full justify-center">
                        {" "}
                        <Inputs
                          type={"text"}
                          value={ts.Jobsite?.name || "N/A"}
                          className="text-xs border-none h-full rounded-b-none rounded-l-none rounded-br-none justify-center text-right"
                          disabled={true}
                          readOnly
                        />
                      </Holds>{" "}
                      <Holds className="h-full justify-center text-right border-t-[1.5px] border-black">
                        <Inputs
                          type={"text"}
                          value={ts.CostCode?.name || "N/A"}
                          className="text-xs border-none h-full rounded-t-none rounded-bl-none justify-center text-right"
                          disabled={true}
                          readOnly
                        />
                      </Holds>
                    </Holds>
                  </Grids>
                </div>
              ))}
              {showEditModal && editingId && (
                <AppManagerEditTimesheetModal
                  timesheetId={editingId}
                  isOpen={showEditModal}
                  onClose={() => {
                    setShowEditModal(false);
                    reset();
                  }}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
