"use client";
import "@/app/globals.css";
import { useState } from "react";
import { Sections } from "@/components/(reusable)/sections";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import AddEquipmentForm from "./addEquipmentForm";
import EquipmentPicture from "../../../../../components/(inputs)/camera";
import { Bases } from "@/components/(reusable)/bases";
import { useTranslations } from "next-intl";
import { Titles } from "@/components/(reusable)/titles";
import { Contents } from "@/components/(reusable)/contents";

export const AddEquipmentContent = () => {
  const [base64String, setBase64String] = useState<string>("");
  const t = useTranslations("addEquipmentContent");

  return (
    <Bases>
      <Sections size={"titleBox"}>
        <TitleBoxes
          title={t("Title")}
          titleImg="/profile.svg"
          titleImgAlt="Team"
          variant={"default"}
          size={"default"}
        />
      </Sections>
      <Sections size={"dynamic"}>
        <Titles variant={"default"} size={"h1"}>{t("Picture")}</Titles>
        <EquipmentPicture setBase64String={setBase64String} />
      </Sections>
      <Sections size={"dynamic"}>
        <AddEquipmentForm base64String={base64String} />
      </Sections>
    </Bases>
  );
};
