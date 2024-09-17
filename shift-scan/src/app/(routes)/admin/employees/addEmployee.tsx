import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { createUser } from "@/actions/userActions";
import { Forms } from "@/components/(reusable)/forms";
import { Labels } from "@/components/(reusable)/labels";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";

const AddEmployeeForm = () => {
const t = useTranslations("admin");

const handleChange = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >
) => {};

return (
  <Forms action={createUser}>
      <Labels size="default" type="title">
        {t("FirstName")}
      </Labels>
      <Inputs
        variant="default"
        id="firstName"
        name="firstName"
        type="text"
      />
    
    
      <Labels size="default" type="title">
        {t("LastName")}
      </Labels>
      <Inputs
        variant="default"
        id="lastName"
        name="lastName"
        type="text"
        
      />
    
    
      <Labels size="default" type="title">
        {t("Username")}
      </Labels>
      <Inputs
        variant="default"
        id="username"
        name="username"
        type="text"
        
      />
    
    
      <Labels size="default" type="title">
        {t("Password")}
      </Labels>
      <Inputs
        variant="default"
        id="password"
        name="password"
        type="password"
        
      />
    
    
      <Labels size="default" type="title">
        {t("DOB")}
      </Labels>
      <Inputs
        variant="default"
        id="DOB"
        name="DOB"
        type="date"
        
      />
    
    
      <Labels size="default" type="title">
        {t("TruckView")}
      </Labels>
      <Selects
        id="truck_view"
        name="truck_view"
        onChange={handleChange}
        
      >
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>
    
    
      <Labels size="default" type="title">
        {t("TascoView")}
      </Labels>
      <Selects
        id="tasco_view"
        name="tasco_view"
        onChange={handleChange}
        
      >
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>
    
    
      <Labels size="default" type="title">
        {t("LaborView")}
      </Labels>
      <Selects
        id="labor_view"
        name="labor_view"
        onChange={handleChange}
        
      >
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>
    
    
      <Labels size="default" type="title">
        {t("MechanicView")}
      </Labels>
      <Selects
        id="mechanic_view"
        name="mechanic_view"
        onChange={handleChange}
        
      >
        <Options value="">{t("Select")}</Options>
        <Options value="TRUE">{t("True")}</Options>
        <Options value="FALSE">{t("False")}</Options>
      </Selects>
    
    
      <Labels size="default" type="title">
        {t("Permission")}
      </Labels>
      <Selects
        variant="default"
        id="permission"
        name="permission"
        onChange={handleChange}
        
      >
        <Options value="">{t("Select")}</Options>
        <Options value="USER">{t("User")}</Options>
        <Options value="MANAGER">{t("Manager")}</Options>
        <Options value="PROJECTMANAGER">{t("ProjectManager")}</Options>
        <Options value="ADMIN">{t("Admin")}</Options>
        <Options value="SUPERADMIN">{t("SuperAdmin")}</Options>
      </Selects>
    
    
      <Labels size="default" type="title">
        {t("Email")}
      </Labels>
      <Inputs
        variant="default"
        id="email"
        name="email"
        type="email"
        
      />
    
    
      <Labels size="default" type="title">
        {t("Phone")}
      </Labels>
      <Inputs
        variant="default"
        id="phone"
        name="phone"
        type="text"
        
      />
    
    <Buttons variant="green" type="submit">
      {t("Submit")}
    </Buttons>
  </Forms>
);
};

export default AddEmployeeForm;
