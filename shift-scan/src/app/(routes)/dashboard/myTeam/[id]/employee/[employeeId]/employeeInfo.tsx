"use client";
import Spinner from "@/components/(animations)/spinner";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";

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

export default function EmployeeInfo({
  employee,
  contacts,
  loading,
}: {
  employee: Employee | null;
  contacts: Contact | null;
  loading: boolean;
}) {
  const t = useTranslations("MyTeam");
  return (
    <Contents width={"section"} className="pt-2 pb-5">
      {loading ? (
        <Holds
          background={"white"}
          className="h-full justify-center items-center animate-pulse"
        >
          <Spinner size={70} />
        </Holds>
      ) : (
        <Holds background={"white"} className="h-full w-full">
          <Holds
            size={"40"}
            className="flex justify-center items-center relative "
          >
            <Images
              titleImg={
                employee?.image ? employee.image : "/profile-default.svg"
              }
              titleImgAlt="Team"
              className="rounded-full border-[3px] border-black "
            />
            <Holds
              background={employee?.id ? "green" : "red"}
              className="absolute top-1 right-3 w-6 h-6 rounded-full p-1.5 border-[3px] border-black"
            />
          </Holds>
          <Labels htmlFor={"phoneNumber"} size={"p4"}>
            {t("PhoneNumber")}
          </Labels>
          <Inputs
            name={"phoneNumber"}
            className={"text-center text-base"}
            data={contacts?.phoneNumber}
            readOnly
          />
          <Labels htmlFor={"email"} size={"p4"}>
            {t("Email")}
          </Labels>
          <Inputs
            name={"email"}
            className={"text-center text-base"}
            data={employee?.email}
            readOnly
          />
          <Labels htmlFor={"emergencyContact"} size={"p4"}>
            {t("EmergencyContact")}
          </Labels>
          <Inputs
            name={"emergencyContact"}
            className={"text-center text-base"}
            readOnly
            data={contacts?.emergencyContact}
          />
          <Labels htmlFor={"emergencyContactNumber"} size={"p4"}>
            {t("EmergencyContactNumber")}
          </Labels>
          <Inputs
            name={"emergencyContactNumber"}
            className={"text-center text-base"}
            readOnly
            data={contacts?.emergencyContactNumber}
          />
          <Labels htmlFor={"dob"} size={"p4"}>
            {t("DOB")}
            <Inputs
              name={"dob"}
              className={"text-center text-base"}
              readOnly
              data={employee?.DOB}
            />
          </Labels>
        </Holds>
      )}
    </Contents>
  );
}
