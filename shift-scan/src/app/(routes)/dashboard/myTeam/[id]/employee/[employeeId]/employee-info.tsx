"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Grids } from "@/components/(reusable)/grids";
import Spinner from "@/components/(animations)/spinner";
import { z } from "zod";

// Zod schema for params
const ParamsSchema = z.object({
  employeeId: z.string(),
});

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

export default function employeeInfo({
  params,
}: {
  params: { employeeId: string };
}) {
  // Validate params using Zod
  try {
    ParamsSchema.parse(params);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation error in params:", error.errors);
    }
  }

  const t = useTranslations("MyTeam");
  const [employee, setEmployee] = useState<any>({});
  const [contacts, setContacts] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetch(`/api/getUserInfo/${params.employeeId}`);
        const res = await data.json();

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
  }, [params.employeeId]);

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
