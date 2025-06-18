"use client";
import { Combobox } from "@/components/ui/combobox";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
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
import { format } from "date-fns";
import React from "react";

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
}: {
  form: any;
  setForm: (val: any) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  userOptions: { value: string; label: string }[];
  jobsiteOptions: { value: string; label: string }[];
  costCodeOptions: { value: string; label: string }[];
  workTypeOptions: { value: string; label: string }[];
  datePickerOpen: boolean;
  setDatePickerOpen: (open: boolean) => void;
  users: { id: string; firstName: string; lastName: string }[];
  jobsites: { id: string; name: string }[];
}) {
  return (
    <>
      {/* Date */}
      <div>
        <label className="block font-semibold mb-1">Date*</label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between"
              onClick={() => setDatePickerOpen(true)}
            >
              {form.date ? format(new Date(form.date), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={form.date ? new Date(form.date) : undefined}
              onSelect={(date) => {
                setForm({
                  ...form,
                  date: date ? date.toISOString().slice(0, 10) : "",
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
          label="User*"
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
          label="Jobsite*"
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
          label="Cost Code *"
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
      {/* start time */}
      <div>
        <label className="block font-semibold mb-1">Start Time*</label>
        <Input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
          className="w-full"
        />
      </div>
      {/* end time */}
      <div>
        <label className="block font-semibold mb-1">End Time</label>
        <Input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          className="w-full"
        />
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