import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const signatureData = req.body.signatureData;

    // Write signature data to a file
    fs.writeFile("signature.txt", signatureData, (err) => {
      if (err) {
        console.error("Error saving signature:", err);
        res.status(500).json({ error: "Error saving signature" });
      } else {
        console.log("Signature saved successfully");
        res.status(200).json({ message: "Signature saved successfully" });
      }
    });
  } else if (req.method === "GET") {
    // Read signature data from a file
    fs.readFile("signature.txt", "utf8", (err, data) => {
      if (err) {
        console.error("Error loading signature:", err);
        res.status(500).json({ error: "Error loading signature" });
      } else {
        console.log("Signature loaded successfully");
        res.status(200).json({ signatureData: data });
      }
    });
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}