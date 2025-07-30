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
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

type StartingMileageProps = {
  startingMileage: number | null;
  setStartingMileage: (startingMileage: number | null) => void;
};

const StartingMileage = createContext<StartingMileageProps | undefined>(
  undefined
);

export const StartingMileageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [startingMileage, setStartingMileageState] = useState<number | null>(null);
  const online = useOnlineStatus();
  const { execute: executeServerAction, syncQueued } = useServerAction();

  useEffect(() => {
    const initializeMileage = async () => {
      try {
        const previousStartingMileage = await fetchWithOfflineCache(
          "startingMileage",
          () => fetch("/api/cookies?method=get&name=truck").then((res) => res.json())
        );
        if (previousStartingMileage && previousStartingMileage !== "") {
          setStartingMileageState(previousStartingMileage);
        }
      } catch (error) {
        console.error("Error fetching job site cookie:", error);
      }
    };
    initializeMileage();
  }, []);

  useEffect(() => {
    const setStartingMileageStateAsync = async () => {
      try {
        if (startingMileage !== null) {
          await executeServerAction("setStartingMileage", setStartingMileage, startingMileage?.toString() || "");
        }
      } catch (error) {
        console.error("Error saving job site cookie:", error);
      }
    };
    setStartingMileageStateAsync();
  }, [startingMileage, executeServerAction]);

  useEffect(() => {
    if (online) {
      syncQueued();
    }
  }, [online, syncQueued]);
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
      "useStartingMileage must be used within a StartingMileageProvider"
    );
  }
  return context;
};
