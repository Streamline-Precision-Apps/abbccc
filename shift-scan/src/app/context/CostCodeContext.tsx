// This is used to store the state of costcode.

"use client";
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
import { setCostCode as setCostCodeCookie } from "@/actions/cookieActions";
// creates a prop to be passes to a context
type SavedCostCodeProps = {
  savedCostCode: string | null;
  setCostCode: (costCode: string | null) => void;
};
// creates a value to a savedCostCode context
type savedCostCode = {
  savedCostCode: string;
};
// creates a context for the savedCostCode we pass this through the export
const savedCostCode = createContext<SavedCostCodeProps | undefined>(undefined);

export const SavedCostCodeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [costcode, setCostCode] = useState<string | null>(null);
  const online = useOnlineStatus();
  const { execute: executeServerAction, syncQueued } = useServerAction();

  useEffect(() => {
    const initializeCostCode = async () => {
      try {
        const previousCostCode = await fetchWithOfflineCache("costCode", () =>
          fetch("/api/cookies?method=get&name=costCode").then((res) =>
            res.json()
          )
        );
        if (previousCostCode && previousCostCode !== "") {
          setCostCode(previousCostCode);
        }
      } catch (error) {
        console.error("Error fetching job site cookie:", error);
      }
    };
    initializeCostCode();
  }, []);

  // when the provider is called it will return the value below
  useEffect(() => {
    const savedCostCodeAsync = async () => {
      try {
        if (costcode !== "") {
          await executeServerAction(
            "setCostCodeCookie",
            setCostCodeCookie,
            costcode || ""
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    savedCostCodeAsync();
  }, [costcode, executeServerAction]);

  useEffect(() => {
    if (online) {
      syncQueued();
    }
  }, [online, syncQueued]);
  return (
    <savedCostCode.Provider value={{ savedCostCode: costcode, setCostCode }}>
      {children}
    </savedCostCode.Provider>
  );
};
// this is used to get the value of the savedCostCode
export const useSavedCostCode = () => {
  const context = useContext(savedCostCode);
  if (context === undefined) {
    throw new Error("useScanData must be used within a ScanDataProvider");
  }
  return context;
};
