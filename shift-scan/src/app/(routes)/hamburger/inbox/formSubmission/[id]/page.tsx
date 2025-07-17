"use client";
import { FormEvent, useEffect, useState } from "react";
import Spinner from "@/components/(animations)/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import FormDraft from "./_components/formDraft";
import ManagerFormApproval from "./_components/managerFormApproval";
import SubmittedForms from "./_components/submittedForms";
import ManagerFormEditApproval from "./_components/managerFormEdit";
import { saveDraftToPending } from "@/actions/hamburgerActions";
import { useSession } from "next-auth/react";
import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import SubmittedFormsApproval from "./_components/submittedApprovedForms";
import { Titles } from "@/components/(reusable)/titles";
import { useTranslations } from "next-intl";
import type { FormIndividualTemplate } from "@/app/(routes)/admins/forms/[id]/_component/hooks/types";

// Define FormFieldValue type to match RenderFields expectations
type FormFieldValue =
  | string
  | Date
  | string[]
  | object
  | boolean
  | number
  | null;

// Interface for backward compatibility with existing child components
interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  isActive: boolean;
  isSignatureRequired: boolean;
  groupings: FormGrouping[];
}

interface FormGrouping {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  name: string;
  type: string;
  required: boolean;
  order: number;
  defaultValue?: string;
  placeholder?: string;
  maxLength?: number;
  helperText?: string;
  options?: string[];
}

