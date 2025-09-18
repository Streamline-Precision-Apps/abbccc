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
import { toast } from "sonner";
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
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useDashboardData } from "../../../_pages/sidebar/DashboardDataContext";

export default function EditFormSubmissionModal({
  id,
  closeModal,
  formTemplate,
  onSuccess,
}: {
  id: number;
  closeModal: () => void;
  formTemplate: FormIndividualTemplate | null;
  onSuccess: () => void;
}) {
  const { refresh } = useDashboardData();
  const { data: session } = useSession();

  const adminUserId = session?.user.id || null;

  const [loading, setLoading] = useState(true);
  const [formSubmission, setFormSubmission] =
    useState<FormSubmissionWithTemplate | null>(null);
  const [editData, setEditData] = useState<
    Record<string, string | number | boolean | null>
  >({});

  // State for manager comment and signature
  const [managerComment, setManagerComment] = useState<string>("");
  const [managerSignature, setManagerSignature] = useState<boolean>(false);

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

  const userOptions = users.map((u) => ({
    value: u.id,
    label: `${u.firstName} ${u.lastName}`,
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

      // Convert submission data to the correct type
      const processedData: Record<string, string | number | boolean | null> =
        {};
      if (
        submission &&
        typeof submission.data === "object" &&
        submission.data !== null
      ) {
        // First, add all the original data entries
        Object.entries(submission.data).forEach(([key, value]) => {
          if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean" ||
            value === null
          ) {
            processedData[key] = value;
          } else if (value !== undefined) {
            // Convert any other types to string
            processedData[key] = String(value);
          }
        });
      }
      setEditData(processedData);
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
    {},
  );
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleFieldTouch = (fieldId: string) => {
    setTouchedFields((prev) => ({ ...prev, [fieldId]: true }));
  };

  const validateField = (
    fieldId: string,
    value:
      | string
      | number
      | boolean
      | null
      | Date
      | string[]
      | object
      | undefined,
    required: boolean,
  ) => {
    if (required && (value === null || value === undefined || value === "")) {
      return "This field is required.";
    }
    return null;
  };

  const handleFieldChange = (
    fieldId: string,
    value: string | Date | string[] | object | boolean | number | null,
  ) => {
    // Convert value to compatible type for our state
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

    setEditData((prev) => ({ ...prev, [fieldId]: compatibleValue }));
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
      toast.error("You must electronically sign this submission.", {
        duration: 3000,
      });
      return;
    }
    try {
      // Create a properly typed data object for submission
      const updatedData: Record<string, string | number | boolean | null> = {
        ...editData,
      };

      if (
        formTemplate?.isSignatureRequired &&
        !editData.signature &&
        signatureChecked
      ) {
        updatedData.signature = true;
      }

      // Submit with correct typing
      const res = await updateFormSubmission({
        submissionId: formSubmission.id,
        data: updatedData,
        adminUserId,
        comment: managerComment,
        signature: managerSignature
          ? `${session?.user.firstName} ${session?.user.lastName}`
          : undefined,
        // If the status is PENDING and manager has signed, update status to APPROVED
        updateStatus:
          formSubmission.status === "PENDING" && managerSignature
            ? "APPROVED"
            : undefined,
      });

      if (res.success) {
        toast.success("Submission updated successfully", { duration: 3000 });

        refresh();
        onSuccess();
      } else {
        toast.error(res.error || "Failed to update submission", {
          duration: 3000,
        });
      }
    } catch (err) {
      toast.error("An unexpected error occurred", { duration: 3000 });
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg min-w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center">
          <div className="flex flex-col gap-4 w-full items-center">
            <div className="w-full flex flex-col mb-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg text-black font-semibold mb-4">
                    Loading...
                  </p>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
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
            // Get raw value from state using the same fallback pattern
            const rawValue =
              editData[field.id] ?? editData[field.label] ?? null;
            // Default to empty string if no value
            const defaultValue = "";
            const error = errors[field.id];
            const isTouched = touchedFields[field.id];

            // Convert value based on field type with overloaded types
            function getFieldValue(type: "CHECKBOX"): boolean;
            function getFieldValue(type: "MULTISELECT"): string[];
            function getFieldValue(
              type:
                | "NUMBER"
                | "TEXTAREA"
                | "DATE"
                | "TIME"
                | "DROPDOWN"
                | "RADIO"
                | "SEARCH_PERSON"
                | "SEARCH_ASSET"
                | "TEXT",
            ): string;
            function getFieldValue(type: string): string | boolean | string[] {
              if (rawValue === null || rawValue === undefined)
                return type === "CHECKBOX"
                  ? false
                  : type === "MULTISELECT"
                    ? []
                    : defaultValue;

              switch (type) {
                case "NUMBER":
                  return typeof rawValue === "number"
                    ? rawValue.toString()
                    : typeof rawValue === "string"
                      ? rawValue
                      : defaultValue;
                case "CHECKBOX":
                  return typeof rawValue === "boolean"
                    ? rawValue
                    : rawValue === "true"
                      ? true
                      : rawValue === "false"
                        ? false
                        : false;
                case "MULTISELECT":
                  return typeof rawValue === "string"
                    ? rawValue.split(",").filter(Boolean)
                    : Array.isArray(rawValue)
                      ? rawValue
                      : [String(rawValue)];
                default:
                  return typeof rawValue === "string"
                    ? rawValue
                    : rawValue !== null
                      ? String(rawValue)
                      : defaultValue;
              }
            }

            // Render input based on field type
            switch (field.type) {
              case "TEXTAREA":
                return (
                  <RenderTextArea
                    key={field.id}
                    field={field}
                    value={getFieldValue("TEXTAREA")}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "NUMBER":
                return (
                  <RenderNumberField
                    key={field.id}
                    field={field}
                    value={getFieldValue("NUMBER")}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "DATE":
                return (
                  <RenderDateField
                    key={field.id}
                    field={field}
                    value={getFieldValue("DATE")}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "TIME":
                return (
                  <RenderTimeField
                    key={field.id}
                    field={field}
                    value={getFieldValue("TIME")}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "DROPDOWN":
                return (
                  <RenderDropdownField
                    key={field.id}
                    field={field}
                    value={getFieldValue("DROPDOWN")}
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
                    key={field.id}
                    field={field}
                    value={getFieldValue("RADIO")}
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
                    key={field.id}
                    field={field}
                    value={getFieldValue("CHECKBOX")}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
                    error={error}
                  />
                );
              case "MULTISELECT":
                return (
                  <RenderMultiselectField
                    key={field.id}
                    field={field}
                    value={getFieldValue("MULTISELECT")}
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
                    key={field.id}
                    field={field}
                    value={getFieldValue("SEARCH_PERSON")}
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
                    key={field.id}
                    field={field}
                    value={getFieldValue("SEARCH_ASSET")}
                    handleFieldChange={handleFieldChange}
                    handleFieldTouch={handleFieldTouch}
                    touchedFields={touchedFields}
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
                      value={getFieldValue("TEXT")}
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
      <div className="bg-white rounded-lg shadow-lg min-w-[600px] max-w-[90vw] max-h-[80vh] overflow-y-auto no-scrollbar p-8 flex flex-col items-center relative">
        <div className="flex flex-col gap-4 w-full items-center ">
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col ">
              <Button
                type="button"
                variant={"ghost"}
                size={"icon"}
                onClick={closeModal}
                className="absolute top-0 right-0 cursor-pointer"
              >
                <X width={20} height={20} />
              </Button>
              <p className="text-lg text-black font-semibold">
                {formTemplate?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-500">Submission ID: {id}</p>
              <p className="text-sm text-gray-500">
                Submitted By: {formSubmission?.User.firstName}{" "}
                {formSubmission?.User.lastName}
              </p>

              {/* Show approval information if available */}
              {formSubmission?.Approvals &&
                formSubmission.Approvals.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="flex items-center mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-emerald-600 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path
                          fillRule="evenodd"
                          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <p className="font-semibold text-sm text-gray-700">
                        Approval History
                      </p>
                    </div>
                    <div className="max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 pr-1">
                      {/* Sort approvals by date (newest first) */}
                      {[...formSubmission.Approvals]
                        .sort(
                          (a, b) =>
                            new Date(b.updatedAt).getTime() -
                            new Date(a.updatedAt).getTime(),
                        )
                        .map((approval, index) => (
                          <div
                            key={approval.id}
                            className={`ml-2 py-1.5 ${index !== 0 ? "border-t border-gray-100" : ""}`}
                          >
                            <div className="flex items-center text-xs">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-emerald-500 mr-1 flex-shrink-0"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <div>
                                {approval.Approver ? (
                                  <span className="font-medium">
                                    {approval.Approver.firstName}{" "}
                                    {approval.Approver.lastName}
                                  </span>
                                ) : (
                                  <span className="font-medium">
                                    System Approval
                                  </span>
                                )}
                                <span className="text-xs ml-1 text-gray-500">
                                  (
                                  {new Date(
                                    approval.updatedAt,
                                  ).toLocaleDateString()}{" "}
                                  at{" "}
                                  {new Date(
                                    approval.updatedAt,
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                  )
                                </span>
                              </div>
                            </div>
                            {approval.comment && (
                              <p className="text-xs ml-5 mt-1 italic text-gray-600 bg-white px-2 py-1 rounded border border-gray-100">
                                {approval.comment}
                              </p>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
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
            <div className="w-full flex flex-row items-center gap-2 mb-4 mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <input
                type="checkbox"
                id="signature-checkbox-edit"
                checked={signatureChecked}
                onChange={(e) => setSignatureChecked(e.target.checked)}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label
                htmlFor="signature-checkbox-edit"
                className="text-sm text-gray-700 select-none cursor-pointer font-medium"
              >
                User electronically signed this submission
              </label>
            </div>
          )}

          {/* Manager Approval Section - Only show when status is PENDING */}
          {formSubmission?.status === "PENDING" && (
            <div className="w-full border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-600 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-md font-semibold">Manager Approval</h3>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-md p-4 mb-4">
                <div className="mb-4">
                  <Label
                    htmlFor="manager-comment"
                    className="text-sm font-medium mb-1 block"
                  >
                    Comment (Optional)
                  </Label>
                  <Textarea
                    id="manager-comment"
                    placeholder="Add any comments about this submission..."
                    value={managerComment}
                    onChange={(e) => setManagerComment(e.target.value)}
                    className="w-full border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="manager-signature"
                    checked={managerSignature}
                    onChange={(e) => setManagerSignature(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="manager-signature"
                    className="text-sm text-gray-700 select-none cursor-pointer"
                  >
                    I,{" "}
                    <span className="font-semibold">
                      {session?.user.firstName} {session?.user.lastName}
                    </span>
                    , electronically sign and approve this submission.
                  </label>
                </div>
              </div>
            </div>
          )}

          <div className="w-full flex flex-row justify-end gap-3 pt-4 mt-2 border-t border-gray-100">
            <Button
              size={"sm"}
              onClick={closeModal}
              variant="outline"
              className="bg-gray-100 text-gray-800 hover:bg-gray-50 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              onClick={saveChanges}
              variant="outline"
              className={`${formSubmission?.status === "PENDING" ? "bg-blue-600 text-white hover:bg-blue-500 hover:text-white" : "bg-emerald-500 text-white hover:bg-emerald-400 hover:text-white"}`}
              disabled={
                formSubmission?.status === "PENDING" && !managerSignature
              }
            >
              {formSubmission?.status === "PENDING"
                ? "Approve Submission"
                : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
