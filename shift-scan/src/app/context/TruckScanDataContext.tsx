"use client";
import { setTruck } from "@/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type TruckScanDataProps = {
  truckScanData: string | null;
  setTruckScanData: (truckScanData: string | null) => void;
};

const TruckScanData = createContext<TruckScanDataProps | undefined>(undefined);

export const TruckScanDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [truckScanData, setTruckScanDataState] = useState<string | null>(null);
  // Load initial state from localStorage if available
  useEffect(() => {
    const initializeTruck = async () => {
      try {
        // Fetch cookie data once during initialization
        const previousTruck = await fetch(
          "/api/cookies?method=get&name=truckId"
        ).then((res) => res.json());

        if (previousTruck && previousTruck !== "") {
          setTruckScanDataState(previousTruck);
        }
      } catch (error) {
        console.error("Error fetching job site cookie:", error);
      }
    };

    initializeTruck();
  }, []); // Run only on mount

  useEffect(() => {
    const setTruckScanData = async () => {
      try {
        if (truckScanData !== "") {
          await setTruck(truckScanData || ""); // Set the cookie if scanResult changes
        }
      } catch (error) {
        console.error("Error saving job site cookie:", error);
      }
    };
    setTruckScanData();
  }, [truckScanData]);
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
      "useTruckScanData must be used within a TruckScanDataProvider"
    );
  }
  return context;
};
