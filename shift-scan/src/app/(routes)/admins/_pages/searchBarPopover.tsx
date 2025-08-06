import { Holds } from "@/components/(reusable)/holds";
import { Inputs } from "@/components/(reusable)/inputs";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import React from "react";

interface SearchBarProps {
  term: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  disabled?: boolean;
  children?: React.ReactNode;
  textSize?: "xs" | "sm" | "md" | "lg" | "xl";
  imageSize?: "2" | "4" | "6" | "8" | "10" | "12" | "14" | "16";
}

const SearchBarPopover: React.FC<SearchBarProps> = ({
  term,
  handleSearchChange,
  placeholder,
  disabled = false,
  children = null,
  textSize = "sm",
  imageSize = "8",
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Open search"
          disabled={disabled}
          className={`flex items-center justify-center w-${imageSize} h-${imageSize} bg-white p-1 hover:bg-slate-100 transition focus:outline-none focus:ring-none focus:ring-blue-500`}
        >
          <img
            src="/searchLeft.svg"
            alt="search"
            className={`w-${imageSize} h-${imageSize}`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="right"
        sideOffset={10}
        className={`w-[400px] h-${imageSize} bg-white border border-slate-200 rounded-md shadow-lg`}
      >
        <Holds
          background={disabled ? "lightGray" : "white"}
          position="row"
          className="px-2 w-full h-full gap-x-3 relative"
        >
          <Holds
            className={`w-${imageSize} h-full justify-center items-center`}
          >
            <img src="/searchLeft.svg" alt="search" />
          </Holds>
          <Holds className="w-full h-auto justify-center items-center ">
            <Inputs
              type="search"
              placeholder={placeholder}
              value={term}
              onChange={handleSearchChange}
              disabled={disabled}
              autoFocus
              className={`border-none outline-hidden text-${textSize} text-left w-full h-full rounded-md bg-white focus:ring-0 focus:border-none focus:outline-none`}
            />
          </Holds>
          {children}
        </Holds>
      </PopoverContent>
    </Popover>
  );
};

export default SearchBarPopover;
