"use client"; // Ensure this directive is at the top

import { useState } from "react";
import QrReader from "../components/barcodeScanner";

export default function Home() {
   const [openQr, setOpenQr] = useState<boolean>(false);

   // Example user object
   const user = { id: "123", name: "John Doe" };

   return (
      <div className="p-4">
         <button
            onClick={() => setOpenQr(!openQr)}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
         >
            QR Scanner {openQr ? "Cancel" : "Clock-in"}
         </button>

         {openQr && <QrReader user={user} />} {/* Pass the user prop */}
      </div>
   );
}