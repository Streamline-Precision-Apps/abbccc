"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: string | number | boolean | undefined; // Allow extra fields for advanced filtering, but no any
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string, option?: ComboboxOption) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  filterKeys?: string[]; // List of keys to filter on (e.g. ["label", "email"])
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  filterKeys = ["label"], // Default to label only
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Advanced filter: match if any filterKey contains the search string
  const filteredOptions = options.filter((option) => {
    // If search is empty, show all
    if (!search.trim()) return true;
    // Defensive: filterKeys must be array of strings
    if (!Array.isArray(filterKeys)) return true;
    return filterKeys.some((key) => {
      // Support nested keys like 'user.firstName'
      const value = key
        .split(".")
        .reduce<unknown>(
          (obj, k) =>
            obj && typeof obj === "object"
              ? (obj as Record<string, unknown>)[k]
              : undefined,
          option
        );
      return (value ?? "")
        .toString()
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  });

  return (
    <div>
      {label && <label className="block font-semibold mb-1">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            disabled={disabled}
          >
            {value
              ? options.find((option) => option.value === value)?.label
              : placeholder}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 min-w-[200px]">
          <Command>
            <CommandInput
              placeholder={`Search...`}
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No option found.</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label} // Use the id as the value for selection
                    onSelect={() => {
                      onChange(option.value, option); // Pass id and option
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
