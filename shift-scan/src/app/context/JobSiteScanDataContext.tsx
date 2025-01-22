// Saves any jobsite data scanned by the qr-scanner.

"use client";
import { setJobSite } from "@/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

type ScanDataContextProps = {
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
};

type ScanResult = {
  data: string;
};

const ScanDataContext = createContext<ScanDataContextProps | undefined>(
  undefined
);

export const ScanDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    const initializeJobSite = async () => {
      try {
        // Fetch cookie data once during initialization
        const previousJobsite = await fetch(
          "/api/cookies?method=get&name=jobSite"
        ).then((res) => res.json());

        if (previousJobsite && previousJobsite !== "") {
          setScanResult({ data: previousJobsite });
        }
      } catch (error) {
        console.error("Error fetching job site cookie:", error);
      }
    };

    initializeJobSite();
  }, []); // Run only on mount

  useEffect(() => {
    const saveJobSite = async () => {
      try {
        if (scanResult?.data && scanResult.data !== "") {
          await setJobSite(scanResult.data); // Set the cookie if scanResult changes
        }
      } catch (error) {
        console.error("Error setting job site cookie:", error);
      }
    };

    saveJobSite();
  }, [scanResult]); // Run whenever scanResult changes
  return (
    <ScanDataContext.Provider value={{ scanResult, setScanResult }}>
      {children}
    </ScanDataContext.Provider>
  );
};

export const useScanData = () => {
  const context = useContext(ScanDataContext);
  if (context === undefined) {
    throw new Error("useScanData must be used within a ScanDataProvider");
  }
  return context;
};
