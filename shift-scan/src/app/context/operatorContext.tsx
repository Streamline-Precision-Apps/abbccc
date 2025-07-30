// this is a context to hold an equipment used in the app the operator labor type.
"use client";
import { setEquipment } from "@/actions/cookieActions";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type EquipmentIdProps = {
  equipmentId: string | null;
  setEquipmentId: (equipmentId: string | null) => void;
};

const EquipmentData = createContext<EquipmentIdProps | undefined>(undefined);

export const EquipmentIdProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [equipmentId, setEquipmentId] = useState<string | null>(null);
  const online = useOnlineStatus();
  const { execute: executeServerAction } = useServerAction();

  // Load initial state from localStorage if available
  useEffect(() => {
    const initializeEquipment = async () => {
      try {
        // Fetch cookie data once during initialization
        const previousTruck = await fetchWithOfflineCache(
          "equipment-cookie",
          () => fetch("/api/cookies?method=get&name=equipment").then((res) => res.json())
        );

        if (previousTruck && previousTruck !== "") {
          setEquipmentId(previousTruck);
        }
      } catch (error) {
        console.error("Error fetching job site cookie:", error);
      }
    };

    initializeEquipment();
  }, [online]); // Run when online status changes

  useEffect(() => {
    const saveEquipmentId = async () => {
      // Renamed function
      try {
        if (equipmentId !== "") {
          await executeServerAction("setEquipment", setEquipment, equipmentId || ""); // Use wrapped server action
        }
      } catch (error) {
        console.error("Error saving equipment cookie:", error);
      }
    };
    saveEquipmentId();
  }, [equipmentId, executeServerAction]);

  return (
    <EquipmentData.Provider value={{ equipmentId, setEquipmentId }}>
      {children}
    </EquipmentData.Provider>
  );
};

export const useOperator = () => {
  const context = useContext(EquipmentData);
  if (!context) {
    throw new Error("useOperator must be used within a EquipmentIdProvider"); // Updated error message
  }
  return context;
};
