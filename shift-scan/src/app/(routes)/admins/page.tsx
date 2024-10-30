"use client";
import "@/app/globals.css";
import { Bases } from "@/components/(reusable)/bases";
import { useState } from "react";
import Sidebar from "./_pages/sidebar";
import Dashboard from "./_pages/dashboard";
import { Holds } from "@/components/(reusable)/holds";
// change back to async later
export default function Admins() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [page, setPage] = useState(0);
  const toggle = () => setIsOpen(!isOpen);
  const handleClockClick = () => {
    setIsOpen2(!isOpen2);
  };
  return (
    <Bases className="pb-5">
      <Holds position={"row"} className="w-full h-full">
        {/*I added padding to avoid bottom white  */}
        <Sidebar
          isOpen={isOpen}
          toggle={toggle}
          page={page}
          setPage={setPage}
        />
        <Dashboard
          isOpen2={isOpen2}
          handleClockClick={handleClockClick}
          page={page}
          setPage={setPage}
        />
      </Holds>
    </Bases>
  );
}
