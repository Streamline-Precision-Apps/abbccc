import React, { useState, useEffect } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { createEquipment } from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Labels } from "@/components/(reusable)/labels";

interface AddEquipmentFormProps {
  base64String: string | null;
}

const AddEquipmentForm: React.FC<AddEquipmentFormProps> = ({ base64String }) => {
  const [equipmentTag, setEquipmentTag] = useState("EQUIPMENT");
  const t = useTranslations("addEquipmentForm");

  const randomQrCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "EQ-";
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    console.log(result);
    return result;
  };

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
    <Forms action={createEquipment}>
      
      <Inputs id="qr_id" name="qr_id" type="hidden"  value={randomQrCode()} />
      
      
        <Labels variant="default" size="default">
          {t("Tag")}
        </Labels>
        <select
          id="equipment_tag"
          name="equipment_tag"
          onChange={handleChange}
        
        >
          <option value="">{t("Select")}</option>
          <option value="TRUCK">{t("Truck")}</option>
          <option value="TRAILER">{t("Trailer")}</option>
          <option value="EQUIPMENT">{t("Equipment")}</option>
        </select>
      
      
        <Labels variant="default" size="default">
          {t("Name")}
        </Labels>
        <Inputs
          id="name"
          name="name"
          type="text"
        
        />
      
      
        <Labels variant="default" size="default">
          {t("Description")}
        </Labels>
        <TextAreas
          id="description"
          name="description"
        
        />
      
      
        <Labels variant="default" size="default">
          {t("Status")}
        </Labels>
        <select
          id="equipment_status"
          name="equipment_status"
        
        >
          <option value="">{t("Select")}</option>
          <option value="OPERATIONAL">{t("Operational")}</option>
          <option value="NEEDS_REPAIR">{t("NeedsRepair")}</option>
        </select>
      
      {equipmentTag === "TRUCK" || equipmentTag === "TRAILER" ? (
        <>
          
            <Labels variant="default" size="default">
              {t("Make")}
            </Labels>
            <Inputs
              id="make"
              name="make"
              type="text"
            
            />
          
          
            <Labels variant="default" size="default">
              {t("Model")}
            </Labels>
            <Inputs
              id="model"
              name="model"
              type="text"
            
            />
          
          
            <Labels variant="default" size="default">
              {t("Year")}
            </Labels>
            <Inputs
              id="year"
              name="year"
              type="text"
            
            />
          
          
            <Labels variant="default" size="default">
              {t("LicensePlate")}
            </Labels>
            <Inputs
              id="license_plate"
              name="license_plate"
              type="text"
            
            />
          
          
            <Labels variant="default" size="default">
              {t("RegistrationExpiration")}
            </Labels>
            <Inputs
              id="registration_expiration"
              name="registration_expiration"
              type="date"
            
            />
          
          
            <Labels variant="default" size="default">
              {t("Mileage")}
            </Labels>
            <Inputs
              id="mileage"
              name="mileage"
              type="number"
            
            />
          
        </>
      ) : null}
      
        <Inputs
          id="image"
          name="image"
          type="hidden"
          value={base64String || ""}
        />
      
      <Buttons variant="green" size="default" type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
};

export default AddEquipmentForm;
