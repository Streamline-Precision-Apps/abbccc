"use client";
import React, { useEffect, useState, useRef, MutableRefObject } from "react";
import QrScanner from "qr-scanner";
import { useRouter } from 'next/navigation';
import { useEQScanData } from '@/app/context/equipmentContext';

interface QrReaderProps {
handleNextStep: () => void;
}

const QR_EQ: React.FC<QrReaderProps> = ({ handleNextStep }) => {
const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
const [scanCount, setScanCount] = useState(0);
const { setscanEQResult } = useEQScanData();
const router = useRouter();
const SCAN_THRESHOLD = 200; // Number of scans before redirecting

const onScanSuccess = (result: QrScanner.ScanResult) => {
try {
    
    setscanEQResult({ data: result.data });
    qrScanner?.stop();
    handleNextStep();

} catch (error) {
    alert('Invalid QR code');
    qrScanner?.stop();
    router.back();
    setTimeout(() => {
        alert('Invalid QR code');
    }, 100); // Delay the alert by 100 milliseconds
}
};

const onScanFail = (err: string | Error) => {
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
    setQrScanner(scanner);

    QrScanner.hasCamera().then((hasCamera: boolean) => {
    if (hasCamera) {
        scanner.start().catch((error: Error) => console.error(error));
    } else {
        console.error('No camera found');
    }
    });

    return () => {
    scanner.destroy();
    };
}
}, [videoRef]);

useEffect(() => {
if (scanCount >= SCAN_THRESHOLD) {
    qrScanner?.stop();
    router.push('/');
}
}, [scanCount, qrScanner, router]);

return (
<div className="flex justify-center items-center">
    <video ref={videoRef} style={{ width: '100%' }}></video>
</div>
);
};

export default QR_EQ;