"use client";

import { updateEmployeeEquipmentLog } from "@/actions/equipmentActions";
import { useNotification } from "@/app/context/NotificationContext";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { differenceInSeconds, parseISO } from "date-fns";
import {
  createRefuelEquipmentLog,
  deleteEmployeeEquipmentLog,
} from "@/actions/truckingActions";
import Spinner from "@/components/(animations)/spinner";
import { NewTab } from "@/components/(reusable)/newTabs";
import UsageData from "./_components/UsageData";
import MaintenanceLogEquipment from "./_components/MaintenanceLogEquipment";
import { Buttons } from "@/components/(reusable)/buttons";
import { Titles } from "@/components/(reusable)/titles";
import { EquipmentStatus, FormStatus } from "@/lib/types";

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtfueling: number | null;
  tascoLogId: string | null;
};

const EquipmentLogSchema = z.object({
  id: z.string(),
  equipmentId: z.string(),
  employeeId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  comment: z.string().optional(),
  isFinished: z.boolean(),
  refueled: z.array(
    z
      .object({
        gallonsRefueled: z.number().optional(),
        milesAtfueling: z.number().optional(),
      })
      .optional()
  ),
  equipment: z.object({
    name: z.string(),
    status: z.string().optional(),
  }),
  maintenanceId: z.object({
    id: z.string().nullable(),
    equipmentIssue: z.string(),
    additionalInfo: z.string(),
  }),
});

type EquipmentLog = z.infer<typeof EquipmentLogSchema>;

