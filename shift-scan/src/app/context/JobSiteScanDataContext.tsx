"use client";
import { setJobSite } from "@/actions/cookieActions";
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
  const online = useOnlineStatus();
  const { execute: executeServerAction, syncQueued } = useServerAction();

  useEffect(() => {
    const initializeJobSite = async () => {
      try {
        const cookieData = await fetchWithOfflineCache(
          "jobSite",
          () => fetch("/api/cookies?method=get&name=jobSite").then((res) => res.json())
        );
        let jobSiteName = "";
        if (cookieData && cookieData !== "") {
          try {
            jobSiteName = await fetchWithOfflineCache(
              `jobSiteDetails_${cookieData}`,
              () => fetch(`/api/jobsites/${cookieData}`).then((res) => res.json()).then((details) => details?.name || "")
            );
          } catch (err) {
            jobSiteName = "";
          }
          setScanResult({
            qrCode: cookieData,
            name: jobSiteName,
          });
        }
      } catch (error) {
        console.error("Error initializing job site:", error);
      }
    };
    initializeJobSite();
  }, []);

  useEffect(() => {
    const saveJobSite = async () => {
      try {
        if (scanResult?.qrCode) {
          await executeServerAction("setJobSite", setJobSite, {
            code: scanResult.qrCode,
            label: scanResult.name,
          });
        }
      } catch (error) {
        console.error("Error saving job site:", error);
      }
    };
    saveJobSite();
  }, [scanResult, executeServerAction]);

  useEffect(() => {
    if (online) {
      syncQueued();
    }
  }, [online, syncQueued]);

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
