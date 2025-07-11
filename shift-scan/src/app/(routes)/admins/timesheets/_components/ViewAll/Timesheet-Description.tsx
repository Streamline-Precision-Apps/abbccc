import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import Link from "next/link";

type timesheetPending = {
  length: number;
};

export default function TimesheetDescription({
  setShowCreateModal,
  setExportModal,
  setShowPendingOnly,
  showPendingOnly,
  approvalInbox,
}: {
  setShowCreateModal: (value: boolean) => void;
  setExportModal: (value: boolean) => void;
  setShowPendingOnly: (value: boolean) => void;
  showPendingOnly: boolean;
  approvalInbox: timesheetPending | null;
}) {
  const { setOpen, open } = useSidebar();
  return (
    <div className="h-fit w-full flex flex-row justify-between mb-4">
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
            Timesheets Management
          </p>
          <p className="text-left text-xs text-white">
            Create, manage, and track timesheets
          </p>
        </div>
      </div>
      <div className="w-full flex flex-row justify-end h-full">
        <Button
          onClick={() => setExportModal(true)}
          size={"icon"}
          className=" relative border-none hover:bg-gray-800 text-white mr-2"
        >
          <div className="flex w-fit h-fit flex-row items-center">
            <img src="/export-white.svg" alt="Export" className="h-4 w-4 " />
          </div>
        </Button>
        <Button
          className="border-none w-fit h-fit px-4  hover:bg-gray-800 text-white mr-2"
          onClick={() => setShowCreateModal(true)}
        >
          <div className="items-center flex flex-row">
            <img
              src="/plus-white.svg"
              alt="Create New Form"
              className="h-4 w-4 mr-2"
            />
            <p className="text-white  text-sm font-extrabold">New Timesheet</p>
          </div>
        </Button>

        <Button
          onClick={() => setShowPendingOnly(!showPendingOnly)}
          className={`relative border-none w-fit h-fit px-4 bg-gray-900 hover:bg-gray-800 text-white ${
            showPendingOnly ? "ring-2 ring-red-400" : ""
          }`}
        >
          <div className="flex flex-row items-center">
            <img
              src="/inbox-white.svg"
              alt="Approval"
              className="h-4 w-4 mr-2"
            />
            <p className="text-white text-sm font-extrabold">Approval</p>
            {approvalInbox && approvalInbox.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 text-xs rounded-full">
                {approvalInbox.length}
              </Badge>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}