export default function CombinedForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const { setNotification } = useNotification();
  const t = useTranslations("Equipment");
  const [isLoading, setIsLoading] = useState(true);
  const [refuelLogs, setRefuelLogs] = useState<Refueled[]>();
  const [formState, setFormState] = useState({
    id: "",
    equipmentId: "",
    employeeId: "",
    startTime: "",
    endTime: "",
    comment: "",
    isFinished: false,
    refueled: [],
    equipment: {
      name: "",
      status: "OPERATIONAL" as EquipmentStatus,
    },
    maintenanceId: {
      id: null,
      equipmentIssue: "",
      additionalInfo: "",
    },
  } as EquipmentLog);

  const [originalState, setOriginalState] = useState(formState);
  const [hasChanged, setHasChanged] = useState<boolean>();
  const [refueledLogs, setRefueledLogs] = useState<boolean>();
  const [tab, setTab] = useState(1);
  // states for maintenance logs
  const [fullyOperational, setFullyOperational] = useState<boolean>(false);

  useEffect(() => {
    const fetchEqLog = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/getEqUserLogs/${id}`);
        const data = await response.json();

        const processedData = {
          id: data.id || "",
          equipmentId: data.equipmentId || "",
          employeeId: data.employeeId || "",
          startTime: data.startTime.toString(),
          endTime: data.endTime
            ? data.endTime.toString()
            : new Date().toISOString(),
          comment: data.comment || "",
          isFinished: data.isFinished || false,
          refueled: [
            {
              gallonsRefueled: data.gallonsRefueled || 0,
              milesAtfueling: data.milesAtfueling || 0,
            },
          ],
          equipment: {
            name: data.equipment?.name || "",
            status: data.equipment?.status || "OPERATIONAL",
          },
          maintenanceId: {
            id: data.maintenanceId.id || null,
            equipmentIssue: data.maintenanceId.equipmentIssue || "",
            additionalInfo: data.maintenanceId.additionalInfo || "",
          },
        } as EquipmentLog;

        console.log("Processed Data: ", processedData);

        const result = EquipmentLogSchema.safeParse(processedData);
        if (!result.success) {
          console.error("Schema validation failed:", result.error);
          return;
        }

        setFormState(processedData);
        setOriginalState(processedData);

        const isRefueled = data.refueled.length > 0;

        console.log("isRefueled: ", isRefueled);

        setRefueledLogs(isRefueled);
      } catch (error) {
        console.error("Error fetching equipment log:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEqLog();
  }, [id]);

  useEffect(() => {
    const fetchRefuelLogs = async () => {
      try {
        const response = await fetch(`/api/getEquipmentRefueledLogs/${id}`);
        const data = await response.json();
        setRefuelLogs(data);
      } catch (error) {
        console.error("Error fetching refuel logs:", error);
      }
    };

    fetchRefuelLogs();
  }, [id]);

  const handleFieldChange = (
    field: string,
    value: string | number | boolean | FormStatus | EquipmentStatus
  ) => {
    console.log("Field Changed: ", field);
    if (field === "Equipment.status") {
      setFormState((prev) => ({
        ...prev,
        equipment: {
          ...prev.equipment,
          status: value as EquipmentStatus,
        },
      }));
      console.log("Field changed:", field);
      console.log("Value:", value);
    } else {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
      console.log("Value:", value);
    }
  };

  const AddRefuelLog = async () => {
    const formData = new FormData();
    formData.append("employeeEquipmentLogId", formState.id ?? "");
    try {
      const tempRefuelLog = await createRefuelEquipmentLog(formData);
      setRefuelLogs((prev) => [
        {
          id: tempRefuelLog.id,
          employeeEquipmentLogId: tempRefuelLog.employeeEquipmentLogId ?? "",
          truckingLogId: tempRefuelLog.truckingLogId ?? "",
          gallonsRefueled: tempRefuelLog.gallonsRefueled ?? 0,
          milesAtfueling: tempRefuelLog.milesAtfueling ?? 0,
          tascoLogId: tempRefuelLog.tascoLogId ?? "",
        },
        ...(prev ?? []),
      ]);
    } catch (error) {
      console.log("error adding state Mileage", error);
    }
  };

  const handleChangeRefueled = () => {
    if (refueledLogs) {
      setRefueledLogs(false);
    } else {
      setRefueledLogs(true);
    }
  };

  const handleFullOperational = () => {
    if (fullyOperational) {
      setFullyOperational(false);
    } else {
      setFullyOperational(true);
    }
  };

  const deleteLog = async () => {
    try {
      await deleteEmployeeEquipmentLog(formState.id);
      setNotification(t("Deleted"), "success");
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error deleting equipment log:", error);
      setNotification(t("FailedToDelete"), "error");
    }
  };

  const saveEdits = async () => {
    try {
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        if (key === "equipment" || key === "maintenanceId") {
        } else {
          formData.append(key, String(value));
        }
      });
      formData.set(
        "Equipment.status",
        formState.equipment.status || "OPERATIONAL"
      );
      // formData.append("equipmentIssue", formState.maintenanceId.equipmentIssue);
      // formData.append("additionalInfo", formState.maintenanceId.additionalInfo);

      console.log("Form Data: ", formData);
      await updateEmployeeEquipmentLog(formData);
      setNotification(t("Saved"), "success");
      router.replace("/dashboard/equipment");
    } catch (error) {
      console.error("Error saving equipment log:", error);
      setNotification(t("FailedToSave"), "error");
    }
  };

  const start = parseISO(formState.startTime);
  const end = formState.endTime ? parseISO(formState.endTime) : new Date();
  const diffInSeconds = differenceInSeconds(end, start);
  const hours = Math.floor(diffInSeconds / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);
  const seconds = diffInSeconds % 60;
  const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  useEffect(() => {
    if (formState !== originalState) {
      setHasChanged(true);
    }
  }, [formState, originalState]);

  // validation function
  const isFormValid = useCallback(() => {
    return (
      // Either equipment is fully operational
      fullyOperational ||
      // OR maintenance request is properly filled out
      (formState.maintenanceId &&
        formState.maintenanceId.equipmentIssue.length > 0 &&
        formState.maintenanceId &&
        formState.maintenanceId.additionalInfo.length > 0)
    );
  }, [
    fullyOperational,
    formState.maintenanceId?.equipmentIssue,
    formState.maintenanceId?.additionalInfo,
  ]);

  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="h-full w-full ">
          <Holds
            background="white"
            className={
              isLoading
                ? "row-span-1 h-full justify-center animate-pulse"
                : "row-span-1 h-full justify-center"
            }
          >
            <TitleBoxes
              title={
                isLoading
                  ? "Loading..."
                  : `${formState.equipment.name.slice(0, 16)}...`
              }
              type="row"
              titleImg=""
              titleImgAlt="No equipment image"
              className="w-full h-full"
            />
          </Holds>
          <Holds className="row-start-2 row-end-8 h-full w-full">
            <Grids rows={"10"} className="h-full w-full ">
              <Holds
                position={"row"}
                className="row-start-1 row-end-2 h-full w-full gap-1"
              >
                <NewTab
                  isActive={tab === 1}
                  onClick={() => setTab(1)}
                  titleImage="/form.svg"
                  titleImageAlt=""
                  isComplete={true}
                >
                  Usage Data
                </NewTab>
                <NewTab
                  isActive={tab === 2}
                  onClick={() => setTab(2)}
                  titleImage="/equipment.svg"
                  titleImageAlt=""
                  isComplete={true}
                >
                  Maintenance Log
                </NewTab>
              </Holds>
              <Holds
                background="white"
                className={
                  isLoading
                    ? "row-start-2 row-end-11 h-full rounded-t-none animate-pulse"
                    : "row-start-2 row-end-11 h-full rounded-t-none "
                }
              >
                {isLoading ? (
                  <>
                    <Holds className="h-full w-full justify-center">
                      <Spinner />
                    </Holds>
                  </>
                ) : (
                  <Contents width={"section"}>
                    <Grids rows={"8"} gap={"5"} className="h-full w-full pb-3">
                      {tab === 1 && (
                        <UsageData
                          formState={formState}
                          handleFieldChange={handleFieldChange}
                          formattedTime={formattedTime}
                          refueledLogs={refueledLogs}
                          handleChangeRefueled={handleChangeRefueled}
                          AddRefuelLog={AddRefuelLog}
                          refuelLogs={refuelLogs}
                          setRefuelLogs={setRefuelLogs}
                          deleteLog={deleteLog}
                          saveEdits={saveEdits}
                          handleFullOperational={handleFullOperational}
                          fullyOperational={fullyOperational}
                          isFormValid={isFormValid}
                          t={t}
                        />
                      )}
                      {tab === 2 && (
                        <MaintenanceLogEquipment
                          formState={formState}
                          handleFieldChange={handleFieldChange}
                          t={t}
                        />
                      )}
                      <Holds
                        position={"row"}
                        background="white"
                        className="w-full gap-4 row-start-8 row-end-9 py-2"
                      >
                        <Buttons
                          onClick={() => {
                            deleteLog();
                          }}
                          background="red"
                          className="w-full "
                        >
                          <Titles size="h5">Delete Log</Titles>
                        </Buttons>
                        {!formState.isFinished && (
                          <Buttons
                            onClick={() => {
                              if (!isFormValid()) {
                                setNotification(
                                  "Please complete maintenance requirements",
                                  "error"
                                );
                                return;
                              }
                              saveEdits();
                            }}
                            background={
                              isFormValid() ? "lightBlue" : "darkGray"
                            }
                            className="w-full "
                            disabled={!isFormValid()}
                          >
                            <Titles size="h5">Finish Logs</Titles>
                          </Buttons>
                        )}
                      </Holds>
                    </Grids>
                  </Contents>
                )}
              </Holds>
            </Grids>
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
