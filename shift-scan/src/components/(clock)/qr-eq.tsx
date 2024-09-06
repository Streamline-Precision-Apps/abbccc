"use client";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useRouter } from 'next/navigation';
import { useEQScanData } from '@/app/context/equipmentContext';

interface QrReaderProps {
  handleNextStep: () => void;
}

const QR_EQ: React.FC<QrReaderProps> = ({ handleNextStep }) => {
  const videoRef: React.MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const qrScannerRef: React.MutableRefObject<QrScanner | null> = useRef(null);
  const [scanCount, setScanCount] = useState(0);
  const { setscanEQResult } = useEQScanData();
  const router = useRouter();
  const SCAN_THRESHOLD = 200; // Number of scans before redirecting

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    try {
      setscanEQResult({ data: result.data });
      qrScannerRef.current?.stop();
      handleNextStep();
    } catch (error) {
      console.error('Error processing QR code:', error);
      alert('Invalid QR code');
      qrScannerRef.current?.stop();
      router.back();
      setTimeout(() => {
        alert('Invalid QR code');
      }, 100); // Delay the alert by 100 milliseconds
    }
  };

  const onScanFail = (err: string | Error) => {
    setScanCount((prevCount) => prevCount + 1);
    console.warn('Scan failed:', err);
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
          scanner.start().catch((error: Error) => console.error('Scanner start error:', error));
        } else {
          console.error('No camera found');
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
      router.push('/dashboard');
    }
  }, [scanCount, router]);

  return (
      <video ref={videoRef} className="w-full h-[400px] rounded-2xl border-4 bg-gray-300 border-black"></video>
  );
};

export default QR_EQ;