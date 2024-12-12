"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/app/context/NotificationContext";
import { updateEquipment, deleteEquipment } from "@/actions/equipmentActions";
import { ReusableViewLayout } from "../../../personnel/@view/[employee]/_components/reusableViewLayout";
import { EquipmentLeft } from "./_components/EquipmentLeft";
import { EquipmentRight } from "./_components/EquipmentRight";
import { EquipmentFooter } from "./_components/EquipmentFooter";
import { EquipmentHeader } from "./_components/EquipmentHeader";
import EmptyView from "../../../_pages/EmptyView";
import { Spinner } from "@nextui-org/react";
import { z } from "zod";
import { useTranslations } from "next-intl";

const equipmentSchema = z
  .object({
    id: z.string().min(1, "Equipment ID is required."),
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

export default function ViewEquipment({
  params,
}: {
  params: { equipment: string };
}) {
  const { setNotification } = useNotification();
  const router = useRouter();
  const equipmentFormRef = useRef<HTMLFormElement>(null);
  const t = useTranslations("Admins");

  // State variables for equipment data
  const [equipmentName, setEquipmentName] = useState<string>("");
  const [equipmentDescription, setEquipmentDescription] = useState<string>("");
  const [equipmentCode, setEquipmentCode] = useState<string | null>(null);
  const [equipmentTag, setEquipmentTag] = useState<string | null>(null);
  const [equipmentStatus, setEquipmentStatus] = useState<string | null>(null);
  const [make, setMake] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [licensePlate, setLicensePlate] = useState<string | null>(null);
  const [registrationExpiration, setRegistrationExpiration] = useState<
    string | null
  >(null);
  const [mileage, setMileage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Initial state for reverting fields
  const [initialEquipment, setInitialEquipment] = useState<{
    equipmentName: string;
    equipmentDescription: string;
    equipmentCode: string | null;
    equipmentTag: string | null;
    equipmentStatus: string | null;
    make: string | null;
    model: string | null;
    year: string | null;
    licensePlate: string | null;
    registrationExpiration: string | null;
    mileage: string | null;
  }>({
    equipmentName: "",
    equipmentDescription: "",
    equipmentCode: null,
    equipmentTag: null,
    equipmentStatus: null,
    make: null,
    model: null,
    year: null,
    licensePlate: null,
    registrationExpiration: null,
    mileage: null,
  });

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true);
      try {
        const equipmentRes = await fetch(
          `/api/getEquipmentByEquipmentId/${params.equipment}`
        );
        const equipmentData = await equipmentRes.json();
        if (equipmentData) {
          setEquipmentName(equipmentData.name);
          setEquipmentDescription(equipmentData.description);
          setEquipmentCode(equipmentData.qrId);
          setEquipmentTag(equipmentData.equipmentTag);
          setEquipmentStatus(equipmentData.status);
          setMake(equipmentData.make);
          setModel(equipmentData.model);
          setYear(equipmentData.year);
          setLicensePlate(equipmentData.licensePlate);
          setRegistrationExpiration(
            equipmentData.registrationExpiration
              ? equipmentData.registrationExpiration.split("T")[0]
              : null
          );
          setMileage(equipmentData.mileage);

          // Set initial state
          setInitialEquipment({
            equipmentName: equipmentData.name,
            equipmentDescription: equipmentData.description,
            equipmentCode: equipmentData.qrId,
            equipmentTag: equipmentData.equipmentTag,
            equipmentStatus: equipmentData.status,
            make: equipmentData.make,
            model: equipmentData.model,
            year: equipmentData.year,
            licensePlate: equipmentData.licensePlate,
            registrationExpiration: equipmentData.registrationExpiration
              ? equipmentData.registrationExpiration.split("T")[0]
              : null,
            mileage: equipmentData.mileage,
          });
        }
      } catch (error) {
        console.error(t("ErrorFetchingEquipmentData"), error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [params.equipment]);

  // Utility to check if a field has changed
  const isFieldChanged = (field: keyof typeof initialEquipment) =>
    initialEquipment[field] !== eval(field);

  // Revert field to its initial value
  const revertField = (field: keyof typeof initialEquipment) => {
    eval(
      `set${
        field.charAt(0).toUpperCase() + field.slice(1)
      }(initialEquipment[field])`
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const equipmentData = {
      id: params.equipment,
      qrId: equipmentCode ?? "",
      name: equipmentName.trim(),
      description: equipmentDescription.trim(),
      equipmentTag: equipmentTag ?? "",
      status: equipmentStatus ?? "",
      make: make ?? null,
      model: model ?? null,
      year: year ?? null,
      licensePlate: licensePlate ?? null,
      registrationExpiration: registrationExpiration ?? null,
      mileage: mileage ? parseFloat(mileage) : null,
    };

    const validationResult = equipmentSchema.safeParse(equipmentData);

    if (!validationResult.success) {
      // Map validation errors to a user-friendly message
      const errorMessages = validationResult.error.errors
        .map((error) => `${error.path.join(" -> ")}: ${error.message}`)
        .join(", ");

      // Set notification with detailed validation errors
      setNotification(`${t("ValidationFailed")} ${errorMessages}`, "error");
      return;
    }

    try {
      let formData = new FormData(equipmentFormRef.current!);
      formData.append("id", params.equipment);
      formData.append("name", equipmentName.trim());
      formData.append("description", equipmentDescription.trim());
      if (equipmentCode) formData.append("qrId", equipmentCode);
      formData.append("equipmentTag", equipmentTag ?? "");
      formData.append("status", equipmentStatus ?? "");

      if (equipmentTag === "VEHICLE" || equipmentTag === "TRUCK") {
        if (
          !make ||
          !model ||
          !year ||
          !licensePlate ||
          !registrationExpiration ||
          !mileage
        ) {
          setNotification(t("PleaseFillInAllVehicleDetails"), "error");
          return;
        }
        formData.append("make", make);
        formData.append("model", model);
        formData.append("year", year);
        formData.append("licensePlate", licensePlate);
        formData.append("registrationExpiration", registrationExpiration);
        formData.append("mileage", mileage);
      }
      formData.append("id", params.equipment);

      await updateEquipment(formData);
      setNotification(t("EquipmentUpdatedSuccessfully"), "success");

      setInitialEquipment({
        equipmentName: equipmentName,
        equipmentDescription: equipmentDescription,
        equipmentCode: equipmentCode,
        equipmentTag: equipmentTag,
        equipmentStatus: equipmentStatus,
        make: make,
        model: model,
        year: year,
        licensePlate: licensePlate,
        registrationExpiration: registrationExpiration
          ? registrationExpiration.split("T")[0]
          : null,
        mileage: mileage,
      });

      router.refresh();
    } catch (error) {
      console.error(t("FailedToUpdateEquipment"), error);
      setNotification(t("FailedToUpdateEquipment"), "error");
    }
  };

  const handleSubmitClick = () => {
    equipmentFormRef.current?.dispatchEvent(
      new Event("submit", { bubbles: true, cancelable: true })
    );
  };

  const handleDeleteClick = async () => {
    if (window.confirm("Are you sure you want to delete this equipment?")) {
      try {
        setLoading(true);
        await deleteEquipment(params.equipment);
        router.push("/admins/assets");
      } catch (error) {
        console.error("Failed to delete equipment:", error);
        setNotification("Failed to delete equipment.", "error");
      } finally {
        setLoading(false);
      }
    } else {
      return;
    }
  };

  if (loading) {
    return (
      <EmptyView
        Children={
          <>
            <Spinner size={"lg"} />
          </>
        }
      />
    );
  }

  return (
    <>
      <form ref={equipmentFormRef} onSubmit={handleSubmit} />
      <ReusableViewLayout
        custom={true}
        header={
          <EquipmentHeader
            equipmentName={equipmentName}
            setEquipmentName={setEquipmentName}
            comment={equipmentDescription}
            setComment={setEquipmentDescription}
            isFieldChanged={isFieldChanged}
            revertField={revertField}
          />
        }
        editFunction={setEquipmentName}
        editedItem={equipmentName}
        editCommentFunction={setEquipmentDescription}
        commentText={equipmentDescription}
        mainHolds="h-full w-full flex flex-row row-span-6 col-span-2 bg-app-dark-blue px-4 py-2 rounded-[10px] gap-4"
        mainLeft={
          <EquipmentLeft
            equipmentCode={equipmentCode}
            setEquipmentCode={setEquipmentCode}
            equipmentStatus={equipmentStatus}
            setEquipmentStatus={setEquipmentStatus}
            equipmentTag={equipmentTag}
            setEquipmentTag={setEquipmentTag}
            isFieldChanged={isFieldChanged}
            revertField={revertField}
          />
        }
        mainRight={
          <EquipmentRight
            equipmentTag={equipmentTag}
            vehicleMake={make}
            setVehicleMake={setMake}
            vehicleModel={model}
            setVehicleModel={setModel}
            vehicleYear={year}
            setVehicleYear={setYear}
            vehicleLicensePlate={licensePlate}
            setVehicleLicensePlate={setLicensePlate}
            registrationExpiration={registrationExpiration}
            setRegistrationExpiration={setRegistrationExpiration}
            vehicleMileage={mileage}
            setVehicleMileage={setMileage}
            isFieldChanged={isFieldChanged}
            revertField={revertField}
          />
        }
        footer={
          <EquipmentFooter
            handleDeleteClick={() => handleDeleteClick()}
            handleSubmitClick={handleSubmitClick}
          />
        }
      />
    </>
  );
}
