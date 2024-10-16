import React, {
  useState,
  useEffect,
  FormEvent,
  SetStateAction,
  Dispatch,
} from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import {
  createEquipment,
  equipmentTagExists,
} from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Forms } from "@/components/(reusable)/forms";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Labels } from "@/components/(reusable)/labels";
import { Selects } from "@/components/(reusable)/selects";
import { Options } from "@/components/(reusable)/options";
import { Titles } from "@/components/(reusable)/titles";
import { Holds } from "@/components/(reusable)/holds";
import { date } from "zod";
import { Contents } from "@/components/(reusable)/contents";

type AddEquipmentFormProps = {
  base64String: string | null;
  handler: () => void;
  setBanner: Dispatch<SetStateAction<boolean>>;
  setBannerText: Dispatch<SetStateAction<string>>;
};

export default function AddEquipmentForm({
  base64String,
  setBannerText,
  handler,
  setBanner,
}: AddEquipmentFormProps) {
  const [equipmentTag, setEquipmentTag] = useState("EQUIPMENT");
  const t = useTranslations("Generator");
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
        console.error(`${t("GenerateError")}`, error);
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

  function handleRoute() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setBanner(false);
      setBannerText("");
      window.history.back();
    }, 1000);
  }

  return (
    <Forms
      action={createEquipment}
      onSubmit={() => {
        setBanner(true);
        setBannerText(`${t("Banner-Text")}`);
        handler();
        handleRoute();
      }}
    >
      <Holds background={"white"} className="my-5">
        <Contents width={"section"} className="mt-2 mb-5">
          <Labels size={"p4"}>
            {t("Temporary")}
            <Inputs name="qrId" type="text" value={eqCode} disabled />
          </Labels>
          <Holds>
            <Labels size={"p4"}>
              {t("Tag")}
              <Selects
                id="equipmentTag"
                name="equipmentTag"
                onChange={handleChange}
                required
              >
                <Options value="">{t("Select")}</Options>
                <Options value="TRUCK">{t("Truck")}</Options>
                <Options value="TRAILER">{t("Trailer")}</Options>
                <Options value="EQUIPMENT">{t("Equipment")}</Options>
              </Selects>
            </Labels>
          </Holds>
          <Labels size={"p4"}>
            {t("Name")}
            <Inputs
              id="name"
              name="name"
              type="text"
              placeholder={`${t("NamePlaceholder")}`}
              required
              pattern="^[A-Za-z0-9\s]+$"
            />
          </Labels>
          <Labels size={"p4"}>
            {t("Description")}
            <TextAreas
              id="description"
              name="description"
              placeholder={`${t("DescriptionPlaceholder")}`}
              required
            />
          </Labels>
          <Labels size={"p4"}>
            {t("Status")}
            <Selects id="status" name="status" required>
              <Options value="">{t("Select")}</Options>
              <Options value="OPERATIONAL">{t("Operational")}</Options>
              <Options value="NEEDS_REPAIR">{t("NeedsRepair")}</Options>
            </Selects>
          </Labels>

          {equipmentTag === "TRUCK" || equipmentTag === "TRAILER" ? (
            <>
              <Labels size={"p3"}>
                {t("Make")}
                <Inputs
                  id="make"
                  name="make"
                  type="text"
                  placeholder={`${t("MakePlaceholder")}`}
                  required={
                    equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                      ? true
                      : false
                  }
                />
              </Labels>

              <Labels size={"p3"}>
                {t("Model")}
                <Inputs
                  id="model"
                  name="model"
                  type="text"
                  placeholder={`${t("ModelPlaceholder")}`}
                  required={
                    equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                      ? true
                      : false
                  }
                />
              </Labels>

              <Labels size={"p3"}>
                {t("Year")}
                <Inputs
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max="2099"
                  defaultValue={new Date().getFullYear()}
                  step="1"
                  placeholder={`${t("YearPlaceholder")}`}
                  required={
                    equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                      ? true
                      : false
                  }
                />
              </Labels>

              <Labels size={"p3"}>
                {t("LicensePlate")}
                <Inputs
                  id="licensePlate"
                  name="licensePlate"
                  type="text"
                  placeholder={`${t("LicensePlatePlaceholder")}`}
                  required={
                    equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                      ? true
                      : false
                  }
                />
              </Labels>

              <Labels size={"p3"}>
                {t("RegistrationExpiration")}
                <Inputs
                  id="registrationExpiration"
                  name="registrationExpiration"
                  type="date"
                  required={
                    equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                      ? true
                      : false
                  }
                />
              </Labels>

              <Labels size={"p3"}>
                {t("Mileage")}
                <Inputs
                  id="mileage"
                  name="mileage"
                  type="number"
                  placeholder={`${t("MileagePlaceholder")}`}
                  required={
                    equipmentTag === "TRUCK" || equipmentTag === "TRAILER"
                      ? true
                      : false
                  }
                />
              </Labels>
            </>
          ) : null}

          <Inputs
            id="image"
            name="image"
            type="hidden"
            value={base64String || ""}
          />
          <Inputs id="qrId" name="qrId" type="hidden" value={eqCode} />
        </Contents>
      </Holds>
      <Holds>
        <Contents width={"section"} className="my-5">
          <Buttons background={"green"} type="submit" className="p-2">
            <Titles size={"h3"}>{t("CreateNew")}</Titles>
          </Buttons>
        </Contents>
      </Holds>
    </Forms>
  );
}
