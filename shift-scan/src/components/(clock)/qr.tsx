"use client";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useRouter } from "next/navigation";
import { useScanData } from "@/app/context/JobSiteScanDataContext";
import { useTruckScanData } from "@/app/context/TruckScanDataContext";
import { useCurrentView } from "@/app/context/CurrentViewContext";

type QrReaderProps = {
  handleNextStep: () => void;
  handleScanTruck: () => void;
  handleScanJobsite: () => void;
  url: string;
};

export default function QR({
  handleNextStep,
  handleScanTruck,
  handleScanJobsite,
  url,
}: QrReaderProps) {
  const videoRef: React.MutableRefObject<HTMLVideoElement | null> =
    useRef(null);
  const qrScannerRef: React.MutableRefObject<QrScanner | null> = useRef(null);
  const [scanCount, setScanCount] = useState(0);
  const { setScanResult } = useScanData();
  const router = useRouter();
  const SCAN_THRESHOLD = 200;
  const { setTruckScanData } = useTruckScanData();
  const { setCurrentView } = useCurrentView();

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    try {
      if (result.data.startsWith("EQ")) {
        // If the scan result starts with "EQ", set the view and do not call handleNextStep
        setTruckScanData(result.data);
        setCurrentView("truck");
        handleScanTruck();
      } else {
        // Proceed as usual through clock in proccess.
        setScanResult({ data: result.data });
        qrScannerRef.current?.stop();
        handleNextStep();
      }
    } catch (error) {
      console.error("Error processing QR code:", error);
      alert("Invalid QR code");
      qrScannerRef.current?.stop();
      router.back();
      setTimeout(() => {
        alert("Invalid QR code");
      }, 100); // Delay the alert by 100 milliseconds
    }
  };

  const onScanFail = () => {
    setScanCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (videoRef.current) {
      const scanner = new QrScanner(
        videoRef.current,
        (result: QrScanner.ScanResult) => onScanSuccess(result),
        {
          onDecodeError: onScanFail,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
      qrScannerRef.current = scanner;

      QrScanner.hasCamera().then((hasCamera: boolean) => {
        if (hasCamera) {
          scanner
            .start()
            .catch((error: Error) =>
              console.error("Scanner start error:", error)
            );
        } else {
          console.error("No camera found");
        }
      });

      return () => {
        scanner.stop();
        scanner.destroy();
      };
    }
  }, []);

  useEffect(() => {
    if (scanCount >= SCAN_THRESHOLD) {
      qrScannerRef.current?.stop();
      router.push(url);
    }
  }, [scanCount, router]);

  return (
    <video
      ref={videoRef}
      className="h-full rounded-2xl border-4 bg-gray-300 border-black"
    />
  );
}
