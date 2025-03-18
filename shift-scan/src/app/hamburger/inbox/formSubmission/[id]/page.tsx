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
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { user } from "@nextui-org/theme";
import SubmittedFormsApproval from "./_components/submittedApprovedForms";

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
  // search params from url
  const formSubmissions = useSearchParams();
  const submissionId = formSubmissions.get("submissionId");
  const submissionStatus = formSubmissions.get("status");
  const submissionApprovingStatus = formSubmissions.get("approvingStatus");
  const formApprover = formSubmissions.get("formApprover");

  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [submittedForm, setSubmittedForm] = useState<string | null>(null);
  const [managerFormApproval, setManagerFormApproval] =
    useState<ManagerFormApprovalSchema | null>(null);
  // get user that is logged in
  const { data: session } = useSession();
  const userId = session?.user.id;
  const router = useRouter();

  // Fetch form template and draft data on page load
  useEffect(() => {
    setLoading(true);

    async function fetchForm() {
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
        // Draft submission
        if (submissionStatus === "DRAFT") {
          const draftRes = await fetch(`/api/formDraft/` + submissionId);
          if (!draftRes.ok) throw new Error("Failed to fetch draft data");
          submissionData = await draftRes.json();
          console.log("Draft data:", submissionData);
        }
        // Pending submission
        else if (submissionStatus === "PENDING") {
          if (submissionApprovingStatus === null) {
            const submissionRes = await fetch(
              `/api/formSubmission/` + submissionId
            );
            if (!submissionRes.ok)
              throw new Error("Failed to fetch submission data");
            submissionData = await submissionRes.json();
          } else if (submissionApprovingStatus === "true") {
            const submissionRes = await fetch(
              `/api/teamSubmission/` + submissionId
            );
            if (!submissionRes.ok)
              throw new Error("Failed to fetch team submission data");
            submissionData = await submissionRes.json();

            const managerFormApprovalRes = await fetch(
              `/api/managerFormApproval/` + submissionId
            );

            if (!managerFormApprovalRes.ok)
              throw new Error("Failed to fetch manager approval data");
            managerFormApprovalData = await managerFormApprovalRes.json();
          }
        }
        // Approved submission
        else if (
          submissionStatus === "APPROVED" ||
          submissionStatus === "DENIED"
        ) {
          if (submissionApprovingStatus === null) {
            const submissionRes = await fetch(
              `/api/formSubmission/` + submissionId
            );
            if (!submissionRes.ok)
              throw new Error("Failed to fetch submission data");
            submissionData = await submissionRes.json();

            const managerFormApprovalRes = await fetch(
              `/api/managerFormApproval/` + submissionId
            );

            if (!managerFormApprovalRes.ok)
              throw new Error("Failed to fetch manager approval data");
            managerFormApprovalData = await managerFormApprovalRes.json();
            console.log("Manager data:", managerFormApprovalData);
          } else if (submissionApprovingStatus === "true") {
            const submissionRes = await fetch(
              `/api/teamSubmission/` + submissionId
            );
            if (!submissionRes.ok)
              throw new Error("Failed to fetch team submission data");
            submissionData = await submissionRes.json();
          }
        }
        // submission for the manager to see
        else if (
          submissionStatus !== "PENDING" &&
          submissionStatus !== "DRAFT" &&
          submissionApprovingStatus === "true"
        ) {
          const submissionRes = await fetch(
            `/api/teamSubmission/` + submissionId
          );
          if (!submissionRes.ok)
            throw new Error("Failed to fetch team submission data");
          submissionData = await submissionRes.json();

          const managerFormApprovalRes = await fetch(
            `/api/managerFormApproval/` + submissionId
          );
          if (!managerFormApprovalRes.ok)
            throw new Error("Failed to fetch manager approval data");
          managerFormApprovalData = await managerFormApprovalRes.json();
        }

        // Set the fetched data
        if (submissionData) {
          setFormValues(submissionData.data);
          setFormTitle(
            submissionData.title ||
              submissionData.user?.firstName +
                " " +
                submissionData.user?.lastName ||
              ""
          );
          setSignature(submissionData.user?.signature || null);
          setSubmittedForm(submissionData.submittedAt || null);
        }

        if (managerFormApprovalData) {
          setManagerFormApproval(managerFormApprovalData);
          console.log(
            "Fetched manager approval data:",
            managerFormApprovalData
          );
        }
        console.log("Fetched form data:", ManagerFormApproval);
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchForm();
  }, [params.id, submissionId, submissionStatus, submissionApprovingStatus]);

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

  const updateFormValues = (newValues: Record<string, any>) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      ...newValues,
    }));
  };

  if (loading || !formData) {
    return (
      <Bases>
        <Contents>
          <Grids className="grid-rows-8 gap-5">
            <Holds
              background={"white"}
              className="row-span-1 h-full justify-center animate-pulse px-2"
            >
              <TitleBoxes
                title={"loading..."}
                type="noIcon"
                titleImg={""}
                titleImgAlt={""}
              />
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
                    <Holds className="row-start-6 row-end-7 h-full w-full">
                      <Buttons
                        background={"lightGray"}
                        type="submit"
                        className="w-full h-[50px]"
                      ></Buttons>
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

  return (
    <Bases>
      <Contents>
        <Grids rows={"8"} gap={"5"} className="w-full h-full">
          {submissionStatus === "DRAFT" && (
            <FormDraft
              formData={formData}
              handleSubmit={handleSubmit}
              formTitle={formTitle}
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
