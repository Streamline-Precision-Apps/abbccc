'use client';
import React, { useState, useEffect, useRef, MutableRefObject } from "react";
import QrScanner from "qr-scanner";
import { useRouter } from 'next/navigation';
import { useScanData } from '@/app/context/JobSiteContext';



const QrReader: React.FC = () => {
    const videoRef: MutableRefObject<HTMLVideoElement | null> = useRef(null);
    const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
    const [scanCount, setScanCount] = useState(0);
    const { setScanResult } = useScanData();
    const router = useRouter();
    const SCAN_THRESHOLD = 200; // Number of scans before redirecting

    const onScanSuccess = (result: QrScanner.ScanResult) => {
        setScanResult({ data: result.data });

        // Stop the scanner
        qrScanner?.stop();
        // Navigate to the new page
        router.push('/clock/costcode');
    };

    const onScanFail = (err: string | Error) => {
        // console.error(err);
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

export default QrReader;