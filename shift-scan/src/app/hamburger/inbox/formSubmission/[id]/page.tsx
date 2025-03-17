"use client";
import { FormEvent, useEffect, useState } from "react";
import Spinner from "@/components/(animations)/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import FormDraft from "./_components/formDraft";
import ManagerFormApproval from "./_components/managerFormApproval";
import SubmittedForms from "./_components/submittedForms";
import ManagerFormEditApproval from "./_components/managerFormEdit";
import { submitForm } from "@/actions/hamburgerActions";
import { useSession } from "next-auth/react";
import { Bases } from "@/components/(reusable)/bases";
import { Buttons } from "@/components/(reusable)/buttons";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";

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
  formSubmissionId: string;
  approvedBy: string;
  approver: {
    firstName: string;
    lastName: string;
  };
  status: FormStatus;
  signature: string;
  comment: string;
};

enum FormStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
  DRAFT = "DRAFT",
}

export default function DynamicForm({ params }: { params: { id: string } }) {
  const formSubmissions = useSearchParams();
  const submissionId = formSubmissions.get("submissionId");
  const submissionStatus = formSubmissions.get("status");
  const submissionApprovingStatus = formSubmissions.get("approvingStatus");
  const [formData, setFormData] = useState<FormTemplate | null>(null);
  const [formTitle, setFormTitle] = useState<string>("");
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [signature, setSignature] = useState<string | null>(null);
  const [submittedForm, setSubmittedForm] = useState<string | null>(null);
  const [managerFormApproval, setManagerFormApproval] =
    useState<ManagerFormApprovalSchema | null>(null);
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

        // If there's no submissionId, stop here
        if (!submissionId) {
          setLoading(false);
          return;
        }

        // Fetch submission data based on submissionStatus and submissionApprovingStatus
        let submissionData, managerFormApprovalData;

        if (submissionStatus === "DRAFT") {
          const draftRes = await fetch(`/api/formDraft/` + submissionId);
          if (!draftRes.ok) throw new Error("Failed to fetch draft data");
          submissionData = await draftRes.json();
        } else if (submissionStatus === "PENDING") {
          if (submissionApprovingStatus === null) {
            const submissionRes = await fetch(
              `/api/formSubmission/` + submissionId
            );
            if (!submissionRes.ok)
              throw new Error("Failed to fetch submission data");
            submissionData = await submissionRes.json();
            console.log("Pending - submission null", submissionApprovingStatus);
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
          console.log("Pending - submission true", submissionApprovingStatus);
        } else if (
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
        }
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
      const result = await submitForm(
        { ...formValues }, // Include the title in the submission
        formData.id,
        userId || "",
        formData.formType,
        formTitle,
        submissionId || undefined
      );

      if (result) {
        router.push("/hamburger/inbox"); // Redirect to a success page
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

  useEffect(() => {
    console.log("formValues:", formValues);
  }, [formValues]);

  useEffect(() => {
    console.log("Manager Form Approval Data:", managerFormApproval);
  }, [managerFormApproval]);

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
            )}
          {submissionApprovingStatus === "true" &&
            submissionStatus === "PENDING" && (
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
            submissionStatus !== "DRAFT" && (
              <ManagerFormEditApproval
                formData={formData}
                formTitle={formTitle}
                formValues={formValues}
                submissionStatus={submissionStatus}
                signature={signature}
                submittedForm={submittedForm}
                submissionId={submissionId}
                managerFormApproval={managerFormApproval}
              />
            )}
        </Grids>
      </Contents>
    </Bases>
  );
}
