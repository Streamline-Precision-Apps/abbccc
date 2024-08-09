import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { createEquipment } from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";

interface AddEquipmentFormProps {
  base64String: string | null;
}

const AddEquipmentForm: React.FC<AddEquipmentFormProps> = ({ base64String }) => {
  const [equipmentTag, setEquipmentTag] = useState("EQUIPMENT");
  const t = useTranslations("addEquipmentForm");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setEquipmentTag(e.target.value);
  };

  useEffect(() => {
    console.log("Base64 String:", base64String);
  }, [base64String]);

  return (
    <form action={createEquipment} className="space-y-4">
      <div>
        <label htmlFor="equipment_tag" className="block">
          {t("Tag")}
        </label>
        <select
          id="equipment_tag"
          name="equipment_tag"
          onChange={handleChange}
          className="block w-full border border-black rounded p-2"
        >
          <option value="">{t("Select")}</option>
          <option value="TRUCK">{t("Truck")}</option>
          <option value="TRAILER">{t("Trailer")}</option>
          <option value="EQUIPMENT">{t("Equipment")}</option>
        </select>
      </div>
      <div>
        <label htmlFor="name" className="block">
          {t("Name")}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="description" className="block">
          {t("Description")}
        </label>
        <textarea
          id="description"
          name="description"
          className="block w-full border border-black rounded p-2"
        />
      </div>
      <div>
        <label htmlFor="equipment_status" className="block">
          {t("Status")}
        </label>
        <select
          id="equipment_status"
          name="equipment_status"
          className="block w-full border border-black rounded p-2"
        >
          <option value="">{t("Select")}</option>
          <option value="OPERATIONAL">{t("Operational")}</option>
          <option value="NEEDS_REPAIR">{t("NeedsRepair")}</option>
        </select>
      </div>
      {equipmentTag === "TRUCK" || equipmentTag === "TRAILER" ? (
        <>
          <div>
            <label htmlFor="make" className="block">
              {t("Make")}
            </label>
            <input
              id="make"
              name="make"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="model" className="block">
              {t("Model")}
            </label>
            <input
              id="model"
              name="model"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="year" className="block">
              {t("Year")}
            </label>
            <input
              id="year"
              name="year"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="license_plate" className="block">
              {t("LicensePlate")}
            </label>
            <input
              id="license_plate"
              name="license_plate"
              type="text"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="registration_expiration" className="block">
              {t("RegistrationExpiration")}
            </label>
            <input
              id="registration_expiration"
              name="registration_expiration"
              type="date"
              className="block w-full border border-black rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="mileage" className="block">
              {t("Mileage")}
            </label>
            <input
              id="mileage"
              name="mileage"
              type="number"
              className="block w-full border border-black rounded p-2"
            />
          </div>
        </>
      ) : null}
      <div>
        <input
          id="image"
          name="image"
          type="hidden"
          value={base64String || ""}
        />
      </div>
      <Buttons variant="green" size="default" type="submit">
        {t("Submit")}
      </Buttons>
    </form>
  );
};

export default AddEquipmentForm;
