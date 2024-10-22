"use client";
import React from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { createUser } from "@/actions/userActions";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";

import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";

const AddEmployeeForm = () => {
  const t = useTranslations("admin");

  // const handleChange = (
  //   e: React.ChangeEvent<
  //     HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  //   >
  // ) => {};

  return (
    <Forms action={createUser}>
      <Labels type="title">{t("FirstName")}</Labels>
      <Inputs variant="default" id="firstName" name="firstName" type="text" />

      <Labels type="title">{t("LastName")}</Labels>
      <Inputs variant="default" id="lastName" name="lastName" type="text" />

      <Labels type="title">{t("Username")}</Labels>
      <Inputs variant="default" id="username" name="username" type="text" />

      <Labels type="title">{t("email")}</Labels>
      <Inputs variant="default" id="email" name="email" type="email" />

      <Labels type="title">{t("Password")}</Labels>
      <Inputs variant="default" id="password" name="password" type="password" />

      <Labels type="title">{t("DOB")}</Labels>
      <Inputs variant="default" id="DOB" name="DOB" type="date" />

      <Labels type="title">{t("TruckView")}</Labels>
      <Selects id="truckView" name="truckView">
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>

      <Labels type="title">{t("TascoView")}</Labels>
      <Selects id="tascoView" name="tascoView">
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>

      <Labels type="title">{t("LaborView")}</Labels>
      <Selects id="laborView" name="laborView">
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>

      <Labels type="title">{t("MechanicView")}</Labels>
      <Selects id="mechanicView" name="mechanicView">
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>

      <Labels type="title">{t("Permission")}</Labels>
      <Selects variant="default" id="permission" name="permission">
        <Options value="">{t("Select")}</Options>
        <Options value="USER">{t("User")}</Options>
        <Options value="MANAGER">{t("Manager")}</Options>
        <Options value="PROJECTMANAGER">{t("ProjectManager")}</Options>
        <Options value="ADMIN">{t("Admin")}</Options>
        <Options value="SUPERADMIN">{t("SuperAdmin")}</Options>
      </Selects>

      <Labels type="title">{t("Email")}</Labels>
      <Inputs variant="default" id="email" name="email" type="email" />

      <Labels type="title">{t("Phone")}</Labels>
      <Inputs variant="default" id="phone" name="phone" type="text" />

      <Buttons background="green" type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
};

export default AddEmployeeForm;
