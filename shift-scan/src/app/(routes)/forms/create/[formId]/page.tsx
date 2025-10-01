"use client";

import { Bases } from "@/components/(reusable)/bases";
import { Contents } from "@/components/(reusable)/contents";
import { Grids } from "@/components/(reusable)/grids";
import { Holds } from "@/components/(reusable)/holds";
import { TitleBoxes } from "@/components/(reusable)/titleBoxes";
import { Titles } from "@/components/(reusable)/titles";
import { Texts } from "@/components/(reusable)/texts";
import { Inputs } from "@/components/(reusable)/inputs";
import { Buttons } from "@/components/(reusable)/buttons";
import { Labels } from "@/components/(reusable)/labels";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { saveDraft, saveDraftToPending } from "@/actions/hamburgerActions";
import { FormFieldRenderer } from "@/app/(routes)/hamburger/inbox/_components/FormFieldRenderer";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

// Form field type definitions
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

enum FormStatus {
  DRAFT = "DRAFT",
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  DENIED = "DENIED",
}

interface FormCreationPageProps {
  params: Promise<{
    formId: string;
  }>;
}

export default function FormCreationPage({ params }: FormCreationPageProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const formId = use(params).formId;
  const t = useTranslations("Hamburger-Inbox");

  // Form state
  const [formTemplate, setFormTemplate] = useState<FormTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [formTitle, setFormTitle] = useState<string>("");
  const [signature, setSignature] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [draftId, setDraftId] = useState<number | null>(null);
  const [showSignature, setShowSignature] = useState(false);

  useEffect(() => {
    const fetchSignature = async () => {
      try {
        const response = await fetch("/api/getUserSignature");
        const data = await response.json();
        setSignature(data.signature);
      } catch (error) {
        console.error("Error fetching signature:", error);
      }
    };
    fetchSignature();
  }, [signature]);

  // Fetch form template on page load
  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);

      try {
        // Fetch the form template with cache busting
        const formRes = await fetch(`/api/form/${formId}`, {
          cache: "no-store",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (!formRes.ok) {
          throw new Error("Failed to fetch form template");
        }

        const apiData = await formRes.json();
        setFormTemplate(apiData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching form data:", error);
        setLoading(false);
      }
    };

    fetchForm();
  }, [formId]);

  // Update form values - this function will be passed to FormFieldRenderer
  const updateFormValues = (newValues: Record<string, string>) => {
    setFormValues(newValues);
  };

  // Save draft function
  const saveFormDraft = useCallback(async () => {
    if (!formTemplate || !userId) return;

    try {
      // Create draft data to save
      const result = await saveDraft(
        formValues,
        formTemplate.id,
        userId,
        formTemplate.formType,
        draftId || undefined,
        formTitle,
      );

      if (result && !draftId) {
        setDraftId(result.id);
      }
      return result?.id;
    } catch (error) {
      console.error("Error saving draft:", error);
      return null;
    }
  }, [formTemplate, userId, formTitle, formValues, draftId]);

  // Auto-save when values change
  useEffect(() => {
    const autoSaveTimer = setTimeout(() => {
      if (Object.keys(formValues).length > 0 || formTitle) {
        saveFormDraft();
      }
    }, 3000); // Save after 3 seconds of inactivity

    return () => clearTimeout(autoSaveTimer);
  }, [formValues, formTitle, saveFormDraft]);

  // Save draft on navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (Object.keys(formValues).length > 0 || formTitle) {
        saveFormDraft();

        // Standard way to show a confirmation dialog
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [formValues, formTitle, saveFormDraft]);

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formTemplate || !userId) return;

    setSubmitting(true);

    try {
      // Validate form
      const requiredFields: string[] = [];

      formTemplate.groupings.forEach((group) => {
        group.fields.forEach((field) => {
          if (field.required && !formValues[field.name]) {
            requiredFields.push(field.label);
          }
        });
      });

      if (requiredFields.length > 0) {
        alert(
          `Please fill in the following required fields: ${requiredFields.join(", ")}`,
        );
        setSubmitting(false);
        return;
      }

      // Check for signature if required
      if (formTemplate.isSignatureRequired && !signature) {
        alert("Please add your signature to submit this form.");
        setShowSignature(true);
        setSubmitting(false);
        return;
      }

      // Submit using the real API
      const result = await saveDraftToPending(
        formValues,
        formTemplate.id,
        userId,
        formTemplate.formType,
        draftId || undefined,
        formTitle,
      );

      if (result) {
        const response = await fetch("/api/notifications/send-multicast", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: "form-submissions",
            title: "Form Submission",
            message: `${result.User.firstName} ${result.User.lastName} has submitted a form titled "${formTemplate.name}" for approval.`,
            link: `/admins/forms/${result.formTemplateId}`,
            formSubmissionId: result.id,
          }),
        });
        await response.json();
        // Navigate back to forms page
        router.push("/forms");
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render form fields
  const renderFormFields = () => {
    if (!formTemplate) return null;

    return (
      <Holds className="mb-6">
        <FormFieldRenderer
          formData={formTemplate}
          formValues={formValues}
          setFormValues={updateFormValues}
          readOnly={false}
        />
      </Holds>
    );
  };

  return (
    <Bases>
      <Contents width={"section"}>
        <Grids rows={"8"}>
          <Holds
            background={"white"}
            className="h-full w-full row-span-1 relative rounded-b-none"
          >
            <TitleBoxes position={"row"} onClick={() => router.push("/forms")}>
              <Holds
                position={"row"}
                className="w-full justify-center items-center gap-x-2"
              >
                <Titles size={"md"}>
                  {loading
                    ? "Loading..."
                    : formTemplate
                      ? `Form: ${formTemplate.name}`
                      : "Form Not Found"}
                </Titles>
              </Holds>
            </TitleBoxes>
          </Holds>

          <Holds
            background={"white"}
            className="h-full w-full border-t border-gray-100 rounded-t-none row-span-7 overflow-y-auto no-scrollbar"
          >
            {loading ? (
              <Holds className="flex items-center justify-center h-full">
                <Texts size={"md"} className="text-gray-500">
                  Loading form template...
                </Texts>
              </Holds>
            ) : !formTemplate ? (
              <Holds className="flex items-center justify-center h-full">
                <Texts size={"md"} className="text-gray-500">
                  Form template not found
                </Texts>
              </Holds>
            ) : (
              <form onSubmit={handleSubmit} className="p-4">
                {/* Form title */}
                <Holds className="mb-6">
                  <Labels htmlFor="formTitle">
                    Form Title <span className="text-red-500">*</span>
                  </Labels>
                  <Inputs
                    id="formTitle"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Enter a title for this form"
                    required
                    className="w-full"
                  />
                </Holds>

                {/* Dynamic form fields */}
                {renderFormFields()}

                {/* Signature section */}
                {formTemplate.isSignatureRequired && (
                  <Holds className="">
                    <Holds className="bg-gray-50 rounded-lg">
                      {showSignature ? (
                        <div
                          onClick={() => setShowSignature(false)}
                          className="w-full h-full border-[3px] rounded-[10px] border-black cursor-pointer"
                        >
                          {signature && (
                            <img
                              src={signature}
                              alt="signature"
                              className="h-20 w-full object-contain"
                            />
                          )}
                        </div>
                      ) : (
                        <Buttons
                          onClick={() => setShowSignature(true)}
                          type="button"
                          className="shadow-none w-full h-20"
                        >
                          {t("TapToSign")}
                        </Buttons>
                      )}
                    </Holds>
                  </Holds>
                )}

                {/* Form actions */}
                <Holds className="flex flex-row gap-2 justify-between mt-8">
                  <Button
                    size={"lg"}
                    className="w-full bg-gray-200 py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 text-center"
                    onClick={() => router.push("/forms")}
                  >
                    <Texts size={"sm"} className="font-semibold">
                      Cancel
                    </Texts>
                  </Button>

                  <Button
                    size={"lg"}
                    type="submit"
                    disabled={submitting}
                    className=" w-full bg-green-300 py-2 px-4 rounded-lg cursor-pointer hover:opacity-90 text-white text-center disabled:opacity-50"
                  >
                    <Texts size={"sm"} className="font-semibold">
                      {submitting ? "Submitting..." : "Submit Form"}
                    </Texts>
                  </Button>
                </Holds>
              </form>
            )}
          </Holds>
        </Grids>
      </Contents>
    </Bases>
  );
}
