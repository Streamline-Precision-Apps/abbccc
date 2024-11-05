"use client";
import "@/app/globals.css";
import { Holds } from "@/components/(reusable)/holds";
import { AdminSettings } from "../_pages/AdminSettings";

// change back to async later
export default function Admins() {
  return (
    <Holds className=" w-[95%] h-full">
      <AdminSettings />
    </Holds>
  );
}
