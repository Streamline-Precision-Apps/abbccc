"use client";
import { useEffect, useRef, useState } from "react";
import { fetchTimesheets } from "@/actions/timeSheetActions";
import EditWork from "./edit-work";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { fetchEq } from "@/actions/equipmentActions";
import router from "next/router";
import { setAuthStep } from "@/app/api/auth";
import { Contents } from "@/components/(reusable)/contents";
import { Tab } from "@/components/(reusable)/tab";
import { useTranslations } from "next-intl";
import AddTimeSheet from "./addTimesheet";
import {
  CostCodes,
  Equipment,
  EquipmentCodes,
  EquipmentLog,
  Jobsites,
} from "@/lib/types";

type Props = {
  employeeId: string;
  costcodeData: CostCodes[];
  jobsiteData: Jobsites[];
  equipmentData: Equipment[];
  equipment: Equipment[];
  permission: string | undefined;
};

type TimeSheet = {
  endDate: Date | string | null;
  startDate: Date | string | null;
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

export const EmployeeTimeSheets = ({
  employeeId,
  costcodeData,
  equipment,
  jobsiteData,
  permission,
}: Props) => {
  const t = useTranslations("admin");
  const [timesheets, setTimesheets] = useState<TimeSheet[]>([]);
  const [filteredEquipmentData, setFilteredEquipmentData] = useState<
    EquipmentCodes[]
  >([]); // Changed to EquipmentCodes[]
  const [message, setMessage] = useState("");
  const [edit, setEdit] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [date, setDate] = useState("");
  const [activeTab, setActiveTab] = useState(1);

  const handleFormSubmitWrapper = async (date: string, message?: string) => {
    const results = await fetchTimesheets(employeeId, date);
    const timesheets = results.map((result) => ({
      ...result,
      id: result.id.toString(),
      startTime: new Date(result.startTime).toISOString(), // Ensure valid Date object
      endTime: result.endTime ? new Date(result.endTime).toISOString() : "",
      costcode: result.costcode,
      date: new Date(result.date), // Ensure valid Date object
      status: result.status,
      userId: result.userId.toString(),
      jobsiteId: result.jobsiteId.toString(),
      endDate: result.endTime ? new Date(result.endTime).toISOString() : null,
      startDate: result.startTime
        ? new Date(result.startTime).toISOString()
        : null,
    }));
    setTimesheets(timesheets);

    const eqResults: EquipmentCodes[] = await fetchEq(employeeId, date).then(
      (results) =>
        results.map((result) => ({
          id: result.Equipment?.id ?? "",
          qrId: result.Equipment?.qrId ?? "",
          name: result.Equipment?.name ?? "",
          description: result.Equipment?.description ?? "",
          equipmentTag: result.Equipment?.equipmentTag ?? "",
          lastInspection: result.Equipment?.lastInspection ?? null,
          lastRepair: result.Equipment?.lastRepair ?? null,
          status: result.Equipment?.status ?? "",
          make: result.Equipment?.make ?? "",
          model: result.Equipment?.model ?? "",
          year: result.Equipment?.year ?? "",
          licensePlate: result.Equipment?.licensePlate ?? "",
          registrationExpiration:
            result.Equipment?.registrationExpiration ?? null,
          mileage: result.Equipment?.mileage ?? 0,
          updatedAt: result.Equipment?.updatedAt ?? new Date(),
          createdAt: result.Equipment?.createdAt ?? new Date(),
          isActive: result.Equipment?.isActive ?? true, // Add this line
        }))
    );
    setFilteredEquipmentData(eqResults);

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
    employeeId: string,
    date: string,
    message?: string
  ) => {
    handleFormSubmitWrapper(date, message);
  };

  useEffect(() => {
    setMessage("");
  }, [edit]);

  useEffect(() => {
    if (permission !== "ADMIN" && permission !== "SUPERADMIN") {
      router.push("/"); // Redirect to login page if not authenticated
    } else {
      setAuthStep("ADMIN");
    }
  }, [permission]);

  return (
    <>
      <Holds>
        <Holds>
          <Contents>
            <Tab onClick={() => setActiveTab(1)} isActive={activeTab === 1}>
              {t("AddTimeSheet")}
            </Tab>
            <Tab onClick={() => setActiveTab(2)} isActive={activeTab === 2}>
              {t("ViewTimeSheets")}
            </Tab>
            {activeTab === 1 && (
              <AddTimeSheet
                jobsites={jobsiteData}
                equipment={equipment}
                employeeId={employeeId}
              />
            )}
            {activeTab === 2 && (
              <Holds>
                <h1>Select Date</h1>
                <form
                  ref={formRef}
                  onChange={handleFormChange}
                  onSubmit={handleFormSubmit}
                >
                  <input
                    type="date"
                    name="date"
                    id="date"
                    className="flex justify-center m-auto text-black text-2xl bg-white p-2 border-2 border-black rounded-2xl"
                  />
                  <input type="hidden" name="id" value={employeeId} />
                </form>
                <Titles>{message}</Titles>
                <EditWork
                  timesheetData={timesheets}
                  edit={edit}
                  costcodesData={costcodeData}
                  jobsitesData={jobsiteData}
                  equipmentData={
                    filteredEquipmentData as unknown as EquipmentLog[]
                  }
                  handleFormSubmit={handleFormSubmitFromEditWork}
                  setEdit={setEdit}
                  employeeId={employeeId}
                  date={date}
                  equipment={equipment as EquipmentCodes[]}
                />
              </Holds>
            )}
          </Contents>
        </Holds>
      </Holds>
    </>
  );
};
