"use client";
import { Input } from "@nextui-org/react";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import Base64Encoder from "@/components/(inputs)/Base64Encoder";
import { useState } from "react";
import { Titles } from "@/components/(reusable)/titles";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string | null;
};

type Props = {
  employee: Employee;
  contacts: any;
  training: any;
};

export default function EmployeeInfo({ employee, contacts, training }: Props ) {
  const t = useTranslations("Hamburger");
  const [base64String, setBase64String] = useState<string>('');
  
  const total = (Number(training?.assigned_trainings));
  const completed = (Number(training?.completed_trainings));
  console.log(total + " " + completed) 

  const completionStatus = (completed / total);
  console.log(completionStatus)

  const completionPercentage = (completionStatus * 100).toFixed(0);
  console.log(completionPercentage)

  return (
    <div>
      <Sections size={"titleBox"}>
        <img src={employee?.image ?? ''} alt="Selected" style={{ maxWidth: '10%', height: 'auto', margin: 'auto' }} />
        <Titles variant={"default"} size={"h1"}>{employee?.firstName ?? ''} {employee?.lastName ?? ''}</Titles>
      </Sections>
      <Base64Encoder employee={employee} base64String={base64String} setBase64String={setBase64String}  />
      <Sections size={"dynamic"}>
        <form action="" className=" p-5 mx-10 flex flex-col gap-5">
          <div className="flex flex-col justify-center gap-1 items-center">
            <label htmlFor="">{t("EmployeeID")}</label>
            <Input
              isDisabled
              type="text"
              defaultValue={employee?.id?.toString() ?? ''}
              className="border-2 border-black rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 items-center">
            <label htmlFor="">{t("ContactEmail")}</label>
            <Input
              isDisabled
              type="email"
              defaultValue={contacts?.email ?? ''}
              className="border-2 border-black rounded-md"
            />
          </div>
          <div className="flex flex-col justify-center gap-3 items-center">
            <label htmlFor="">{t("ContactPhone#")}</label>
            <Input
              isDisabled
              type="tel"
              defaultValue={contacts?.phone_number ?? ''}
              className="border-2 border-black rounded-md"
            />
          </div>
          <div className="flex flex-col w-full justify-center gap-3 items-center">
            <label htmlFor="">{t("SafetyTraining")}</label>
            <div
              className={`${completionStatus * 10 > 100 ? 'bg-green-500 w-full': 'bg-white w-full border-2 border-black ' }`}
            >
              <div style={{ width: `${completionPercentage}%`}} className="bg-app-orange">
                <h1>{completionPercentage}% </h1>
              <Input
                isDisabled
                type="text"
                className={" rounded-md"}
                style={{ width: `${completionPercentage}%` , padding: "5px", margin: "0px"}}
                />
                </div>
            </div>
          </div>
        </form>
      </Sections>
    </div>
  );
}