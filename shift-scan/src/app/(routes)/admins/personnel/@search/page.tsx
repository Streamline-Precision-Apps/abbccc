"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Tab } from "@/components/(reusable)/tab";
import { useEffect, useState } from "react";
import { Timesheets } from "./_components/Timesheets";
import { SearchCrew, SearchUser } from "@/lib/types";
import { z } from "zod";
import { Personnel } from "./_components/Personnel";
import { Crews } from "./_components/Crews";
import { usePathname } from "next/navigation";
import { NotificationComponent } from "@/components/(inputs)/NotificationComponent";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";
import { NewTab } from "@/components/(reusable)/newTabs";

export default function Search() {
  const [activeTab, setActiveTab] = useState(1);
  const [employees, setEmployees] = useState<SearchUser[]>([]);
  const [filter, setFilter] = useState("all");
  const [crew, setCrew] = useState<SearchCrew[]>([]);
  const pathname = usePathname(); // Get current route
  const { notification } = useNotification();
  const t = useTranslations("Admins");
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesRes = await fetch(
          "/api/getAllEmployees?filter=" + filter
        );
        const employeesData = await employeesRes.json();
        // const validatedEmployees = employeesSchema.parse(employeesData);
        setEmployees(employeesData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(`${t("ZodError")}`, error.errors);
        } else {
          console.error(`${t("FailedToFetch")} ${t("EmployeesData")}`, error);
        }
      }
    };

    fetchEmployees();
  }, [filter, notification, t]);

  useEffect(() => {
    const fetchCrews = async () => {
      try {
        const crewRes = await fetch("/api/getAllCrews", {
          next: { tags: ["crews"] },
        });
        const crewData = await crewRes.json();
        // const validatedEmployees = employeesSchema.parse(employeesData);
        setCrew(crewData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(t("ZodError"), error.errors);
        } else {
          console.error(`${t("FailedToFetch")} ${t("EmployeesData")}`, error);
        }
      }
    };

    fetchCrews();
  }, [pathname, notification, t]); // Trigger the effect when the route changes

  useEffect(() => {
    const tabMapping: { [key: string]: number } = {
      "/admins/personnel/timesheets": 2,
      "/admins/personnel/crew": 3,
    };

    const matchedTab = Object.keys(tabMapping).find((key) =>
      pathname.startsWith(key)
    );

    setActiveTab(matchedTab ? tabMapping[matchedTab] : 1);
  }, [pathname]);

  return (
    <Holds className="h-full ">
      <NotificationComponent />
      <Grids rows={"10"}>
        <Holds position={"row"} className="row-span-1 h-full gap-1">
          <NewTab
            onClick={() => setActiveTab(1)}
            isActive={activeTab === 1}
            isComplete={true}
            titleImage="/person.svg"
            titleImageAlt=""
          >
            {t("Personnel")}
          </NewTab>
          <NewTab
            onClick={() => setActiveTab(2)}
            isActive={activeTab === 2}
            isComplete={true}
            titleImage="/form.svg"
            titleImageAlt=""
          >
            {t("TimeSheets")}
          </NewTab>
          <NewTab
            onClick={() => setActiveTab(3)}
            isActive={activeTab === 3}
            isComplete={true}
            titleImage="/team.svg"
            titleImageAlt=""
          >
            {t("Crews")}
          </NewTab>
        </Holds>

        <Holds
          background={"white"}
          className="rounded-t-none row-span-9 h-full"
        >
          <Contents width={"section"} className=" pt-3 pb-5">
            {activeTab === 1 && (
              <Personnel employees={employees} setFilter={setFilter} />
            )}
            {activeTab === 2 && (
              <Timesheets employees={employees} setFilter={setFilter} />
            )}
            {activeTab === 3 && <Crews crew={crew} />}
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
