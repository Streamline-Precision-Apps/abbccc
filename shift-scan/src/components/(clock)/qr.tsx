"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import QrScanner from "qr-scanner";
import { useRouter } from "next/navigation";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useCurrentView } from "@/app/context/CurrentViewContext";
import { useEQScanData } from "@/app/context/equipmentContext";

type QrReaderProps = {
  handleScanJobsite: () => void;
  url: string;
  clockInRole: string;
  type: string;
  handleNextStep: () => void;
};

export default function QR({
  handleScanJobsite,
  url,
  clockInRole,
  type,
  handleNextStep,
}: QrReaderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [scanCount, setScanCount] = useState(0);
  const router = useRouter();

  // Custom hooks
  const { setScanResult } = useScanData();
  const { setTruckScanData } = useTruckScanData();
  const { setCurrentView } = useCurrentView();
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
      handleScanJobsite();
    },
    [setScanResult, handleScanJobsite]
  );
  ///-----------------------End of scan processes-----------------------------------

  // QR code scan success handler, memoized with useCallback
  const handleScanSuccess = useCallback(
    (result: QrScanner.ScanResult) => {
      try {
        const { data } = result;

        if (type === "equipment") {
          processEquipmentScan(data);
        } else if (clockInRole === "general" || clockInRole === "mechanic") {
          processGeneralScan(data);
        } else {
          throw new Error("Invalid QR code");
        }
      } catch (error) {
        console.error("QR Code Processing Error:", error);
        qrScannerRef.current?.stop();
        router.back();
        alert("Invalid QR code");
      }
    },
    [type, clockInRole, processEquipmentScan, processGeneralScan, router]
  );

  // QR code scan fail handler
  const handleScanFail = useCallback(() => {
    setScanCount((prev) => prev + 1);
  }, []);

  // Initialize QR scanner
  useEffect(() => {
    if (!videoRef.current) return;

    const scanner = new QrScanner(videoRef.current, handleScanSuccess, {
      onDecodeError: handleScanFail,
      highlightScanRegion: true,
      highlightCodeOutline: true,
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

    return () => {
      scanner.stop();
      scanner.destroy();
    };
  }, [handleScanSuccess, handleScanFail]);

  // Handle excessive scan failures
  useEffect(() => {
    if (scanCount >= SCAN_THRESHOLD) {
      qrScannerRef.current?.stop();
      router.push(url);
    }
  }, [scanCount, router, url]);

  return (
    <video
      ref={videoRef}
      className="h-full rounded-2xl border-4 bg-gray-300 border-black"
      aria-label="QR scanner video stream"
    >
      Video stream not available. Please enable your camera.
    </video>
  );
}
