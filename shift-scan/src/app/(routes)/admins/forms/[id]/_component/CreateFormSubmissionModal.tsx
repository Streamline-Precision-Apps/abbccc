"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createFormSubmission } from "@/actions/records-forms";
import RenderFields from "../../_components/RenderFields"; // Import the RenderFields component
import Spinner from "@/components/(animations)/spinner";
import { FormIndividualTemplate } from "./hooks/types";

export interface Submission {
  id: string;
  title: string;
  formTemplateId: string;
  userId: string;
  formType: string;
  data: Record<string, string | number | boolean | null>;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  status: string;
  User: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Grouping {
  id: string;
  title: string;
  order: number;
  Fields: Fields[];
}

export interface Fields {
  id: string;
  formGroupingId: string;
  label: string;
  type: string;
  required: boolean;
  order: number;
  placeholder?: string | null;
  minLength?: number | null;
  maxLength?: number | null;
  multiple: boolean | null;
  content?: string | null;
  filter?: string | null;
  Options?: FieldOption[];
}

interface FieldOption {
  id: string;
  fieldId: string;
  value: string;
}

interface CreateFormSubmissionModalProps {
  formTemplate: FormIndividualTemplate;
  closeModal: () => void;
  onSuccess?: () => void;
}

const CreateFormSubmissionModal: React.FC<CreateFormSubmissionModalProps> = ({
  formTemplate,
  closeModal,
  onSuccess,
}) => {
  console.log("Form Template:", formTemplate);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Record<string, string | number | boolean | null>
  >({});
  const [submittedBy, setSubmittedBy] = useState<{
    id: string;
    firstName: string;
    lastName: string;
  } | null>(null);
  const [submittedByTouched, setSubmittedByTouched] = useState(false);

  // State for different asset types
  const [equipment, setEquipment] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [jobsites, setJobsites] = useState<{ id: string; name: string }[]>([]);
  const [costCodes, setCostCodes] = useState<{ id: string; name: string }[]>(
    [],
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

  useEffect(() => {
    const fetchEmployees = async () => {
      const res = await fetch("/api/getAllActiveEmployeeName");
      const employees = await res.json();
      setUsers(employees);
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const res = await fetch("/api/getClientsSummary");
        const data = await res.json();

        // Check if the response is successful and contains an array
        if (res.ok && Array.isArray(data)) {
          setClients(data);
        } else {
          console.warn("No clients found or invalid response:", data);
          setClients([]);
        }
      } catch (error) {
        console.error("Error fetching clients:", error);
        setClients([]);
      }
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

  const handleFieldChange = (
    fieldId: string,
    value: string | Date | string[] | object | boolean | number | null,
  ) => {
    // Convert value to a format compatible with our formData state
    let compatibleValue: string | number | boolean | null = null;

    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean"
    ) {
      compatibleValue = value;
    } else if (value instanceof Date) {
      compatibleValue = value.toISOString();
    } else if (Array.isArray(value)) {
      compatibleValue = value.join(",");
    } else if (value !== null && typeof value === "object") {
      compatibleValue = JSON.stringify(value);
    }

    setFormData((prev) => ({ ...prev, [fieldId]: compatibleValue }));
  };

  // Signature state
  const [signatureChecked, setSignatureChecked] = useState(false);

  const handleSubmit = async () => {
    setSubmittedByTouched(true);
    if (!submittedBy) {
      toast.error("'Submitted By' is required");
      return;
    }
    if (formTemplate.isSignatureRequired && !signatureChecked) {
      toast.error("You must electronically sign this submission.");
      return;
    }
    setLoading(true);
    try {
      // Process formData to ensure asset data is properly formatted
      const processedFormData: Record<
        string,
        string | number | boolean | null
      > = { ...formData };
      if (formTemplate.isSignatureRequired) {
        processedFormData.signature = true;
      }

      const res = await createFormSubmission({
        formTemplateId: formTemplate.id,
        data: processedFormData,
        submittedBy: {
          id: submittedBy.id,
          firstName: submittedBy.firstName,
          lastName: submittedBy.lastName,
        },
      });
      if (res.success) {
        toast.success("Submission created successfully");
        closeModal();
        onSuccess?.();
      } else {
        toast.error(res.error || "Failed to create submission");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg min-w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
        <div className="flex flex-col gap-4 w-full items-center">
          <div className="w-full flex flex-col justify-center mb-2 ">
            <div>
              <p className="text-lg text-black font-semibold ">
                Submit A New {formTemplate?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">
                Please complete the form below to initiate a new{" "}
                {formTemplate?.name} submission.
              </p>
            </div>
          </div>
          <div className="w-full">
            <RenderFields
              formTemplate={formTemplate}
              userOptions={userOptions}
              submittedBy={submittedBy}
              setSubmittedBy={setSubmittedBy}
              submittedByTouched={submittedByTouched}
              formData={formData}
              handleFieldChange={handleFieldChange}
              clientOptions={clientOptions}
              equipmentOptions={equipmentOptions}
              jobsiteOptions={jobsiteOptions}
              costCodeOptions={costCodeOptions}
            />
          </div>
          {formTemplate.isSignatureRequired && (
            <div className="w-full flex flex-row items-center gap-2 mb-2 mt-2">
              <input
                type="checkbox"
                id="signature-checkbox"
                checked={signatureChecked}
                onChange={(e) => setSignatureChecked(e.target.checked)}
                className="accent-emerald-500 h-4 w-4"
                disabled={loading}
              />
              <label
                htmlFor="signature-checkbox"
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              onClick={handleSubmit}
              variant="outline"
              className="bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"
              disabled={loading}
            >
              {loading ? <Spinner size={20} /> : "Create Submission"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateFormSubmissionModal;
