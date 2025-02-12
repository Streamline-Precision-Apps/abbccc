"use client";

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import QrScanner from "qr-scanner";
import { Holds } from "../(reusable)/holds";

export default function SimpleQr({
  setScannedId,
}: {
  setScannedId: Dispatch<SetStateAction<string | null>>;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);

  const handleScanSuccess = useCallback(
    (result: QrScanner.ScanResult) => {
      try {
        const { data } = result;

        if (data) {
          setScannedId(data);
        }
      } catch (error) {
        console.error("Error processing scanned data:", error);
      }
    },
    [setScannedId]
  );

  useEffect(() => {
    if (videoRef.current) {
      // Initialize the QR scanner with a callback that saves scanned data
      const scanner = new QrScanner(videoRef.current, handleScanSuccess, {
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
        preferredCamera: "environment",
        calculateScanRegion: (video) => {
          const videoWidth = video.videoWidth;
          const videoHeight = video.videoHeight;
          const regionWidth = videoWidth * 0.3; // 80% of the video width
          const regionHeight = videoHeight * 0.5; // 80% of the video height
          const x = (videoWidth - regionWidth) / 2; // Center the region horizontally
          const y = (videoHeight - regionHeight) / 2; // Center the region vertically
          return {
            x,
            y,
            width: regionWidth,
            height: regionHeight,
            downScaledWidth: 400,
            downScaledHeight: 400,
          };
        },
      });

      qrScannerRef.current = scanner;

      // Check for camera availability before starting
      QrScanner.hasCamera().then((hasCamera) => {
        if (hasCamera) {
          scanner
            .start()
            .catch((err) => console.error("Error starting scanner:", err));
        } else {
          console.error("No camera found");
        }
      });
    }

    // Clean up: stop the scanner when the component unmounts
    return () => {
      qrScannerRef.current?.stop();
    };
  }, [handleScanSuccess]);

  return (
    <video
      ref={videoRef}
      className="w-full h-full rounded-[10px] border-[3px] border-black bg-black bg-opacity-85  object-cover"
      aria-label="QR scanner video stream"
    >
      Video stream not available. Please enable your camera.
    </video>
  );
}
