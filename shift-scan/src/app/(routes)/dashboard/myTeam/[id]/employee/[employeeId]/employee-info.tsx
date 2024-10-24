"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { z } from "zod";
import { useParams } from "next/navigation";

// Zod schema for employee data
const EmployeeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  DOB: z.string().optional(),
  image: z.string().nullable().optional(),
  contacts: z
    .array(
      z.object({
        phoneNumber: z.string().optional(),
        email: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyContactNumber: z.string().optional(),
      })
    )
    .optional(),
});

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  DOB?: string;
  contacts?: Contact[]; // Employee can have a list of contacts
};

type Contact = {
  phoneNumber: string;
  email: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;
};

export default function EmployeeInfo() {
  // Changed to EmployeeInfo
  // Validate params using Zod
  const { employeeId } = useParams();
  const t = useTranslations("MyTeam");
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [contacts, setContacts] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetch(`/api/getUserInfo/${employeeId}`);
        const res = await data.json();
        console.log(res);

        // Validate fetched data using Zod
        try {
          EmployeeSchema.parse(res);
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error("Validation error in employee data:", error.errors);
          }
        }

        if (res.error) {
          console.error(res.error);
        } else {
          setEmployee(res);
          if (res.contacts && res.contacts.length > 0) {
            setContacts(res.contacts[0]);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [employeeId]);

  return (
    <>
      <Holds background={"white"} className="mb-5">
        <Contents width={"section"}>
          <TitleBoxes
            title={
              loading
                ? "loading..."
                : `${employee?.firstName} ${employee?.lastName}`
            }
            titleImg={employee?.image ?? "/profile-default.svg"}
            titleImgAlt="Team"
            type="myTeamProfile"
            title2={loading ? "" : `${t("ID")}${employee?.id}`}
          />
        </Contents>
      </Holds>

      {loading ? (
        <Holds background={"white"} className="h-full">
          <Contents width={"section"}>
            <Grids rows={"5"} className="my-5 h-full">
              <Holds className="h-full row-span-1">
                <Holds className="h-[20px] row-span-1"></Holds>
                <Spinner />
                <Holds className="h-[20px] row-span-1"></Holds>
              </Holds>
            </Grids>
          </Contents>
        </Holds>
      ) : (
        <Holds background={"white"} className="h-full my-auto">
          <Contents width={"section"}>
            <Grids rows={"5"} gap={"5"} className="my-5">
              <Labels className="row-span-1 h-full">
                {t("PhoneNumber")}
                <Inputs state="disabled" data={contacts?.phoneNumber}></Inputs>
              </Labels>
              <Labels className="row-span-1 h-full">
                {t("Email")}
                <Inputs state="disabled" data={contacts?.email}></Inputs>
              </Labels>
              <Labels className="row-span-1 h-full">
                {t("EmergencyContact")}
                <Inputs
                  state="disabled"
                  data={contacts?.emergencyContact}
                ></Inputs>
              </Labels>
              <Labels className="row-span-1 h-full">
                {t("EmergencyContactNumber")}
                <Inputs
                  state="disabled"
                  data={contacts?.emergencyContactNumber}
                ></Inputs>
              </Labels>
              <Labels className="row-span-1 h-full">
                {t("DOB")}
                <Inputs state="disabled" data={employee?.DOB}></Inputs>
              </Labels>
            </Grids>
          </Contents>
        </Holds>
      )}
    </>
  );
}
