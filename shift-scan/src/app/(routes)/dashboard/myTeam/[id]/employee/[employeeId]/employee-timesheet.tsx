"use client";
import { useEffect, useRef, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import EditWork from "./editWork";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { fetchEq } from "@/actions/equipmentActions";
import { Contents } from "@/components/(reusable)/contents";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { EquipmentLog } from "@/lib/types";

type Props = {
  employeeId: string;
};
export type TimeSheet = {
  endDate: string | undefined;
  startDate: string;
  submitDate?: Date;
  id: string;
  userId?: string;
  date?: Date;
  jobsiteId?: string;
  costcode?: string;
  nu?: string;
  Fp?: string;
  vehicleId?: number | null;
  startTime?: Date | string;
  endTime?: Date | string | null;
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

export const EmployeeTimeSheets = ({ employeeId }: Props) => {
  const t = useTranslations("MyTeam");
  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);
  const [filteredEquipmentData, setFilteredEquipmentData] = useState<
    EquipmentLog[]
  >([]);
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState("");
  const [costcodesData, setCostcodesData] = useState([]);
  const [jobsitesData, setJobsitesData] = useState([]);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [costcodes, jobsites, equipment] = await Promise.all([
        fetch("/api/getCostCodes").then((res) => res.json()),
        fetch("/api/getJobsites").then((res) => res.json()),
        fetch("/api/getAllEquipment").then((res) => res.json()),
      ]);

      setCostcodesData(costcodes);
      setJobsitesData(jobsites);
      setEquipment(equipment);
    };
    fetchData();
  }, []);

  const handleFormSubmitWrapper = async (date: string, message?: string) => {
    const results = await fetchTimesheets(employeeId, date);
    const timesheets = results.map((result) => ({
      ...result,
      id: result.id.toString(), // Convert id to string
      endDate: result.endTime?.toISOString(), // assuming endTime is the same as endDate
      startDate: result.startTime.toISOString(),
    }));
    setTimesheets(timesheets);

    const eqResults = await fetchEq(employeeId, date);
    const formattedEqResults = eqResults.map((result) => ({
      ...result,
      duration: result.duration?.toString() ?? null,
      Equipment: {
        ...result.Equipment,
        isActive: result.Equipment?.isActive ?? false,
        mileage: result.Equipment?.mileage ?? 0,
        registrationExpiration:
          result.Equipment?.registrationExpiration ?? null,
        licensePlate: result.Equipment?.licensePlate ?? "",
        year: result.Equipment?.year ?? "",
        model: result.Equipment?.model ?? "",
        make: result.Equipment?.make ?? "",
        updatedAt: result.Equipment?.updatedAt ?? new Date(),
        createdAt: result.Equipment?.createdAt ?? new Date(),
        lastRepair: result.Equipment?.lastRepair ?? null,
        lastInspection: result.Equipment?.lastInspection ?? null,
        status: result.Equipment?.status ?? "",
        equipmentTag: result.Equipment?.equipmentTag ?? "",
        qrId: result.Equipment?.qrId ?? "",
        name: result.Equipment?.name ?? "",
        description: result.Equipment?.description ?? "",
        id: result.Equipment?.id ?? "",
      },
    }));
    setFilteredEquipmentData(formattedEqResults);

    setMessage(message || "");
  };

  const handleFormChange = () => {
    formRef.current?.requestSubmit();
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(formRef.current!);
    const date = formData.get("date") as string;
    setDate(date);
    handleFormSubmitWrapper(date);
  };

  const handleFormSubmitFromEditWork = async (
    date: string,
    message?: string
  ) => {
    handleFormSubmitWrapper(date, message);
  };

  useEffect(() => {
    setMessage("");
  }, [edit]);

  return (
    <>
      <Holds background={"darkBlue"}>
        <Contents width={"section"}>
          <Holds>
            <Titles text={"white"} position={"left"}>
              {t("SelectDate")}
            </Titles>
            <form
              ref={formRef}
              onChange={handleFormChange}
              onSubmit={handleFormSubmit}
            >
              <Inputs
                type="date"
                name="date"
                id="date"
                className="flex justify-center m-auto text-black text-2xl bg-white p-2 border-2 border-black rounded-2xl"
              />
              <Inputs type="hidden" name="id" value={employeeId} />
            </form>
            <Titles>{message}</Titles>
          </Holds>
          {date && (
            <Holds size={"full"} background={"white"} className="my-5">
              <EditWork
                timesheetData={timesheets}
                edit={edit}
                costcodesData={costcodesData}
                jobsitesData={jobsitesData}
                equipmentData={filteredEquipmentData}
                handleFormSubmit={handleFormSubmitFromEditWork}
                setEdit={setEdit}
                employeeId={employeeId}
                date={date}
                equipment={equipment}
              />
            </Holds>
          )}
        </Contents>
      </Holds>
    </>
  );
};
