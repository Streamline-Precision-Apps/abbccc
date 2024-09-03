"use client";
import { image, Input } from "@nextui-org/react";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useTranslations } from "next-intl";
import Base64Encoder from "@/components/(inputs)/Base64Encoder";
import { useState } from "react";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";
import {Forms} from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { Texts } from "@/components/(reusable)/texts";
import SignOutModal from './signOutModal';
import { Modals } from "@/components/(reusable)/modals";
import { Buttons } from "@/components/(reusable)/buttons";
import { Images } from "@/components/(reusable)/images";
import CameraComponent from "@/components/(inputs)/camera";

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

  // logic to get number of completed trainings
  const total = (Number(training?.assigned_trainings));
  const completed = (Number(training?.completed_trainings));

  // logic to get completion percentage
  const completionStatus = (completed / total);
  const completionPercentage = (completionStatus * 100).toFixed(0);
  const [isOpen, setIsOpen] = useState(false);

//Testing v v v
  // const completionPercentage = (90).toFixed(0);
  return (
  <Contents size={"default"} variant={"default"}>
  <Sections size={"titleBox"}>
{/*This Title box allows the profile pic to default as a base profile picture*/}
      <TitleBoxes type="profilePic" title={`${employee?.firstName} ${employee?.lastName}`} titleImg={employee?.image !== null ? `${employee?.image}` : "/profile.svg"}  titleImgAlt={"image"}  >
        <Contents size={"editBtn"} variant={"clear"} onClick={() => setIsOpen(true) } >
        <Images titleImg={"/edit.svg"} titleImgAlt={"Edit tool"} variant={"editIcon"} size={"editIcon"} onClick={() => setIsOpen(true)}/>
        </Contents>
      </TitleBoxes>
  </Sections>
  
  <Modals 
  handleClose={() => {setIsOpen(false); setBase64String('');}} 
  type="base64" variant={"default"} size={"lg"} isOpen={isOpen}>
    <Base64Encoder employee={employee} base64String={base64String} setBase64String={setBase64String} setIsOpen={setIsOpen}  />
  </Modals>
    <Sections size={"default"}>
      <Forms>
        <Labels variant="default">{t("EmployeeID")}</Labels>
          <Inputs
            disabled
            type="text"
            defaultValue={employee?.id?.toString() ?? ''}
          />
        <Labels>{t("ContactEmail")}</Labels>
          <Inputs
            disabled
            type="email"
            defaultValue={contacts?.email ?? ''}
          />
        <Labels>{t("ContactPhone#")}</Labels>
          <Inputs
            disabled
            type="tel"
            defaultValue={contacts?.phone_number ?? ''}
          />
        <Labels>{t("SafetyTraining")}</Labels>
        <Contents size={null} variant={"safetyTrainingBar"}>
          <Contents size={null} style={{ width: `${completionPercentage}%`}} className={Number(completionPercentage) === 100 ? "bg-app-green rounded-r-lg border-2 border-app-green" : "bg-app-orange rounded-r-lg border-2 border-app-orange"}>
            <Texts size={"p3"}>{completionPercentage}%</Texts>
          </Contents>
        </Contents>
      </Forms>
        <SignOutModal />
      </Sections>
  </Contents>
);
}