"use client";
import {
  deleteStateMileage,
  updateStateMileage,
} from "@/actions/truckingActions";
import SlidingDiv from "@/components/(animations)/slideDelete";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import { Selects } from "@/components/(reusable)/selects";
import { Texts } from "@/components/(reusable)/texts";
import { useTranslations } from "next-intl";
import { useEffect, useState, useRef, useCallback } from "react";
import { debounce } from "lodash";

type StateMileage = {
  id: string;
  truckingLogId: string;
  state?: string;
  stateLineMileage?: number;
  createdAt?: Date;
};

export default function StateMileageList({
  StateMileage,
  setStateMileage,
  StateOptions,
  startingMileage,
}: {
  StateMileage: StateMileage[] | undefined;
  setStateMileage: React.Dispatch<
    React.SetStateAction<StateMileage[] | undefined>
  >;
  StateOptions: {
    value: string;
    label: string;
  }[];
  startingMileage: number | null;
}) {
  const t = useTranslations("TruckingAssistant");
  const [editedStateMileage, setEditedStateMileage] = useState<StateMileage[]>(
    StateMileage || []
  );
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  // Helper function to get validation message for mileage input
  const getValidationMessage = (
    stateLineMileage: number | null | undefined,
    itemId: string
  ): string => {
    if (!startingMileage) return "";

    // Show message for empty or null values
    if (
      stateLineMileage === null ||
      stateLineMileage === undefined ||
      stateLineMileage <= 0
    ) {
      return `Mileage required, must be ${startingMileage.toLocaleString()} or greater`;
    }

    if (stateLineMileage < startingMileage) {
      return `Mileage must be ${startingMileage.toLocaleString()} or greater`;
    }
    return "";
  };

  // Debounced server update function
  const updateStateMileageServer = useCallback(
    debounce(async (stateMileage: StateMileage) => {
      const formData = new FormData();
      formData.append("id", stateMileage.id);
      formData.append("state", stateMileage.state || "");
      formData.append(
        "stateLineMileage",
        stateMileage.stateLineMileage?.toString() || "0"
      );

      try {
        await updateStateMileage(formData);
      } catch (error) {
        console.error("Error updating state mileage:", error);
      }
    }, 1000),
    []
  );

  // Handle Delete
  const handleDelete = async (id: string) => {
    const newStateMileage = editedStateMileage.filter((sm) => sm.id !== id);
    setEditedStateMileage(newStateMileage);
    setStateMileage(newStateMileage);
    const isDeleted = await deleteStateMileage(id);
    if (isDeleted) {
      setEditedStateMileage(newStateMileage || []);
      setStateMileage(newStateMileage);
    }
  };

  // Handle State Change
  const handleStateChange = async (index: number, value: string) => {
    const newStateMileage = [...editedStateMileage];
    newStateMileage[index].state = value;
    setEditedStateMileage(newStateMileage);
    setStateMileage(newStateMileage);

    // Call server action to update the state
    const formData = new FormData();
    formData.append("id", newStateMileage[index].id);
    formData.append("state", value);
    formData.append(
      "stateLineMileage",
      newStateMileage[index].stateLineMileage?.toString() || "0"
    );
    await updateStateMileage(formData);
  };

  // Handle Mileage Change
  const handleMileageChange = (index: number, value: string | number) => {
    const newStateMileage = [...editedStateMileage];
    const numericValue = Number(value);
    newStateMileage[index].stateLineMileage = numericValue;
    setEditedStateMileage(newStateMileage);
    setStateMileage(newStateMileage);

    // Validate mileage
    const itemId = newStateMileage[index].id;
    const validationMessage = getValidationMessage(numericValue, itemId);
    setValidationErrors((prev) => ({
      ...prev,
      [itemId]: validationMessage,
    }));

    // Trigger debounced server update
    updateStateMileageServer(newStateMileage[index]);
  };

  useEffect(() => {
    setEditedStateMileage(StateMileage || []);
  }, [StateMileage]);

  // Validate all existing entries when startingMileage or StateMileage changes
  useEffect(() => {
    if (startingMileage) {
      const newValidationErrors: { [key: string]: string } = {};
      editedStateMileage.forEach((item) => {
        const validationMessage = getValidationMessage(
          item.stateLineMileage,
          item.id
        );
        if (validationMessage) {
          newValidationErrors[item.id] = validationMessage;
        }
      });
      setValidationErrors(newValidationErrors);
    }
  }, [startingMileage, editedStateMileage]);

  return (
    <Grids rows={"1"} className="h-full overflow-y-auto no-scrollbar mb-5">
      <div className=" row-start-1 row-end-2 h-full ">
        {editedStateMileage.length === 0 && (
          <Holds className="px-10 mt-4">
            <Texts size={"p5"} text={"gray"} className="italic">
              No State Mileage Logs Recorded
            </Texts>
            <Texts size={"p7"} text={"gray"}>
              {`(Tap the plus icon to add a log.)`}
            </Texts>
          </Holds>
        )}
        {editedStateMileage.map((sm, index) => (
          <div key={sm.id} className="mb-2">
            <SlidingDiv onSwipeLeft={() => handleDelete(sm.id)}>
              <Holds
                position={"row"}
                background={"white"}
                className={`w-full h-full  border-[3px] rounded-[10px]  border-black
              `}
              >
                <Holds
                  background={"white"}
                  size={"50"}
                  className="h-full justify-center px-2"
                >
                  <Selects
                    name="state"
                    value={sm.state || ""}
                    onChange={(e) => handleStateChange(index, e.target.value)}
                    className={`
                        border-none h-full text-xs text-center py-2  focus:outline-hidden ${
                          sm.state ? "text-app-black" : "text-app-red"
                        }
                    `}
                  >
                    <option value={""}>{t("State")}</option>
                    {StateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Selects>
                </Holds>
                <Holds
                  size={"50"}
                  background={"white"}
                  className={`h-full justify-center border-l-[3px] py-1 rounded-l-none border-black
                  } `}
                >
                  <Inputs
                    type="number"
                    name="stateLineMileage"
                    value={sm.stateLineMileage || ""}
                    placeholder={t("Mileage")}
                    onChange={(e) => handleMileageChange(index, e.target.value)}
                    onBlur={() => {
                      const formData = new FormData();
                      formData.append("id", sm.id);
                      formData.append("state", sm.state || "");
                      formData.append(
                        "stateLineMileage",
                        sm.stateLineMileage?.toString() || "0"
                      );
                      updateStateMileage(formData);
                    }}
                    className={
                      "h-full py-2 border-none text-xs text-center focus:outline-hidden focus:ring-0 empty: placeholder:text-app-red"
                    }
                  />
                </Holds>
              </Holds>
            </SlidingDiv>
            {validationErrors[sm.id] && (
              <div className="text-xs text-app-red text-center px-1 leading-tight">
                {validationErrors[sm.id]}
              </div>
            )}
          </div>
        ))}
      </div>
    </Grids>
  );
}
