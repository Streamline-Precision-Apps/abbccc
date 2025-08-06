"use client";
import { setTruck } from "@/actions/cookieActions";
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

type TruckScanDataProps = {
  truckScanData: string | null;
  setTruckScanData: (truckScanData: string | null) => void;
};

const TruckScanData = createContext<TruckScanDataProps | undefined>(undefined);

export const TruckScanDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [truckScanData, setTruckScanDataState] = useState<string | null>(null);
  const online = useOnlineStatus();
  const { execute: executeServerAction, syncQueued } = useServerAction();

  useEffect(() => {
    const initializeTruck = async () => {
      try {
        // Use offline cache for API data
        const previousTruck = await fetchWithOfflineCache("truckId", () =>
          fetch("/api/cookies?method=get&name=truckId").then((res) =>
            res.json(),
          ),
        );
        if (previousTruck && previousTruck !== "") {
          setTruckScanDataState(previousTruck);
        }
      } catch (error) {
        console.error("Error fetching job site cookie:", error);
      }
    };
    initializeTruck();
  }, []);

  useEffect(() => {
    const setTruckScanData = async () => {
      try {
        if (truckScanData !== "") {
          await executeServerAction("setTruck", setTruck, truckScanData || ""); // Use wrapped server action
        }
      } catch (error) {
        console.error("Error saving job site cookie:", error);
      }
    };
    setTruckScanData();
  }, [truckScanData, executeServerAction]);

  // Removed redundant sync call - useOfflineSync hook handles auto-sync
  return (
    <TruckScanData.Provider
      value={{ truckScanData, setTruckScanData: setTruckScanDataState }}
    >
      {children}
    </TruckScanData.Provider>
  );
};

export const useTruckScanData = () => {
  const context = useContext(TruckScanData);
  if (!context) {
    throw new Error(
      "useTruckScanData must be used within a TruckScanDataProvider",
    );
  }
  return context;
};
