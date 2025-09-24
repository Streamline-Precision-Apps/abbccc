// this is a context to hold an equipment used in the app the operator labor type.
"use client";
import { setEquipment } from "@/actions/cookieActions";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";
import { useSession } from "next-auth/react";
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
  const [isInitialized, setIsInitialized] = useState(false);
  const { execute: executeServerAction } = useServerAction();
  const { data: session, status } = useSession();

  // Load initial state from localStorage if available - ONLY ONCE
  useEffect(() => {
    if (isInitialized || status === "loading") return; // Prevent multiple initializations
    
    // Only make API calls if user is authenticated
    if (status === "unauthenticated") {
      setIsInitialized(true);
      return;
    }

    const initializeEquipment = async () => {
      try {
        // Fetch cookie data once during initialization
        const previousTruck = await fetchWithOfflineCache(
          "equipment-cookie",
          () =>
            fetch("/api/cookies?method=get&name=equipment").then((res) =>
              res.json(),
            ),
        );

        if (previousTruck && previousTruck !== "") {
          setEquipmentId(previousTruck);
        }
      } catch (error) {
        console.error("Error fetching equipment cookie:", error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeEquipment();
  }, [isInitialized, status]); // Only depend on initialization state

  // Save equipment ID changes - but only after initialization and when value actually changes
  useEffect(() => {
    if (!isInitialized || equipmentId === null) return; // Don't save during initialization

    console.log("operatorContext2");
    const saveEquipmentId = async () => {
      try {
        if (equipmentId !== "") {
          await executeServerAction(
            "setEquipment",
            setEquipment,
            equipmentId || "",
          ); // Use wrapped server action
        }
      } catch (error) {
        console.error("Error saving equipment cookie:", error);
      }
    };
    
    // Properly handle the async function call
    saveEquipmentId().catch((error) => {
      console.error("Unhandled error in saveEquipmentId:", error);
    });
  }, [equipmentId, executeServerAction, isInitialized]); // Include isInitialized to prevent premature saves

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
