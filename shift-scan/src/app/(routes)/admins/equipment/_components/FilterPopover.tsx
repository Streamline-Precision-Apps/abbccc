"use client";

import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export interface FilterOptions {
  equipmentTags: string[];
  ownershipTypes: string[];
  conditions: string[];
  statuses: string[];
}

interface FilterPopoverProps {
  onFilterChange: (filters: FilterOptions) => void;
  onUseFiltersChange?: (useFilters: boolean) => void;
}

const FilterPopover: React.FC<FilterPopoverProps> = ({
  onFilterChange,
  onUseFiltersChange,
}) => {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    equipmentTags: [],
    ownershipTypes: [],
    conditions: [],
    statuses: [],
  });

  const handleCheckboxChange = (
    category: keyof FilterOptions,
    value: string,
    checked: boolean,
  ) => {
    setFilters((prev) => {
      const updated = { ...prev };
      if (checked) {
        updated[category] = [...prev[category], value];
      } else {
        updated[category] = prev[category].filter((item) => item !== value);
      }
      return updated;
    });
  };

  const handleApplyFilters = () => {
    const hasActiveFilters =
      filters.equipmentTags.length > 0 ||
      filters.ownershipTypes.length > 0 ||
      filters.conditions.length > 0 ||
      filters.statuses.length > 0;

    onFilterChange(filters);
    if (onUseFiltersChange) {
      onUseFiltersChange(hasActiveFilters);
    }
    setOpen(false);
  };

  const handleClearFilters = () => {
    const emptyFilters: FilterOptions = {
      equipmentTags: [],
      ownershipTypes: [],
      conditions: [],
      statuses: [],
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
    if (onUseFiltersChange) {
      onUseFiltersChange(false);
    }
  };

  const getActiveFilterCount = () => {
    return (
      filters.equipmentTags.length +
      filters.ownershipTypes.length +
      filters.conditions.length +
      filters.statuses.length
    );
  };

  // Set useFilters based on initial filter state
  React.useEffect(() => {
    const hasActiveFilters = getActiveFilterCount() > 0;
    if (hasActiveFilters && onUseFiltersChange) {
      onUseFiltersChange(true);
    }
  }, []);

  return (
    <div className="bg-white rounded-lg w-10 justify-center h-full flex items-center">
      <Popover open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`relative h-full flex items-center justify-center px-3 ${
                  open
                    ? "border-slate-400"
                    : getActiveFilterCount() > 0
                      ? "bg-blue-50 border-blue-300"
                      : ""
                }`}
              >
                <img src="/filterFunnel.svg" alt="Filter" className="h-4 w-4" />
                {getActiveFilterCount() > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 h-5 min-w-5 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full">
                    {getActiveFilterCount()}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="top">Filter Equipment</TooltipContent>
        </Tooltip>
        <PopoverContent
          className="w-[300px] p-4"
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-sm">Equipment Type</h3>
              <div className="space-y-2">
                {["TRUCK", "TRAILER", "VEHICLE", "EQUIPMENT"].map((tag) => (
                  <div key={tag} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag}`}
                      checked={filters.equipmentTags.includes(tag)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "equipmentTags",
                          tag,
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`tag-${tag}`}
                      className="text-sm font-normal"
                    >
                      {tag.charAt(0) + tag.slice(1).toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Ownership</h3>
              <div className="space-y-2">
                {["OWNED", "LEASED"].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={`ownership-${type}`}
                      checked={filters.ownershipTypes.includes(type)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "ownershipTypes",
                          type,
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`ownership-${type}`}
                      className="text-sm font-normal"
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Condition</h3>
              <div className="space-y-2">
                {["NEW", "USED"].map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={`condition-${condition}`}
                      checked={filters.conditions.includes(condition)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "conditions",
                          condition,
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`condition-${condition}`}
                      className="text-sm font-normal"
                    >
                      {condition.charAt(0) + condition.slice(1).toLowerCase()}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-sm">Status</h3>
              <div className="space-y-2">
                {[
                  "AVAILABLE",
                  "IN_USE",
                  "MAINTENANCE",
                  "NEEDS_REPAIR",
                  "RETIRED",
                ].map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={filters.statuses.includes(status)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "statuses",
                          status,
                          checked as boolean,
                        )
                      }
                    />
                    <Label
                      htmlFor={`status-${status}`}
                      className="text-sm font-normal"
                    >
                      {status
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0) + word.slice(1).toLowerCase(),
                        )
                        .join(" ")}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                Clear
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleApplyFilters}
                className="text-xs"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FilterPopover;
