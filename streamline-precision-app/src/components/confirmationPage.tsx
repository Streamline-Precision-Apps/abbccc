// ConfirmationPage.tsx
import React from "react";

const ConfirmationPage = ({ result }: { result: string }) => {
   // Example: splitting a comma-separated string into an array
   const dataParts = result.split(","); // Adjust this split based on the structure of your text.

   return (
      <div className="confirmation-page">
         <h1>Scan Successful!</h1>
         <h3>Data:</h3>

         {/* Render each part of the split string */}
         <ul>
            {dataParts.map((part, index) => (
               <li key={index}>{part.trim()}</li> // `trim()` removes leading/trailing whitespace
            ))}
         </ul>
      </div>
   );
};

export default ConfirmationPage;