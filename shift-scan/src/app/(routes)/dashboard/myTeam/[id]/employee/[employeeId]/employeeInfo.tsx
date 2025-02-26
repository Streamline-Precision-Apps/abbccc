"use client";
import Spinner from "@/components/(animations)/spinner";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
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
    <Contents width={"section"} className="py-5">
      {loading ? (
        <Holds
          background={"white"}
          className="h-full justify-center items-center animate-pulse"
        >
          <Spinner size={70} />
        </Holds>
      ) : (
        <Holds background={"white"} className="h-full my-auto">
          <Labels htmlFor={"phoneNumber"} size={"p6"}>
            {t("PhoneNumber")}
          </Labels>
          <Inputs
            name={"phoneNumber"}
            className={"pl-4"}
            state="disabled"
            data={contacts?.phoneNumber}
          />
          <Labels htmlFor={"email"} size={"p6"}>
            {t("Email")}
          </Labels>
          <Inputs
            name={"email"}
            className={"pl-4"}
            state="disabled"
            data={employee?.email}
          />
          <Labels htmlFor={"emergencyContact"} size={"p6"}>
            {t("EmergencyContact")}
          </Labels>
          <Inputs
            name={"emergencyContact"}
            className={"pl-4"}
            state="disabled"
            data={contacts?.emergencyContact}
          />
          <Labels htmlFor={"emergencyContactNumber"} size={"p6"}>
            {t("EmergencyContactNumber")}
          </Labels>
          <Inputs
            name={"emergencyContactNumber"}
            className={"pl-4"}
            state="disabled"
            data={contacts?.emergencyContactNumber}
          />
          <Labels htmlFor={"dob"} size={"p6"}>
            {t("DOB")}
            <Inputs
              name={"dob"}
              className={"pl-4"}
              state="disabled"
              data={employee?.DOB}
            />
          </Labels>
        </Holds>
      )}
    </Contents>
  );
}
