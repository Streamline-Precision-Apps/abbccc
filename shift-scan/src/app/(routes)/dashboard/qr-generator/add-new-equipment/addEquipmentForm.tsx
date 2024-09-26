import React, { useState, useEffect, FormEvent, SetStateAction, Dispatch } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import { createEquipment, equipmentTagExists } from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { Contents } from "@/components/(reusable)/contents";
import { Texts } from "@/components/(reusable)/texts";
import { Bases } from "@/components/(reusable)/bases";

type AddEquipmentFormProps = {
  base64String: string | null;
  handler:() => void
  setBanner:  Dispatch<SetStateAction<boolean>>
  setBannerText: Dispatch<SetStateAction<string>>
}

export default function AddEquipmentForm({ base64String, setBannerText, handler, setBanner } : AddEquipmentFormProps){
  const [equipmentTag, setEquipmentTag] = useState("EQUIPMENT");
  const t = useTranslations("addEquipmentForm");
  const [eqCode, setEQCode] = useState("");

  const randomQrCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "EQ-TEMP-";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    console.log(result);
    return result;
  };

  useEffect(() => {
    async function generateQrCode() {
      try {
        const result = randomQrCode();
        setEQCode(result);
        const response = await equipmentTagExists(result);
        if (response) {
          setEQCode("");
          return generateQrCode();
        }
      } catch (error) {
        console.error("Failed to generate QR code:", error);
      }
    }
    generateQrCode();
  }, []);

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



  function handleRoute() {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setTimeout(() => {
      setBanner(false);
      setBannerText("");
      window.history.back();
    }, 3000);
  }

  return (
    <Forms action={createEquipment} onSubmit={() => {setBanner(true); setBannerText("Added Temporary Equipment Successfully"); handler(); handleRoute()}}>
      <Labels variant="default" size="default">Temporary QR ID </Labels>
      <Inputs name="qrId" type="text" disabled value={eqCode} />
        <Labels variant="default" size="default">
          {t("Tag")}
        </Labels>
        <Selects
          id="equipmentTag"
          name="equipmentTag"
          onChange={handleChange}
          >
          <Options value="">{t("Select")}</Options>
          <Options value="TRUCK">{t("Truck")}</Options>
          <Options value="TRAILER">{t("Trailer")}</Options>
          <Options value="EQUIPMENT">{t("Equipment")}</Options>
        </Selects>
      
      
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
        <Selects
          id="status"
          name="status"
          >
          <Options value="">{t("Select")}</Options>
          <Options value="OPERATIONAL">{t("Operational")}</Options>
          <Options value="NEEDS_REPAIR">{t("NeedsRepair")}</Options>
        </Selects>
      
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
              id="licensePlate"
              name="licensePlate"
              type="text"
              
              />
          
          
            <Labels variant="default" size="default">
              {t("RegistrationExpiration")}
            </Labels>
            <Inputs
              id="registrationExpiration"
              name="registrationExpiration"
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
        <Inputs id="qrId" name="qrId" type="hidden" value={eqCode} />
      
      <Buttons variant={"green"} size={null} type="submit">
        {t("Submit")}
      </Buttons>
    </Forms>
  );
};
