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
    const savedJobSite = async () => {
      try {
        setJobSite(scanResult?.data || "");
      } catch (error) {
        console.error(error);
      }
    };
    savedJobSite();
  }, [scanResult?.data]);
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
