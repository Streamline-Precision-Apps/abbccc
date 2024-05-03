// pages/api/writeData.js
const fs = require("fs");

export default function handler(req, res) {
   if (req.method !== "POST") {
      res.status(405).json({ message: "Method Not Allowed" });
      return;
   }

   const data = req.body;

   // Convert the data to a string representation
   const textData = Object.entries(data)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");

   // Write the string data to a text file
   fs.writeFile("data.txt", textData, (err) => {
      if (err) {
         res.status(500).json({ message: "Error writing data to file", error: err });
      } else {
         res.status(200).json({ message: "Data successfully written to file" });
      }
   });
}