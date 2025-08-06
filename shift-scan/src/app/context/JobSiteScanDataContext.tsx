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

// Define the shape of your scan result
type ScanResult = {
  qrCode: string; // The scanned QR code value
  name: string; // The associated name/label
};

// Context type

/**
 * Context type for job site scan data, including error state.
 */
type ScanDataContextProps = {
  scanResult: ScanResult | null;
  setScanResult: (result: ScanResult | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

const ScanDataContext = createContext<ScanDataContextProps | undefined>(
  undefined,
);

export const ScanDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const { execute: executeServerAction } = useServerAction();
  const [error, setError] = useState<string | null>(null);

  // Initialize only once
  useEffect(() => {
    if (isInitialized) return;

    console.log("JobSiteScanDataContext1");
    const initializeJobSite = async () => {
      try {
        const cookieRes = await fetch("/api/cookies?method=get&name=jobSite");
        if (!cookieRes.ok) {
          setError("Failed to fetch job site cookie.");
          setScanResult(null);
          return;
        }
        const cookieData = await cookieRes.json();
        if (!cookieData || cookieData === "") {
          setError("No job site cookie found.");
          setScanResult(null);
          return;
        }
        let jobSiteName = "";
        try {
          const jobSiteRes = await fetch(`/api/jobsites/${cookieData}`);
          if (!jobSiteRes.ok) {
            setError("Failed to fetch job site details.");
            setScanResult(null);
            return;
          }
          const jobSiteDetails = await jobSiteRes.json();
          jobSiteName = jobSiteDetails?.name || "";
        } catch (err) {
          setError("Error fetching job site details.");
          setScanResult(null);
          return;
        }
        setScanResult({
          qrCode: cookieData,
          name: jobSiteName,
        });
        setError(null);
      } catch (error) {
        setError("Error initializing job site.");
        setScanResult(null);
        console.error("Error initializing job site:", error);
      } finally {
        setIsInitialized(true);
      }
    };
    initializeJobSite();
  }, [isInitialized]);

  // Save changes only after initialization
  useEffect(() => {
    if (!isInitialized || !scanResult?.qrCode) return;

    console.log("JobSiteScanDataContext2");
    const saveJobSite = async () => {
      try {
        if (scanResult?.qrCode) {
          await executeServerAction("setJobSite", setJobSite, {
            code: scanResult.qrCode,
            label: scanResult.name,
          });
        }
      } catch (error) {
        setError("Error saving job site.");
        console.error("Error saving job site:", error);
      }
    };
    saveJobSite();
  }, [scanResult, executeServerAction, isInitialized]);

  // Removed redundant sync call - useOfflineSync hook handles auto-sync

  return (
    <ScanDataContext.Provider
      value={{ scanResult, setScanResult, error, setError }}
    >
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
