import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSidebar } from "@/components/ui/sidebar";
import ReloadBtnSpinner from "@/components/(animations)/reload-btn-spinner";

type timesheetPending = {
  length: number;
};

export default function TimesheetDescription({
  setShowCreateModal,
  setExportModal,
  setShowPendingOnly,
  showPendingOnly,
  approvalInbox,
  loading,
  refetchAll,
}: {
  setShowCreateModal: (value: boolean) => void;
  setExportModal: (value: boolean) => void;
  setShowPendingOnly: (value: boolean) => void;
  showPendingOnly: boolean;
  approvalInbox: timesheetPending | null;
  loading: boolean;
  refetchAll: () => Promise<void>;
}) {
  const { setOpen, open } = useSidebar();
  return (
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
            Timesheets Management
          </p>
          <p className="text-left text-xs text-white">
            Create, manage, and track timesheets
          </p>
        </div>
      </div>

      <ReloadBtnSpinner isRefreshing={loading} fetchData={refetchAll} />
    </div>
  );
}