type ManagerFormApprovalSchema = {
  id: string;
  title: string;
  formTemplateId: string;
  userId: string;
  formType: string | null;
  data: {
    comments: string;
    request_type: string;
    request_end_date: string;
    request_start_date: string;
  };
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  status: FormStatus;
  Approvals: Array<{
    id: string;
    formSubmissionId: string;
    signedBy: string;
    submittedAt: string;
    updatedAt: string;
    signature: string;
    comment: string;
    Approver: {
      firstName: string;
      lastName: string;
    };
  }>;
};
enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export default function DynamicForm({ params }: { params: { id: string } }) {
  // Search params from URL
  const t = useTranslations("Hamburger-Inbox");
  const formSubmissions = useSearchParams();
  const submissionId = formSubmissions.get("submissionId");
  const submissionStatus = formSubmissions.get("status");
  const submissionApprovingStatus = formSubmissions.get("approvingStatus");
  const formApprover = formSubmissions.get("formApprover");

  // State variables
  const [formData, setFormData] = useState<FormIndividualTemplate | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, FormFieldValue>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  const [submittedForm, setSubmittedForm] = useState<string | null>(null);
  const [managerFormApproval, setManagerFormApproval] =
    useState<ManagerFormApprovalSchema | null>(null);

  // Get user that is logged in
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  // Fetch form template and draft data on page load
  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch the form template
        const formRes = await fetch(`/api/form/` + params.id);
        if (!formRes.ok) throw new Error("Failed to fetch form template");
        const apiData = await formRes.json();
        // Map API data to FormIndividualTemplate if needed
        setFormData(apiData);

        // If there's no submissionId, stop here and just show template
        if (!submissionId) {
          setLoading(false);
          return;
        }

        // Fetch submission data based on submissionStatus and submissionApprovingStatus
        let submissionData, managerFormApprovalData;

        if (submissionStatus === "DRAFT") {
          console.log("DRAFT");
          submissionData = await fetchDraftData(submissionId);
        } else if (submissionStatus === "PENDING") {
          console.log("PENDING");
          if (submissionApprovingStatus === null) {
            console.log("no approval");
            submissionData = await fetchSubmissionData(submissionId);
          } else if (submissionApprovingStatus === "true") {
            console.log("has approval");
            submissionData = await fetchTeamSubmissionData(submissionId);
            managerFormApprovalData = await fetchManagerApprovalData(
              submissionId
            );
          }
        } else if (
          submissionStatus === "APPROVED" ||
          submissionStatus === "DENIED"
        ) {
          console.log("APPROVED or DENIED");
          if (submissionApprovingStatus === null) {
            submissionData = await fetchSubmissionData(submissionId);
            managerFormApprovalData = await fetchManagerApprovalData(
              submissionId
            );
          } else if (submissionApprovingStatus === "true") {
            submissionData = await fetchTeamSubmissionData(submissionId);
            managerFormApprovalData = await fetchManagerApprovalData(
              submissionId
            );
          }
        } else if (
          submissionStatus !== "PENDING" &&
          submissionStatus !== "DRAFT" &&
          submissionApprovingStatus === "true"
        ) {
          console.log("Not PENDING or DRAFT and has approval");
          submissionData = await fetchTeamSubmissionData(submissionId);
          managerFormApprovalData = await fetchManagerApprovalData(
            submissionId
          );
        }
        console.log(submissionData);

        // Set the fetched data
        if (submissionData) {
          // Convert form template for mapping
          const legacyTemplate = convertToLegacyFormTemplate(apiData);
          
          // Convert form values from label-based to ID-based keys
          const convertedValues = convertFormValuesToIdBased(submissionData.data, legacyTemplate);
          
          setFormValues(convertedValues);
          setFormTitle(
            submissionData.title ||
              (submissionData.user?.firstName && submissionData.user?.lastName
                ? `${submissionData.user.firstName} ${submissionData.user.lastName}`
                : "") ||
              ""
          );
          setSignature(submissionData.User?.signature || null);
          setSubmittedForm(submissionData.submittedAt || "");
        }

        if (managerFormApprovalData) {
          setManagerFormApproval(managerFormApprovalData);
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
        setError("Failed to fetch form data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [params.id, submissionId, submissionStatus, submissionApprovingStatus]);

  // Helper functions for fetching data
  const fetchDraftData = async (submissionId: string) => {
    const draftRes = await fetch(`/api/formDraft/` + submissionId);
    if (!draftRes.ok) throw new Error("Failed to fetch draft data");
    return await draftRes.json();
  };

  const fetchSubmissionData = async (submissionId: string) => {
    const submissionRes = await fetch(`/api/formSubmission/` + submissionId);
    if (!submissionRes.ok) throw new Error("Failed to fetch submission data");
    return await submissionRes.json();
  };

  const fetchTeamSubmissionData = async (submissionId: string) => {
    const submissionRes = await fetch(`/api/teamSubmission/` + submissionId);
    if (!submissionRes.ok)
      throw new Error("Failed to fetch team submission data");
    return await submissionRes.json();
  };

  const fetchManagerApprovalData = async (submissionId: string) => {
    const managerFormApprovalRes = await fetch(
      `/api/managerFormApproval/` + submissionId
    );
    if (!managerFormApprovalRes.ok)
      throw new Error("Failed to fetch manager approval data");
    return await managerFormApprovalRes.json();
  };

  // Update form values for a single field
  const updateFormValues = (fieldId: string, value: FormFieldValue) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldId]: value,
    }));
  };

  // Legacy method for backward compatibility with existing components
  const updateFormValuesLegacy = (newValues: Record<string, string>) => {
    setFormValues((prevValues) => {
      // Convert new values from potentially label-based keys to ID-based keys
      const convertedValues: Record<string, FormFieldValue> = {};
      
      Object.entries(newValues).forEach(([key, value]) => {
        convertedValues[key] = value;
      });
      
      return {
        ...prevValues,
        ...convertedValues,
      };
    });
  };

  // Convert FormFieldValue to string for legacy components
  const convertFormValuesToString = (
    values: Record<string, FormFieldValue>
  ): Record<string, string> => {
    const stringValues: Record<string, string> = {};
    
    // Get the form template for mapping
    const template = formData ? convertToLegacyFormTemplate(formData) : null;
    
    // Create a mapping from field IDs to field labels for saving
    const idToLabelMap: Record<string, string> = {};
    if (template) {
      template.groupings.forEach((group) => {
        group.fields.forEach((field) => {
          idToLabelMap[field.id] = field.label;
        });
      });
    }
    
    Object.entries(values).forEach(([key, value]) => {
      // Convert the value to string
      let stringValue = "";
      if (typeof value === "string") {
        stringValue = value;
      } else if (typeof value === "number" || typeof value === "boolean") {
        stringValue = String(value);
      } else if (value instanceof Date) {
        stringValue = value.toISOString();
      } else if (Array.isArray(value)) {
        stringValue = value.join(",");
      } else if (value && typeof value === "object") {
        stringValue = JSON.stringify(value);
      } else {
        stringValue = "";
      }
      
      // Use field label as key if available, otherwise use original key
      const fieldLabel = idToLabelMap[key];
      const finalKey = fieldLabel || key;
      stringValues[finalKey] = stringValue;
    });
    
    return stringValues;
  };

  // Convert API response to FormTemplate for legacy components
  const convertToLegacyFormTemplate = (
    template: any
  ): FormTemplate => {
    // Check if the template is already in the correct format from the API
    if (template.groupings) {
      return template as FormTemplate;
    }
    
    // Otherwise, convert from FormIndividualTemplate format
    return {
      id: template.id,
      name: template.name,
      formType: template.formType,
      isActive: template.isActive === "ACTIVE",
      isSignatureRequired: template.isSignatureRequired,
      groupings:
        template.FormGrouping?.map((group: any) => ({
          id: group.id,
          title: group.title || "",
          order: group.order,
          fields:
            group.Fields?.map((field: any) => ({
              id: field.id,
              label: field.label,
              name: field.label, // Use label as name for backward compatibility
              type: field.type,
              required: field.required,
              order: field.order,
              placeholder: field.placeholder || undefined,
              maxLength: field.maxLength || undefined,
              options: field.Options?.map((opt: any) => opt.value) || undefined,
            })) || [],
        })) || [],
    };
  };

  // Convert form values from label-based keys to ID-based keys
  const convertFormValuesToIdBased = (
    values: Record<string, FormFieldValue>,
    template: FormTemplate
  ): Record<string, FormFieldValue> => {
    const result: Record<string, FormFieldValue> = {};
    
    // Create a mapping from field labels to field IDs
    const labelToIdMap: Record<string, string> = {};
    template.groupings.forEach((group) => {
      group.fields.forEach((field) => {
        labelToIdMap[field.label] = field.id;
      });
    });
    
    // Convert values using the mapping
    Object.entries(values).forEach(([key, value]) => {
      const fieldId = labelToIdMap[key];
      if (fieldId) {
        result[fieldId] = value;
      } else {
        // If no mapping found, use the original key (might be ID already)
        result[key] = value;
      }
    });
    
    return result;
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData) {
      console.error("Form data is not available");
      return;
    }

    try {
      if (!userId || !submissionId) {
        console.error("User ID is null");
        return;
      }

      // Convert formValues to Record<string, string> for saveDraftToPending
      // Use field labels as keys for saving
      const dataToSave: Record<string, string> = {};
      const template = convertToLegacyFormTemplate(formData);
      
      // Create a mapping from field IDs to field labels for saving
      const idToLabelMap: Record<string, string> = {};
      template.groupings.forEach((group) => {
        group.fields.forEach((field) => {
          idToLabelMap[field.id] = field.label;
        });
      });
      
      Object.entries(formValues).forEach(([key, value]) => {
        // Convert value to string
        let stringValue = "";
        if (typeof value === "string") {
          stringValue = value;
        } else if (typeof value === "number" || typeof value === "boolean") {
          stringValue = String(value);
        } else if (value instanceof Date) {
          stringValue = value.toISOString();
        } else if (Array.isArray(value)) {
          stringValue = value.join(",");
        } else if (value && typeof value === "object") {
          stringValue = JSON.stringify(value);
        } else {
          stringValue = "";
        }
        
        // Use field label as key if available, otherwise use original key
        const fieldLabel = idToLabelMap[key];
        const finalKey = fieldLabel || key;
        dataToSave[finalKey] = stringValue;
      });

      const result = await saveDraftToPending(
        dataToSave,
        formData.id,
        userId,
        formData.formType,
        submissionId,
        formTitle
      );

      if (result) {
        router.back(); // Redirect to a success page
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // useEffect(() => {
  //   console.log("Manager Form Approval Data:", managerFormApproval);
  // }, [managerFormApproval]);

  // Loading state
  if (loading || !formData) {
    return (
      <Bases>
        <Contents>
          <Grids rows={"7"} gap={"5"} className="h-full">
            <Holds
              background={"white"}
              className="row-span-1 h-full justify-center animate-pulse"
            >
              <TitleBoxes
                onClick={() => {
                  router.back();
                }}
              >
                <Titles size={"h2"}>{t("Loading")}</Titles>
              </TitleBoxes>
            </Holds>
            <Holds
              background={"white"}
              className="w-full h-full row-span-7 animate-pulse"
            >
              <Contents width={"section"}>
                <form className="h-full">
                  <Grids rows={"6"} gap={"3"} className="h-full w-full my-5">
                    <Holds className="row-start-1 row-end-6 h-full w-full justify-center">
                      <Spinner />
                    </Holds>
                  </Grids>
                </form>
              </Contents>
            </Holds>
          </Grids>
        </Contents>
      </Bases>
    );
  }

  // Render the form based on submission status
  return (
    <Bases>
      <Contents>
        <Grids rows={"7"} gap={"5"} className="w-full h-full">
          {submissionStatus === "DRAFT" && (
            <FormDraft
              formData={convertToLegacyFormTemplate(formData)}
              handleSubmit={handleSubmit}
              formTitle={formTitle || ""}
              setFormTitle={setFormTitle}
              formValues={convertFormValuesToString(formValues)}
              updateFormValues={updateFormValuesLegacy}
              userId={userId || ""}
              submissionId={submissionId || ""}
            />
          )}
          {submissionApprovingStatus === null &&
            submissionStatus !== "DRAFT" && (
              <>
                {submissionStatus === "PENDING" ? (
                  <SubmittedForms
                    formData={convertToLegacyFormTemplate(formData)}
                    formTitle={formTitle}
                    setFormTitle={setFormTitle}
                    formValues={convertFormValuesToString(formValues)}
                    updateFormValues={updateFormValuesLegacy}
                    userId={userId || ""}
                    submissionId={submissionId || ""}
                    signature={signature}
                    submittedForm={submittedForm}
                    submissionStatus={submissionStatus}
                  />
                ) : (
                  <SubmittedFormsApproval
                    formData={convertToLegacyFormTemplate(formData)}
                    formTitle={formTitle}
                    setFormTitle={setFormTitle}
                    formValues={convertFormValuesToString(formValues)}
                    updateFormValues={updateFormValuesLegacy}
                    submissionId={submissionId || ""}
                    signature={signature}
                    submittedForm={submittedForm}
                    submissionStatus={submissionStatus}
                    managerFormApproval={managerFormApproval}
                  />
                )}
              </>
            )}

          {submissionApprovingStatus === "true" &&
            submissionStatus === "PENDING" &&
            formApprover && (
              <ManagerFormApproval
                formData={convertToLegacyFormTemplate(formData)}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formValues={convertFormValuesToString(formValues)}
                updateFormValues={updateFormValuesLegacy}
                submissionId={submissionId || ""}
                signature={signature}
                submittedForm={submittedForm}
                submissionStatus={submissionStatus}
                managerFormApproval={managerFormApproval}
              />
            )}

          {submissionApprovingStatus === "true" &&
            submissionStatus !== "PENDING" &&
            submissionStatus !== "DRAFT" &&
            formApprover && (
              <ManagerFormEditApproval
                formData={convertToLegacyFormTemplate(formData)}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formValues={convertFormValuesToString(formValues)}
                updateFormValues={updateFormValuesLegacy}
                submissionId={submissionId || ""}
                signature={signature}
                submittedForm={submittedForm}
                submissionStatus={submissionStatus}
                managerFormApproval={managerFormApproval}
              />
            )}
        </Grids>
      </Contents>
    </Bases>
  );
}
