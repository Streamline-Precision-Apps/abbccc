"use client";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { Grids } from "@/components/(reusable)/grids";
import { useState } from "react";
import Sidebar from "./_pages/sidebar";
import Topbar from "./_pages/topbar";
import Dashboard from "./_pages/dashboard";
import { Holds } from "@/components/(reusable)/holds";
// change back to async later
export default function Admins() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const handleClockClick = () => {
    setIsOpen2(!isOpen2);
  };
  return (
    <Bases className="pb-5">
      <Holds position={"row"} className="w-full h-full py-5">
        {/*I added padding to avoid bottom white  */}
        <Sidebar isOpen={isOpen} toggle={toggle} />
        <Dashboard
          isOpen={isOpen}
          isOpen2={isOpen2}
          handleClockClick={handleClockClick}
        />
      </Holds>
    </Bases>
  );
}
