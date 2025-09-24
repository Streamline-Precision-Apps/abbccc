"use client";
import { setJobSite } from "@/actions/cookieActions";
import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";
import { useSession } from "next-auth/react";
import { fetchWithOfflineCache } from "@/utils/offlineApi";
import { useServerAction } from "@/utils/serverActionWrapper";
import { useOffline } from "@/providers/OfflineProvider";

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
  const { data: session, status } = useSession();
  const { isOnline } = useOffline();

  // Initialize only once - but only when user is authenticated
  useEffect(() => {
    if (isInitialized || status === "loading") return;

    // Only make API calls if user is authenticated
    if (status === "unauthenticated") {
      setIsInitialized(true);
      return;
    }

    // Skip initialization if offline to prevent fetch errors
    if (!isOnline) {
      console.log("Skipping job site initialization while offline");
      setIsInitialized(true);
      return;
    }

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
          // Extract the code if cookieData is an object, otherwise use it directly
          let jobSiteId = cookieData;

          // Handle cases where cookieData might be a stringified JSON
          if (typeof cookieData === "string") {
            try {
              const parsed = JSON.parse(cookieData);
              jobSiteId = parsed.code || parsed;
            } catch {
              // If parsing fails, use the string as-is
              jobSiteId = cookieData;
            }
          } else if (typeof cookieData === "object" && cookieData?.code) {
            jobSiteId = cookieData.code;
          }

          // Use fetchWithOfflineCache for offline compatibility
          const jobSiteDetails = await fetchWithOfflineCache(
            `jobsite-${jobSiteId}`,
            async () => {
              const response = await fetch(
                `/api/jobsites/${encodeURIComponent(jobSiteId)}`,
              );
              if (!response.ok) {
                throw new Error(`Failed to fetch job site: ${response.status}`);
              }
              return response.json();
            },
          );

          if (!jobSiteDetails) {
            setError("Failed to fetch job site details.");
            setScanResult(null);
            return;
          }
          jobSiteName = jobSiteDetails?.name || "";
        } catch (err) {
          setError("Error fetching job site details.");
          setScanResult(null);
          return;
        }
        // Use the actual ID for qrCode, not the whole object
        const jobSiteId =
          typeof cookieData === "object" && cookieData?.code
            ? cookieData.code
            : cookieData;
        setScanResult({
          qrCode: jobSiteId,
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

    // Wrap the async call to prevent unhandled rejections
    initializeJobSite().catch((error) => {
      console.error("Unhandled error in initializeJobSite:", error);
      setError("Error initializing job site.");
      setScanResult(null);
      setIsInitialized(true);
    });
  }, [isInitialized, status]); // Remove isOnline dependency to prevent re-running when network changes

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

    // Properly handle the async function call
    saveJobSite().catch((error) => {
      console.error("Unhandled error in saveJobSite:", error);
      setError("Error saving job site.");
    });
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
