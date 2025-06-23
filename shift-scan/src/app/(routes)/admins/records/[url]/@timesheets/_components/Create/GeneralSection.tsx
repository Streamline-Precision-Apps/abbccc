"use client";
import { Combobox } from "@/components/ui/combobox";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { format as formatDate, parseISO } from "date-fns";
import React, { Dispatch, SetStateAction, use, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
export default function GeneralSection({
  form,
  setForm,
  handleChange,
  userOptions,
  jobsiteOptions,
  costCodeOptions,
  workTypeOptions,
  datePickerOpen,
  setDatePickerOpen,
  users,
  jobsites,
  startTimePickerOpen,
  setStartTimePickerOpen,
  endTimePickerOpen,
  setEndTimePickerOpen,
}: {
  form: {
    date: Date;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
    jobsite: {
      id: string;
      name: string;
    };
    costcode: {
      id: string;
      name: string;
    };
    startTime: {
      date: string;
      time: string;
    };
    endTime: {
      date: string;
      time: string;
    };
    workType: string;
  };
  setForm: Dispatch<
    SetStateAction<{
      date: Date;
      user: {
        id: string;
        firstName: string;
        lastName: string;
      };
      jobsite: {
        id: string;
        name: string;
      };
      costcode: {
        id: string;
        name: string;
      };
      startTime: {
        date: string;
        time: string;
      };
      endTime: {
        date: string;
        time: string;
      };
      workType: string;
    }>
  >;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  startTimePickerOpen: boolean;
  setStartTimePickerOpen: (open: boolean) => void;
  endTimePickerOpen: boolean;
  setEndTimePickerOpen: (open: boolean) => void;
  userOptions: { value: string; label: string }[];
  jobsiteOptions: { value: string; label: string }[];
  costCodeOptions: { value: string; label: string }[];
  workTypeOptions: { value: string; label: string }[];
  datePickerOpen: boolean;
  setDatePickerOpen: (open: boolean) => void;
  users: { id: string; firstName: string; lastName: string }[];
  jobsites: { id: string; name: string }[];
}) {
  useEffect(() => {
    if (form.date) {
      console.log("Selected date:", form.date);
    }
  }, [form.date]);
  return (
    <>
      {/* Creation Date (disabled) */}
      <div className="col-span-2">
        <label className="block font-semibold mb-1">Creation Date</label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-fit justify-start text-left font-normal"
              disabled
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.date
                ? formatDate(new Date(form.date), "PPP")
                : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.date ? new Date(form.date) : undefined}
              onSelect={(date) => {
                setForm({
                  ...form,
                  date: date ? date : new Date(),
                });
                setDatePickerOpen(false);
              }}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* User */}
      <div>
        <Combobox
          label="User"
          options={userOptions}
          value={form.user.id}
          onChange={(val, option) => {
            const selected = users.find((u) => u.id === val);
            setForm({
              ...form,
              user: selected || { id: "", firstName: "", lastName: "" },
            });
          }}
          placeholder="Select user"
          filterKeys={["value", "label"]}
        />
      </div>
      {/* Jobsite */}
      <div>
        <Combobox
          label="Jobsite"
          options={jobsiteOptions}
          value={form.jobsite.id}
          onChange={(val, option) => {
            const selected = jobsites.find((j) => j.id === val);
            setForm({
              ...form,
              jobsite: selected || { id: "", name: "" },
              costcode: { id: "", name: "" },
            });
          }}
          placeholder="Select jobsite"
          filterKeys={["value", "label"]}
        />
      </div>
      {/* Costcode */}
      <div>
        <Combobox
          label="Cost Code"
          options={costCodeOptions}
          value={form.costcode.id}
          onChange={(val, option) => {
            setForm({
              ...form,
              costcode: option
                ? { id: option.value, name: option.label }
                : { id: "", name: "" },
            });
          }}
          placeholder="Select cost code"
          filterKeys={["value", "label"]}
        />
      </div>
      {/* Start Date & Time */}
      <div>
        <label className="block font-semibold mb-1">Start Time*</label>
        <div className="flex gap-x-2">
          <Popover
            open={startTimePickerOpen}
            onOpenChange={setStartTimePickerOpen}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setStartTimePickerOpen(true)}
              >
                {form.startTime.date ? form.startTime.date : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  form.startTime.date
                    ? new Date(form.startTime.date + "T00:00:00")
                    : undefined
                }
                onSelect={(date) => {
                  setForm({
                    ...form,
                    startTime: {
                      ...form.startTime,
                      date: date ? formatDate(date, "MM/dd/yyyy") : "",
                    },
                  });
                  setStartTimePickerOpen(false);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            name="startTime"
            value={form.startTime.time}
            onChange={(e) => {
              setForm({
                ...form,
                startTime: {
                  ...form.startTime,
                  time: e.target.value,
                },
              });
            }}
            required
            className="w-full"
          />
        </div>
      </div>
      {/* End Date & Time */}
      <div>
        <label className="block font-semibold mb-1">End Time</label>
        <div className="flex gap-2">
          <Popover open={endTimePickerOpen} onOpenChange={setEndTimePickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setEndTimePickerOpen(true)}
              >
                {form.endTime.date ? form.endTime.date : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  form.endTime.date
                    ? new Date(form.endTime.date + "T00:00:00")
                    : undefined
                }
                onSelect={(date) => {
                  setForm({
                    ...form,
                    endTime: {
                      ...form.endTime,
                      date: date ? formatDate(date, "MM/dd/yyyy") : "",
                    },
                  });
                  setEndTimePickerOpen(false);
                }}
                autoFocus
              />
            </PopoverContent>
          </Popover>
          <Input
            type="time"
            name="endTime"
            value={form.endTime.time}
            onChange={(e) => {
              setForm({
                ...form,
                endTime: {
                  ...form.endTime,
                  time: e.target.value,
                },
              });
            }}
            className="w-full"
          />
        </div>
      </div>
      {/* work type */}
      <div className="mb-4">
        <label className="block font-semibold mb-1">Work Type*</label>
        <Select
          value={form.workType}
          onValueChange={(val) => setForm({ ...form, workType: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select work type" />
          </SelectTrigger>
          <SelectContent>
            {workTypeOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
