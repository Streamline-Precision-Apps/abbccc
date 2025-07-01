"use client";
import "@/app/globals.css";
import { Holds } from "@/components/(reusable)/holds";

// change back to async later
export default function Admins() {
  return (
    <Holds className="h-full w-full">
      <p className="text-xl text-white">Dashboard</p>
    </Holds>
  );
}
