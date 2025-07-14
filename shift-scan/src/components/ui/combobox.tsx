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
import { list } from "postcss";

export interface ComboboxOption {
  value: string;
  label: string;
  [key: string]: string | number | boolean | undefined;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  filterKeys?: string[];
  font?: "font-semibold" | "font-bold" | "font-normal";
  required?: boolean;
  errorMessage?: string;
  listData?: string[];
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  disabled = false,
  filterKeys = ["label"],
  font = "font-semibold",
  required = false,
  errorMessage = "This field is required.",
  listData = [],
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [touched, setTouched] = useState(false); // Track if the field has been interacted with

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

  const showError = required && touched && (!value || value.length === 0);

  return (
    <div>
      {label && <label className={`block text-xs ${font} mb-1`}>{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={`w-full justify-between ${
              showError && listData.length < 1 ? "border-red-500" : ""
            }`}
            disabled={disabled}
            onBlur={() => setTouched(true)}
          >
            {value && value.length > 0
              ? options
                  .filter((option) => value.includes(option.value))
                  .map((option) => option.label)
                  .join(", ")
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
                {filteredOptions.map((option) => {
                  const checked = value.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        let newValue: string[];
                        if (checked) {
                          newValue = value.filter((v) => v !== option.value);
                        } else {
                          newValue = [...value, option.value];
                        }
                        onChange(newValue);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "mr-2 h-4 w-4",
                          checked ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
