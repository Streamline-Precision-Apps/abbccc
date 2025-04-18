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
import { format, set } from "date-fns";
import {
  EquipmentLogs,
  TascoHaulLogs,
  TascoRefuelLog,
  TimeSheet,
  TimesheetHighlights,
  TruckingHaulLog,
  TruckingMileage,
  TruckingRefuelLog,
  TruckingStateLogs,
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
  // Changed to EmployeeInfo
  // Validate params using Zod
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
  const [timeSheets, setTimeSheets] = useState<TimeSheet[]>([]); // State for storing timesheets
  const [highlightTimesheet, setHighlightTimesheet] = useState<
    TimesheetHighlights[]
  >([]);
  const [truckingHaulLogs, setTruckingHaulLogs] = useState<TruckingHaulLog[]>(
    []
  );

  const [truckingMileage, setTruckingMileage] = useState<TruckingMileage[]>([]);

  const [truckingRefuelLogs, setTruckingRefuelLogs] = useState<
    TruckingRefuelLog[]
  >([]);
  const [truckingStateLogs, setTruckingStateLogs] = useState<
    TruckingStateLogs[]
  >([]);

  const [tascoRefuelLog, setTascoRefuelLog] = useState<TascoRefuelLog[]>([]);
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
          `/api/getTimesheetsByDate?employeeId=${employeeId}&date=${date}`
        );
        const data = await request.json();
        setHighlightTimesheet(data as TimesheetHighlights[]);
        // Truck Data
        setTruckingMileage(data as TruckingMileage[]);
        setTruckingHaulLogs(data as TruckingHaulLog[]);
        setTruckingRefuelLogs(data as TruckingRefuelLog[]);
        setTruckingStateLogs(data as TruckingStateLogs[]);
        // TASCO Data
        setTascoRefuelLog(data as TascoRefuelLog[]);
        setTascoHaulLogs(data as TascoHaulLogs[]);
        setEquipmentLogs(data as EquipmentLogs[]);

        setTimeSheets(data as TimeSheet[]);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingTimesheets(false);
      }
    };
    fetchTimeSheets();
  }, [date]);

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
                  timeSheets={timeSheets}
                  date={date}
                  setDate={setDate}
                  edit={edit}
                  setEdit={setEdit}
                  loading={loading}
                  manager={manager}
                />
              )}
            </Holds>
          </Grids>
        </Holds>
      </Grids>
    </Holds>
  );
}
