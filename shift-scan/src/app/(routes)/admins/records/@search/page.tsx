"use client";

import { NotificationComponent } from "@/components/(inputs)/NotificationComponent";

import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";

import CustomForms from "./_component/CustomForms";
import { NewTab } from "@/components/(reusable)/newTabs";
import { Titles } from "@/components/(reusable)/titles";
import { useEffect, useState } from "react";
import ExportForms from "./_component/ExportForms";
import { usePathname } from "next/navigation";
import { useNotification } from "@/app/context/NotificationContext";
import { useTranslations } from "next-intl";
import { z } from "zod";

type Forms = {
  id: string;
  name: string;
  description: string;
};

export default function ReportSearch() {
  const [isActive, setIsActive] = useState(1);
  const [forms, setForms] = useState<Forms[]>([]);
  const pathname = usePathname(); // Get current route
  const { notification } = useNotification();
  const t = useTranslations("Admins");

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const crewRes = await fetch("/api/getAllForms", {
          next: { tags: ["forms"] },
        });
        const formData = await crewRes.json();
        // const validatedEmployees = employeesSchema.parse(employeesData);
        setForms(formData);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(t("ZodError"), error.errors);
        } else {
          console.error(`${t("FailedToFetch")} ${t("EmployeesData")}`, error);
        }
      }
    };

    fetchForms();
  }, [pathname, notification, t]); // Trigger the effect when the route changes

  return (
    <>
      <NotificationComponent />
      <Grids rows={"10"} className="w-full h-full">
        <Holds
          position={"row"}
          className="row-start-1 row-end-2  rounded-b-none "
        >
          <NewTab
            titleImage="/export.svg"
            titleImageAlt="Export Image"
            isComplete={true}
            isActive={isActive === 1}
            onClick={() => setIsActive(1)}
          >
            <Titles size={"h4"}>Export Forms</Titles>
          </NewTab>
          <NewTab
            titleImage="/form.svg"
            titleImageAlt="Form Selection"
            isComplete={true}
            isActive={isActive === 2}
            onClick={() => setIsActive(2)}
          >
            <Titles size={"h4"}>Forms</Titles>
          </NewTab>
        </Holds>
        <Holds
          background={"white"}
          className="row-start-2 row-end-11 h-full w-full p-4 rounded-t-none"
        >
          {isActive === 1 && <ExportForms />}
          {isActive === 2 && <CustomForms forms={forms} setForms={setForms} />}
        </Holds>
      </Grids>
    </>
  );
}
