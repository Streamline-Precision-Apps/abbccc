"use client";
import React, { useState, useEffect, useRef } from "react";
import { Buttons } from "@/components/(reusable)/buttons";
import {
  createEquipment,
  equipmentTagExists,
} from "@/actions/equipmentActions";
import { useTranslations } from "next-intl";
import { Inputs } from "@/components/(reusable)/inputs";
import { TextAreas } from "@/components/(reusable)/textareas";
import { Selects } from "@/components/(reusable)/selects";
import { NModals } from "@/components/(reusable)/newmodals";
import { JobsiteSelector } from "@/components/(clock)/(General)/jobsiteSelector";
import { Titles } from "@/components/(reusable)/titles";
import { Holds } from "@/components/(reusable)/holds";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { v4 as uuidv4 } from "uuid";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { US_STATES } from "@/data/stateValues";
import { useDashboardData } from "@/app/(routes)/admins/_pages/sidebar/DashboardDataContext";
import { Texts } from "@/components/(reusable)/texts";

export type JobCode = {
  id: string;
  qrId: string;
  name: string;
};

export default function AddEquipmentForm({}) {
  const t = useTranslations("Generator");
  const { data: session } = useSession();
  const router = useRouter();
  const userId = session?.user.id;
  const submitterName = session?.user.firstName + " " + session?.user.lastName;
  const [eqCode, setEQCode] = useState("");
  const { refresh } = useDashboardData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValidation, setFormValidation] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    equipmentTag: "",
    temporaryEquipmentName: "",
    destination: "",
    creationReasoning: "",
    ownershipType: "",
  });

  // Replace your current validation constants with this function
  const validateForm = () => {
    return (
      formData.equipmentTag.trim() !== "" &&
      formData.temporaryEquipmentName.trim() !== "" &&
      formData.creationReasoning.trim() !== "" &&
      formData.destination.trim() !== "" &&
      formData.ownershipType.trim() !== "" &&
      eqCode.trim() !== "" &&
      userId
    );
  };

  // Update validation whenever form data changes
  useEffect(() => {
    setFormValidation(Boolean(validateForm()));
  }, [formData, eqCode, userId]);

  useEffect(() => {
    async function generateQrCode() {
      try {
        const result = uuidv4();
        setEQCode(`EQ-${result}`);
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
  }, [t]);

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "overWeight"
          ? value === "true"
            ? true
            : value === "false"
              ? false
              : null
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formValidation || !userId) return;

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("eqCode", eqCode);
      formDataToSend.append("createdById", userId || "");
      formDataToSend.append("submitterName", submitterName || "");

      const response = await createEquipment(formDataToSend);
      if (response.success) {
        // send notification to subscribers
        const notificationResponse = await fetch(
          "/api/notifications/send-multicast",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              topic: "items",
              title: "New Equipment Submission",
              message:
                "An equipment item has been created and is pending approval.",
              link: "/admins/equipment",
            }),
          },
        );
        await notificationResponse.json();
        if (notificationResponse.ok) {
          refresh();
        }

        router.push("/dashboard/qr-generator");
      }

      return;
    } catch (error) {
      console.error(`${t("CreateError")}`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Holds background="white" className="row-start-1 row-end-2 h-full">
        <TitleBoxes onClick={() => router.back()}>
          <Titles size={"lg"}>{t("NewEquipmentForm")}</Titles>
        </TitleBoxes>
      </Holds>
      <Holds background="white" className="row-start-2 row-end-8 h-full">
        <form onSubmit={handleSubmit} className="h-full w-full">
          <Contents width={"section"}>
            <Grids rows={"6"} gap={"5"} className="h-full w-full pb-5">
              <Holds className="row-start-1 row-end-5 h-full py-3">
                <Holds className="py-3">
                  <Texts
                    size={"xs"}
                    position={"left"}
                    className="text-black pb-1"
                  >
                    {t("EquipmentTypeLabel") || "Equipment Type"}
                  </Texts>
                  <Selects
                    value={formData.equipmentTag}
                    onChange={handleInputChange}
                    name="equipmentTag"
                    className={`text-xs text-center h-full py-2 ${formData.equipmentTag === "" && "text-app-dark-gray"}`}
                  >
                    <option value="" disabled>
                      {t("SelectEquipmentType")}
                    </option>
                    <option value="VEHICLE">{t("Vehicle")}</option>
                    <option value="TRUCK">{t("Truck")}</option>
                    <option value="EQUIPMENT">{t("Equipment")}</option>
                    <option value="TRAILER">{t("Trailer")}</option>
                  </Selects>
                </Holds>
                <Holds className="pb-3">
                  <Texts
                    size={"xs"}
                    position={"left"}
                    className="text-black pb-1"
                  >
                    Ownership Type
                  </Texts>
                  <Selects
                    value={formData.ownershipType}
                    onChange={handleInputChange}
                    name="ownershipType"
                    className={`text-xs text-center h-full py-2 ${formData.ownershipType === "" && "text-app-dark-gray"}`}
                  >
                    <option value="" disabled>
                      Select Ownership Type
                    </option>
                    <option value="OWNED">OWNED</option>
                    <option value="LEASED">LEASED</option>
                    <option value="RENTAL">RENTAL</option>
                  </Selects>
                </Holds>
                <Holds className="pb-3">
                  <Texts
                    size={"xs"}
                    position={"left"}
                    className="text-black pb-1"
                  >
                    {t("TemporaryEquipmentNameLabel") ||
                      "Temporary Equipment Name"}
                  </Texts>
                  <Inputs
                    type="text"
                    name="temporaryEquipmentName"
                    value={formData.temporaryEquipmentName}
                    placeholder={t("TemporaryEquipmentName")}
                    className="text-xs pl-3 py-2"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>
                <Holds className="pb-3">
                  <Texts
                    size={"xs"}
                    position={"left"}
                    className="text-black pb-1"
                  >
                    {t("CurrentLocationLabel") || "Current Location"}
                  </Texts>
                  <Inputs
                    type="text"
                    name="destination"
                    value={formData.destination}
                    placeholder={t("SelectDestination")}
                    className="text-xs pl-3 py-2"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>
                <Holds className="pb-3">
                  <Texts
                    size={"xs"}
                    position={"left"}
                    className="text-black pb-1"
                  >
                    {t("ReasonForCreatingLabel") || "Reason for Creating"}
                  </Texts>
                  <TextAreas
                    name="creationReasoning"
                    value={formData.creationReasoning}
                    placeholder={t("EQCreationReasoning")}
                    className="text-xs pl-3 h-full"
                    onChange={handleInputChange}
                    required
                  />
                </Holds>
              </Holds>
              <Holds className="row-start-6 row-end-7">
                <Buttons
                  background={formValidation ? "green" : "darkGray"}
                  type="submit"
                  className="py-2"
                  disabled={!formValidation || isSubmitting}
                >
                  <Titles size={"lg"}>
                    {isSubmitting ? t("Submitting") : t("CreateEquipment")}
                  </Titles>
                </Buttons>
              </Holds>
            </Grids>
          </Contents>
        </form>
      </Holds>
    </>
  );
}
