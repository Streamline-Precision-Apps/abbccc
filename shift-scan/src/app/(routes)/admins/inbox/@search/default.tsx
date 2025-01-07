"use client";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { useEffect, useState } from "react";
import { z } from "zod";
import { NotificationComponent } from "@/components/(inputs)/NotificationComponent";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";
import { InboxContent } from "./_components/Inbox";

export type TimeRequest = {
  id: string;
  requestedStartDate: string;
  requestedEndDate: string;
  status: string;
  employee: {
    lastName: string;
    firstName: string;
    image: string;
  };
};
export default function Search() {
  const [employees, setEmployees] = useState<TimeRequest[]>([]);
  const [filter, setFilter] = useState("pending");
  const { notification } = useNotification();
  const t = useTranslations("Admins");
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeesRes = await fetch(
          "/api/getAllTimeoffRequest?filter=" + filter
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

  return (
    <Holds className="h-full ">
      <NotificationComponent />
      <Grids rows={"10"}>
        <Holds
          background={"white"}
          className="rounded-t-none row-span-10 h-full"
        >
          <Contents width={"section"} className=" pt-3 pb-5">
            <InboxContent employees={employees} setFilter={setFilter} />
          </Contents>
        </Holds>
      </Grids>
    </Holds>
  );
}
