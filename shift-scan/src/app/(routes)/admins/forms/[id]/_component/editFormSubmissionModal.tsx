"use client";
import {
  getFormSubmissionById,
  updateFormSubmission,
} from "@/actions/records-forms";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  FormIndividualTemplate,
  FormSubmissionWithTemplate,
} from "./hooks/types";
import Spinner from "@/components/(animations)/spinner";
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import RenderTextArea from "../../_components/RenderTextAreaField";
import RenderNumberField from "../../_components/RenderNumberField";
import RenderDateField from "../../_components/RenderDateField";
import RenderTimeField from "../../_components/RenderTimeField";
import RenderDropdownField from "../../_components/RenderDropdownField";
import RenderRadioField from "../../_components/RenderRadioField";
import RenderCheckboxField from "../../_components/RenderCheckboxField";
import RenderMultiselectField from "../../_components/RenderMultiselectField";
import RenderSearchPersonField from "../../_components/RenderSearchPersonField";
import RenderSearchAssetField from "../../_components/RenderSearchAssetField";

export default function EditFormSubmissionModal({
  id,
  closeModal,
  formTemplate,
  onSuccess,
}: {
  id: string;
  closeModal: () => void;
  formTemplate: FormIndividualTemplate | null;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [formSubmission, setFormSubmission] =
    useState<FormSubmissionWithTemplate | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});

  // State for different asset types
  const [equipment, setEquipment] = useState<{ id: string; name: string }[]>(
    []
  );
  const [jobsites, setJobsites] = useState<{ id: string; name: string }[]>([]);
  const [costCodes, setCostCodes] = useState<{ id: string; name: string }[]>(
    []
  );

  const [users, setUsers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
  }));

  const clientOptions = clients.map((c) => ({
    value: c.id,
    label: `${c.name}`,
  }));

  const equipmentOptions = equipment.map((e) => ({
    value: e.id,
    label: e.name,
  }));

  const jobsiteOptions = jobsites.map((j) => ({
    value: j.id,
    label: j.name,
  }));

  const costCodeOptions = costCodes.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  // Fetch form submission data by ID
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const submission = await getFormSubmissionById(id);
      console.log("Fetched submission:", submission);
      if (!submission) {
        console.error("Submission not found for ID:", id);
        return;
      }
      setFormSubmission(submission as unknown as FormSubmissionWithTemplate);
      setEditData(
        submission &&
          typeof submission.data === "object" &&
          submission.data !== null
          ? { ...submission.data }
          : {}
      );
      setLoading(false);
    };
    fetchData();
  }, [id]);
  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/getAllActiveEmployeeName");
      const users = await res.json();
      setUsers(users);
    };
    fetchUsers();
  }, []);
  // Fetch clients data
  useEffect(() => {
    const fetchClients = async () => {
      const res = await fetch("/api/getClientsSummary");
      const clients = await res.json();
      setClients(clients);
    };
    fetchClients();
  }, []);
  // Fetch equipment data
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch("/api/getEquipmentSummary");
        if (!res.ok) throw new Error("Failed to fetch equipment");
        const data = await res.json();
        setEquipment(data);
      } catch (error) {
        console.error("Error fetching equipment:", error);
      }
    };
    fetchEquipment();
  }, []);

  // Fetch jobsites data
  useEffect(() => {
    const fetchJobsites = async () => {
      try {
        const res = await fetch("/api/getJobsiteSummary");
        if (!res.ok) throw new Error("Failed to fetch jobsites");
        const data = await res.json();

        setJobsites(data);
      } catch (error) {
        console.error("Error fetching jobsites:", error);
      }
    };
    fetchJobsites();
  }, []);
  // Fetch cost codes data
  useEffect(() => {
    const fetchCostCodes = async () => {
      try {
        const res = await fetch("/api/getCostCodeSummary");
        if (!res.ok) throw new Error("Failed to fetch cost codes");
        const data = await res.json();
        setCostCodes(data);
      } catch (error) {
        console.error("Error fetching cost codes:", error);
      }
    };
    fetchCostCodes();
  }, []);

  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>(
    {}
  );
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleFieldTouch = (fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const validateField = (fieldId: string, value: any, required: boolean) => {
    if (required && !value) {
      return "This field is required.";
    }
    return null;
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setEditData((prev) => ({ ...prev, [fieldId]: value }));
    const fieldError = validateField(fieldId, value, true); // Assuming all fields are required for now
    setErrors((prev) => ({ ...prev, [fieldId]: fieldError }));
  };

  // Signature state for editing
  const [signatureChecked, setSignatureChecked] = useState(false);

  const saveChanges = async () => {
    if (!formSubmission) return;
    if (
      formTemplate?.isSignatureRequired &&
      !editData.signature &&
      !signatureChecked
    ) {
      toast.error("You must electronically sign this submission.");
      return;
    }
    try {
      const updatedData = { ...editData };
      if (
        formTemplate?.isSignatureRequired &&
        !editData.signature &&
        signatureChecked
      ) {
        updatedData.signature = true;
      }
      const res = await updateFormSubmission({
        submissionId: formSubmission.id,
        data: updatedData,
      });
      if (res.success) {
        toast.success("Submission updated successfully");
        onSuccess();
      } else {
        toast.error(res.error || "Failed to update submission");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg min-w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="w-full flex flex-col  mb-2">
              <p className="text-lg  text-black font-semibold mb-4">
                Loading...
              </p>
              <Spinner size={40} />
            </div>

            <div className="w-full flex flex-row justify-end gap-2">
              <Button
                size={"sm"}
                onClick={closeModal}
                variant="outline"
                className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800"
              >
                Close
              </Button>
              <Button
                size={"sm"}
                onClick={saveChanges}
                variant="outline"
                className="bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render editable fields for each field in the template
  const renderFields = () => {
    if (!formSubmission?.FormTemplate?.FormGrouping) return null;
    return formSubmission.FormTemplate.FormGrouping.map((group) => (
      <div key={group.id} className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {group.Fields.map((field) => {
            const options = field.Options || [];
            const value = editData[field.id] ?? "";
            const error = errors[field.id];
            const isTouched = touchedFields[field.id];

            // Render input based on field type
            switch (field.type) {
              case "TEXTAREA":
                return (
                  <RenderTextArea
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "NUMBER":
                return (
                  <RenderNumberField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "DATE":
                return (
                  <RenderDateField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "TIME":
                return (
                  <RenderTimeField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "DROPDOWN":
                return (
                  <RenderDropdownField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                    options={options}
                  />
                );
              case "RADIO":
                return (
                  <RenderRadioField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                    options={options}
                  />
                );
              case "CHECKBOX":
                return (
                  <RenderCheckboxField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "MULTISELECT":
                return (
                  <RenderMultiselectField
                    field={field}
                    value={value}
                    options={options}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "SEARCH_PERSON":
                return (
                  <RenderSearchPersonField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                    userOptions={userOptions}
                    formData={editData}
                  />
                );
              case "SEARCH_ASSET":
                return (
                  <RenderSearchAssetField
                    field={field}
                    value={value}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    clientOptions={clientOptions}
                    equipmentOptions={equipmentOptions}
                    jobsiteOptions={jobsiteOptions}
                    costCodeOptions={costCodeOptions}
                    formData={editData}
                  />
                );
              default:
                return (
                  <div key={field.id} className="flex flex-col">
                    <Label className="text-sm font-medium mb-1">
                      {field.label}
                    </Label>
                    <Input
                      type="text"
                      className={`border rounded px-2 py-1 ${
                        isTouched && error ? "border-red-500" : ""
                      }`}
                      value={value}
                      onChange={(e) =>
                        handleFieldChange(field.id, e.target.value)
                      }
                      onBlur={() => handleFieldTouch(field.id)}
                    />
                    {isTouched && error && (
                      <p className="text-xs text-red-500 mt-1">{error}</p>
                    )}
                  </div>
                );
            }
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col">
              <p className="text-lg text-black font-semibold">
                {formTemplate?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500">Submission ID: {id}</p>
              <p className="text-sm text-gray-500">
                Submitted By: {formSubmission?.User.firstName}{" "}
                {formSubmission?.User.lastName}
              </p>
            </div>
            <div>
              <p className="text-xs ">
                <strong className="text-sm">Status:</strong>{" "}
                {formSubmission?.status}
              </p>
            </div>
          </div>
          <div className="w-full">{renderFields()}</div>
          {formTemplate?.isSignatureRequired && !editData.signature && (
            <div className="w-full flex flex-row items-center gap-2 mb-2 mt-2">
              <input
                type="checkbox"
                id="signature-checkbox-edit"
                checked={signatureChecked}
                onChange={(e) => setSignatureChecked(e.target.checked)}
                className="accent-emerald-500 h-4 w-4"
              />
              <label
                htmlFor="signature-checkbox-edit"
                className="text-xs text-gray-700 select-none cursor-pointer"
              >
                I electronically sign this submission.
              </label>
            </div>
          )}
          <div className="w-full flex flex-row justify-end gap-2">
            <Button
              size={"sm"}
              onClick={closeModal}
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800"
            >
              Close
            </Button>
            <Button
              size={"sm"}
              onClick={saveChanges}
              variant="outline"
              className="bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
