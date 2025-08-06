"use client";
import { setStartingMileage } from "@/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";

type StartingMileageProps = {
  startingMileage: number | null;
  setStartingMileage: (startingMileage: number | null) => void;
};

const StartingMileage = createContext<StartingMileageProps | undefined>(
  undefined,
);

export const StartingMileageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startingMileage, setStartingMileageState] = useState<number | null>(
    null,
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const { execute: executeServerAction } = useServerAction();

  // Initialize only once
  useEffect(() => {
    if (isInitialized) return;
    
    console.log("StartingMileageContext1");
    const initializeMileage = async () => {
      try {
        const previousStartingMileage = await fetchWithOfflineCache(
          "startingMileage",
          () =>
            fetch("/api/cookies?method=get&name=truck").then((res) =>
              res.json(),
            ),
        );
        if (previousStartingMileage && previousStartingMileage !== "") {
          setStartingMileageState(previousStartingMileage);
        }
      } catch (error) {
        console.error("Error fetching starting mileage cookie:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeMileage();
  }, [isInitialized]);

  // Save changes only after initialization
  useEffect(() => {
    if (!isInitialized || startingMileage === null) return;
    
    console.log("StartingMileageContext2");
    const setStartingMileageStateAsync = async () => {
      try {
        if (startingMileage !== null) {
          await executeServerAction(
            "setStartingMileage",
            setStartingMileage,
            startingMileage?.toString() || "",
          );
        }
      } catch (error) {
        console.error("Error saving starting mileage cookie:", error);
      }
    };
    setStartingMileageStateAsync();
  }, [startingMileage, executeServerAction, isInitialized]);

  // Removed redundant sync call - useOfflineSync hook handles auto-sync
  return (
    <StartingMileage.Provider
      value={{ startingMileage, setStartingMileage: setStartingMileageState }}
    >
      {children}
    </StartingMileage.Provider>
  );
};

export const useStartingMileage = () => {
  const context = useContext(StartingMileage);
  if (!context) {
    throw new Error(
      "useStartingMileage must be used within a StartingMileageProvider",
    );
  }
  return context;
};
