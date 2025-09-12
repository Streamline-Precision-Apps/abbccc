"use client";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  DOB?: Date;
  clockedIn?: boolean;
};

type Contact = {
  phoneNumber: string;
  emergencyContact?: string;
  emergencyContactNumber?: string;
};

import Spinner from "@/components/(animations)/spinner";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Holds } from "@/components/(reusable)/holds";
import { Images } from "@/components/(reusable)/images";
import { Inputs } from "@/components/(reusable)/inputs";
import { Labels } from "@/components/(reusable)/labels";
import { Texts } from "@/components/(reusable)/texts";
import { formatPhoneNumber } from "@/utils/phoneNumberFormater";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { PhoneCall } from "lucide-react";

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
          <Holds className="flex justify-center items-center relative w-24 h-24 ">
            <Images
              titleImg={employee?.image ? employee.image : "/profileFilled.svg"}
              titleImgAlt="Team"
              className="rounded-full border-[3px] border-black "
            />
            <Holds
              background={employee?.clockedIn ? "green" : "red"}
              className="absolute top-1 right-3 w-6 h-6 rounded-full p-1.5 border-[3px] border-black"
            />
          </Holds>
          <Labels htmlFor={"phoneNumber"} size={"sm"}>
            {t("PhoneNumber")}
          </Labels>
          <div className="w-full h-11 flex justify-center items-center gap-2 border-black border-[3px] rounded-[10px] relative ">
            <Texts className="text-center text-sm ">
              {formatPhoneNumber(contacts?.phoneNumber)}
            </Texts>
            <Buttons
              className="w-10 h-10 rounded-r-none rounded-l-[8px] border-none  flex justify-center items-center absolute left-0"
              shadow={"none"}
              href={`tel:${contacts?.phoneNumber}`}
              background={"darkBlue"}
            >
              <PhoneCall color="white" />
            </Buttons>
          </div>
          <Labels htmlFor={"email"} size={"sm"}>
            {t("Email")}
          </Labels>
          <Inputs
            name={"email"}
            className={"text-center text-sm"}
            value={employee?.email}
            readOnly
          />
          <Labels htmlFor={"emergencyContact"} size={"sm"}>
            {t("EmergencyContact")}
          </Labels>
          <Inputs
            name={"emergencyContact"}
            className={"text-center text-sm"}
            readOnly
            value={contacts?.emergencyContact}
          />
          <Labels htmlFor={"emergencyContactNumber"} size={"sm"}>
            {t("EmergencyContactNumber")}
          </Labels>
          <div className="w-full h-11  flex justify-center items-center gap-2 border-black border-[3px] rounded-[10px] relative ">
            <Texts className="text-center text-sm ">
              {formatPhoneNumber(contacts?.emergencyContactNumber)}
            </Texts>
            <Buttons
              className="w-10 h-10 rounded-r-none rounded-l-[8px] border-none flex justify-center items-center absolute left-0"
              shadow={"none"}
              href={`tel:${contacts?.emergencyContactNumber}`}
              background={"darkBlue"}
            >
              <PhoneCall color="white" />
            </Buttons>
          </div>

          <Labels htmlFor={"dob"} size={"sm"}>
            {t("DOB")}
            <Inputs
              name={"dob"}
              className={"text-center text-sm"}
              readOnly
              value={
                employee?.DOB
                  ? format(new Date(employee?.DOB), "MM/dd/yyyy")
                  : ""
              }
            />
          </Labels>
        </Holds>
      )}
    </Contents>
  );
}
