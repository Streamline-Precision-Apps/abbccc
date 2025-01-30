"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import QrScanner from "qr-scanner";
import { useRouter } from "next/navigation";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useEQScanData } from "@/app/context/equipmentContext";
import { useDBJobsite } from "@/app/context/dbCodeContext";
import { start } from "repl";

type QrReaderProps = {
  handleScanJobsite?: (type: string) => void;
  url: string;
  clockInRole: string;
  type: string;
  handleNextStep: () => void;
  startCamera: boolean;
  setStartCamera: React.Dispatch<React.SetStateAction<boolean>>;
  setFailedToScan: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function QR({
  handleScanJobsite,
  url,
  clockInRole,
  type,
  handleNextStep,
  startCamera,
  setStartCamera,
  setFailedToScan,
}: QrReaderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const router = useRouter();

  // Custom hooks
  const { jobsiteResults } = useDBJobsite();
  const { setScanResult } = useScanData();
  const { setscanEQResult } = useEQScanData();
  // Constants
  const SCAN_THRESHOLD = 200;

  // ------------------- Different scan processes below----------------------------
  // equipment process
  const processEquipmentScan = useCallback(
    (data: string) => {
      setscanEQResult({ data: data });
      qrScannerRef.current?.stop();
      handleNextStep();
    },
    [setscanEQResult, handleNextStep]
  );
  // general process
  const processGeneralScan = useCallback(
    (data: string) => {
      setScanResult({ data });
      qrScannerRef.current?.stop();
      if (handleScanJobsite) {
        handleScanJobsite(clockInRole);
      }
    },
    [setScanResult, handleScanJobsite, clockInRole]
  );
  ///-----------------------End of scan processes-----------------------------------

  // QR code scan success handler, memoized with useCallback
  const handleScanSuccess = useCallback(
    (result: QrScanner.ScanResult) => {
      try {
        const { data } = result;
        // Check if the scanned data is a valid QR code
        if (!jobsiteResults?.some((j) => j.qrId === data)) {
          throw new Error("Invalid QR code Scanned!");
        }
        if (type === "equipment") {
          processEquipmentScan(data);
        } else {
          processGeneralScan(data);
        }
      } catch (error) {
        console.error("QR Code Processing Error:", error);
        qrScannerRef.current?.stop();
        setStartCamera(false);
        setFailedToScan(true);
      }
    },
    [
      jobsiteResults,
      type,
      processEquipmentScan,
      processGeneralScan,
      setStartCamera,
      setFailedToScan,
    ]
  );

  // QR code scan fail handler
  const handleScanFail = useCallback(() => {
    setScanCount((prev) => prev + 1);
  }, []);

  // Initialize QR scanner
  useEffect(() => {
    if (!videoRef.current) return;

    if (startCamera) {
      const scanner = new QrScanner(videoRef.current, handleScanSuccess, {
        onDecodeError: handleScanFail,
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
        preferredCamera: "environment",
      });

      qrScannerRef.current = scanner;

      QrScanner.hasCamera().then((hasCamera) => {
        if (hasCamera) {
          scanner
            .start()
            .catch((err) => console.error("Scanner Start Error:", err));
        } else {
          console.error("No camera found");
        }
      });
    } else {
      // Stop scanner when startCamera is false
      qrScannerRef.current?.stop();
    }

    return () => {
      qrScannerRef.current?.stop();
    };
  }, [handleScanSuccess, handleScanFail, startCamera]);

  // Handle excessive scan failures
  useEffect(() => {
    if (scanCount >= SCAN_THRESHOLD) {
      qrScannerRef.current?.stop();
      setStartCamera(false);
    }
  }, [scanCount, router, setStartCamera]);

  return (
    <video
      ref={videoRef}
      className="h-fit w-full rounded-2xl border-4 bg-black bg-opacity-85 border-black p-[2%]"
      aria-label="QR scanner video stream"
    >
      Video stream not available. Please enable your camera.
    </video>
  );
}
