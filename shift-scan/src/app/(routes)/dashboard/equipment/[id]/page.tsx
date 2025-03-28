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
import { form } from "@nextui-org/theme";

type Refueled = {
  id: string;
  employeeEquipmentLogId: string | null;
  truckingLogId: string | null;
  gallonsRefueled: number | null;
  milesAtfueling: number | null;
  tascoLogId: string | null;
};

const maintenanceSchema = z.object({
  id: z.string().optional(),
  equipmentIssue: z.string().nullable(),
  additionalInfo: z.string().nullable(), // assuming this might be null
});
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
        id: z.string().optional(),
        employeeEquipmentLogId: z.string().optional(),
        truckingLogId: z.string().optional(),
        gallonsRefueled: z.number().optional(),
        milesAtfueling: z.number().optional(),
        tascoLogId: z.string().optional(),
      })
      .optional()
  ),
  equipment: z.object({
    name: z.string(),
    status: z.string().optional(),
  }),
  maintenanceId: maintenanceSchema.nullable(),
  fullyOperational: z.boolean(),
});
type EquipmentLog = z.infer<typeof EquipmentLogSchema>;

export default function CombinedForm({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = params.id;
  const { setNotification } = useNotification();
  const t = useTranslations("Equipment");
  const [isLoading, setIsLoading] = useState(true);
  const [formState, setFormState] = useState({
    id: "",
    equipmentId: "",
    employeeId: "",
    startTime: "",
    endTime: "",
    comment: "",
    isFinished: false,
    refueled: [] as Refueled[],
    equipment: {
      name: "",
      status: "OPERATIONAL" as EquipmentStatus,
    },
    maintenanceId: null,
    fullyOperational: false,
  } as EquipmentLog);

  const [originalState, setOriginalState] = useState(formState);
  const [hasChanged, setHasChanged] = useState<boolean>(false);
  const [refueledLogs, setRefueledLogs] = useState<boolean>();
  const [tab, setTab] = useState(1);
  // states for maintenance logs

  const deepCompareObjects = useCallback(
    <T extends Record<string, any>>(obj1: T, obj2: T): boolean => {
      if (obj1 === obj2) return true;

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false;

      for (const key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        const areObjects = isObject(val1) && isObject(val2);

        if (
          (areObjects && !deepCompareObjects(val1, val2)) ||
          (!areObjects && val1 !== val2)
        ) {
          return false;
        }
      }

      return true;
    },
    []
  );

  const isObject = (object: any) => {
    return object != null && typeof object === "object";
  };

  useEffect(() => {
    const changed = !deepCompareObjects(formState, originalState);
    setHasChanged(changed);
  }, [formState, originalState, deepCompareObjects]);

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
          refueled: (data.refueled as Refueled[]) || [],
          equipment: {
            name: data.equipment?.name || "",
            status: data.equipment?.status || "OPERATIONAL",
          },
          maintenanceId: data.maintenanceId
            ? {
                id: data.maintenanceId.id || "",
                equipmentIssue: data.maintenanceId.equipmentIssue || "",
                additionalInfo: data.maintenanceId.additionalInfo || "",
              }
            : null,
          fullyOperational:
            data.isFinished && data.equipment.status === "OPERATIONAL"
              ? true
              : false,
        } as EquipmentLog;

        if (data.isFinished && data.equipment.status === "OPERATIONAL") {
        }

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

  const handleFieldChange = (
    field: string,
    value: string | number | boolean | FormStatus | EquipmentStatus | Refueled
  ) => {
    if (field === "Equipment.status") {
      setFormState((prev) => {
        const newState = {
          ...prev,
          equipment: {
            ...prev.equipment,
            status: value as EquipmentStatus,
          },
        };
        return newState;
      });
    } else if (field.startsWith("maintenanceId.")) {
      const maintenanceField = field.split(".")[1];
      setFormState((prev) => ({
        ...prev,
        maintenanceId: {
          ...(prev.maintenanceId || {
            id: "",
            equipmentIssue: "",
            additionalInfo: null,
          }),
          [maintenanceField]: value,
        },
      }));
    } else {
      setFormState((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const AddRefuelLog = async () => {
    if (!formState.id) {
      return;
    }
    const formData = new FormData();
    formData.append("employeeEquipmentLogId", formState.id ?? "");
    try {
      const tempRefuelLog = await createRefuelEquipmentLog(formData);
      setFormState((prev) => ({
        ...prev,
        refueled: [
          ...prev.refueled,
          {
            id: tempRefuelLog.id,
            employeeEquipmentLogId: formState.id,
            truckingLogId: undefined,
            gallonsRefueled: tempRefuelLog.gallonsRefueled ?? 0,
            milesAtfueling: undefined,
            tascoLogId: undefined,
          },
        ],
      }));
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
    if (formState.fullyOperational === true) {
      handleFieldChange("fullyOperational", false);
    } else {
      handleFieldChange("fullyOperational", true);
    }
  };

  const deleteLog = async () => {
    try {
      await deleteEmployeeEquipmentLog(formState.id);
      setFormState({
        ...formState,
        maintenanceId: null,
      });
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
        if (key === "equipment") {
        } else {
          formData.append(key, String(value));
        }
      });
      formData.set(
        "Equipment.status",
        formState.equipment.status || "OPERATIONAL"
      );
      formData.append(
        "equipmentIssue",
        formState.maintenanceId?.equipmentIssue || ""
      );
      formData.append(
        "additionalInfo",
        formState.maintenanceId?.additionalInfo || ""
      );

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

  // validation function
  const isFormValid = useCallback(() => {
    return (
      // Either equipment is fully operational
      formState.fullyOperational ||
      // OR maintenance request is properly filled out
      (formState.maintenanceId?.equipmentIssue &&
        formState.maintenanceId?.equipmentIssue.length > 0 &&
        formState.maintenanceId?.additionalInfo &&
        formState.maintenanceId?.additionalInfo.length > 0 &&
        formState.equipment.status !== "OPERATIONAL")
    );
  }, [
    formState.fullyOperational,
    formState.maintenanceId?.equipmentIssue,
    formState.maintenanceId?.additionalInfo,
    formState.equipment.status,
  ]);

  useEffect(() => {
    console.log("Checking for changes...");
    console.log("Current formState:", formState);
    console.log("Current originalState:", originalState);

    const changed = !deepCompareObjects(formState, originalState);
    console.log("Change detected:", changed);

    setHasChanged(changed);
  }, [formState, originalState, deepCompareObjects]);

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
                          deleteLog={deleteLog}
                          saveEdits={saveEdits}
                          handleFullOperational={handleFullOperational}
                          isFormValid={isFormValid}
                          t={t}
                        />
                      )}
                      {tab === 2 && (
                        <MaintenanceLogEquipment
                          formState={formState}
                          handleFieldChange={handleFieldChange}
                          hasChanged={hasChanged}
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
                        {hasChanged && (
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
