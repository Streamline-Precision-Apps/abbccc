"use client";
import "@/app/globals.css";
import useLeftSideTrigger from "./_pages/useLeftSideTrigger";
import LeftSidebar from "./_pages/leftSide";
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// change back to async later
export default function Admins() {
  const { isOpen, toggleSidebar } = useLeftSideTrigger();
  return (
    <div className="h-full w-full flex flex-row">
      <LeftSidebar isOpen={isOpen} />
      <ScrollArea className=" h-full w-full p-3 overflow-y-auto no-scrollbar relative">
        <div className="flex flex-row p-3 h-[60px]">
          <Button
            onClick={toggleSidebar}
            variant="default"
            className="w-10 h-fit bg-transparent mr-6"
          >
            <PanelLeft />
          </Button>
          <p className="text-xl text-white">Dashboard</p>
        </div>
        <div className="flex-1 min-h-0 h-full p-3 overflow-y-auto no-scrollbar">
          {/* Main content goes here */}
          <p className="text-white">Welcome to the Admin Dashboard</p>
          {/* Add more components or content as needed */}
        </div>
      </ScrollArea>
    </div>
  );
}
