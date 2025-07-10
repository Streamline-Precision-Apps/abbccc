"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useSidebar } from "@/components/ui/sidebar";
import SearchBar from "../personnel/components/SearchBar";
import { useState } from "react";
import EquipmentTable from "./_components/equipmentTable";
import { ApprovalStatus } from "@/lib/enums";
type EquipmentSummary = {
  id: string;
  name: string;
  approvalStatus: ApprovalStatus;
};

export default function EquipmentPage() {
  const { setOpen, open } = useSidebar();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-full p-4 grid grid-rows-[3rem_2rem_1fr] gap-4">
      <div className="h-full row-span-1 max-h-12 w-full flex flex-row justify-between gap-4 ">
        <div className="w-full flex flex-row gap-5 ">
          <div className="flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 p-0 hover:bg-slate-500 hover:bg-opacity-20 ${
                open ? "bg-slate-500 bg-opacity-20" : "bg-app-blue "
              }`}
              onClick={() => {
                setOpen(!open);
              }}
            >
              <img
                src={open ? "/condense-white.svg" : "/condense.svg"}
                alt="logo"
                className="w-4 h-auto object-contain "
              />
            </Button>
          </div>
          <div className="w-full flex flex-col gap-1">
            <p className="text-left w-fit text-base text-white font-bold">
              Equipment Management
            </p>
            <p className="text-left text-xs text-white">
              Create, edit, and manage equipment details
            </p>
          </div>
        </div>
        <div>
          <Button>
            <img
              src="/plus-white.svg"
              alt="Add Equipment"
              className="w-4 h-4"
            />
            <p className="text-left text-xs text-white">Create Equipment</p>
          </Button>
        </div>
      </div>
      <div className="h-fit w-full flex flex-row justify-between gap-4 mb-2 ">
        <div className="flex flex-row w-full gap-4 mb-2">
          <div className="h-full w-full p-1 bg-white max-w-[450px] rounded-lg ">
            <SearchBar
              term={searchTerm}
              handleSearchChange={(e) => setSearchTerm(e.target.value)}
              placeholder={"Search forms by name..."}
              textSize="xs"
              imageSize="6"
            />
          </div>
        </div>
      </div>

      <ScrollArea
        alwaysVisible
        className="h-full w-full  bg-white rounded-lg  border border-slate-200 relative"
      >
        <EquipmentTable />
        <div className="h-3 bg-slate-100 border-y border-slate-200 absolute bottom-0 right-0 left-0">
          <ScrollBar
            orientation="horizontal"
            className="w-full h-3 ml-2 mr-2 rounded-full"
          />
        </div>
      </ScrollArea>
    </div>
  );
}
