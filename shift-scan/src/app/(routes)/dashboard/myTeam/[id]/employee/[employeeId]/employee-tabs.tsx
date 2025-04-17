"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import { z } from "zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Tab } from "@/components/(reusable)/tab";
import { EmployeeTimeSheets } from "./employee-timesheet";
import EmployeeInfo from "./employeeInfo";
import { format } from "date-fns";
import { TimeSheet } from "@/lib/types";
import { useSession } from "next-auth/react";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { Images } from "@/components/(reusable)/images";
import { Buttons } from "@/components/(reusable)/buttons";

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
  const { myTeam } = useParams();

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
    <Holds className="h-full">
      <Grids rows={"7"} gap={"5"} className="h-full">
        <Holds background={"white"} className="row-start-1 row-end-2 h-full">
          <TitleBoxes
            onClick={() =>
              router.push(rPath ? rPath : `/dashboard/myTeam/${myTeam}`)
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
          className={
            loading
              ? "h-full row-start-2 row-end-8  animate-pulse"
              : "row-start-2 row-end-8 h-full"
          }
        >
          <Grids rows={"10"}>
            <Holds position={"row"} className={"row-span-1  gap-1"}>
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
            <Holds
              background={"white"}
              className={"rounded-t-none row-span-9 h-full"}
            >
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
