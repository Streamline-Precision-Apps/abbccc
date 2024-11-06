"use client";
import "@/app/globals.css";
import { Holds } from "@/components/(reusable)/holds";
import AdminHome from "./_pages/admin-home";
// change back to async later
export default function Admins() {
  return (
    <Holds className="h-full w-full">
      <AdminHome />
    </Holds>
  );
}
