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

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  image?: string;
  DOB?: string;
  contacts?: Contact[]; // Employee can have a list of contacts
};

type Contact = {
  phoneNumber: string;
  email: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;
};

export default function EmployeeInfo({ employeeId }: { employeeId: string }) {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [contacts, setContacts] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const t = useTranslations("MyTeam");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetch(`/api/getUserInfo/${employeeId}`);
        const res = await data.json();
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
        <Holds background={"white"} className="h-full ">
          <Contents width={"section"}>
            <Grids rows={"5"} className="my-5 h-full">
              <Holds className="h-full row-span-1">
                <Holds className="h-[20px] row-span-1"></Holds>
                <Spinner />
                <Holds className="h-[20px] row-span-1"></Holds>
                <Holds className="h-[20px] row-span-1"></Holds>
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
