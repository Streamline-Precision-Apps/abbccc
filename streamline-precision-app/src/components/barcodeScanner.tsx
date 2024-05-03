import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import moment from "moment"; // For timestamp formatting
import axios from "axios"; // For API interaction
import ConfirmationPage from "../components/confirmationPage";

const QrReader = ({ user }: { user: { id: string; name: string } }) => {
   const scanner = useRef<QrScanner>();
   const videoEl = useRef<HTMLVideoElement>(null);
   const qrBoxEl = useRef<HTMLDivElement>(null);
   const [qrOn, setQrOn] = useState(true);
   const [scannedResult, setScannedResult] = useState<Record<string, string> | undefined>(undefined);

   const onScanSuccess = (result: QrScanner.ScanResult) => {
      console.log(result);

      const timestamp = moment().format("HH:mm:ss");
      const timestampDate = moment().format("MM-DD-YYYY");

      //I will need to change this later due to Strings rather then Objects
      
      const dataObject = {
         "Today's Date": timestampDate,
         "Job Site Number": result?.data,
         user: user.name,
         employeeId: user.id,
         "Clocked In At" : timestamp,
      };

      setScannedResult(dataObject);

      saveToFile(dataObject); // Send data to API route

      // Stop the scanner and transition away
      scanner.current?.stop();
      setQrOn(false);
   };

   const onScanFail = (err: string | Error) => {
      console.log(err);
   };

   useEffect(() => {
      if (videoEl.current && !scanner.current && qrOn) {
         scanner.current = new QrScanner(videoEl.current, onScanSuccess, {
            onDecodeError: onScanFail,
            preferredCamera: "environment",
            highlightScanRegion: true,
            highlightCodeOutline: true,
            overlay: qrBoxEl.current || undefined,
         });

         scanner.current
            .start()
            .then(() => setQrOn(true))
            .catch((err) => setQrOn(false));
      }
   }, [qrOn]);

   return (
      <div className="qr-reader flex flex-col items-center justify-center h-screen bg-gray-100">
         {scannedResult ? (
            <ConfirmationPage result={scannedResult} />
         ) : (
            <div className="flex flex-col items-center">
               <video ref={videoEl} className="w-64 h-64 mb-4"></video>
               <div ref={qrBoxEl} className="w-64 h-64 flex items-center justify-center relative border-4 border-blue-500 rounded-lg shadow-md">
                  <img
                     src="/assets/qr-frame.svg"
                     alt="QR Frame"
                     className="absolute w-full h-full"
                  />
               </div>
            </div>
         )}
      </div>
   );
};

const saveToFile = async (data: Record<string, any>) => {
   try {
      await axios.post("/api/writeData", data); // Call to the local API route
   } catch (error) {
      console.error("Error saving data:", error);
   }
};

export default QrReader;