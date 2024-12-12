"use client";

import { useNotification } from "@/app/context/NotificationContext";
import { createEquipment } from "@/actions/equipmentActions";
import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { ReusableViewLayout } from "../../../personnel/@view/[employee]/_components/reusableViewLayout";
import { NewEquipmentLeft } from "./_components/NewEquipmentLeft";
import { NewEquipmentRight } from "./_components/NewEquipmentRight";
import { NewEquipmentFooter } from "./_components/NewEquipmentFooter";
import { NewEquipmentHeader } from "./_components/NewEquipmentHeader";
import { z } from "zod";
import { useTranslations } from "next-intl";

const equipmentSchema = z
  .object({
    qrId: z.string().min(4, "QR ID is required."),
    name: z.string().min(1, "Name is required."),
    description: z.string().optional(),
    equipmentTag: z.string().min(1, "Equipment tag is required."),
    status: z.string().min(1, "Equipment status is required.").optional(),
    make: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    year: z.string().nullable().optional(),
    licensePlate: z.string().nullable().optional(),
    registrationExpiration: z.string().nullable().optional(),
    mileage: z.number().nullable().optional(),
  })
  .refine(
    (data) => {
      if (["VEHICLE", "TRUCK"].includes(data.equipmentTag)) {
        return (
          !!data.make?.length &&
          !!data.model?.length &&
          !!data.year?.length &&
          !!data.licensePlate?.length &&
          !!data.registrationExpiration?.length &&
          data.mileage != null
        );
      }
      return true;
    },
    {
      message:
        "Make, model, year, license plate, registration expiration, and mileage are required for VEHICLE or TRUCK.",
      path: [], // Path can be left empty or specify a path for the error message.
    }
  );

export default function NewEquipment() {
  const { data: session } = useSession();
  const equipmentFormRef = useRef<HTMLFormElement>(null); // Renamed from `createEquipment`
  const { setNotification } = useNotification();
  const t = useTranslations("Admins");
  // State variables
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentDescription, setEquipmentDescription] = useState("");
  const [equipmentCode, setEquipmentCode] = useState<string | null>(null);
  const [equipmentTag, setEquipmentTag] = useState<string | null>("EQUIPMENT"); // Should default to Tags value
  const [equipmentStatus, setEquipmentStatus] = useState<string | null>(
    "OPERATIONAL"
  ); // Should default to EquipmentStatus value
  const [vehicleMake, setVehicleMake] = useState<string | null>(null);
  const [vehicleModel, setVehicleModel] = useState<string | null>(null);
  const [vehicleYear, setVehicleYear] = useState<string | null>(null);
  const [vehicleLicensePlate, setVehicleLicensePlate] = useState<string | null>(
    null
  );
  const [registrationExpiration, setRegistrationExpiration] = useState<
    string | null
  >(null);
  const [vehicleMileage, setVehicleMileage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const equipmentData = {
      qrId: equipmentCode ?? "",
      name: equipmentName.trim(),
      description: equipmentDescription.trim(),
      equipmentTag: equipmentTag ?? "",
      status: equipmentStatus ?? "",
      make: vehicleMake ?? null,
      model: vehicleModel ?? null,
      year: vehicleYear ?? null,
      licensePlate: vehicleLicensePlate ?? null,
      registrationExpiration: registrationExpiration ?? null,
      mileage: vehicleMileage ? parseFloat(vehicleMileage) : null,
    };

    const validationResult = equipmentSchema.safeParse(equipmentData);

    if (!validationResult.success) {
      // Map validation errors to a user-friendly message
      const errorMessages = validationResult.error.errors
        .map((error) => `${error.path.join(" -> ")} ${error.message}`)
        .join(", ");

      // Set notification with detailed validation errors
      setNotification(`${t("ValidationFailed")} ${errorMessages}`, "error");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const qrId = "EQ-" + equipmentCode;

    formData.append("name", equipmentName);
    formData.append("description", equipmentDescription);
    if (equipmentCode) formData.append("qrId", qrId);
    formData.append("equipmentStatus", equipmentStatus ?? "");
    console.log("equipmentTag: ", equipmentTag);
    formData.append("equipmentTag", equipmentTag ?? "");
    if (equipmentTag === "VEHICLE" || equipmentTag === "TRUCK") {
      if (
        !vehicleMake ||
        !vehicleModel ||
        !vehicleYear ||
        !vehicleLicensePlate ||
        !registrationExpiration ||
        !vehicleMileage
      ) {
        setNotification("Please fill in all vehicle details.", "error");
        return;
      } else {
        formData.append("make", vehicleMake);
        formData.append("model", vehicleModel);
        formData.append("year", vehicleYear);
        formData.append("licensePlate", vehicleLicensePlate);
        formData.append("registrationExpiration", registrationExpiration);
        formData.append("mileage", vehicleMileage);
      }
    }

    try {
      await createEquipment(formData);
      clearUseStates();
      setNotification("Equipment created successfully.", "success");
      if (equipmentFormRef.current) {
        equipmentFormRef.current.reset();
      }
    } catch (error) {
      console.error("Failed to create equipment:", error);
      setNotification("Failed to create equipment.", "error");
    }
  };

  const clearUseStates = () => {
    setEquipmentName("");
    setEquipmentDescription("");
    setEquipmentCode(null);
    setEquipmentTag(null);
    setEquipmentStatus(null);
    setVehicleMake(null);
    setVehicleModel(null);
    setVehicleYear(null);
    setVehicleLicensePlate(null);
    setRegistrationExpiration(null);
    setVehicleMileage(null);
  };

  const handleSubmitClick = () => {
    equipmentFormRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };

  return (
    <>
      <form ref={equipmentFormRef} onSubmit={handleSubmit} />
      <ReusableViewLayout
        custom={true}
        header={
          <NewEquipmentHeader
            comment={equipmentDescription}
            equipmentName={equipmentName}
            setComment={setEquipmentDescription}
            setEquipmentName={setEquipmentName}
          />
        }
        editFunction={setEquipmentName}
        editedItem={equipmentName}
        editCommentFunction={setEquipmentDescription}
        commentText={equipmentDescription}
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        mainLeft={
          <NewEquipmentLeft
            equipmentCode={equipmentCode}
            setEquipmentCode={setEquipmentCode}
            equipmentStatus={equipmentStatus}
            setEquipmentStatus={setEquipmentStatus}
            equipmentTag={equipmentTag}
            setEquipmentTag={setEquipmentTag}
          />
        }
        mainRight={
          <NewEquipmentRight
            equipmentTag={equipmentTag}
            vehicleMake={vehicleMake}
            setVehicleMake={setVehicleMake}
            vehicleModel={vehicleModel}
            setVehicleModel={setVehicleModel}
            vehicleYear={vehicleYear}
            setVehicleYear={setVehicleYear}
            vehicleLicensePlate={vehicleLicensePlate}
            setVehicleLicensePlate={setVehicleLicensePlate}
            registrationExpiration={registrationExpiration}
            setRegistrationExpiration={setRegistrationExpiration}
            vehicleMileage={vehicleMileage}
            setVehicleMileage={setVehicleMileage}
          />
        }
        footer={<NewEquipmentFooter handleSubmitClick={handleSubmitClick} />}
      />
    </>
  );
}
