"use clients";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBarPopover from "../../../_pages/searchBarPopover";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Dispatch, SetStateAction } from "react";
import { FormIndividualTemplate } from "./hooks/types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface PageProps {
  setShowExportModal: Dispatch<SetStateAction<boolean>>;
  openHandleDelete: (id: string) => void;
  formTemplate: FormIndividualTemplate | undefined;
  setShowCreateModal: Dispatch<SetStateAction<boolean>>;
  router: AppRouterInstance;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  dateRange: { start?: Date; end?: Date };
  setDateRange: Dispatch<
    SetStateAction<{
      start: Date | undefined;
      end: Date | undefined;
    }>
  >;
  statusFilter: "DRAFT" | "PENDING" | "APPROVED" | "DENIED" | "ALL";
  setStatusFilter: Dispatch<
    SetStateAction<"DRAFT" | "PENDING" | "APPROVED" | "DENIED" | "ALL">
  >;
  FormStatus: {
    DRAFT: "DRAFT";
    PENDING: "PENDING";
    APPROVED: "APPROVED";
    DENIED: "DENIED";
  };
}

export default function RenderButtonsAndFilters({
  setShowExportModal,
  openHandleDelete,
  formTemplate,
  setShowCreateModal,
  router,
  inputValue,
  setInputValue,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  FormStatus,
}: PageProps) {
  return (
    <div className="h-fit max-h-12  w-full flex flex-row justify-between gap-2 mb-2 ">
      <div className="w-full flex flex-row gap-2 ">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => router.push("/admins/forms")}
              variant="outline"
              size="sm"
              className="h-full w-fit text-xs"
            >
              <img
                src="/arrowBack.svg"
                alt="back"
                className="w-4 h-auto object-contain"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={4} side="top" align="center">
            <p className="text-xs">Back</p>
          </TooltipContent>
        </Tooltip>
        <SearchBarPopover
          term={inputValue}
          handleSearchChange={(e) => setInputValue(e.target.value)}
          placeholder={"Search forms by name..."}
          textSize="xs"
          imageSize="10"
        />
        <div className="w-fit min-w-[40px] h-full flex flex-row">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-white h-full  w-full max-w-[40px] justify-center items-center"
              >
                <img
                  src="/calendar.svg"
                  alt="Filter"
                  className="h-8 w-8 object-contain p-2 "
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="right"
              className="p-2 w-auto bg-white rounded-lg shadow-lg border"
            >
              <Calendar
                mode="range"
                selected={
                  dateRange.start && dateRange.end
                    ? { from: dateRange.start, to: dateRange.end }
                    : undefined
                }
                onSelect={(range) => {
                  setDateRange({
                    start: range?.from,
                    end: range?.to,
                  });
                }}
                numberOfMonths={2}
                className="border-none shadow-none"
              />
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() =>
                    setDateRange({ start: undefined, end: undefined })
                  }
                  disabled={!dateRange.start && !dateRange.end}
                >
                  Clear
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="relative flex items-center  w-[160px] ">
          <Select
            value={statusFilter}
            onValueChange={(val) =>
              setStatusFilter(val as "ALL" | keyof typeof FormStatus)
            }
          >
            <SelectTrigger className="px-2 text-xs text-center h-full bg-white border rounded-lg">
              <SelectValue placeholder="Form Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Filter By Approval</SelectItem>
              {Object.keys(FormStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {statusFilter !== "ALL" && (
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="destructive"
                  className="h-4 w-4 absolute -top-1 -right-1 p-0.5 cursor-pointer hover:bg-red-400 hover:bg-opacity-100"
                  onClick={() => setStatusFilter("ALL")}
                >
                  <X className="h-4 w-4" />
                </Badge>
              </TooltipTrigger>
              <TooltipContent sideOffset={10} side="right" align="end">
                <p className="text-xs">Remove</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      <div className="flex justify-center items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setShowExportModal(true);
              }}
              variant={"default"}
              size={"icon"}
              className="rounded-lg hover:bg-slate-800 min-w-12 "
            >
              <img
                src="/export-white.svg"
                alt="Export Form"
                className="h-4 w-4 "
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={2} side="top" align="center">
            <p className="text-xs">Export</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex justify-center items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => {
                setShowCreateModal(true);
              }}
              variant={"default"}
              size={"icon"}
              className="rounded-lg hover:bg-slate-800 min-w-12"
            >
              <img
                src="/plus-white.svg"
                alt="Export Form"
                className="h-4 w-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={2} side="top" align="center">
            <p className="text-xs">Create</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex justify-center items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"destructive"}
              size={"icon"}
              className=" hover:bg-opacity-20 min-w-12"
              onClick={() => {
                if (formTemplate) {
                  openHandleDelete(formTemplate.id);
                }
              }}
            >
              <img src="/trash.svg" alt="Delete Form" className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={2} side="top" align="center">
            <p className="text-xs">Delete Template</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
