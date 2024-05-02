import React from "react";

const ConfirmationPage = ({ result }: { result: Record<string, string> }) => {
   return (
      <div className="confirmation-page flex flex-col items-center p-6">
         <h1 className="text-xl font-bold">Scan Successful!</h1>
         <h3 className="text-lg mt-2">Data:</h3>

         <ul className="mt-2">
            {/* List to display the scanned data */}
            {/* Iterating over the `result` object, treating each entry as a key-value pair */}
            {/* Display each entry in a list item, with some padding for visual separation */}
            {/* Show the key as bold, followed by its corresponding value */}
            {Object.entries(result).map(([key, value], index) => (
               <li key={index} className="py-1">
                  <strong>{key}:</strong> {value}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default ConfirmationPage;
