import { Combobox } from "@/components/ui/combobox";
import React from "react";

export interface EditGeneralSectionProps {
  form: {
    User: { id: string; firstName: string; lastName: string };
    Jobsite: { id: string; name: string };
    CostCode: { id: string; name: string };
    [key: string]: any;
  };
  setForm: (f: any) => void;
  userOptions: { value: string; label: string }[];
  jobsiteOptions: { value: string; label: string }[];
  costCodeOptions: { value: string; label: string }[];
  users: { id: string; firstName: string; lastName: string }[];
  jobsites: { id: string; name: string }[];
}

export default function EditGeneralSection({
  form,
  setForm,
  userOptions,
  jobsiteOptions,
  costCodeOptions,
  users,
  jobsites,
}: EditGeneralSectionProps) {
  return (
    <>
      {/* User */}
      <div>
        <Combobox
          label="User*"
          options={userOptions}
          value={form.User?.id}
          onChange={() => {}}
          placeholder="Select user"
          filterKeys={["value", "label"]}
          disabled
        />
      </div>
      {/* Jobsite */}
      <div>
        <Combobox
          label="Jobsite*"
          options={jobsiteOptions}
          value={form.Jobsite?.id}
          onChange={(val, option) => {
            const selected = jobsites.find((j) => j.id === val);
            setForm({
              ...form,
              Jobsite: selected || { id: "", name: "" },
              CostCode: { id: "", name: "" },
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
          value={form.CostCode?.id}
          onChange={(val, option) => {
            setForm({
              ...form,
              CostCode: option
                ? { id: option.value, name: option.label }
                : { id: "", name: "" },
            });
          }}
          placeholder="Select cost code"
          filterKeys={["value", "label"]}
        />
      </div>
    </>
  );
}
