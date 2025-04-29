"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { EmployeeTimeSheets } from "./employee-timesheet";
import EmployeeInfo from "./employeeInfo";
import { format } from "date-fns";
import {
  EquipmentLogs,
  TascoHaulLogs,
  TascoRefuelLog,
  TascoRefuelLogData,
  TimesheetHighlights,
  TruckingEquipmentHaulLogData,
  TruckingMaterialHaulLogData,
  TruckingMileageData,
  TruckingRefuelLogData,
  TruckingStateLogData,
} from "@/lib/types";
import { useSession } from "next-auth/react";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";

// Zod schema for employee data
const EmployeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  DOB: z.string().optional(),
  email: z.string(),
  image: z.string().nullable().optional(),
});

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  DOB?: string;
  clockedIn?: boolean;
};

type Contact = {
  phoneNumber: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;
};

export default function EmployeeTabs() {
  const { employeeId } = useParams();
  const urls = useSearchParams();
  const rPath = urls.get("rPath");
  const timeCard = urls.get("timeCard");
  const { id } = useParams();

  const router = useRouter();
  const t = useTranslations("MyTeam");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [contacts, setContacts] = useState<Contact | null>(null);
  // Loading States
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingTimesheets, setLoadingTimesheets] = useState(false);

  // Combined Loading State
  const loading = loadingUser || loadingTimesheets;
  const { data: session } = useSession();
  const manager = `${session?.user?.firstName} ${session?.user?.lastName}`;
  const [activeTab, setActiveTab] = useState(1);
  const today = format(new Date(), "yyyy-MM-dd");
  const [date, setDate] = useState<string>(today); // State for selected date
  const [edit, setEdit] = useState(false);
  const [timeSheetFilter, setTimeSheetFilter] = useState("timesheetHighlights");
  const [highlightTimesheet, setHighlightTimesheet] = useState<
    TimesheetHighlights[]
  >([]);

  const [truckingEquipmentHaulLogs, setTruckingEquipmentHaulLogs] =
    useState<TruckingEquipmentHaulLogData>([]);
  const [truckingMaterialHaulLogs, setTruckingMaterialHaulLogs] =
    useState<TruckingMaterialHaulLogData>([]);

  const [truckingMileage, setTruckingMileage] =
    useState<TruckingMileageData | null>(null);

  const [truckingRefuelLogs, setTruckingRefuelLogs] =
    useState<TruckingRefuelLogData | null>(null);
  const [truckingStateLogs, setTruckingStateLogs] =
    useState<TruckingStateLogData | null>(null);

  const [tascoRefuelLog, setTascoRefuelLog] =
    useState<TascoRefuelLogData | null>(null);
  const [tascoHaulLogs, setTascoHaulLogs] = useState<TascoHaulLogs[]>([]);
  const [equipmentLogs, setEquipmentLogs] = useState<EquipmentLogs[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingUser(true);
      try {
        const data = await fetch(`/api/getUserInfo/${employeeId}`);
        const res = await data.json();
        console.log(res);

        // Validate fetched data using Zod
        try {
          EmployeeSchema.parse(res.employeeData);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in employee data:", error.errors);
          }
        }

        if (res.error) {
          console.error(res.error);
        } else {
          setEmployee(res.employeeData);
          setContacts(res.contact);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchData();
  }, [employeeId]);

  // Handle date selection and fetch timesheets
  useEffect(() => {
    setLoadingTimesheets(true);
    const fetchTimeSheets = async () => {
      try {
        const request = await fetch(
          `/api/getTimesheetsByDate?employeeId=${employeeId}&date=${date}&type=${timeSheetFilter}`
        );
        const data = await request.json();
        if (timeSheetFilter === "timesheetHighlights") {
          setHighlightTimesheet(data as TimesheetHighlights[]);
        }
        if (timeSheetFilter === "truckingMileage") {
          setTruckingMileage(data as TruckingMileageData);
        }
        if (timeSheetFilter === "truckingEquipmentHaulLogs") {
          setTruckingEquipmentHaulLogs(data as TruckingEquipmentHaulLogData);
        }
        if (timeSheetFilter === "truckingMaterialHaulLogs") {
          setTruckingMaterialHaulLogs(data as TruckingMaterialHaulLogData);
        }
        if (timeSheetFilter === "truckingRefuelLogs") {
          setTruckingRefuelLogs(data as TruckingRefuelLogData);
        }
        if (timeSheetFilter === "truckingStateLogs") {
          setTruckingStateLogs(data as TruckingStateLogData);
        }
        if (timeSheetFilter === "tascoRefuelLogs") {
          setTascoRefuelLog(data as TascoRefuelLogData);
        }
        if (timeSheetFilter === "tascoHaulLogs") {
          setTascoHaulLogs(data as TascoHaulLogs[]);
        }
        if (timeSheetFilter === "equipmentLogs") {
          setEquipmentLogs(data as EquipmentLogs[]);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingTimesheets(false);
      }
    };
    fetchTimeSheets();
  }, [date, timeSheetFilter]);

  return (
    <Holds className="h-full w-full">
      <Grids rows={"7"} gap={"5"} className="h-full w-full">
        <Holds
          background={"white"}
          className="row-start-1 row-end-2 h-full w-full"
        >
          <TitleBoxes
            onClick={() =>
              router.push(
                timeCard ? timeCard : `/dashboard/myTeam/${id}?rPath=${rPath}`
              )
            }
          >
            <Titles size={"h2"}>
              {loading
                ? "loading..."
                : `${employee?.firstName} ${employee?.lastName}`}
            </Titles>
          </TitleBoxes>
        </Holds>

        <Holds
          className={`w-full h-full row-start-2 row-end-8 ${
            loading ? "animate-pulse" : ""
          }`}
        >
          <Grids rows={"12"} className="h-full w-full">
            <Holds
              position={"row"}
              className={"row-start-1 row-end-2 h-full gap-1"}
            >
              <NewTab
                onClick={() => setActiveTab(1)}
                isActive={activeTab === 1}
                isComplete={true}
                titleImage="/information.svg"
                titleImageAlt={""}
              >
                {t("ContactInfo")}
              </NewTab>
              <NewTab
                onClick={() => setActiveTab(2)}
                isActive={activeTab === 2}
                isComplete={true}
                titleImage="/form.svg"
                titleImageAlt={""}
              >
                {t("TimeCards")}
              </NewTab>
            </Holds>
            <Holds className="h-full w-full row-start-2 row-end-13">
              {activeTab === 1 && (
                <EmployeeInfo
                  employee={employee}
                  contacts={contacts}
                  loading={loading}
                />
              )}
              {activeTab === 2 && (
                <EmployeeTimeSheets
                  highlightTimesheet={highlightTimesheet}
                  truckingEquipmentHaulLogs={truckingEquipmentHaulLogs}
                  truckingMaterialHaulLogs={truckingMaterialHaulLogs}
                  truckingMileage={truckingMileage}
                  truckingRefuelLogs={truckingRefuelLogs}
                  truckingStateLogs={truckingStateLogs}
                  tascoRefuelLog={tascoRefuelLog}
                  tascoHaulLogs={tascoHaulLogs}
                  equipmentLogs={equipmentLogs}
                  date={date}
                  setDate={setDate}
                  edit={edit}
                  setEdit={setEdit}
                  loading={loading}
                  manager={manager}
                  timeSheetFilter={timeSheetFilter}
                  setTimeSheetFilter={setTimeSheetFilter}
                />
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
