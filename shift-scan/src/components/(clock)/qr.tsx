"use client";
import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { useRouter } from 'next/navigation';
import { useScanData } from '@/app/context/JobSiteContext';

interface QrReaderProps {
  handleNextStep: () => void;
}

const QR: React.FC<QrReaderProps> = ({ handleNextStep }) => {
  const videoRef: React.MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const qrScannerRef: React.MutableRefObject<QrScanner | null> = useRef(null);
  const [scanCount, setScanCount] = useState(0);
  const { setScanResult } = useScanData();
  const router = useRouter();
  const SCAN_THRESHOLD = 200; // Number of scans before redirecting

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    try {
      console.log(result.data);
      console.log('I scanned using jobsite QR');
      setScanResult({ data: result.data });
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
      router.push('/');
    }
  }, [scanCount, router]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <video ref={videoRef} style={{ width: '100%' }}></video>
    </div>
  );
};

export default QR;