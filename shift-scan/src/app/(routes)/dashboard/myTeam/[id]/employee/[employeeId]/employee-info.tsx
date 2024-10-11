"use client";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { set } from "zod";

export default function employeeInfo({
  params,
}: {
  params: { employeeId: string };
}) {
  const t = useTranslations("MyTeam");
  const [employee, setEmployee] = useState<any>([]);
  const [contacts, setContacts] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch(`/api/getUserInfo/${params.employeeId}`);
      const res = await data.json();
      console.log(res);
      setEmployee(res);
      setContacts(res);
      console.log(contacts);
    };
    fetchData();
  }, [params.employeeId]);

  return (
    <Contents>
      <Holds background={"white"} className="mb-3">
        <TitleBoxes
          title={`${employee?.firstName} ${employee?.lastName}`}
          titleImg={employee?.image ?? "/johnDoe.webp"}
          titleImgAlt="Team"
          type="profilePic"
        />
      </Holds>
      <Holds background={"white"}>
        <Contents width={"section"}>
          <Forms>
            <Labels>
              {t("PhoneNumber")}
              <Inputs state="disabled" data={contacts.phoneNumber}></Inputs>
            </Labels>
            <Labels>
              {t("Email")}
              <Inputs state="disabled" data={contacts?.email}></Inputs>
            </Labels>
            <Labels>
              {t("EmergencyContact")}
              <Inputs
                state="disabled"
                data={contacts?.emergencyContact}
              ></Inputs>
            </Labels>
            <Labels>
              {t("EmergencyContactNumber")}
              <Inputs
                state="disabled"
                data={contacts?.emergencyContactNumber}
              ></Inputs>
            </Labels>
            <Labels>
              {t("DOB")}
              <Inputs state="disabled" data={employee?.DOB}></Inputs>
            </Labels>
          </Forms>
        </Contents>
      </Holds>
    </Contents>
  );
}
