"use client";
import { setJobSite } from "@/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

// Define the shape of your scan result
type ScanResult = {
  qrCode: string; // The scanned QR code value
  name: string; // The associated name/label
};

// Context type
type ScanDataContextProps = {
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
};

const ScanDataContext = createContext<ScanDataContextProps | undefined>(
  undefined
);

export const ScanDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);

  // Initialize with cookie data
  useEffect(() => {
    const initializeJobSite = async () => {
      try {
        // Fetch both the QR code and name from your API
        const cookieData = await fetch(
          "/api/cookies?method=get&name=jobSite"
        ).then((res) => res.json());

        // If you need to fetch the name separately, you might need another endpoint
        // const jobSiteDetails = await fetch(`/api/jobsites/${cookieData}`).then(
        //   (res) => res.json()
        // );

        if (cookieData && cookieData !== "") {
          setScanResult({
            qrCode: cookieData,
            name: jobSiteDetails?.name || "", // Fallback to empty string if name not available
          });
        }
      } catch (error) {
        console.error("Error initializing job site:", error);
      }
    };

    initializeJobSite();
  }, []);

  // Save to cookies when scanResult changes
  useEffect(() => {
    const saveJobSite = async () => {
      try {
        if (scanResult?.qrCode) {
          await setJobSite({
            code: scanResult.qrCode,
            label: scanResult.name,
          });
        }
      } catch (error) {
        console.error("Error saving job site:", error);
      }
    };

    saveJobSite();
  }, [scanResult]);

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
