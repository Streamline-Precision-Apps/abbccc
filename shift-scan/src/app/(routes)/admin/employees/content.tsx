"use client";
import { useTranslations } from "next-intl";
import "@/app/globals.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bases } from "@/components/(reusable)/bases";
import { Holds } from "@/components/(reusable)/holds";
import { Titles } from "@/components/(reusable)/titles";
import { Banners } from "@/components/(reusable)/banners";
import { Footers } from "@/components/(reusable)/footers";
import { Grids } from "@/components/(reusable)/grids";
import { setAuthStep } from "@/app/api/auth";
import { CustomSession, SearchUser, User } from "@/lib/types";
import { useSession } from "next-auth/react";
import AddEmployeeForm from "./addEmployee";
import UserManagement from "./(components)/userManagement";

import { Tab } from "@/components/(reusable)/tab";
import { Contents } from "@/components/(reusable)/contents";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import UserCards from "./userCards";
import { Texts } from "@/components/(reusable)/texts";
import Spinner from "@/components/(animations)/spinner";
import { z } from "zod";

export default function AddEmployeeContent() {
  const t = useTranslations("admin");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<any>([]);
  const router = useRouter();
  const [user, setData] = useState<User>({
    id: "",
    firstName: "",
    lastName: "",
    permission: undefined,
  });
  const { data: session } = useSession() as { data: CustomSession | null };
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
  });
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    if (session && session.user) {
      setData({
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        permission: session.user.permission,
      });
    }
  }, [session]);

  //----------------------------Validation For Data-------------------------------------
  const employeesSchema = z.array(
    z.object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      username: z.string(),
      permission: z.string(),
      DOB: z.string(),
      truckView: z.boolean(),
      mechanicView: z.boolean(),
      laborView: z.boolean(),
      tascoView: z.boolean(),
      image: z.string(),
      terminationDate: z.preprocess((arg) => {
        if (typeof arg === "string" && arg.trim() !== "") {
          const parsedDate = new Date(arg);
          if (!isNaN(parsedDate.getTime())) {
            return parsedDate;
          }
        } else if (arg instanceof Date && !isNaN(arg.getTime())) {
          return arg;
        }
        // Return null for invalid or missing dates
        return null;
      }, z.union([z.date(), z.null()])),
    })
  );

  //----------------------------Data Fetching-------------------------------------
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const employeesRes = await fetch("/api/getAllEmployees");
      const employeesData = await employeesRes.json();
      const validatedEmployees = employeesSchema.parse(employeesData);
      setEmployees(validatedEmployees);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation Error:", error.errors);
      } else {
        console.error("Failed to fetch employees data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  if (loading) {
    return (
      <Grids className="grid-rows-7 gap-5 ">
        <Holds
          size={"full"}
          background={"white"}
          className="row-span-2 h-full "
        ></Holds>
        <Holds
          size={"full"}
          background={"white"}
          className="row-span-5 h-full "
        >
          <Contents width={"section"}>
            <Texts> {t("Loading")} </Texts>
            <Spinner />
          </Contents>
        </Holds>
      </Grids>
    );
  }

  return session ? (
    <>
      <Grids rows={"10"} gap={"5"}>
        <Holds background={"white"} className="row-span-1 h-full">
          <TitleBoxes
            title="Assets"
            titleImg="/assets.svg"
            titleImgAlt="Assests"
            size={"default"}
            type="noIcon"
          />
        </Holds>

        <Holds className="row-span-9 h-full">
          <Holds position={"row"}>
            <Tab
              onClick={() => setActiveTab(1)}
              tabLabel={t("ModifyEmployee")}
              isTabActive={activeTab === 1}
            />
            <Tab
              onClick={() => setActiveTab(2)}
              tabLabel={t("ViewEmployees")}
              isTabActive={activeTab === 2}
            />
          </Holds>
          {activeTab === 1 && <UserManagement users={employees} />}
          {activeTab === 2 && <UserCards users={employees} />}
        </Holds>
      </Grids>
    </>
  ) : (
    <></>
  );
}
