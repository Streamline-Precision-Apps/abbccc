import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="h-fit flex flex-row w-full justify-between items-center px-4 py-2">
      <div className="min-w-[900px] flex flex-col gap-1">
        <p className="text-left w-fit text-lg text-white font-bold">
          Timesheets Management
        </p>
        <p className="text-left text-sm text-white">
          Create, manage, and track timesheet submissions
        </p>
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
