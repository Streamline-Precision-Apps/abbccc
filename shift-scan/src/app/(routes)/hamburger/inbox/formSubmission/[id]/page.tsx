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
interface FormGrouping {
  id: string;
  title: string;
  order: number;
  fields: FormField[];
}
interface FormTemplate {
  id: string;
  name: string;
  formType: string;
  isActive: boolean;
  isSignatureRequired: boolean;
  groupings: FormGrouping[];
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
  approvals: Array<{
    id: string;
    formSubmissionId: string;
    signedBy: string;
    submittedAt: string;
    updatedAt: string;
    signature: string;
    comment: string;
    approver: {
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
  const formSubmissions = useSearchParams();
  const submissionId = formSubmissions.get("submissionId");
  const submissionStatus = formSubmissions.get("status");
  const submissionApprovingStatus = formSubmissions.get("approvingStatus");
  const formApprover = formSubmissions.get("formApprover");

  // State variables
  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
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
        const formData = await formRes.json();
        setFormData(formData);

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
          setFormValues(submissionData.data);
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
      const dataToSave = { ...formValues };
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

  // Update form values
  const updateFormValues = (newValues: Record<string, string>) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
  };

  useEffect(() => {
    console.log("Manager Form Approval Data:", managerFormApproval);
  }, [managerFormApproval]);

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
                <Titles size={"h2"}>loading...</Titles>
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
              formData={formData}
              handleSubmit={handleSubmit}
              formTitle={formTitle || ""}
              setFormTitle={setFormTitle}
              formValues={formValues}
              updateFormValues={updateFormValues}
              userId={userId || ""}
              submissionId={submissionId || ""}
            />
          )}
          {submissionApprovingStatus === null &&
            submissionStatus !== "DRAFT" && (
              <>
                {submissionStatus === "PENDING" ? (
                  <SubmittedForms
                    formData={formData}
                    formTitle={formTitle}
                    setFormTitle={setFormTitle}
                    formValues={formValues}
                    updateFormValues={updateFormValues}
                    userId={userId || ""}
                    submissionId={submissionId || ""}
                    signature={signature}
                    submittedForm={submittedForm}
                    submissionStatus={submissionStatus}
                  />
                ) : (
                  <SubmittedFormsApproval
                    formData={formData}
                    formTitle={formTitle}
                    setFormTitle={setFormTitle}
                    formValues={formValues}
                    updateFormValues={updateFormValues}
                    submissionId={submissionId || ""}
                    signature={signature}
                    submittedForm={submittedForm}
                    submissionStatus={submissionStatus}
                    managerFormApproval={managerFormApproval} // Pass managerFormApproval here
                  />
                )}
              </>
            )}

          {submissionApprovingStatus === "true" &&
            submissionStatus === "PENDING" &&
            formApprover && (
              <ManagerFormApproval
                formData={formData}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formValues={formValues}
                updateFormValues={updateFormValues}
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
                formData={formData}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formValues={formValues}
                updateFormValues={updateFormValues}
                submissionId={submissionId || ""}
                signature={signature}
                submittedForm={submittedForm}
                submissionStatus={submissionStatus}
                managerFormApproval={managerFormApproval} // Pass the data here
              />
            )}
        </Grids>
      </Contents>
    </Bases>
  );
}
