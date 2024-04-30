
"use client";  // Ensure this is a client component

import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import dayjs from 'dayjs';

const QRScanner = () => {
    const [scannedData, setScannedData] = useState("");
    const [clockedIn, setClockedIn] = useState(false);

    const handleScan = (result) => {
        if (result) {
            try {
                const textData = result.getText();  // Capture raw text data
                setScannedData(textData);  // Store as is
                handleClockIn(textData);  // Trigger the clock-in event
            } catch (e) {
                console.error("Error processing scan:", e);
            }
        }
    };

    const handleError = (err) => {
        console.error(err);
    };

    const handleClockIn = (data) => {
        // Parse data into an object if needed
        try {
            const parsedData = JSON.parse(data);

            // Check the clock-in time to ensure it's valid or run any needed checks
            console.log("Clocked In:", parsedData.clockInTime, parsedData.jobSiteNumber);

            setClockedIn(true);  // Indicate successful clock-in
        } catch (e) {
            console.error("Error processing clock-in data:", e);
        }
    };

    return (
        <div className="scanner">
            <h3>Scan a QR Code:</h3>
            <QrReader
                onResult={(result, error) => {
                    if (result) handleScan(result);
                    else if (error) handleError(error);
                }}
                constraints={{ facingMode: "environment" }}
            />

            {scannedData && (
                <div className="result">
                    <h3>Scanned Data:</h3>
                    <pre>{scannedData}</pre>  // Display raw text data
                </div>
            )}

            {clockedIn && (
                <div className="clockedInMessage">
                    <h3>Clocked In Successfully!</h3>
                </div>
            )}
        </div>
    );
};

export default QRScanner;