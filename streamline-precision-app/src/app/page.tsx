"use client";
// React
import { useState } from "react";
import QrReader from "../components/barcodeScanner";

export default function Home() {
  const [openQr, setOpenQr] = useState<boolean>(false);
  return (
    <div>
      <button onClick={() => setOpenQr(!openQr)}>
        {openQr ? "Close" : "Open"} QR Scanner
      </button>
      {openQr && <QrReader />}
    </div>
  );
}