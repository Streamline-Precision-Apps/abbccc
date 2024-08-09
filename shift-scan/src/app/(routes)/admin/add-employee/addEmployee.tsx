import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { useTranslations } from "next-intl";
import { createUser } from "@/actions/userActions";

const AddEmployeeForm = () => {
  const t = useTranslations("admin");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {};

  return (
    <form action={createUser} className="space-y-4">
      <div>
        <label htmlFor="firstName" className="block">
          {t("FirstName")}
        </label>
        <input
          id="firstName"
          name="firstName"
          type="text"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="lastName" className="block">
          {t("LastName")}
        </label>
        <input
          id="lastName"
          name="lastName"
          type="text"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="username" className="block">
          {t("Username")}
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="password" className="block">
          {t("Password")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="DOB" className="block">
          {t("DOB")}
        </label>
        <input
          id="DOB"
          name="DOB"
          type="date"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="truck_view" className="block">
          {t("TruckView")}
        </label>
        <select
          id="truck_view"
          name="truck_view"
          onChange={handleChange}
          className="block w-full border border-black rounded p-2"
        >
          <option value="">{t("Select")}</option>
          <option value="TRUE">{t("True")}</option>
          <option value="FALSE">{t("False")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="tasco_view" className="block">
          {t("TascoView")}
        </label>
        <select
          id="tasco_view"
          name="tasco_view"
          onChange={handleChange}
          className="block w-full border border-black rounded p-2"
        >
          <option value="">{t("Select")}</option>
          <option value="TRUE">{t("True")}</option>
          <option value="FALSE">{t("False")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="labor_view" className="block">
          {t("LaborView")}
        </label>
        <select
          id="labor_view"
          name="labor_view"
          onChange={handleChange}
          className="block w-full border border-black rounded p-2"
        >
          <option value="">{t("Select")}</option>
          <option value="TRUE">{t("True")}</option>
          <option value="FALSE">{t("False")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="mechanic_view" className="block">
          {t("MechanicView")}
        </label>
        <select
          id="mechanic_view"
          name="mechanic_view"
          onChange={handleChange}
          className="block w-full border border-black rounded p-2"
        >
          <option value="">{t("Select")}</option>
          <option value="TRUE">{t("True")}</option>
          <option value="FALSE">{t("False")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="permission" className="block">
          {t("Permission")}
        </label>
        <select
          id="permission"
          name="permission"
          onChange={handleChange}
          className="block w-full border border-black rounded p-2"
        >
          <option value="">{t("Select")}</option>
          <option value="USER">{t("User")}</option>
          <option value="MANAGER">{t("Manager")}</option>
          <option value="PROJECTMANAGER">{t("ProjectManager")}</option>
          <option value="ADMIN">{t("Admin")}</option>
          <option value="SUPERADMIN">{t("SuperAdmin")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="email" className="block">
          {t("Email")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block">
          {t("Phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="text"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <Buttons variant="green" size="default" type="submit">
        {t("Submit")}
      </Buttons>
    </form>
  );
};

export default AddEmployeeForm;
